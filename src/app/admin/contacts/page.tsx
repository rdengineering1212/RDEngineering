"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Mail,
  Phone,
  Download,
  Eye,
  Check,
  RotateCcw,
  Building,
  Layers,
  X,
  FileText,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

// ── Types ────────────────────────────────────────────────
type ContactStatus = "read" | "unread";
type FilterStatus = "all" | "unread" | "read";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
  status: ContactStatus;
  createdAt: string;
}

const PER_PAGE = 10;

// ── Helper: avatar initials ───────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ── Main Component ────────────────────────────────────────
export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchContacts = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/contacts")
      .then((res) => res.json())
      .then((data: Contact[]) => {
        setContacts(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load contacts");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // ── Toggle Status ─────────────────────────────────────
  const handleToggleStatus = async (id: string, currentStatus: ContactStatus) => {
    const newStatus: ContactStatus = currentStatus === "unread" ? "read" : "unread";
    setTogglingId(id);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      if (selectedContact?.id === id) {
        setSelectedContact((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
      toast.success(`Marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this contact message?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  // ── CSV Export ────────────────────────────────────────
  const handleExport = () => {
    if (contacts.length === 0) {
      toast.error("No contacts to export");
      return;
    }
    const headers = ["Name", "Email", "Phone", "Company", "Service", "Message", "Status", "Date"];
    const rows = contacts.map((c) => [
      c.name,
      c.email,
      c.phone ?? "",
      c.company ?? "",
      c.service ?? "",
      c.message.replace(/"/g, '""'),
      c.status,
      new Date(c.createdAt).toLocaleDateString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `contacts_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Contacts exported!");
  };

  // ── Filtering + Pagination ────────────────────────────
  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      (c.company ?? "").toLowerCase().includes(q) ||
      (c.service ?? "").toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && c.status === "unread") ||
      (statusFilter === "read" && c.status === "read");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePageIndex = Math.min(page, totalPages);
  const paginated = filtered.slice((safePageIndex - 1) * PER_PAGE, safePageIndex * PER_PAGE);

  const unreadCount = contacts.filter((c) => c.status === "unread").length;
  const readCount = contacts.filter((c) => c.status === "read").length;

  const filterTabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: "all", label: "All", count: contacts.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "read", label: "Read", count: readCount },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Contact Requests</h1>
          <p className="admin-page-subtitle">
            Review incoming queries, client messages, and marketing leads.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="admin-btn admin-btn-secondary flex items-center gap-2 shrink-0"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* ── Toolbar ──────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 items-center p-4 rounded-xl"
        style={{
          background: "var(--admin-card)",
          border: "1px solid var(--admin-border)",
        }}
      >
        {/* Search */}
        <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: "var(--admin-text-4)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, company…"
            className="admin-input"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div
          className="flex gap-1.5 p-1 rounded-lg ml-auto"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
        >
          {filterTabs.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setStatusFilter(key);
                setPage(1);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all"
              style={
                statusFilter === key
                  ? {
                      background: "var(--admin-accent)",
                      color: "#080F1C",
                    }
                  : {
                      color: "var(--admin-text-3)",
                    }
              }
              onMouseEnter={(e) => {
                if (statusFilter !== key) {
                  (e.currentTarget as HTMLElement).style.color = "var(--admin-text-1)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== key) {
                  (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)";
                  (e.currentTarget as HTMLElement).style.background = "";
                }
              }}
            >
              {label}
              <span
                className="inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded text-[9px] font-bold"
                style={
                  statusFilter === key
                    ? { background: "rgba(8,15,28,0.25)", color: "#080F1C" }
                    : { background: "rgba(255,255,255,0.06)", color: "var(--admin-text-3)" }
                }
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ────────────────────────────────── */}
      {loading ? (
        /* Loading skeleton */
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="dark-shimmer"
            style={{ height: "3rem", borderBottom: "1px solid var(--admin-border)" }}
          />
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="dark-shimmer"
              style={{ height: "4.5rem", borderBottom: "1px solid var(--admin-border)" }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div
          className="admin-empty rounded-2xl"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <MessageSquare className="h-12 w-12" />
          <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>
            {search || statusFilter !== "all" ? "No matching contacts" : "No contacts yet"}
          </p>
          <p className="text-sm mt-1">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Contact submissions will appear here."}
          </p>
        </div>
      ) : (
        <>
          {/* Table wrapper */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Contact</th>
                    <th className="hidden md:table-cell">Company / Service</th>
                    <th className="hidden sm:table-cell">Received</th>
                    <th className="hidden lg:table-cell">Preview</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((contact, i) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      style={
                        contact.status === "unread"
                          ? { background: "rgba(59,130,246,0.03)" }
                          : {}
                      }
                    >
                      {/* Status badge */}
                      <td>
                        {contact.status === "unread" ? (
                          <span className="admin-badge admin-badge-blue">Unread</span>
                        ) : (
                          <span className="admin-badge admin-badge-muted">Read</span>
                        )}
                      </td>

                      {/* Contact info */}
                      <td>
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              background: "rgba(212,175,55,0.12)",
                              color: "var(--admin-accent)",
                              border: "1px solid rgba(212,175,55,0.2)",
                            }}
                          >
                            {getInitials(contact.name)}
                          </div>
                          <div className="min-w-0">
                            <div
                              className="text-sm font-semibold truncate"
                              style={{ color: "var(--admin-text-1)" }}
                            >
                              {contact.name}
                            </div>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-xs flex items-center gap-1 transition-colors"
                                style={{ color: "var(--admin-text-3)" }}
                                onMouseEnter={(e) =>
                                  ((e.currentTarget as HTMLElement).style.color = "var(--admin-blue)")
                                }
                                onMouseLeave={(e) =>
                                  ((e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)")
                                }
                              >
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate max-w-[14rem]">{contact.email}</span>
                              </a>
                              {contact.phone && (
                                <a
                                  href={`tel:${contact.phone}`}
                                  className="text-xs flex items-center gap-1 transition-colors"
                                  style={{ color: "var(--admin-text-3)" }}
                                  onMouseEnter={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color =
                                      "var(--admin-green)")
                                  }
                                  onMouseLeave={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color =
                                      "var(--admin-text-3)")
                                  }
                                >
                                  <Phone className="h-3 w-3 shrink-0" />
                                  {contact.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company / Service */}
                      <td className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div
                            className="text-xs flex items-center gap-1.5"
                            style={{ color: "var(--admin-text-2)" }}
                          >
                            <Building className="h-3 w-3 shrink-0" style={{ color: "var(--admin-text-4)" }} />
                            {contact.company ?? <span style={{ color: "var(--admin-text-4)" }}>—</span>}
                          </div>
                          <div
                            className="text-xs flex items-center gap-1.5"
                            style={{ color: "var(--admin-text-3)" }}
                          >
                            <Layers className="h-3 w-3 shrink-0" style={{ color: "var(--admin-text-4)" }} />
                            {contact.service ?? "General Inquiry"}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="hidden sm:table-cell">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--admin-text-3)" }}
                        >
                          {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Message preview */}
                      <td className="hidden lg:table-cell" style={{ maxWidth: "220px" }}>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--admin-text-3)" }}
                          title={contact.message}
                        >
                          {contact.message}
                        </p>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => setSelectedContact(contact)}
                            className="p-2 rounded-lg transition-colors"
                            title="View message"
                            style={{ color: "var(--admin-text-3)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "var(--admin-blue)";
                              (e.currentTarget as HTMLElement).style.background =
                                "var(--admin-blue-dim)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color =
                                "var(--admin-text-3)";
                              (e.currentTarget as HTMLElement).style.background = "";
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Toggle read/unread */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(contact.id, contact.status)}
                            disabled={togglingId === contact.id}
                            className="p-2 rounded-lg transition-colors"
                            title={contact.status === "unread" ? "Mark as read" : "Mark as unread"}
                            style={{ color: "var(--admin-text-3)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color =
                                "var(--admin-green)";
                              (e.currentTarget as HTMLElement).style.background =
                                "var(--admin-green-dim)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color =
                                "var(--admin-text-3)";
                              (e.currentTarget as HTMLElement).style.background = "";
                            }}
                          >
                            {contact.status === "unread" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <RotateCcw className="h-4 w-4" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(contact.id)}
                            disabled={deletingId === contact.id}
                            className="p-2 rounded-lg transition-colors"
                            title="Delete"
                            style={{ color: "var(--admin-text-3)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "var(--admin-red)";
                              (e.currentTarget as HTMLElement).style.background =
                                "var(--admin-red-dim)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color =
                                "var(--admin-text-3)";
                              (e.currentTarget as HTMLElement).style.background = "";
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Pagination ─────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                Showing{" "}
                <span style={{ color: "var(--admin-text-1)" }}>
                  {(safePageIndex - 1) * PER_PAGE + 1}–
                  {Math.min(safePageIndex * PER_PAGE, filtered.length)}
                </span>{" "}
                of <span style={{ color: "var(--admin-text-1)" }}>{filtered.length}</span>
              </p>
              <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePageIndex === 1}
                  className="p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color: "var(--admin-text-3)", border: "1px solid var(--admin-border)" }}
                  onMouseEnter={(e) => {
                    if (safePageIndex !== 1) {
                      (e.currentTarget as HTMLElement).style.color = "var(--admin-text-1)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)";
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (n) =>
                      n === 1 ||
                      n === totalPages ||
                      Math.abs(n - safePageIndex) <= 1
                  )
                  .reduce<(number | "...")[]>((acc, n, idx, arr) => {
                    if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="text-xs px-1"
                        style={{ color: "var(--admin-text-4)" }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPage(item as number)}
                        className="h-8 w-8 rounded-lg text-xs font-semibold transition-all"
                        style={
                          safePageIndex === item
                            ? {
                                background: "var(--admin-accent)",
                                color: "#080F1C",
                              }
                            : {
                                color: "var(--admin-text-3)",
                                border: "1px solid var(--admin-border)",
                              }
                        }
                        onMouseEnter={(e) => {
                          if (safePageIndex !== item) {
                            (e.currentTarget as HTMLElement).style.color =
                              "var(--admin-text-1)";
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(255,255,255,0.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (safePageIndex !== item) {
                            (e.currentTarget as HTMLElement).style.color =
                              "var(--admin-text-3)";
                            (e.currentTarget as HTMLElement).style.background = "";
                          }
                        }}
                      >
                        {item}
                      </button>
                    )
                  )}

                {/* Next */}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePageIndex === totalPages}
                  className="p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color: "var(--admin-text-3)", border: "1px solid var(--admin-border)" }}
                  onMouseEnter={(e) => {
                    if (safePageIndex !== totalPages) {
                      (e.currentTarget as HTMLElement).style.color = "var(--admin-text-1)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)";
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── View Message Modal ────────────────────── */}
      <AnimatePresence>
        {selectedContact && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedContact(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl w-full max-w-lg overflow-hidden"
              style={{
                background: "var(--admin-card)",
                border: "1px solid var(--admin-border-med)",
              }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: "1px solid var(--admin-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: "rgba(212,175,55,0.12)",
                      color: "var(--admin-accent)",
                      border: "1px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    {getInitials(selectedContact.name)}
                  </div>
                  <div>
                    <h3
                      className="text-base font-bold leading-tight"
                      style={{ color: "var(--admin-text-1)" }}
                    >
                      {selectedContact.name}
                    </h3>
                    <p className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                      Contact Query Details
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedContact.status === "unread" ? (
                    <span className="admin-badge admin-badge-blue">Unread</span>
                  ) : (
                    <span className="admin-badge admin-badge-muted">Read</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedContact(null)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: "var(--admin-text-3)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--admin-text-1)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)";
                      (e.currentTarget as HTMLElement).style.background = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto admin-scrollbar">
                {/* Info grid */}
                <div
                  className="grid grid-cols-2 gap-3 p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--admin-border)",
                  }}
                >
                  {[
                    { label: "Full Name", value: selectedContact.name },
                    {
                      label: "Date Received",
                      value: new Date(selectedContact.createdAt).toLocaleString("en-IN"),
                    },
                    {
                      label: "Email Address",
                      value: selectedContact.email,
                      href: `mailto:${selectedContact.email}`,
                    },
                    {
                      label: "Phone Number",
                      value: selectedContact.phone ?? "—",
                      href: selectedContact.phone
                        ? `tel:${selectedContact.phone}`
                        : undefined,
                    },
                    { label: "Company", value: selectedContact.company ?? "—" },
                    { label: "Service Interest", value: selectedContact.service ?? "General Inquiry" },
                  ].map(({ label, value, href }) => (
                    <div key={label}>
                      <span className="admin-label">{label}</span>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-medium break-all transition-colors"
                          style={{ color: "var(--admin-blue)" }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.textDecoration = "none")
                          }
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--admin-text-2)" }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message */}
                <div>
                  <span className="admin-label">Message</span>
                  <div
                    className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--admin-border)",
                      color: "var(--admin-text-2)",
                    }}
                  >
                    {selectedContact.message}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderTop: "1px solid var(--admin-border)" }}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleToggleStatus(selectedContact.id, selectedContact.status)
                  }
                  className="admin-btn admin-btn-secondary flex items-center gap-2"
                  disabled={togglingId === selectedContact.id}
                >
                  {selectedContact.status === "unread" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Mark as Read
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Mark as Unread
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedContact.id)}
                    className="admin-btn admin-btn-danger flex items-center gap-2"
                    disabled={deletingId === selectedContact.id}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedContact(null)}
                    className="admin-btn admin-btn-ghost"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
