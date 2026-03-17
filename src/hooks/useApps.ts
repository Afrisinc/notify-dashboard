import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAppService,
  getAppsService,
  getAppService,
  updateAppService,
  deleteAppService,
  createAppTemplateService,
  getAppTemplatesService,
  getAppTemplateService,
  updateAppTemplateService,
  deleteAppTemplateService,
  type CreateAppPayload,
  type CreateAppTemplatePayload,
} from "@/services/apps";
import { useUser } from "@/contexts/UserContext";
import { useCurrentAccountId } from "@/hooks/useAuth";

/**
 * Create a new app
 * Automatically includes x-account-id header based on selected organization
 * Refetches organization apps after successful creation
 */
export function useCreateApp() {
  const { getAccountIdForOrg } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateAppPayload, "accountId">) => {
      // Get account ID for the selected organization
      const accountId = getAccountIdForOrg(payload.orgId);
      if (!accountId) {
        throw new Error(`No account found for organization ${payload.orgId}`);
      }

      return createAppService({
        ...payload,
        accountId,
      });
    },
    onSuccess: (_data, variables) => {
      // Invalidate organization apps query to refetch
      queryClient.invalidateQueries({
        queryKey: ["organizationApps", variables.orgId],
      });
    },
  });
}

/**
 * Get all apps
 * Automatically includes x-account-id header from current organization
 */
export function useApps(options?: { enabled?: boolean }) {
  const accountId = useCurrentAccountId();

  return useQuery({
    queryKey: ["apps", accountId],
    queryFn: () => getAppsService(accountId ?? undefined),
    enabled: (options?.enabled ?? true) && !!accountId,
  });
}

/**
 * Get single app by ID
 * Automatically includes x-account-id header from current organization
 */
export function useApp(appId: string, options?: { enabled?: boolean }) {
  const accountId = useCurrentAccountId();

  return useQuery({
    queryKey: ["app", appId, accountId],
    queryFn: () => getAppService(appId, accountId ?? undefined),
    enabled: (options?.enabled ?? true) && !!appId,
  });
}

/**
 * Update app
 */
export function useUpdateApp() {
  return useMutation({
    mutationFn: ({ appId, payload }: { appId: string; payload: Partial<CreateAppPayload> }) =>
      updateAppService(appId, payload),
  });
}

/**
 * Delete app
 */
export function useDeleteApp() {
  return useMutation({
    mutationFn: (appId: string) => deleteAppService(appId),
  });
}

// ──────────────────────────────────────────
// APP TEMPLATE HOOKS
// ──────────────────────────────────────────

/**
 * Get all app templates
 * Automatically includes x-account-id header from current organization
 */
export function useAppTemplates(appId: string, options?: { enabled?: boolean }) {
  const accountId = useCurrentAccountId();

  return useQuery({
    queryKey: ["appTemplates", appId, accountId],
    queryFn: () => getAppTemplatesService(appId, accountId ?? undefined),
    enabled: (options?.enabled ?? true) && !!appId && !!accountId,
  });
}

/**
 * Get single app template by ID
 * Automatically includes x-account-id header from current organization
 */
export function useAppTemplate(appId: string, templateId: string, options?: { enabled?: boolean }) {
  const accountId = useCurrentAccountId();

  return useQuery({
    queryKey: ["appTemplate", appId, templateId, accountId],
    queryFn: () => getAppTemplateService(appId, templateId, accountId ?? undefined),
    enabled: (options?.enabled ?? true) && !!appId && !!templateId && !!accountId,
  });
}

/**
 * Create app template
 */
export function useCreateAppTemplate() {
  const accountId = useCurrentAccountId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, payload }: { appId: string; payload: CreateAppTemplatePayload }) =>
      createAppTemplateService(appId, payload, accountId ?? undefined),
    onSuccess: (_data, { appId }) => {
      // Invalidate app templates query to refetch
      queryClient.invalidateQueries({
        queryKey: ["appTemplates", appId],
      });
    },
  });
}

/**
 * Update app template
 */
export function useUpdateAppTemplate() {
  const accountId = useCurrentAccountId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appId,
      templateId,
      payload,
    }: {
      appId: string;
      templateId: string;
      payload: Partial<CreateAppTemplatePayload>;
    }) => updateAppTemplateService(appId, templateId, payload, accountId ?? undefined),
    onSuccess: (_data, { appId, templateId }) => {
      // Invalidate both specific template and templates list
      queryClient.invalidateQueries({
        queryKey: ["appTemplate", appId, templateId],
      });
      queryClient.invalidateQueries({
        queryKey: ["appTemplates", appId],
      });
    },
  });
}

/**
 * Delete app template
 */
export function useDeleteAppTemplate() {
  const accountId = useCurrentAccountId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, templateId }: { appId: string; templateId: string }) =>
      deleteAppTemplateService(appId, templateId, accountId ?? undefined),
    onSuccess: (_data, { appId, templateId }) => {
      // Invalidate both specific template and templates list
      queryClient.invalidateQueries({
        queryKey: ["appTemplate", appId, templateId],
      });
      queryClient.invalidateQueries({
        queryKey: ["appTemplates", appId],
      });
    },
  });
}
