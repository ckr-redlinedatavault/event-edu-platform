import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventTicker from "@/components/EventTicker";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import SmoothScroll from "@/components/SmoothScroll";

export default async function LandingPage() {
  const institutions = await prisma.institution.findMany({
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logo: true,
      _count: {
        select: { events: true }
      }
    }
  });

  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Hero />
          <EventTicker />

          {/* Institutions Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-start text-left mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                  Partner Network
                </div>
                <h2 className="text-3xl md:text-5xl tracking-tight text-gray-900 font-normal leading-tight">
                  Verified Institutions.
                </h2>
                <p className="text-gray-500 max-w-lg text-base leading-relaxed">
                  Connect with accredited colleges and universities through our secure global event infrastructure.
                </p>
              </div>

              {institutions.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">No institutions onboarded yet.</p>
                  <Link href="/admin/register" className="text-blue-600 text-xs font-bold mt-3 inline-block hover:underline">
                    Register Your College →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {institutions.map((inst: any) => (
                    <Link
                      key={inst.id}
                      href={`/institution/${inst.slug}`}
                      className="group flex flex-col p-8 bg-white rounded-[2rem] border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-xl mb-6 flex items-center justify-center text-gray-900 text-xl font-normal border border-gray-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 overflow-hidden">
                        {inst.logo ? (
                          <img src={inst.logo} alt={inst.name} className="w-full h-full object-cover" />
                        ) : (
                          inst.name[0]
                        )}
                      </div>

                      <h3 className="text-xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {inst.name}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-8 flex-grow">
                        {inst.description || "Leading educational institution dedicated to academic excellence and vibrant campus life."}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {inst._count.events} Upcoming Events
                          </span>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Full-Width CTA Section */}
          <section className="bg-black py-20 px-6 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full -ml-64 -mb-64 blur-[120px]"></div>

            <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
              <h2 className="text-4xl md:text-6xl tracking-tight leading-tight font-normal">Ready to transform your <br /> campus life?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto font-normal">
                Join 500+ institutions already leveraging EventEdu to power their student experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/admin/register" className="px-12 py-5 bg-white text-black rounded-full font-medium text-base hover:bg-gray-100 active:scale-95 transition-all">
                  Get Started for Free
                </Link>
                <Link href="/contact" className="px-12 py-5 bg-transparent border border-white/20 text-white rounded-full font-medium text-base hover:bg-white/10 active:scale-95 transition-all">
                  Schedule Demo
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <BottomBar />
      </div>
    </SmoothScroll>
  );
}
