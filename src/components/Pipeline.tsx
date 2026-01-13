import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Input, Popover, DatePicker, Space, Typography, Tooltip, Divider, Popconfirm } from 'antd'
import { PlusCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, WarningOutlined, UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from '../hooks/useTranslation'
import type { Stage, Milestone } from '../types/pipeline'
import './Pipeline.css'

const { Text } = Typography

const Pipeline: React.FC = () => {
  const { t } = useTranslation()
  const [stages, setStages] = useState<Stage[]>(() => {
    const initialStages: Stage[] = [
      { 
        id: '1', 
        name: t('stages.newIdea'), 
        milestones: [
          {
            id: 'new-idea-1',
            name: 'Создание',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'new-idea-2',
            name: 'Проверка',
            startDate: dayjs().subtract(5, 'day'),
            endDate: null,
            deadline: dayjs().add(5, 'day'),
            comment: null,
            isCompleted: false,
            isStarted: true,
            isEditing: false,
          },
          {
            id: 'new-idea-3',
            name: 'Поиск поставщика',
            startDate: dayjs().subtract(10, 'day'),
            endDate: dayjs().subtract(2, 'day'),
            deadline: dayjs().subtract(1, 'day'),
            comment: null,
            isCompleted: true,
            isStarted: true,
            isEditing: false,
          },
          {
            id: 'new-idea-4',
            name: 'Создание карточки',
            startDate: dayjs().subtract(8, 'day'),
            endDate: dayjs().subtract(1, 'day'),
            deadline: dayjs().subtract(3, 'day'),
            comment: null,
            isCompleted: true,
            isStarted: true,
            isEditing: false,
          },
          {
            id: 'new-idea-5',
            name: 'Добавление ASIN',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'new-idea-6',
            name: 'Идея реализована',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'new-idea-7',
            name: 'Отклонена и закрыта',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
        ]
      },
      { 
        id: '2', 
        name: t('stages.suppliers'), 
        milestones: [
          {
            id: 'suppliers-1',
            name: 'Поиск поставщика',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-2',
            name: 'У байера на поиске',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-3',
            name: 'У байера в работе',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-4',
            name: 'Байер нашел поставщика',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-5',
            name: 'Поставщик не был найден',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-6',
            name: 'Цена поставщика не подходит',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-7',
            name: 'Поставщик не был найден (проверено)',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-8',
            name: 'Цена поставщика не подходит (проверено)',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'suppliers-9',
            name: 'Поиск завершен',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
        ]
      },
      { id: '3', name: t('stages.logistics'), milestones: [] },
      { 
        id: '4', 
        name: t('stages.development'), 
        milestones: [
          {
            id: 'development-1',
            name: 'CEO',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'development-2',
            name: 'PPC',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'development-3',
            name: 'Дизайн',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
          {
            id: 'development-4',
            name: 'Видео',
            startDate: null,
            endDate: null,
            deadline: null,
            comment: null,
            isCompleted: false,
            isStarted: false,
            isEditing: false,
          },
        ]
      },
      { id: '5', name: t('stages.preCheck'), milestones: [] },
      { id: '6', name: t('stages.actions'), milestones: [] },
      { id: '7', name: t('stages.report'), milestones: [] },
    ]
    return initialStages
  })

  const [focusedMilestone, setFocusedMilestone] = useState<string | null>(null)
  const [draggedMilestone, setDraggedMilestone] = useState<{ stageId: string; milestoneId: string } | null>(null)
  const [dragOverMilestone, setDragOverMilestone] = useState<string | null>(null)
  const [newMilestoneStageId, setNewMilestoneStageId] = useState<string | null>(null)
  const [newMilestoneId, setNewMilestoneId] = useState<string | null>(null)
  const [newMilestoneName, setNewMilestoneName] = useState<string>('')
  const [newMilestoneDeadline, setNewMilestoneDeadline] = useState<Dayjs | null>(null)
  const [editingMilestone, setEditingMilestone] = useState<{
    id: string
    name: string
    deadline: Dayjs | null
    comment: string | null
    isStarted: boolean
    startDate: Dayjs | null
    isCompleted?: boolean
    endDate?: Dayjs | null
  } | null>(null)
  const stageSegmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const closingTimeoutRef = useRef<number | null>(null)
  const [stageWidths, setStageWidths] = useState<{ [key: string]: number }>({})
  const milestoneNameRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({})
  const [truncatedMilestones, setTruncatedMilestones] = useState<{ [key: string]: boolean }>({})
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())
  const stageNameRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [collapsedStageWidth, setCollapsedStageWidth] = useState<number>(200)

  const toggleStageExpansion = (stageId: string) => {
    setExpandedStages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(stageId)) {
        newSet.delete(stageId)
      } else {
        newSet.add(stageId)
      }
      return newSet
    })
  }

  const handleAddMilestone = (stageId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    
    const milestoneId = `milestone-${Date.now()}`
    const newMilestone: Milestone = {
      id: milestoneId,
      name: '',
      startDate: null,
      endDate: null,
      deadline: null,
      comment: null,
      isCompleted: false,
      isStarted: false,
      isEditing: false,
    }

    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, milestones: [...stage.milestones, newMilestone] }
          : stage
      )
    )
    
    setNewMilestoneStageId(stageId)
    setNewMilestoneId(milestoneId)
    setFocusedMilestone(milestoneId)
    setNewMilestoneName('')
    setNewMilestoneDeadline(null)
  }

  const handleSaveNewMilestone = (milestoneId: string, name: string, deadline: Dayjs | null, comment: string) => {
    // Если название не указано, удаляем майлстоун
    if (!name.trim()) {
      if (newMilestoneStageId) {
        handleMilestoneDelete(newMilestoneStageId, milestoneId)
      }
      setNewMilestoneStageId(null)
      setNewMilestoneId(null)
      setFocusedMilestone(null)
      setNewMilestoneName('')
      setNewMilestoneDeadline(null)
      return
    }

    setStages((prev) =>
      prev.map((stage) =>
        stage.id === newMilestoneStageId
          ? {
              ...stage,
              milestones: stage.milestones.map((m) =>
                m.id === milestoneId ? { ...m, name, deadline, comment: comment.trim() || null, isEditing: false } : m
              ),
            }
          : stage
      )
    )
    setNewMilestoneStageId(null)
    setNewMilestoneId(null)
    setFocusedMilestone(null)
    setNewMilestoneName('')
    setNewMilestoneDeadline(null)
  }

  const handleMilestoneNameChange = (stageId: string, milestoneId: string, name: string) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              milestones: stage.milestones.map((m) =>
                m.id === milestoneId ? { ...m, name } : m
              ),
            }
          : stage
      )
    )
  }

  const handleMilestoneDateChange = (
    stageId: string,
    milestoneId: string,
    field: 'startDate' | 'endDate',
    date: Dayjs | null
  ) => {
    if (editingMilestone && editingMilestone.id === milestoneId) {
      setEditingMilestone({ ...editingMilestone, [field]: date })
    }
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              milestones: stage.milestones.map((m) =>
                m.id === milestoneId ? { ...m, [field]: date } : m
              ),
            }
          : stage
      )
    )
  }

  const handleMilestoneComplete = (_stageId: string, milestoneId: string) => {
    const target =
      editingMilestone && editingMilestone.id === milestoneId
        ? editingMilestone
        : stages
            .flatMap((s) => s.milestones)
            .find((m) => m.id === milestoneId)

    if (!target) return

    const willComplete = !target.isCompleted
    const updated: typeof target = {
      ...target,
      isCompleted: willComplete,
      endDate: willComplete ? dayjs() : null,
      isStarted: willComplete ? true : target.isStarted,
      startDate: willComplete
        ? target.startDate ?? dayjs()
        : target.startDate,
    }

    setEditingMilestone(updated)
  }


  const handleMilestoneFocus = (milestoneId: string) => {
    setFocusedMilestone(milestoneId)
    const milestone = stages
      .flatMap((s) => s.milestones)
      .find((m) => m.id === milestoneId)
    if (milestone) {
      setEditingMilestone({
        id: milestone.id,
        name: milestone.name,
        deadline: milestone.deadline,
        comment: milestone.comment,
        isStarted: milestone.isStarted,
        startDate: milestone.startDate,
        isCompleted: milestone.isCompleted,
        endDate: milestone.endDate,
      })
    }
  }

  const handleMilestoneBlur = () => {
    setFocusedMilestone(null)
    setEditingMilestone(null)
  }

  const handleSaveMilestone = (milestoneId: string) => {
    if (!editingMilestone || editingMilestone.id !== milestoneId) return
    
    const stageId = stages.find((s) =>
      s.milestones.some((m) => m.id === milestoneId)
    )?.id
    
    if (!stageId) return
    
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              milestones: stage.milestones.map((m) =>
                m.id === milestoneId
                  ? {
                      ...m,
                      name: editingMilestone.name,
                      deadline: editingMilestone.deadline,
                      comment: editingMilestone.comment,
                      isStarted: editingMilestone.isStarted,
                      startDate: editingMilestone.startDate,
                      isCompleted: editingMilestone.isCompleted ?? m.isCompleted,
                      endDate: editingMilestone.endDate ?? m.endDate,
                    }
                  : m
              ),
            }
          : stage
      )
    )
    
    setEditingMilestone(null)
    handleMilestoneBlur()
  }

  const handleMarkAsStarted = () => {
    if (!editingMilestone) return
    const updated = {
      ...editingMilestone,
      isStarted: true,
      startDate: dayjs(), // Всегда текущая дата
    }
    setEditingMilestone(updated)
  }

  const handleUnmarkAsStarted = () => {
    if (!editingMilestone) return
    const updated = {
      ...editingMilestone,
      isStarted: false,
      startDate: null,
      isCompleted: false,
      endDate: null,
    }
    setEditingMilestone(updated)
  }

  const calculateStageCompletion = (stage: Stage): number => {
    if (stage.milestones.length === 0) {
      return -1 // -1 означает отсутствие майлстоунов
    }
    
    const completedCount = stage.milestones.filter((m) => m.isCompleted).length
    const totalCount = stage.milestones.length
    const percentage = Math.round((completedCount / totalCount) * 100)
    
    return percentage
  }

  const getStageSpecialColor = (stage: Stage): '' | 'red' | 'green' => {
    if (stage.id !== '1') return ''
    const realized = stage.milestones.find(
      (m) => m.id === 'new-idea-6' || m.name === 'Идея реализована'
    )
    const rejected = stage.milestones.find(
      (m) => m.id === 'new-idea-7' || m.name === 'Отклонена и закрыта'
    )
    if (rejected?.isCompleted) return 'red'
    if (realized?.isCompleted) return 'green'
    return ''
  }

  const calculateCompletionSpeed = (milestone: Milestone): number | null => {
    if (!milestone.isCompleted || !milestone.deadline || !milestone.endDate || !milestone.startDate) {
      return null
    }

    const startDate = milestone.startDate
    const deadline = milestone.deadline
    const endDate = milestone.endDate

    // Количество дней между началом и дедлайном (включая начальную дату)
    const totalDays = deadline.diff(startDate, 'day') + 1
    
    if (totalDays <= 0) {
      return null
    }

    // Количество дней между началом и окончанием (включая начальную дату)
    const actualDays = endDate.diff(startDate, 'day') + 1
    
    // Процент опережения/опоздания
    // Если actualDays > totalDays - опоздание (положительный процент)
    // Если actualDays < totalDays - опережение (отрицательный процент)
    const percentage = ((actualDays - totalDays) / totalDays) * 100
    
    return Math.round(percentage * 10) / 10 // Округляем до 1 знака после запятой
  }

  const handleMilestoneDelete = (stageId: string, milestoneId: string) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              milestones: stage.milestones.filter((m) => m.id !== milestoneId),
            }
          : stage
      )
    )
    setFocusedMilestone(null)
  }

  const handleDragStart = (e: React.DragEvent, stageId: string, milestoneId: string) => {
    setDraggedMilestone({ stageId, milestoneId })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', '')
  }

  const handleDragOver = (e: React.DragEvent, milestoneId?: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (milestoneId) {
      setDragOverMilestone(milestoneId)
    }
  }

  const handleDrop = (e: React.DragEvent, targetStageId: string, targetMilestoneId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedMilestone) return

    const { stageId: sourceStageId, milestoneId: sourceMilestoneId } = draggedMilestone

    // Перемещение только внутри одного этапа
    if (sourceStageId !== targetStageId || sourceMilestoneId === targetMilestoneId) {
      setDraggedMilestone(null)
      return
    }

    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== sourceStageId) return stage

        const milestones = [...stage.milestones]
        const sourceIndex = milestones.findIndex((m) => m.id === sourceMilestoneId)
        const targetIndex = milestones.findIndex((m) => m.id === targetMilestoneId)

        if (sourceIndex === -1 || targetIndex === -1) {
          return stage
        }

        // Удаляем элемент из исходной позиции
        const [removed] = milestones.splice(sourceIndex, 1)
        
        // Вычисляем новую позицию: вставляем перед целевым элементом
        // Если исходный индекс был меньше целевого, после удаления целевой индекс уменьшился на 1
        const newIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
        
        milestones.splice(newIndex, 0, removed)

        return {
          ...stage,
          milestones,
        }
      })
    )

    setDraggedMilestone(null)
  }

  const handleDragEnd = () => {
    setDraggedMilestone(null)
    setDragOverMilestone(null)
  }

  const getMilestonePopoverContent = (milestone: Milestone) => {
    // Если это новый майлстоун, показываем форму создания
    if (newMilestoneId === milestone.id && milestone.name === '') {
    return (
        <div style={{ minWidth: '250px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>{t('milestone.namePlaceholder')}:</Text>
              <br />
              <Input
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
                placeholder={t('milestone.namePlaceholder')}
                style={{ width: '100%', marginTop: '4px' }}
                autoFocus
              />
            </div>
            <div>
              <Text strong>{t('milestone.deadline')}:</Text>
              <br />
              <DatePicker
                value={newMilestoneDeadline}
                onChange={(date) => setNewMilestoneDeadline(date)}
                style={{ width: '100%', marginTop: '4px' }}
                format="DD.MM.YYYY"
                placeholder={t('milestone.deadlinePlaceholder')}
              />
            </div>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                if (newMilestoneStageId) {
                  handleSaveNewMilestone(milestone.id, newMilestoneName, newMilestoneDeadline, '')
                  setNewMilestoneName('')
                  setNewMilestoneDeadline(null)
                }
              }}
              style={{ width: '100%' }}
              disabled={!newMilestoneName.trim()}
            >
              {t('milestone.save')}
            </Button>
            <Button
              size="small"
              onClick={() => {
                if (newMilestoneStageId) {
                  handleMilestoneDelete(newMilestoneStageId, milestone.id)
                  setNewMilestoneStageId(null)
                  setNewMilestoneId(null)
                  setFocusedMilestone(null)
                  setNewMilestoneName('')
                  setNewMilestoneDeadline(null)
                }
              }}
              style={{ width: '100%' }}
            >
              {t('common.cancel')}
            </Button>
            <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center', display: 'block' }}>
              {t('milestone.nameRequired')}
            </Text>
          </Space>
        </div>
      )
    }
    
    const editing = editingMilestone && editingMilestone.id === milestone.id ? editingMilestone : null
    const displayName = editing?.name ?? milestone.name
    const displayDeadline = editing?.deadline ?? milestone.deadline
    const displayComment = editing?.comment ?? milestone.comment
    const displayIsStarted = editing?.isStarted ?? milestone.isStarted
    const displayIsCompleted = editing?.isCompleted ?? milestone.isCompleted
    const displayStartDate = editing?.startDate ?? milestone.startDate
    const displayEndDate = editing?.endDate ?? milestone.endDate
    
    return (
      <div style={{ minWidth: '250px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>{t('milestone.namePlaceholder')}:</Text>
            <br />
            <Input
              value={displayName}
              onChange={(e) => {
                if (editingMilestone && editingMilestone.id === milestone.id) {
                  setEditingMilestone({
                    ...editingMilestone,
                    name: e.target.value,
                  })
                }
              }}
              placeholder={t('milestone.namePlaceholder')}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
          <div>
            <Text strong>{t('milestone.deadline')}:</Text>
            <br />
            <DatePicker
              id={`milestone-deadline-${milestone.id}`}
              name={`milestone-deadline-${milestone.id}`}
              value={displayDeadline}
              onChange={(date) => {
                if (editingMilestone && editingMilestone.id === milestone.id) {
                  setEditingMilestone({
                    ...editingMilestone,
                    deadline: date,
                  })
                }
              }}
              style={{ width: '100%', marginTop: '4px' }}
              format="DD.MM.YYYY"
              placeholder={t('milestone.deadlinePlaceholder')}
            />
          </div>
          <div>
            <Text strong>{t('milestone.comment')}:</Text>
            <br />
            <Input.TextArea
              id={`milestone-comment-${milestone.id}`}
              name={`milestone-comment-${milestone.id}`}
              value={displayComment || ''}
              onChange={(e) => {
                if (editingMilestone && editingMilestone.id === milestone.id) {
                  setEditingMilestone({
                    ...editingMilestone,
                    comment: e.target.value || null,
                  })
                }
              }}
              placeholder={t('milestone.commentPlaceholder')}
              style={{ width: '100%', marginTop: '4px' }}
              rows={3}
            />
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div>
            <Text strong>{t('milestone.startDate')}:</Text>
            <br />
            <DatePicker
              id={`milestone-start-date-${milestone.id}`}
              name={`milestone-start-date-${milestone.id}`}
              value={displayStartDate}
              onChange={(date) => {
                const stageId = stages.find((s) =>
                  s.milestones.some((m) => m.id === milestone.id)
                )?.id
                if (stageId) {
                  handleMilestoneDateChange(stageId, milestone.id, 'startDate', date)
                }
              }}
              style={{ width: '100%', marginTop: '4px' }}
              format="DD.MM.YYYY"
            />
          </div>
          {displayIsCompleted && displayEndDate && (
            <div>
              <Text strong>{t('milestone.endDate')}:</Text>
              <br />
              <DatePicker
                id={`milestone-end-date-${milestone.id}`}
                name={`milestone-end-date-${milestone.id}`}
                value={displayEndDate}
                onChange={(date) => {
                  const stageId = stages.find((s) =>
                    s.milestones.some((m) => m.id === milestone.id)
                  )?.id
                  if (stageId) {
                    handleMilestoneDateChange(stageId, milestone.id, 'endDate', date)
                  }
                }}
                style={{ width: '100%', marginTop: '4px' }}
                format="DD.MM.YYYY"
              />
            </div>
          )}
              <Divider style={{ margin: '8px 0' }} />
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {!displayIsStarted && !displayIsCompleted ? (
              <Button
                size="small"
                icon={<ClockCircleOutlined />}
                onClick={handleMarkAsStarted}
                style={{ width: '100%' }}
              >
                {t('milestone.markAsStarted')}
              </Button>
            ) : (displayIsStarted || displayIsCompleted) ? (
              <Button
                size="small"
                icon={<ClockCircleOutlined />}
                onClick={handleUnmarkAsStarted}
                style={{ width: '100%' }}
              >
                {t('milestone.unmarkAsStarted')}
              </Button>
            ) : null}
            {!displayIsCompleted && (
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  const stageId = stages.find((s) =>
                    s.milestones.some((m) => m.id === milestone.id)
                  )?.id
                  if (stageId) {
                    handleMilestoneComplete(stageId, milestone.id)
                  }
                }}
                style={{ width: '100%' }}
              >
                {t('milestone.markCompleted')}
              </Button>
          )}
            {displayIsCompleted && (
              <Button
                size="small"
                onClick={() => {
                  const stageId = stages.find((s) =>
                    s.milestones.some((m) => m.id === milestone.id)
                  )?.id
                  if (stageId) {
                    handleMilestoneComplete(stageId, milestone.id)
                  }
                }}
                style={{ width: '100%' }}
              >
                {t('milestone.markIncomplete')}
              </Button>
          )}
          </Space>
          <Divider style={{ margin: '8px 0' }} />
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Popconfirm
            title={t('milestone.deleteConfirm')}
            onConfirm={() => {
              const stageId = stages.find((s) =>
                s.milestones.some((m) => m.id === milestone.id)
              )?.id
              if (stageId) {
                handleMilestoneDelete(stageId, milestone.id)
              }
            }}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{ width: '100%' }}
            >
              {t('milestone.delete')}
            </Button>
          </Popconfirm>
            <Button
              type="primary"
              size="small"
              onClick={() => handleSaveMilestone(milestone.id)}
              style={{ width: '100%' }}
            >
              {t('milestone.save')}
            </Button>
          </Space>
        </Space>
      </div>
    )
  }

  // Синхронизация ширины сегментов этапов
  useEffect(() => {
    const updateWidths = () => {
      // Небольшая задержка для корректного измерения после рендеринга
      setTimeout(() => {
        const widths: { [key: string]: number } = {}
        stages.forEach((stage) => {
          const segment = stageSegmentRefs.current[stage.id]
          if (segment) {
            widths[stage.id] = segment.offsetWidth
          }
        })
        // Применяем ширину только если есть хотя бы один майлстоун
        const hasMilestones = stages.some((stage) => stage.milestones.length > 0)
        if (hasMilestones) {
          setStageWidths(widths)
        }
      }, 0)
    }

    updateWidths()
    const resizeObserver = new ResizeObserver(() => {
      updateWidths()
    })
    
    stages.forEach((stage) => {
      const segment = stageSegmentRefs.current[stage.id]
      if (segment) {
        resizeObserver.observe(segment)
      }
    })

    return () => {
      resizeObserver.disconnect()
    }
  }, [stages])

  // Проверка однострочных названий майлстоунов и обрезания текста
  useEffect(() => {
    const checkSingleLineAndTruncation = () => {
      const truncated: { [key: string]: boolean } = {}
      
      stages.forEach((stage) => {
        stage.milestones.forEach((milestone) => {
          const el = milestoneNameRefs.current[milestone.id]
          if (el && el.textContent) {
            // Проверяем, что элемент виден и имеет размеры
            const rect = el.getBoundingClientRect()
            const isVisible = rect.width > 0 && rect.height > 0 && el.offsetWidth > 0 && el.offsetHeight > 0
            
            if (isVisible) {
              // Проверка обрезания текста
            // Для элементов с -webkit-line-clamp нужно проверять scrollHeight
            const computedStyle = window.getComputedStyle(el)
            const lineClamp = computedStyle.webkitLineClamp
            let isTruncated = false
            
            if (lineClamp && lineClamp !== 'none' && lineClamp !== 'auto') {
              // Для многострочного текста с line-clamp проверяем scrollHeight
              const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2
              const maxHeight = lineHeight * parseFloat(lineClamp)
              // Проверяем, что scrollHeight больше максимальной высоты
              isTruncated = el.scrollHeight > maxHeight + 1 // +1 для учета погрешностей
            } else {
              // Для однострочного текста проверяем scrollWidth
              isTruncated = el.scrollWidth > el.clientWidth + 1 // +1 для учета погрешностей
            }
            
            // Если элемент имеет overflow: hidden и scrollHeight > clientHeight, текст обрезан
            if (!isTruncated && computedStyle.overflow === 'hidden') {
              isTruncated = el.scrollHeight > el.clientHeight + 1
            }
            
            // Дополнительная проверка: сравниваем видимый текст с полным названием
            if (!isTruncated && milestone.name) {
              const visibleText = el.textContent?.trim() || ''
              const fullText = milestone.name.trim()
              // Если видимый текст короче полного или заканчивается на многоточие
              if (visibleText.length < fullText.length || (visibleText.endsWith('...') && !fullText.endsWith('...'))) {
                isTruncated = true
              }
            }
            
            truncated[milestone.id] = isTruncated
            
            // Создаем временный элемент для точного измерения
            const tempEl = document.createElement('div')
            
            // Копируем все стили
            tempEl.style.position = 'absolute'
            tempEl.style.visibility = 'hidden'
            tempEl.style.width = el.offsetWidth + 'px'
            tempEl.style.fontSize = computedStyle.fontSize
            tempEl.style.fontFamily = computedStyle.fontFamily
            tempEl.style.fontWeight = computedStyle.fontWeight
            tempEl.style.lineHeight = computedStyle.lineHeight
            tempEl.style.padding = computedStyle.padding
            tempEl.style.border = computedStyle.border
            tempEl.style.wordBreak = 'break-word'
            tempEl.style.whiteSpace = 'normal'
            tempEl.style.boxSizing = computedStyle.boxSizing
            tempEl.textContent = el.textContent
            
            document.body.appendChild(tempEl)
            
            const lineHeight = parseFloat(computedStyle.lineHeight) || 19.8
            const scrollHeight = tempEl.scrollHeight
            const lines = scrollHeight / lineHeight
            
            document.body.removeChild(tempEl)
            
            // Используем небольшой допуск для погрешностей округления
            if (lines <= 1.1) {
              el.classList.add('single-line')
            } else {
              el.classList.remove('single-line')
            }
            }
          }
        })
      })
      
      setTruncatedMilestones(truncated)
    }

    // Задержка для корректного измерения после рендеринга
    const timeoutId = setTimeout(checkSingleLineAndTruncation, 100)
    
    // Также проверяем периодически, чтобы обновить состояние для развернутых этапов
    const checkInterval = setInterval(checkSingleLineAndTruncation, 1000)
    
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkSingleLineAndTruncation, 100)
    })

    Object.values(milestoneNameRefs.current).forEach((el) => {
      if (el) {
        resizeObserver.observe(el)
      }
    })

    return () => {
      clearTimeout(timeoutId)
      clearInterval(checkInterval)
      resizeObserver.disconnect()
    }
  }, [stages, expandedStages])

  // Вычисление ширины свернутого этапа на основе ширины экрана
  useEffect(() => {
    const calculateCollapsedWidth = () => {
      // Получаем ширину контейнера пайплайна
      const container = document.querySelector('.pipeline-container')
      if (!container) return

      const containerWidth = container.clientWidth
      const stageCount = stages.length
      
      // Учитываем padding pipeline-stages-header (padding: 0 20px = 40px)
      const headerPadding = 40
      // Учитываем разделители между этапами (1px каждый, их stageCount - 1)
      const dividersWidth = (stageCount - 1) * 1
      
      // Вычисляем доступную ширину для этапов
      const availableWidth = containerWidth - headerPadding - dividersWidth
      
      // Делим на количество этапов
      const widthPerStage = Math.floor(availableWidth / stageCount)
      
      // Устанавливаем минимальную ширину, чтобы текст не обрезался слишком сильно
      // Но приоритет - поместить все этапы на экран
      setCollapsedStageWidth(Math.max(widthPerStage, 120))
    }

    // Вычисляем при монтировании и изменении размеров
    calculateCollapsedWidth()
    
    const resizeObserver = new ResizeObserver(() => {
      calculateCollapsedWidth()
    })

    const container = document.querySelector('.pipeline-container')
    if (container) {
      resizeObserver.observe(container)
    }

    // Также слушаем изменения размера окна
    window.addEventListener('resize', calculateCollapsedWidth)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateCollapsedWidth)
    }
  }, [stages.length])

  return (
    <Card style={{ overflow: 'visible' }} styles={{ body: { overflow: 'visible' } }}>
      <div className="pipeline-container">
        <div className="pipeline-wrapper">
          {/* Названия этапов над линией */}
          <div className="pipeline-stages-header">
            {stages.map((stage) => {
              const completion = calculateStageCompletion(stage)
              const isExpanded = expandedStages.has(stage.id)
              return (
                <div 
                  key={`header-${stage.id}`} 
                  className="stage-header-item"
                  style={
                    isExpanded && stageWidths[stage.id]
                      ? { width: `${stageWidths[stage.id]}px`, flex: 'none' }
                      : !isExpanded
                      ? { width: `${collapsedStageWidth}px`, flex: 'none' }
                      : undefined
                  }
                >
              <div className={`stage-number ${completion === -1 ? 'empty' : ''} ${getStageSpecialColor(stage)}`}>
                    {completion === -1 ? '' : `${completion}%`}
              </div>
                  <div 
                    className="stage-name" 
                    ref={(el) => {
                      stageNameRefs.current[stage.id] = el
                    }}
                  >
                    {stage.name}
                  </div>
                  <Button
                    type="text"
                    icon={isExpanded ? <UpCircleOutlined style={{ fontSize: '20px' }} /> : <DownCircleOutlined style={{ fontSize: '20px' }} />}
                    onClick={() => toggleStageExpansion(stage.id)}
                    className="stage-expand-btn"
                  />
                </div>
              )
            })}
          </div>

          {/* Линия пайплайна с майлстоунами */}
          <div className="pipeline-line-wrapper">
            <div className="pipeline-line">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <div
                    ref={(el) => {
                      stageSegmentRefs.current[stage.id] = el
                    }}
                    className="pipeline-stage-segment"
                    style={!expandedStages.has(stage.id) ? { minWidth: `${collapsedStageWidth}px` } : undefined}
                    onDragOver={(e) => {
                      if (draggedMilestone && draggedMilestone.stageId === stage.id) {
                        handleDragOver(e)
                      }
                    }}
                    onDragLeave={() => {
                      // Сбрасываем dragOver только если не перетаскиваем над майлстоуном
                      if (!dragOverMilestone) {
                        setDragOverMilestone(null)
                      }
                    }}
                  >
                    {/* Сегменты линии пайплайна для этапа */}
                    <div className="pipeline-stage-line-segments">
                      {(() => {
                        const isExpanded = expandedStages.has(stage.id)
                        const completedCount = stage.milestones.filter((m) => m.isCompleted).length
                        const totalMilestones = stage.milestones.length
                        
                        // В свернутом состоянии или если нет майлстоунов - показываем одну синюю линию
                        if (!isExpanded || totalMilestones === 0) {
                          return (
                            <div
                              key="segment-0"
                              className="pipeline-line-segment blue"
                              style={{ flex: 1 }}
                            />
                          )
                        }
                        
                        // В развернутом состоянии показываем сегменты с цветами
                        // Количество сегментов = количество майлстоунов + 1
                        // (от начала до первого, между майлстоунами, от последнего до конца)
                        const totalSegments = totalMilestones + 1
                        const segments: JSX.Element[] = []
                        
                        for (let i = 0; i < totalSegments; i++) {
                          // Сегмент зеленый в зависимости от количества завершенных майлстоунов
                          // Сегмент 0 (от начала до первого майлстоуна) зеленый, если завершен хотя бы 1 майлстоун
                          // Сегмент 1 (между первым и вторым) зеленый, если завершено >= 2 майлстоуна
                          // ...
                          // Последний сегмент (от последнего майлстоуна до конца) зеленый, если завершены все майлстоуны
                          let isGreen = false
                          if (i < totalMilestones) {
                            // Для сегментов до последнего: зеленый, если завершено >= i+1 майлстоунов
                            isGreen = completedCount >= i + 1
                          } else {
                            // Для последнего сегмента: зеленый только если завершены ВСЕ майлстоуны
                            isGreen = completedCount === totalMilestones && totalMilestones > 0
                          }
                          segments.push(
                            <div
                              key={`segment-${i}`}
                              className={`pipeline-line-segment ${isGreen ? 'green' : 'blue'}`}
                              style={{ flex: 1 }}
                            />
                          )
                        }
                        
                        return segments
                      })()}
                    </div>
                    <div className="milestones-on-line" style={{ display: expandedStages.has(stage.id) ? 'flex' : 'none' }}>
                      {stage.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`milestone-wrapper ${draggedMilestone?.milestoneId === milestone.id ? 'dragging' : ''} ${
                            dragOverMilestone === milestone.id ? 'drag-over' : ''
                          }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, stage.id, milestone.id)}
                          onDragOver={(e) => {
                            if (draggedMilestone && draggedMilestone.stageId === stage.id && draggedMilestone.milestoneId !== milestone.id) {
                              handleDragOver(e, milestone.id)
                            }
                          }}
                          onDragLeave={() => setDragOverMilestone(null)}
                          onDrop={(e) => {
                            if (draggedMilestone && draggedMilestone.stageId === stage.id) {
                              handleDrop(e, stage.id, milestone.id)
                              setDragOverMilestone(null)
                            }
                          }}
                          onDragEnd={handleDragEnd}
                        >
                          <Popover
                            content={getMilestonePopoverContent(milestone)}
                            trigger="click"
                            open={focusedMilestone === milestone.id}
                            onOpenChange={(open) => {
                              if (open) {
                                // Открываем поповер
                                // Отменяем запланированное закрытие, если оно было
                                if (closingTimeoutRef.current) {
                                  clearTimeout(closingTimeoutRef.current)
                                  closingTimeoutRef.current = null
                                }
                                handleMilestoneFocus(milestone.id)
                              } else {
                                // Закрываем поповер
                                // Проверяем, что это действительно закрытие этого поповера
                                if (focusedMilestone === milestone.id) {
                                  // Если закрываем новый майлстоун без сохранения, удаляем его
                                  if (newMilestoneId === milestone.id && milestone.name === '') {
                                    if (newMilestoneStageId) {
                                      handleMilestoneDelete(newMilestoneStageId, milestone.id)
                                    }
                                    setNewMilestoneStageId(null)
                                    setNewMilestoneId(null)
                                    setNewMilestoneName('')
                                    setNewMilestoneDeadline(null)
                                  }
                                  // Используем небольшую задержку, чтобы проверить, не происходит ли переключение
                                  closingTimeoutRef.current = setTimeout(() => {
                                    // Проверяем, что focusedMilestone все еще указывает на этот майлстоун
                                    // Если изменился, значит произошло переключение, и не нужно закрывать
                                    if (focusedMilestone === milestone.id) {
                                handleMilestoneBlur()
                                    }
                                    closingTimeoutRef.current = null
                                  }, 50)
                                }
                              }
                            }}
                          >
                            <Tooltip
                              title={
                                <div>
                                  <div>
                                    {t('milestone.startDate')}: {milestone.startDate ? milestone.startDate.format('DD.MM.YYYY') : '-'}
                                  </div>
                                  {milestone.isCompleted && milestone.endDate && (
                                    <div>
                                      {t('milestone.endDate')}: {milestone.endDate.format('DD.MM.YYYY')}
                                    </div>
                                  )}
                                  {milestone.deadline && (
                                    <div style={{ color: milestone.deadline && dayjs().isAfter(milestone.deadline, 'day') ? '#ff4d4f' : 'inherit' }}>
                                      {t('milestone.deadline')}: {milestone.deadline.format('DD.MM.YYYY')}
                                    </div>
                                  )}
                                  {milestone.comment && (
                                    <div style={{ color: '#ff4d4f' }}>
                                      {t('milestone.comment')}: {milestone.comment}
                                    </div>
                                  )}
                                </div>
                              }
                            >
                              <div
                                className={`milestone-icon-wrapper ${
                                  milestone.isCompleted
                                    ? milestone.deadline && milestone.endDate && milestone.endDate.isAfter(milestone.deadline, 'day')
                                      ? 'completed-late'
                                      : 'completed-on-time'
                                    : (editingMilestone && editingMilestone.id === milestone.id ? editingMilestone.isStarted : milestone.isStarted)
                                    ? 'in-progress'
                                    : 'not-started'
                                } ${focusedMilestone === milestone.id ? 'focused' : ''}`}
                                onClick={() => handleMilestoneFocus(milestone.id)}
                              >
                                {milestone.isCompleted ? (
                                  <CheckCircleOutlined className="milestone-icon" />
                                ) : (editingMilestone && editingMilestone.id === milestone.id ? editingMilestone.isStarted : milestone.isStarted) ? (
                                  <ClockCircleOutlined className="milestone-icon" />
                                ) : null}
                                {(() => {
                                  const speed = calculateCompletionSpeed(milestone)
                                  const hasWarning = milestone.comment || (milestone.deadline && dayjs().isAfter(milestone.deadline, 'day'))
                                  
                                  if (speed !== null) {
                                    return (
                                      <div className="milestone-speed-indicator-wrapper">
                                        <div className={`milestone-speed-indicator ${speed > 0 ? 'late' : 'early'}`}>
                                          {speed > 0 ? '+' : ''}{speed}%
                                          {hasWarning && (
                                            <WarningOutlined className="milestone-warning-icon-above" />
                                          )}
                                        </div>
                                      </div>
                                    )
                                  } else if (hasWarning) {
                                    // Если есть предупреждение (просроченный дедлайн или комментарий), показываем иконку
                                    return (
                                      <div className="milestone-speed-indicator-wrapper">
                                        <WarningOutlined className="milestone-warning-icon-above" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
                                      </div>
                                    )
                                  }
                                  return null
                                })()}
                              </div>
                            </Tooltip>
                          </Popover>
                          <div className="milestone-label">
                            {milestone.isEditing ? (
                              <Input
                                id={`milestone-input-${milestone.id}`}
                                name={`milestone-name-${milestone.id}`}
                                value={milestone.name}
                                onChange={(e) => {
                                  handleMilestoneNameChange(stage.id, milestone.id, e.target.value)
                                }}
                                onBlur={() => {
                                  const currentMilestone = stage.milestones.find((m) => m.id === milestone.id)
                                  if (currentMilestone) {
                                    if (currentMilestone.name.length === 0) {
                                    handleMilestoneDelete(stage.id, milestone.id)
                                    } else {
                                      setStages((prev) =>
                                        prev.map((s) =>
                                          s.id === stage.id
                                            ? {
                                                ...s,
                                                milestones: s.milestones.map((m) =>
                                                  m.id === milestone.id ? { ...m, isEditing: false } : m
                                                ),
                                              }
                                            : s
                                        )
                                      )
                                    }
                                  }
                                }}
                                onPressEnter={(e) => {
                                  const currentMilestone = stage.milestones.find((m) => m.id === milestone.id)
                                  if (currentMilestone) {
                                    if (currentMilestone.name.length === 0) {
                                      handleMilestoneDelete(stage.id, milestone.id)
                                    } else {
                                      setStages((prev) =>
                                        prev.map((s) =>
                                          s.id === stage.id
                                            ? {
                                                ...s,
                                                milestones: s.milestones.map((m) =>
                                                  m.id === milestone.id ? { ...m, isEditing: false } : m
                                                ),
                                              }
                                            : s
                                        )
                                      )
                                    }
                                    ;(e.target as HTMLInputElement).blur()
                                  }
                                }}
                                autoFocus
                                placeholder={t('milestone.namePlaceholder')}
                                size="small"
                                style={{ width: '120px' }}
                                onClick={(e) => e.stopPropagation()}
                                onFocus={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span
                                className="milestone-name-wrapper"
                                onDoubleClick={() => {
                                  setStages((prev) =>
                                    prev.map((s) =>
                                      s.id === stage.id
                                        ? {
                                            ...s,
                                            milestones: s.milestones.map((m) =>
                                              m.id === milestone.id ? { ...m, isEditing: true } : m
                                            ),
                                          }
                                        : s
                                    )
                                  )
                                }}
                              >
                                {truncatedMilestones[milestone.id] ? (
                                  <Tooltip 
                                    title={milestone.name}
                                    styles={{ body: { padding: '4px 8px', margin: 0 } }}
                                    placement="top"
                                    classNames={{ root: 'milestone-name-tooltip' }}
                                    mouseEnterDelay={0.1}
                                    getPopupContainer={() => document.body}
                                    onOpenChange={() => {}}
                                  >
                                    <span 
                                      className="milestone-name"
                                      ref={(el) => {
                                        milestoneNameRefs.current[milestone.id] = el
                                      }}
                                      style={{ margin: 0, padding: 0 }}
                                    >
                                      {milestone.name}
                                    </span>
                                  </Tooltip>
                                ) : (
                                  <span 
                                    className="milestone-name"
                                    ref={(el) => {
                                      milestoneNameRefs.current[milestone.id] = el
                                    }}
                                    style={{ margin: 0, padding: 0 }}
                              >
                                {milestone.name}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {index < stages.length - 1 && <div className="stage-divider"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Кнопки добавления майлстоунов */}
          <div className="pipeline-stages-footer">
            {stages.map((stage) => {
              const isExpanded = expandedStages.has(stage.id)
              return (
                <div 
                  key={`footer-${stage.id}`} 
                  className="stage-footer-item"
                  style={
                    isExpanded && stageWidths[stage.id]
                      ? { width: `${stageWidths[stage.id]}px`, flex: 'none' }
                      : !isExpanded
                      ? { width: `${collapsedStageWidth}px`, flex: 'none' }
                      : undefined
                  }
                >
                  {isExpanded && (
                <Button
                  type="dashed"
                      icon={<PlusCircleOutlined />}
                      onClick={(e) => handleAddMilestone(stage.id, e)}
                  size="small"
                  className="add-milestone-btn"
                      shape="circle"
                    />
                  )}
              </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Pipeline

