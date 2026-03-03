"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface TicketDownloadButtonProps {
    ticketId: string;
}

export default function TicketDownloadButton({ ticketId }: TicketDownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadTicket = async () => {
        try {
            setIsDownloading(true);
            const ticketElement = document.getElementById("ticket-pass");
            if (!ticketElement) {
                console.error("Ticket element not found");
                return;
            }

            // High scale for better quality
            const canvas = await html2canvas(ticketElement, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
                logging: false,
                windowWidth: ticketElement.scrollWidth,
                windowHeight: ticketElement.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");

            // Create PDF based on ticket proportions
            // A long horizontal ticket like this is roughly 3:1 aspect ratio
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width / 2, canvas.height / 2]
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`Ticket-${ticketId.substring(0, 8)}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={downloadTicket}
            disabled={isDownloading}
            className="group relative w-full py-3.5 bg-slate-900 text-white font-bold text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isDownloading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                </>
            ) : (
                <>
                    <Download size={14} strokeWidth={2.5} />
                    Download PDF Pass
                </>
            )}
        </button>
    );
}
