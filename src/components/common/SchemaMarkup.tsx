import React from 'react';
import { Helmet } from 'react-helmet-async';

// Organization Schema
export const OrganizationSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CHost",
    "alternateName": "CHostBD",
    "url": "https://chostbd.com",
    "logo": "https://chostbd.com/favicon.png",
    "description": "Bangladesh's trusted domain and web hosting provider offering secure, fast, and reliable hosting solutions.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "House#71, Road#27, Gulshan-01",
      "addressLocality": "Dhaka",
      "addressCountry": "BD"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+8801833876434",
        "contactType": "customer service",
        "email": "support@chostbd.com",
        "availableLanguage": ["English", "Bengali"]
      }
    ],
    "sameAs": [
      "https://facebook.com/chostbd",
      "https://twitter.com/chostbd"
    ],
    "foundingDate": "2016",
    "slogan": "Secure.Fast.Online"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// WebSite Schema with Search Action
export const WebSiteSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CHost",
    "url": "https://chostbd.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://chostbd.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://chostbd.com${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Product/Service Schema
interface ProductSchemaProps {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  image?: string;
  url: string;
  category?: string;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  price,
  priceCurrency = "BDT",
  image,
  url,
  category = "Web Hosting"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image || "https://chostbd.com/og-image.png",
    "url": `https://chostbd.com${url}`,
    "category": category,
    "brand": {
      "@type": "Brand",
      "name": "CHost"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "CHost"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Local Business Schema
export const LocalBusinessSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CHost",
    "image": "https://chostbd.com/og-image.png",
    "url": "https://chostbd.com",
    "telephone": "+8801833876434",
    "email": "support@chostbd.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "House#71, Road#27, Gulshan-01",
      "addressLocality": "Dhaka",
      "addressCountry": "BD"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "৳৳",
    "paymentAccepted": ["Cash", "Credit Card", "Mobile Banking", "Bank Transfer"]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Service Schema
interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  provider?: string;
  areaServed?: string;
}

export const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  name,
  description,
  serviceType,
  provider = "CHost",
  areaServed = "Bangladesh"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "serviceType": serviceType,
    "provider": {
      "@type": "Organization",
      "name": provider
    },
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
