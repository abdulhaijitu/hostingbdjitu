import React from 'react';
import { ArrowRight, DollarSign, Users, TrendingUp, Gift } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const Affiliate: React.FC = () => {
  const benefits = [
    { icon: DollarSign, title: 'Up to 50% Commission', desc: 'Earn generous commissions on every referral' },
    { icon: Users, title: 'Lifetime Attribution', desc: 'Get credit for customers you refer forever' },
    { icon: TrendingUp, title: 'Real-time Tracking', desc: 'Monitor your earnings in real-time' },
    { icon: Gift, title: 'Monthly Payouts', desc: 'Reliable monthly payments via PayPal or bank' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <DollarSign className="h-4 w-4" />
            <span>Earn While You Promote</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Affiliate</span> Program
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our affiliate program and earn up to 50% commission on every sale you refer. No limits on earnings!
          </p>
          <Button variant="hero" size="xl">Join Now <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Why Join Our Program?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="feature-card text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/5 text-primary mb-4">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold font-display mb-4">Commission Structure</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
            <div className="p-6 rounded-xl bg-primary-foreground/10">
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-primary-foreground/70">Hosting Plans</div>
            </div>
            <div className="p-6 rounded-xl bg-primary-foreground/10">
              <div className="text-4xl font-bold mb-2">40%</div>
              <div className="text-primary-foreground/70">VPS Plans</div>
            </div>
            <div className="p-6 rounded-xl bg-primary-foreground/10">
              <div className="text-4xl font-bold mb-2">50%</div>
              <div className="text-primary-foreground/70">Dedicated Servers</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Affiliate;
