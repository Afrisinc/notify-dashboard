import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppNotifications } from "@/hooks/useApps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Send, Bell, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const statusColor: Record<string, string> = {
  SENT: "bg-success/15 text-success",
  FAILED: "bg-destructive/15 text-destructive",
  PENDING: "bg-warning/15 text-warning",
  BOUNCED: "bg-destructive/15 text-destructive",
  QUEUED: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  failed: "bg-destructive/15 text-destructive",
  pending: "bg-warning/15 text-warning",
};

export default function AppNotifications() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  // Fetch notification logs
  const { data: notificationsResponse, isLoading, error } = useAppNotifications(
    appId || "",
    {
      page,
      limit: 10,
      status: statusFilter !== "all" ? (statusFilter as any) : undefined,
      channel: channelFilter !== "all" ? (channelFilter as any) : undefined,
    },
    { enabled: !!appId }
  );

  const notifications = notificationsResponse?.notifications || [];
  const totalPages = notificationsResponse?.totalPages || 1;
  const total = notificationsResponse?.total || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-content-secondary">{total} notifications</p>
        <Button
          size="sm"
          onClick={() => navigate(`/dashboard/apps/${appId}/notifications/send`)}
        >
          <Send className="h-3.5 w-3.5 mr-1.5" /> Send Notification
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="QUEUED">Queued</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="BOUNCED">Bounced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="PUSH">Push</SelectItem>
            <SelectItem value="IN_APP">In-App</SelectItem>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border/60">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4">
            <p className="text-sm text-destructive">Failed to load notifications. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && notifications.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <Bell className="h-10 w-10 icon-muted mx-auto mb-3" />
            <p className="text-sm text-content-secondary">No notifications found.</p>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      {!isLoading && !error && notifications.length > 0 && (
        <>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <Collapsible key={notification.id}>
                <Card className="border-border/60">
                  <CardContent className="p-0">
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors">
                        <div className="flex-1 text-left min-w-0">
                          <span className="text-sm font-medium text-content block truncate">
                            {notification.recipient}
                          </span>
                          <span className="text-xs text-content-secondary">
                            {notification.templateCode ? `Template: ${notification.templateCode}` : `ID: ${(notification.templateId || '').slice(0, 8)}...`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="text-[10px]">
                            {notification.channel}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${statusColor[notification.status] || "bg-muted text-muted-foreground"}`}
                          >
                            {notification.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </button>
                    </CollapsibleTrigger>

                    {/* Logs Details */}
                    <CollapsibleContent className="px-4 pb-3 border-t border-border/50">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Provider Logs:</p>
                        {notification.logs.map((log, idx) => (
                          <div key={idx} className="bg-muted/30 rounded p-2 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">{log.provider}</span>
                              <Badge
                                variant="outline"
                                className={`text-[9px] ${
                                  log.status === "success"
                                    ? "border-success text-success"
                                    : log.status === "failed"
                                      ? "border-destructive text-destructive"
                                      : "border-warning text-warning"
                                }`}
                              >
                                {log.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{log.response}</p>
                            <p className="text-xs text-muted-foreground/60">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                  .map((p, idx, arr) => (
                    <div key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1">...</span>}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(p)}
                          isActive={p === page}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    </div>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
