export type AppUserRole = 'admin' | 'viewer'
export type VolunteerAreaRole = 'member' | 'leader' | 'coordinator'
export type VolunteerGender = 'female' | 'male' | 'other' | 'prefer_not_to_say'
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable'

export type AppUser = {
  id: string
  authUserId: string | null
  email: string
  fullName: string | null
  role: AppUserRole
  active: boolean
}

export type ServiceArea = {
  id: string
  name: string
  slug: string
  active: boolean
  sortOrder: number
}

export type VolunteerAreaAssignment = {
  areaId: string
  areaName: string
  areaSlug: string
  roleInArea: VolunteerAreaRole
}

export type VolunteerRecord = {
  id: string
  name: string
  normalizedName: string
  photoPath: string | null
  photoUrl?: string | null
  gender: VolunteerGender | null
  birthDate: string | null
  joinDate: string | null
  address: string | null
  whatsapp: string | null
  normalizedWhatsapp: string | null
  availabilityStatus: AvailabilityStatus | null
  notes: string | null
  active: boolean
  createdAt: string
  updatedAt: string
  areas: VolunteerAreaAssignment[]
}

