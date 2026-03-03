"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, X, User, Image as ImageIcon, Tag, IndianRupee } from "lucide-react";
interface Judge {
    name: string;
    image: string;
}
interface TicketTier {
    name: string;
    price: number;
}
interface EventFormProps {
    eventToEdit?: any;
    institutionSlug: string;
    onSubmit: (formData: FormData) => Promise<void>;
}
export default function AdminEventForm({ eventToEdit, institutionSlug, onSubmit }: EventFormProps) {
    const [judges, setJudges] = useState<Judge[]>(
        eventToEdit?.judges ? (eventToEdit.judges as any[]) : []
    );
    const [ticketTiers, setTicketTiers] = useState<TicketTier[]>(
        eventToEdit?.ticketTiers ? (eventToEdit.ticketTiers as any[]) : []
    );
    const addJudge = () => {
        if (judges.length < 10) {
            setJudges([...judges, { name: "", image: "" }]);
        }
    };
    const removeJudge = (index: number) => {
        setJudges(judges.filter((_, i) => i !== index));
    };
    const updateJudge = (index: number, field: keyof Judge, value: string) => {
        const newJudges = [...judges];
        newJudges[index][field] = value;
        setJudges(newJudges);
    };
    const addTicketTier = () => {
        setTicketTiers([...ticketTiers, { name: "", price: 0 }]);
    };
    const removeTicketTier = (index: number) => {
        setTicketTiers(ticketTiers.filter((_, i) => i !== index));
    };
    const updateTicketTier = (index: number, field: keyof TicketTier, value: any) => {
        const newTiers = [...ticketTiers];
        (newTiers[index] as any)[field] = field === 'price' ? parseFloat(value) || 0 : value;
        setTicketTiers(newTiers);
    };
    return (
        <form
            action={async (formData) => {
                formData.append("judgesJson", JSON.stringify(judges));
                formData.append("ticketTiersJson", JSON.stringify(ticketTiers));
                await onSubmit(formData);
            }}
            className="space-y-8"
        >
            {eventToEdit && <input type="hidden" name="eventId" value={eventToEdit.id} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Event Title</label>
                        <input name="title" required defaultValue={eventToEdit?.title} placeholder="Global Tech Summit" className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Short Catchline</label>
                        <input name="shortDescription" defaultValue={eventToEdit?.shortDescription || ''} placeholder="One sentence impact statement..." className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                        <input name="category" defaultValue={eventToEdit?.category || ''} placeholder="Ex: Hackathon, Seminar" className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Venue / Location</label>
                        <input name="location" required defaultValue={eventToEdit?.location} placeholder="Block A, Auditorium" className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capacity</label>
                            <input name="maxParticipants" type="number" defaultValue={eventToEdit?.maxParticipants || ''} placeholder="500" className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Base Fee (₹)</label>
                            <input name="fee" type="number" step="0.01" defaultValue={eventToEdit?.fee || 0} placeholder="0" className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Start Date</label>
                    <input name="startDate" type="datetime-local" required defaultValue={eventToEdit?.startDate ? new Date(eventToEdit.startDate).toISOString().slice(0, 16) : ''} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">End Date</label>
                    <input name="endDate" type="datetime-local" defaultValue={eventToEdit?.endDate ? new Date(eventToEdit.endDate).toISOString().slice(0, 16) : ''} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reg. Deadline</label>
                    <input name="registrationDeadline" type="datetime-local" defaultValue={eventToEdit?.registrationDeadline ? new Date(eventToEdit.registrationDeadline).toISOString().slice(0, 16) : ''} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mode</label>
                    <select name="mode" defaultValue={eventToEdit?.mode || 'OFFLINE'} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all">
                        <option value="OFFLINE">Offline</option>
                        <option value="ONLINE">Online</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visibility</label>
                    <select name="visibility" defaultValue={eventToEdit?.visibility || 'PUBLIC'} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all">
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                        <option value="UNLISTED">Unlisted</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
                    <select name="status" defaultValue={eventToEdit?.status || 'DRAFT'} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all">
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Banner URL</label>
                <input name="banner" defaultValue={eventToEdit?.banner || ''} placeholder="https://..." className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detailed Description</label>
                <textarea name="fullDescription" rows={4} required defaultValue={eventToEdit?.fullDescription} placeholder="Event agenda, requirements, etc." className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all resize-none"></textarea>
            </div>
            <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Judges & Experts (Max 10)</label>
                    <button
                        type="button"
                        onClick={addJudge}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                    >
                        <Plus size={12} /> Add Judge
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {judges.map((judge, index) => (
                        <div key={index} className="p-4 bg-white rounded-2xl border border-gray-100 space-y-3 relative group shadow-sm hover:shadow-md transition-all">
                            <button
                                type="button"
                                onClick={() => removeJudge(index)}
                                className="absolute -top-2 -right-2 p-2 bg-red-50 text-red-500 rounded-full border border-red-100 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                            >
                                <X size={12} />
                            </button>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input
                                    value={judge.name}
                                    onChange={(e) => updateJudge(index, 'name', e.target.value)}
                                    placeholder="Judge Name"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all font-medium"
                                />
                            </div>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input
                                    value={judge.image}
                                    onChange={(e) => updateJudge(index, 'image', e.target.value)}
                                    placeholder="Image URL"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ticket Categories</label>
                    <button
                        type="button"
                        onClick={addTicketTier}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                    >
                        <Plus size={12} /> Add Tier
                    </button>
                </div>
                <div className="space-y-3">
                    {ticketTiers.map((tier, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input
                                    value={tier.name}
                                    onChange={(e) => updateTicketTier(index, 'name', e.target.value)}
                                    placeholder="Category (e.g. VIP)"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all font-medium"
                                />
                            </div>
                            <div className="relative w-40">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input
                                    type="number"
                                    value={tier.price}
                                    onChange={(e) => updateTicketTier(index, 'price', e.target.value)}
                                    placeholder="Price"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all font-medium"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeTicketTier(index)}
                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Min. Team Size</label>
                    <input name="minTeamSize" type="number" defaultValue={eventToEdit?.minTeamSize || 1} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Max. Team Size</label>
                    <input name="maxTeamSize" type="number" defaultValue={eventToEdit?.maxTeamSize || 1} className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all" />
                </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100/50">
                <input type="checkbox" name="qrEnabled" id="qrEnabled" defaultChecked={eventToEdit ? eventToEdit.qrEnabled : true} className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="qrEnabled" className="text-sm font-medium text-gray-700">Digital QR Ticketing Active</label>
            </div>
            <div className="flex gap-4 pt-4">
                <Link href={`/admin/dashboard/${institutionSlug}`} className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-full font-bold text-sm text-center active:scale-95 transition-all">
                    Discard Changes
                </Link>
                <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">
                    {eventToEdit ? 'Synchronize Updates →' : 'Finalize & Deploy Module →'}
                </button>
            </div>
        </form>
    );
}
