import { useMemo } from 'react'

type TranslationKey =
  | 'stages.newIdea'
  | 'stages.suppliers'
  | 'stages.logistics'
  | 'stages.development'
  | 'stages.preCheck'
  | 'stages.actions'
  | 'stages.report'
  | 'milestone.add'
  | 'milestone.namePlaceholder'
  | 'milestone.startDate'
  | 'milestone.endDate'
  | 'milestone.deadline'
  | 'milestone.deadlinePlaceholder'
  | 'milestone.notCompleted'
  | 'milestone.markCompleted'
  | 'milestone.markIncomplete'
  | 'milestone.delete'
  | 'milestone.deleteConfirm'
  | 'milestone.save'
  | 'milestone.nameRequired'
  | 'milestone.comment'
  | 'milestone.commentPlaceholder'
  | 'milestone.markAsStarted'
  | 'milestone.unmarkAsStarted'
  | 'common.yes'
  | 'common.no'
  | 'common.cancel'

const translations = {
  ru: {
    'stages.newIdea': 'Новая идея',
    'stages.suppliers': 'Работа с поставщиками',
    'stages.logistics': 'Логистика',
    'stages.development': 'Разработка',
    'stages.preCheck': 'Предпроверка',
    'stages.actions': 'Акции',
    'stages.report': 'Отчет',
    'milestone.add': 'Добавить майлстоун',
    'milestone.namePlaceholder': 'Название майлстоуна',
    'milestone.startDate': 'Дата начала',
    'milestone.endDate': 'Дата окончания',
    'milestone.deadline': 'Дедлайн',
    'milestone.deadlinePlaceholder': 'Выберите дедлайн',
    'milestone.notCompleted': 'Майлстоун еще не завершен',
    'milestone.save': 'Сохранить',
    'milestone.nameRequired': 'Название обязательно для заполнения',
    'milestone.markCompleted': 'Отметить как завершенный',
    'milestone.markIncomplete': 'Отметить как незавершенный',
    'milestone.delete': 'Удалить',
    'milestone.deleteConfirm': 'Вы уверены, что хотите удалить этот майлстоун?',
    'milestone.comment': 'Комментарий',
    'milestone.commentPlaceholder': 'Введите комментарий',
    'milestone.markAsStarted': 'Отметить как начатый',
    'milestone.unmarkAsStarted': 'Снять отметку о начале',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.cancel': 'Отмена',
  },
  en: {
    'stages.newIdea': 'New Idea',
    'stages.suppliers': 'Working with Suppliers',
    'stages.logistics': 'Logistics',
    'stages.development': 'Development',
    'stages.preCheck': 'Pre-check',
    'stages.actions': 'Actions',
    'stages.report': 'Report',
    'milestone.add': 'Add Milestone',
    'milestone.namePlaceholder': 'Milestone name',
    'milestone.startDate': 'Start Date',
    'milestone.endDate': 'End Date',
    'milestone.deadline': 'Deadline',
    'milestone.deadlinePlaceholder': 'Select deadline',
    'milestone.notCompleted': 'Milestone not completed yet',
    'milestone.save': 'Save',
    'milestone.nameRequired': 'Name is required',
    'milestone.markCompleted': 'Mark as Completed',
    'milestone.markIncomplete': 'Mark as Incomplete',
    'milestone.delete': 'Delete',
    'milestone.deleteConfirm': 'Are you sure you want to delete this milestone?',
    'milestone.comment': 'Comment',
    'milestone.commentPlaceholder': 'Enter comment',
    'milestone.markAsStarted': 'Mark as Started',
    'milestone.unmarkAsStarted': 'Unmark as Started',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.cancel': 'Cancel',
  },
  uk: {
    'stages.newIdea': 'Нова ідея',
    'stages.suppliers': 'Робота з постачальниками',
    'stages.logistics': 'Логістика',
    'stages.development': 'Розробка',
    'stages.preCheck': 'Передперевірка',
    'stages.actions': 'Акції',
    'stages.report': 'Звіт',
    'milestone.add': 'Додати майлстоун',
    'milestone.namePlaceholder': 'Назва майлстоуна',
    'milestone.startDate': 'Дата початку',
    'milestone.endDate': 'Дата завершення',
    'milestone.deadline': 'Дедлайн',
    'milestone.deadlinePlaceholder': 'Виберіть дедлайн',
    'milestone.notCompleted': 'Майлстоун ще не завершено',
    'milestone.save': 'Зберегти',
    'milestone.nameRequired': 'Назва обов\'язкова для заповнення',
    'milestone.markCompleted': 'Відзначити як завершений',
    'milestone.markIncomplete': 'Відзначити як незавершений',
    'milestone.delete': 'Видалити',
    'milestone.deleteConfirm': 'Ви впевнені, що хочете видалити цей майлстоун?',
    'milestone.comment': 'Коментар',
    'milestone.commentPlaceholder': 'Введіть коментар',
    'milestone.markAsStarted': 'Відзначити як розпочатий',
    'milestone.unmarkAsStarted': 'Зняти відмітку про початок',
    'common.yes': 'Так',
    'common.no': 'Ні',
    'common.cancel': 'Скасувати',
  },
}

export const useTranslation = () => {
  const language = localStorage.getItem('language') || 'ru'
  const t = (key: TranslationKey): string => {
    return translations[language as keyof typeof translations]?.[key] || key
  }

  return useMemo(() => ({ t, language }), [language])
}

