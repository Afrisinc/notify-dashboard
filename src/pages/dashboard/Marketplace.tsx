import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Star, Store, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMarketplaceTemplates } from "@/hooks/useMarketplace";
import { useInstallMarketplaceTemplate } from "@/hooks/useMarketplace";
import { useApps } from "@/hooks/useApps";
import { useOrg } from "@/contexts/OrgContext";
import { useCurrentAccountId } from "@/hooks/useAuth";
import type { MarketplaceTemplate } from "@/services/marketplace";

type ChannelFilter = "all" | "email" | "sms" | "push" | "in-app";
type PriceFilter = "all" | "free" | "paid";

export default function Marketplace() {
  const { currentOrg } = useOrg();
  const accountId = useCurrentAccountId();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [installTemplate, setInstallTemplate] = useState<MarketplaceTemplate | null>(null);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [page, setPage] = useState(1);

  // Fetch marketplace templates
  const { data: templatesResponse, isLoading, error } = useMarketplaceTemplates({
    search: search || undefined,
    channel: channelFilter !== "all" ? channelFilter : undefined,
    price: priceFilter !== "all" ? priceFilter : undefined,
    page,
    limit: 12,
  });

  // Fetch user's apps
  const { data: appsResponse } = useApps({ enabled: !!accountId });
  const userApps = appsResponse?.apps || [];

  // Install mutation
  const installMutation = useInstallMarketplaceTemplate();

  const templates = templatesResponse?.templates || [];
  const totalPages = templatesResponse?.pagination?.pages || 1;

  const channelColor = (ch: string) => {
    const channelMap: Record<string, string> = {
      "email": "bg-primary/15 text-primary",
      "sms": "bg-success/15 text-success",
      "push": "bg-warning/15 text-warning",
      "in-app": "bg-accent text-accent-foreground",
    };
    return channelMap[ch.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  const handleInstall = async () => {
    if (!selectedAppId || !installTemplate) return;
    try {
      await installMutation.mutateAsync({
        templateId: installTemplate.id,
        payload: {
          appId: selectedAppId,
          templateName: installTemplate.name,
        },
      });
      toast({
        title: "Success",
        description: `"${installTemplate.subject}" has been installed to your app.`,
      });
      setInstallTemplate(null);
      setSelectedAppId("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to install template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-content">Template Marketplace</h1>
        <p className="text-sm text-content-secondary mt-1">Browse and install reusable notification templates</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 icon-muted" />
          <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "email", "sms", "push", "in-app"] as ChannelFilter[]).map((ch) => (
            <Button key={ch} variant={channelFilter === ch ? "default" : "outline"} size="sm" onClick={() => setChannelFilter(ch)} className="text-xs capitalize">
              {ch === "all" ? "All Channels" : ch}
            </Button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(["all", "free", "paid"] as PriceFilter[]).map((p) => (
            <Button key={p} variant={priceFilter === p ? "default" : "outline"} size="sm" onClick={() => setPriceFilter(p)} className="text-xs capitalize">
              {p === "all" ? "All Prices" : p}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load marketplace templates. Please try again.</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/60">
              <CardHeader className="pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <Store className="h-12 w-12 icon-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-content mb-1">No templates found</h3>
            <p className="text-sm text-content-secondary">Try adjusting your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="border-border/60 hover:border-primary/30 transition-colors flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium leading-tight">{tpl.subject}</CardTitle>
                    <Badge variant="secondary" className={`text-[10px] shrink-0 ml-2 ${channelColor(tpl.channel)}`}>
                      {tpl.channel}
                    </Badge>
                  </div>
                  <p className="text-xs text-content-secondary mt-1.5 line-clamp-2">{tpl.description}</p>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-content-secondary">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning" /> {tpl.rating?.toFixed(1) || "N/A"}
                      </span>
                      <span>{(tpl.installs || 0).toLocaleString()} installs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${tpl.price === 0 ? "text-success" : "text-content"}`}>
                        {tpl.price === 0 ? "Free" : `$${tpl.price}`}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setInstallTemplate(tpl)}
                        disabled={!userApps.length}
                      >
                        <Download className="h-3 w-3 mr-1" /> Install
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-content-secondary mt-2">
                    by {typeof tpl.creator === "string" ? tpl.creator : tpl.creator.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!installTemplate} onOpenChange={(o) => !o && setInstallTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Template</DialogTitle>
            <DialogDescription>Choose where to install "{installTemplate?.name}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium mb-1 block">Select App</Label>
              {userApps.length === 0 ? (
                <Alert variant="destructive" className="text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>You need to create an app first to install templates.</AlertDescription>
                </Alert>
              ) : (
                <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an app" />
                  </SelectTrigger>
                  <SelectContent>
                    {userApps.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.name} ({app.environment})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setInstallTemplate(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleInstall}
                disabled={!selectedAppId || installMutation.isPending || userApps.length === 0}
                className="flex-1"
              >
                {installMutation.isPending ? "Installing..." : "Install Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
