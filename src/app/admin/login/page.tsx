import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export default function AdminLoginPage() {
    async function loginAdmin(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if (!email || !password) return;
        const user = await prisma.user.findUnique({
            where: { email },
            include: { institution: true }
        });
        if (!user || user.role !== "ADMIN" || !user.institutionId || !user.password || !user.institution) {
            return;
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return;

        await createSession(user.id, "ADMIN", { institutionId: user.institutionId, slug: user.institution.slug });

        redirect(`/admin/dashboard/${user.institution.slug}`);
    }
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="p-8">
                <Link href="/" className="inline-block">
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-02_at_23.46.12-removebg-preview.png"
                        alt="EventEdu"
                        className="h-10 w-auto object-contain"
                    />
                </Link>
            </nav>
            <div className="flex-grow flex items-center justify-center -mt-20 px-6">
                <div className="w-full max-w-sm space-y-10">
                    <div className="space-y-3">
                        <h1 className="text-4xl tracking-tight text-gray-900 font-normal">Welcome back.</h1>
                        <p className="text-gray-500 text-sm">Enter your administrative email to access your dashboard.</p>
                    </div>
                    <form action={loginAdmin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@institution.edu"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white rounded-full font-medium text-lg hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
                        >
                            Log In to Dashboard →
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-400">
                        Don't have an institution account? <Link href="/admin/register" className="text-blue-600 font-bold hover:underline">Register now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
