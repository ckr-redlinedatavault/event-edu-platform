import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import { format } from "date-fns";
export default async function LiveEventsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { q, category } = await searchParams;
    const query = typeof q === 'string' ? q : "";
    const selectedCategory = typeof category === 'string' ? category : "All Events";
    let sqlQuery = `
        SELECT e.*, 
               i.name as "institutionName", i.slug as "institutionSlug", i.logo as "institutionLogo",
               (SELECT COUNT(*)::int FROM "Registration" WHERE "eventId" = e.id) as "registrationCount"
        FROM "Event" e
        LEFT JOIN "Institution" i ON e."institutionId" = i.id
        WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;
    if (query) {
        sqlQuery += ` AND (e.title ILIKE $${paramIndex} OR e.location ILIKE $${paramIndex} OR i.name ILIKE $${paramIndex})`;
        params.push(`%${query}%`);
        paramIndex++;
    }
    if (selectedCategory !== "All Events") {
        sqlQuery += ` AND LOWER(e.category) = LOWER($${paramIndex})`;
        params.push(selectedCategory);
        paramIndex++;
    }
    sqlQuery += ` ORDER BY e."startDate" ASC`;
    const rawEvents: any[] = await prisma.$queryRawUnsafe(sqlQuery, ...params);
    const events = rawEvents.map((e: any) => ({
        ...e,
        institution: { name: e.institutionName, slug: e.institutionSlug, logo: e.institutionLogo },
        _count: { registrations: e.registrationCount || 0 },
        judges: typeof e.judges === 'string' ? JSON.parse(e.judges) : e.judges,
        ticketTiers: typeof e.ticketTiers === 'string' ? JSON.parse(e.ticketTiers) : e.ticketTiers
    }));
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col items-start gap-8 mb-12">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] uppercase tracking-widest font-bold">
                                Discover
                            </div>
                            <h1 className="text-3xl md:text-4xl tracking-tight text-gray-900 font-bold">
                                Live Events.
                            </h1>
                            <p className="text-gray-500 max-w-md text-sm leading-relaxed font-normal">
                                Explore academic, cultural, and professional events across our network.
                            </p>
                        </div>
                        <form action="/events" method="GET" className="relative w-full max-w-md group">
                            {selectedCategory !== "All Events" && (
                                <input type="hidden" name="category" value={selectedCategory} />
                            )}
                            <input
                                name="q"
                                type="text"
                                placeholder="Search events, colleges, or cities..."
                                defaultValue={query}
                                className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-400"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </form>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-12">
                        {['All Events', 'Workshops', 'Conferences', 'Cultural', 'Sports', 'Technical'].map((tag: string) => (
                            <Link
                                key={tag}
                                href={tag === 'All Events' ? '/events' : `/events?category=${tag}${query ? `&q=${query}` : ''}`}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === tag
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-900'
                                    }`}
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                    {events.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                We couldn't find any events matching your current search criteria. Try a different query.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event: any) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                                >
                                    {/* Event Meta Thumbnail Preview */}
                                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                        {event.banner ? (
                                            <img src={event.banner} alt={event.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-slate-900" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/5"></div>
                                        )}
                                        {/* Date Badge */}
                                        <div className="absolute top-4 left-4 bg-white p-2.5 rounded-xl shadow-lg shadow-black/5 text-center min-w-[48px] border border-gray-50">
                                            <span className="block text-[8px] uppercase font-bold tracking-widest text-gray-400 leading-none mb-1">
                                                {format(new Date(event.startDate), 'MMM')}
                                            </span>
                                            <span className="block text-xl font-bold text-gray-900 leading-none">
                                                {format(new Date(event.startDate), 'dd')}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 inline-flex items-center gap-2 shadow-sm">
                                                <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] text-white font-black">
                                                    {event.institution.name[0]}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">
                                                    {event.institution.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight leading-tight line-clamp-1">
                                            {event.title}
                                        </h2>
                                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-6 flex-grow">
                                            {event.fullDescription}
                                        </p>
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-2">
                                                    {[...Array(3)].map((_: any, i: number) => (
                                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-400">
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                    {event._count.registrations} Joined
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider">
                                                Join Now
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <BottomBar />
        </div>
    );
}
