# Organization Management - Frontend Integration Guide

## Overview

Organization management endpoints allow you to create invites, manage members, and control access to your organization.

---

## Authentication

All endpoints require a valid **Bearer token** from user login:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Base URL

```
http://localhost:8010/api
```

---

## Endpoints

### 1. Update Organization

**Endpoint:** `PUT /organizations/:orgId`

**Description:** Update organization details. Only the organization owner can update.

**Request Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Org Name",
  "legal_name": "Legal Organization Inc.",
  "country": "US",
  "org_email": "org@example.com",
  "org_phone": "+1234567890",
  "location": "San Francisco, CA"
}
```

**Parameters:**
- `orgId` (path) - Organization ID (UUID)
- All body fields are optional

**Success Response (200 OK):**
```json
{
  "success": true,
  "resp_msg": "Organization updated successfully",
  "resp_code": 1002,
  "data": {
    "id": "89dd1cad-60fc-48cf-aca5-7eeebb142824",
    "name": "Updated Org Name",
    "legal_name": "Legal Organization Inc.",
    "country": "US",
    "org_email": "org@example.com",
    "org_phone": "+1234567890",
    "location": "San Francisco, CA",
    "createdAt": "2026-03-18T10:00:00.000Z",
    "updatedAt": "2026-03-18T20:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 401 | 8010 | Authentication required |
| 403 | 3004 | Only organization owner can update organization details |
| 500 | 5000 | Failed to update organization |

**JavaScript Example:**
```javascript
async function updateOrganization(orgId, token, updates) {
  const response = await fetch(
    `http://localhost:8010/api/organizations/${orgId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.resp_msg || 'Failed to update organization');
  }

  return data.data;
}

// Usage
const updated = await updateOrganization(
  'org-id',
  token,
  {
    name: 'My New Organization',
    org_email: 'contact@example.com'
  }
);
```

---

### 2. Delete Organization

**Endpoint:** `DELETE /organizations/:orgId`

**Description:** Delete an organization and all its data. Only the organization owner can delete. This action is permanent.

**Request Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Parameters:**
- `orgId` (path) - Organization ID (UUID)

**Success Response (200 OK):**
```json
{
  "success": true,
  "resp_msg": "Organization deleted successfully",
  "resp_code": 1000,
  "data": {
    "deleted": true,
    "orgId": "89dd1cad-60fc-48cf-aca5-7eeebb142824"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 401 | 8010 | Authentication required |
| 403 | 3004 | Only organization owner can delete organization |
| 500 | 5000 | Failed to delete organization |

**⚠️ WARNING:** This action is irreversible. All organization data will be permanently deleted.

**JavaScript Example:**
```javascript
async function deleteOrganization(orgId, token) {
  // Confirm with user first
  const confirmed = confirm(
    'Are you sure? This will permanently delete the organization and all its data.'
  );

  if (!confirmed) return false;

  const response = await fetch(
    `http://localhost:8010/api/organizations/${orgId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.resp_msg || 'Failed to delete organization');
  }

  return data.data;
}
```

---

### 3. Create Organization Invite

**Endpoint:** `POST /organizations/:orgId/invites`

**Description:** Send an invite to a user to join your organization. Only admins and owners can create invites.

**Request Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "role": "MEMBER"
}
```

**Parameters:**
- `orgId` (path) - Organization ID (UUID)
- `email` (body) - Email of user to invite (required)
- `role` (body) - Role for invited member: `OWNER` | `ADMIN` | `MEMBER` (required)

**Success Response (201 Created):**
```json
{
  "success": true,
  "resp_msg": "Invite created successfully",
  "resp_code": 1001,
  "data": {
    "inviteId": "f54e8c6a-7a8f-4901-aefe-d4d07716106e",
    "email": "newmember@example.com",
    "role": "MEMBER",
    "status": "pending",
    "createdAt": "2026-03-18T19:00:00.000Z",
    "expiresAt": "2026-03-25T19:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 401 | 8010 | Authentication required |
| 403 | 3004 | You do not have permission to invite members |
| 400 | 2000 | Invalid request payload |
| 500 | 5000 | Failed to create invite |

**cURL Example:**
```bash
curl -X POST http://localhost:8010/api/organizations/89dd1cad-60fc-48cf-aca5-7eeebb142824/invites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newmember@example.com",
    "role": "MEMBER"
  }'
```

**JavaScript Example:**
```javascript
async function createOrganizationInvite(orgId, email, role, token) {
  const response = await fetch(
    `http://localhost:8010/api/organizations/${orgId}/invites`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.resp_msg || 'Failed to create invite');
  }

  return data.data;
}
```

---

### 2. Get Organization Members

**Endpoint:** `GET /organizations/:orgId/members`

**Description:** Retrieve all members of an organization with pagination. Any member can view the member list.

**Request Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `page` (optional) - Page number, default: 1, minimum: 1
- `limit` (optional) - Items per page, default: 10, minimum: 1, maximum: 100

**Examples:**
```
GET /organizations/89dd1cad-60fc-48cf-aca5-7eeebb142824/members
GET /organizations/89dd1cad-60fc-48cf-aca5-7eeebb142824/members?page=2&limit=20
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "resp_msg": "Members retrieved successfully",
  "resp_code": 1000,
  "data": {
    "orgId": "89dd1cad-60fc-48cf-aca5-7eeebb142824",
    "members": [
      {
        "userId": "52984601-42ca-4498-8e4e-8a0cf1916cd2",
        "email": "owner@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "OWNER",
        "joinedAt": "2026-02-01T10:00:00.000Z"
      },
      {
        "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "email": "admin@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "ADMIN",
        "joinedAt": "2026-02-15T14:30:00.000Z"
      },
      {
        "userId": "z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4",
        "email": "member@example.com",
        "firstName": "Bob",
        "lastName": "Johnson",
        "role": "MEMBER",
        "joinedAt": "2026-03-01T09:15:00.000Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 401 | 8010 | Authentication required |
| 403 | 3004 | You do not have access to this organization |
| 404 | 2004 | Organization not found |
| 500 | 5000 | Failed to get organization members |

**cURL Example:**
```bash
curl -X GET "http://localhost:8010/api/organizations/89dd1cad-60fc-48cf-aca5-7eeebb142824/members?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**JavaScript Example:**
```javascript
async function getOrganizationMembers(orgId, token, page = 1, limit = 10) {
  const url = new URL(
    `http://localhost:8010/api/organizations/${orgId}/members`
  );
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.resp_msg || 'Failed to get members');
  }

  return data.data;
}
```

---

### 3. Remove Organization Member

**Endpoint:** `DELETE /organizations/:orgId/members/:memberId`

**Description:** Remove a member from the organization. Only admins and owners can remove members. Cannot remove yourself.

**Request Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Parameters:**
- `orgId` (path) - Organization ID (UUID)
- `memberId` (path) - Member/User ID to remove (UUID)

**Success Response (200 OK):**
```json
{
  "success": true,
  "resp_msg": "Member removed successfully",
  "resp_code": 1000,
  "data": {
    "removed": true,
    "memberId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 401 | 8010 | Authentication required |
| 403 | 3004 | You do not have permission to remove members |
| 400 | 2000 | You cannot remove yourself from the organization |
| 404 | 2004 | Member not found |
| 500 | 5000 | Failed to remove member |

**cURL Example:**
```bash
curl -X DELETE http://localhost:8010/api/organizations/89dd1cad-60fc-48cf-aca5-7eeebb142824/members/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**JavaScript Example:**
```javascript
async function removeOrganizationMember(orgId, memberId, token) {
  const response = await fetch(
    `http://localhost:8010/api/organizations/${orgId}/members/${memberId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.resp_msg || 'Failed to remove member');
  }

  return data.data;
}
```

---

## Role Permissions

| Action | OWNER | ADMIN | MEMBER |
|--------|-------|-------|--------|
| View members | ✅ | ✅ | ✅ |
| Invite members | ✅ | ✅ | ❌ |
| Remove members | ✅ | ✅ | ❌ |
| View invites | ✅ | ✅ | ❌ |

---

## Common Patterns

### Get Members with Infinite Scroll

```javascript
async function loadMoreMembers(orgId, token) {
  let page = 1;
  let hasMore = true;
  let allMembers = [];

  while (hasMore) {
    const result = await getOrganizationMembers(orgId, token, page, 20);

    allMembers = [...allMembers, ...result.members];

    if (result.page >= result.pages) {
      hasMore = false;
    }

    page++;
  }

  return allMembers;
}
```

### Bulk Invite Members

```javascript
async function bulkInviteMembers(orgId, emails, role, token) {
  const results = [];

  for (const email of emails) {
    try {
      const invite = await createOrganizationInvite(orgId, email, role, token);
      results.push({
        email,
        success: true,
        inviteId: invite.inviteId,
      });
    } catch (error) {
      results.push({
        email,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}
```

### Build Member Directory UI

```javascript
async function buildMemberDirectory(orgId, token) {
  const result = await getOrganizationMembers(orgId, token);

  // Group by role
  const byRole = {
    OWNER: [],
    ADMIN: [],
    MEMBER: [],
  };

  result.members.forEach((member) => {
    byRole[member.role].push(member);
  });

  return byRole;
}
```

---

## Error Handling

Always check the `success` field in responses:

```javascript
async function safeApiCall(apiFunction) {
  try {
    const result = await apiFunction();

    if (!result.success) {
      console.error(`Error (${result.resp_code}): ${result.resp_msg}`);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

---

## Response Codes Reference

- **1000** - SUCCESS
- **1001** - CREATED
- **2000** - INVALID_REQUEST
- **2004** - NOT_FOUND
- **3004** - ACCESS_DENIED
- **5000** - INTERNAL_ERROR
- **8010** - AUTH_REQUIRED

---

## Testing

### Test Create Invite
```bash
curl -X POST http://localhost:8010/api/organizations/YOUR_ORG_ID/invites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "role": "MEMBER"
  }'
```

### Test Get Members
```bash
curl -X GET "http://localhost:8010/api/organizations/YOUR_ORG_ID/members" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Remove Member
```bash
curl -X DELETE "http://localhost:8010/api/organizations/YOUR_ORG_ID/members/MEMBER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Support

For issues or questions:
1. Check the error response code
2. Verify your token is valid and not expired
3. Ensure you have required permissions
4. Contact the API team
