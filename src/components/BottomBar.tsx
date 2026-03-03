"use client";
import React from "react";
const BottomBanner = () => {
    return (
        <footer className="w-full bg-blue-600 border-t border-blue-500/30 py-8 pb-14 md:pb-8 font-sans">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
                        <div className="flex items-center gap-3">
                            <span className="text-white/70 text-[10px] uppercase tracking-[0.25em] font-semibold">
                                Technical Partner
                            </span>
                            <a
                                href="https://redlix.co.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center transition-all duration-300 ease-in-out"
                            >
                                <img
                                    src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1772213103/Screenshot_2026-02-27_at_22.54.43-removebg-preview_jeh6kc.png"
                                    alt="Technical Partner Logo"
                                    className="h-8 w-auto transition-transform hover:scale-105 duration-300"
                                />
                            </a>
                        </div>
                        <div className="hidden sm:block h-5 w-[1px] bg-white/40" />
                        <div className="flex items-center gap-2.5 text-white/70">
                            <span className="text-[12px] font-medium tracking-wide">
                                Designed and Maintained by Redlix Systems
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                        <a
                            href="https://redlix.co.in/support"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-2 bg-white text-slate-950 hover:bg-slate-100 transition-all duration-300 text-[13px] font-medium rounded-none shadow-sm"
                        >
                            Help & Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default BottomBanner;