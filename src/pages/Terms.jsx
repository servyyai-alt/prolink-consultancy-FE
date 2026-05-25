import React from 'react'

export default function Terms() {
  return (
    <main className="min-h-[70vh] py-20 bg-white dark:bg-brand-ink text-ink dark:text-sand">
      <div className="container mx-auto px-6 lg:px-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-brand-wine mb-6">Terms & Conditions</h1>

          <p className="mb-4 text-gray-700 dark:text-white/80">
            Welcome to our job consultancy platform. These Terms & Conditions govern your use of our website and services. By accessing or using the platform you agree to comply with these terms.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">1. Our Services</h2>
            <p className="text-gray-700 dark:text-white/80">We connect job seekers and employers through job listings, application management, and additional consultative services. All placements and interactions are between the parties involved.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">2. User Obligations</h2>
            <p className="text-gray-700 dark:text-white/80">You agree to provide accurate information and to use the platform lawfully. Misuse, misrepresentation, or fraudulent activity may result in suspension or termination of your account.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">3. Intellectual Property</h2>
            <p className="text-gray-700 dark:text-white/80">All content, branding, and materials on this site are owned or licensed by us. You may not reproduce or redistribute site content without prior written permission.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">4. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-white/80">We provide the platform on an as-is basis. We are not liable for any direct or indirect losses arising from use of the platform, to the fullest extent permitted by law.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">5. Changes</h2>
            <p className="text-gray-700 dark:text-white/80">We may update these terms from time to time. Continued use after changes constitutes acceptance of the updated terms.</p>
          </section>

          <p className="text-sm text-gray-500 dark:text-white/60">If you have questions about these terms, please contact our support team.</p>
        </div>
      </div>
    </main>
  )
}
