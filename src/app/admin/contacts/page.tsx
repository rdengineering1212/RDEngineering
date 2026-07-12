"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Mail, Phone, ExternalLink, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then(res => res.json())
      .then(data => { setContacts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.message?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setContacts(contacts.filter(c => c.id !== id));
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    const csv = [["Name", "Email", "Phone", "Company", "Service", "Message", "Date"]];
    contacts.forEach(c => csv.push([c.name, c.email, c.phone || "", c.company || "", c.service || "", c.message, c.createdAt]));
    const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "contacts.csv"; a.click();
    toast.success("Contacts exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold text-white">Contact Messages</h1>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:bg-secondary/90">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts..." className="w-full h-12 pl-12 pr-4 bg-card rounded-xl border border-border/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-4 font-semibold text-white">Name</th>
                <th className="text-left p-4 font-semibold text-white">Email</th>
                <th className="text-left p-4 font-semibold text-white hidden md:table-cell">Phone</th>
                <th className="text-left p-4 font-semibold text-white hidden lg:table-cell">Service</th>
                <th className="text-left p-4 font-semibold text-white hidden lg:table-cell">Date</th>
                <th className="text-right p-4 font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {paginated.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-white">{contact.name}</td>
                  <td className="p-4"><a href={`mailto:${contact.email}`} className="text-secondary hover:underline flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</a></td>
                  <td className="p-4 hidden md:table-cell">{contact.phone ? <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-secondary"><Phone className="h-3 w-3" />{contact.phone}</a> : "-"}</td>
                  <td className="p-4 hidden lg:table-cell">{contact.service || "-"}</td>
                  <td className="p-4 hidden lg:table-cell text-gray-400">{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(contact.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && <div className="text-center py-12 text-gray-400">No contacts found</div>}
      </div>

      {/* Pagination */}
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

