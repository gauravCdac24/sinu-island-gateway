import React, { useEffect, useMemo, useState } from "react";
import {
  fetchPublishedTenders,
  tenderDocumentUrl,
  type PublicTender,
} from "@/lib/tendersApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Building2, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const TendersList = () => {
  const [items, setItems] = useState<PublicTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "tender" | "eoi">("all");
  const [dateSort, setDateSort] = useState<"closing_asc" | "closing_desc">("closing_asc");
  const [showClosed, setShowClosed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await fetchPublishedTenders({
          type: typeFilter === "all" ? "" : typeFilter,
          sort: dateSort,
          includeClosed: showClosed,
        });
        if (!cancelled) setItems(rows);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [typeFilter, dateSort, showClosed]);

  const openCount = useMemo(() => items.filter((i) => !i.isClosed).length, [items]);

  return (
    <section id="tenders-list" className="scroll-mt-24 bg-[#f4f7fb] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="bg-[#082952] text-white rounded-t-lg pb-6">
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#ffb703]" aria-hidden />
              Current Tenders &amp; EOI
            </CardTitle>
            <p className="text-[#8ecae6] text-sm mt-2 font-normal">
              {openCount} open {openCount === 1 ? "listing" : "listings"} — filter by type or closing
              date. Click a document link to view the PDF in your browser.
            </p>
          </CardHeader>

          <CardContent className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:flex-wrap md:items-end">
              <div className="flex flex-1 flex-col gap-2 min-w-[160px]">
                <Label htmlFor="type-filter" className="text-xs font-semibold text-[#082952]">
                  Type
                </Label>
                <Select
                  value={typeFilter}
                  onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
                >
                  <SelectTrigger id="type-filter" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="tender">Tenders only</SelectItem>
                    <SelectItem value="eoi">EOI only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-1 flex-col gap-2 min-w-[180px]">
                <Label htmlFor="date-sort" className="text-xs font-semibold text-[#082952]">
                  Closing date
                </Label>
                <Select
                  value={dateSort}
                  onValueChange={(v) => setDateSort(v as typeof dateSort)}
                >
                  <SelectTrigger id="date-sort" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="closing_asc">Soonest first</SelectItem>
                    <SelectItem value="closing_desc">Latest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pb-0.5">
                <input
                  id="show-closed"
                  type="checkbox"
                  checked={showClosed}
                  onChange={(e) => setShowClosed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#082952]"
                />
                <Label htmlFor="show-closed" className="text-sm cursor-pointer">
                  Include closed
                </Label>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-[#22a2bf]" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No published tenders or expressions of interest match your filters.
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <TenderCard key={item.id} item={item} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

function TenderCard({ item }: { item: PublicTender }) {
  const typeLabel = item.type === "eoi" ? "Expression of Interest" : "Tender";

  return (
    <li
      className={cn(
        "rounded-xl border bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md",
        item.isClosed ? "border-gray-200 opacity-90" : "border-[#22a2bf]/30"
      )}
    >
      <div className="flex">
        <div
          className={cn(
            "w-1.5 shrink-0",
            item.type === "eoi" ? "bg-[#219ebc]" : "bg-[#ffb703]"
          )}
          aria-hidden
        />
        <div className="flex-1 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-semibold",
                    item.type === "eoi"
                      ? "bg-[#219ebc]/15 text-[#0b3d5c]"
                      : "bg-[#ffb703]/20 text-[#082952]"
                  )}
                >
                  {typeLabel}
                </Badge>
                {item.isClosed && (
                  <Badge variant="outline" className="text-xs text-gray-600">
                    Closed
                  </Badge>
                )}
                {item.referenceNo && (
                  <span className="text-xs text-muted-foreground">Ref: {item.referenceNo}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-[#082952]">{item.title}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#082952] shrink-0">
              <Calendar className="h-4 w-4 text-[#22a2bf]" aria-hidden />
              <span>Closes {item.closingDateFormatted}</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-4">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-[#ffb703]" aria-hidden />
              {item.department}
            </span>
          </div>

          {item.documents.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#082952] mb-2">
                Supporting documents
              </p>
              <ul className="flex flex-wrap gap-2">
                {item.documents.map((doc) => (
                  <li key={doc.id}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 border-[#22a2bf]/40 text-[#082952] hover:bg-[#edf4ff]"
                      asChild
                    >
                      <a
                        href={tenderDocumentUrl(doc.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-3.5 w-3.5" aria-hidden />
                        {doc.label}
                        <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default TendersList;
