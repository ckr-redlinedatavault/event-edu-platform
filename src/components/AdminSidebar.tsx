"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    PlusCircle,
    Building2,
    Eye
} from "lucide-react";
interface AdminSidebarProps {
    slug: string;
    institutionName: string;
    logo?: string | null;
}
export default function AdminSidebar({ slug, institutionName, logo }: AdminSidebarProps) {
    const pathname = usePathname();
    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: `/admin/dashboard/${slug}` },
        { label: "Events", icon: Calendar, href: `/admin/dashboard/${slug}/events` },
        { label: "Registrations", icon: Users, href: `/admin/dashboard/${slug}/registrations` },
        { label: "Settings", icon: Settings, href: `/admin/dashboard/${slug}/settings` },
    ];
    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-y-auto">
            <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white overflow-hidden shadow-lg shadow-blue-500/20 flex-shrink-0">
                    {logo ? (
                        <img src={logo} alt={institutionName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl font-normal">{institutionName[0]}</span>
                    )}
                </div>
                <div className="min-w-0">
                    <h2 className="text-sm font-bold tracking-tight text-gray-900 truncate">{institutionName}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 font-bold">Administrator</p>
                </div>
            </div>
            <nav className="flex-grow p-4 space-y-2 mt-4">
                <div className="px-4 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Menu</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive
                                ? "bg-blue-50 text-blue-600 font-bold"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
                <div className="px-4 mt-6 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quick Actions</p>
                </div>
                <Link
                    href={`/admin/dashboard/${slug}?create=true`}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    <PlusCircle size={18} />
                    <span className="text-sm">New Event</span>
                </Link>
                <Link
                    href={`/institution/${slug}`}
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    <Eye size={18} />
                    <span className="text-sm">View Public Page</span>
                </Link>
            </nav>
            <div className="p-4 border-t border-gray-50">
                <Link
                    href="/admin/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium"
                >
                    <LogOut size={18} />
                    <span className="text-sm">Log Out</span>
                </Link>
            </div>
        </aside>
    );
}
