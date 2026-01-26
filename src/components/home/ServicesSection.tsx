import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Cloud, HardDrive, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  href: string;
  price: string;
}

const ServicesSection: React.FC = () => {
  const services: ServiceCard[] = [
    {
      icon: Server,
      title: 'Cloud VPS',
      description: 'High-performance virtual private servers with full root access',
      features: ['NVMe SSD Storage', 'Dedicated Resources', 'Full Root Access', 'Global Locations'],
      href: '/vps/cloud',
      price: 'From $9.99/mo',
    },
    {
      icon: HardDrive,
      title: 'Dedicated Servers',
      description: 'Powerful bare-metal servers for enterprise workloads',
      features: ['Intel Xeon CPUs', 'Enterprise SSDs', 'DDoS Protection', '24/7 Monitoring'],
      href: '/servers/dedicated',
      price: 'From $99.99/mo',
    },
    {
      icon: Cloud,
      title: 'WordPress Hosting',
      description: 'Optimized hosting built specifically for WordPress',
      features: ['1-Click Install', 'Auto Updates', 'Free Staging', 'LiteSpeed Cache'],
      href: '/hosting/wordpress',
      price: 'From $4.99/mo',
    },
    {
      icon: Cpu,
      title: 'Reseller Hosting',
      description: 'Start your own hosting business with white-label solutions',
      features: ['WHM Access', 'Private DNS', 'Client Management', 'Free Migration'],
      href: '/hosting/reseller',
      price: 'From $19.99/mo',
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            Enterprise-Grade Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From VPS to dedicated servers, we have the infrastructure to power your most demanding applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="card-hover p-6 lg:p-8"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-primary/5 text-primary">
                  <service.icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold font-display">{service.title}</h3>
                    <span className="text-accent font-semibold text-sm">{service.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-primary hover:text-accent">
                    <Link to={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
