import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import bcrypt from "bcryptjs";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";
import Footer from "@/components/Footer";

export default async function InstitutionRegisterPage() {
    async function registerInstitution(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const email = formData.get("adminEmail") as string;
        const logo = formData.get("logo") as string;
        const password = formData.get("password") as string;
        const description = formData.get("description") as string;

        if (!name || !slug || !email || !password) return;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            // 0. Check for existing slug
            const existing = await prisma.institution.findUnique({
                where: { slug }
            });

            if (existing) {
                console.error("Slug already taken");
                return;
            }

            // 1. Create Institution
            const inst = await prisma.institution.create({
                data: { name, slug, description, logo },
            });

            // 2. Create Admin User linked to this institution
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: "ADMIN",
                    institutionId: inst.id
                }
            });

            revalidatePath("/");
        } catch (error) {
            console.error("Failed to register institution:", error);
            return;
        }

        redirect(`/institution/${slug}`);
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 py-12">

                    {/* Left: Registration Form */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-normal leading-tight">
                                Onboard Your <br /> Institution.
                            </h1>
                            <p className="text-gray-500 text-lg max-w-md">
                                Launch your official digital event infrastructure in less than two minutes.
                            </p>
                        </div>

                        <form action={registerInstitution} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">College Name</label>
                                    <input
                                        name="name"
                                        required
                                        placeholder="Ex: MIT University"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unique Slug</label>
                                    <input
                                        name="slug"
                                        required
                                        placeholder="Ex: mit-edu"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Email</label>
                                <input
                                    name="adminEmail"
                                    required
                                    type="email"
                                    placeholder="admin@institution.edu"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-400"
                                />
                                <p className="text-[10px] text-gray-400">This email will have full administrative access.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Password</label>
                                <input
                                    name="password"
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institution Logo URL</label>
                                <input
                                    name="logo"
                                    placeholder="https://example.com/logo.png"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Short Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Tell students about your institution..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-blue-600 text-white rounded-full font-medium text-lg hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
                            >
                                Create Institution →
                            </button>
                        </form>
                    </div>

                    {/* Right: Feature Highlights */}
                    <div className="bg-gray-50 rounded-[2.5rem] p-10 lg:p-12 flex flex-col justify-center space-y-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-600 text-[10px] uppercase tracking-widest font-bold w-fit">
                            Onboarding Benefits
                        </div>

                        <div className="grid gap-8">
                            {[
                                {
                                    title: "Automated Ticket Systems.",
                                    desc: "Generate unique QR codes for every attendee automatically.",
                                    icon: (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 9V5.2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V9"></path>
                                            <path d="M2 15V18.8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V15"></path>
                                            <path d="M2 9a3 3 0 0 1 0 6"></path>
                                            <path d="M22 9a3 3 0 0 0 0 6"></path>
                                            <line x1="12" y1="9" x2="12" y2="15"></line>
                                        </svg>
                                    )
                                },
                                {
                                    title: "Custom Branded Showcase.",
                                    desc: "Get your own dedicated public page with your colors and logo.",
                                    icon: (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="3" y1="9" x2="21" y2="9"></line>
                                            <line x1="9" y1="21" x2="9" y2="9"></line>
                                        </svg>
                                    )
                                },
                                {
                                    title: "Real-time Analytics.",
                                    desc: "Monitor registrations and attendance from your admin portal.",
                                    icon: (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="20" x2="18" y2="10"></line>
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="14"></line>
                                        </svg>
                                    )
                                },
                                {
                                    title: "Secure Data Hosting.",
                                    desc: "Enterprise-grade security for student information and privacy.",
                                    icon: (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    )
                                }
                            ].map((point, idx) => (
                                <div key={idx} className="flex gap-5 group">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        {point.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-medium text-gray-900 leading-tight">{point.title}</h3>
                                        <p className="text-gray-500 text-xs leading-relaxed">{point.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-200 mt-auto">
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-3">Trusted by Institutions Worldwide</p>
                            <div className="flex gap-6 grayscale opacity-40">
                                <div className="text-lg font-bold">Harvard</div>
                                <div className="text-lg font-bold">Stanford</div>
                                <div className="text-lg font-bold">MIT</div>
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
