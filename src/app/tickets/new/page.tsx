"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function NewTicketPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          subject,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create ticket.");
        return;
      }

      router.push(`/tickets/${data.ticket_id}`);
    } catch (error) {
      console.error("Create ticket error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
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

        {/* Page Header */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Create New Support Ticket
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Submit customer details and issue summary to log a new ticket into the system.
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8"
        >
          <div className="space-y-6">
            {/* Customer Information Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Customer Name <span className="text-rose-500">*</span>
                  </label>

                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    required
                    placeholder="e.g. John Smith"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerEmail"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Customer Email <span className="text-rose-500">*</span>
                  </label>

                  <input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Ticket Information Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ticket Details
              </h3>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Issue Title / Subject <span className="text-rose-500">*</span>
                </label>

                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                  placeholder="e.g. Payment failed during checkout"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Detailed Description <span className="text-rose-500">*</span>
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  rows={5}
                  placeholder="Provide a full summary of the issue experienced by the customer..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Error Banner */}
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

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => router.push("/tickets")}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
              >
                {loading ? (
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
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Ticket</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}