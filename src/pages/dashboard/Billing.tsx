import { useState } from 'react';
import { useCurrentSubscription } from '@/hooks/useSubscription';
import { useOrg } from '@/contexts/OrgContext';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UsageDashboard } from '@/components/Subscription/UsageDashboard';
import { UpgradeBanner } from '@/components/Subscription/UpgradeBanner';

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: {
    category: string;
    items: {
      name: string;
      included: boolean;
      limit?: string | number;
    }[];
  }[];
}

const PLANS: Plan[] = [
  {
    name: 'FREE',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for getting started',
    features: [
      {
        category: 'Emails',
        items: [
          { name: 'Emails per month', included: true, limit: '1,000' },
          { name: 'SMS per month', included: false },
          { name: 'Scheduled sending', included: false },
        ],
      },
      {
        category: 'Contacts & Data',
        items: [
          { name: 'Total contacts', included: true, limit: '500' },
          { name: 'Data retention', included: true, limit: '30 days' },
          { name: 'Bulk import', included: false },
        ],
      },
      {
        category: 'Templates & Apps',
        items: [
          { name: 'Email templates', included: true, limit: '5' },
          { name: 'Apps', included: true, limit: '1' },
          { name: 'Template marketplace', included: false },
        ],
      },
      {
        category: 'Developer',
        items: [
          { name: 'API keys', included: true, limit: '1' },
          { name: 'API calls/month', included: true, limit: '10,000' },
          { name: 'Webhooks', included: false },
        ],
      },
      {
        category: 'Team & Support',
        items: [
          { name: 'Team members', included: true, limit: '1' },
          { name: 'Custom domain', included: false },
          { name: 'Advanced analytics', included: false },
          { name: 'Priority support', included: false },
        ],
      },
    ],
  },
  {
    name: 'PRO',
    monthlyPrice: 29.99,
    yearlyPrice: 299.9,
    description: 'For growing teams',
    features: [
      {
        category: 'Emails',
        items: [
          { name: 'Emails per month', included: true, limit: '100,000' },
          { name: 'SMS per month', included: true, limit: '10,000' },
          { name: 'Scheduled sending', included: true },
        ],
      },
      {
        category: 'Contacts & Data',
        items: [
          { name: 'Total contacts', included: true, limit: '100,000' },
          { name: 'Data retention', included: true, limit: '90 days' },
          { name: 'Bulk import', included: true },
        ],
      },
      {
        category: 'Templates & Apps',
        items: [
          { name: 'Email templates', included: true, limit: 'Unlimited' },
          { name: 'Apps', included: true, limit: '10' },
          { name: 'Template marketplace', included: true },
        ],
      },
      {
        category: 'Developer',
        items: [
          { name: 'API keys', included: true, limit: '10' },
          { name: 'API calls/month', included: true, limit: '1,000,000' },
          { name: 'Webhooks', included: true, limit: '10' },
        ],
      },
      {
        category: 'Team & Support',
        items: [
          { name: 'Team members', included: true, limit: '5' },
          { name: 'Custom domain', included: true },
          { name: 'Advanced analytics', included: true },
          { name: 'Priority support', included: true },
        ],
      },
    ],
  },
  {
    name: 'ENTERPRISE',
    monthlyPrice: 99.99,
    yearlyPrice: 999.9,
    description: 'For large scale operations',
    features: [
      {
        category: 'Emails',
        items: [
          { name: 'Emails per month', included: true, limit: 'Unlimited' },
          { name: 'SMS per month', included: true, limit: 'Unlimited' },
          { name: 'Scheduled sending', included: true },
        ],
      },
      {
        category: 'Contacts & Data',
        items: [
          { name: 'Total contacts', included: true, limit: 'Unlimited' },
          { name: 'Data retention', included: true, limit: '1 year' },
          { name: 'Bulk import', included: true },
        ],
      },
      {
        category: 'Templates & Apps',
        items: [
          { name: 'Email templates', included: true, limit: 'Unlimited' },
          { name: 'Apps', included: true, limit: 'Unlimited' },
          { name: 'Template marketplace', included: true },
        ],
      },
      {
        category: 'Developer',
        items: [
          { name: 'API keys', included: true, limit: 'Unlimited' },
          { name: 'API calls/month', included: true, limit: 'Unlimited' },
          { name: 'Webhooks', included: true, limit: 'Unlimited' },
        ],
      },
      {
        category: 'Team & Support',
        items: [
          { name: 'Team members', included: true, limit: 'Unlimited' },
          { name: 'Custom domain', included: true },
          { name: 'Advanced analytics', included: true },
          { name: '24/7 Priority support', included: true },
        ],
      },
    ],
  },
];

function PlanCard({ plan, isCurrentPlan }: { plan: Plan; isCurrentPlan: boolean }) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const billingPeriod = billingCycle === 'monthly' ? '/month' : '/year';
  const savings = billingCycle === 'yearly' ? Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100) : 0;

  const isPro = plan.name === 'PRO';
  const isEnterprise = plan.name === 'ENTERPRISE';

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isPro
          ? 'ring-2 ring-primary border-primary/50 shadow-lg'
          : 'border-border/60 hover:border-border'
      } ${isCurrentPlan ? 'bg-content/5' : ''}`}
    >
      {isPro && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      )}

      {isCurrentPlan && (
        <div className="absolute top-4 right-4 inline-block px-3 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">
          Current Plan
        </div>
      )}

      {isPro && (
        <div className="absolute -top-1 -right-1 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      )}

      <CardHeader className="relative pb-4">
        <div className="space-y-2">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <p className="text-sm text-content-secondary">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="space-y-2 mt-6">
          {plan.monthlyPrice === 0 ? (
            <div>
              <p className="text-3xl font-bold text-content">Free</p>
              <p className="text-xs text-content-secondary">Forever free plan</p>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-content">${price.toFixed(2)}</span>
                <span className="text-sm text-content-secondary">{billingPeriod}</span>
              </div>
              {savings > 0 && (
                <div className="inline-block px-2 py-1 rounded-full bg-success/15 text-success text-xs font-medium">
                  Save {savings}% annually
                </div>
              )}
            </>
          )}
        </div>

        {/* Billing Toggle */}
        {plan.monthlyPrice > 0 && (
          <div className="flex gap-2 mt-4 p-1 bg-content/5 rounded-lg w-fit">
            {(['monthly', 'yearly'] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  billingCycle === cycle
                    ? 'bg-primary text-primary-foreground'
                    : 'text-content-secondary hover:text-content'
                }`}
              >
                {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <Button
          className={`w-full mt-6 ${
            isCurrentPlan
              ? 'bg-success/20 text-success hover:bg-success/30'
              : isPro
                ? 'bg-primary hover:bg-primary/90'
                : 'bg-secondary hover:bg-secondary/90'
          }`}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? '✓ Current Plan' : 'Select Plan'}
        </Button>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Features by Category */}
        {plan.features.map((category) => (
          <div key={category.category} className="space-y-3">
            <h4 className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
              {category.category}
            </h4>
            <div className="space-y-2">
              {category.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-content-secondary">{item.name}</span>
                  <div className="flex items-center gap-2">
                    {item.limit && (
                      <span className="text-xs font-medium text-primary">{item.limit}</span>
                    )}
                    {item.included ? (
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-content/40 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Billing() {
  const { currentOrg } = useOrg();
  const { getAccountIdForOrg } = useUser();
  const accountId = currentOrg ? getAccountIdForOrg(currentOrg.id) : undefined;
  const { data: subscription, isLoading } = useCurrentSubscription(accountId ?? undefined);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-content">Billing & Plans</h1>
        <p className="text-content-secondary mt-2">
          Manage your subscription and view your usage limits
        </p>
      </div>

      {/* Upgrade Banner */}
      <UpgradeBanner />

      {/* Usage Dashboard */}
      <div>
        <h2 className="text-xl font-semibold text-content mb-4">Current Usage</h2>
        <UsageDashboard />
      </div>

      {/* Plans Section */}
      <div>
        <h2 className="text-xl font-semibold text-content mb-4">Choose Your Plan</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border/60">
                <CardHeader>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                isCurrentPlan={subscription?.plan === plan.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <Card className="border-border/60 bg-content/3">
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="billing" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="limits">Limits</TabsTrigger>
              <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
            </TabsList>

            <TabsContent value="billing" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-content">When will I be charged?</h4>
                <p className="text-sm text-content-secondary">
                  You'll be charged at the beginning of each billing cycle. For monthly plans, this is every 30 days. For yearly plans, every 365 days.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-content">Can I change my plan?</h4>
                <p className="text-sm text-content-secondary">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-content">What happens when I reach my limit?</h4>
                <p className="text-sm text-content-secondary">
                  When you reach your usage limit, you won't be able to perform that action until the limit resets or you upgrade your plan.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-content">When do limits reset?</h4>
                <p className="text-sm text-content-secondary">
                  Monthly limits reset on the 1st of each month. Yearly limits reset annually. Some limits (like contacts) don't reset.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upgrade" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-content">Will I lose data if I downgrade?</h4>
                <p className="text-sm text-content-secondary">
                  No, downgrading won't delete your data. However, you may not be able to create new resources if you exceed the plan limits.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-content">Do you offer custom plans?</h4>
                <p className="text-sm text-content-secondary">
                  Yes! Contact our sales team for custom enterprise pricing and features.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
        <Zap className="h-5 w-5 text-primary flex-shrink-0" />
        <p className="text-sm text-primary">
          💡 Tip: The PRO plan offers the best value for most teams. Upgrade to unlock advanced features and higher limits.
        </p>
      </div>
    </div>
  );
}
