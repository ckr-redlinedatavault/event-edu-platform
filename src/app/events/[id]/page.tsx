import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import { format } from "date-fns";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { Calendar, MapPin, Users, Ticket, ShieldCheck, ChevronRight, Clock, Info } from "lucide-react";
export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const events: any[] = await prisma.$queryRawUnsafe(`
        SELECT e.*, 
               i.name as "institutionName", i.slug as "institutionSlug", i.logo as "institutionLogo",
               (SELECT COUNT(*)::int FROM "Registration" WHERE "eventId" = e.id) as "registrationCount"
        FROM "Event" e
        LEFT JOIN "Institution" i ON e."institutionId" = i.id
        WHERE e.id = $1
    `, id);
    const event = events[0];
    if (!event) notFound();
    event.institution = {
        name: event.institutionName,
        slug: event.institutionSlug,
        logo: event.institutionLogo
    };
    event._count = { registrations: event.registrationCount || 0 };
    if (typeof event.judges === 'string') event.judges = JSON.parse(event.judges);
    if (typeof event.ticketTiers === 'string') event.ticketTiers = JSON.parse(event.ticketTiers);
    return (
        <div className="flex flex-col min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-8">
                        <Breadcrumbs
                            items={[
                                { label: "Events", href: "/events" },
                                { label: event.title, href: `/events/${event.id}`, active: true }
                            ]}
                        />
                    </div>
                    <div className="max-w-4xl mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100">
                                {event.category || "General Event"}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${event.status === 'PUBLISHED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {event.status}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                            {event.title}
                        </h1>
                        <p className="text-lg text-slate-500 font-normal leading-relaxed">
                            {event.shortDescription || "Secure your spot for this exclusive institutional experience."}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 space-y-10">
                            <div className="w-full rounded-3xl overflow-hidden border border-slate-100 relative group bg-white shadow-xl shadow-slate-200/50">
                                {event.banner ? (
                                    <div className="relative w-full overflow-hidden max-h-[600px] flex items-center justify-center">
                                        <img
                                            src={event.banner}
                                            alt={event.title}
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full flex items-center justify-center bg-slate-50">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Institutional Banner Not Set</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={12} strokeWidth={2.5} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Date</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={12} strokeWidth={2.5} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Time</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{format(new Date(event.startDate), 'hh:mm a')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Users size={12} strokeWidth={2.5} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Type</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{event.mode}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <MapPin size={18} strokeWidth={2} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Event Location / Venue</p>
                                        </div>
                                        <div className="text-sm font-bold text-slate-900 leading-[1.6]">
                                            {event.location.split(',').map((part: string, i: number, arr: any[]) => (
                                                <span key={i} className="inline-block md:block mr-1 md:mr-0">
                                                    {part.trim()}{i < arr.length - 1 ? ',' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-12">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Info size={14} />
                                        </div>
                                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">About this {event.category || 'Event'}</h2>
                                    </div>
                                    <div className="text-base text-slate-600 leading-relaxed max-w-none whitespace-pre-line pl-11">
                                        {event.fullDescription}
                                    </div>
                                </section>
                                {event.judges && (event.judges as any[]).length > 0 && (
                                    <section className="space-y-8 pt-8 border-t border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <ShieldCheck size={14} />
                                            </div>
                                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Judges & Experts</h2>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-11">
                                            {(event.judges as any[]).map((judge: any, i: number) => (
                                                <div key={i} className="group relative">
                                                    <div className="aspect-square rounded-2xl bg-white border border-slate-100 overflow-hidden mb-3 group-hover:border-indigo-200 transition-all shadow-sm">
                                                        <img
                                                            src={judge.image || `https://api.dicebear.com/7.x/initials/svg?seed=${judge.name}`}
                                                            alt={judge.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 scale-105 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{judge.name}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Mentor / Judge</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                <section className="space-y-8 pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Ticket size={14} />
                                        </div>
                                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Ticket Categories</h2>
                                    </div>
                                    <div className="space-y-3 pl-11">
                                        {event.ticketTiers && (event.ticketTiers as any[]).length > 0 ? (
                                            (event.ticketTiers as any[]).map((tier: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100/80 hover:border-emerald-200 transition-all shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                            <Ticket size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{tier.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Limited Admission</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-slate-900">₹{tier.price}</p>
                                                        <p className="text-[9px] text-emerald-600 font-bold uppercase">Available</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Ticket size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Standard Pass</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Valid for 1 Entry</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-slate-900">{event.fee > 0 ? `₹${event.fee}` : "Free"}</p>
                                                    <p className="text-[10px] text-emerald-600 font-bold uppercase">No hidden charges</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24 space-y-6 text-left">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-slate-900">Register Now</h3>
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-bold uppercase rounded border border-green-100">Live</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-slate-900" />
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{event._count.registrations} Joined</p>
                                        </div>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-blue-600" />
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Verified</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Link href={`/events/${event.id}/register`} className="block w-full">
                                        <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                            Confirm Details & Register
                                        </button>
                                    </Link>
                                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase">
                                        Ends: {event.registrationDeadline ? format(new Date(event.registrationDeadline), 'MMM dd') : "Until Capacity"}
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-slate-50 space-y-4 text-left">
                                    <p className="text-[10px] font-bold uppercase text-slate-400">Hosted by</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                                            {event.institution.logo ? <img src={event.institution.logo} className="w-full h-full object-cover" /> : <div className="text-lg font-bold">{event.institution.name[0]}</div>}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{event.institution.name}</p>
                                            <Link href={`/institution/${event.institution.slug}`} className="text-[10px] text-blue-600 font-bold uppercase hover:underline">View Profile</Link>
                                        </div>
                                    </div>
                                </div>
                                {event.qrEnabled && (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold uppercase text-slate-900 line-clamp-1">QR Tickets Active</p>
                                            <p className="text-[10px] text-slate-400">Auto-generated post registration.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <BottomBar />
        </div>
    );
}
