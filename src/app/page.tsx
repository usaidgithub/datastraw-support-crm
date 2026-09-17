"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

interface Ticket {
  ticket_id: string;
  customer_name: string;
  subject: string;
  status: "Open" | "In Progress" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  created_at: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClasses(status: Ticket["status"]) {
  switch (status) {
    case "Open":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "In Progress":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Closed":
      return "bg-slate-100 text-slate-600 ring-slate-500/20";
  }
}

function getStatusDotClass(status: Ticket["status"]) {
  switch (status) {
    case "Open":
      return "bg-emerald-500";
    case "In Progress":
      return "bg-amber-500";
    case "Closed":
      return "bg-slate-400";
  }
}

function getPriorityClasses(priority: Ticket["priority"]) {
  switch (priority) {
    case "Low":
      return "bg-slate-100 text-slate-600 ring-slate-500/10";
    case "Medium":
      return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";
    case "High":
      return "bg-orange-50 text-orange-700 ring-orange-600/20";
    case "Urgent":
      return "bg-rose-50 text-rose-700 ring-rose-600/20";
  }
}

export default function TicketsPage() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (response.ok) {
        setTickets(data);
      }
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Support Tickets
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage, search, and track customer support inquiries in real time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/tickets/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4 stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Ticket
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ticket ID, customer, subject..."
              className="w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="relative min-w-[180px]">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tickets Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
          {loading ? (
            /* Skeleton Loading State */
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-pulse"
                >
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-20 bg-slate-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.5h3m-6 3h6m-9-10.5h15"
                  />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-900">
                No tickets found
              </p>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                We couldn't find any tickets matching your search or active filter settings.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table Header */}
              <div className="hidden border-b border-slate-100 bg-slate-50/70 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid md:grid-cols-[1.2fr_1.5fr_1fr_0.8fr_1fr] md:gap-4">
                <div>Ticket Details</div>
                <div>Customer</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Created At</div>
              </div>

              {/* Tickets List */}
              <div className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.ticket_id}
                    onClick={() =>
                      router.push(`/tickets/${ticket.ticket_id}`)
                    }
                    className="group cursor-pointer px-6 py-4 transition-all duration-150 hover:bg-slate-50/80 active:bg-slate-100/60"
                  >
                    <div className="grid gap-3 md:grid-cols-[1.2fr_1.5fr_1fr_0.8fr_1fr] md:items-center md:gap-4">
                      {/* Ticket Info */}
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-indigo-600">
                          #{ticket.ticket_id}
                        </span>
                        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {ticket.subject}
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {ticket.customer_name}
                        </p>
                        <p className="text-xs text-slate-400 md:hidden">Customer</p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                            ticket.status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(
                              ticket.status
                            )}`}
                          />
                          {ticket.status}
                        </span>
                      </div>

                      {/* Priority Badge */}
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityClasses(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      {/* Date Created */}
                      <div className="text-xs text-slate-500">
                        {formatDate(ticket.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Counter */}
        {!loading && tickets.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium text-slate-500">
              Showing <span className="font-semibold text-slate-700">{tickets.length}</span>{" "}
              {tickets.length === 1 ? "ticket" : "tickets"}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}