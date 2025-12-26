import { FloatingHeader } from '@/components/layout/floating-header'
import { Typewriter } from '@/components/home/typewriter'
import { StatsDisplay } from '@/components/home/stats-display'
import { PageTitle } from '@/components/content/page-title'
import { CodeBlock } from '@/components/home/code-block'
import { Timeline } from '@/components/home/timeline'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/layout/scroll-area'
import Link from 'next/link'

export default function Home() {
  return (
    <ScrollArea className="lg:contents" useScrollAreaId>
      <FloatingHeader scrollTitle="Velen Fan Jiahui" />
      <div className="bg-white min-h-screen">
        <PageTitle 
          title="Home" 
          className="lg:hidden" 
        />
        <div className="flex items-center justify-center overflow-hidden p-4 sm:p-8">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* 左侧：个人介绍 */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-3xl">Velen Fan Jiahui</h1>

              <div className="text-base text-gray-600 sm:text-lg lg:text-xl h-5">
                <Typewriter
                  texts={[
                    'Frontend Engineer',
                    'React & Angular Developer',
                    'UI/UX Experience Enthusiast',
                    'Building elegant interfaces'
                  ]}
                />
              </div>

              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                Hello guys! I'm a Senior Frontend Engineer at a Fortune 500 multinational corporation, where I bring creativity and technical excellence to crafting exceptional web experiences.
              </p>

              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                With a deep passion for programming and innovative design, I find inspiration in music and continuously enhance my English proficiency.
              </p>
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['Angular', 'React', 'Vue', 'WeChatAPP', 'Next.js', 'Node.js', 'RxJS', 'AG Grid', 'Electron', 'AI Coding'].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-200 sm:px-3 sm:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 统计信息 */}
            <div className="">
              <StatsDisplay />
            </div>
          </div>

          {/* 右侧：代码块 */}
          <div className="flex items-center">
            <CodeBlock />
          </div>
        </div>
      </div>
      {/* 时间轴部分 */}
      <Timeline />
      </div>
    </ScrollArea>
  )
}
