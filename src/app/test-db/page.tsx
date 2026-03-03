import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
export const dynamic = "force-dynamic";

export default async function TestDBPage() {
    const users = await prisma.user.findMany({
        include: { institution: true },
        orderBy: { createdAt: "desc" },
    });

    const institutions = await prisma.institution.findMany();

    async function addUser(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        const role = formData.get("role") as Role;
        const institutionId = formData.get("institutionId") as string;

        if (!email || !role) return;

        try {
            await prisma.user.create({
                data: {
                    email,
                    role,
                    institutionId: institutionId || null
                },
            });
            revalidatePath("/test-db");
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    async function addInstitution(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;

        if (!name || !slug) return;

        try {
            await prisma.institution.create({
                data: { name, slug },
            });
            revalidatePath("/test-db");
        } catch (error) {
            console.error("Error adding institution:", error);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black dark:text-white pb-20">
            <div className="mx-auto max-w-4xl space-y-8">
                <h1 className="text-4xl font-bold tracking-tight text-center">Platform Core Test</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Institution Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                        <h2 className="text-xl font-bold mb-6">1. Create Institution</h2>
                        <form action={addInstitution} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    name="name"
                                    placeholder="CMR Engineering College"
                                    className="w-full p-2 rounded-lg border border-zinc-300 dark:bg-black dark:border-zinc-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug</label>
                                <input
                                    name="slug"
                                    placeholder="cmrec"
                                    className="w-full p-2 rounded-lg border border-zinc-300 dark:bg-black dark:border-zinc-700"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
                            >
                                Create Institution
                            </button>
                        </form>
                    </div>

                    {/* User Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                        <h2 className="text-xl font-bold mb-6">2. Create User</h2>
                        <form action={addUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="admin@cmrec.edu"
                                    className="w-full p-2 rounded-lg border border-zinc-300 dark:bg-black dark:border-zinc-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select
                                    name="role"
                                    className="w-full p-2 rounded-lg border border-zinc-300 dark:bg-black dark:border-zinc-700 font-mono text-sm"
                                    required
                                >
                                    <option value={Role.STUDENT}>STUDENT</option>
                                    <option value={Role.ADMIN}>ADMIN</option>
                                    <option value={Role.SUPER_ADMIN}>SUPER_ADMIN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Institution (Optional)</label>
                                <select
                                    name="institutionId"
                                    className="w-full p-2 rounded-lg border border-zinc-300 dark:bg-black dark:border-zinc-700"
                                >
                                    <option value="">None</option>
                                    {institutions.map((inst: any) => (
                                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors w-full dark:bg-white dark:text-black"
                            >
                                Add User
                            </button>
                        </form>
                    </div>
                </div>

                {/* User List */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold mb-4">Platform Users</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {users.length === 0 ? (
                            <p className="text-zinc-500 italic col-span-2 text-center py-8">No users found. Run the SQL script in Supabase first.</p>
                        ) : (
                            users.map((user: any) => (
                                <div
                                    key={user.id}
                                    className="p-4 rounded-xl border border-zinc-100 bg-zinc-50 flex flex-col dark:bg-zinc-800 dark:border-zinc-700"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <p className="text-[10px] text-zinc-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="font-medium truncate">{user.email}</p>
                                    {user.institution && (
                                        <p className="text-xs text-zinc-500 mt-1">
                                            🏢 {user.institution.name}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
