import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminSidebar from "@/components/AdminSidebar";
import { format } from "date-fns";
import { UserCheck, ShieldCheck, Mail, Ticket } from "lucide-react";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function AdminRegistrationsPage({ params }: Props) {
    const { slug } = await params;

    const institutions: any[] = await prisma.$queryRawUnsafe(`
        SELECT * FROM "Institution" WHERE slug = $1
    `, slug);

    if (!institutions || institutions.length === 0) notFound();
    const institution = institutions[0];

    // Fetch all registrations across all events for this institution
    const allRegistrations: any[] = await prisma.$queryRawUnsafe(`
        SELECT r.id, r."userId", r."eventId", r."createdAt",
               u.email as "userEmail",
               e.title as "eventTitle",
               t.id as "ticketId", t."qrCode", t."isUsed"
        FROM "Registration" r
        JOIN "User" u ON r."userId" = u.id
        JOIN "Event" e ON r."eventId" = e.id
        LEFT JOIN "Ticket" t ON t."registrationId" = r.id
        WHERE e."institutionId" = $1
        ORDER BY r."createdAt" DESC
    `, institution.id);

    // Map to template-compatible shape
    const registrations = allRegistrations.map((reg: any) => ({
        id: reg.id,
        userId: reg.userId,
        eventId: reg.eventId,
        createdAt: reg.createdAt,
        eventTitle: reg.eventTitle,
        user: { email: reg.userEmail },
        ticket: reg.ticketId ? { id: reg.ticketId, qrCode: reg.qrCode, isUsed: reg.isUsed } : null
    }));

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <AdminSidebar
                slug={slug}
                institutionName={institution.name}
                logo={institution.logo}
            />

            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-white border-b border-gray-100 p-6 flex-shrink-0">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <Breadcrumbs
                                items={[
                                    { label: "Dashboard", href: `/admin/dashboard/${slug}` },
                                    { label: "Registrations", href: "#", active: true }
                                ]}
                            />
                            <h1 className="text-3xl font-normal tracking-tight text-gray-900 leading-tight">
                                User <span className="text-blue-600">Onboarding.</span>
                            </h1>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
                    {registrations.length === 0 ? (
                        <div className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                                <UserCheck size={32} />
                            </div>
                            <h2 className="text-xl font-medium text-gray-900 mb-2">Registry is Clear.</h2>
                            <p className="text-gray-400 text-sm">Waiting for the first participant to join your ecosystem.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Participant</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Assignment</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Verification</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {registrations.map((reg: any) => (
                                            <tr key={reg.id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${reg.user.email}`} alt="avatar" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{reg.user.email}</p>
                                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Confirmed User</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-gray-600">
                                                    <p className="font-medium text-gray-900 line-clamp-1">{reg.eventTitle}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase font-black">Event Key: {reg.eventId.split('-')[0]}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {reg.ticket ? (
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <ShieldCheck size={16} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Authenticated</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-amber-500">
                                                            <Ticket size={16} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm text-gray-600">{format(reg.createdAt, 'MMM dd, HH:mm')}</p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                                        <Mail size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
