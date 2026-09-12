export interface PlatformEmailSettings {
  fromEmail: string
  fromName: string
  supportEmail: string | null
}

export interface UpdatePlatformEmailSettingsPayload {
  fromEmail: string
  fromName: string
  supportEmail?: string
}
