import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="px-4 py-4">
        <div className="container mx-auto max-w-md px-4">
          <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200 hover:shadow-md transition-shadow px-3 py-2">
            <h1 className="text-xl font-bold text-green-800">About Us</h1>
            <p className="text-black-700 text-sm">
              A community for sponsored Visa alerts on whatsapp.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="container mx-auto max-w-md px-4 space-y-6">
          <h2 className="font-bold text-black-800">
            Welcome to SponsoredJobsAlert.com
          </h2>

          <div className="text-black space-y-3">
            <p>
              <strong> SponsoredJobsAlert.com</strong>  is a free,
               mobile-first, community-driven alert system helping job seekers
              discover real, verified openings from employers that offer visa
              sponsorship.
            </p>
            <p>
              We’re not a traditional job board — we’re a job alert community
              built for action-takers.
            </p>
            <h2 className="font-bold text-black-800">
              Who is this community for :
            </h2>
            <div>
              <p className="py-1">
                <i> 👨‍👩‍👧 Busy parents :</i>  Busy mums and dads ready to relocate
                through a job offer
              </p>
              <p className=" py-1">
                <i>🎓 College graduate : </i>Looking to start their Global
                career
              </p>
              <p className="py-1">
                <i> 🚀 Ambitious Professionals :</i> Ambitious experts seeking a
                better life abroad
              </p>
              <p className=" py-1">
                <i>🌍 Anyone :</i> Anyone ready to move with a Job-backed Visa
              </p>
              <p className=" py-1">
                <i> 📲 Real-time Notficiation :</i> People who wanted trusted,
                real-time updates from sponsorship-friendly companies
              </p>
            </div>
            <p>
              SponsoredJobsAlert.com was built for you — you're just one
              notification away from a job that can launch your career abroad.
            </p>
            <h2 className="font-bold text-black-800">⏰ How it Works :</h2>
            <div>
              <ul
                className="list-disc list-inside ml-4"
                // style={{ fontSize: 13 }}
              >
                <li>Go to SponsoredJobsAlert.com</li>
                <li>
                  Pick the country you're interested in (UK, Canada, USA, etc.)
                </li>
                <li>Choose the job category that matches your skills</li>
                <li>
                  You'll be directed to WhatsApp or Telegram group for that
                  field
                </li>
                <li>
                  Sit back and get real-time job alerts as soon as they drop
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
