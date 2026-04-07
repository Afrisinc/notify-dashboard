import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAppSettings,
  useUpdateAppSettings,
  useUpdateAllowedDomains,
  useWebhooks,
  useCreateWebhook,
  useDeleteWebhook,
  useTestWebhook,
  useDeleteApp,
  useEmailConfig,
  useSetEmailConfig,
  useResetEmailConfig,
  useVerifyDNS,
} from "@/hooks/useAppSettings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2, Globe, Webhook, AlertCircle, Check, X, Mail, ChevronDown, Shield, CheckCircle2, AlertTriangle, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function AppSettings() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    environment: "development" as const,
  });
  const [domainsText, setDomainsText] = useState("");
  const [webhookForm, setWebhookForm] = useState({
    url: "",
    events: [] as string[],
  });
  const [emailForm, setEmailForm] = useState({
    fromEmail: "",
    fromName: "",
    replyToEmail: "",
    replyToName: "",
  });
  const [showResetEmailConfirm, setShowResetEmailConfirm] = useState(false);
  const [showSPFDKIMGuide, setShowSPFDKIMGuide] = useState(false);
  const [dnsVerificationResult, setDnsVerificationResult] = useState<any>(null);

  // Fetch data
  const { data: settings, isLoading, error } = useAppSettings(appId || "");
  const { data: webhooksResponse } = useWebhooks(appId || "");
  const { data: emailConfig, isLoading: emailConfigLoading } = useEmailConfig(appId || "");

  // Mutations
  const updateSettingsMutation = useUpdateAppSettings();
  const updateDomainsMutation = useUpdateAllowedDomains();
  const createWebhookMutation = useCreateWebhook();
  const deleteWebhookMutation = useDeleteWebhook();
  const testWebhookMutation = useTestWebhook();
  const deleteAppMutation = useDeleteApp();
  const setEmailConfigMutation = useSetEmailConfig();
  const resetEmailConfigMutation = useResetEmailConfig();
  const verifyDNSMutation = useVerifyDNS();

  // Initialize form when settings load
  React.useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name,
        description: settings.description || "",
        environment: settings.environment,
      });
      setDomainsText(settings.allowedDomains.join("\n"));
    }
  }, [settings]);

  // Initialize email form when email config loads
  React.useEffect(() => {
    if (emailConfig) {
      setEmailForm({
        fromEmail: emailConfig.fromEmail || "",
        fromName: emailConfig.fromName || "",
        replyToEmail: emailConfig.replyToEmail || "",
        replyToName: emailConfig.replyToName || "",
      });
    }
  }, [emailConfig]);

  const handleUpdateSettings = async () => {
    if (!appId) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateSettingsMutation.mutateAsync({
        appId,
        payload: {
          name: formData.name,
          description: formData.description || undefined,
          environment: formData.environment,
        },
      });
      setSuccessMessage("Settings updated successfully");
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleUpdateDomains = async () => {
    if (!appId) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const domains = domainsText
        .split("\n")
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      await updateDomainsMutation.mutateAsync({
        appId,
        payload: { allowedDomains: domains },
      });
      setSuccessMessage("Domains updated successfully");
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleCreateWebhook = async () => {
    if (!appId || !webhookForm.url || webhookForm.events.length === 0) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await createWebhookMutation.mutateAsync({
        appId,
        payload: {
          url: webhookForm.url,
          events: webhookForm.events,
          isActive: true,
        },
      });
      setWebhookForm({ url: "", events: [] });
      setSuccessMessage("Webhook created successfully");
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!appId) return;

    try {
      await deleteWebhookMutation.mutateAsync({ appId, webhookId });
      setSuccessMessage("Webhook deleted successfully");
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    if (!appId) return;

    try {
      const result = await testWebhookMutation.mutateAsync({
        appId,
        webhookId,
        event: "notification.delivered",
      });
      setSuccessMessage(`Webhook test successful (${result.statusCode})`);
    } catch (err) {
      setErrorMessage(`Webhook test failed: ${(err as Error).message}`);
    }
  };

  const handleDeleteApp = async () => {
    if (!appId) return;

    try {
      await deleteAppMutation.mutateAsync(appId);
      navigate("/dashboard/apps");
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleSetEmailConfig = async () => {
    if (!appId || !emailForm.fromEmail) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await setEmailConfigMutation.mutateAsync({
        appId,
        payload: {
          fromEmail: emailForm.fromEmail,
          fromName: emailForm.fromName || undefined,
          replyToEmail: emailForm.replyToEmail || undefined,
          replyToName: emailForm.replyToName || undefined,
        },
      });
      setSuccessMessage("Email configuration saved successfully");
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleResetEmailConfig = async () => {
    if (!appId) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await resetEmailConfigMutation.mutateAsync({ appId });
      setShowResetEmailConfirm(false);
      setSuccessMessage("Email configuration reset to platform default");
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  const handleVerifyDNS = async () => {
    if (!appId || !emailForm.fromEmail) return;
    setErrorMessage(null);

    try {
      const result = await verifyDNSMutation.mutateAsync({ appId, email: emailForm.fromEmail });
      setDnsVerificationResult(result);
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load app settings. Please try again.</AlertDescription>
      </Alert>
    );
  }

  const webhooks = webhooksResponse?.webhooks || [];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Alerts */}
      {successMessage && (
        <Alert className="bg-success/10 border-success/30">
          <Check className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">{successMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* General */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" /> General
          </CardTitle>
          <CardDescription>Manage your app's basic settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>App Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label>Environment</Label>
            <Select
              value={formData.environment}
              onValueChange={(v) => setFormData({ ...formData, environment: v as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdateSettings} disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Allowed Domains */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" /> Allowed Domains
          </CardTitle>
          <CardDescription>Restrict API access to specific domains.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="https://example.com&#10;https://app.example.com"
            rows={3}
            value={domainsText}
            onChange={(e) => setDomainsText(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateDomains}
            disabled={updateDomainsMutation.isPending}
          >
            {updateDomainsMutation.isPending ? "Saving..." : "Save Domains"}
          </Button>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Webhook className="h-4 w-4" /> Webhooks
          </CardTitle>
          <CardDescription>Configure webhook endpoints for delivery events and contact form submissions (e.g., Slack/Teams alerts).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Webhooks */}
          {webhooks.length > 0 && (
            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold">Configured Webhooks:</p>
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-3 border border-border/60 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{webhook.url}</p>
                      <p className="text-xs text-content-secondary">
                        {webhook.events.length} events • {webhook.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <Badge variant={webhook.isActive ? "default" : "secondary"}>
                      {webhook.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestWebhook(webhook.id)}
                      disabled={testWebhookMutation.isPending}
                    >
                      {testWebhookMutation.isPending ? "Testing..." : "Test"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      disabled={deleteWebhookMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* New Webhook Form */}
          <div className="space-y-3 pt-3">
            <p className="text-sm font-semibold">Add New Webhook:</p>
            <div>
              <Label>Webhook URL</Label>
              <Input
                placeholder="https://your-app.com/webhooks/notify"
                value={webhookForm.url}
                onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
              />
            </div>
            <div>
              <Label>Events</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { name: "contact.created", label: "New Contact (Contact Form)" },
                  { name: "notification.delivered", label: "Email Delivered" },
                  { name: "notification.failed", label: "Email Failed" },
                  { name: "notification.bounced", label: "Email Bounced" },
                  { name: "notification.opened", label: "Email Opened" },
                  { name: "notification.clicked", label: "Link Clicked" },
                  { name: "campaign.sent", label: "Campaign Sent" },
                ].map((event) => (
                  <label key={event.name} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={webhookForm.events.includes(event.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWebhookForm({
                            ...webhookForm,
                            events: [...webhookForm.events, event.name],
                          });
                        } else {
                          setWebhookForm({
                            ...webhookForm,
                            events: webhookForm.events.filter((ev) => ev !== event.name),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    {event.label}
                  </label>
                ))}
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleCreateWebhook}
              disabled={createWebhookMutation.isPending || !webhookForm.url || webhookForm.events.length === 0}
            >
              {createWebhookMutation.isPending ? "Creating..." : "Add Webhook"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SPF/DKIM Guidance */}
      {emailConfig && emailConfig.fromEmail !== "support@afrisinc.com" && (
        <Card className="border-warning/30 bg-warning/5">
          <button
            onClick={() => setShowSPFDKIMGuide(!showSPFDKIMGuide)}
            className="w-full text-left"
          >
            <CardHeader className="flex flex-row items-start justify-between cursor-pointer hover:bg-warning/10 transition-colors">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-warning" />
                <CardTitle className="text-base">Domain Verification Required</CardTitle>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-warning transition-transform ${
                  showSPFDKIMGuide ? "rotate-180" : ""
                }`}
              />
            </CardHeader>
          </button>

          {showSPFDKIMGuide && (
            <CardContent className="space-y-4 border-t border-warning/30 pt-4">
              <p className="text-sm text-warning">
                To ensure emails are delivered successfully, you must configure DNS records for your custom domain.
              </p>

              {/* SendGrid Instructions */}
              <div className="space-y-3 p-3 rounded-lg bg-content/5 border border-border/30">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-primary">📧</span> For SendGrid Users
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-content mb-1">1. Add SPF Record:</p>
                    <code className="block bg-surface p-2 rounded text-xs font-mono border border-border/40 break-all">
                      v=spf1 include:sendgrid.net ~all
                    </code>
                  </div>
                  <div>
                    <p className="font-medium text-content mb-1">2. Verify Domain via SendGrid:</p>
                    <ol className="list-decimal list-inside space-y-1 text-content-secondary">
                      <li>Go to SendGrid Dashboard</li>
                      <li>Navigate to Sender Authentication → Verify Domain</li>
                      <li>Add your domain ({emailForm.fromEmail?.split("@")[1]}) </li>
                      <li>Add CNAME records provided by SendGrid</li>
                      <li>Wait for verification (usually 2-4 hours)</li>
                    </ol>
                  </div>
                  <p className="text-xs text-content-secondary italic mt-2">
                    Once verified, enable DKIM signing in your SendGrid account.
                  </p>
                </div>
              </div>

              {/* SMTP/Gmail Instructions */}
              <div className="space-y-3 p-3 rounded-lg bg-content/5 border border-border/30">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-primary">📧</span> For SMTP/Gmail Users
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-content mb-1">1. Add SPF Record:</p>
                    <code className="block bg-surface p-2 rounded text-xs font-mono border border-border/40 break-all">
                      v=spf1 include:gmail.com ~all
                    </code>
                  </div>
                  <div>
                    <p className="font-medium text-content mb-1">2. Configure DKIM (Gmail):</p>
                    <ol className="list-decimal list-inside space-y-1 text-content-secondary">
                      <li>Go to Google Workspace Admin Console</li>
                      <li>Navigate to Apps → Google Workspace → Gmail → Authenticate email</li>
                      <li>Add your domain</li>
                      <li>Follow Google's DKIM setup instructions</li>
                      <li>Verify DNS records once added</li>
                    </ol>
                  </div>
                  <p className="text-xs text-content-secondary italic mt-2">
                    DKIM key must be added to your DNS as TXT records.
                  </p>
                </div>
              </div>

              {/* General Notes */}
              <div className="p-3 rounded-lg bg-content/5 border border-border/30">
                <h4 className="font-semibold text-sm mb-2">⚙️ General Notes</h4>
                <ul className="space-y-2 text-sm text-content-secondary">
                  <li>• SPF and DKIM help prevent email spoofing</li>
                  <li>• DNS changes may take 24-48 hours to propagate globally</li>
                  <li>• Without proper configuration, emails may be marked as spam</li>
                  <li>• Test your configuration with a test email before full rollout</li>
                  <li>• Contact your email provider if you need help with DNS records</li>
                </ul>
              </div>

              <Alert className="bg-info/10 border-info/30">
                <AlertCircle className="h-4 w-4 text-info" />
                <AlertDescription className="text-info text-sm">
                  Email verification is optional but strongly recommended for production use.
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>
      )}

      {/* Email Configuration */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Configuration
            </CardTitle>
            <CardDescription>Customize the sender email address for notifications.</CardDescription>
          </div>
          <div className="flex gap-2">
            {emailConfig && emailConfig.fromEmail !== "support@afrisinc.com" ? (
              <>
                <Badge variant="default">Custom</Badge>
                {emailConfig.isVerified && <Badge className="bg-success/15 text-success hover:bg-success/15">Verified</Badge>}
                {!emailConfig.isVerified && <Badge className="bg-warning/15 text-warning hover:bg-warning/15">Unverified</Badge>}
              </>
            ) : (
              <Badge variant="secondary">Platform Default</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailConfigLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              {/* Email Preview */}
              <div className="p-4 bg-surface rounded-lg border border-border/40 font-mono text-sm space-y-2">
                <div className="text-content-secondary">
                  From:{" "}
                  <span className="text-content">
                    {emailForm.fromName || settings?.name || "App"} &lt;{emailForm.fromEmail || "default@afrisinc.com"}&gt;
                  </span>
                </div>
                <div className="text-content-secondary">
                  Reply-To:{" "}
                  <span className="text-content">
                    {emailForm.replyToEmail
                      ? `${emailForm.replyToName || emailForm.replyToEmail} <${emailForm.replyToEmail}>`
                      : "Same as From"}
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Sender Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    placeholder="e.g., Acme Support"
                    value={emailForm.fromName}
                    onChange={(e) => setEmailForm({ ...emailForm, fromName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Sender Email <span className="text-danger">*</span></Label>
                  <Input
                    placeholder="support@example.com"
                    value={emailForm.fromEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Reply-To Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    placeholder="e.g., Support Team"
                    value={emailForm.replyToName}
                    onChange={(e) => setEmailForm({ ...emailForm, replyToName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Reply-To Email <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    placeholder="support@example.com"
                    value={emailForm.replyToEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, replyToEmail: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSetEmailConfig}
                  disabled={setEmailConfigMutation.isPending || !emailForm.fromEmail}
                >
                  {setEmailConfigMutation.isPending ? "Saving..." : "Save Configuration"}
                </Button>

                {emailConfig && emailConfig.fromEmail !== "support@afrisinc.com" && (
                  <AlertDialog open={showResetEmailConfirm} onOpenChange={setShowResetEmailConfirm}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Reset to Default</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Email Configuration?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset the sender email back to the platform default (support@afrisinc.com).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleResetEmailConfig}
                          disabled={resetEmailConfigMutation.isPending}
                        >
                          {resetEmailConfigMutation.isPending ? "Resetting..." : "Reset"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              {/* DNS Verification Section */}
              {(emailConfig && emailConfig.fromEmail !== "support@afrisinc.com" || (emailForm.fromEmail && emailForm.fromEmail !== "support@afrisinc.com")) && (
                <div className="mt-6 pt-4 border-t border-border/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Domain Verification Status</h4>
                      <p className="text-xs text-content-secondary mt-1">Check if your DNS records are properly configured</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleVerifyDNS}
                      disabled={verifyDNSMutation.isPending || !emailForm.fromEmail}
                    >
                      {verifyDNSMutation.isPending ? (
                        <>
                          <Loader className="h-3 w-3 mr-1 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        "Check DNS Records"
                      )}
                    </Button>
                  </div>

                  {/* Verification Results */}
                  {dnsVerificationResult && (
                    <div className="space-y-3">
                      {/* SPF Status */}
                      <div className="p-3 rounded-lg bg-content/5 border border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {dnsVerificationResult.spf.status === "verified" ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : dnsVerificationResult.spf.status === "error" ? (
                              <AlertTriangle className="h-4 w-4 text-danger" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-warning" />
                            )}
                            <span className="text-sm font-medium">SPF Record</span>
                          </div>
                          <Badge
                            variant={
                              dnsVerificationResult.spf.status === "verified"
                                ? "default"
                                : dnsVerificationResult.spf.status === "error"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {dnsVerificationResult.spf.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-content-secondary">{dnsVerificationResult.spf.message}</p>
                      </div>

                      {/* DKIM Status */}
                      <div className="p-3 rounded-lg bg-content/5 border border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {dnsVerificationResult.dkim.status === "verified" ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : dnsVerificationResult.dkim.status === "error" ? (
                              <AlertTriangle className="h-4 w-4 text-danger" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-warning" />
                            )}
                            <span className="text-sm font-medium">DKIM Record</span>
                          </div>
                          <Badge
                            variant={
                              dnsVerificationResult.dkim.status === "verified"
                                ? "default"
                                : dnsVerificationResult.dkim.status === "error"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {dnsVerificationResult.dkim.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-content-secondary">{dnsVerificationResult.dkim.message}</p>
                      </div>

                      {/* DMARC Status */}
                      <div className="p-3 rounded-lg bg-content/5 border border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {dnsVerificationResult.dmarc.status === "verified" ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">DMARC Policy</span>
                          </div>
                          <Badge variant="secondary">{dnsVerificationResult.dmarc.status}</Badge>
                        </div>
                        <p className="text-xs text-content-secondary">{dnsVerificationResult.dmarc.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> Danger Zone
          </CardTitle>
          <CardDescription>Permanently delete this app and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Delete App</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete "{settings.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the app and all its templates, contacts, campaigns, API keys, and logs.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteApp}
                  disabled={deleteAppMutation.isPending}
                >
                  {deleteAppMutation.isPending ? "Deleting..." : "Delete App"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

// Add React import
import React from "react";
