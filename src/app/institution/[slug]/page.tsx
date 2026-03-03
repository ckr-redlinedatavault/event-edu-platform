import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import { format } from "date-fns";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function InstitutionPage({ params }: PageProps) {
    const { slug } = await params;

    const institution = await prisma.institution.findUnique({
        where: { slug },
        include: {
            events: {
                orderBy: { startDate: "asc" },
                where: {
                    visibility: "PUBLIC",
                },
            },
            _count: {
                select: { events: true },
            },
        },
    });

    if (!institution) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-6 pt-32">
                    <Breadcrumbs
                        items={[
                            { label: institution.name, href: `/institution/${institution.slug}`, active: true }
                        ]}
                    />
                </div>
                {/* Hero Banner Section */}
                <section className="relative pt-32 pb-16 bg-blue-600 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full -ml-32 -mb-32 blur-[80px]"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
                            <div className="w-32 md:w-40 h-32 md:h-40 bg-white rounded-[2.5rem] flex items-center justify-center overflow-hidden shadow-2xl relative border-4 border-white/20">
                                {institution.logo ? (
                                    <img
                                        src={institution.logo}
                                        alt={institution.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <span className="text-5xl md:text-6xl font-normal text-blue-600">
                                        {institution.name[0]}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left mb-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] uppercase tracking-widest font-bold w-fit mx-auto md:mx-0">
                                    Verified Partner
                                </div>
                                <h1 className="text-4xl md:text-6xl tracking-tight text-white font-normal leading-tight">
                                    {institution.name}.
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-blue-100 pt-2">
                                    <div className="flex items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <span className="text-xs font-medium">Campus Presence</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span className="text-xs font-medium">{institution._count.events} Active Listings</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">

                        {/* Left: Events Feed */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                                <h2 className="text-2xl font-normal text-gray-900 tracking-tight">Active Events.</h2>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Chronological Order</span>
                            </div>

                            {institution.events.length === 0 ? (
                                <div className="py-16 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No upcoming events yet.</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                                        This institution hasn't listed any digital experiences for the current semester.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-8">
                                    {institution.events.map((event: any) => (
                                        <Link
                                            key={event.id}
                                            href={`/events/${event.id}`}
                                            className="group flex flex-col md:flex-row gap-8 p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-900/5 transition-all duration-500 relative overflow-hidden"
                                        >
                                            <div className="md:w-32 flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{format(new Date(event.startDate), 'MMM')}</span>
                                                <span className="text-4xl font-normal leading-none">{format(new Date(event.startDate), 'dd')}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-2">{format(new Date(event.startDate), 'yyyy')}</span>
                                            </div>

                                            <div className="flex-1 flex flex-col justify-center space-y-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-normal text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                                        {event.fullDescription}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">Get Ticket</span>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Sidebar Info */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Academic Background</h2>
                                <p className="text-gray-500 text-base leading-relaxed">
                                    {institution.description || `${institution.name} is a leading educational institution dedicated to academic excellence and vibrant campus life. Founded with a vision for the future.`}
                                </p>
                            </div>

                            <div className="grid gap-6">
                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl hover:shadow-gray-200 transition-all duration-300">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Connectivity</p>
                                        <p className="text-sm font-medium text-gray-900">Official Portal</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl hover:shadow-gray-200 transition-all duration-300">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Inquiries</p>
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">support@{institution.slug}.edu</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/admin/login"
                                className="block p-8 bg-black rounded-[2.5rem] text-white space-y-4 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                            >
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium tracking-tight">Institution Portal</h3>
                                    <p className="text-gray-400 text-xs mt-1">Single sign-on for administrative staff and verified stakeholders.</p>
                                </div>
                            </Link>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
            <BottomBar />
        </div>
    );
}
