import getApiClient from "./apiClient";

export interface CreateAppPayload {
  name: string;
  orgId: string;
  accountId: string;
  environment?: "development" | "staging" | "production";
  description?: string;
}

/**
 * Create a new app
 */
export const createAppService = async (payload: CreateAppPayload) => {
  const { data } = await getApiClient().post(
    "/api/apps",
    {
      name: payload.name,
      orgId: payload.orgId,
      environment: payload.environment || "development",
      description: payload.description,
    },
    {
      headers: {
        "x-account-id": payload.accountId,
      },
    }
  );
  return data.data;
};

/**
 * Get all apps (filtered by organization)
 * Includes x-account-id header if provided
 */
export const getAppsService = async (accountId?: string) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().get("/api/apps", config);
  return data.data;
};

/**
 * Get single app by ID
 * Includes x-account-id header if provided
 */
export const getAppService = async (appId: string, accountId?: string) => {
  const config = accountId ? { headers: { "x-account-id": accountId } } : {};
  const { data } = await getApiClient().get(`/api/apps/${appId}`, config);
  return data.data;
};

/**
 * Update app
 */
export const updateAppService = async (appId: string, payload: Partial<CreateAppPayload>) => {
  const { data } = await getApiClient().put(`/api/apps/${appId}`, payload);
  return data.data;
};

/**
 * Delete app
 */
export const deleteAppService = async (appId: string) => {
  const { data } = await getApiClient().delete(`/api/apps/${appId}`);
  return data.data;
};
