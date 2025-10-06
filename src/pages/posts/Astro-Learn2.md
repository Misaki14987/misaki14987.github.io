---
title: 'Astro 学习笔记 2'
---

Astro 是基于组件进行开发的，文件的后缀名为`.astro`。
Astro 的语法很简单，主要有三种部分：

1. **组件导入**：用来导入其他组件，写在两个`---` 之间。
2. **前端脚本**：用来处理数据和逻辑，写在两个`---` 之间。
3. **模板部分**：用来渲染 HTML，写在 `---` 之后。
   具体例子如下

```astro
---
import Header from '../components/Header.astro';
const title = 'Hello, Astro!';
---
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <Header />
    <h1>{title}</h1>
    <p>Welcome to my Astro site.</p>
  </body>
</html>
```

如你所见，就是简单的 HTML, 配上一些模板语法，比如 `{}` 来插入变量，`<Component />` 来使用组件。如果你写过 React 或 Vue，应该会觉得很熟悉。
