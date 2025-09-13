
import { detectFromIPAPI } from '@/lib/africanCountryDetector';
import { useState, useEffect } from 'react';


interface CountryCurrencyResult {
  success: boolean;
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
  flagEmoji: string;
  source: string;
  isAfrican: boolean;
  useLocalCurrency: boolean;
  timezone?: string;
  error?: string;
}

interface UseAfricanCountryReturn {
  location: CountryCurrencyResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // Convenience properties
  isNigeria: boolean;
  isAfrican: boolean;
  paymentCurrency: 'NGN' | 'USD';
  displayCurrency: string;
  currencySymbol: string;
  flagEmoji: string;
}

/**
 * Main hook for African country detection
 */
export function useAfricanCountry(): UseAfricanCountryReturn {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await detectFromIPAPI();
      
      setLocation(result);
      
      if (!result.success && result.error) {
        setError(result.error);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect country');
      setLocation({
        success: true,
        country: 'Nigeria',
        countryCode: 'NG',
        currency: 'NGN',
        currencySymbol: '₦',
        flagEmoji: '🇳🇬',
        source: 'error-fallback',
        isAfrican: true,
        useLocalCurrency: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const isNigeria = location?.countryCode === 'NG';
  const isAfricanCountry = location?.isAfrican || false;
  const paymentCurrency = "NGN";
  const displayCurrency = location?.currency || 'NGN';
  const currencySymbol = location?.currencySymbol || '₦';
  const flagEmoji = location?.flagEmoji || '🇳🇬';

  return {
    location,
    loading,
    error,
    refetch: fetchLocation,
    isNigeria,
    isAfrican: isAfricanCountry,
    paymentCurrency,
    displayCurrency,
    currencySymbol,
    flagEmoji
  };
}


export function usePaymentCurrency(): {
  currency: 'NGN' | 'USD';
  symbol: string;
  countryCode: string;
  isAfrican: boolean;
  loading: boolean;
} {
  const { paymentCurrency, currencySymbol, location, loading } = useAfricanCountry();

  return {
    currency: paymentCurrency,
    symbol: currencySymbol,
    countryCode: location?.countryCode || 'NG',
    isAfrican: location?.isAfrican || false,
    loading
  };
}

