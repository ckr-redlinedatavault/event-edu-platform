import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import { format } from "date-fns";
import { Download, ArrowRight, ShieldCheck, Ticket as TicketIcon, User, Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import TicketDownloadButton from "@/components/TicketDownloadButton";

export default async function RegistrationSuccessPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ email?: string; name?: string }>;
}) {
    const { id } = await params;
    const { email, name: nameParam } = await searchParams;

    if (!email) redirect(`/events/${id}`);

    // Use raw SQL to bypass Prisma client cache issues
    const events: any[] = await prisma.$queryRawUnsafe(`
        SELECT e.*, i.name as "institutionName", i.logo as "institutionLogo"
        FROM "Event" e
        LEFT JOIN "Institution" i ON e."institutionId" = i.id
        WHERE e.id = $1
    `, id);

    const event = events[0];
    if (!event) notFound();

    // Attach institution as nested object for template compatibility
    event.institution = { name: event.institutionName, logo: event.institutionLogo };

    const rows: any[] = await prisma.$queryRawUnsafe(`
        SELECT u.id as "userId", u.email, r.id as "regId", r."eventId", 
               t.id as "ticketId", t."qrCode", t."isUsed",
               r."createdAt" as "regCreatedAt"
        FROM "User" u
        JOIN "Registration" r ON r."userId" = u.id
        JOIN "Ticket" t ON t."registrationId" = r.id
        WHERE u.email = $1 AND r."eventId" = $2
    `, email, id);

    if (!rows || rows.length === 0) {
        notFound();
    }

    const row = rows[0];
    const registration = { id: row.regId, tier: 'Standard' };
    const ticket = { id: row.ticketId, qrCode: row.qrCode };
    const displayName = nameParam || 'Event Delegate';
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.qrCode);
    const shortId = ticket.id.split('-')[0].toUpperCase();

    return (
        <div className="min-h-screen bg-[#F1F3F6] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Premium Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-400/5 blur-[120px] rounded-full"></div>
            </div>

            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-6 flex flex-col items-center justify-center relative z-10">
                <div className="w-full max-w-5xl mx-auto space-y-8">

                    {/* Header: Clean & Modern */}
                    <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Registration Secured</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Official Pass.</h1>
                    </div>

                    {/* Compact Professional Ticket */}
                    <div id="ticket-pass" className="relative w-full max-w-5xl mx-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.05)]">

                        {/* Edge Scallops - Right side only for clean entry look */}
                        <div className="absolute -right-3 top-0 bottom-0 flex flex-col justify-around py-4 z-20">
                            {[...Array(6)].map((_: any, i: number) => (
                                <div key={i} className="w-6 h-6 bg-[#F1F3F6] rounded-full translate-x-1/2 ring-1 ring-inset ring-slate-100"></div>
                            ))}
                        </div>

                        {/* Main Body Container: Increased height as requested */}
                        <div className="flex flex-col md:flex-row w-full bg-white overflow-hidden rounded-[1.5rem] relative ring-1 ring-slate-200/60 shadow-inner">

                            {/* Content Area (Left): Padding and min-height increased for more height */}
                            <div className="flex-grow p-6 px-10 flex flex-col justify-between min-h-[140px]">

                                <div className="space-y-4">
                                    {/* Top Row: Brand & ID Anchor */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            {/* Flexible Logo Component */}
                                            <div className="flex items-center justify-center bg-white border border-slate-100 rounded-lg w-8 h-8 p-1 shadow-sm shrink-0 grayscale">
                                                {event.institution?.logo ? (
                                                    <img src={event.institution.logo} className="max-w-full max-h-full object-contain" alt="Institution" />
                                                ) : (
                                                    <TicketIcon className="text-blue-600" size={16} />
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[11px] font-bold text-blue-600 tracking-tight leading-none">{event.institution?.name || 'Authorized Entry'}</p>
                                                <p className="text-[8px] font-semibold text-slate-400 opacity-80 leading-none">Ref: {ticket.id.split('-').pop()}</p>
                                            </div>
                                        </div>

                                        {/* Pass ID with Professional Blue Bar */}
                                        <div className="relative pl-3 py-0 shrink-0 border-l-[1.5px] border-blue-600/30">
                                            <div className="space-y-0.5">
                                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Security ID</p>
                                                <p className="text-base font-black text-slate-900 tracking-tighter tabular-nums leading-none">#{shortId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Title, Address & Delegate Info */}
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight max-w-[700px]">
                                                {event.title}
                                            </h3>
                                            <div className="w-full border-b border-dotted border-slate-200/50"></div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {/* Address */}
                                            <div className="flex items-center gap-1.5 group cursor-default">
                                                <div className="w-3.5 h-3.5 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                    <MapPin size={8} className="text-blue-600 group-hover:text-white shrink-0" />
                                                </div>
                                                <p className="text-[10px] font-bold tracking-tight text-blue-600">{event.location}</p>
                                            </div>

                                            {/* Delegate Info */}
                                            <div className="flex items-center gap-2 pl-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-3.5 h-3.5 rounded-full bg-slate-50 flex items-center justify-center">
                                                        <User size={8} className="text-slate-400" />
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-slate-900">{displayName}</p>
                                                </div>
                                                <div className="w-0.5 h-0.5 rounded-full bg-slate-300"></div>
                                                <p className="text-[9px] font-medium text-slate-500">{email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logistics Row: balanced 3 columns */}
                                <div className="grid grid-cols-3 gap-6 items-end mt-4 pt-4 border-t border-dotted border-slate-200/50">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Calendar size={10} strokeWidth={2} />
                                            <p className="text-[7px] font-semibold uppercase tracking-wider leading-none">Date</p>
                                        </div>
                                        <p className="text-[11px] font-semibold text-slate-700 leading-none">{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock size={10} strokeWidth={2} />
                                            <p className="text-[7px] font-semibold uppercase tracking-wider leading-none">Access</p>
                                        </div>
                                        <p className="text-[11px] font-semibold text-slate-700 leading-none">{format(new Date(event.startDate), 'hh:mm a')}</p>
                                    </div>

                                    <div className="space-y-1 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-slate-400">
                                            <ShieldCheck size={10} strokeWidth={2} />
                                            <p className="text-[7px] font-semibold uppercase tracking-wider leading-none">Tier</p>
                                        </div>
                                        <p className="text-[11px] font-bold text-blue-600 leading-none uppercase tracking-tighter">{registration.tier || 'Standard'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Perforation 'Cutter' Divider */}
                            <div className="relative w-full h-[2px] md:w-3 md:h-auto flex flex-col items-center justify-around py-5 bg-white shrink-0 z-20">
                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] border-l-[1px] border-dashed border-slate-100"></div>
                                <div className="flex flex-col justify-between h-full py-2 z-10">
                                    {[...Array(6)].map((_: any, i: number) => (
                                        <div key={i} className="w-0.5 h-0.5 bg-[#F1F3F6] rounded-full ring-[0.5px] ring-slate-200/10"></div>
                                    ))}
                                </div>
                                <div className="absolute top-[-9px] left-1/2 -translate-x-1/2 w-5 h-5 bg-[#F1F3F6] rounded-full shadow-inner ring-[1px] ring-slate-100"></div>
                                <div className="absolute bottom-[-9px] left-1/2 -translate-x-1/2 w-5 h-5 bg-[#F1F3F6] rounded-full shadow-inner ring-[1px] ring-slate-100"></div>
                            </div>

                            {/* Verification Stub (Right Area) */}
                            <div className="w-full md:w-44 bg-[#0B0C10] p-4 px-6 flex flex-col items-center justify-center shrink-0 relative overflow-hidden group/stub">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.4),transparent)]"></div>
                                <div className="w-full space-y-4 z-10 text-center">
                                    <div className="space-y-0.5">
                                        <p className="text-[7px] font-bold tracking-[0.3em] text-blue-500 uppercase">Authenticated</p>
                                        <div className="h-[1px] w-5 bg-blue-600/30 mx-auto rounded-full"></div>
                                    </div>
                                    <div className="relative w-full aspect-square bg-white rounded-lg p-2.5 shadow-2xl transition-all duration-500 group-hover/stub:p-2 group-hover/stub:-rotate-1 scale-100 group-hover/stub:scale-[1.02]">
                                        <img src={qrCodeDataUrl} className="w-full h-full grayscale brightness-110" style={{ imageRendering: 'pixelated' }} />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="inline-flex items-center gap-1 px-2 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5 shadow-lg">
                                            <ShieldCheck size={8} className="text-emerald-400" />
                                            <span className="text-[6.5px] font-bold text-white uppercase tracking-widest leading-none">Identity Cleared</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-600/80"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Interface */}
                    <div className="max-w-xs mx-auto flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 mt-1">
                        <TicketDownloadButton ticketId={ticket.id} />
                        <Link href="/events" className="w-full py-3.5 bg-white border border-slate-200 text-slate-800 font-bold text-xs tracking-widest rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-center">
                            Browse Events
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
            <BottomBar />
        </div>
    );
}
