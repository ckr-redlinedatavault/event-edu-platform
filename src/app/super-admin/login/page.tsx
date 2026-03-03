import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
export default function SuperAdminLoginPage() {
    async function loginSuperAdmin(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const correctEmail = process.env.SUPER_ADMIN_EMAIL;
        const correctPassword = process.env.SUPER_ADMIN_PASSWORD;
        if (email === correctEmail && password === correctPassword) {
            const cookieStore = await cookies();
            cookieStore.set("super_admin_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, 
                path: "/",
            });
            redirect("/super-admin/dashboard");
        } else {
            redirect("/super-admin/login?error=invalid_credentials");
        }
    }
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 font-sans">
            <div className="w-full max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl space-y-10 border border-slate-200">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h1 className="text-3xl font-normal tracking-tight text-slate-900 mt-6">Super Admin access.</h1>
                    <p className="text-slate-400 text-sm">Elevated privileges required for global system management.</p>
                </div>
                <form action={loginSuperAdmin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Master Identifier</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="superadmin@eventedu.com"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-500/30 focus:ring-4 focus:ring-red-500/5 transition-all text-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Master Secret Key</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-500/30 focus:ring-4 focus:ring-red-500/5 transition-all text-slate-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-black shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all"
                    >
                        Authenticate →
                    </button>
                </form>
                <div className="text-center">
                    <Link href="/" className="text-xs text-slate-400 hover:text-slate-900 font-medium transition-colors">
                        ← Exit Secure Zone
                    </Link>
                </div>
            </div>
            <p className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Secure Central Intelligence</p>
        </div>
    );
}
