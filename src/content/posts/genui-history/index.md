---
title: "GenUI技术的历史，学习与开发"
pubDate: 2026-10-02
author: "M1saK1"
category: "frontend"
tags: ["frontend", "agent", "GenUI"]
cover: "./cover.jpg"
---

尝试国庆每天写一篇技术博客Day1
## GenUI简要介绍和发展历程
GenUI(Generative UI) 生成式UI，是Agent应用里越来越重要的一种交互形态，能够让你的应用里的AI根据用户提示词背后的意图，在应用中‘长’出新的UI组件供用户使用和体验。最早把这个词带进工程界、引发广泛讨论的是Vercel 2024年3月发布的AI SDK 3.0 [Introducing AI SDK 3.0 with Generative UI support](https://vercel.com/blog/ai-sdk-3-generative-ui)；同月在设计领域，NN/G将GenUI和Outcome-Oriented Design（结果导向设计）联系在一起[Generative UI and Outcome-Oriented Design](https://www.nngroup.com/articles/generative-ui/)。

但其实“UI不由设计师和前端工程师写死，而是由某种描述动态生成”的想法很早就有了。MBUID（基于模型的UI开发）提出过“抽象UI → 具体UI”的分层，同一份抽象描述可以适配不同平台,当然这是学术上的概念。工程上，Server-Driven UI 是服务端发一份JSON，前端按约定渲染，这样不发版也能改动界面，微软2017年的Adaptive Cards也是类似思路。这些技术已经解决了“界面可以由数据描述、动态下发”的问题，但下发什么界面，仍然是人用规则或运营配置提前写死的，所以技术上这种技术只是一种Option，真正缺的一环仍然是谁来决定这个UI长什么样、做什么用，而如果能够把这种考量决策外包给AI，是否我们就能够根据各种意图方便的，将这种生成出来的UI组件填充进应用，从而让这项技术有用武之地呢？


一开始市场上的AI应用还是只能对话框里聊聊天，AI给你生成一堆Markdown，表格就算是最好看的UI了。真正的苗头还是在2024年，Claude推出了Claude Artifacts，让AI直接写出可运行的小页面在侧边栏展示；另一边ChatGPT Canvas提供了和AI协作编辑的工作区，AI生成的东西开始以UI的形式出现在自家Agent应用里。2025年才是GenUI的大爆发，各个AI公司和社区也意识到这个领域还没有一套统一的规范，所以谁的规范被采纳，谁就能掌握这个新技术领域的话语权和市场。5 月，CopilotKit 推出 AG-UI 协议，规范 Agent 后端和前端之间的事件流；年中，社区项目 MCP-UI 出现，让 MCP 工具可以返回复杂的 UI 资源（html）；10 月，OpenAI Apps SDK 发布，第三方应用可以以交互界面形式嵌入 ChatGPT（基于 MCP）；11 月，Gemini 3 推出 Dynamic View / Visual Layout，对每个问题即时生成定制的交互式页面， 同时Google Research 发表论文，论证 LLM 能胜任 UI 生成；同月 Anthropic、OpenAI 和 MCP-UI 联合提出 MCP Apps 扩展提案；12 月，Google 开源 A2UI（Agent-to-User Interface）协议，走声明式 JSON 路线。可见各大AI厂商和社区都想在这个看起来是未来的UI领域占据一席之地。

今年GenUI技术逐渐趋向稳定和标准化：1月26日，MCP Apps 成为 MCP 的第一个官方扩展，由 MCP-UI 和 OpenAI Apps SDK 合并而来，Claude、ChatGPT、VS Code、Goose 等客户端都已支持；4月，A2UI v0.9 发布，定位为框架无关的声明式 UI 标准，同一份输出可以在 Web、Flutter、Android、iOS等平台或跨平台上原生渲染。AG2、Oracle 等厂商陆续接入 AG-UI 和 A2UI，社区也开始举办专门的 GenUI 黑客松。

## 技术上的细节
GenUI的种类，从横向来看可以按“模型对界面的自由度”分为三类，从低到高：
1. 受控型（Static/Controlled）：AI 选择调用哪个预制组件，并填入数据。例：天气卡片、航班卡片
2. 声明式（Declarative）：AI 输出 JSON 描述的界面，客户端用自有组件渲染。例：A2UI、Adaptive Cards
3. 开放式（Open-ended）：AI 直接写 HTML/JS 代码，放进沙箱运行。例：Claude Artifacts、ChatGPT Visualize
受控型安全、品牌一致，但牺牲了自由度；声明式通过JSON来描述UI，有一定的可拓展性，但也带来了实实在在的复杂度：组件目录（catalog）怎么设计、协议版本怎么演进、Agent端/服务端/前端是不是各要维护一套校验；开放式则最灵活，直接给你造出来一个小网页，但随之而来的是安全和一致性难以控制。

各自的实现方式也不同：
### 受控型：工具调用到组件的映射
```
用户："北京天气怎样"
→ 模型调用 getWeather({city:"北京"})
→ 前端发现这个工具调用，渲染 <WeatherCard data={...}/>
```

e.g：Vercel AI SDK（tool parts）、CopilotKit、LangGraph Generative UI。

### 声明式：模型输出界面描述，客户端用白名单组件渲染
```json
{ "component": "Card", "children": [
  { "component": "Text", "text": "选择航班" },
  { "component": "List", "items": [...], "onSelect": "action:pick_flight" } ] }
```

关键是组件目录（catalog），模型只能使用客户端允许的组件，所以安全、样式统一，而且可以跨平台原生渲染。e.g：A2UI、Flutter GenUI SDK、Thesys C1。

### 开放式：模型写代码，放进沙箱执行
模型生成完整的 HTML/JS，在隔离的 iframe 中运行，通过 postMessage 和宿主或 Agent 通信。e.g：Claude Artifacts，以及ChatGPT桌面端的Visualize（是个Skill）。

这里要单独说一下MCP Apps。同样跑在沙箱iframe里，但HTML是第三方开发者预先写好的UI资源，模型只决定调用哪个工具，写什么数据。所以从模型自由度看它更接近受控型，只是渲染方式和开放式一样，可以理解为“受控的自由度 + 开放式的渲染”。

架构上，可以用下面这五层来定位任何一个GenUI方案，如果前面说是横向这里可以说是纵向罢，当然实际产品常常会合并其中几层或者自研某一层，比如受控型里工具的schema本身就是UI描述协议，很多产品的传输层也是自己的SSE事件流而不是AG-UI。

1. 宿主/客户端：Claude · ChatGPT · Gemini · VS Code · 你想开发的 App
2. 渲染层：组件库 / 设计系统 / 沙箱 iframe / 原生组件
3. UI 描述协议：A2UI（声明式 JSON） · MCP Apps（HTML 资源）
4. 交互传输协议：AG-UI（事件流、状态同步、双向通信）
5. Agent/模型层：LLM + 工具调用 + 结构化输出 + 流式生成

而这里每一层的具体技术实现都很重要，比如
- 结构化输出 / 工具调用：让模型稳定地产出可以解析的界面描述
- 流式渲染：界面边生成边显示，掩盖生成延迟
- 双向状态同步：用户在界面上的操作（点击、填表）要回传给 Agent，Agent 再更新界面。AG-UI 主要解决的就是这个问题
- 沙箱与权限：开放式代码必须隔离运行，防止 XSS、数据外泄和提示注入

## 技术选型上的考量
有了三种类型和五层架构，真正动手的时候会发现，技术选型其实要先回答三个问题：

1. 产品到底需要多少种界面形态？需求越少，越不该为自由度Pay off
2. 不确定性放在哪一层？模型要写的UI代码越多，可能出错的地方就越多
3. 失败的时候怎么降级？一个坏掉的组件不能拖垮整条回答

正好我最近在写一个Agent项目(https://mate.hduhelp.com)，杭电助手的学长推荐我做一下来拓展一下我的简历内容。负责了一部分内容包括GenUI的优化，以此为契机才去了解的GenUI，而我也以这个为例子来说明一下学习过程中的思考，和实际实践中的技术选型的考量，以及架构上的实现与优化

在小公园里写的，被蚊子咬的要命了明天再写
