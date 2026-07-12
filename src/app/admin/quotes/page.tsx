"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Download, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const perPage = 10;

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then(res => res.json())
      .then(data => { setQuotes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = quotes.filter(q => 
    q.name?.toLowerCase().includes(search.toLowerCase()) ||
    q.email?.toLowerCase().includes(search.toLowerCase()) ||
    q.service?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote request?")) return;
    try {
      const res = await fetch(`/api/admin/quotes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setQuotes(quotes.filter(q => q.id !== id));
      toast.success("Quote request deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    const csv = [["Name", "Email", "Phone", "Company", "Service", "Budget", "Timeline", "Description", "Date"]];
    quotes.forEach(q => csv.push([q.name, q.email, q.phone, q.company || "", q.service, q.budget || "", q.timeline || "", q.description, q.createdAt]));
    const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "quote-requests.csv"; a.click();
    toast.success("Quotes exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold text-white">Quote Requests</h1>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:bg-secondary/90">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search quote requests..." className="w-full h-12 pl-12 pr-4 bg-card rounded-xl border border-border/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
      </div>

      <div className="space-y-3">
        {paginated.map((quote: any) => (
          <div key={quote.id} className="bg-card rounded-xl border border-border/40 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-20 h-20 bg-secondary/5 rounded-full blur-2xl" />
            <button onClick={() => setExpanded(expanded === quote.id ? null : quote.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors relative"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <span className="text-primary font-bold">{quote.name.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">{quote.name}</p>
                  <p className="text-xs text-gray-400">{quote.service} - {quote.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">{new Date(quote.createdAt).toLocaleDateString()}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(quote.id); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                {expanded === quote.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </div>
            </button>
            {expanded === quote.id && (
              <div className="px-4 pb-4 pt-0 border-t border-border/20 relative">
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div><span className="text-gray-400">Phone:</span> <span className="text-white">{quote.phone}</span></div>
                  <div><span className="text-gray-400">Company:</span> <span className="text-white">{quote.company || "-"}</span></div>
                  <div><span className="text-gray-400">Budget:</span> <span className="text-white">{quote.budget || "-"}</span></div>
                  <div><span className="text-gray-400">Timeline:</span> <span className="text-white">{quote.timeline || "-"}</span></div>
                </div>
                <div className="mt-4 p-4 bg-muted/30 border border-border/10 rounded-lg">
                  <p className="text-sm text-gray-300 leading-relaxed">{quote.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {paginated.length === 0 && <div className="text-center py-12 text-gray-400">No quote requests found</div>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`h-10 w-10 rounded-lg text-sm font-semibold transition-all ${page === i + 1 ? "bg-secondary text-primary" : "bg-card text-gray-300 hover:bg-muted/80 border border-border/40"}`}
            >{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}

