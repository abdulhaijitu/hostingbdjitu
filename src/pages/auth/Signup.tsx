import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const Signup: React.FC = () => (
  <Layout>
    <section className="section-padding">
      <div className="container-wide">
        <div className="max-w-md mx-auto card-hover p-8">
          <h1 className="text-2xl font-bold font-display text-center mb-6">Create Your Account</h1>
          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-3 rounded-lg border border-border bg-background" />
            <input type="email" placeholder="Email Address" className="w-full p-3 rounded-lg border border-border bg-background" />
            <input type="password" placeholder="Password" className="w-full p-3 rounded-lg border border-border bg-background" />
            <input type="password" placeholder="Confirm Password" className="w-full p-3 rounded-lg border border-border bg-background" />
            <Button variant="hero" size="lg" className="w-full">Sign Up</Button>
          </form>
          <p className="text-center mt-6 text-muted-foreground">Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link></p>
        </div>
      </div>
    </section>
  </Layout>
);
export default Signup;
