import { Typewriter } from '@/components/home/typewriter'
import { StatsDisplay } from '@/components/home/stats-display'
import { PageTitle } from '@/components/content/page-title'
import { CodeBlock } from '@/components/home/code-block'
import { Timeline } from '@/components/home/timeline'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white">
      <div className="flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-8">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <PageTitle title="Home" className="lg:hidden" />
          {/* 左侧：个人介绍 */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">Velen Fan Jiahui</h1>

              <div className="text-base text-gray-600 sm:text-lg lg:text-xl">
                <Typewriter
                  texts={[
                    'Frontend Engineer',
                    'React & Angular Developer',
                    'UI/UX Enthusiast',
                    'Building elegant interfaces'
                  ]}
                />
              </div>

              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                Based in Dalian, China. Crafting exceptional web experiences with modern technologies. Passionate about
                clean code, beautiful design, and seamless user experiences.
              </p>
            </div>

            {/* 统计信息 */}
            <div className="pt-4">
              <StatsDisplay />
            </div>

            {/* 快速链接 */}
            <div className="flex flex-wrap gap-2 pt-2 sm:gap-3">
              <Button asChild variant="default" className="bg-black text-xs text-white hover:bg-gray-800 sm:text-sm">
                <Link href="/writing">📝 Writing</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 text-xs sm:text-sm">
                <Link href="/interview">📚 Interview</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 text-xs sm:text-sm">
                <Link href="/bookmarks">🔖 Bookmarks</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 text-xs sm:text-sm">
                <Link href="/journey">🚀 Journey</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 text-xs sm:text-sm">
                <Link href="/workspace">💼 Workspace</Link>
              </Button>
            </div>

            {/* 技能标签 */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['React', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-200 sm:px-3 sm:py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：代码块 */}
          <div className="mt-8 flex items-center lg:mt-0">
            <CodeBlock />
          </div>
        </div>
      </div>

      {/* 时间轴部分 */}
      <Timeline />
    </div>
  )
}
