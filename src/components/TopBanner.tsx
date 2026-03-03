import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function TopBanner() {
    const latestEvents = await prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { institution: true }
    });

    if (latestEvents.length === 0) return null;

    return (
        <div className="bg-black text-white h-10 flex items-center overflow-hidden whitespace-nowrap relative z-[60]">
            <div className="flex animate-scroll-left pause-scroll gap-12 px-4">
                {[...latestEvents, ...latestEvents].map((event: any, i: number) => (
                    <Link
                        key={`${event.id}-${i}`}
                        href={`/institution/${event.institution.slug}/event/${event.id}`}
                        className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                    >
                        <span className="text-[10px] font-black uppercase bg-blue-600 px-1.5 py-0.5 rounded leading-none">New</span>
                        <span className="text-xs font-bold tracking-tight">
                            {event.title} @ <span className="uppercase">{event.institution.name}</span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
