import Link from "next/link";
export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-black/80 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-02_at_23.46.12-removebg-preview.png"
                        alt="EventEdu"
                        className="h-11 w-auto object-contain group-hover:opacity-80 transition-opacity"
                    />
                </Link>
                <div className="hidden md:flex gap-8 items-center mr-auto ml-10">
                    <Link href="/events" className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                        Events
                    </Link>
                    <Link href="/institutions" className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                        Colleges
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                        About
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/login"
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-all dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                    >
                        Admin Portal
                    </Link>
                    <Link
                        href="/admin/register"
                        className="px-5 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 hover:shadow-md active:scale-95 transition-all dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}