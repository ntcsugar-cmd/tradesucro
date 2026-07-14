"use client";

import { useState } from "react";
import { Factory, MapPin, Gavel, Package, Tag } from "lucide-react";
import { SearchInput } from "@/components/forms/Input";
import { Card, CardBody } from "@/components/cards/Card";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import type { MarketSearchResults } from "@/lib/types/marketIntelligence";

export function MarketSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MarketSearchResults | null>(null);
  const [searching, setSearching] = useState(false);

  async function handleChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults(null);
      return;
    }
    setSearching(true);
    const result = await marketIntelligenceService.search(value);
    setSearching(false);
    setResults(result);
  }

  const hasResults =
    results && (results.mills.length || results.states.length || results.grades.length || results.tenders.length || results.offers.length);

  return (
    <div className="relative">
      <SearchInput placeholder="Search mills, states, grades, tender or offer numbers…" value={query} onChange={(e) => handleChange(e.target.value)} />

      {query.trim().length >= 2 && (
        <Card padding="none" className="absolute z-dropdown mt-2 w-full shadow-modal">
          <CardBody className="p-4 max-h-96 overflow-y-auto">
            {searching && <p className="text-[13px] text-ink-faint">Searching…</p>}
            {!searching && !hasResults && <p className="text-[13px] text-ink-faint">No matches for &ldquo;{query}&rdquo;.</p>}
            {!searching && results && (
              <div className="space-y-4">
                {results.mills.length > 0 && (
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint mb-1.5 flex items-center gap-1.5"><Factory size={11} /> Mills</p>
                    {results.mills.map((m) => (
                      <p key={m.id} className="text-[13px] text-charcoal py-1">{m.label}</p>
                    ))}
                  </div>
                )}
                {results.states.length > 0 && (
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint mb-1.5 flex items-center gap-1.5"><MapPin size={11} /> States</p>
                    {results.states.map((s) => (
                      <p key={s.value} className="text-[13px] text-charcoal py-1">{s.label}</p>
                    ))}
                  </div>
                )}
                {results.grades.length > 0 && (
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint mb-1.5 flex items-center gap-1.5"><Tag size={11} /> Grades</p>
                    {results.grades.map((g) => (
                      <p key={g} className="text-[13px] font-mono text-charcoal py-1">{g}</p>
                    ))}
                  </div>
                )}
                {results.tenders.length > 0 && (
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint mb-1.5 flex items-center gap-1.5"><Gavel size={11} /> Tenders</p>
                    {results.tenders.map((t) => (
                      <p key={t.number} className="text-[13px] text-charcoal py-1 font-mono">{t.number} <span className="font-sans text-ink-faint">· {t.millName}</span></p>
                    ))}
                  </div>
                )}
                {results.offers.length > 0 && (
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint mb-1.5 flex items-center gap-1.5"><Package size={11} /> Offers</p>
                    {results.offers.map((o) => (
                      <p key={o.number} className="text-[13px] text-charcoal py-1 font-mono">{o.number} <span className="font-sans text-ink-faint">· {o.millName}</span></p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
