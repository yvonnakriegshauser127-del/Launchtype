import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Input, Popover, DatePicker, Space, Typography, Tooltip, Divider, Popconfirm, AutoComplete, Tag } from 'antd'
import { PlusCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, WarningOutlined, UpCircleOutlined, DownCircleOutlined, UserOutlined, LaptopOutlined, CloseCircleOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from '../hooks/useTranslation'
import type { Stage, Milestone } from '../types/pipeline'
import './Pipeline.css'

const { Text } = Typography

const Pipeline: React.FC = () => {
  const { t } = useTranslation()
  
  // Демонстрационные кастомные майлстоуны для автодополнения
  const predefinedMilestones = [
    'Проверка качества',
    'Согласование с клиентом',
    'Подготовка документации',
    'Техническая проверка',
    'Финансовая проверка',
    'Юридическая проверка',
    'Согласование бюджета',
    'Подготовка к запуску',
    'Тестирование функционала',
    'Финальная проверка',
    'Перепоиск поставщика',
  ]
  
  const [stages, setStages] = useState<Stage[]>(() => {
    const createMilestone = (
      id: string,
      name: string,
      isNegative = false,
      isPositive = false
    ): Milestone => ({
      id,
      name,
      startDate: null,
      endDate: null,
      deadline: null,
      comment: null,
      isCompleted: false,
      isStarted: false,
      isEditing: false,
      isDefault: true,
      isNegative,
      isPositive,
    })

    const initialStages: Stage[] = [
      { 
        id: '1', 
        name: 'Анализ идеи',
        milestones: [
          createMilestone('analysis-1', 'Новая идея'),
          createMilestone('analysis-2', 'Просчет идеи'),
          createMilestone('analysis-3', 'Проверка идеи', false, true),
          createMilestone('analysis-4', 'Идея отклонена', true),
        ]
      },
      { 
        id: '2', 
        name: 'Поиск поставщика',
        milestones: [
          createMilestone('suppliers-1', 'Передано на поиск'),
          createMilestone('suppliers-2', 'Передано баеру'),
          createMilestone('suppliers-3', 'У баера в работе'),
          createMilestone('suppliers-4', 'Поставщик найден'),
          createMilestone('suppliers-5', 'Поставщик не найден', true),
          createMilestone('suppliers-7', 'Поиск завершен', false, true),
        ]
      },
      { 
        id: '3', 
        name: 'Закупка товара',
        milestones: [
          createMilestone('purchase-1', 'Просчет закупки'),
          createMilestone('purchase-2', 'Проверка закупки'),
          createMilestone('purchase-3', 'Создание карточки на платформе'),
          createMilestone('purchase-4', 'Добавление Асина и баркода'),
          createMilestone('purchase-5', 'Заказ товара'),
          createMilestone('purchase-6', 'Заказ в работе'),
          createMilestone('purchase-7', 'Заказ оплачен'),
          createMilestone('purchase-8', 'Заказ в пути на склад'),
          createMilestone('purchase-9', 'Заказ отклонен', true),
          createMilestone('purchase-10', 'Товар на складе', false, true),
          createMilestone('purchase-11', 'Идея отклонена', true),
        ]
      },
      { 
        id: '4', 
        name: 'Отправка товара',
        milestones: [
          createMilestone('shipping-1', 'Проверка товара'),
          createMilestone('shipping-2', 'Проблема с товаром', true),
          createMilestone('shipping-3', 'Отправка товара', false, true),
        ]
      },
      { 
        id: '5', 
        name: 'Разработка',
        milestones: [
          createMilestone('development-1', 'Создание Дизайна'),
          createMilestone('development-2', 'Создание 3Д модели'),
          createMilestone('development-3', 'Создание Видео'),
          createMilestone('development-4', 'Создание SEO'),
          createMilestone('development-5', 'Подготовка ППС', false, true),
        ]
      },
      { 
        id: '6', 
        name: 'Продвижение товара',
        milestones: [
          createMilestone('promotion-1', 'Проверка готовности к запуску'),
          createMilestone('promotion-2', 'Запуск товара'),
          createMilestone('promotion-3', 'Запуск Вайна'),
          createMilestone('promotion-4', 'Запуск рекламы'),
          createMilestone('promotion-5', 'Запуск выкупов'),
          createMilestone('promotion-6', 'Запуск компаний для блогеров', false, true),
        ]
      },
      { 
        id: '7', 
        name: 'Отчет',
        milestones: [
          createMilestone('report-1', 'Успешный запуск', false, true),
          createMilestone('report-2', 'Снятие с продажи', true),
        ]
      },
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
  const [autoCompleteOpen, setAutoCompleteOpen] = useState<boolean>(false)
  const [editingMilestone, setEditingMilestone] = useState<{
    id: string
    name: string
    deadline: Dayjs | null
    comment: string | null
    isStarted: boolean
    startDate: Dayjs | null
    isCompleted?: boolean
    endDate?: Dayjs | null
    isDefault?: boolean
  } | null>(null)
  const stageSegmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const closingTimeoutRef = useRef<number | null>(null)
  const [stageWidths, setStageWidths] = useState<{ [key: string]: number }>({})
  const milestoneNameRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({})
  const [truncatedMilestones, setTruncatedMilestones] = useState<{ [key: string]: boolean }>({})
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())
  const stageNameRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [collapsedStageWidth, setCollapsedStageWidth] = useState<number>(200)
  const milestoneWrapperRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [milestonePositions, setMilestonePositions] = useState<{ [stageId: string]: { [milestoneId: string]: { left: number, right: number } } }>({})

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
      isDefault: false, // Кастомный майлстоун
      isNegative: false,
      isPositive: false,
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
        isDefault: milestone.isDefault, // Сохраняем isDefault
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
                      isDefault: m.isDefault, // Сохраняем isDefault из оригинального майлстоуна
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
    
    // Исключаем все негативные майлстоуны из расчетов
    const milestonesToCount = stage.milestones.filter(
      (m) => !m.isNegative
    )
    
    if (milestonesToCount.length === 0) {
      return -1 // -1 означает отсутствие майлстоунов для подсчета
    }
    
    const completedCount = milestonesToCount.filter((m) => m.isCompleted).length
    const totalCount = milestonesToCount.length
    const percentage = Math.round((completedCount / totalCount) * 100)
    
    return percentage
  }

  const getStageSpecialColor = (stage: Stage): '' | 'red' | 'green' => {
    // Проверяем негативные майлстоуны (приоритет выше)
    const negativeMilestone = stage.milestones.find(m => m.isNegative && m.isCompleted)
    if (negativeMilestone) return 'red'
    
    // Проверяем позитивные майлстоуны
    const positiveMilestone = stage.milestones.find(m => m.isPositive && m.isCompleted)
    if (positiveMilestone) return 'green'
    
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
    if (!draggedMilestone) {
      return
    }

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

        const sourceMilestone = milestones[sourceIndex]
        const targetMilestone = milestones[targetIndex]
        
        // Проверяем, является ли перетаскиваемый майлстоун шаблонным
        const isSourceDefault = sourceMilestone.isDefault !== false
        const isTargetDefault = targetMilestone.isDefault !== false
        
        // Если перетаскиваемый майлстоун шаблонный, проверяем ограничения
        if (isSourceDefault) {
          // Шаблонные майлстоуны нельзя перемещать относительно друг друга
          // Запрещаем перемещение шаблонного майлстоуна на место другого шаблонного майлстоуна
          if (isTargetDefault) {
            // Блокируем перемещение - нельзя менять расположение шаблонных майлстоунов относительно друг друга
            setDraggedMilestone(null)
            return stage
          }
          
          // Если целевой майлстоун кастомный, проверяем, не разрываем ли мы последовательность шаблонных майлстоунов
          // Получаем все шаблонные майлстоуны (кроме перетаскиваемого) в их текущем порядке
            const defaultMilestones = milestones
              .map((m, idx) => ({ milestone: m, originalIndex: idx }))
              .filter(({ milestone }) => milestone.isDefault !== false && milestone.id !== sourceMilestoneId)
            
            // Находим позиции шаблонных майлстоунов слева и справа от целевой позиции
            const leftDefaultMilestones = defaultMilestones.filter(({ originalIndex }) => originalIndex < targetIndex)
            const rightDefaultMilestones = defaultMilestones.filter(({ originalIndex }) => originalIndex >= targetIndex)
            
            // Если целевая позиция находится между двумя шаблонными майлстоунами,
            // которые расположены рядом друг с другом, блокируем перемещение
            // (нельзя разрывать соседние шаблонные майлстоуны, перемещая шаблонный между ними)
            if (leftDefaultMilestones.length > 0 && rightDefaultMilestones.length > 0) {
              const leftMostDefaultIndex = leftDefaultMilestones[leftDefaultMilestones.length - 1].originalIndex
              const rightMostDefaultIndex = rightDefaultMilestones[0].originalIndex
              
              // Если два шаблонных майлстоуна находятся рядом друг с другом (без кастомных между ними),
              // и мы пытаемся вставить между ними шаблонный майлстоун, блокируем
              if (rightMostDefaultIndex === leftMostDefaultIndex + 1) {
                // Блокируем перемещение - нельзя разрывать соседние шаблонные майлстоуны
                setDraggedMilestone(null)
                return stage
              }
            }
        }

        // Удаляем элемент из исходной позиции
        const [removed] = milestones.splice(sourceIndex, 1)
        
        // Вычисляем новую позицию ПОСЛЕ удаления элемента
        // После удаления все индексы справа от sourceIndex сдвинулись влево на 1
        let newIndex: number
        if (sourceIndex < targetIndex) {
          // Перетаскиваем вправо: вставляем перед целевым элементом
          // После удаления элемента с sourceIndex, целевой элемент сдвинулся влево на 1
          // Если sourceIndex = targetIndex - 1 (соседние элементы), то newIndex = targetIndex - 1 = sourceIndex
          // Это означает, что элемент останется на той же позиции!
          // Правильная логика: если sourceIndex < targetIndex, мы хотим вставить элемент ПОСЛЕ целевого элемента
          // После удаления целевой элемент находится на позиции targetIndex - 1
          // Вставляем на позицию targetIndex (после целевого элемента)
          newIndex = targetIndex
        } else {
          // Перетаскиваем влево: вставляем перед целевым элементом
          // После удаления элемента с sourceIndex, целевой индекс не изменился
          newIndex = targetIndex
        }
        
        // Если перетаскиваемый майлстоун шаблонный, дополнительная проверка на сохранение порядка
        // после удаления из исходной позиции
        if (isSourceDefault) {
          // Получаем все шаблонные майлстоуны после удаления
          const defaultMilestonesAfterRemove = milestones
            .map((m, idx) => ({ milestone: m, index: idx }))
            .filter(({ milestone }) => milestone.isDefault !== false)
          
          // Находим шаблонные майлстоуны слева и справа от новой позиции
          const leftDefault = defaultMilestonesAfterRemove
            .filter(({ index }) => index < newIndex)
            .sort((a, b) => b.index - a.index)[0] // Самый правый слева
          
          const rightDefault = defaultMilestonesAfterRemove
            .filter(({ index }) => index >= newIndex)
            .sort((a, b) => a.index - b.index)[0] // Самый левый справа
          
          // Если есть шаблонный майлстоун слева и справа, и они находятся рядом друг с другом,
          // то нельзя вставлять шаблонный майлстоун между ними
          if (leftDefault && rightDefault && rightDefault.index === leftDefault.index + 1) {
            // Блокируем перемещение - нельзя разрывать соседние шаблонные майлстоуны
            setDraggedMilestone(null)
            return stage
          }
        }
        
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
        <div style={{ minWidth: '250px', position: 'relative' }}>
          <UserOutlined
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              fontSize: '16px',
              color: '#1890ff'
            }}
          />
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>{t('milestone.namePlaceholder')}:</Text>
              <br />
              <AutoComplete
                value={newMilestoneName}
                onChange={(value) => setNewMilestoneName(value)}
                onSelect={(value) => {
                  setNewMilestoneName(value)
                  setAutoCompleteOpen(false)
                }}
                onFocus={() => setAutoCompleteOpen(true)}
                onBlur={() => setAutoCompleteOpen(false)}
                open={autoCompleteOpen}
                options={predefinedMilestones.map(milestone => ({ value: milestone, label: milestone }))}
                placeholder={t('milestone.namePlaceholder')}
                style={{ width: '100%', marginTop: '4px' }}
                autoFocus
                allowClear
                filterOption={(inputValue, option) =>
                  option?.value?.toLowerCase().startsWith(inputValue.toLowerCase()) ?? false
                }
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
      <div style={{ minWidth: '250px', position: 'relative' }}>
        {milestone.isDefault === false ? (
          <UserOutlined 
            style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              fontSize: '16px',
              color: '#1890ff'
            }} 
          />
        ) : (
          <LaptopOutlined 
            style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              fontSize: '16px',
              color: '#1890ff'
            }} 
          />
        )}
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
              disabled={milestone.isDefault !== false}
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
          {milestone.isDefault === false && (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {!displayIsStarted && !displayIsCompleted ? (
              <Tooltip title="Майлстоун является пользовательским. Отметки о начале и окончании выставляются вручную">
                <Button
                  size="small"
                  icon={<ClockCircleOutlined />}
                  onClick={handleMarkAsStarted}
                  style={{ width: '100%' }}
                >
                  {t('milestone.markAsStarted')} <WarningOutlined style={{ marginLeft: '8px', fontSize: '14px', color: '#faad14' }} />
                </Button>
              </Tooltip>
            ) : (displayIsStarted || displayIsCompleted) ? (
              <Tooltip title="Майлстоун является пользовательским. Отметки о начале и окончании выставляются вручную">
                <Button
                  size="small"
                  icon={<ClockCircleOutlined />}
                  onClick={handleUnmarkAsStarted}
                  style={{ width: '100%' }}
                >
                  {t('milestone.unmarkAsStarted')} <WarningOutlined style={{ marginLeft: '8px', fontSize: '14px', color: '#faad14' }} />
                </Button>
              </Tooltip>
            ) : null}
            {!displayIsCompleted && (
              <Tooltip title="Майлстоун является пользовательским. Отметки о начале и окончании выставляются вручную">
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
                  {t('milestone.markCompleted')} <WarningOutlined style={{ marginLeft: '8px', fontSize: '14px', color: '#faad14' }} />
                </Button>
              </Tooltip>
            )}
            {displayIsCompleted && (
              <Tooltip title="Майлстоун является пользовательским. Отметки о начале и окончании выставляются вручную">
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
                  {t('milestone.markIncomplete')} <WarningOutlined style={{ marginLeft: '8px', fontSize: '14px', color: '#faad14' }} />
                </Button>
              </Tooltip>
          )}
          </Space>
          )}
          <Divider style={{ margin: '8px 0' }} />
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {milestone.isDefault === false && (
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
          )}
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

  // Измерение позиций майлстоунов для точного градиента
  useEffect(() => {
    const updateMilestonePositions = () => {
      setTimeout(() => {
        const positions: { [stageId: string]: { [milestoneId: string]: { left: number, right: number } } } = {}
        
        stages.forEach((stage) => {
          if (!expandedStages.has(stage.id)) return
          
          const stageSegment = stageSegmentRefs.current[stage.id]
          if (!stageSegment) return
          
          const stageRect = stageSegment.getBoundingClientRect()
          positions[stage.id] = {}
          
          stage.milestones.forEach((milestone) => {
            const wrapper = milestoneWrapperRefs.current[`${stage.id}-${milestone.id}`]
            if (wrapper) {
              const wrapperRect = wrapper.getBoundingClientRect()
              // Используем центр иконки майлстоуна для более точного позиционирования
              const iconWrapper = wrapper.querySelector('.milestone-icon-wrapper') as HTMLElement
              if (iconWrapper) {
                const iconRect = iconWrapper.getBoundingClientRect()
                const iconCenter = iconRect.left + iconRect.width / 2
                const relativeCenter = iconCenter - stageRect.left
                positions[stage.id][milestone.id] = {
                  left: relativeCenter,
                  right: relativeCenter
                }
              } else {
                // Fallback: используем центр wrapper
                const wrapperCenter = wrapperRect.left + wrapperRect.width / 2
                const relativeCenter = wrapperCenter - stageRect.left
                positions[stage.id][milestone.id] = {
                  left: relativeCenter,
                  right: relativeCenter
                }
              }
            }
          })
        })
        
        setMilestonePositions(positions)
      }, 100)
    }

    updateMilestonePositions()
    
    const resizeObserver = new ResizeObserver(() => {
      updateMilestonePositions()
    })
    
    stages.forEach((stage) => {
      const segment = stageSegmentRefs.current[stage.id]
      if (segment) {
        resizeObserver.observe(segment)
      }
      stage.milestones.forEach((milestone) => {
        const wrapper = milestoneWrapperRefs.current[`${stage.id}-${milestone.id}`]
        if (wrapper) {
          resizeObserver.observe(wrapper)
        }
      })
    })

    return () => {
      resizeObserver.disconnect()
    }
  }, [stages, expandedStages])

  // Принудительное применение пунктирной границы для кастомных майлстоунов
  useEffect(() => {
    const applyCustomMilestoneStyles = () => {
      let appliedCount = 0
      stages.forEach((stage) => {
        stage.milestones.forEach((milestone) => {
          if (milestone.isDefault === false) {
            const element = document.querySelector(`[data-milestone-id="${milestone.id}"]`) as HTMLElement
            if (element) {
              // Для кастомных майлстоунов граница теперь отображается через реальный элемент внутри
              // Устанавливаем border: transparent и position: relative для правильной работы
              element.style.setProperty('border', '2px solid transparent', 'important')
              element.style.setProperty('position', 'relative', 'important')
              
              // Реальный элемент для пунктирной границы будет создан через React, поэтому здесь ничего не делаем
              
              appliedCount++
            }
          }
        })
      })
    }
    
    // Применяем стили несколько раз с разными задержками для гарантии
    const timeoutId1 = setTimeout(applyCustomMilestoneStyles, 0)
    const timeoutId2 = setTimeout(applyCustomMilestoneStyles, 50)
    const timeoutId3 = setTimeout(applyCustomMilestoneStyles, 200)
    
    // Используем MutationObserver для отслеживания изменений стилей
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement
          if (target.hasAttribute('data-custom-milestone') && target.getAttribute('data-custom-milestone') === 'true') {
            const computedStyle = window.getComputedStyle(target)
            if (computedStyle.borderStyle !== 'dashed') {
              applyCustomMilestoneStyles()
            }
          }
        }
      })
    })
    
    // Наблюдаем за всеми кастомными майлстоунами
    stages.forEach((stage) => {
      stage.milestones.forEach((milestone) => {
        if (milestone.isDefault === false) {
          const element = document.querySelector(`[data-milestone-id="${milestone.id}"]`) as HTMLElement
          if (element) {
            observer.observe(element, {
              attributes: true,
              attributeFilter: ['style', 'class']
            })
          }
        }
      })
    })
    
    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
      observer.disconnect()
    }
  }, [stages, editingMilestone])

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                    {completion !== -1 && (
                      <Tag
                        color={
                          getStageSpecialColor(stage) === 'red' ? 'red' :
                          getStageSpecialColor(stage) === 'green' ? 'green' :
                          'blue'
                        }
                        style={{ margin: 0 }}
                      >
                        {completion}%
                      </Tag>
                    )}
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
                    {isExpanded && (
                      <Button
                        type="text"
                        icon={<PlusCircleOutlined style={{ fontSize: '20px' }} />}
                        onClick={(e) => handleAddMilestone(stage.id, e)}
                        className="stage-expand-btn"
                      />
                    )}
                  </div>
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
                        
                        // В развернутом состоянии создаем отдельные сегменты на основе реальных позиций майлстоунов
                        const stagePositions = milestonePositions[stage.id]
                        const stageSegment = stageSegmentRefs.current[stage.id]
                        
                        if (!stagePositions || !stageSegment || Object.keys(stagePositions).length === 0) {
                          // Если позиции еще не измерены, показываем синюю линию
                          return (
                            <div
                              key="segment-loading"
                              className="pipeline-line-segment blue"
                              style={{ flex: 1 }}
                            />
                          )
                        }
                        
                        const segments: JSX.Element[] = []
                        
                        // Вспомогательная функция для проверки, нужно ли учитывать майлстоун при определении цвета
                        // Негативные майлстоуны не влияют на цвет линии пайплайна
                        const shouldConsiderMilestone = (milestone: Milestone): boolean => {
                          return !milestone.isNegative
                        }
                        
                        // Проверяем, завершены ли все майлстоуны кроме "Отклонена и закрыта"
                        const otherMilestones = stage.milestones.filter(m => shouldConsiderMilestone(m))
                        const allOtherMilestonesCompleted = otherMilestones.length > 0 && otherMilestones.every(m => m.isCompleted)
                        
                        // Создаем сегменты между майлстоунами
                        // Используем центр иконки майлстоуна как точку отсчета
                        for (let i = 0; i < stage.milestones.length; i++) {
                          const milestone = stage.milestones[i]
                          const pos = stagePositions[milestone.id]
                          if (!pos) continue
                          
                          const milestoneCenter = pos.left // Теперь это центр иконки
                          
                          // Сегмент от начала до первого майлстоуна
                          if (i === 0) {
                            // Сегмент зеленый, если завершен первый майлстоун ИЛИ все остальные завершены
                            const isGreen = shouldConsiderMilestone(milestone) 
                              ? (milestone.isCompleted || allOtherMilestonesCompleted)
                              : allOtherMilestonesCompleted
                            segments.push(
                              <div
                                key={`segment-${i}-start`}
                                className={`pipeline-line-segment ${isGreen ? 'green' : 'blue'}`}
                                style={{
                                  position: 'absolute',
                                  left: 0,
                                  width: `${milestoneCenter}px`,
                                  height: '3px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                }}
                              />
                            )
                          }
                          
                          // Сегмент между майлстоунами
                          if (i > 0) {
                            const prevMilestone = stage.milestones[i - 1]
                            const prevPos = stagePositions[prevMilestone.id]
                            if (prevPos) {
                              const prevMilestoneCenter = prevPos.left
                              // Сегмент зеленый, если ОБА майлстоуна (предыдущий И текущий) завершены ИЛИ все остальные завершены
                              // Проверяем isCompleted напрямую для обоих майлстоунов, независимо от того, негативные они или нет
                              const prevCompleted = prevMilestone.isCompleted
                              const currentCompleted = milestone.isCompleted
                              const segmentIsGreen = allOtherMilestonesCompleted || (prevCompleted && currentCompleted)
                              segments.push(
                                <div
                                  key={`segment-${i}`}
                                  className={`pipeline-line-segment ${segmentIsGreen ? 'green' : 'blue'}`}
                                  style={{
                                    position: 'absolute',
                                    left: `${prevMilestoneCenter}px`,
                                    width: `${milestoneCenter - prevMilestoneCenter}px`,
                                    height: '3px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                  }}
                                />
                              )
                            }
                          }
                        }
                        
                        // Последний сегмент (от последнего майлстоуна до конца)
                        if (stage.milestones.length > 0) {
                          const lastMilestone = stage.milestones[stage.milestones.length - 1]
                          const lastPos = stagePositions[lastMilestone.id]
                          if (lastPos) {
                            const lastMilestoneCenter = lastPos.left
                            // Последний сегмент зеленый, если завершен последний майлстоун ИЛИ все остальные завершены
                            const lastSegmentIsGreen = shouldConsiderMilestone(lastMilestone)
                              ? (lastMilestone.isCompleted || allOtherMilestonesCompleted)
                              : allOtherMilestonesCompleted
                            segments.push(
                              <div
                                key={`segment-end`}
                                className={`pipeline-line-segment ${lastSegmentIsGreen ? 'green' : 'blue'}`}
                                style={{
                                  position: 'absolute',
                                  left: `${lastMilestoneCenter}px`,
                                  right: 0,
                                  height: '3px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                }}
                              />
                            )
                          }
                        }
                        
                        return <>{segments}</>
                      })()}
                    </div>
                    <div className="milestones-on-line" style={{ display: expandedStages.has(stage.id) ? 'flex' : 'none' }}>
                      {stage.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          ref={(el) => {
                            milestoneWrapperRefs.current[`${stage.id}-${milestone.id}`] = el
                          }}
                          className={`milestone-wrapper ${draggedMilestone?.milestoneId === milestone.id ? 'dragging' : ''} ${
                            dragOverMilestone === milestone.id ? 'drag-over' : ''
                          }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, stage.id, milestone.id)}
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (draggedMilestone && draggedMilestone.stageId === stage.id && draggedMilestone.milestoneId !== milestone.id) {
                              handleDragOver(e, milestone.id)
                            }
                          }}
                          onDragLeave={() => setDragOverMilestone(null)}
                          onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
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
                                  <div>
                                    {t('milestone.endDate')}: {milestone.endDate ? milestone.endDate.format('DD.MM.YYYY') : '-'}
                                  </div>
                                  <div style={{ color: milestone.deadline && dayjs().isAfter(milestone.deadline, 'day') ? '#ff4d4f' : 'inherit' }}>
                                    {t('milestone.deadline')}: {milestone.deadline ? milestone.deadline.format('DD.MM.YYYY') : '-'}
                                  </div>
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
                                    ? milestone.isNegative
                                      ? 'completed-late'
                                      : milestone.deadline && milestone.endDate && milestone.endDate.isAfter(milestone.deadline, 'day')
                                        ? 'completed-late'
                                        : 'completed-on-time'
                                    : milestone.isStarted
                                    ? 'in-progress'
                                    : 'not-started'
                                } ${focusedMilestone === milestone.id ? 'focused' : ''} ${milestone.isDefault === false ? 'custom-milestone' : ''}`}
                                data-custom-milestone={milestone.isDefault === false ? 'true' : undefined}
                                data-milestone-id={milestone.id}
                                data-milestone-name={milestone.name}
                                data-is-default={String(milestone.isDefault)}
                                style={undefined}
                                onClick={() => {
                                  handleMilestoneFocus(milestone.id)
                                }}
                              >
                                {/* Пунктирная граница для кастомных майлстоунов */}
                                {milestone.isDefault === false && (() => {
                                  const status = milestone.isCompleted
                                    ? milestone.deadline && milestone.endDate && milestone.endDate.isAfter(milestone.deadline, 'day')
                                      ? 'completed-late'
                                      : 'completed-on-time'
                                    : milestone.isStarted
                                    ? 'in-progress'
                                    : 'not-started'
                                  const borderColors: Record<string, string> = {
                                    'not-started': '#d9d9d9',
                                    'in-progress': '#faad14',
                                    'completed-on-time': '#52c41a',
                                    'completed-late': '#ff4d4f'
                                  }
                                  const borderColor = borderColors[status] || '#d9d9d9'
                                  
                                  return (
                                    <div
                                      className="custom-milestone-dashed-border"
                                      style={{
                                        position: 'absolute',
                                        top: '-3px',
                                        left: '-3px',
                                        right: '-3px',
                                        bottom: '-3px',
                                        border: `3px dashed ${borderColor}`,
                                        borderRadius: '50%',
                                        pointerEvents: 'none',
                                        zIndex: 11,
                                        boxSizing: 'border-box',
                                        backgroundColor: 'transparent'
                                      }}
                                    />
                                  )
                                })()}
                                {milestone.isCompleted ? (
                                  milestone.isNegative ? (
                                    <CloseCircleOutlined className="milestone-icon" />
                                ) : (
                                    <CheckCircleOutlined className="milestone-icon" />
                                  )
                                ) : milestone.isStarted ? (
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