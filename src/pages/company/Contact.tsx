import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-6">Contact <span className="text-gradient-primary">Us</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get in touch with our team. We're here to help!</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold font-display mb-6">Get In Touch</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4"><MapPin className="h-5 w-5 text-accent mt-1" /><div><p className="font-medium">Address</p><p className="text-muted-foreground">House#71, Road#27, Gulshan-01, Dhaka</p></div></div>
                <div className="flex items-start gap-4"><Mail className="h-5 w-5 text-accent mt-1" /><div><p className="font-medium">Email</p><p className="text-muted-foreground">support@chostbd.com</p></div></div>
                <div className="flex items-start gap-4"><Phone className="h-5 w-5 text-accent mt-1" /><div><p className="font-medium">Phone</p><p className="text-muted-foreground">+880 1234-567890</p></div></div>
              </div>
            </div>
            <div className="card-hover p-8">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full p-3 rounded-lg border border-border bg-background" />
                <input type="email" placeholder="Your Email" className="w-full p-3 rounded-lg border border-border bg-background" />
                <textarea placeholder="Your Message" rows={4} className="w-full p-3 rounded-lg border border-border bg-background" />
                <Button variant="hero" size="lg" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Contact;
