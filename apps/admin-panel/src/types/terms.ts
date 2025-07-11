import { Timestamp } from 'firebase/firestore'

export interface TermsAndConditions {
  id: string
  type: 'travelers' | 'drivers'
  version: number
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: Timestamp
  uploadedBy: string
  isActive: boolean
  description?: string
}

export interface CreateTermsData {
  type: 'travelers' | 'drivers'
  fileName: string
  fileUrl: string
  fileSize: number
  description?: string
}

export interface TermsSearchResult {
  terms: TermsAndConditions[]
  total: number
  hasMore: boolean
}

export interface TermsFilters {
  type?: 'travelers' | 'drivers'
  isActive?: boolean
} 