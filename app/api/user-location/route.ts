// app/api/user-location/route.ts
import { NextRequest, NextResponse } from 'next/server';

// African countries mapping
const AFRICAN_COUNTRIES = new Set([
  'NG', 'GH', 'KE', 'ZA', 'EG', 'MA', 'DZ', 'TN', 'LY', 'SD', 'ET', 'UG', 'TZ', 'RW',
  'SN', 'CI', 'ML', 'BF', 'NE', 'SL', 'LR', 'GM', 'GW', 'CV', 'ST', 'GQ', 'GA', 'CG',
  'CD', 'CF', 'TD', 'CM', 'AO', 'ZM', 'MW', 'MZ', 'MG', 'MU', 'SC', 'KM', 'DJ', 'SO',
  'ER', 'SS', 'BW', 'LS', 'SZ', 'NA', 'ZW'
]);

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown';
    if (clientIP && clientIP !== 'unknown' && !isPrivateIP(clientIP)) {
      try {
        console.log('📡 Trying IP geolocation API for:', clientIP);
        
        const geoResponse = await fetch(`https://ipapi.co/${clientIP}/json/`, {
          signal: AbortSignal.timeout(5000) 
        });
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          
          if (!geoData.error && geoData.country_code) {
            console.log('✅ Country detected from IP API:', geoData.country_code);
            
            return NextResponse.json({
              success: true,
              countryCode: geoData.country_code,
              country: geoData.country_name,
              currency: geoData.currency || getCurrency(geoData.country_code),
              source: 'ipapi.co',
              isAfrican: AFRICAN_COUNTRIES.has(geoData.country_code),
              timezone: geoData.timezone,
              city: geoData.city,
              region: geoData.region,
              ip: clientIP
            });
          } else {
            console.warn('⚠️ IP API returned error:', geoData.error || 'No country code');
          }
        } else {
          console.warn('⚠️ IP API request failed:', geoResponse.status);
        }
      } catch (apiError) {
        console.warn('⚠️ IP API timeout or error:', apiError);
      }
    }
    return NextResponse.json({
      success: true,
      countryCode: 'NG',
      country: 'Nigeria',
      currency: 'NGN',
      source: 'default-fallback',
      isAfrican: true,
      timezone: 'Africa/Lagos',
      ip: clientIP,
      message: 'Using default location'
    });
    
  } catch (error) {
    console.error('❌ Location detection error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to detect location',
      fallback: {
        countryCode: 'NG',
        country: 'Nigeria', 
        currency: 'NGN',
        source: 'error-fallback',
        isAfrican: true
      }
    }, { status: 500 });
  }
}
function getCurrency(countryCode: string): string {
  // Only Nigeria gets NGN, all others get USD
  if (countryCode.toUpperCase() === 'NG') {
    return 'NGN';
  }
  
  return 'USD';
}

function isPrivateIP(ip: string): boolean {
  return (
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('127.') ||
    ip === 'localhost' ||
    ip === '::1'
  );
}