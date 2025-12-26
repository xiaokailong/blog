'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/layout/scroll-area'
import { FloatingHeader } from '@/components/layout/floating-header'
import { MarkdownRenderer } from '@/components/content/markdown-renderer'
import { PageTitle } from '@/components/content/page-title'
import { AddQuestionDialog } from './add-question-dialog'
import { INTERVIEW_QUESTIONS, type InterviewQuestion } from '@/lib/interview-data'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

export function InterviewPageClient() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(INTERVIEW_QUESTIONS)
  const [activeId, setActiveId] = useState<string>('')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // 设置默认选中第一个问题
    if (questions.length > 0 && !activeId) {
      setActiveId(questions[0].id)
    }
  }, [activeId, questions])

  // 按分类分组问题
  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, InterviewQuestion[]>)

  const activeQuestion = questions.find(q => q.id === activeId)

  // 切换分类折叠状态
  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories)
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category)
    } else {
      newCollapsed.add(category)
    }
    setCollapsedCategories(newCollapsed)
  }

  // 添加新题目
  const handleAddQuestion = (data: { title: string; category: string; content: string }) => {
    const newQuestion: InterviewQuestion = {
      id: `custom-${Date.now()}`,
      ...data
    }
    setQuestions([...questions, newQuestion])
    setActiveId(newQuestion.id)
  }

  return (
    <>
      <ScrollArea className="bg-white" useScrollAreaId>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <Plus size={16} />
            新增题目
          </button>
        
        <div className="content-wrapper">
          <div className="content">
            <div className="flex gap-0">
              {/* 左侧内容区 */}
              <div className="flex-1 min-w-0 pr-8">
                {activeQuestion ? (
                  <div className="prose prose-gray prose-sm sm:prose max-w-none">
                    <MarkdownRenderer content={activeQuestion.content} />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    请选择一个题目
                  </div>
                )}
              </div>

              {/* 右侧目录 - 紧贴屏幕边缘 */}
              <aside className="w-56 shrink-0">
                <div className="fixed right-0 top-20 bottom-0 w-56 overflow-y-auto border-l border-gray-200 bg-white">
                  <div className="p-4 space-y-2">
                    {Object.entries(groupedQuestions).map(([category, questions]) => {
                      const isCollapsed = collapsedCategories.has(category)
                      
                      return (
                        <div key={category}>
                          {/* 分类标题 */}
                          <button
                            onClick={() => toggleCategory(category)}
                            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                          >
                            <span>{category}</span>
                            {isCollapsed ? (
                              <ChevronDown size={14} className="text-gray-400" />
                            ) : (
                              <ChevronUp size={14} className="text-gray-400" />
                            )}
                          </button>
                          
                          {/* 题目列表 */}
                          {!isCollapsed && (
                            <ul className="mt-1 space-y-0.5">
                              {questions.map((question) => (
                                <li key={question.id}>
                                  <button
                                    onClick={() => setActiveId(question.id)}
                                    className={`block w-full rounded-md px-2 py-1 text-left text-xs transition-colors ${
                                      activeId === question.id
                                        ? 'bg-gray-900 text-white font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                  >
                                    {question.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* 新增题目弹窗 */}
      <AddQuestionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddQuestion}
      />
    </>
  )
}
