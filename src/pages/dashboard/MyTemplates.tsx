import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserTemplates, usePublishTemplate, useUnpublishTemplate } from "@/hooks/useUserTemplatePublishing";
import { useCurrentAccountId } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Upload, X, Edit, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type VisibilityFilter = "all" | "published" | "private";

export default function MyTemplates() {
  const navigate = useNavigate();
  const accountId = useCurrentAccountId();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [publishDialog, setPublishDialog] = useState<string | null>(null);
  const [unpublishDialog, setUnpublishDialog] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch user templates
  const { data: templatesResponse, isLoading, error, refetch } = useUserTemplates(
    { limit: 10, offset: (page - 1) * 10 },
    { enabled: !!accountId }
  );

  // Mutations
  const publishMutation = usePublishTemplate();
  const unpublishMutation = useUnpublishTemplate();

  const templates = templatesResponse?.data || [];
  const meta = templatesResponse?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  // Filter templates
  const filtered = templates.filter((t) => {
    if (visibilityFilter === "published" && !t.isPublic) return false;
    if (visibilityFilter === "private" && t.isPublic) return false;
    if (search && !t.code.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handlePublish = async (templateId: string) => {
    try {
      await publishMutation.mutateAsync({
        templateId,
        payload: {
          description: templates.find((t) => t.id === templateId)?.description,
        },
      });

      toast({
        title: "Success",
        description: "Template published to marketplace!",
      });

      setPublishDialog(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish template",
        variant: "destructive",
      });
    }
  };

  const handleUnpublish = async (templateId: string) => {
    try {
      await unpublishMutation.mutateAsync(templateId);

      toast({
        title: "Success",
        description: "Template unpublished from marketplace",
      });

      setUnpublishDialog(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unpublish template",
        variant: "destructive",
      });
    }
  };

  const channelColor = (channel: string) => {
    const colors: Record<string, string> = {
      EMAIL: "bg-primary/15 text-primary",
      SMS: "bg-success/15 text-success",
      PUSH: "bg-warning/15 text-warning",
      IN_APP: "bg-accent text-accent-foreground",
    };
    return colors[channel] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="heading-section">My Templates</h1>
        <p className="heading-description">Create, manage, and publish your notification templates to the marketplace</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Select value={visibilityFilter} onValueChange={(v) => setVisibilityFilter(v as VisibilityFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate("/dashboard/templates/new")} className="gap-2">
            <Plus className="h-4 w-4" /> Create New
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load templates. Please try again.</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/60">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full max-w-xs" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="heading-label text-foreground">No templates found</h3>
            <p className="text-secondary text-sm mt-1">
              {templates.length === 0
                ? "Create your first template to get started"
                : "Try adjusting your filters"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Templates Grid */}
          <div className="space-y-3">
            {filtered.map((template) => (
              <Card key={template.id} className="border-border/60 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header: Name + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="heading-label text-foreground truncate">{template.subject}</h3>
                        <p className="text-secondary text-sm line-clamp-1">{template.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className={`text-[10px] ${channelColor(template.channel)}`}>
                          {template.channel}
                        </Badge>
                        <Badge variant={template.isPublic ? "default" : "secondary"} className="text-[10px]">
                          {template.isPublic ? "Published" : "Private"}
                        </Badge>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>v{template.version}</span>
                      <span>{template.active ? "Active" : "Inactive"}</span>
                      {template.isPublic && (
                        <>
                          <span>⭐ {(template.rating || 0).toFixed(1)}</span>
                          <span>📥 {(template.installs || 0).toLocaleString()} installs</span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5"
                        onClick={() => navigate(`/dashboard/templates/${template.id}`)}
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5"
                        onClick={() => navigate(`/dashboard/templates/${template.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>

                      {template.isPublic ? (
                        <Button
                          size="sm"
                          variant="primary-light"
                          className="text-xs text-destructive hover:bg-destructive/10 gap-1.5 ml-auto"
                          onClick={() => setUnpublishDialog(template.id)}
                          disabled={unpublishMutation.isPending}
                        >
                          <X className="h-3.5 w-3.5" /> Unpublish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="text-xs gap-1.5 ml-auto bg-success hover:bg-success/90 text-white"
                          onClick={() => setPublishDialog(template.id)}
                          disabled={publishMutation.isPending}
                        >
                          <Upload className="h-3.5 w-3.5" /> Publish
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 px-3">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Publish Dialog */}
      <Dialog open={!!publishDialog} onOpenChange={(open) => !open && setPublishDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Template</DialogTitle>
            <DialogDescription>
              Make this template discoverable in the marketplace for other users to find and install
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-sm text-success space-y-2">
              <p className="font-medium">✓ Marketplace Benefits</p>
              <ul className="text-xs space-y-1 ml-4">
                <li>• Discover by other users</li>
                <li>• Receive ratings & feedback</li>
                <li>• Track installation count</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => publishDialog && handlePublish(publishDialog)}
              disabled={publishMutation.isPending}
              className="bg-success hover:bg-success/90 text-white"
            >
              {publishMutation.isPending ? "Publishing..." : "Publish Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unpublish Dialog */}
      <Dialog open={!!unpublishDialog} onOpenChange={(open) => !open && setUnpublishDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unpublish Template</DialogTitle>
            <DialogDescription>Remove this template from the marketplace and make it private</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm text-warning space-y-2">
              <p className="font-medium">⚠ What happens when you unpublish?</p>
              <ul className="text-xs space-y-1 ml-4">
                <li>• Removed from marketplace search</li>
                <li>• Users can't install it anymore</li>
                <li>• Ratings remain in history</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnpublishDialog(null)}>
              Keep Published
            </Button>
            <Button
              onClick={() => unpublishDialog && handleUnpublish(unpublishDialog)}
              disabled={unpublishMutation.isPending}
              variant="destructive"
            >
              {unpublishMutation.isPending ? "Unpublishing..." : "Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
