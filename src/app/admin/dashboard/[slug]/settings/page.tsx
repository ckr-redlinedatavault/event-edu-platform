import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminSidebar from "@/components/AdminSidebar";
import { revalidatePath } from "next/cache";
import { Settings as SettingsIcon, Building, FileText, ImageIcon, Save } from "lucide-react";
interface Props {
    params: Promise<{ slug: string }>;
}
export default async function AdminSettingsPage({ params }: Props) {
    const { slug } = await params;
    const institution = await prisma.institution.findUnique({
        where: { slug }
    });
    if (!institution) notFound();
    async function updateInstitution(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const logo = formData.get("logo") as string;
        await prisma.institution.update({
            where: { id: institution!.id },
            data: { name, description, logo }
        });
        revalidatePath(`/admin/dashboard/${slug}/settings`);
        revalidatePath(`/admin/dashboard/${slug}`);
        revalidatePath(`/institution/${slug}`);
        redirect(`/admin/dashboard/${slug}/settings`);
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
                                    { label: "Dashboard", href: `/admin/dashboard/${slug}` },
                                    { label: "Settings", href: "#", active: true }
                                ]}
                            />
                            <h1 className="text-3xl font-normal tracking-tight text-gray-900 leading-tight">
                                Workspace <span className="text-blue-600">Preferences.</span>
                            </h1>
                        </div>
                    </div>
                </header>
                <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/50">
                        <form action={updateInstitution} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building className="text-blue-600" size={18} />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Identity</label>
                                    </div>
                                    <input
                                        name="name"
                                        defaultValue={institution.name}
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="text-blue-600" size={18} />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Statement / Description</label>
                                    </div>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        defaultValue={institution.description || ''}
                                        className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all resize-none leading-relaxed"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ImageIcon className="text-blue-600" size={18} />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logo Repository Link</label>
                                        </div>
                                        <input
                                            name="logo"
                                            defaultValue={institution.logo || ''}
                                            placeholder="Cloudinary/Unsplash URL..."
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
                                    <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex flex-col items-center justify-center gap-4">
                                        {institution.logo ? (
                                            <img src={institution.logo} alt="Preview" className="w-20 h-20 rounded-2xl object-cover shadow-xl shadow-blue-500/10" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-200">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Brand Preview.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                                <button type="submit" className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-2xl shadow-blue-500/20 hover:shadow-blue-600/30 active:scale-95 transition-all">
                                    <Save size={18} /> Update Workspace Core →
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-12 p-10 bg-red-50/30 rounded-[3rem] border border-red-100/30 border-dashed">
                        <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-xs text-red-400 mb-6 font-medium">Resetting institutional configurations is irreversible.</p>
                        <button className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                            Request Data Purge
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
