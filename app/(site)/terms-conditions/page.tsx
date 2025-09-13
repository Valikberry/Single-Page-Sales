import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <section className="px-4 py-4">
        <div className="container mx-auto max-w-md px-4">
          <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200 hover:shadow-md transition-shadow px-3 py-2">
            <h1 className="text-xl font-bold text-green-800">
              Terms of Service
            </h1>
            <p className="text-black-700 font-bold text-sm">Effective: 16 July 2025</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="container mx-auto max-w-md px-4">
          <p>
            Welcome to <strong>SponsoredJobsAlert.com</strong>. By accessing our
            website or joining our communities on WhatsApp or Telegram, you
            agree to the following terms. Please review them carefully.
          </p>

          <div>
            <h2 className="font-bold text-black-800">1. Service Overview</h2>
            <p>
              SponsoredJobsAlert.com is a platform that delivers curated
              visa-sponsored job alerts through WhatsApp and Telegram
              communities. We are not a recruitment agency or employer. We do
              not guarantee job offers or employment.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-balck-800">2. Eligibility</h2>
            <ul className="list-disc list-inside ml-4">
              <li>Be at least 18 years old</li>
              <li>Use accurate contact information</li>
              <li>Not impersonate anyone or misuse our communities</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-balck-800">
              3. Community Guidelines
            </h2>
            <p>When you join our messaging groups, you agree to:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Not post spam, advertisements, or misleading content</li>
              <li>Not harass or abuse other members</li>
              <li>Not impersonate admins or misuse our brand name</li>
            </ul>
            <p>
              Violations may result in immediate removal from the community and
              be reported to authorities.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">
              4. Information Accuracy
            </h2>
            <ul className="list-disc list-inside ml-4">
              <li>
                We strive to verify third-party job listings using AI to the
                best of our ability
              </li>
              <li>
                We are not responsible for the outcomes of any job applications
              </li>
              <li>You must conduct your own due diligence</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-balck-800">
              5. No Data Storage Policy
            </h2>
            <p>
              SponsoredJobsAlert.com does not handle or store any personal data
              on our own servers. We do not request or save resumes, IDs, or any
              sensitive user information.
            </p>
            <p>
              Our alerts and community interactions occur entirely through
              WhatsApp and Telegram, where privacy and encryption are governed
              by those platforms’ terms and technologies.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">
              6. Intellectual Property
            </h2>
            <p>
              All content on SponsoredJobsAlert.com — including branding,
              writing, and structure — is protected. Do not reuse or republish
              our content without written permission.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">
              7. Limitation of Liability
            </h2>
            <ul className="list-disc list-inside ml-4">
              <li>We are not liable for job application results</li>
              <li>
                We are not responsible for financial loss due to third-party
                fraud
              </li>
              <li>
                We are not liable for data misuse on WhatsApp, Telegram, or
                external job links
              </li>
            </ul>
            <p>Use our service at your own discretion.</p>
          </div>

          <div>
            <h2 className="font-bold text-balck-800">
              8. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of our
              platform after updates means you accept the changes.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-md px-4">
          <h1 className="text-3xl font-bold text-black-800 mb-2">
            Privacy Policy
          </h1>
          <p className="text-black-700">Effective: 16 July 2025</p>
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="container mx-auto max-w-md px-4">
          <p>
            Your privacy is important to us. At{" "}
            <strong>SponsoredJobsAlert.com</strong>, we keep things simple: we
            do not collect, store, or process any personal data on our own
            servers. All communication happens through WhatsApp and Telegram,
            which handle encryption and user privacy independently.
          </p>

          <div>
            <h2 className="font-bold text-black-800">
              1. What We Know About You
            </h2>
            <p>
              We do not require sign-ups, account creation, or any sensitive
              information. We may see your phone number if you join our WhatsApp
              group, but we do not record, export, or store it elsewhere.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">
              2. Third-Party Platforms
            </h2>
            <p>
              Our service depends on external platforms like WhatsApp (Meta) and
              Telegram. They handle all data encryption, chat history, and
              privacy settings. We do not have access to any information beyond
              what is visible in those apps (e.g., your name and phone number as
              seen in the group).
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">
              3. No Cookies, No Tracking
            </h2>
            <p>
              We do not use cookies or third-party tracking tools. We may use
              basic traffic analytics to monitor website visits — without
              identifying users — strictly for improving the user experience.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">
              4. User Rights & Control
            </h2>
            <ul className="list-disc list-inside ml-4">
              <li>You can leave a group at any time</li>
              <li>You can block or mute messages</li>
              <li>
                You are not required to share any information with us directly
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-black-800">5. Children’s Privacy</h2>
            <p>
              Our platform is intended for users aged 18+. We do not knowingly
              collect or interact with children under that age.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">6. Policy Updates</h2>
            <p>
              We may revise this Privacy Policy to reflect platform or legal
              changes. Any updates will be published here.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-black-800">7. Contact Us</h2>
            <p className="space-y-1">
              📧 <strong>Email:</strong>{" "}
              <a
                href="mailto:privacy@sponsoredjobsalert.com"
                className="text-black-700 underline"
              >
                privacy@sponsoredjobsalert.com
              </a>
              <br />
              💬 <strong>WhatsApp Support:</strong> Available through our group
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
