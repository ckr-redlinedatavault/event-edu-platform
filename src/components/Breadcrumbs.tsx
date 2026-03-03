"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
interface BreadcrumbItem {
    label: string;
    href: string;
    active?: boolean;
}
interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                <Home size={12} />
                <span>Home</span>
            </Link>
            {items.map((item, index: number) => (
                <div key={item.href} className="flex items-center gap-2">
                    <ChevronRight size={10} className="text-slate-300" />
                    {item.active ? (
                        <span className="text-blue-600 font-black">{item.label}</span>
                    ) : (
                        <Link href={item.href} className="hover:text-blue-600 transition-colors">
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
