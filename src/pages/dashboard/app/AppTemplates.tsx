import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appTemplates } from "@/data/mockData";
import { useAppTemplates } from "@/hooks/useApps";
import { extractVariableNames } from "@/lib/templateUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, Copy, Trash2, Send, Store, FileText, Eye, Variable, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const channelColor: Record<string, string> = {
  email: "bg-primary/15 text-primary",
  EMAIL: "bg-primary/15 text-primary",
  sms: "bg-success/15 text-success",
  SMS: "bg-success/15 text-success",
  push: "bg-warning/15 text-warning",
  PUSH: "bg-warning/15 text-warning",
  "in-app": "bg-accent text-accent-foreground",
  IN_APP: "bg-accent text-accent-foreground",
  WHATSAPP: "bg-info/15 text-info",
};
const statusColor: Record<string, string> = {
  active: "bg-success/15 text-success",
  draft: "bg-muted text-muted-foreground",
  archived: "bg-destructive/15 text-destructive",
};

export default function AppTemplates() {
  const { appId } = useParams();
  const navigate = useNavigate();

  // Fetch templates from app endpoint
  const { data: appTemplatesResponse, isLoading } = useAppTemplates(appId || "", {
    enabled: !!appId,
  });

  // Extract templates from response or use mock data
  const templates = appTemplatesResponse?.templates || appTemplates.filter((t) => t.appId === appId);

  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");

  const filtered = templates.filter((t) => {
    // Handle both API response format (nested template) and mock format
    const template = (t as any).template || t;
    const name = typeof template.name === "string" ? template.name : template.code || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const channel = (template.channel || "").toLowerCase();
    const filterChannel = channelFilter.toLowerCase();
    const matchChannel = channelFilter === "all" || channel === filterChannel;
    return matchSearch && matchChannel;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Channel" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push</SelectItem>
              <SelectItem value="in-app">In-App</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/marketplace")}>
            <Store className="h-3.5 w-3.5 mr-1.5" /> Marketplace
          </Button>
          <Button size="sm" onClick={() => navigate(`/editor/${appId}/new`)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Template
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-8 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading templates...</span>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {!isLoading && filtered.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No templates found. Create one or import from the marketplace.</p>
          </CardContent>
        </Card>
      ) : !isLoading ? (
        <div className="space-y-2">
          {filtered.map((item: any) => {
            // Extract template from API response or use direct template (mock)
            const tpl = item.template || item;
            const templateId = tpl.id || item.id;

            // Use utility to extract variable names from API or mock data
            const templateName = tpl.name || tpl.code || tpl.description || "Untitled";
            const variables = extractVariableNames(tpl);
            const createdBy = tpl.createdBy || "System";
            const updatedAt = tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : "Unknown";
            const version = tpl.version || 1;
            const isActive = tpl.active !== false;

            return (
              <Card key={templateId} className="border-border/60 hover:border-border transition-colors">
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-foreground truncate">{templateName}</span>
                      <span className="text-xs text-muted-foreground">v{version} · {createdBy} · {updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {variables.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Variable className="h-3.5 w-3.5 text-muted-foreground" />
                        <div className="flex gap-1 flex-wrap">
                          {variables.slice(0, 2).map((v: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-[9px] py-0">
                              {v}
                            </Badge>
                          ))}
                          {variables.length > 2 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="text-[9px] py-0 cursor-help">
                                    +{variables.length - 2}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium">Available variables:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {variables.map((v: any, idx: number) => (
                                        <code key={idx} className="text-[10px] bg-muted/50 px-1.5 py-0.5 rounded">
                                          {`{{${v}}}`}
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    )}
                    <Badge variant="secondary" className={`text-[10px] ${channelColor[tpl.channel]}`}>
                      {tpl.channel || "N/A"}
                    </Badge>
                    <Badge variant="secondary" className={`text-[10px] ${statusColor[isActive ? "active" : "draft"]}`}>
                      {isActive ? "active" : "draft"}
                    </Badge>
                  <div className="flex gap-0.5 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        // Email templates use dedicated editor, others use dashboard editor
                        if ((tpl.channel || "").toLowerCase() === 'email') {
                          navigate(`/editor/${appId}/${templateId}`);
                        } else {
                          navigate(`/dashboard/apps/${appId}/templates/${templateId}`);
                        }
                      }}
                      title="View/Edit template"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        // Email templates use dedicated editor, others use dashboard editor
                        if ((tpl.channel || "").toLowerCase() === 'email') {
                          navigate(`/editor/${appId}/${templateId}`);
                        } else {
                          navigate(`/dashboard/apps/${appId}/templates/${templateId}`);
                        }
                      }}
                      title="Edit template"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Duplicate template"><Copy className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Send notification"><Send className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" title="Delete template"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      ) : null}

    </div>
  );
}
