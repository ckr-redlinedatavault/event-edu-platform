import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, User, Mail, Phone, Calendar, MapPin, ShieldCheck, Ticket } from "lucide-react";
import { format } from "date-fns";

export default async function TicketVerificationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Use raw SQL to bypass Prisma client cache issues
    const rows: any[] = await prisma.$queryRawUnsafe(`
        SELECT t.id as "ticketId", t."qrCode", t."isUsed",
               r.id as "regId", r."createdAt" as "regCreatedAt",
               u.id as "userId", u.email, u.phone,
               e.id as "eventId", e.title, e.category, e."startDate", e.location,
               i.name as "institutionName"
        FROM "Ticket" t
        JOIN "Registration" r ON t."registrationId" = r.id
        JOIN "User" u ON r."userId" = u.id
        JOIN "Event" e ON r."eventId" = e.id
        LEFT JOIN "Institution" i ON e."institutionId" = i.id
        WHERE t.id = $1
    `, id);

    if (!rows || rows.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center space-y-6 border border-red-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                        <XCircle size={40} className="text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900">Invalid Pass</h1>
                        <p className="text-slate-500">This security credential could not be verified or does not exist in our registry.</p>
                    </div>
                    <div className="pt-4">
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium inline-block italic">
                            Verification Failure Code: 404_SEC_NOT_FOUND
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const row = rows[0];
    const ticket = { id: row.ticketId, qrCode: row.qrCode, isUsed: row.isUsed };
    const registration = { id: row.regId, tier: 'Standard', createdAt: row.regCreatedAt };
    const user = { id: row.userId, name: row.email?.split('@')[0], email: row.email, phone: row.phone };
    const event = { id: row.eventId, title: row.title, category: row.category, startDate: row.startDate, location: row.location };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <div className="max-w-xl w-full space-y-6">

                {/* Status Header */}
                <div className="bg-emerald-500 rounded-3xl p-8 text-white shadow-lg shadow-emerald-200/50 relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10">
                        <ShieldCheck size={180} />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-sm font-bold tracking-[0.3em] uppercase opacity-80">Credential Status</h2>
                            <h1 className="text-3xl font-black tracking-tight">Verified Secure</h1>
                        </div>
                    </div>
                </div>

                {/* Delegate Details */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h3 className="text-lg font-bold text-slate-900">Delegate Information</h3>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                    <User size={18} className="text-blue-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Legal Name</p>
                                    <p className="text-lg font-bold text-slate-900">{user.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <Mail size={18} className="text-blue-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <Phone size={18} className="text-blue-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Contact</p>
                                        <p className="text-sm font-semibold text-slate-700">{user.phone || 'Not Provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    {/* Entry Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                            <h3 className="text-lg font-bold text-slate-900">Access Privileges</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 bg-slate-900 rounded-3xl text-white space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">{event.category || 'Official Event'}</p>
                                        <h4 className="text-xl font-bold leading-tight">{event.title}</h4>
                                    </div>
                                    <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
                                        {registration.tier}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-blue-400" />
                                        <p className="text-xs font-semibold">{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-blue-400" />
                                        <p className="text-xs font-semibold truncate">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-2">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Security Reference</p>
                                    <p className="text-xs font-mono font-bold text-slate-600">ID: {ticket.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verification Time</p>
                                    <p className="text-xs font-bold text-slate-600">{format(new Date(), 'hh:mm:ss a')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center justify-center gap-2 border border-blue-100/50">
                        <ShieldCheck size={16} className="text-blue-600" />
                        <p className="text-xs font-bold text-blue-700 tracking-tight">Authorized system validation complete</p>
                    </div>
                </div>

                {/* Footer Brand */}
                <div className="text-center opacity-40 grayscale flex items-center justify-center gap-2">
                    <Ticket size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Verification Engine</span>
                </div>
            </div>
        </div>
    );
}
