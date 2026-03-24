import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppTemplates } from "@/hooks/useApps";
import { useSendNotification } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Check, Loader2 } from "lucide-react";

// Validation schema
const sendNotificationSchema = z.object({
  channel: z.enum(["EMAIL", "SMS", "PUSH", "IN_APP", "WHATSAPP"]),
  templateId: z.string().min(1, "Please select a template"),
  recipient: z.string().email("Invalid email address"),
});

type SendNotificationFormData = z.infer<typeof sendNotificationSchema>;

export default function AppSendNotification() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  // Fetch app templates
  const { data: appTemplatesResponse, isLoading: templatesLoading } = useAppTemplates(
    appId || "",
    { enabled: !!appId }
  );

  // Extract templates from API response
  const templates = appTemplatesResponse?.templates || [];

  // Send notification mutation
  const sendNotificationMutation = useSendNotification();

  // Initialize form
  const form = useForm<SendNotificationFormData>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      channel: "EMAIL",
      templateId: "",
      recipient: "",
    },
  });

  const handleSendNotification = async (data: SendNotificationFormData) => {
    try {
      await sendNotificationMutation.mutateAsync({
        channel: data.channel,
        recipient: data.recipient,
        templateId: data.templateId,
        appId,
      });

      toast({
        title: "Success",
        description: "Notification sent successfully",
      });

      setSent(true);
      setTimeout(() => {
        form.reset();
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  // Success screen
  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-lg font-semibold text-content">Notification Sent!</h2>
        <p className="text-sm text-content-secondary mt-1">
          The notification has been queued for delivery.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => setSent(false)}>
            Send Another
          </Button>
          <Button onClick={() => navigate(`/dashboard/apps/${appId}/notifications`)}>
            View Notifications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(`/dashboard/apps/${appId}/notifications`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-content">Send Notification</h2>
      </div>

      {/* Form Card */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm">Notification Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendNotification)} className="space-y-4">
              {/* Channel Field */}
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger disabled={sendNotificationMutation.isPending}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="PUSH">Push</SelectItem>
                        <SelectItem value="IN_APP">In-App</SelectItem>
                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Template Field */}
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={templatesLoading || sendNotificationMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templatesLoading ? (
                          <div className="p-2 text-sm text-muted-foreground">Loading templates...</div>
                        ) : templates.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">No templates available</div>
                        ) : (
                          templates.map((t: any) => {
                            const template = t.template || t;
                            return (
                              <SelectItem key={template.id} value={template.id}>
                                {template.description || template.code} ({template.channel})
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recipient Field */}
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="user@example.com"
                        type="email"
                        disabled={sendNotificationMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Send Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={sendNotificationMutation.isPending || templatesLoading}
              >
                {sendNotificationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
