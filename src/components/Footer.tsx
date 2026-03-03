import Link from "next/link";
export default function Footer() {
    return (
        <footer className="bg-white pt-16 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
                <div className="space-y-6">
                    <Link href="/" className="inline-block group">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-03-03_at_00.20.57-removebg-preview.png"
                            alt="EventEdu"
                            className="h-14 w-auto object-contain group-hover:opacity-80 transition-opacity"
                        />
                    </Link>
                    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                        Building the infrastructure for the next generation of campus life. Scalable, secure, and seamless.
                    </p>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-900 mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><Link href="/events" className="hover:text-black transition-colors">Find Events</Link></li>
                        <li><Link href="/institutions" className="hover:text-black transition-colors">Institutions</Link></li>
                        <li><Link href="/features" className="hover:text-black transition-colors">Features</Link></li>
                        <li><Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-900 mb-6">Support</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><Link href="/help" className="hover:text-black transition-colors">Help Center</Link></li>
                        <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                        <li><Link href="/status" className="hover:text-black transition-colors">System Status</Link></li>
                        <li><Link href="/devs" className="hover:text-black transition-colors">Developer Portal</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-900 mb-6">Join Us</h4>
                    <p className="text-sm text-gray-500 mb-4">
                        Get the latest updates from campus events directly in your inbox.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="college@edu.com"
                            className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm w-full focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all placeholder:text-gray-400"
                        />
                        <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm hover:bg-gray-800 hover:shadow-md active:scale-95 transition-all">
                            →
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
                <p>© {new Date().getFullYear()} EventEdu. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}