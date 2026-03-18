import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateOrganizationService,
  deleteOrganizationService,
  createOrganizationInviteService,
  getOrganizationMembersService,
  removeOrganizationMemberService,
  type UpdateOrganizationPayload,
  type CreateInvitePayload,
} from "@/services/organizationService";

/**
 * Update organization details
 * Only owner can update
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, payload }: { orgId: string; payload: UpdateOrganizationPayload }) =>
      updateOrganizationService(orgId, payload),
    onSuccess: (_data, { orgId }) => {
      // Invalidate organization queries
      queryClient.invalidateQueries({
        queryKey: ["organization", orgId],
      });
    },
  });
}

/**
 * Delete organization
 * Only owner can delete - WARNING: Irreversible action
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => deleteOrganizationService(orgId),
    onSuccess: () => {
      // Invalidate all organization queries
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });
}

/**
 * Create organization invite
 * Send invite to join organization
 * Only admins and owners can invite
 */
export function useCreateOrganizationInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, payload }: { orgId: string; payload: CreateInvitePayload }) =>
      createOrganizationInviteService(orgId, payload),
    onSuccess: (_data, { orgId }) => {
      // Invalidate organization invites
      queryClient.invalidateQueries({
        queryKey: ["organizationInvites", orgId],
      });
    },
  });
}

/**
 * Get organization members with pagination
 * Any member can view member list
 */
export function useOrganizationMembers(orgId: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["organizationMembers", orgId, page, limit],
    queryFn: () => getOrganizationMembersService(orgId, page, limit),
    enabled: !!orgId,
  });
}

/**
 * Remove organization member
 * Only admins and owners can remove
 * Cannot remove yourself
 */
export function useRemoveOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, memberId }: { orgId: string; memberId: string }) =>
      removeOrganizationMemberService(orgId, memberId),
    onSuccess: (_data, { orgId }) => {
      // Invalidate members list
      queryClient.invalidateQueries({
        queryKey: ["organizationMembers", orgId],
      });
    },
  });
}
