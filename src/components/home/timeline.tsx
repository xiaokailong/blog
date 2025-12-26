'use client'

import { useEffect, useRef } from 'react'

interface TimelineItem {
  date: string
  title: string
  description?: string
  isActive?: boolean
}

const timelineData: TimelineItem[] = [
  {
    date: '1989.12',
    title: 'Born',
    description: '在中国出生'
  },
  {
    date: '2008.09',
    title: 'College',
    description: '开始大学生活，主修计算机科学'
  },
  {
    date: '2011.07',
    title: 'Start Working',
    description: '开始工作'
  },
  {
    date: '2019.09',
    title: 'Married',
    description: '结婚'
  },
  {
    date: '2023.12',
    title: 'Baby Born',
    description: '开始全栈开发，掌握Node.js和云服务'
  },
  {
    date: '2025.12',
    title: 'Keep Going',
    description: '不断学习新技术，追求卓越',
    isActive: true
  }
]

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const items = scrollRef.current.querySelectorAll('.timeline-item')
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 0.8
          if (isVisible && !item.classList.contains('timeline-animate')) {
            setTimeout(() => {
              item.classList.add('timeline-animate')
            }, index * 100)
          }
        })
      }
    }

    // 初始检查
    setTimeout(handleScroll, 100)
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50" ref={scrollRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 统一时间轴 - 响应式布局 */}
        <div className="relative">
          {/* 桌面端：水平时间线 */}
          <div className="absolute top-[35px] left-0 right-0 h-[3px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 hidden md:block" />
          
          {/* 时间节点容器 - 响应式flex布局 */}
          <div className="relative flex flex-col md:flex-row md:justify-between md:items-start space-y-6 md:space-y-0">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className="timeline-item flex md:flex-col md:items-center md:flex-1 gap-4 md:gap-0 relative"
              >
                {/* 移动端：左侧时间线和节点 */}
                <div className="flex flex-col items-center md:contents">
                  {/* 日期 - 桌面端在上方，移动端在右侧内容区 */}
                  <div className="hidden md:block text-xs font-semibold text-gray-600 mb-3 whitespace-nowrap">
                    {item.date}
                  </div>
                  
                  {/* 节点圆点 */}
                  <div className="relative z-10 md:mb-3">
                    {item.isActive ? (
                      <div className="relative">
                        <div className="w-4 h-4 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" />
                        <div className="absolute inset-0 w-4 h-4 md:w-4 md:h-4 rounded-full bg-blue-400 animate-ping opacity-75" />
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 blur-sm opacity-50" />
                      </div>
                    ) : (
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-500 md:hover:bg-gray-700 transition-all duration-300 md:hover:scale-125 shadow-md" />
                    )}
                  </div>
                  
                  {/* 移动端垂直连接线 */}
                  {index < timelineData.length - 1 && (
                    <div className="w-[2px] flex-1 min-h-[60px] bg-gradient-to-b from-gray-400 to-gray-300 mt-2 md:hidden" />
                  )}
                </div>
                
                {/* 内容区域 */}
                <div className="flex-1 md:text-center md:max-w-[140px] pb-6 md:pb-0">
                  {/* 移动端日期显示 */}
                  <div className="text-xs font-semibold text-gray-500 mb-1 md:hidden">
                    {item.date}
                  </div>
                  
                  {/* 标题 */}
                  <h3 className={`text-base md:text-sm font-bold md:font-normal ${
                    item.isActive ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}