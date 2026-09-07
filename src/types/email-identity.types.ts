export type EmailDomainStatus = 'pending' | 'verified' | 'suspended'

export interface EmailSender {
  id: string
  localPart: string
  fromName: string | null
  replyToEmail: string | null
  replyToName: string | null
  isDefault: boolean
  isActive: boolean
  createdAt: string
}

export interface EmailDomain {
  id: string
  domain: string
  selector: string
  status: EmailDomainStatus
  spfVerified: boolean
  dkimVerified: boolean
  dmarcVerified: boolean
  verifiedAt: string | null
  cloudflareConnected: boolean
  createdAt: string
  senders: EmailSender[]
}

export interface DNSRecordInstruction {
  name: string
  value: string
  verified: boolean
}

export interface DomainDNSRecords {
  domain: string
  spf: DNSRecordInstruction
  dkim: DNSRecordInstruction
  dmarc: DNSRecordInstruction
}

export interface CloudflareConfigureResult {
  success: boolean
  zoneId?: string
  error?: string
}

export interface AddEmailDomainPayload {
  domain: string
  selector?: string
  cloudflareApiToken?: string
}

export interface AddEmailDomainResult {
  domain: EmailDomain
  cloudflare: CloudflareConfigureResult | null
}

export interface AddEmailSenderPayload {
  localPart: string
  fromName?: string
  replyToEmail?: string
  replyToName?: string
}

export interface UpdateEmailSenderPayload {
  fromName?: string
  replyToEmail?: string
  replyToName?: string
  isDefault?: boolean
}
