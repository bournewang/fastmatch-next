import { Gender, CompanyType, AnnualIncome, Education } from './enums'

export type Career = {
  id: number
  name: string
}

export type User = {
  id: number
  name: string
  email: string
  gender: Gender
  location?: string
  career_id?: number
  career_name?: string
  about?: string
  avatar?: string
  company_type?: CompanyType
  annual_income?: AnnualIncome
  school?: string
  education?: Education
  created_at: string
}

export type UserPhoto = {
  id: number
  user_id: number
  url: string
  is_primary: boolean
  created_at: string
}

export type Match = {
  id: number
  user1_id: number
  user2_id: number
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
} 