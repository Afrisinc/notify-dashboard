import getApiClient from "./apiClient";

// ──────────────────────────────────────────
// APP SETTINGS DATA TYPES
// ──────────────────────────────────────────

export interface AppSettings {
  appId: string;
  name: string;
  description?: string;
  environment: "development" | "staging" | "production";
  allowedDomains: string[];
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAppSettingsPayload {
  name?: string;
  description?: string;
  environment?: "development" | "staging" | "production";
  status?: "active" | "inactive" | "archived";
}

export interface UpdateAllowedDomainsPayload {
  allowedDomains: string[];
}

export interface Webhook {
  id: string;
  appId: string;
  url: string;
  events: string[];
  headers?: Record<string, string>;
  isActive: boolean;
  retryPolicy?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  failureCount?: number;
  lastError?: string;
  lastTriggeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookPayload {
  url: string;
  events: string[];
  headers?: Record<string, string>;
  isActive?: boolean;
  retryPolicy?: {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
  };
}

export interface UpdateWebhookPayload {
  url?: string;
  events?: string[];
  headers?: Record<string, string>;
  isActive?: boolean;
  retryPolicy?: {
    maxRetries?: number;
    retryDelay?: number;
    backoffMultiplier?: number;
  };
}

export interface ListWebhooksResponse {
  appId: string;
  webhooks: Webhook[];
  total: number;
}

export interface WebhookTestResponse {
  webhookId: string;
  event: string;
  statusCode: number;
  responseTime: number;
  message: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  status: "success" | "failed" | "pending";
  statusCode?: number;
  responseTime: number;
  payload: Record<string, any>;
  response?: string;
  attemptNumber: number;
  nextRetryAt?: string;
  timestamp: string;
}

export interface ListWebhookLogsResponse {
  webhookId: string;
  logs: WebhookLog[];
  total: number;
  page: number;
  limit: number;
}

// ──────────────────────────────────────────
// GET APP SETTINGS
// ──────────────────────────────────────────

export const getAppSettingsService = async (appId: string, accountId?: string) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().get<any>(
    `/api/apps/${appId}/settings`,
    config
  );
  return data.data as AppSettings;
};

// ──────────────────────────────────────────
// UPDATE APP SETTINGS
// ──────────────────────────────────────────

export const updateAppSettingsService = async (
  appId: string,
  payload: UpdateAppSettingsPayload,
  accountId?: string
) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().patch<any>(
    `/api/apps/${appId}`,
    payload,
    config
  );
  return data.data;
};

// ──────────────────────────────────────────
// UPDATE ALLOWED DOMAINS
// ──────────────────────────────────────────

export const updateAllowedDomainsService = async (
  appId: string,
  payload: UpdateAllowedDomainsPayload,
  accountId?: string
) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().put<any>(
    `/api/apps/${appId}/settings/domains`,
    payload,
    config
  );
  return data.data;
};

// ──────────────────────────────────────────
// LIST WEBHOOKS
// ──────────────────────────────────────────

export const listWebhooksService = async (appId: string, accountId?: string) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().get<any>(
    `/api/apps/${appId}/webhooks`,
    config
  );
  return data.data as ListWebhooksResponse;
};

// ──────────────────────────────────────────
// CREATE WEBHOOK
// ──────────────────────────────────────────

export const createWebhookService = async (
  appId: string,
  payload: CreateWebhookPayload,
  accountId?: string
) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().post<any>(
    `/api/apps/${appId}/webhooks`,
    payload,
    config
  );
  return data.data as Webhook;
};

// ──────────────────────────────────────────
// UPDATE WEBHOOK
// ──────────────────────────────────────────

export const updateWebhookService = async (
  appId: string,
  webhookId: string,
  payload: UpdateWebhookPayload,
  accountId?: string
) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().put<any>(
    `/api/apps/${appId}/webhooks/${webhookId}`,
    payload,
    config
  );
  return data.data as Webhook;
};

// ──────────────────────────────────────────
// DELETE WEBHOOK
// ──────────────────────────────────────────

export const deleteWebhookService = async (
  appId: string,
  webhookId: string,
  accountId?: string
) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().delete<any>(
    `/api/apps/${appId}/webhooks/${webhookId}`,
    config
  );
  return data.data;
};

// ──────────────────────────────────────────
// TEST WEBHOOK
// ──────────────────────────────────────────

export const testWebhookService = async (
  appId: string,
  webhookId: string,
  event: string,
  accountId?: string
) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().post<any>(
    `/api/apps/${appId}/webhooks/${webhookId}/test`,
    { event },
    config
  );
  return data.data as WebhookTestResponse;
};

// ──────────────────────────────────────────
// GET WEBHOOK LOGS
// ──────────────────────────────────────────

export const getWebhookLogsService = async (
  appId: string,
  webhookId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: "success" | "failed" | "pending";
  },
  accountId?: string
) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);

  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const { data } = await getApiClient().get<any>(
    `/api/apps/${appId}/webhooks/${webhookId}/logs${query}`,
    config
  );
  return data.data as ListWebhookLogsResponse;
};

// ──────────────────────────────────────────
// DELETE APP
// ──────────────────────────────────────────

export const deleteAppService = async (appId: string, accountId?: string) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().delete<any>(`/api/apps/${appId}`, config);
  return data.data;
};

// ──────────────────────────────────────────
// EMAIL CONFIGURATION
// ──────────────────────────────────────────

export interface AppEmailConfig {
  fromEmail: string;
  fromName: string | null;
  replyToEmail: string | null;
  replyToName: string | null;
  isVerified: boolean;
}

export interface SetEmailConfigPayload {
  fromEmail: string;
  fromName?: string | null;
  replyToEmail?: string | null;
  replyToName?: string | null;
}

export const getEmailConfigService = async (appId: string, accountId?: string): Promise<AppEmailConfig> => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().get<any>(`/api/apps/${appId}/email-config`, config);
  return data.data as AppEmailConfig;
};

export const setEmailConfigService = async (appId: string, payload: SetEmailConfigPayload, accountId?: string): Promise<AppEmailConfig> => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().post<any>(`/api/apps/${appId}/email-config`, payload, config);
  return data.data as AppEmailConfig;
};

export const resetEmailConfigService = async (appId: string, accountId?: string): Promise<void> => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  await getApiClient().delete<any>(`/api/apps/${appId}/email-config`, config);
};

export interface DNSVerificationResult {
  domain: string;
  spf: {
    status: 'verified' | 'not_found' | 'invalid' | 'error';
    records: string[];
    message: string;
  };
  dkim: {
    status: 'verified' | 'not_found' | 'invalid' | 'error';
    records: string[];
    message: string;
  };
  dmarc: {
    status: 'verified' | 'not_found' | 'optional';
    records: string[];
    message: string;
  };
}

export const verifyDNSService = async (appId: string, email: string, accountId?: string): Promise<DNSVerificationResult> => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const res = await getApiClient().post<any>(`/api/apps/${appId}/email-config/verify-dns`, { email }, config);
  return res.data.data as DNSVerificationResult;
};
