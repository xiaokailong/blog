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

// 面试题数据
const interviewQuestions: InterviewQuestion[] = [
  // JavaScript基础
  {
    id: 'js-data-types',
    title: 'JavaScript数据类型',
    category: 'JavaScript基础',
    content: `# JavaScript数据类型

## 基本数据类型（7种）
1. **Number**: 数字类型，包括整数和浮点数
2. **String**: 字符串类型
3. **Boolean**: 布尔类型，true或false
4. **Undefined**: 未定义
5. **Null**: 空值
6. **Symbol**: ES6新增，唯一标识符
7. **BigInt**: ES2020新增，大整数

## 引用数据类型
- **Object**: 对象，包括普通对象、数组、函数等

## 类型检测
\`\`\`javascript
typeof 123          // 'number'
typeof 'hello'      // 'string'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof null         // 'object' (历史遗留问题)
typeof Symbol()     // 'symbol'
typeof 123n         // 'bigint'
typeof {}           // 'object'
typeof []           // 'object'
typeof function(){} // 'function'

// 更准确的类型检测
Object.prototype.toString.call([])    // '[object Array]'
Object.prototype.toString.call(null)  // '[object Null]'
\`\`\`
`
  },
  {
    id: 'js-closure',
    title: '闭包',
    category: 'JavaScript基础',
    content: `# 闭包（Closure）

## 定义
闭包是指有权访问另一个函数作用域中变量的函数。

## 形成条件
1. 函数嵌套
2. 内部函数引用外部函数的变量
3. 内部函数被返回或传递到外部

## 示例
\`\`\`javascript
function createCounter() {
  let count = 0
  
  return {
    increment: function() {
      count++
      return count
    },
    decrement: function() {
      count--
      return count
    },
    getCount: function() {
      return count
    }
  }
}

const counter = createCounter()
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
console.log(counter.getCount())  // 2
\`\`\`

## 应用场景
1. **模块化封装**：创建私有变量
2. **函数柯里化**
3. **防抖节流**
4. **回调函数**
5. **函数工厂**

## 优缺点
**优点**：
- 可以创建私有变量
- 避免全局变量污染

**缺点**：
- 内存泄漏风险
- 变量常驻内存，增加内存消耗
`
  },
  {
    id: 'js-prototype',
    title: '原型链',
    category: 'JavaScript基础',
    content: `# 原型和原型链

## 原型（Prototype）
每个对象都有一个原型对象，用于继承属性和方法。

## 原型链
对象查找属性的链式结构，从对象本身 → 原型 → 原型的原型 → ... → null

## 核心概念
\`\`\`javascript
function Person(name) {
  this.name = name
}

Person.prototype.sayHello = function() {
  console.log(\`Hello, I'm \${this.name}\`)
}

const person = new Person('Alice')

// 原型关系
person.__proto__ === Person.prototype        // true
Person.prototype.__proto__ === Object.prototype // true
Object.prototype.__proto__ === null          // true
Person.prototype.constructor === Person      // true
\`\`\`

## 继承实现
\`\`\`javascript
// 原型链继承
function Child() {}
Child.prototype = new Parent()
Child.prototype.constructor = Child

// 组合继承
function Child() {
  Parent.call(this)
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

// ES6 class继承
class Child extends Parent {
  constructor() {
    super()
  }
}
\`\`\`
`
  },
  {
    id: 'js-this',
    title: 'this指向',
    category: 'JavaScript基础',
    content: `# this指向

## 绑定规则
### 1. 默认绑定
\`\`\`javascript
function foo() {
  console.log(this)
}
foo() // window (严格模式下是undefined)
\`\`\`

### 2. 隐式绑定
\`\`\`javascript
const obj = {
  name: 'Alice',
  sayHello() {
    console.log(this.name)
  }
}
obj.sayHello() // 'Alice'
\`\`\`

### 3. 显式绑定
\`\`\`javascript
function greet() {
  console.log(this.name)
}
const user = { name: 'Bob' }
greet.call(user)   // 'Bob'
greet.apply(user)  // 'Bob'
greet.bind(user)() // 'Bob'
\`\`\`

### 4. new绑定
\`\`\`javascript
function Person(name) {
  this.name = name
}
const person = new Person('Charlie') // this指向新创建的对象
\`\`\`

### 5. 箭头函数
\`\`\`javascript
const obj = {
  name: 'Alice',
  sayHello: () => {
    console.log(this.name) // this继承自外层作用域
  }
}
\`\`\`

## 优先级
new绑定 > 显式绑定 > 隐式绑定 > 默认绑定
`
  },
  {
    id: 'js-async',
    title: '异步编程',
    category: 'JavaScript进阶',
    content: `# JavaScript异步编程

## 1. 回调函数
\`\`\`javascript
function getData(callback) {
  setTimeout(() => {
    callback('data')
  }, 1000)
}

getData((data) => {
  console.log(data)
})
\`\`\`

## 2. Promise
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

promise
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log('done'))
\`\`\`

## 3. Async/Await
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
\`\`\`

## 4. 并发控制
\`\`\`javascript
// Promise.all - 全部成功
Promise.all([p1, p2, p3])

// Promise.race - 最快的一个
Promise.race([p1, p2, p3])

// Promise.allSettled - 全部完成
Promise.allSettled([p1, p2, p3])

// Promise.any - 任意一个成功
Promise.any([p1, p2, p3])
\`\`\`
`
  },
  {
    id: 'js-event-loop',
    title: '事件循环',
    category: 'JavaScript进阶',
    content: `# 事件循环（Event Loop）

## 执行机制
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复2-3

## 任务队列
### 宏任务（MacroTask）
- setTimeout / setInterval
- I/O
- UI渲染
- setImmediate (Node.js)

### 微任务（MicroTask）
- Promise.then/catch/finally
- MutationObserver
- queueMicrotask
- process.nextTick (Node.js)

## 经典题目
\`\`\`javascript
console.log('1')

setTimeout(() => {
  console.log('2')
  Promise.resolve().then(() => {
    console.log('3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('4')
}).then(() => {
  console.log('5')
})

console.log('6')

// 输出: 1, 6, 4, 5, 2, 3
\`\`\`

## 解析
1. 同步: 1, 6
2. 微任务: 4, 5
3. 宏任务: 2
4. 微任务: 3
`
  },
  // React相关
  {
    id: 'react-lifecycle',
    title: 'React生命周期',
    category: 'React',
    content: `# React组件生命周期

## 类组件生命周期
### 挂载阶段
1. \`constructor()\`
2. \`static getDerivedStateFromProps()\`
3. \`render()\`
4. \`componentDidMount()\`

### 更新阶段
1. \`static getDerivedStateFromProps()\`
2. \`shouldComponentUpdate()\`
3. \`render()\`
4. \`getSnapshotBeforeUpdate()\`
5. \`componentDidUpdate()\`

### 卸载阶段
- \`componentWillUnmount()\`

## Hooks等价实现
\`\`\`javascript
// componentDidMount
useEffect(() => {
  // 组件挂载后执行
}, [])

// componentDidUpdate
useEffect(() => {
  // 组件更新后执行
}, [deps])

// componentWillUnmount
useEffect(() => {
  return () => {
    // 组件卸载前执行
  }
}, [])

// 组合使用
useEffect(() => {
  // mount & update
  return () => {
    // unmount
  }
}, [deps])
\`\`\`
`
  },
  {
    id: 'react-hooks-rules',
    title: 'Hooks使用规则',
    category: 'React',
    content: `# React Hooks使用规则

## 两大规则
### 1. 只在最顶层使用 Hooks
❌ 不要在循环、条件或嵌套函数中调用
\`\`\`javascript
// 错误
if (condition) {
  useState(0) // ❌
}

// 正确
const [state, setState] = useState(0)
if (condition) {
  setState(1) // ✓
}
\`\`\`

### 2. 只在 React 函数中调用 Hooks
- ✓ React函数组件
- ✓ 自定义Hooks
- ❌ 普通JavaScript函数

## 常用Hooks
### useState
\`\`\`javascript
const [count, setCount] = useState(0)
setCount(count + 1)
setCount(prev => prev + 1) // 函数式更新
\`\`\`

### useEffect
\`\`\`javascript
useEffect(() => {
  // side effect
  return () => {
    // cleanup
  }
}, [dependencies])
\`\`\`

### useCallback
\`\`\`javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b)
  },
  [a, b]
)
\`\`\`

### useMemo
\`\`\`javascript
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
)
\`\`\`
`
  },
  {
    id: 'react-performance',
    title: 'React性能优化',
    category: 'React',
    content: `# React性能优化

## 1. React.memo
避免不必要的重渲染
\`\`\`javascript
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>
})
\`\`\`

## 2. useMemo
缓存计算结果
\`\`\`javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
\`\`\`

## 3. useCallback
缓存函数引用
\`\`\`javascript
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])
\`\`\`

## 4. 虚拟列表
大列表渲染优化
\`\`\`javascript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={500}
  itemCount={1000}
  itemSize={35}
>
  {Row}
</FixedSizeList>
\`\`\`

## 5. 代码分割
\`\`\`javascript
const OtherComponent = React.lazy(() => import('./OtherComponent'))

<Suspense fallback={<Loading />}>
  <OtherComponent />
</Suspense>
\`\`\`

## 6. 避免内联对象
\`\`\`javascript
// ❌ 每次渲染都创建新对象
<Child style={{ color: 'red' }} />

// ✓ 提取到外部
const style = { color: 'red' }
<Child style={style} />
\`\`\`
`
  },
  // CSS相关
  {
    id: 'css-box-model',
    title: 'CSS盒模型',
    category: 'CSS',
    content: `# CSS盒模型

## 标准盒模型
\`\`\`
width/height = content
总宽度 = width + padding + border + margin
\`\`\`

## IE盒模型
\`\`\`
width/height = content + padding + border
总宽度 = width + margin
\`\`\`

## box-sizing
\`\`\`css
/* 标准盒模型 */
box-sizing: content-box;

/* IE盒模型（推荐） */
box-sizing: border-box;
\`\`\`

## 实践建议
\`\`\`css
/* 全局使用border-box */
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

## 示例
\`\`\`css
.box {
  width: 200px;
  padding: 20px;
  border: 10px solid;
  margin: 10px;
  box-sizing: border-box;
}

/* 实际内容宽度 = 200 - 20*2 - 10*2 = 140px */
/* 总占用空间 = 200 + 10*2 = 220px */
\`\`\`
`
  },
  {
    id: 'css-layout',
    title: '布局方案',
    category: 'CSS',
    content: `# CSS布局方案

## 1. Flexbox布局
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
\`\`\`

## 2. Grid布局
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## 3. 两栏布局
\`\`\`css
/* Flex方案 */
.container {
  display: flex;
}
.sidebar {
  width: 200px;
}
.main {
  flex: 1;
}

/* Float方案 */
.sidebar {
  float: left;
  width: 200px;
}
.main {
  margin-left: 200px;
}
\`\`\`

## 4. 三栏布局（圣杯/双飞翼）
\`\`\`css
.container {
  display: flex;
}
.left {
  width: 200px;
}
.center {
  flex: 1;
}
.right {
  width: 200px;
}
\`\`\`

## 5. 水平垂直居中
\`\`\`css
/* Flex */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid */
.parent {
  display: grid;
  place-items: center;
}

/* Position */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\`
`
  },
  {
    id: 'css-responsive',
    title: '响应式设计',
    category: 'CSS',
    content: `# 响应式设计

## 媒体查询
\`\`\`css
/* 移动优先 */
.container {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}

@media (min-width: 1280px) {
  .container {
    width: 1200px;
  }
}
\`\`\`

## 常用断点
\`\`\`css
/* 手机 */
@media (max-width: 767px) {}

/* 平板 */
@media (min-width: 768px) and (max-width: 1023px) {}

/* 桌面 */
@media (min-width: 1024px) {}
\`\`\`

## 相对单位
\`\`\`css
/* rem - 相对根元素字体大小 */
html {
  font-size: 16px;
}
.text {
  font-size: 1.5rem; /* 24px */
}

/* em - 相对父元素字体大小 */
.parent {
  font-size: 20px;
}
.child {
  font-size: 0.8em; /* 16px */
}

/* vw/vh - 相对视口 */
.full-screen {
  width: 100vw;
  height: 100vh;
}

/* % - 相对父元素 */
.half {
  width: 50%;
}
\`\`\`

## 响应式图片
\`\`\`html
<img 
  srcset="small.jpg 300w,
          medium.jpg 600w,
          large.jpg 1200w"
  sizes="(max-width: 600px) 300px,
         (max-width: 1200px) 600px,
         1200px"
  src="fallback.jpg"
  alt="Responsive image"
>
\`\`\`
`
  },
  // 浏览器和性能
  {
    id: 'browser-render',
    title: '浏览器渲染机制',
    category: '浏览器',
    content: `# 浏览器渲染机制

## 渲染流程
1. **解析HTML** → 构建DOM树
2. **解析CSS** → 构建CSSOM树
3. **合并** → 生成渲染树(Render Tree)
4. **布局(Layout)** → 计算元素位置和大小
5. **绘制(Paint)** → 绘制像素
6. **合成(Composite)** → 合成图层

## 重排(Reflow)
触发条件：
- DOM添加/删除
- 元素位置/尺寸改变
- 页面初始化
- 浏览器窗口变化

## 重绘(Repaint)
触发条件：
- 颜色变化
- 文字变化
- 背景变化

## 性能优化
\`\`\`javascript
// ❌ 多次重排
element.style.width = '100px'
element.style.height = '100px'
element.style.margin = '10px'

// ✓ 批量修改
element.style.cssText = 'width:100px;height:100px;margin:10px'

// ✓ 使用class
element.className = 'new-class'

// ✓ 离线操作DOM
const fragment = document.createDocumentFragment()
// 操作fragment
parent.appendChild(fragment)

// ✓ 使用transform代替位置变化
element.style.transform = 'translateX(100px)'
\`\`\`
`
  },
  {
    id: 'http-cache',
    title: 'HTTP缓存',
    category: '浏览器',
    content: `# HTTP缓存机制

## 强缓存
直接从缓存读取，不请求服务器

### Expires (HTTP/1.0)
\`\`\`
Expires: Wed, 21 Oct 2025 07:28:00 GMT
\`\`\`

### Cache-Control (HTTP/1.1)
\`\`\`
Cache-Control: max-age=3600        # 3600秒后过期
Cache-Control: no-cache            # 需要验证
Cache-Control: no-store            # 不缓存
Cache-Control: public              # 可被任何缓存
Cache-Control: private             # 只能被浏览器缓存
\`\`\`

## 协商缓存
向服务器验证缓存是否可用

### Last-Modified / If-Modified-Since
\`\`\`
# 服务器响应
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# 客户端请求
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
\`\`\`

### ETag / If-None-Match
\`\`\`
# 服务器响应
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 客户端请求
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
\`\`\`

## 缓存流程
1. 检查强缓存 → 命中 → 使用缓存
2. 未命中 → 发送请求，携带协商缓存标识
3. 服务器验证 → 304 → 使用缓存
4. 资源变化 → 200 → 返回新资源
`
  },
  {
    id: 'web-security',
    title: 'Web安全',
    category: '安全',
    content: `# Web安全

## XSS (跨站脚本攻击)
### 类型
1. **存储型**: 恶意脚本存储在服务器
2. **反射型**: 恶意脚本在URL中
3. **DOM型**: 修改页面DOM

### 防御
\`\`\`javascript
// 输入过滤
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// 使用安全的API
element.textContent = userInput // ✓
element.innerHTML = userInput   // ❌

// CSP (Content Security Policy)
Content-Security-Policy: default-src 'self'
\`\`\`

## CSRF (跨站请求伪造)
### 防御
1. **Token验证**
\`\`\`javascript
// 请求携带token
fetch('/api', {
  headers: {
    'X-CSRF-Token': token
  }
})
\`\`\`

2. **SameSite Cookie**
\`\`\`
Set-Cookie: session=xxx; SameSite=Strict
\`\`\`

3. **验证Referer**

## SQL注入
\`\`\`javascript
// ❌ 危险
const query = \`SELECT * FROM users WHERE id = \${userId}\`

// ✓ 使用参数化查询
const query = 'SELECT * FROM users WHERE id = ?'
db.query(query, [userId])
\`\`\`

## 点击劫持
\`\`\`
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
\`\`\`
`
  }
]

export function InterviewPageClient() {
  const [activeId, setActiveId] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
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
        <div className="interview-content @container/interview">
          <PageTitle 
            title="前端面试题" 
            subtitle="持续更新中..."
            className="mb-8"
          />

          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 lg:gap-10`}>
            {/* 左侧内容区 */}
            <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-0`}>
              {activeQuestion && (
                <div className="prose prose-gray prose-sm sm:prose max-w-none">
                  <MarkdownRenderer content={activeQuestion.content} />
                </div>
              )}
            </div>

            {/* 右侧目录 - 更紧凑 */}
            <aside className={`${isMobile ? 'w-full order-first mb-4' : 'w-56 lg:w-60'} shrink-0`}>
              <div className={`${isMobile ? 'relative' : 'sticky top-20'} space-y-3`}>
                {Object.entries(groupedQuestions).map(([category, questions]) => (
                  <div key={category} className="border-l-2 border-gray-200 pl-3">
                    <h3 className="mb-1.5 text-xs font-bold text-gray-900 uppercase tracking-wide">
                      {category}
                    </h3>
                    <ul className="space-y-0.5">
                      {questions.map((question) => (
                        <li key={question.id}>
                          <button
                            onClick={() => setActiveId(question.id)}
                            className={`block w-full rounded px-2 py-1 text-left text-xs transition-all ${
                              activeId === question.id
                                ? 'bg-black text-white font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
