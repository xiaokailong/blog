'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; category: string; content: string }) => void
}

export function AddQuestionDialog({ isOpen, onClose, onSubmit }: AddQuestionDialogProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('JavaScript')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && category.trim() && content.trim()) {
      onSubmit({ title, category, content })
      // 重置表单
      setTitle('')
      setCategory('JavaScript')
      setContent('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg bg-white p-6 shadow-xl">
        {/* 标题栏 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">新增面试题</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 题目标题 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              题目标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：什么是闭包？"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              分类 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            >
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="CSS">CSS</option>
              <option value="性能优化">性能优化</option>
              <option value="网络">网络</option>
              <option value="其他">其他</option>
            </select>
          </div>

          {/* 答案内容 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              答案内容（支持 Markdown） <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={'示例：\n# 什么是闭包？\n\n## 定义\n闭包是指...\n\n```javascript\nfunction outer() {\n  // 代码\n}\n```'}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              rows={12}
              required
            />
          </div>

          {/* 提示信息 */}
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            <p className="mb-1 font-medium">Markdown 格式提示：</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>使用 # 开头表示标题（# 一级标题，## 二级标题）</li>
              <li>使用 ```javascript 包裹代码块</li>
              <li>使用 - 或 * 开头表示列表项</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              添加题目
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
