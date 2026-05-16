export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = "free" | "pro" | "premium" | "enterprise";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodInfo;
  stripePaymentIntentId: string;
  description: string;
  receiptUrl: string | null;
  createdAt: string;
}

export type PaymentStatus =
  | "succeeded"
  | "pending"
  | "failed"
  | "canceled"
  | "refunded"
  | "partially_refunded";

export interface PaymentMethodInfo {
  type: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  number: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  tax: number;
  total: number;
  subtotal: number;
  amountPaid: number;
  amountDue: number;
  periodStart: string;
  periodEnd: string;
  dueDate: string | null;
  paidAt: string | null;
  hostedInvoiceUrl: string | null;
  pdfUrl: string | null;
  lineItems: InvoiceLineItem[];
  createdAt: string;
}

export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "void"
  | "uncollectible";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  slug: SubscriptionPlan;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: PlanFeature[];
  limits: PlanLimits;
  isPopular: boolean;
  isCurrent: boolean;
}

export interface PlanFeature {
  name: string;
  description: string;
  included: boolean;
  limit: string | null;
}

export interface PlanLimits {
  maxResumes: number;
  maxCoverLetters: number;
  maxTemplates: number;
  maxDownloadsPerMonth: number;
  aiCreditsPerMonth: number;
  customDomain: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  teamMembers: number;
}
