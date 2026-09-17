"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

interface Note {
  note_id: string;
  note_text: string;
  created_at: string;
}

interface Ticket {
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  created_at: string;
  updated_at: string;
  notes: Note[];
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

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();

  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await fetch(`/api/tickets/${ticketId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch ticket.");
          return;
        }

        setTicket(data);
        setStatus(data.status);
        setPriority(data.priority);
      } catch (error) {
        console.error("Fetch ticket error:", error);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [ticketId]);

  async function handleUpdate() {
    if (!ticket) return;

    setError("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const body: {
        status?: string;
        priority?: string;
        note?: string;
      } = {
        status,
        priority,
      };

      if (note.trim()) {
        body.note = note.trim();
      }

      const response = await fetch(`/api/tickets/${ticket.ticket_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update ticket.");
        return;
      }

      setSuccessMessage("Ticket updated successfully.");
      setNote("");

      const updatedResponse = await fetch(
        `/api/tickets/${ticket.ticket_id}`
      );

      const updatedTicket = await updatedResponse.json();

      if (updatedResponse.ok) {
        setTicket(updatedTicket);
        setStatus(updatedTicket.status);
        setPriority(updatedTicket.priority);
      }
    } catch (error) {
      console.error("Update ticket error:", error);
      setError("Something went wrong while updating the ticket.");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-5xl py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-28 bg-slate-200 rounded"></div>
            <div className="h-8 w-3/4 bg-slate-200 rounded-lg"></div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-64 bg-slate-200 rounded-2xl lg:col-span-2"></div>
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !ticket) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl py-12">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Error Loading Ticket
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {error || "Ticket not found."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/tickets")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              ← Back to Tickets
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/tickets")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Tickets
          </button>
        </div>

        {/* Ticket Title & Badges Header */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-1">
              <span className="font-mono text-xs font-semibold text-indigo-600">
                #{ticket.ticket_id}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {ticket.subject}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
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

              <span
                className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getPriorityClasses(
                  ticket.priority
                )}`}
              >
                {ticket.priority} Priority
              </span>
            </div>
          </div>
        </div>

        {/* Global Feedback Banners */}
        {(error || successMessage) && (
          <div>
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
                <svg
                  className="h-5 w-5 shrink-0 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3a9 9 0 100 18 9 9 0 000-18z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMessage && !error && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                <svg
                  className="h-5 w-5 shrink-0 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Description & Activity Feed */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description Card */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h12"
                  />
                </svg>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  Issue Description
                </h3>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {ticket.description}
              </p>
            </section>

            {/* Notes & Activity Feed */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Activity & Internal Notes
                  </h3>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {ticket.notes.length}
                </span>
              </div>

              {ticket.notes.length === 0 ? (
                <p className="text-center py-6 text-sm text-slate-400 italic">
                  No internal notes added yet. Use the field below to leave updates.
                </p>
              ) : (
                <div className="space-y-4">
                  {ticket.notes.map((n) => (
                    <div
                      key={n.note_id}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2 transition-all hover:border-slate-200"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">
                            Last Updated
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400">
                          {formatDate(n.created_at)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-slate-700 leading-normal pl-8">
                        {n.note_text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Note Input Area */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <label
                  htmlFor="note"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Add Internal Note
                </label>

                <textarea
                  id="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="Type updates or resolution details..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={saving || !note.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                  >
                    {saving ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add Note</span>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Customer Info & Ticket Control Sidebar */}
          <aside className="space-y-6">
            {/* Customer Details */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  Customer Profile
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Name</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {ticket.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">Email Address</p>
                  <p className="mt-0.5 break-all text-sm font-medium text-indigo-600 hover:underline">
                    {ticket.customer_email}
                  </p>
                </div>
              </div>
            </section>

            {/* Ticket Controls & Metadata */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12H7.5"
                  />
                </svg>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  Ticket Status & Controls
                </h3>
              </div>

              <div className="space-y-4">
                {/* Status Dropdown */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Ticket Status
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Priority Dropdown */}
                <div>
                  <label
                    htmlFor="priority"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Priority Level
                  </label>
                  <div className="relative">
                    <select
                      id="priority"
                      value={priority}
                      onChange={(event) => setPriority(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Metadata Timestamps */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Created Date
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-700">
                      {formatDate(ticket.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Last Updated
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-700">
                      {formatDate(ticket.updated_at)}
                    </p>
                  </div>
                </div>

                {/* Save Changes Button */}
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}