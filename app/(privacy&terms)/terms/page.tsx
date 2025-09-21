import Container from '@/app/components/ui/container';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-primary-text">
            Last updated: September 19, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-primary-text">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              Welcome to Fine Life. These Terms of Service (&quot;Terms&quot;)
              govern your use of our personal finance tracking application and
              related services (collectively, the &quot;Service&quot;). By
              accessing or using Fine Life, you agree to be bound by these
              Terms.
            </p>
            <p>
              If you do not agree to these Terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              2. Description of Service
            </h2>
            <p className="mb-4">
              Fine Life is a Progressive Web App that provides:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal expense and income tracking</li>
              <li>Budget management and monitoring</li>
              <li>Financial analytics and reporting</li>
              <li>Community price sharing (anonymous)</li>
              <li>Multi-device synchronization</li>
              <li>Offline functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              3. User Accounts
            </h2>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              3.1 Account Creation
            </h3>
            <p className="mb-4">
              To use certain features of the Service, you must create an
              account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be at least 13 years old to create an account</li>
            </ul>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              3.2 Account Responsibilities
            </h3>
            <p className="mb-4">
              You are responsible for all activities that occur under your
              account. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Share your account credentials with others</li>
              <li>Use another person&apos;s account</li>
              <li>Create multiple accounts for abusive purposes</li>
              <li>Use automated tools to access the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              4. Acceptable Use
            </h2>
            <p className="mb-4">
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>
                Upload malicious code or interfere with the Service&apos;s
                operation
              </li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Share false or misleading financial information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Use the Service to track illegal activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              5. Financial Data & Privacy
            </h2>
            <p className="mb-4">
              Your financial data is important to us. By using Fine Life, you
              acknowledge that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                You are responsible for the accuracy of your financial data
              </li>
              <li>
                We are not financial advisors and do not provide financial
                advice
              </li>
              <li>You should consult professionals for financial decisions</li>
              <li>Your data is encrypted and stored securely</li>
              <li>
                You control what data you share anonymously with the community
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              6. Community Features
            </h2>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              6.1 Anonymous Price Sharing
            </h3>
            <p className="mb-4">When you choose to share prices anonymously:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Only item names, prices, and general location are shared</li>
              <li>No personal information is included</li>
              <li>Data is aggregated for community insights</li>
              <li>You can opt-out at any time</li>
            </ul>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              6.2 Community Guidelines
            </h3>
            <p className="mb-4">
              When participating in community features, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Share accurate and honest information</li>
              <li>Respect other users&apos; privacy</li>
              <li>Not share inappropriate or offensive content</li>
              <li>Report any misuse of the community features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              7. Subscription & Payment Terms
            </h2>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              7.1 Free Tier
            </h3>
            <p className="mb-4">
              Basic features are available free of charge with reasonable usage
              limits.
            </p>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              7.2 Premium Subscription
            </h3>
            <p className="mb-4">
              Premium features are available through subscription:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Subscription fees are billed in advance</li>
              <li>Automatic renewal unless cancelled</li>
              <li>30-day money-back guarantee for first-time subscribers</li>
              <li>Price changes will be communicated 30 days in advance</li>
            </ul>

            <h3 className="text-xl font-medium text-primary-foreground mb-3">
              7.3 Cancellation
            </h3>
            <p className="mb-4">
              You may cancel your subscription at any time. Cancellation takes
              effect at the end of your current billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              8. Intellectual Property
            </h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality
              are owned by Fine Life and are protected by copyright, trademark,
              and other intellectual property laws.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You retain ownership of your financial data</li>
              <li>
                You grant us a license to use your data to provide the Service
              </li>
              <li>
                You may not copy, modify, or distribute our intellectual
                property
              </li>
              <li>&quot;Fine Life&quot; and our logos are our trademarks</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              9. Data Ownership & Export
            </h2>
            <p className="mb-4">
              Your financial data belongs to you. You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Export your data at any time</li>
              <li>Delete your account and all associated data</li>
              <li>Request a copy of all your data</li>
              <li>Transfer your data to another service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              10. Service Availability
            </h2>
            <p className="mb-4">
              While we strive for high availability, we do not guarantee
              uninterrupted service:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service may be temporarily unavailable for maintenance</li>
              <li>We reserve the right to modify or discontinue features</li>
              <li>
                Offline functionality is available when internet is unavailable
              </li>
              <li>We will provide notice for significant service changes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              11. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Fine Life shall not be
              liable for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of data, profits, or business opportunities</li>
              <li>Service interruptions or data loss</li>
              <li>Third-party actions or content</li>
              <li>Financial decisions made based on Service data</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount paid by you for
              the Service in the 12 months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              12. Indemnification
            </h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless Fine Life from any
              claims, damages, losses, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit to the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              13. Termination
            </h2>
            <p className="mb-4">
              We may terminate or suspend your account immediately for
              violations of these Terms. Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your right to use the Service ceases immediately</li>
              <li>We may delete your account and data</li>
              <li>Outstanding payments are still due</li>
              <li>Sections 5, 8, 11, and 12 survive termination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              14. Governing Law
            </h2>
            <p className="mb-4">
              These Terms are governed by and construed in accordance with the
              laws of [Your Jurisdiction], without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              15. Dispute Resolution
            </h2>
            <p className="mb-4">
              Any disputes arising from these Terms shall be resolved through:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Good faith negotiations between the parties</li>
              <li>Mediation before pursuing legal action</li>
              <li>Binding arbitration in [Your Jurisdiction]</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              16. Changes to Terms
            </h2>
            <p className="mb-4">
              We may modify these Terms at any time. Changes will be effective
              when posted on this page. Your continued use of the Service after
              changes constitutes acceptance of the new Terms.
            </p>
            <p>
              For significant changes, we will provide additional notice via
              email or in-app notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              17. Severability
            </h2>
            <p className="mb-4">
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              18. Entire Agreement
            </h2>
            <p className="mb-4">
              These Terms constitute the entire agreement between you and Fine
              Life regarding the Service and supersede all prior agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              19. Contact Information
            </h2>
            <p className="mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-primary-card/30 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> legal@finelife.app
              </p>
              <p>
                <strong>Address:</strong> [Your Business Address]
              </p>
              <p>
                <strong>Legal Department:</strong> legal@finelife.app
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-foreground mb-4">
              20. Acknowledgment
            </h2>
            <p className="mb-4">
              By using Fine Life, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
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
