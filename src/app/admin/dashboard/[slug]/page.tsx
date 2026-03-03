import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminSidebar from "@/components/AdminSidebar";
import { Calendar, Eye, Settings, Users } from "lucide-react";
import AdminEventForm from "@/components/AdminEventForm";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ edit?: string; create?: string }>;
}

export default async function InstitutionDashboard(props: PageProps) {
    const { slug } = await props.params;
    const searchParams = await props.searchParams;
    const editId = searchParams?.edit;
    const showCreate = searchParams?.create === 'true';

    const institutions: any[] = await prisma.$queryRawUnsafe(`
        SELECT * FROM "Institution" WHERE slug = $1
    `, slug);

    if (!institutions || institutions.length === 0) notFound();
    const institution = institutions[0] as any;

    // Fetch events with registration counts
    const rawEvents: any[] = await prisma.$queryRawUnsafe(`
        SELECT e.*, 
               (SELECT COUNT(*)::int FROM "Registration" WHERE "eventId" = e.id) as "registrationCount"
        FROM "Event" e
        WHERE e."institutionId" = $1
        ORDER BY e."createdAt" DESC
    `, institution.id);

    // Reconstruct template-compatible shape
    institution.events = rawEvents.map((e: any) => ({
        ...e,
        _count: { registrations: e.registrationCount || 0 },
        judges: typeof e.judges === 'string' ? JSON.parse(e.judges) : e.judges,
        ticketTiers: typeof e.ticketTiers === 'string' ? JSON.parse(e.ticketTiers) : e.ticketTiers
    }));

    const eventToEdit = editId ? rawEvents.find((e: any) => e.id === editId) || null : null;

    async function createEvent(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const shortDescription = formData.get("shortDescription") as string;
        const fullDescription = formData.get("fullDescription") as string;
        const category = formData.get("category") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const registrationDeadline = formData.get("registrationDeadline") as string;
        const mode = formData.get("mode") as string;
        const location = formData.get("location") as string;
        const maxParticipants = formData.get("maxParticipants") as string;
        const fee = formData.get("fee") as string;
        const banner = formData.get("banner") as string;
        const visibility = formData.get("visibility") as string;
        const status = formData.get("status") as string;
        const qrEnabled = formData.get("qrEnabled") === "on";
        const judgesJson = formData.get("judgesJson") as string;
        const ticketTiersJson = formData.get("ticketTiersJson") as string;
        const minTeamSize = formData.get("minTeamSize") as string;
        const maxTeamSize = formData.get("maxTeamSize") as string;

        const judgesArray = judgesJson ? JSON.parse(judgesJson) : [];
        const ticketTiersArray = ticketTiersJson ? JSON.parse(ticketTiersJson) : [];

        if (!institution) return;

        await prisma.event.create({
            data: {
                title,
                shortDescription,
                fullDescription,
                category,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
                mode,
                location,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
                fee: fee ? parseFloat(fee) : 0,
                banner,
                visibility,
                status,
                qrEnabled,
                judges: judgesArray,
                ticketTiers: ticketTiersArray,
                minTeamSize: minTeamSize ? parseInt(minTeamSize) : 1,
                maxTeamSize: maxTeamSize ? parseInt(maxTeamSize) : 1,
                institutionId: (institution as any).id
            } as any
        });

        revalidatePath(`/admin/dashboard/${slug}`);
        revalidatePath(`/institution/${slug}`);
        revalidatePath(`/events`);
        redirect(`/admin/dashboard/${slug}`);
    }

    async function updateEvent(formData: FormData) {
        "use server";
        const id = formData.get("eventId") as string;
        const title = formData.get("title") as string;
        const shortDescription = formData.get("shortDescription") as string;
        const fullDescription = formData.get("fullDescription") as string;
        const category = formData.get("category") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const registrationDeadline = formData.get("registrationDeadline") as string;
        const mode = formData.get("mode") as string;
        const location = formData.get("location") as string;
        const maxParticipants = formData.get("maxParticipants") as string;
        const fee = formData.get("fee") as string;
        const banner = formData.get("banner") as string;
        const visibility = formData.get("visibility") as string;
        const status = formData.get("status") as string;
        const qrEnabled = formData.get("qrEnabled") === "on";
        const judgesJson = formData.get("judgesJson") as string;
        const ticketTiersJson = formData.get("ticketTiersJson") as string;
        const minTeamSizeVal = formData.get("minTeamSize") as string;
        const maxTeamSizeVal = formData.get("maxTeamSize") as string;

        const judgesArray = judgesJson ? JSON.parse(judgesJson) : [];
        const ticketTiersArray = ticketTiersJson ? JSON.parse(ticketTiersJson) : [];

        await prisma.event.update({
            where: { id },
            data: {
                title,
                shortDescription,
                fullDescription,
                category,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
                mode,
                location,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
                fee: fee ? parseFloat(fee) : 0,
                banner,
                visibility,
                status,
                qrEnabled,
                judges: judgesArray,
                ticketTiers: ticketTiersArray,
                minTeamSize: minTeamSizeVal ? parseInt(minTeamSizeVal) : 1,
                maxTeamSize: maxTeamSizeVal ? parseInt(maxTeamSizeVal) : 1,
            } as any
        });

        revalidatePath(`/admin/dashboard/${slug}`);
        revalidatePath(`/institution/${slug}`);
        revalidatePath(`/events`);
        redirect(`/admin/dashboard/${slug}`);
    }

    async function deleteEvent(formData: FormData) {
        "use server";
        const id = formData.get("eventId") as string;
        await prisma.ticket.deleteMany({ where: { registration: { eventId: id } } });
        await prisma.registration.deleteMany({ where: { eventId: id } });
        await prisma.event.delete({ where: { id } });
        revalidatePath(`/admin/dashboard/${slug}`);
        revalidatePath(`/institution/${slug}`);
        revalidatePath(`/events`);
    }

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
                                    { label: "Admin", href: "#" },
                                    { label: institution.name, href: `/admin/dashboard/${slug}`, active: true }
                                ]}
                            />
                            <h1 className="text-3xl font-normal tracking-tight text-gray-900 leading-tight">
                                Admin <span className="text-blue-600">Dashboard.</span>
                            </h1>
                        </div>

                        {!eventToEdit && !showCreate && (
                            <Link
                                href={`/admin/dashboard/${slug}?create=true`}
                                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-sm shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                + Launch New Event
                            </Link>
                        )}
                    </div>
                </header>

                <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
                    {(eventToEdit || showCreate) ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-10 flex items-center justify-between">
                                <h2 className="text-2xl font-normal tracking-tight text-gray-900">
                                    {eventToEdit ? 'Edit Event' : 'Create Event'}
                                </h2>
                                <Link href={`/admin/dashboard/${slug}`} className="text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
                                    Close Editor ✕
                                </Link>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40">
                                <AdminEventForm
                                    eventToEdit={eventToEdit}
                                    institutionSlug={slug}
                                    onSubmit={eventToEdit ? updateEvent : createEvent}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Events</p>
                                    <div className="flex items-end gap-3">
                                        <span className="text-5xl font-normal text-gray-900">{(institution as any).events.length}</span>
                                        <span className="text-green-600 text-xs font-bold mb-1.5 flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                            Active
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Registrations</p>
                                    <div className="flex items-end gap-3">
                                        <span className="text-5xl font-normal text-gray-900">
                                            {(institution as any).events.reduce((acc: number, e: any) => acc + (e._count.registrations || 0), 0)}
                                        </span>
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-black mb-1.5">LIVE</span>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Active Admin Team</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} className="w-full h-full" alt="avatar" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 ml-2">+12 Others</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                    <h2 className="text-2xl font-normal tracking-tight text-gray-900">Manage Events.</h2>
                                    <div className="flex gap-2">
                                        <button className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">All</button>
                                        <button className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900">Active</button>
                                    </div>
                                </div>

                                {institution.events.length === 0 ? (
                                    <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                                        <div className="w-20 h-20 bg-gray-50 rounded-3xl mx-auto mb-6 flex items-center justify-center text-gray-200">
                                            <Calendar size={32} />
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium">No events found.</p>
                                        <Link href={`/admin/dashboard/${slug}?create=true`} className="mt-4 inline-block text-blue-600 font-bold text-sm hover:underline">
                                            Initialize First Event →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {((institution as any).events as any[]).map((event: any) => (
                                            <div key={event.id} className="group bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-lg hover:shadow-gray-200/40">
                                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                                    <div className="w-20 h-20 rounded-3xl bg-gray-50 flex-shrink-0 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{format(new Date(event.startDate), 'MMM')}</span>
                                                        <span className="text-2xl font-normal">{format(new Date(event.startDate), 'dd')}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="px-3 py-1 bg-gray-50 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                                                                {event.category || "General"}
                                                            </span>
                                                            <span className={`w-2 h-2 rounded-full ${event.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                        </div>
                                                        <h3 className="text-xl font-medium text-gray-900 truncate pr-4">{event.title}</h3>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <p className="text-xs text-gray-400 line-clamp-1">{event.location}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-10">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Participation</p>
                                                        <p className="text-lg font-normal text-gray-900">{event._count.registrations} <span className="text-xs text-gray-400">Users</span></p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/events/${event.id}`}
                                                            target="_blank"
                                                            className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all"
                                                        >
                                                            <Eye size={18} />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/dashboard/${slug}?edit=${event.id}`}
                                                            className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-500/0 hover:shadow-blue-500/20"
                                                        >
                                                            <Settings size={18} />
                                                        </Link>
                                                        <form action={deleteEvent}>
                                                            <input type="hidden" name="eventId" value={event.id} />
                                                            <button type="submit" className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-20 flex-shrink-0"></div>
            </main>
        </div>
    );
}
