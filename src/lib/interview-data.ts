// 面试题数据接口和示例数据
export interface InterviewQuestion {
  id: string
  title: string
  category: string
  content: string
}

// 面试题数据 - 增加更多题目用于测试锚点
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // JavaScript 基础
  {
    id: 'js-closure',
    title: '什么是闭包？',
    category: 'JavaScript',
    content: `# 什么是闭包？

## 定义
闭包是指有权访问另一个函数作用域中变量的函数。

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
\`\`\`

## 应用场景
1. 模拟私有变量
2. 柯里化函数
3. 函数防抖和节流`
  },
  {
    id: 'js-prototype',
    title: '原型和原型链',
    category: 'JavaScript',
    content: `# 原型和原型链

## 概念
每个JavaScript对象都有一个原型对象，对象从原型继承属性和方法。

\`\`\`javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  console.log(\`Hello, I'm \${this.name}\`);
}
\`\`\``
  },
  {
    id: 'js-event-loop',
    title: 'JavaScript 事件循环',
    category: 'JavaScript',
    content: `# JavaScript 事件循环

## 执行顺序
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

\`\`\`javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出: 1, 4, 3, 2
\`\`\``
  },
  {
    id: 'js-this',
    title: 'this 指向问题',
    category: 'JavaScript',
    content: `# this 指向问题

## 绑定规则
1. 默认绑定：全局对象
2. 隐式绑定：调用对象
3. 显式绑定：call/apply/bind
4. new 绑定：新创建的对象

\`\`\`javascript
const obj = {
  name: 'Alice',
  sayName() {
    console.log(this.name);
  }
};
obj.sayName(); // Alice
\`\`\``
  },
  {
    id: 'js-promise',
    title: 'Promise 原理',
    category: 'JavaScript',
    content: `# Promise 原理

## 三种状态
- pending（进行中）
- fulfilled（已成功）
- rejected（已失败）

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('success'), 1000);
});
promise.then(result => console.log(result));
\`\`\``
  },
  
  // React
  {
    id: 'react-hooks',
    title: 'React Hooks 常用钩子',
    category: 'React',
    content: `# React Hooks

## useState
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect
\`\`\`javascript
useEffect(() => {
  // 副作用代码
  return () => {
    // 清理函数
  };
}, [dependencies]);
\`\`\`

## useRef
用于获取 DOM 元素或保存可变值。`
  },
  {
    id: 'react-lifecycle',
    title: 'React 生命周期',
    category: 'React',
    content: `# React 生命周期

## 挂载阶段
- constructor
- getDerivedStateFromProps
- render
- componentDidMount

## 更新阶段
- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

## 卸载阶段
- componentWillUnmount`
  },
  {
    id: 'react-virtual-dom',
    title: 'Virtual DOM 原理',
    category: 'React',
    content: `# Virtual DOM

## 概念
Virtual DOM 是对真实 DOM 的 JavaScript 对象表示。

## 优势
1. 减少直接操作 DOM
2. 批量更新
3. 跨平台能力

## Diff 算法
React 使用高效的 diff 算法比较新旧 Virtual DOM。`
  },
  {
    id: 'react-fiber',
    title: 'React Fiber 架构',
    category: 'React',
    content: `# React Fiber

## 什么是 Fiber
Fiber 是 React 16 引入的新的协调引擎。

## 特点
1. 可中断的渲染
2. 优先级调度
3. 增量渲染

## 工作原理
将渲染工作分解成小块，可以暂停、恢复和复用。`
  },

  // CSS
  {
    id: 'css-flexbox',
    title: 'Flexbox 布局',
    category: 'CSS',
    content: `# Flexbox 布局

## 容器属性
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
\`\`\`

## 项目属性
\`\`\`css
.item {
  flex: 1;
  flex-grow: 1;
  flex-shrink: 1;
}
\`\`\``
  },
  {
    id: 'css-grid',
    title: 'Grid 布局',
    category: 'CSS',
    content: `# Grid 布局

## 基本用法
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## 对齐方式
\`\`\`css
.container {
  justify-items: center;
  align-items: center;
}
\`\`\``
  },
  {
    id: 'css-bfc',
    title: 'BFC 块级格式化上下文',
    category: 'CSS',
    content: `# BFC

## 触发条件
1. float 不为 none
2. position 为 absolute 或 fixed
3. display 为 inline-block、table-cell
4. overflow 不为 visible

## 应用
1. 清除浮动
2. 防止 margin 重叠
3. 自适应两栏布局`
  },
  {
    id: 'css-center',
    title: '元素居中方法',
    category: 'CSS',
    content: `# 元素居中

## Flexbox
\`\`\`css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

## Grid
\`\`\`css
.parent {
  display: grid;
  place-items: center;
}
\`\`\`

## 绝对定位
\`\`\`css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\``
  },

  // 性能优化
  {
    id: 'perf-debounce',
    title: '防抖和节流',
    category: '性能优化',
    content: `# 防抖和节流

## 防抖（Debounce）
\`\`\`javascript
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
\`\`\`

## 节流（Throttle）
\`\`\`javascript
function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, args);
      last = now;
    }
  };
}
\`\`\``
  },
  {
    id: 'perf-lazy-load',
    title: '图片懒加载',
    category: '性能优化',
    content: `# 图片懒加载

## Intersection Observer
\`\`\`javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
\`\`\``
  },
  {
    id: 'perf-code-split',
    title: '代码分割',
    category: '性能优化',
    content: `# 代码分割

## 动态 import
\`\`\`javascript
// React.lazy
const Component = React.lazy(() => import('./Component'));

// 使用
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>
\`\`\`

## 路由级别分割
\`\`\`javascript
const routes = [
  {
    path: '/home',
    component: () => import('./Home')
  }
];
\`\`\``
  },

  // 网络相关
  {
    id: 'network-http',
    title: 'HTTP 状态码',
    category: '网络',
    content: `# HTTP 状态码

## 2xx 成功
- 200 OK
- 201 Created
- 204 No Content

## 3xx 重定向
- 301 永久重定向
- 302 临时重定向
- 304 Not Modified

## 4xx 客户端错误
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

## 5xx 服务器错误
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable`
  },
  {
    id: 'network-cors',
    title: '跨域解决方案',
    category: '网络',
    content: `# 跨域解决方案

## CORS
\`\`\`javascript
// 服务端设置
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
\`\`\`

## JSONP
\`\`\`javascript
function jsonp(url, callback) {
  const script = document.createElement('script');
  script.src = \`\${url}?callback=\${callback}\`;
  document.body.appendChild(script);
}
\`\`\`

## 代理
使用 nginx 或 webpack devServer 进行代理。`
  },
  {
    id: 'network-cache',
    title: 'HTTP 缓存机制',
    category: '网络',
    content: `# HTTP 缓存

## 强缓存
- Cache-Control: max-age=3600
- Expires: 过期时间

## 协商缓存
- Last-Modified / If-Modified-Since
- ETag / If-None-Match

## 缓存策略
1. 频繁变动资源: Cache-Control: no-cache
2. 不常变化资源: Cache-Control: max-age=31536000`
  }
]
