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
}

export interface Stage {
  id: string
  name: string
  milestones: Milestone[]
}

