/**
 * Google Jobs SEO Structured Data (JSON-LD schema.org/JobPosting)
 */

import React, { useEffect } from 'react';
import { Job } from '../types';

interface SEOJobPostingProps {
  job: Job;
}

export const SEOJobPosting: React.FC<SEOJobPostingProps> = ({ job }) => {
  useEffect(() => {
    // Generate valid Schema.org/JobPosting JSON-LD
    const schemaData = {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      title: job.title,
      description: job.description,
      identifier: {
        '@type': 'PropertyValue',
        name: job.company_name,
        value: job.id
      },
      datePosted: job.created_at,
      validThrough: job.deadline ? `${job.deadline}T23:59:59+03:00` : undefined,
      employmentType: job.employment_type === 'Full-time' ? 'FULL_TIME' :
                      job.employment_type === 'Part-time' ? 'PART_TIME' :
                      job.employment_type === 'Contract' ? 'CONTRACTOR' : 'INTERN',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.company_name,
        sameAs: job.company_website || undefined,
        logo: job.company_logo_url || undefined
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.location,
          addressCountry: 'KE'
        }
      },
      baseSalary: job.salary ? {
        '@type': 'MonetaryAmount',
        currency: 'KES',
        value: {
          '@type': 'QuantitativeValue',
          unitText: 'MONTH'
        }
      } : undefined
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `job-schema-${job.id}`;
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(`job-schema-${job.id}`);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [job]);

  return null;
};
