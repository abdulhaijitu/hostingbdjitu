import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const DomainPricing: React.FC = () => {
  const domains = [
    { ext: '.com', register: '$12.99', renew: '$14.99', transfer: '$12.99' },
    { ext: '.net', register: '$14.99', renew: '$16.99', transfer: '$14.99' },
    { ext: '.org', register: '$13.99', renew: '$15.99', transfer: '$13.99' },
    { ext: '.io', register: '$39.99', renew: '$44.99', transfer: '$39.99' },
    { ext: '.co', register: '$29.99', renew: '$34.99', transfer: '$29.99' },
    { ext: '.xyz', register: '$2.99', renew: '$12.99', transfer: '$9.99' },
    { ext: '.online', register: '$4.99', renew: '$29.99', transfer: '$24.99' },
    { ext: '.com.bd', register: '৳999', renew: '৳1199', transfer: '৳999' },
    { ext: '.net.bd', register: '৳999', renew: '৳1199', transfer: '৳999' },
    { ext: '.org.bd', register: '৳999', renew: '৳1199', transfer: '৳999' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Domain</span> Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Transparent pricing for all domain extensions. Register, renew, or transfer with confidence.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-semibold">Extension</th>
                  <th className="text-center p-4 font-semibold">Register</th>
                  <th className="text-center p-4 font-semibold">Renew</th>
                  <th className="text-center p-4 font-semibold">Transfer</th>
                  <th className="text-center p-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {domains.map((domain, idx) => (
                  <tr key={domain.ext} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="p-4 font-semibold text-primary">{domain.ext}</td>
                    <td className="p-4 text-center">{domain.register}/yr</td>
                    <td className="p-4 text-center">{domain.renew}/yr</td>
                    <td className="p-4 text-center">{domain.transfer}</td>
                    <td className="p-4 text-center">
                      <Button variant="hero" size="sm" asChild>
                        <Link to="/domain/register">Register</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomainPricing;
