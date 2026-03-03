import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { format } from "date-fns";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function SuperAdminDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get("super_admin_session");

    if (!session || session.value !== "authenticated") {
        redirect("/super-admin/login");
    }

    const institutions = await prisma.institution.findMany({
        include: {
            _count: { select: { events: true, admins: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    const events = await prisma.event.findMany({
        include: {
            institution: true,
            _count: { select: { registrations: true } }
        },
        orderBy: { startDate: "desc" }
    });

    async function deleteInstitution(institutionId: string) {
        "use server";
        const institutionEvents = await prisma.event.findMany({ where: { institutionId }, select: { id: true } });
        const eventIds = institutionEvents.map((e: { id: string }) => e.id);

        await prisma.ticket.deleteMany({ where: { registration: { eventId: { in: eventIds } } } });
        await prisma.registration.deleteMany({ where: { eventId: { in: eventIds } } });
        await prisma.event.deleteMany({ where: { institutionId } });
        await prisma.user.deleteMany({ where: { institutionId } });
        await prisma.institution.delete({ where: { id: institutionId } });
        revalidatePath("/super-admin/dashboard");
    }

    async function deleteEvent(eventId: string) {
        "use server";
        await prisma.ticket.deleteMany({ where: { registration: { eventId } } });
        await prisma.registration.deleteMany({ where: { eventId } });
        await prisma.event.delete({ where: { id: eventId } });
        revalidatePath("/super-admin/dashboard");
    }

    async function clearAllEvents() {
        "use server";
        await prisma.ticket.deleteMany({});
        await prisma.registration.deleteMany({});
        await prisma.event.deleteMany({});
        revalidatePath("/super-admin/dashboard");
    }

    async function logout() {
        "use server";
        const cookieStore = await cookies();
        cookieStore.delete("super_admin_session");
        redirect("/super-admin/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Super Admin Header */}
            <header className="bg-slate-900 border-b border-slate-800 p-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/10">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-normal text-white tracking-tight">System Overlord.</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Super Admin Global Management</p>
                        </div>
                    </div>
                    <form action={logout}>
                        <button type="submit" className="px-6 py-2.5 bg-slate-800 text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest">
                            Terminate Session
                        </button>
                    </form>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full px-6 py-12 space-y-16">
                <Breadcrumbs
                    items={[
                        { label: "Super Admin", href: "/super-admin/login" },
                        { label: "Dashboard", href: "/super-admin/dashboard", active: true }
                    ]}
                />

                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Institutions</p>
                        <p className="text-4xl font-normal text-slate-900">{institutions.length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Events</p>
                        <p className="text-4xl font-normal text-slate-900">{events.length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 col-span-2 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">System Status</p>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <p className="text-xl font-medium text-slate-900 uppercase">Operational</p>
                            </div>
                        </div>
                        <form action={clearAllEvents}>
                            <button type="submit" className="px-8 py-4 bg-red-600 text-white rounded-full text-sm font-bold shadow-xl shadow-red-500/20">
                                Wipe All Events
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Institution Module */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                            <h2 className="text-2xl font-normal text-slate-900 tracking-tight">Institutions Feed.</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{institutions.length} Registered</span>
                        </div>

                        <div className="space-y-4">
                            {institutions.map((inst: any) => (
                                <div key={inst.id} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden font-bold">
                                            {inst.logo ? <img src={inst.logo} className="w-full h-full object-cover" /> : inst.name[0]}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-medium text-slate-900">{inst.name}</h3>
                                            <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                <span>{inst._count.events} Events</span>
                                                <span>{inst._count.admins} Admins</span>
                                            </div>
                                        </div>
                                    </div>
                                    <form action={async () => { "use server"; await deleteInstitution(inst.id); }}>
                                        <button className="p-3 bg-red-50 text-red-600 rounded-xl">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Global Events Module */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                            <h2 className="text-2xl font-normal text-slate-900 tracking-tight">Global Events Feed.</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{events.length} Deployed</span>
                        </div>

                        <div className="space-y-4">
                            {events.map((event: any) => (
                                <div key={event.id} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between gap-6">
                                    <div className="space-y-2 flex-1">
                                        <h3 className="font-medium text-slate-900 line-clamp-1">{event.title}</h3>
                                        <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest font-black">
                                            <span className="text-blue-600">{event.institution.name}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-400">{format(new Date(event.startDate), "MMM dd, yyyy")}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <span>{event._count.registrations} Regs</span>
                                        <form action={async () => { "use server"; await deleteEvent(event.id); }}>
                                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
