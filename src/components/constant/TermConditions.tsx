import type { JSX } from "react";

export default function TermsConditions(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Header */}
            <header className="text-center border-b pb-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                MyNeuron™ User Agreement
              </h1>

              <p className="text-gray-600 mt-2">Terms & Conditions</p>

              <p className="text-sm text-gray-500 mt-1">
                Effective Date: 16.01.2025 · Last Updated: 16.01.2025
              </p>
            </header>

            {/* Important Notice */}
            <div className="mb-8 rounded-lg border border-gray-300 bg-gray-100 p-4 text-sm text-gray-700">
              <strong>Important:</strong> This agreement is a legally binding
              contract between you (“User”) and Bencos Research & Healthcare
              Solutions Pvt. Ltd. By accessing or using MyNeuron™, you agree to
              these Terms.
            </div>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. About MyNeuron
              </h2>
              <p className="text-gray-600 leading-relaxed">
                MyNeuron™ is a professional scientific networking platform for
                researchers, clinicians, academicians, students, industry
                professionals, and institutions.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Eligibility & Registration
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You must be at least 18 years old and legally capable under
                Indian law. You agree to provide accurate and up-to-date
                registration information.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. Account Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for maintaining the confidentiality of your
                account credentials and all activities under your account.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Profiles & Content
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Users may share professional and academic information. You
                confirm that all submitted content is accurate and does not
                violate third-party rights.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Acceptable Use
              </h2>

              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>No false or fabricated scientific data</li>
                <li>No confidential or patient-identifiable information</li>
                <li>No harassment, spam, or misrepresentation</li>
                <li>No misuse or scraping of platform data</li>
              </ul>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                6. Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed">
                All MyNeuron™ platform elements are protected by intellectual
                property laws and may not be reused without permission.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                7. Disclaimer & Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Content is provided for professional exchange only and does not
                constitute medical advice. Bencos is not liable for indirect or
                consequential damages.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                8. Governing Law
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of India. Courts at Delhi,
                India shall have exclusive jurisdiction.
              </p>
            </section>

            {/* Footer */}
            <footer className="border-t pt-6 text-center text-sm text-gray-500">
              Contact:{" "}
              <a
                href="mailto:legal@bencoslife.com"
                className="text-blue-600 hover:underline"
              >
                legal@bencoslife.com
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
