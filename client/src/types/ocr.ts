export interface CardData {
  id_number?: string
  prefix_th?: string
  name_th?: string
  prefix_en?: string
  name_en?: string
  date_of_birth?: string
  date_of_birth_th?: string
  date_of_birth_en?: string
  address?: string
  date_of_issue?: string
  date_of_expiry?: string
}

export interface OCRResponse {
  success: boolean
  data?: CardData
}