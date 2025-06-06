import React, { useEffect, useState, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchSnags } from "@/services/snagService";

const Snags = () => {
  const [snags, setSnags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedSnag, setSelectedSnag] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [engineeringFilter, setEngineeringFilter] = useState<string>("");

  const loadSnags = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");
      const result = await fetchSnags(reset ? 1 : page, 10);
      if (reset) {
        setSnags(result.data || []);
      } else {
        setSnags((prev: any) => [...prev, ...(result.data || [])]);
      }
      setHasMore(result.data && result.data.length === 10);
    } catch (err) {
      setError("Failed to load snags");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    loadSnags(page === 1);
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    });
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
    return () => observer.current && observer.current.disconnect();
  }, [loading, hasMore]);

  const lastUpdated = new Date().toLocaleString();

  const filteredSnags = snags.filter((snag: any) => {
    const statusMatch = statusFilter ? snag.status === statusFilter : true;
    const engineeringMatch = engineeringFilter
      ? (engineeringFilter === "Yes"
          ? (snag.requiresEngineering === true || snag.requiresEngineering === "Yes")
          : (snag.requiresEngineering === false || snag.requiresEngineering === "No"))
      : true;
    return statusMatch && engineeringMatch;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Snags</h2>
          <p className="text-muted-foreground">Work in progress</p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated}
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Snags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Status</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Snag Created">Snag Created</option>
                  <option value="Snag Dispositioned">Snag Dispositioned</option>
                  <option value="Snag Rectified">Snag Rectified</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Engineering Required</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={engineeringFilter}
                  onChange={e => setEngineeringFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-brand-blue mb-2"></div>
                <div className="text-brand-blue font-medium mt-2">Loading...</div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-4 text-red-500" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#fee2e2"/>
                  <path d="M15 9L9 15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9L15 15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-red-500 font-semibold text-lg">Cannot retrieve Snags</div>
                <div className="text-muted-foreground text-sm mt-1">Please check your connection or try again later.</div>
              </div>
            ) : snags.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4">
                  <rect x="8" y="16" width="48" height="32" rx="4" fill="#e5e7eb" />
                  <path d="M16 24h32v16H16z" fill="#cbd5e1" />
                  <circle cx="32" cy="32" r="6" fill="#60a5fa" />
                </svg>
                <div className="text-brand-blue font-semibold text-lg">No snags found</div>
                <div className="text-muted-foreground text-sm mt-1">Everything looks good! No snags to display.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-brand-navy text-white font-semibold border-b border-brand-blue">
                      <TableHead className="text-white min-w-[140px] w-1/6">Work Order</TableHead>
                      {/* <TableHead className="text-white min-w-[160px] w-2/5">Description</TableHead> */}
                      <TableHead className="text-white min-w-[140px] w-1/6">Status</TableHead>
                      <TableHead className="text-white min-w-[100px] w-1/12">Module</TableHead>
                      <TableHead className="text-white min-w-[160px] w-1/6">Engineering Required</TableHead>
                      <TableHead className="text-white min-w-[180px] w-1/4">Created Date</TableHead>
                      <TableHead className="text-white min-w-[44px] w-1/12 text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSnags.map((snag: any) => (
                      <TableRow
                        key={snag.id}
                        className="hover:bg-brand-blue/10 cursor-pointer transition-colors border-b border-brand-blue"
                      >
                        <TableCell className="min-w-[140px] w-1/6">{snag.workOrderNumber}</TableCell>
                        {/* <TableCell className="min-w-[160px] w-2/5">
                          {snag.description && snag.description.length > 80
                            ? snag.description.slice(0, 80) + '...'
                            : snag.description
                          }
                        </TableCell> */}
                        <TableCell className="min-w-[140px] w-1/6">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            snag.status === "Snag Created" ? "bg-red-500 text-white" :
                            snag.status === "Snag Dispositioned" ? "bg-yellow-500 text-white" :
                            snag.status === "Snag Rectified" ? "bg-green-500 text-white" :
                            "bg-gray-500 text-white"
                          }`}>
                            {snag.status}
                          </span>
                        </TableCell>
                        <TableCell className="min-w-[100px] w-1/12">{snag.moduleNumber}</TableCell>
                        <TableCell className="min-w-[160px] w-1/6">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            snag.requiresEngineering === true || snag.requiresEngineering === "Yes"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}>
                            {snag.requiresEngineering === true || snag.requiresEngineering === "Yes" ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell className="min-w-[180px] w-1/4">{new Date(snag.dateCreated).toLocaleString()}</TableCell>
                        <TableCell className="min-w-[44px] w-1/12 text-center">
                          <button
                            className="p-2 rounded hover:bg-brand-blue/10 focus:outline-none"
                            onClick={() => setSelectedSnag(snag)}
                            title="View Details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-blue">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div ref={loadMoreRef}></div>
                {loadingMore && hasMore && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-brand-blue"></div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedSnag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedSnag(null)}
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-4 text-brand-blue">Snag Details</h3>
            <div className="space-y-2">
              <div><span className="font-semibold">Work Order:</span> {selectedSnag.workOrderNumber}</div>
              <div><span className="font-semibold">Module:</span> {selectedSnag.moduleNumber}</div>
              <div><span className="font-semibold">Status:</span> {selectedSnag.status}</div>
              <div><span className="font-semibold">Engineering Required:</span> {selectedSnag.requiresEngineering === true || selectedSnag.requiresEngineering === "Yes" ? "Yes" : "No"}</div>
              <div><span className="font-semibold">Created Date:</span> {new Date(selectedSnag.dateCreated).toLocaleString()}</div>
              <div><span className="font-semibold">Description:</span>
                <div className="mt-1 whitespace-pre-line text-gray-700 border rounded p-2 bg-gray-50">
                  {selectedSnag.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default Snags;