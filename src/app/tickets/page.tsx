"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useRouter } from "next/navigation";
interface Ticket {
    ticket_id: string;
    customer_name: string;
    subject: string;
    status: "Open" | "In Progress" | "Closed";
    priority: "Low" | "Medium" | "High" | "Urgent";
    created_at: string;
}

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    async function fetchTickets() {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (status !== "All") {
                params.set("status", status);
            }

            if (search.trim()) {
                params.set("search", search.trim());
            }

            const query = params.toString();

            const response = await fetch(
                query ? `/api/tickets?${query}` : "/api/tickets"
            );

            const data = await response.json();

            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchTickets();
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, status]);

    return (
        <AppShell>
            <div>
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Tickets
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage and track customer support tickets.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search tickets..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:flex-1"
                    />

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div className="mt-6 rounded-xl border border-gray-200 bg-white">
                    {loading ? (
                        <div className="p-6 text-sm text-gray-500">
                            Loading tickets...
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="p-6 text-sm text-gray-500">
                            No tickets found.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.ticket_id}
                                    onClick={() => router.push(`/tickets/${ticket.ticket_id}`)}
                                    className="cursor-pointer p-5 transition hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {ticket.subject}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {ticket.ticket_id} · {ticket.customer_name}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {ticket.status}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Priority: {ticket.priority}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}