import React, { useState, useEffect } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, Plus, ArrowLeft, Check, Loader, Trash2, Edit2, Copy, CheckCircle } from "lucide-react";

interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

interface CustomDomain {
  id: string;
  domain: string;
  from_name: string;
  from_email: string;
  status: "pending" | "verified";
  spf_verified: boolean;
  dkim_verified: boolean;
  dmarc_verified: boolean;
  verified_at?: string;
  createdAt: string;
}

interface EmailDomainSectionProps {
  appId: string;
}

type Step = "list" | "form" | "dns" | "verified";

export function EmailDomainSection({ appId }: EmailDomainSectionProps) {
  const { toast } = useToast();
  const { copy } = useCopyToClipboard();

  // Local state
  const [step, setStep] = useState<Step>("list");
  const [domain, setDomain] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<CustomDomain | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Load custom domains on mount
  useEffect(() => {
    loadCustomDomains();
  }, [appId]);

  const getToken = () => {
    return localStorage.getItem("notify_token") || "";
  };

  const loadCustomDomains = async () => {
    try {
      setLoadingDomains(true);
      const token = getToken();
      const response = await fetch(`/api/apps/${appId}/domains`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCustomDomains(result.data || []);

        // If there are domains, show the first one
        if (result.data && result.data.length > 0) {
          const firstDomain = result.data[0];
          setSelectedDomain(firstDomain);
          setFromEmail(firstDomain.from_email);
          setFromName(firstDomain.from_name || "");
          setDomain(firstDomain.domain);

          // Load DNS records for the domain
          await loadDNSRecords(firstDomain.id);
          setStep(firstDomain.status === "verified" ? "verified" : "dns");
        } else {
          setStep("list");
        }
      } else {
        console.error("Failed to load domains:", response.statusText);
        setStep("list");
      }
    } catch (error) {
      console.error("Failed to load domains:", error);
      setStep("list");
    } finally {
      setLoadingDomains(false);
    }
  };

  const loadDNSRecords = async (domainId: string) => {
    try {
      const token = getToken();
      const response = await fetch(`/api/apps/${appId}/domains/${domainId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDnsRecords(result.data?.dns_records || []);
      }
    } catch (error) {
      console.error("Failed to load DNS records:", error);
    }
  };

  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Domain name is required",
        variant: "destructive",
      });
      return;
    }

    if (!fromEmail.trim()) {
      toast({
        title: "Error",
        description: "From Email is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      const response = await fetch(`/api/apps/${appId}/domains`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          domain: domain.trim(),
          from_name: fromName.trim() || undefined,
          from_email: fromEmail.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.resp_msg || "Failed to create domain");
      }

      const result = await response.json();
      setDnsRecords(result.data?.dns_records || []);
      setSelectedDomain(result.data);
      setStep("dns");

      toast({
        title: "Success",
        description: "Domain created successfully. Please verify DNS records.",
      });

      await loadCustomDomains();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create domain",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!selectedDomain) return;

    try {
      setIsVerifying(true);
      const token = getToken();
      const response = await fetch(
        `/api/apps/${appId}/domains/${selectedDomain.id}/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.resp_msg || "Verification failed");
      }

      const result = await response.json();

      const allVerified = result.data?.spf_verified && result.data?.dkim_verified && result.data?.dmarc_verified;

      if (allVerified) {
        setStep("verified");
        toast({
          title: "Success",
          description: "All DNS records verified! Your domain is ready to use.",
        });
      } else {
        toast({
          title: "Verification Status Updated",
          description: "Check the status of your DNS records below.",
        });
      }

      await loadCustomDomains();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify domain",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!selectedDomain) return;

    try {
      setIsDeleting(true);
      const token = getToken();
      const response = await fetch(
        `/api/apps/${appId}/domains/${selectedDomain.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.resp_msg || "Failed to delete domain");
      }

      setShowRemoveConfirm(false);
      setStep("list");
      setFromEmail("");
      setFromName("");
      setDomain("");
      setDnsRecords([]);
      setSelectedDomain(null);

      toast({
        title: "Success",
        description: "Email configuration reset to platform default",
      });

      await loadCustomDomains();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete domain",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const copyDnsRecord = (id: string, value: string) => {
    copy(id, value);
  };

  // Loading state
  if (loadingDomains) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email Sending Domain
          </CardTitle>
          <CardDescription>Configure your custom email sender address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Screen 1: List (empty state)
  if (step === "list") {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email Sending Domain
          </CardTitle>
          <CardDescription>Configure your custom email sender address.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <Mail className="h-12 w-12 icon-muted mx-auto" />
            <div>
              <h3 className="text-sm font-medium text-content mb-1">No custom domain connected yet</h3>
              <p className="text-sm text-content-secondary">Emails send from notify@afrisinc.com by default.</p>
            </div>
            <Button onClick={() => setStep("form")}>
              <Plus className="h-4 w-4 mr-2" /> Connect Your Domain
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Screen 2: Form
  if (step === "form") {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => setStep("list")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-base">Connect Custom Domain</CardTitle>
              <CardDescription>Set up your custom email sender address.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCreateDomain} className="space-y-4">
            <div>
              <Label>Domain</Label>
              <Input
                placeholder="mail.yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1 block">From Name (optional)</Label>
              <Input
                placeholder="e.g., Acme Payments"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1 block">
                From Email <span className="text-danger">*</span>
              </Label>
              <Input
                placeholder="no-reply@yourdomain.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !domain.trim() || !fromEmail.trim()}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Generating DNS Records...
                </>
              ) : (
                "Generate DNS Records"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Screen 3: DNS Records
  if (step === "dns" || step === "verified") {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Sending Domain
              </CardTitle>
              <CardDescription className="mt-1">{domain || fromEmail}</CardDescription>
            </div>
            <Badge variant={step === "verified" ? "default" : "secondary"}>
              {step === "verified" ? "Verified" : "Pending Verification"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "verified" && (
            <Alert className="bg-success/10 border-success/30">
              <Check className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                ✅ Domain verified! All emails will send as{" "}
                <span className="font-medium">
                  {fromName && `${fromName} <${fromEmail}>`}
                  {!fromName && fromEmail}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Status */}
          {selectedDomain && (
            <div className="grid grid-cols-3 gap-2 text-sm py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {selectedDomain.spf_verified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">SPF</span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-yellow-600" />
                    <span className="text-yellow-600">SPF</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedDomain.dkim_verified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">DKIM</span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-yellow-600" />
                    <span className="text-yellow-600">DKIM</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedDomain.dmarc_verified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">DMARC</span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-yellow-600" />
                    <span className="text-yellow-600">DMARC</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-content">Add these records to your DNS</h3>
                <p className="text-xs text-content-secondary mt-1">
                  Copy each record below and add them to your DNS provider. DNS changes can take 5–30 minutes to propagate.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {dnsRecords.map((record, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border bg-gray-50 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-semibold text-gray-700">Type: {record.type}</p>
                      <p className="text-sm font-mono break-all text-gray-900">{record.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyDnsRecord(`dns-name-${idx}`, record.name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-700">Value:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono break-all text-gray-900 flex-1 bg-white p-2 rounded border">
                        {record.value}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyDnsRecord(`dns-value-${idx}`, record.value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {step === "dns" && (
            <>
              <Separator />
              <Button
                onClick={handleVerifyDomain}
                disabled={isVerifying}
                variant="outline"
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Verification"
                )}
              </Button>
            </>
          )}

          <Separator />

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setStep("form")}>
              <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
            <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Remove Domain
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Custom Domain?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your email sender back to notify@afrisinc.com. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveDomain}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Removing..." : "Remove"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
