import { prisma } from "@/lib/db";

export default async function EventTicker() {
    const latestEvents = await prisma.event.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { institution: true }
    });

    const placeholderEvents = [
        { id: 'p1', title: 'Tech Symposium 2024', institution: { name: 'MIT', slug: 'mit' } },
        { id: 'p2', title: 'Annual Cultural Fest', institution: { name: 'Stanford', slug: 'stanford' } },
        { id: 'p3', title: 'Blockchain Workshop', institution: { name: 'Harvard', slug: 'harvard' } },
        { id: 'p4', title: 'Global Career Fair', institution: { name: 'Oxford', slug: 'oxford' } },
        { id: 'p5', title: 'AI Research Summit', institution: { name: 'CMU', slug: 'cmu' } },
    ];

    const events = latestEvents.length > 0 ? latestEvents : placeholderEvents;

    return (
        <div className="relative w-full bg-blue-600 overflow-hidden py-3 border-y border-blue-500/50">
            {/* 
          Infinite Scroll Implementation:
          1. We use a container that is 'w-fit' (fit-content).
          2. We render the items twice (two identical 'divs').
          3. We animate from translateX(0) to translateX(-50%) per global CSS 'animate-scroll-left'.
      */}
            <div className="flex w-fit items-center animate-scroll-left pause-scroll">
                {/* Set 1 */}
                <div className="flex items-center gap-16 px-8 shrink-0">
                    {events.map((event, i) => (
                        <div key={`${event.id}-${i}`} className="flex items-center gap-4 group cursor-pointer">
                            <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white/90 border border-white/10 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                Recent
                            </span>
                            <p className="text-white text-sm font-bold tracking-tight">
                                {event.title} <span className="text-blue-200 font-medium opacity-80 mx-1">at</span> <span className="uppercase tracking-tighter">{event.institution.name}</span>
                            </p>
                            <div className="w-1 h-1 bg-white/30 rounded-full mx-4" />
                        </div>
                    ))}
                </div>

                {/* Set 2 (Identical for seamless looping) */}
                <div className="flex items-center gap-16 px-8 shrink-0">
                    {events.map((event, i) => (
                        <div key={`${event.id}-dup-${i}`} className="flex items-center gap-4 group cursor-pointer">
                            <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white/90 border border-white/10 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                Recent
                            </span>
                            <p className="text-white text-sm font-bold tracking-tight">
                                {event.title} <span className="text-blue-200 font-medium opacity-80 mx-1">at</span> <span className="uppercase tracking-tighter">{event.institution.name}</span>
                            </p>
                            <div className="w-1 h-1 bg-white/30 rounded-full mx-4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
