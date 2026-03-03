import Link from "next/link";
export default function Hero() {
    return (
        <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 px-6 overflow-hidden bg-white">
            <div className="absolute top-10 left-0 w-[400px] h-[400px] bg-gray-50 rounded-full blur-3xl opacity-60 pointer-events-none -z-10"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center relative z-10">
                <div className="flex flex-col items-start space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Next-Gen Event Hosting
                    </div>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl tracking-tight text-gray-900 leading-[1.15]">
                        Elevate Your <br />
                        Campus Experience.
                    </h1>
                    <p className="text-base lg:text-lg text-gray-600 max-w-md leading-relaxed">
                        Connect your institution to a global network of talent. Manage venues, tickets, and attendees with clean, precision engineering.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
                        <Link
                            href="/events"
                            className="px-7 py-3 bg-black text-white rounded-full text-sm text-center hover:bg-gray-800 hover:shadow-md active:scale-95 transition-all font-medium"
                        >
                            Browse Live Events
                        </Link>
                        <Link
                            href="/admin/register"
                            className="px-7 py-3 bg-white text-gray-900 border border-gray-200 rounded-full text-sm text-center hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all font-medium"
                        >
                            Register Institution
                        </Link>
                    </div>
                    <div className="pt-6 flex items-center gap-8 border-t border-gray-100 w-full md:w-auto mt-2 text-gray-900 font-medium">
                        <div>
                            <div className="text-xl">500+</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 font-bold">Colleges</div>
                        </div>
                        <div>
                            <div className="text-xl">12M+</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 font-bold">Registrations</div>
                        </div>
                        <div>
                            <div className="text-xl">100%</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 font-bold">Automated</div>
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-[280px] lg:h-[450px] flex items-center justify-center lg:justify-end">
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/college%20project-rafiki.svg"
                        alt="Event Management Illustration"
                        className="w-full h-full object-contain drop-shadow-xl"
                    />
                </div>
            </div>
        </section>
    );
}