"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Download,
  Eye,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

type QuoteStatus = "pending" | "reviewed" | "accepted" | "rejected";

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  description: string;
  budget?: string;
  timeline?: string;
  status: QuoteStatus;
  createdAt: string;
}

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_BADGE: Record<QuoteStatus, string> = {
  pending: "admin-badge admin-badge-yellow",
  reviewed: "admin-badge admin-badge-blue",
  accepted: "admin-badge admin-badge-green",
  rejected: "admin-badge admin-badge-red",
};

const PER_PAGE = 10;

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // View modal state
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState<QuoteStatus>("pending");

  const fetchQuotes = () => {
    setLoading(true);
    fetch("/api/admin/quotes")
      .then((res) => res.json())
      .then((data) => {
        setQuotes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load quotes");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Open view modal
  const openView = (q: Quote) => {
    setViewQuote(q);
    setModalStatus(q.status);
  };

  const closeView = () => setViewQuote(null);

  // Update status via modal
  const handleStatusUpdate = async () => {
    if (!viewQuote) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: viewQuote.id, status: modalStatus }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setQuotes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      setViewQuote(updated);
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete
  const handleDelete = async (id: string, fromModal = false) => {
    if (!confirm("Delete this quote request permanently?")) return;
    try {
      const res = await fetch(`/api/admin/quotes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (fromModal) closeView();
      toast.success("Quote deleted");
    } catch {
      toast.error("Failed to delete quote");
    }
  };

  // CSV Export
  const handleExport = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Service", "Budget", "Timeline", "Description", "Status", "Date"];
    const rows = quotes.map((q) => [
      q.name,
      q.email,
      q.phone,
      q.company || "",
      q.service,
      q.budget || "",
      q.timeline || "",
      `"${(q.description || "").replace(/"/g, '""')}"`,
      q.status,
      new Date(q.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quote-requests-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Quotes exported to CSV");
  };

  // Filtering
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return quotes.filter((quote) => {
      const matchSearch =
        !q ||
        quote.name?.toLowerCase().includes(q) ||
        quote.email?.toLowerCase().includes(q) ||
        quote.company?.toLowerCase().includes(q) ||
        quote.service?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || quote.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quotes, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Count per status for tab badges
  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: quotes.length };
    quotes.forEach((q) => {
      counts[q.status] = (counts[q.status] || 0) + 1;
    });
    return counts;
  }, [quotes]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Quote Requests</h1>
          <p className="admin-page-subtitle">
            {quotes.length} total request{quotes.length !== 1 ? "s" : ""} received
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="admin-btn admin-btn-secondary flex items-center gap-2"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters Row */}
      <div
        className="rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--admin-text-4)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company, service..."
            className="admin-input"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        {/* Status filter count */}
        <p className="text-sm" style={{ color: "var(--admin-text-3)" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
            style={
              statusFilter === tab.value
                ? {
                    background: "var(--admin-accent-dim)",
                    color: "var(--admin-accent)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }
                : {
                    background: "transparent",
                    color: "var(--admin-text-3)",
                    border: "1px solid transparent",
                  }
            }
          >
            {tab.label}
            {countByStatus[tab.value] !== undefined && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={
                  statusFilter === tab.value
                    ? { background: "var(--admin-accent)", color: "#080F1C" }
                    : { background: "rgba(255,255,255,0.07)", color: "var(--admin-text-3)" }
                }
              >
                {countByStatus[tab.value] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="dark-shimmer"
            style={{ height: "3rem", borderBottom: "1px solid var(--admin-border)" }}
          />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="dark-shimmer"
              style={{ height: "4.5rem", borderBottom: "1px solid var(--admin-border)" }}
            />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div
          className="admin-empty rounded-2xl"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <FileText className="h-12 w-12" />
          <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>
            No quote requests found
          </p>
          <p className="text-sm mt-1">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Quote requests will appear here once submitted"}
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Requestor</th>
                <th>Service</th>
                <th className="hidden md:table-cell">Company</th>
                <th className="hidden lg:table-cell">Budget</th>
                <th>Status</th>
                <th className="hidden sm:table-cell">Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((quote) => (
                <tr key={quote.id}>
                  {/* Requestor */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: "var(--admin-accent-dim)",
                          color: "var(--admin-accent)",
                        }}
                      >
                        {quote.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate" style={{ color: "var(--admin-text-1)" }}>
                          {quote.name}
                        </div>
                        <div className="text-xs truncate" style={{ color: "var(--admin-text-3)" }}>
                          {quote.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Service */}
                  <td>
                    <span className="text-sm" style={{ color: "var(--admin-text-2)" }}>
                      {quote.service}
                    </span>
                  </td>
                  {/* Company */}
                  <td className="hidden md:table-cell">
                    <span style={{ color: "var(--admin-text-3)" }}>{quote.company || "—"}</span>
                  </td>
                  {/* Budget */}
                  <td className="hidden lg:table-cell">
                    <span style={{ color: "var(--admin-text-3)" }}>{quote.budget || "—"}</span>
                  </td>
                  {/* Status */}
                  <td>
                    <span className={STATUS_BADGE[quote.status as QuoteStatus] || "admin-badge admin-badge-muted"}>
                      {quote.status}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="hidden sm:table-cell">
                    <span style={{ color: "var(--admin-text-3)" }}>
                      {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  {/* Actions */}
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openView(quote)}
                        className="p-2 rounded-lg transition-colors"
                        title="View Details"
                        style={{ color: "var(--admin-text-3)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--admin-blue)";
                          (e.currentTarget as HTMLElement).style.background = "var(--admin-blue-dim)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)";
                          (e.currentTarget as HTMLElement).style.background = "";
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 rounded-lg transition-colors"
                        title="Delete"
                        style={{ color: "var(--admin-text-3)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--admin-red)";
                          (e.currentTarget as HTMLElement).style.background = "var(--admin-red-dim)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)";
                          (e.currentTarget as HTMLElement).style.background = "";
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--admin-text-3)" }}>
            Page {page} of {totalPages} &nbsp;·&nbsp; {filtered.length} results
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg transition-colors disabled:opacity-40"
              style={{ color: "var(--admin-text-3)", background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className="h-9 w-9 rounded-lg text-sm font-semibold transition-all"
                  style={
                    page === pageNum
                      ? { background: "var(--admin-accent)", color: "#080F1C" }
                      : {
                          background: "var(--admin-card)",
                          color: "var(--admin-text-3)",
                          border: "1px solid var(--admin-border)",
                        }
                  }
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg transition-colors disabled:opacity-40"
              style={{ color: "var(--admin-text-3)", background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* View / Detail Modal */}
      <AnimatePresence>
        {viewQuote && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={(e) => e.target === e.currentTarget && closeView()}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
              style={{
                background: "var(--admin-card)",
                border: "1px solid var(--admin-border-med)",
              }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderBottom: "1px solid var(--admin-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-base font-bold"
                    style={{ background: "var(--admin-accent-dim)", color: "var(--admin-accent)" }}
                  >
                    {viewQuote.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: "var(--admin-text-1)" }}>
                      {viewQuote.name}
                    </h3>
                    <p className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                      Quote Request Details
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeView}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "var(--admin-text-3)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "var(--admin-text-1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                    (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)";
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="overflow-y-auto flex-1 p-6 space-y-5 admin-scrollbar">
                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                  >
                    <Mail className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--admin-accent)" }} />
                    <div>
                      <p className="admin-label" style={{ marginBottom: "0.25rem" }}>Email</p>
                      <p className="text-sm break-all" style={{ color: "var(--admin-text-1)" }}>
                        {viewQuote.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                  >
                    <Phone className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--admin-blue)" }} />
                    <div>
                      <p className="admin-label" style={{ marginBottom: "0.25rem" }}>Phone</p>
                      <p className="text-sm" style={{ color: "var(--admin-text-1)" }}>
                        {viewQuote.phone}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                  >
                    <Building2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--admin-green)" }} />
                    <div>
                      <p className="admin-label" style={{ marginBottom: "0.25rem" }}>Company</p>
                      <p className="text-sm" style={{ color: "var(--admin-text-1)" }}>
                        {viewQuote.company || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                  >
                    <Briefcase className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--admin-yellow)" }} />
                    <div>
                      <p className="admin-label" style={{ marginBottom: "0.25rem" }}>Service</p>
                      <p className="text-sm" style={{ color: "var(--admin-text-1)" }}>
                        {viewQuote.service}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                  >
                    <DollarSign className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--admin-green)" }} />
                    <div>
                      <p className="admin-label" style={{ marginBottom: "0.25rem" }}>Budget</p>
                      <p className="text-sm" style={{ color: "var(--admin-text-1)" }}>
                        {viewQuote.budget || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                  >
                    <Clock className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--admin-blue)" }} />
                    <div>
                      <p className="admin-label" style={{ marginBottom: "0.25rem" }}>Timeline</p>
                      <p className="text-sm" style={{ color: "var(--admin-text-1)" }}>
                        {viewQuote.timeline || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4" style={{ color: "var(--admin-text-3)" }} />
                    <label className="admin-label" style={{ marginBottom: 0 }}>
                      Project Description
                    </label>
                  </div>
                  <div
                    className="p-4 rounded-xl text-sm leading-relaxed"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--admin-border)",
                      color: "var(--admin-text-2)",
                    }}
                  >
                    {viewQuote.description}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2" style={{ color: "var(--admin-text-3)" }}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    Submitted on{" "}
                    {new Date(viewQuote.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Status Update */}
                <div
                  className="p-4 rounded-xl space-y-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                >
                  <label className="admin-label" style={{ marginBottom: "0.5rem" }}>
                    Update Status
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as QuoteStatus)}
                      className="admin-input flex-1"
                      style={{ height: "2.5rem" }}
                    >
                      <option value="pending" style={{ background: "#0F1E36", color: "#F0F4FF" }}>
                        Pending
                      </option>
                      <option value="reviewed" style={{ background: "#0F1E36", color: "#F0F4FF" }}>
                        Reviewed
                      </option>
                      <option value="accepted" style={{ background: "#0F1E36", color: "#F0F4FF" }}>
                        Accepted
                      </option>
                      <option value="rejected" style={{ background: "#0F1E36", color: "#F0F4FF" }}>
                        Rejected
                      </option>
                    </select>
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={updatingStatus || modalStatus === viewQuote.status}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: "0.5rem 1rem", opacity: modalStatus === viewQuote.status ? 0.5 : 1 }}
                    >
                      {updatingStatus ? "Saving..." : "Save"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                      Current:
                    </span>
                    <span className={STATUS_BADGE[viewQuote.status as QuoteStatus]}>
                      {viewQuote.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderTop: "1px solid var(--admin-border)" }}
              >
                <button
                  type="button"
                  onClick={() => handleDelete(viewQuote.id, true)}
                  className="admin-btn admin-btn-danger flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={closeView}
                  className="admin-btn admin-btn-ghost"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
