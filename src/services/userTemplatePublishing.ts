import getApiClient from "./apiClient";

// ──────────────────────────────────────────
// USER TEMPLATE PUBLISHING TYPES
// ──────────────────────────────────────────

export interface UserTemplate {
  id: string;
  code?: string;
  slug?: string;
  name?: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "IN_APP";
  category?: "MARKETING" | "TRANSACTIONAL" | "AUTHENTICATION" | "ALERTS";
  subject?: string;
  description: string;
  language?: string;
  version?: number;
  active?: boolean;
  visibility?: "private" | "marketplace";
  isPublic?: boolean;
  rating?: number;
  ratingCount?: number;
  installs?: number;
  author?: string;
  isFree?: boolean;
  variables?: string[];
  content?: {
    email?: {
      subject?: string;
      html?: string;
    };
  };
  designJson?: any;
  editorType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListUserTemplatesParams {
  limit?: number;
  offset?: number;
}

export interface ListUserTemplatesResponse {
  data: UserTemplate[];
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface PublishTemplatePayload {
  description?: string;
  thumbnail?: string;
  tags?: string[];
}

export interface PublishTemplateResponse {
  id: string;
  code: string;
  channel: string;
  visibility: "marketplace";
  isPublic: true;
  publishedAt: string;
}

export interface UnpublishTemplateResponse {
  id: string;
  code: string;
  visibility: "private";
  isPublic: false;
}

export interface CreateUserTemplatePayload {
  code: string;
  slug: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "IN_APP";
  subject?: string;
  content: string;
  language?: string;
  description: string;
  design_json?: any;
  editor_type?: string;
}

export interface CreateUserTemplateResponse {
  id: string;
  code: string;
  channel: string;
  active: boolean;
}

// ──────────────────────────────────────────
// LIST USER TEMPLATES
// ──────────────────────────────────────────

export const listUserTemplatesService = async (
  accountId: string,
  params?: ListUserTemplatesParams
) => {
  const queryParams = new URLSearchParams();

  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const config = { headers: { "x-account-id": accountId } };
  const { data } = await getApiClient().get<any>(
    `/api/templates/my-templates${query}`,
    config
  );
  return {
    data: data.data,
    meta: data.meta,
  } as ListUserTemplatesResponse;
};

// ──────────────────────────────────────────
// GET USER TEMPLATE FOR EDITING
// ──────────────────────────────────────────

export const getUserTemplateForEditingService = async (
  templateId: string,
  accountId: string
) => {
  const config = { headers: { "x-account-id": accountId } };
  const { data } = await getApiClient().get<any>(
    `/api/templates/${templateId}/edit`,
    config
  );
  return data.data as UserTemplate;
};

// ──────────────────────────────────────────
// PUBLISH TEMPLATE TO MARKETPLACE
// ──────────────────────────────────────────

export const publishTemplateService = async (
  templateId: string,
  accountId: string,
  payload?: PublishTemplatePayload
) => {
  const config = { headers: { "x-account-id": accountId } };
  const { data } = await getApiClient().post<any>(
    `/api/templates/${templateId}/publish`,
    payload || {},
    config
  );
  return data.data as PublishTemplateResponse;
};

// ──────────────────────────────────────────
// CREATE USER TEMPLATE
// ──────────────────────────────────────────

export const createUserTemplateService = async (
  accountId: string,
  payload: CreateUserTemplatePayload
) => {
  const config = { headers: { "x-account-id": accountId } };
  const { data } = await getApiClient().post<any>(
    `/api/templates`,
    payload,
    config
  );
  return data.data as CreateUserTemplateResponse;
};

// ──────────────────────────────────────────
// UPDATE USER TEMPLATE
// ──────────────────────────────────────────

export const updateUserTemplateService = async (
  templateId: string,
  accountId: string,
  payload: CreateUserTemplatePayload
) => {
  const config = { headers: { "x-account-id": accountId } };
  const { data } = await getApiClient().put<any>(
    `/api/templates/${templateId}`,
    payload,
    config
  );
  return data.data as CreateUserTemplateResponse;
};

// ──────────────────────────────────────────
// UNPUBLISH TEMPLATE FROM MARKETPLACE
// ──────────────────────────────────────────

export const unpublishTemplateService = async (
  templateId: string,
  accountId: string
) => {
  const config = { headers: { "x-account-id": accountId } };
  const { data } = await getApiClient().put<any>(
    `/api/templates/${templateId}/unpublish`,
    {},
    config
  );
  return data.data as UnpublishTemplateResponse;
};
