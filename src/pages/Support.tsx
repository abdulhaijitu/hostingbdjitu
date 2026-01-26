import React from 'react';
import { ArrowRight, Headphones, MessageCircle, FileText, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Support: React.FC = () => {
  const supportOptions = [
    { icon: Headphones, title: 'Live Chat', desc: 'Chat with our support team in real-time', available: '24/7' },
    { icon: MessageCircle, title: 'Ticket Support', desc: 'Submit a support ticket for complex issues', available: '24/7' },
    { icon: FileText, title: 'Knowledge Base', desc: 'Browse our extensive documentation', available: 'Self-service' },
  ];

  const faqs = [
    { q: 'How do I get started with hosting?', a: 'Simply choose a hosting plan, complete the checkout, and you\'ll receive login details to your cPanel within minutes.' },
    { q: 'Do you offer free migration?', a: 'Yes! We offer free website migration for all hosting plans. Our team will handle the entire process.' },
    { q: 'What is your uptime guarantee?', a: 'We guarantee 99.99% uptime for all our hosting services, backed by our SLA.' },
    { q: 'How do I upgrade my plan?', a: 'You can upgrade your plan anytime from your client area. The upgrade is instant and prorated.' },
    { q: 'What payment methods do you accept?', a: 'We accept credit cards, PayPal, bKash, Nagad, and bank transfer.' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Clock className="h-4 w-4" />
            <span>24/7 Available</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Support</span> Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Our expert support team is here to help you 24/7. Get the assistance you need, when you need it.
          </p>
          <Button variant="hero" size="xl">Open Ticket <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-6">
            {supportOptions.map((option) => (
              <div key={option.title} className="card-hover p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/5 text-primary mb-4">
                  <option.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{option.desc}</p>
                <span className="badge-success">{option.available}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
