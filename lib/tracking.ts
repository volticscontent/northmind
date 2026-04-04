// Tracking utilities for Meta, TikTok and UTMify
// Standardizes e-commerce events across the platform

interface Product {
  id: string;
  title: string;
  price: number;
  quantity?: number;
  selectedSize?: string;
}

const GBP_TO_BRL = 7.4;

const getCustomerData = () => {
  if (typeof window === 'undefined') return {};
  const email = localStorage.getItem('nm_customer_email');
  return email ? { email } : {};
};

export const trackViewProduct = (product: Product) => {
  if (typeof window === 'undefined') return;

  const fbq = (window as any).fbq;
  const ttq = (window as any).ttq;
  const utmHelper = (window as any).utmHelper;

  console.group('👀 Tracking: ViewProduct');
  console.log('Product:', product.title, '| Price:', product.price);

  // Meta Pixel
  if (fbq) {
    fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.title,
      content_type: 'product',
      value: Number(product.price.toFixed(2)),
      currency: 'GBP',
    });
  }

  // TikTok Pixel
  if (ttq) {
    ttq.track('ViewContent', {
      contents: [{
        id: product.id,
        name: product.title,
        quantity: 1,
        price: Number(product.price.toFixed(2)),
      }],
      content_type: 'product',
      value: Number(product.price.toFixed(2)),
      currency: 'GBP',
    });
  }

  // UTMify
  if (utmHelper && typeof utmHelper.send === 'function') {
    utmHelper.send('view_item', {
      ...getCustomerData(),
      totalPriceInCents: Math.round(product.price * 100 * GBP_TO_BRL),
      products: [{
        id: product.id,
        name: product.title,
        priceInCents: Math.round(product.price * 100 * GBP_TO_BRL),
        quantity: 1
      }]
    });
    console.log('✅ UTMify Manual Event Sent: view_item (Converted 7.4x)');
  }

  console.groupEnd();
};

export const trackAddToCart = (product: Product, quantity: number = 1) => {
  if (typeof window === 'undefined') return;

  const fbq = (window as any).fbq;
  const ttq = (window as any).ttq;
  const utmHelper = (window as any).utmHelper;

  console.group('🛒 Tracking: AddToCart');
  console.log('Product:', product.title, '| Price:', product.price);

  // Meta Pixel
  if (fbq) {
    fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.title,
      content_type: 'product',
      value: Number((product.price * quantity).toFixed(2)),
      currency: 'GBP',
    });
  }

  // TikTok Pixel
  if (ttq) {
    ttq.track('AddToCart', {
      contents: [{
        id: product.id,
        name: product.title,
        quantity: quantity,
        price: Number(product.price.toFixed(2)),
      }],
      content_type: 'product',
      value: Number((product.price * quantity).toFixed(2)),
      currency: 'GBP',
    });
  }

  // UTMify
  if (utmHelper && typeof utmHelper.send === 'function') {
    utmHelper.send('add_to_cart', {
      ...getCustomerData(),
      totalPriceInCents: Math.round(product.price * quantity * 100 * GBP_TO_BRL),
      products: [{
        id: product.id,
        name: product.title,
        priceInCents: Math.round(product.price * 100 * GBP_TO_BRL),
        quantity: quantity
      }]
    });
    console.log('✅ UTMify Manual Event Sent: add_to_cart (Converted 7.4x)');
  }

  console.groupEnd();
};

export const trackBeginCheckout = (cart: Product[], totalPrice: number) => {
  if (typeof window === 'undefined') return;

  const fbq = (window as any).fbq;
  const ttq = (window as any).ttq;
  const utmHelper = (window as any).utmHelper;

  console.group('💳 Tracking: InitiateCheckout');
  console.log('Total:', totalPrice, '| Items:', cart.length);

  // Meta Pixel
  if (fbq) {
    fbq('track', 'InitiateCheckout', {
      content_ids: cart.map(item => item.id),
      content_type: 'product',
      value: Number(totalPrice.toFixed(2)),
      currency: 'GBP',
      num_items: cart.reduce((acc, item) => acc + (item.quantity ?? 1), 0),
    });
  }

  // TikTok Pixel
  if (ttq) {
    ttq.track('InitiateCheckout', {
      contents: cart.map(item => ({
        id: item.id,
        name: item.title,
        quantity: item.quantity ?? 1,
        price: Number(item.price.toFixed(2)),
      })),
      content_type: 'product',
      value: Number(totalPrice.toFixed(2)),
      currency: 'GBP',
    });
  }

  // UTMify
  if (utmHelper && typeof utmHelper.send === 'function') {
    utmHelper.send('initiate_checkout', {
      ...getCustomerData(),
      totalPriceInCents: Math.round(totalPrice * 100 * GBP_TO_BRL),
      products: cart.map(item => ({
        id: item.id,
        name: item.title,
        priceInCents: Math.round(item.price * 100 * GBP_TO_BRL),
        quantity: item.quantity ?? 1
      }))
    });
    console.log('✅ UTMify Manual Event Sent: initiate_checkout (Converted 7.4x)');
  }

  console.groupEnd();
};

export const trackPurchase = (order: { id: string; amount: number; email?: string }) => {
  if (typeof window === 'undefined') return;

  const fbq = (window as any).fbq;
  const ttq = (window as any).ttq;

  console.group('✨ Tracking: Purchase');
  console.log('Order ID:', order.id, '| Amount:', order.amount);

  // Meta Pixel
  if (fbq) {
    fbq('track', 'Purchase', {
      value: Number(order.amount.toFixed(2)),
      currency: 'GBP',
      order_id: order.id,
      content_type: 'product',
    });
  }

  // TikTok Pixel
  if (ttq) {
    ttq.track('CompletePayment', {
      content_type: 'product',
      value: Number(order.amount.toFixed(2)),
      currency: 'GBP',
      contents: [{
        id: order.id,
        name: 'North Mind Order',
        quantity: 1,
        price: Number(order.amount.toFixed(2))
      }]
    });
  }

  // --- UTMify Manual Fallback (redundant with trackUtmfyPurchase but safe) ---
  const utmHelper = (window as any).utmHelper;
  if (utmHelper && typeof utmHelper.send === 'function') {
    utmHelper.send('purchase', {
      orderId: order.id,
      totalPriceInCents: Math.round(order.amount * 100 * GBP_TO_BRL),
      platform: 'stripe',
      paymentMethod: 'credit_card',
      status: 'paid',
    });
  }

  console.groupEnd();
};

export const trackUtmfyPurchase = (order: { id: string; amountInBRL: number; email?: string }) => {
  if (typeof window === 'undefined') return;

  const utmHelper = (window as any).utmHelper;

  console.group('📊 Tracking: UTMify Purchase (Manual)');
  console.log('Order ID:', order.id, '| Amount BRL:', order.amountInBRL);

  if (utmHelper && typeof utmHelper.send === 'function') {
    utmHelper.send('purchase', {
      orderId: order.id,
      totalPriceInCents: Math.round(order.amountInBRL * 100),
      platform: 'stripe',
      paymentMethod: 'credit_card',
      status: 'paid',
    });
    console.log('✅ UTMify Manual Event Sent (Converted 7.4x)');
  }

  console.groupEnd();
};
