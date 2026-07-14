"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Download, ChevronDown, ChevronUp, Briefcase, Mail, Phone, GraduationCap, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const perPage = 10;

  useEffect(() => {
    fetch("/api/admin/careers")
      .then(res => res.json())
      .then(data => { setApplications(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.position?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this application permanently?")) return;
    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setApplications(prev => prev.filter(a => a.id !== id));
      if (expanded === id) setExpanded(null);
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete application");
    }
  };

  const handleExport = () => {
    const rows = [["Name", "Email", "Phone", "Position", "Experience", "Qualification", "Date"]];
    applications.forEach(a => rows.push([a.name, a.email, a.phone, a.position, a.experience, a.qualification, new Date(a.createdAt).toLocaleDateString()]));
    const blob = new Blob([rows.map(r => r.map(v => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${applications.length} applications`);
  };

  const statusColor: Record<string, string> = {
    new: "admin-badge admin-badge-blue",
    reviewed: "admin-badge admin-badge-yellow",
    shortlisted: "admin-badge admin-badge-green",
    rejected: "admin-badge admin-badge-red",
  };

  return (
    <div className="space-y-6" style={{ color: "var(--admin-text-1)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Job Applications</h1>
          <p className="admin-page-subtitle">{applications.length} total applications received</p>
        </div>
        <button
          onClick={handleExport}
          className="admin-btn admin-btn-secondary flex items-center gap-2"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--admin-text-4)" }} />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, position, or email..."
          className="admin-input"
          style={{ paddingLeft: "2.5rem" }}
        />
      </div>

      {/* Applications */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="admin-card dark-shimmer" style={{ height: "5rem" }} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="admin-empty">
          <Briefcase className="h-12 w-12" />
          <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>No applications found</p>
          <p className="text-sm mt-1">Applications submitted via the public careers page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map((app: any) => (
            <div
              key={app.id}
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
            >
              {/* Row Header — NOT a button, use div with onClick to avoid nesting */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded === app.id}
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(expanded === app.id ? null : app.id); } }}
                className="flex items-center justify-between p-4 cursor-pointer transition-colors"
                style={{ borderBottom: expanded === app.id ? "1px solid var(--admin-border)" : undefined }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = ""}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: "rgba(34,197,94,0.1)", color: "var(--admin-green)" }}
                  >
                    {app.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--admin-text-1)" }}>{app.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--admin-text-3)" }}>
                      {app.position} &middot; {app.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-xs" style={{ color: "var(--admin-text-4)" }}>
                    {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className={statusColor[app.status] || "admin-badge admin-badge-muted"}>
                    {app.status || "new"}
                  </span>
                  {/* Delete button is a sibling of the row, NOT nested in it */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, app.id)}
                    className="p-2 rounded-lg transition-colors"
                    title="Delete application"
                    style={{ color: "var(--admin-text-4)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-red)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-red-dim)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-4)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expanded === app.id
                    ? <ChevronUp className="h-4 w-4 shrink-0" style={{ color: "var(--admin-text-4)" }} />
                    : <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--admin-text-4)" }} />}
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === app.id && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0" style={{ color: "var(--admin-text-3)" }} />
                      <div>
                        <p className="admin-label" style={{ marginBottom: "0.1rem" }}>Phone</p>
                        <p className="text-sm font-medium" style={{ color: "var(--admin-text-1)" }}>{app.phone || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="h-4 w-4 shrink-0" style={{ color: "var(--admin-text-3)" }} />
                      <div>
                        <p className="admin-label" style={{ marginBottom: "0.1rem" }}>Qualification</p>
                        <p className="text-sm font-medium" style={{ color: "var(--admin-text-1)" }}>{app.qualification || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 shrink-0" style={{ color: "var(--admin-text-3)" }} />
                      <div>
                        <p className="admin-label" style={{ marginBottom: "0.1rem" }}>Experience</p>
                        <p className="text-sm font-medium" style={{ color: "var(--admin-text-1)" }}>{app.experience || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div
                      className="rounded-lg p-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
                    >
                      <p className="admin-label" style={{ marginBottom: "0.5rem" }}>Cover Letter</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--admin-text-2)" }}>{app.coverLetter}</p>
                    </div>
                  )}

                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-secondary inline-flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className="h-9 w-9 rounded-lg text-sm font-semibold transition-all"
              style={page === i + 1 ? {
                background: "var(--admin-accent)",
                color: "#080F1C",
              } : {
                background: "var(--admin-card)",
                color: "var(--admin-text-3)",
                border: "1px solid var(--admin-border)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
