"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Landmark, Building2, GraduationCap, HeartPulse, IdCard, Banknote } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

const GROUPS: { title: string; icon: React.ElementType; items: string[] }[] = [
  {
    title: "State Government",
    icon: Landmark,
    items: ["Ration Card", "Community Certificate", "Caste Certificate", "Income Certificate", "Residence Certificate", "Birth Certificate", "State Board Marksheet"],
  },
  {
    title: "Central Government",
    icon: Building2,
    items: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Income Tax Document", "Central Government Certificate"],
  },
  {
    title: "Education & Learning",
    icon: GraduationCap,
    items: ["SSLC/10th Marksheet", "HSC/12th Marksheet", "Degree Certificate", "Diploma Certificate", "Transfer Certificate", "Course Certificate", "Student ID", "Résumé"],
  },
  {
    title: "Health & Wellness",
    icon: HeartPulse,
    items: ["COVID-19 Certificate", "Health Insurance Card", "Medical Report", "Vaccination Record", "Prescription", "Disability Certificate"],
  },
  {
    title: "Identity Documents",
    icon: IdCard,
    items: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving Licence", "Birth Certificate"],
  },
  {
    title: "Banking, Financial Services & Insurance",
    icon: Banknote,
    items: ["Bank Statement", "Passbook", "Insurance Policy", "Tax Receipt", "Loan Document", "Investment Statement", "Salary Slip"],
  },
];

export default function SearchDocumentsPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return GROUPS;
    const q = query.trim().toLowerCase();
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((item) => item.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  const goToDocument = (name: string) => {
    router.push(`/documents?search=${encodeURIComponent(name)}`);
  };

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900">Search Documents</h1>

        <div className="relative mt-4 max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, categories or services..."
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:border-brand outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredGroups.map(({ title, icon: Icon, items }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-brand" />
                <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
              </div>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => goToDocument(item)}
                      className="text-sm text-slate-600 hover:text-brand hover:underline text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full text-center py-10">
              No document types match &quot;{query}&quot;.
            </p>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
