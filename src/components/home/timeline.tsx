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
    title: '出生',
    description: '在中国辽宁省大连市出生'
  },
  {
    date: '2008.09',
    title: '进入大学',
    description: '开始大学生活，主修计算机科学'
  },
  {
    date: '2011.07',
    title: '开始工作',
    description: '加入第一家公司，成为前端工程师'
  },
  {
    date: '2015.03',
    title: '技术突破',
    description: '深入学习React和现代前端架构'
  },
  {
    date: '2018.06',
    title: '团队Leader',
    description: '晋升为技术团队负责人'
  },
  {
    date: '2021.09',
    title: '全栈转型',
    description: '开始全栈开发，掌握Node.js和云服务'
  },
  {
    date: '2023.12',
    title: '个人项目',
    description: '启动个人博客和技术分享平台'
  },
  {
    date: '2025.12',
    title: '持续奋斗中',
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
        items.forEach((item) => {
          const rect = item.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 0.8
          if (isVisible) {
            item.classList.add('timeline-visible')
          }
        })
      }
    }

    // 初始检查
    setTimeout(handleScroll, 100)
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50" ref={scrollRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
          我的旅程 🚀
        </h2>
        
        {/* 横向滚动容器 */}
        <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-0 min-w-max px-4">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className="timeline-item flex flex-col items-center relative min-w-[200px]"
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* 连接线 */}
                {index < timelineData.length - 1 && (
                  <div className="absolute top-[52px] left-[100px] w-[100px] h-[2px] bg-gradient-to-r from-gray-300 to-gray-200" />
                )}
                
                {/* 日期 */}
                <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 whitespace-nowrap">
                  {item.date}
                </div>
                
                {/* 节点 */}
                <div className="relative z-10 mb-4">
                  {item.isActive ? (
                    // 闪动的活跃节点
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse shadow-lg" />
                      <div className="absolute inset-0 w-6 h-6 rounded-full bg-blue-400 animate-ping opacity-75" />
                      <div className="absolute inset-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 blur-md animate-pulse" />
                    </div>
                  ) : (
                    // 普通节点
                    <div className="w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-600 transition-all duration-300 hover:scale-125 shadow-md" />
                  )}
                </div>
                
                {/* 内容卡片 */}
                <div className={`text-center max-w-[180px] transition-transform duration-300 ${item.isActive ? 'scale-105' : ''}`}>
                  <h3 className={`text-sm sm:text-base font-bold mb-1 ${
                    item.isActive ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 滚动提示（仅移动端） */}
        <div className="text-center mt-6 sm:hidden">
          <p className="text-xs text-gray-400 animate-pulse">
            ← 左右滑动查看更多 →
          </p>
        </div>
      </div>
    </div>
  )
}