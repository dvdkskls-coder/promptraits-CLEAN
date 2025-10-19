export const STRIPE_CONFIG = {
  // Suscripciones
  subscriptions: {
    pro: {
      priceId: 'price_1SIP64IO8cBGyY9CC4BtGdhN', // 6,99€/mes
      productId: 'prod_TEsrP0YMWyTzuX',
      credits: 60,
      price: 6.99,
      rolloverLimit: 120
    },
    premium: {
      priceId: 'price_1SIP6tIO8cBGyY9CyiW8Qwd0', // 19,99€/mes
      productId: 'prod_TEssLmRFigKLLs',
      credits: 300,
      price: 19.99,
      rolloverLimit: 900
    }
  },

  // Packs one-time
  packs: {
    pack_20: {
      priceId: 'price_1SIP97IO8cBGyY9CLmnYtOwl', // 3,99€
      productId: 'prod_TEsuastboOssnL',
      credits: 20,
      price: 3.99
    },
    pack_50: {
      priceId: 'price_1SIP9TIO8cBGyY9CBW1j64eb', // 8,99€
      productId: 'prod_TEsvSCMngi8xYc',
      credits: 50,
      price: 8.99
    },
    pack_100: {
      priceId: 'price_1SIP9yIO8cBGyY9CrndCyvTO', // 15,99€
      productId: 'prod_TEsvaFMvpcCS5h',
      credits: 100,
      price: 15.99
    }
  }
};

// Helper para obtener precio por plan
export function getPriceId(planId) {
  if (planId.startsWith('pack_')) {
    return STRIPE_CONFIG.packs[planId]?.priceId;
  }
  return STRIPE_CONFIG.subscriptions[planId]?.priceId;
}

// Helper para obtener info del plan
export function getPlanInfo(planId) {
  if (planId.startsWith('pack_')) {
    return STRIPE_CONFIG.packs[planId];
  }
  return STRIPE_CONFIG.subscriptions[planId];
}