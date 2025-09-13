interface CountryCurrencyResult {
  success: boolean;
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
  source: string;
  isAfrican: boolean;
  useLocalCurrency: boolean; 
  timezone?: string;
  error?: string;
}


const AFRICAN_COUNTRIES: Record<
  string,
  {
    name: string;
    currency: string;
    symbol: string;
    flag: string;
    useLocalCurrency: boolean; 
  }
> = {
  // West Africa
  NG: {
    name: "Nigeria",
    currency: "NGN",
    symbol: "₦",
    flag: "🇳🇬",
    useLocalCurrency: true,
  },
  GH: {
    name: "Ghana",
    currency: "GHS",
    symbol: "₵",
    flag: "🇬🇭",
    useLocalCurrency: true,
  },
  SN: {
    name: "Senegal",
    currency: "XOF",
    symbol: "CFA",
    flag: "🇸🇳",
    useLocalCurrency: false,
  },
  CI: {
    name: "Ivory Coast",
    currency: "XOF",
    symbol: "CFA",
    flag: "🇨🇮",
    useLocalCurrency: false,
  },
  ML: {
    name: "Mali",
    currency: "XOF",
    symbol: "CFA",
    flag: "🇲🇱",
    useLocalCurrency: false,
  },
  BF: {
    name: "Burkina Faso",
    currency: "XOF",
    symbol: "CFA",
    flag: "🇧🇫",
    useLocalCurrency: false,
  },
  NE: {
    name: "Niger",
    currency: "XOF",
    symbol: "CFA",
    flag: "🇳🇪",
    useLocalCurrency: false,
  },
  SL: {
    name: "Sierra Leone",
    currency: "SLL",
    symbol: "Le",
    flag: "🇸🇱",
    useLocalCurrency: false,
  },
  LR: {
    name: "Liberia",
    currency: "LRD",
    symbol: "L$",
    flag: "🇱🇷",
    useLocalCurrency: false,
  },

  // East Africa
  KE: {
    name: "Kenya",
    currency: "KES",
    symbol: "KSh",
    flag: "🇰🇪",
    useLocalCurrency: false,
  },
  TZ: {
    name: "Tanzania",
    currency: "TZS",
    symbol: "TSh",
    flag: "🇹🇿",
    useLocalCurrency: false,
  },
  UG: {
    name: "Uganda",
    currency: "UGX",
    symbol: "USh",
    flag: "🇺🇬",
    useLocalCurrency: false,
  },
  RW: {
    name: "Rwanda",
    currency: "RWF",
    symbol: "RF",
    flag: "🇷🇼",
    useLocalCurrency: false,
  },
  ET: {
    name: "Ethiopia",
    currency: "ETB",
    symbol: "Br",
    flag: "🇪🇹",
    useLocalCurrency: false,
  },


  EG: {
    name: "Egypt",
    currency: "EGP",
    symbol: "E£",
    flag: "🇪🇬",
    useLocalCurrency: false,
  },
  MA: {
    name: "Morocco",
    currency: "MAD",
    symbol: "د.م.",
    flag: "🇲🇦",
    useLocalCurrency: false,
  },
  DZ: {
    name: "Algeria",
    currency: "DZD",
    symbol: "د.ج",
    flag: "🇩🇿",
    useLocalCurrency: false,
  },
  TN: {
    name: "Tunisia",
    currency: "TND",
    symbol: "د.ت",
    flag: "🇹🇳",
    useLocalCurrency: false,
  },
  LY: {
    name: "Libya",
    currency: "LYD",
    symbol: "ل.د",
    flag: "🇱🇾",
    useLocalCurrency: false,
  },

  // Southern Africa
  ZA: {
    name: "South Africa",
    currency: "ZAR",
    symbol: "R",
    flag: "🇿🇦",
    useLocalCurrency: false,
  },
  BW: {
    name: "Botswana",
    currency: "BWP",
    symbol: "P",
    flag: "🇧🇼",
    useLocalCurrency: false,
  },
  ZW: {
    name: "Zimbabwe",
    currency: "ZWL",
    symbol: "Z$",
    flag: "🇿🇼",
    useLocalCurrency: false,
  },
  ZM: {
    name: "Zambia",
    currency: "ZMW",
    symbol: "ZK",
    flag: "🇿🇲",
    useLocalCurrency: false,
  },

  // Central Africa
  CM: {
    name: "Cameroon",
    currency: "XAF",
    symbol: "CFA",
    flag: "🇨🇲",
    useLocalCurrency: false,
  },
  CD: {
    name: "DR Congo",
    currency: "CDF",
    symbol: "FC",
    flag: "🇨🇩",
    useLocalCurrency: false,
  },
  AO: {
    name: "Angola",
    currency: "AOA",
    symbol: "Kz",
    flag: "🇦🇴",
    useLocalCurrency: false,
  },
};

export async function detectFromIPAPI(): Promise<CountryCurrencyResult> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`IP API failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.reason || "IP geolocation failed");
    }

    if (data.country_code) {
      return formatResult(data.country_code, data?.country_name, "ipapi.co", {
        timezone: data.timezone,
      });
    }

    throw new Error("No country code in response");
  } catch (error) {
    throw new Error(`IP API failed: ${error}`);
  }
}

function formatResult(
  countryCode: string,
  country_name: string,
  source: string,
  additionalData?: { timezone?: string }
): CountryCurrencyResult {
  const upperCountryCode = countryCode.toUpperCase();
  const africanCountry = AFRICAN_COUNTRIES[upperCountryCode];

  if (africanCountry) {
    const currency = africanCountry.useLocalCurrency
      ? africanCountry.currency
      : "USD";
    const symbol = africanCountry.useLocalCurrency
      ? africanCountry.symbol
      : "$";

    return {
      success: true,
      country: country_name,
      countryCode: upperCountryCode,
      currency,
      currencySymbol: symbol,
      source,
      isAfrican: true,
      useLocalCurrency: africanCountry.useLocalCurrency,
      timezone: additionalData?.timezone,
    };
  } else {
    // Non-African country - use USD
    return {
      success: true,
      country: country_name,
      countryCode: upperCountryCode,
      currency: "USD",
      currencySymbol: "$",
      source,
      isAfrican: false,
      useLocalCurrency: false,
      timezone: additionalData?.timezone,
    };
  }
}
