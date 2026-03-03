import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import { revalidatePath } from "next/cache";
import { User, Mail, Phone, ArrowLeft, ShieldCheck, QrCode } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

export default async function EventRegistrationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id },
    }) as any;

    if (!event) notFound();

    async function registerUser(formData: FormData) {
        "use server";
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;

        if (!fullName || !email) return;

        try {
            // 1. Find or create user (as student) using raw SQL to bypass Prisma client cache issues
            const userResult: any[] = await prisma.$queryRawUnsafe(`
                INSERT INTO "User" (id, email, role, "createdAt")
                VALUES (gen_random_uuid(), $1, 'STUDENT', NOW())
                ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
                RETURNING *
            `, email);

            const user = userResult[0];

            // 2. Create Registration with Tier using raw SQL
            const tier = formData.get("tier") as string || "Standard";

            const regResult: any[] = await prisma.$queryRawUnsafe(`
                INSERT INTO "Registration" (id, "userId", "eventId", "createdAt")
                VALUES (gen_random_uuid(), $1, $2, NOW())
                ON CONFLICT ("userId", "eventId") DO UPDATE SET "userId" = EXCLUDED."userId"
                RETURNING *
            `, user.id, id);

            const registration = regResult[0];

            // 3. Create Ticket if doesn't exist
            const existingTicket = await prisma.ticket.findUnique({
                where: { registrationId: registration.id }
            });

            if (!existingTicket) {
                // Get host for absolute URL in QR code
                const host = (await headers()).get("host") || "localhost:3000";
                const protocol = host.includes("localhost") ? "http" : "https";

                // Create ticket with a stable ID first
                const tempTicket = await prisma.ticket.create({
                    data: {
                        registrationId: registration.id,
                        qrCode: "temp", // temporarily set
                        isUsed: false
                    }
                });

                // Update with full verification URL
                const qrCodeData = `${protocol}://${host}/verify/ticket/${tempTicket.id}`;

                await prisma.ticket.update({
                    where: { id: tempTicket.id },
                    data: { qrCode: qrCodeData }
                });
            }

            revalidatePath(`/events/${id}`);

            // Redirect to success page - using the real name parameter
            redirect(`/events/${id}/success?email=${email}&name=${encodeURIComponent(fullName)}`);

        } catch (error) {
            console.error("Registration error:", error);
            // In case of redirect error (which is standard behavior in server components)
            if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
            return;
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
            <Navbar />

            <main className="flex-grow pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-6">

                    <Link href={`/events/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Event Details</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                        <div className="lg:col-span-3 space-y-10">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Register for Event.</h1>
                                <p className="text-slate-500 text-sm">Secure your spot and receive your digital QR ticket instantly.</p>
                            </div>

                            <form action={registerUser} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                name="fullName"
                                                required
                                                placeholder="Enter your full name"
                                                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                placeholder="you@email.com"
                                                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                name="phone"
                                                required
                                                placeholder="+91 XXXXX XXXXX"
                                                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Select Pass Type</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {event.ticketTiers && (event.ticketTiers as any[]).length > 0 ? (
                                                (event.ticketTiers as any[]).map((tier: any, index: number) => (
                                                    <label key={index} className="relative cursor-pointer group">
                                                        <input type="radio" name="tier" value={tier.name} className="peer sr-only" defaultChecked={index === 0} />
                                                        <div className="p-4 bg-white border border-slate-100 rounded-2xl transition-all peer-checked:border-blue-600 peer-checked:ring-4 peer-checked:ring-blue-600/5 group-hover:border-slate-200">
                                                            <p className="text-xs font-bold text-slate-900">{tier.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">Official Access</p>
                                                        </div>
                                                    </label>
                                                ))
                                            ) : (
                                                <>
                                                    <label className="relative cursor-pointer group">
                                                        <input type="radio" name="tier" value="Standard" className="peer sr-only" defaultChecked />
                                                        <div className="p-4 bg-white border border-slate-100 rounded-2xl transition-all peer-checked:border-blue-600 peer-checked:ring-4 peer-checked:ring-blue-600/5 group-hover:border-slate-200">
                                                            <p className="text-xs font-bold text-slate-900">Standard</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">General Access</p>
                                                        </div>
                                                    </label>
                                                    <label className="relative cursor-pointer group">
                                                        <input type="radio" name="tier" value="VIP" className="peer sr-only" />
                                                        <div className="p-4 bg-white border border-slate-100 rounded-2xl transition-all peer-checked:border-blue-600 peer-checked:ring-4 peer-checked:ring-blue-600/5 group-hover:border-slate-200">
                                                            <p className="text-xs font-bold text-slate-900">VIP</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">Premium Access</p>
                                                        </div>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 mt-8"
                                >
                                    Confirm & Generate Ticket
                                    <ShieldCheck size={18} />
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6 sticky top-28">
                                <div className="space-y-4">
                                    <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-white">
                                        {event.banner && <img src={event.banner} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{event.category || 'Event'}</p>
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{event.title}</h3>
                                    </div>
                                </div>
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
