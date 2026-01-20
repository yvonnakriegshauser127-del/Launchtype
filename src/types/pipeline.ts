import { Dayjs } from 'dayjs'

export interface Milestone {
  id: string
  name: string
  startDate: Dayjs | null
  endDate: Dayjs | null
  deadline: Dayjs | null
  comment: string | null
  isCompleted: boolean
  isStarted: boolean
  isEditing: boolean
  isDefault?: boolean
  isNegative?: boolean // Негативный майлстоун (не участвует в расчетах готовности, при завершении круг красный)
  isPositive?: boolean // Позитивный майлстоун (при завершении круг зеленый)
}

export interface Stage {
  id: string
  name: string
  milestones: Milestone[]
}

