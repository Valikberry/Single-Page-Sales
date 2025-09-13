import { NextRequest, NextResponse } from 'next/server';

interface ConvertCurrencyRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

interface FlutterwaveRateResponse {
  status: string;
  message?: string;
  data: {
    rate: number;
    source: {
      amount: string | number;
    };
    destination: {
      amount: string | number;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ConvertCurrencyRequest = await request.json();
    const { amount, fromCurrency, toCurrency } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid amount'
      }, { status: 400 });
    }

    if (!fromCurrency || !toCurrency) {
      return NextResponse.json({
        success: false,
        error: 'Missing currency codes'
      }, { status: 400 });
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({
        success: false,
        error: 'Payment system configuration error'
      }, { status: 500 });
    }

    const response = await fetch(
      `https://api.flutterwave.com/v3/transfers/rates?amount=${amount}&destination_currency=${toCurrency}&source_currency=${fromCurrency}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Flutterwave API error:', response.status, response.statusText);
      return NextResponse.json({
        success: false,
        error: `Flutterwave API error: ${response.status}`
      }, { status: response.status });
    }

    const data: FlutterwaveRateResponse = await response.json();

    // Add debugging to see what Flutterwave actually returns
    console.log('🔍 Flutterwave raw response:', JSON.stringify(data, null, 2));

    if (data.status !== 'success') {
      console.error('❌ Flutterwave conversion failed:', data.message);
      return NextResponse.json({
        success: false,
        error: data.message || 'Currency conversion failed'
      }, { status: 400 });
    }

    // Try multiple approaches to get the converted amount
    let convertedAmount: number;
    
    // Approach 1: Use destination amount from API
    if (data.data.destination && data.data.destination.amount) {
      convertedAmount = Number(data.data.destination.amount);
    } 
    // Approach 2: Calculate manually using the rate
    else if (data.data.rate) {
      convertedAmount = amount * data.data.rate;
    } 
    // Approach 3: Fallback error
    else {
      console.error('❌ No valid conversion data found:', data);
      return NextResponse.json({
        success: false,
        error: 'Invalid conversion data received from Flutterwave'
      }, { status: 500 });
    }

    const exchangeRate = data.data.rate;

    // Additional validation: converted amount should be significantly different for different currencies
    if (fromCurrency !== toCurrency && Math.abs(convertedAmount - amount) < 0.01) {
      console.warn('⚠️  Suspicious conversion - amounts are too similar:', {
        original: amount,
        converted: convertedAmount,
        rate: exchangeRate
      });
      
      // Force manual calculation as fallback
      convertedAmount = amount * exchangeRate;
    }

    return NextResponse.json({
      success: true,
      data: {
        originalAmount: amount,
        convertedAmount: Number(convertedAmount.toFixed(2)), // Round to 2 decimal places
        exchangeRate,
        fromCurrency,
        toCurrency,
        source: 'flutterwave'
      }
    });

  } catch (error) {
    console.error('❌ Currency conversion error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}