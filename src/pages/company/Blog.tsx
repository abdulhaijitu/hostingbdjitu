import React from 'react';
import Layout from '@/components/layout/Layout';

const Blog: React.FC = () => {
  const posts = [
    { title: 'How to Choose the Right Hosting Plan', date: 'Jan 15, 2026', excerpt: 'A comprehensive guide to selecting the perfect hosting solution for your website.' },
    { title: '10 Tips to Speed Up Your Website', date: 'Jan 10, 2026', excerpt: 'Learn proven techniques to improve your website loading speed.' },
    { title: 'Understanding SSL Certificates', date: 'Jan 5, 2026', excerpt: 'Everything you need to know about SSL and website security.' },
  ];
  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-6"><span className="text-gradient-primary">Blog</span></h1>
          <p className="text-lg text-muted-foreground">Tips, tutorials, and insights from our team</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.title} className="card-hover p-6">
                <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold font-display mb-3">{post.title}</h3>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Blog;
