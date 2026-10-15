import 'server-only';
import Stripe from 'stripe';

export class StripeConfigurationError extends Error {
  constructor() {
    super(
      'Stripe Checkout requires a test-mode STRIPE_SECRET_KEY configured on the server.',
    );
    this.name = 'StripeConfigurationError';
  }
}

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !secretKey.startsWith('sk_test_')) {
    throw new StripeConfigurationError();
  }
  return new Stripe(secretKey);
}
