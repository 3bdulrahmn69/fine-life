import Container from '@/app/components/ui/container';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-primary-text">
            Last updated: September 19, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-primary-text">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to Fine Life (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;). We are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our personal finance tracking
              application.
            </p>
            <p>
              By using Fine Life, you agree to the collection and use of
              information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              2.1 Personal Information
            </h3>
            <p className="mb-4">
              We may collect the following personal information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and email address</li>
              <li>Account credentials (encrypted)</li>
              <li>
                Profile information (currency preferences, language settings)
              </li>
              <li>Device information and usage data</li>
            </ul>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              2.2 Financial Data
            </h3>
            <p className="mb-4">
              Your financial information that you voluntarily enter:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Expense and income transactions</li>
              <li>Budget information and limits</li>
              <li>Financial categories and tags</li>
              <li>Receipt images (optional)</li>
            </ul>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              2.3 Anonymous Community Data
            </h3>
            <p className="mb-4">When you opt-in to share prices anonymously:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Item names and prices (anonymized)</li>
              <li>General location data (city level only)</li>
              <li>No personal identifiers included</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and maintain our finance tracking services</li>
              <li>Process and display your financial data</li>
              <li>Generate reports and analytics</li>
              <li>Send notifications and reminders</li>
              <li>Improve our services and develop new features</li>
              <li>Provide customer support</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties, except in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Service Providers:</strong> We may share data with
                trusted service providers who assist in operating our
                application
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Anonymous Community Data:</strong> Only anonymized price
                data you choose to share
              </li>
              <li>
                <strong>Business Transfers:</strong> In case of merger,
                acquisition, or sale of assets
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              5. Data Security
            </h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure server infrastructure with regular security audits</li>
              <li>Encrypted password storage using bcrypt</li>
              <li>Regular security updates and monitoring</li>
              <li>Access controls and authentication requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              6. Data Retention
            </h2>
            <p className="mb-4">
              We retain your personal data for as long as necessary to provide
              our services and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Active Accounts:</strong> Data retained while your
                account is active
              </li>
              <li>
                <strong>Anonymous Price Data:</strong> Retained for 12 months
                for community insights
              </li>
              <li>
                <strong>Deleted Accounts:</strong> Data permanently deleted
                within 30 days
              </li>
              <li>
                <strong>Legal Requirements:</strong> Some data may be retained
                longer if required by law
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              7. Your Rights
            </h2>
            <p className="mb-4">
              You have the following rights regarding your data:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct your information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                data
              </li>
              <li>
                <strong>Portability:</strong> Export your data in a portable
                format
              </li>
              <li>
                <strong>Opt-out:</strong> Stop sharing anonymous price data
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Withdraw consent for data
                processing
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              8. Cookies and Tracking
            </h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your
              experience:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Essential Cookies:</strong> Required for app
                functionality
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand usage
                patterns
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings
              </li>
            </ul>
            <p>
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              9. International Data Transfers
            </h2>
            <p className="mb-4">
              Your data may be transferred to and processed in countries other
              than your own. We ensure appropriate safeguards are in place to
              protect your data during such transfers, including standard
              contractual clauses and adequacy decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p className="mb-4">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected personal information
              from a child under 13, we will take steps to delete such
              information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              11. Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last updated&quot; date. We will
              also send you an email notification for significant changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              12. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="bg-primary-card/30 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> privacy@finelife.app
              </p>
              <p>
                <strong>Address:</strong> [Your Business Address]
              </p>
              <p>
                <strong>Data Protection Officer:</strong> privacy@finelife.app
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              13. Compliance
            </h2>
            <p className="mb-4">This Privacy Policy complies with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>General Data Protection Regulation (GDPR)</li>
              <li>California Consumer Privacy Act (CCPA)</li>
              <li>Other applicable privacy laws and regulations</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-accent hover:text-primary-accent/80 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </Container>
  );
}
