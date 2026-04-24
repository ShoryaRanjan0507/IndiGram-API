export interface Plan {
  name: string;
  limit: number;
  price: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, Plan> = {
  FREE: {
    name: 'Free',
    limit: 10,
    price: 0,
    features: ['10 requests per day', 'Basic support', 'Public dataset access']
  },
  PREMIUM: {
    name: 'Premium',
    limit: 40,
    price: 29,
    features: ['40 requests per day', 'Priority support', 'Detailed village data']
  },
  PRO: {
    name: 'Pro',
    limit: 75,
    price: 79,
    features: ['75 requests per day', 'Dedicated support', 'Bulk data export']
  },
  UNLIMITED: {
    name: 'Unlimited',
    limit: Infinity,
    price: 199,
    features: ['Unlimited requests', '24/7 support', 'API SLA guarantee']
  }
};
