import React from 'react'
import SeoHelmet from '../components/common/SeoHelmet'

export default function Privacy() {
  return (
    <>
      <SeoHelmet
        title="Privacy Policy | ProLink Consultancy"
        description="Read how ProLink Consultancy collects, uses, and protects your personal data across our recruitment and consultancy services."
        image="/og/prolink-legal.svg"
        imageAlt="Privacy policy for ProLink Consultancy"
        path="/privacy"
        themeColor="#334155"
      />
    <main className="min-h-[70vh] py-20 bg-white dark:bg-brand-ink text-ink dark:text-sand">
      <div className="container mx-auto px-6 lg:px-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-brand-wine mb-6">Privacy Policy</h1>

          <p className="mb-4 text-gray-700 dark:text-sand/90">
            This Privacy Policy explains how we collect, use, and protect your personal data when you use our job consultancy services.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">1. Information We Collect</h2>
            <p className="text-gray-700 dark:text-sand/90">We collect information you provide directly (profiles, resumes, contact info) and information gathered automatically (usage, device data).</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">2. How We Use Data</h2>
            <p className="text-gray-700 dark:text-sand/90">We use data to operate the service, match candidates to roles, communicate with users, and improve our platform. We may also use data for analytics and legal compliance.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">3. Sharing & Disclosure</h2>
            <p className="text-gray-700 dark:text-sand/90">We share data with employers you apply to, service providers, and where required by law. We do not sell personal data to third parties.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">4. Your Choices</h2>
            <p className="text-gray-700 dark:text-sand/90">You can access, correct, or request deletion of your personal data by contacting support. You may opt out of marketing communications.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">5. Security</h2>
            <p className="text-gray-700 dark:text-sand/90">We implement industry-standard security measures, but no system is completely secure. Report any suspected breaches to us immediately.</p>
          </section>

          <p className="text-sm text-gray-500">For more details or data requests, please reach out to our privacy team.</p>
        </div>
      </div>
    </main>
    </>
  )
}
