"use client";

import { DashboardShell } from "@/src/components/layout/dashboard-shell";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Download,
  Filter,
  Loader2,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface AuditRecord {
  auditId: string;
  filename: string;
  s3Key: string;
  docType: string;
  status: string;
  finalReportS3Key: string | null;
  discrepancies: { description: string; severity: string }[];
  discrepancyCount: number;
  extractedParams: {
    date_of_service?: string;
    payer?: {
      name?: string | null;
      network_status?: string;
      plan_name?: string | null;
      plan_id?: string | null;
    };
    provider?: {
      name?: string | null;
      billing_npi?: string | null;
      tax_id?: string | null;
    };
    patient?: {
      claim_id?: string | null;
      account_number?: string | null;
    };
  };
}

export default function AuditContent() {
  const s3bucket = process.env.NEXT_PUBLIC_S3_URL;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const searchParams = useSearchParams();
  const filterKey = searchParams.get("filter");
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAudits = async () => {
      try {
        const res = await fetch(`${backendUrl}/audits`);
        const data = await res.json();
        if (data.success && mounted) {
          setAudits(data.audits);
        }
      } catch (err) {
        console.error("Failed to fetch audits:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAudits();
    const interval = setInterval(fetchAudits, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredAudits = useMemo(() => {
    return filterKey
      ? audits.filter(
          (a) => a.s3Key?.includes(filterKey) || a.s3Key?.includes(filterKey),
        )
      : audits;
  }, [audits]);

  const statusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; className: string }> =
      {
        completed: {
          icon: <CheckCircle2 className="size-3.5" />,
          className:
            "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
        },
        failed: {
          icon: <XCircle className="size-3.5" />,
          className:
            "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800",
        },
        processing: {
          icon: <Clock className="size-3.5" />,
          className:
            "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800",
        },
      };
    const c = config[status] || config.processing;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.className}`}
      >
        {c.icon}
        {status}
      </span>
    );
  };
  return (
    <DashboardShell>
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-lg">
            <CardHeader>
              <CardDescription>Claim savings identified</CardDescription>
              <CardTitle className="trueclaim-gradient-text text-3xl">
                $580XXX
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <CircleDollarSign className="size-4 text-emerald-600" />2 claims
              need follow-up
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader>
              <CardDescription>Audit completion</CardDescription>
              <CardTitle className="text-3xl">94%</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-sky-600" />
              Same-day review target
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader>
              <CardDescription>Compliance state</CardDescription>
              <CardTitle className="text-3xl">Clear</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-600" />
              HIPAA workspace checks passed
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-lg">
          <CardHeader className="gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <CardTitle>Audit results</CardTitle>
              <CardDescription>
                Real-time claim findings, savings, and operational follow-up.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="h-9">
                <Search className="size-4" />
                Search
              </Button>
              <Button variant="outline" className="h-9">
                <Filter className="size-4" />
                Filter
              </Button>
              <Button className="trueclaim-gradient h-9 border-0 text-white hover:opacity-90">
                Export
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAudits.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No audits found.
              </div>
            ) : (
              <div className="overflow-auto rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/60">
                    <TableRow>
                      <TableHead className="whitespace-nowrap px-4">
                        Audit ID
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Filename
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Doc Type
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Status
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Final Report
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Discrepancies
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Disc. Count
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Date of Service
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Payer Name
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Network Status
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Plan Name
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Plan ID
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Provider Name
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Billing NPI
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Tax ID
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Claim ID
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Account #
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.map((audit) => {
                      const p = audit.extractedParams || {};
                      const payer = p.payer || {};
                      const provider = p.provider || {};
                      const patient = p.patient || {};
                      const discText = (audit.discrepancies || [])
                        .map((d) => d.description)
                        .join(", ");

                      return (
                        <TableRow key={audit.auditId} className="bg-card">
                          <TableCell className="max-w-[100px] px-4 font-mono text-xs">
                            <span title={audit.auditId}>
                              {audit.auditId.slice(0, 8)}...
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <a
                              href={`${s3bucket}/${audit.s3Key}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 underline hover:text-blue-800"
                            >
                              {audit.s3Key}
                              <Download className="size-3" />
                            </a>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {audit.docType || "-"}
                          </TableCell>
                          <TableCell>{statusBadge(audit.status)}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {audit.finalReportS3Key ? (
                              <a
                                href={`${s3bucket}/${audit.finalReportS3Key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 underline hover:text-blue-800"
                              >
                                Report
                                <Download className="size-3" />
                              </a>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell
                            className="max-w-[260px] truncate"
                            title={discText}
                          >
                            {discText || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {audit.discrepancyCount ?? 0}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {p.date_of_service
                              ? new Date(p.date_of_service).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {payer.name || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {payer.network_status || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {payer.plan_name || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {payer.plan_id || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {provider.name || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {provider.billing_npi || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {provider.tax_id || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {patient.claim_id || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {patient.account_number || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
