'use client'

export function CodeBlock() {
  const code = `const developer = {
  name: "Velen Fan Jiahui",
  role: "Senior Frontend Engineer",
  location: "Dalian, China",
  skills: [
    "React", "Next.js", "TypeScript",
    "Tailwind CSS", "Node.js"
  ],
  passion: "Building elegant UIs",
  status: "Available for opportunities"
};

console.log(\`\${developer.name} is \${developer.status}\`);`

  return (
    <div className="relative w-full rounded-lg border border-gray-200 bg-gray-50 font-mono text-sm shadow-sm">
      {/* 编辑器顶栏 */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 text-xs text-gray-500">developer.js</span>
      </div>
      
      {/* 代码内容 */}
      <div className="overflow-x-auto p-4">
        <pre className="text-xs leading-relaxed">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-4 select-none text-right text-gray-400">
                  {i + 1}
                </span>
                <span className="text-gray-800">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
