export interface MailAlias {
  address: string
  localPart: string
  destinations: string[]
}

export interface AddMailAliasPayload {
  localPart: string
  destinations: string[]
}

export interface UpdateMailAliasPayload {
  destinations: string[]
}
