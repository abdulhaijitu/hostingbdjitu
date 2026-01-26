import React from 'react';
import { Users, Award, Globe, Headphones } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const About: React.FC = () => {
  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Customers' },
    { icon: Globe, value: '50+', label: 'Countries Served' },
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: Headphones, value: '24/7', label: 'Support Available' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            About <span className="text-gradient-primary">CHost</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner for reliable, secure, and lightning-fast web hosting solutions since 2016.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-display mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                CHost was founded in 2016 with a simple mission: to provide reliable, affordable, and secure web hosting services to businesses of all sizes in Bangladesh and beyond.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as a small team of passionate technologists has grown into a leading hosting provider serving thousands of customers across more than 50 countries.
              </p>
              <p className="text-muted-foreground">
                Our commitment to excellence, 24/7 customer support, and cutting-edge technology has made us the trusted choice for businesses looking for a reliable hosting partner.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="feature-card text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 text-primary mb-3">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold font-display text-foreground mb-1">{stat.value}</div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold font-display mb-6">Our Mission</h2>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            To empower businesses with reliable, secure, and fast hosting solutions while providing exceptional customer support at every step of their journey.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default About;
