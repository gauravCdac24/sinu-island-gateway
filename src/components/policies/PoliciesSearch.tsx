import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Search, FileText, Eye, Download, Loader2, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/apiBase';

export type PolicyCategoryId =
  | 'all'
  | 'academic'
  | 'student'
  | 'staff'
  | 'research'
  | 'finance'
  | 'safety'
  | 'it'
  | 'general';

interface PolicyFileMeta {
  _id: string;
  filename: string;
  mimetype: string;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORY_RULES: { id: Exclude<PolicyCategoryId, 'all'>; keywords: RegExp }[] = [
  {
    id: 'academic',
    keywords:
      /academic|curriculum|assessment|exam|grade|credit|course|teaching|handbook|siqf|programme|program/i,
  },
  {
    id: 'student',
    keywords:
      /student|enrol|enroll|conduct|discipline|appeal|admission|scholarship|graduat|exclusion/i,
  },
  {
    id: 'staff',
    keywords: /staff|hr\b|human resource|employment|leave|salary|recruit|performance review/i,
  },
  {
    id: 'research',
    keywords: /research|ethics|hrec|integrity|publication|hdr|thesis/i,
  },
  {
    id: 'finance',
    keywords: /finance|fee|payment|budget|procurement|purchase|audit|invoice|travel claim/i,
  },
  {
    id: 'safety',
    keywords: /safety|health|emergency|fire|whs|ohs|evacuation|first aid|hazard/i,
  },
  {
    id: 'it',
    keywords:
      /\bit\b|data protection|privacy|information technology|network|cyber|computer use|email policy|password/i,
  },
];

const FILTER_OPTIONS: { id: PolicyCategoryId; label: string }[] = [
  { id: 'all', label: 'All types' },
  { id: 'academic', label: 'Academic' },
  { id: 'student', label: 'Student' },
  { id: 'staff', label: 'Staff & HR' },
  { id: 'research', label: 'Research' },
  { id: 'finance', label: 'Finance' },
  { id: 'safety', label: 'Health & safety' },
  { id: 'it', label: 'IT & data' },
  { id: 'general', label: 'General' },
];

const CATEGORY_BADGE_CLASS: Record<Exclude<PolicyCategoryId, 'all'>, string> = {
  academic: 'bg-university-blue/15 text-university-dark-gray border-university-blue/30',
  student: 'bg-university-light-blue/40 text-university-dark-gray border-university-blue/25',
  staff: 'bg-university-green/20 text-university-dark-gray border-university-green/40',
  research: 'bg-amber-100 text-amber-950 border-amber-200',
  finance: 'bg-emerald-100 text-emerald-950 border-emerald-200',
  safety: 'bg-red-100 text-red-950 border-red-200',
  it: 'bg-violet-100 text-violet-950 border-violet-200',
  general: 'bg-gray-100 text-gray-800 border-gray-200',
};

function inferCategory(filename: string): Exclude<PolicyCategoryId, 'all'> {
  const name = filename.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.test(name)) return rule.id;
  }
  return 'general';
}

function formatFileDate(iso?: string): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return null;
  }
}

export default function PoliciesSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PolicyFileMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<PolicyCategoryId>('all');

  const apiBase = useMemo(() => getApiBaseUrl(), []);

  const fetchPolicies = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      setError(null);
      try {
        const q = searchQuery.trim();
        const url = q
          ? `${apiBase}/policy_files/search/${encodeURIComponent(q)}`
          : `${apiBase}/policy_files/all`;
        const res = await axios.get<PolicyFileMeta[]>(url);
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Policy library error:', err);
        setError('Unable to load policies. Check your connection or try again shortly.');
        setResults([]);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    },
    [apiBase]
  );

  useEffect(() => {
    void fetchPolicies('');
  }, [fetchPolicies]);

  const enriched = useMemo(
    () =>
      results.map((file) => ({
        ...file,
        category: inferCategory(file.filename),
      })),
    [results]
  );

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return enriched;
    return enriched.filter((f) => f.category === typeFilter);
  }, [enriched, typeFilter]);

  const handleSearch = () => {
    void fetchPolicies(query);
  };

  const fileUrl = (id: string) => `${apiBase}/policy_files/file/${id}`;

  return (
    <section
      id="policies-search"
      className="py-14 md:py-20 bg-gradient-to-b from-university-light-gray to-white border-t border-gray-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
              Library
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-university-dark-gray mb-4">
            Policy library
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Search by filename or keyword, then narrow results by policy type. Open a PDF in your
            browser or download a copy for offline reading.
          </p>
        </div>

        <Card className="border border-gray-200 shadow-md mb-8 overflow-hidden">
          <CardContent className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-end">
              <div className="flex-1 space-y-2">
                <label htmlFor="policy-search" className="text-sm font-medium text-university-dark-gray">
                  Search
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      aria-hidden
                    />
                    <Input
                      id="policy-search"
                      type="search"
                      placeholder="Search by filename or keywords…"
                      className="pl-10 h-11 border-gray-200 focus-visible:ring-university-blue"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                    className="h-11 bg-university-blue hover:bg-university-dark-gray text-white shrink-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-university-dark-gray">
                <Filter className="w-4 h-4 text-university-blue" aria-hidden />
                Filter by type
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTypeFilter(id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors',
                      typeFilter === id
                        ? 'bg-university-dark-gray text-white border-university-dark-gray'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-university-blue/40 hover:text-university-dark-gray'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-center text-red-600 text-sm mb-6" role="alert">
            {error}
          </p>
        )}

        {!loading && hasFetched && !error && filtered.length === 0 && (
          <p className="text-center text-gray-600 py-12">
            {results.length === 0
              ? 'No policies match your search.'
              : 'No policies match this type filter. Try another category or clear filters.'}
          </p>
        )}

        {loading && !hasFetched && (
          <div className="flex justify-center py-16 text-university-blue">
            <Loader2 className="w-10 h-10 animate-spin" aria-label="Loading policies" />
          </div>
        )}

        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 list-none p-0 m-0">
          {filtered.map((file) => {
            const dateLabel = formatFileDate(file.createdAt || file.updatedAt);
            const viewHref = fileUrl(file._id);
            const safeName = file.filename.replace(/\.[^/.]+$/, '') || file.filename;

            return (
              <li key={file._id}>
                <Card className="h-full border border-gray-200/90 shadow-sm hover:shadow-lg hover:border-university-blue/30 transition-all duration-300 flex flex-col overflow-hidden group">
                  <CardContent className="p-0 flex flex-col flex-1">
                    <div className="relative h-36 bg-gradient-to-br from-university-blue/10 via-university-light-blue/20 to-university-gold/10 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,#219ebc_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#ffb703_0%,transparent_45%)]" />
                      <FileText
                        className="relative w-14 h-14 text-university-blue/80 group-hover:scale-105 transition-transform duration-300"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[11px] font-semibold border',
                            CATEGORY_BADGE_CLASS[file.category]
                          )}
                        >
                          {FILTER_OPTIONS.find((o) => o.id === file.category)?.label ?? 'General'}
                        </Badge>
                        {dateLabel && (
                          <span className="text-xs text-gray-500">{dateLabel}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-university-dark-gray text-base leading-snug line-clamp-3">
                        {safeName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate" title={file.filename}>
                        {file.filename}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 min-w-[7rem] border-university-blue/30 text-university-dark-gray hover:bg-university-blue/10 hover:text-university-dark-gray"
                          asChild
                        >
                          <a href={viewHref} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-1.5" aria-hidden />
                            View
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 min-w-[7rem] bg-university-gold text-university-dark-gray hover:bg-university-gold/90"
                          asChild
                        >
                          <a href={viewHref} download={file.filename} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-1.5" aria-hidden />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>

        {loading && hasFetched && (
          <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            Updating results…
          </p>
        )}
      </div>
    </section>
  );
}
