import React, { useEffect, useState } from "react";
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
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSnags() {
      try {
        setLoading(true);
        setError("");
        const result = await fetchSnags();
        setSnags(result.data || []);
      } catch (err) {
        setError("Failed to load snags");
      } finally {
        setLoading(false);
      }
    }
    loadSnags();
  }, []);

  const lastUpdated = new Date().toLocaleString();

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
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-navy text-white font-semibold border-b border-brand-blue">
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Work Order ID</TableHead>
                    <TableHead className="text-white">Work Order</TableHead>
                    <TableHead className="text-white">Description</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Module</TableHead>
                    <TableHead className="text-white">Engineering Required</TableHead>
                    <TableHead className="text-white">Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snags.map((snag: any) => (
                    <TableRow
                      key={snag.id}
                      className="hover:bg-brand-blue/10 cursor-pointer transition-colors border-b border-brand-blue"
                    >
                      <TableCell>{snag.id}</TableCell>
                      <TableCell>{snag.workOrderId}</TableCell>
                      <TableCell>{snag.workOrderNumber}</TableCell>
                      <TableCell>{snag.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          snag.status === "Snag Created" ? "bg-red-500 text-white" :
                          snag.status === "Snag Dispositioned" ? "bg-yellow-500 text-white" :
                          snag.status === "Snag Rectified" ? "bg-green-500 text-white" :
                          "bg-gray-500 text-white"
                        }`}>
                          {snag.status}
                        </span>
                      </TableCell>
                      <TableCell>{snag.moduleNumber}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          snag.requiresEngineering === true || snag.requiresEngineering === "Yes"
                            ? "bg-red-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}>
                          {snag.requiresEngineering === true || snag.requiresEngineering === "Yes" ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(snag.dateCreated).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Snags;