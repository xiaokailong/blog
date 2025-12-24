'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/layout/scroll-area'
import { FloatingHeader } from '@/components/layout/floating-header'
import { MarkdownRenderer } from '@/components/content/markdown-renderer'
import { PageTitle } from '@/components/content/page-title'

interface InterviewQuestion {
  id: string
  title: string
  category: string
  content: string
}

// 示例面试题数据
const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'javascript-closure',
    title: '什么是闭包？',
    category: 'JavaScript',
    content: `# 什么是闭包？

## 定义
闭包是指有权访问另一个函数作用域中变量的函数。

## 特点
- 函数嵌套函数
- 内部函数可以访问外部函数的变量
- 参数和变量不会被垃圾回收机制回收

## 示例代码
\`\`\`javascript
function outer() {
  let count = 0;
  
  return function inner() {
    count++;
    console.log(count);
  }
}

const counter = outer();
counter(); // 1
counter(); // 2
counter(); // 3
\`\`\`

## 应用场景
1. 模拟私有变量
2. 柯里化函数
3. 函数防抖和节流
4. 回调函数

## 注意事项
- 闭包会导致内存泄漏，需要及时释放不需要的闭包
- 闭包中的变量会常驻内存，增加内存消耗
`
  },
  {
    id: 'javascript-prototype',
    title: '原型和原型链',
    category: 'JavaScript',
    content: `# 原型和原型链

## 原型（Prototype）
每个JavaScript对象都有一个原型对象，对象从原型继承属性和方法。

## 原型链
当访问一个对象的属性时，如果对象本身没有这个属性，就会去它的原型对象上查找，如果还是没有，就继续往原型的原型上找，直到找到或到达原型链的末端（null）。

## 示例代码
\`\`\`javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(\`Hello, I'm \${this.name}\`);
}

const person1 = new Person('Alice');
person1.sayHello(); // Hello, I'm Alice

console.log(person1.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
\`\`\`

## 关键概念
- \`__proto__\`: 对象的原型指针
- \`prototype\`: 函数的原型对象
- \`constructor\`: 原型对象的构造函数引用
`
  },
  {
    id: 'react-hooks',
    title: 'React Hooks 常用钩子',
    category: 'React',
    content: `# React Hooks 常用钩子

## useState
用于在函数组件中添加状态。

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect
用于处理副作用，如数据获取、订阅等。

\`\`\`javascript
useEffect(() => {
  // 副作用代码
  return () => {
    // 清理代码
  };
}, [dependencies]);
\`\`\`

## useContext
用于访问 React Context。

\`\`\`javascript
const theme = useContext(ThemeContext);
\`\`\`

## useRef
用于获取 DOM 元素或保存可变值。

\`\`\`javascript
const inputRef = useRef(null);
\`\`\`

## useMemo
用于缓存计算结果。

\`\`\`javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
\`\`\`

## useCallback
用于缓存函数。

\`\`\`javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

## 自定义 Hook
可以创建自定义 Hook 来复用状态逻辑。

\`\`\`javascript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
}
\`\`\`
`
  },
  {
    id: 'css-flexbox',
    title: 'CSS Flexbox 布局',
    category: 'CSS',
    content: `# CSS Flexbox 布局

## 基本概念
Flexbox 是一维布局模型，用于在容器中对齐和分配空间。

## 容器属性

### display: flex
启用 Flexbox 布局。

\`\`\`css
.container {
  display: flex;
}
\`\`\`

### flex-direction
定义主轴方向。

\`\`\`css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
\`\`\`

### justify-content
定义主轴对齐方式。

\`\`\`css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
\`\`\`

### align-items
定义交叉轴对齐方式。

\`\`\`css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
\`\`\`

### flex-wrap
定义换行规则。

\`\`\`css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
\`\`\`

## 项目属性

### flex-grow
定义项目的放大比例。

\`\`\`css
.item {
  flex-grow: 1;
}
\`\`\`

### flex-shrink
定义项目的缩小比例。

\`\`\`css
.item {
  flex-shrink: 1;
}
\`\`\`

### flex-basis
定义项目的基础大小。

\`\`\`css
.item {
  flex-basis: 200px;
}
\`\`\`

### flex
\`flex-grow\`, \`flex-shrink\`, \`flex-basis\` 的简写。

\`\`\`css
.item {
  flex: 1 1 200px;
}
\`\`\`
`
  },
  {
    id: 'http-status',
    title: 'HTTP 状态码',
    category: 'Network',
    content: `# HTTP 状态码

## 1xx 信息响应
- 100 Continue: 继续请求
- 101 Switching Protocols: 切换协议

## 2xx 成功响应
- 200 OK: 请求成功
- 201 Created: 资源已创建
- 204 No Content: 无内容返回

## 3xx 重定向
- 301 Moved Permanently: 永久重定向
- 302 Found: 临时重定向
- 304 Not Modified: 资源未修改

## 4xx 客户端错误
- 400 Bad Request: 错误请求
- 401 Unauthorized: 未授权
- 403 Forbidden: 禁止访问
- 404 Not Found: 资源未找到
- 405 Method Not Allowed: 方法不允许

## 5xx 服务器错误
- 500 Internal Server Error: 服务器内部错误
- 502 Bad Gateway: 网关错误
- 503 Service Unavailable: 服务不可用
- 504 Gateway Timeout: 网关超时

## 常见场景
- 登录失败: 401
- 权限不足: 403
- 接口不存在: 404
- 参数错误: 400
- 服务器崩溃: 500
`
  },
  {
    id: 'js-event-loop',
    title: 'JavaScript 事件循环',
    category: 'JavaScript',
    content: `# JavaScript 事件循环

## 概念
JavaScript 是单线程语言，通过事件循环机制实现异步操作。

## 执行栈
同步代码在执行栈中按顺序执行。

## 任务队列

### 宏任务（Macro Task）
- setTimeout
- setInterval
- setImmediate (Node.js)
- I/O
- UI rendering

### 微任务（Micro Task）
- Promise.then/catch/finally
- MutationObserver
- queueMicrotask
- process.nextTick (Node.js)

## 执行顺序
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

## 示例代码
\`\`\`javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');
}).then(() => {
  console.log('5');
});

console.log('6');

// 输出顺序: 1, 6, 4, 5, 2, 3
\`\`\`

## 注意事项
- 微任务优先级高于宏任务
- 每次事件循环只执行一个宏任务，但会清空所有微任务
`
  }
]

export function InterviewPageClient() {
  const [activeId, setActiveId] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // 设置默认选中第一个问题
    if (interviewQuestions.length > 0 && !activeId) {
      setActiveId(interviewQuestions[0].id)
    }
  }, [activeId])

  // 按分类分组问题
  const groupedQuestions = interviewQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, InterviewQuestion[]>)

  const activeQuestion = interviewQuestions.find(q => q.id === activeId)

  return (
    <ScrollArea className="bg-white" useScrollAreaId>
      <FloatingHeader scrollTitle="前端面试题" goBackLink="/">
        <span className="text-sm text-gray-500">
          {interviewQuestions.length} 道题目
        </span>
      </FloatingHeader>
      
      <div className="content-wrapper">
        <div className="content @container/interview">
          <PageTitle 
            title="前端" 
            subtitle="持续更新中..."
            className="mb-8"
          />

          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 sm:gap-8`}>
            {/* 左侧内容区 */}
            <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-0`}>
              {activeQuestion && (
                <div className="prose prose-gray prose-sm sm:prose max-w-none">
                  <MarkdownRenderer content={activeQuestion.content} />
                </div>
              )}
            </div>

            {/* 右侧目录 */}
            <aside className={`${isMobile ? 'w-full order-first mb-4' : 'w-64'} shrink-0`}>
              <div className={`${isMobile ? 'relative' : 'sticky top-20'} space-y-4 sm:space-y-6`}>
                {Object.entries(groupedQuestions).map(([category, questions]) => (
                  <div key={category}>
                    <h3 className="mb-2 text-xs sm:text-sm font-semibold text-gray-900">
                      {category}
                    </h3>
                    <ul className="space-y-1">
                      {questions.map((question) => (
                        <li key={question.id}>
                          <button
                            onClick={() => setActiveId(question.id)}
                            className={`block w-full rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm transition-colors ${
                              activeId === question.id
                                ? 'bg-gray-100 font-medium text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {question.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
