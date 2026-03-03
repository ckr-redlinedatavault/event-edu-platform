import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminSidebar from "@/components/AdminSidebar";
import { format } from "date-fns";
import { Calendar, Search, Filter, MoreVertical } from "lucide-react";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function AdminEventsPage({ params }: Props) {
    const { slug } = await params;

    const institution = await prisma.institution.findUnique({
        where: { slug },
        include: {
            events: {
                orderBy: { startDate: "desc" } as any,
                include: {
                    _count: { select: { registrations: true } }
                }
            }
        },
    });

    if (!institution) notFound();

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
                                    { label: "Events", href: "#", active: true }
                                ]}
                            />
                            <h1 className="text-3xl font-normal tracking-tight text-gray-900 leading-tight">
                                Management <span className="text-blue-600">Registry.</span>
                            </h1>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                            <div className="relative flex-1 w-full max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input placeholder="Search event logs..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl text-sm font-medium">
                                    <Filter size={16} /> Filter
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metrics</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {((institution as any).events as any[]).map((event: any) => (
                                        <tr key={event.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                        {event.title[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">{event.title}</p>
                                                        <p className="text-xs text-gray-400">{event.category || "Uncategorized"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-gray-600">{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
                                                <p className="text-[10px] text-gray-400">{format(new Date(event.startDate), 'hh:mm a')}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.status === 'PUBLISHED' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-gray-900">{event._count.registrations}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black">Participants</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
