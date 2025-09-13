declare global {
  interface Window {
    fbq: any;
  }
}

export const trackPurchase = (purchaseData: {
  value: number;
  currency: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  num_items?: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: purchaseData.value,
      currency: purchaseData.currency,
      content_ids: purchaseData.content_ids,
      content_name: purchaseData.content_name,
      content_type: purchaseData.content_type || 'product',
      num_items: purchaseData.num_items || 1
    });
  } else {
    console.warn('Facebook Pixel not loaded or window not available');
  }
};
