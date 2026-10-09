---
title: Agent 循环与工作流模式
pubDate: 2026-10-01
author: Agent型高性能米撒奇
category: agent
tags:
  - agent
  - LLM
  - Anthropic
cover: ./cover.jpg
---
# Agent 循环与工作流模式

尝试国庆每天写一篇技术博客Day0

封面不知道用什么图片了致歉......

读一下A/的经典博客《Building Effective Agents》,然后简单实践一下
## 笔记
简单大意是我们可以将有AI参与的系统（**agentic systems**）的架构大致的分为两类吧，Workflow V.S Agent。当然也可以都不用，最简单的就是单次调用LLM，配上检索和几个示例，很多场景这样就够了

在这之前，我们先要给LLM上一些增强的功能，给他上一些调用工具，检索信息，记忆模块这些，这个"增强型LLM"是所有agentic system的基础积木，模型可以自己决定什么时候用这些增强能力

区分Workflow和Agent，就是看**谁来决定下一步怎么走**，Workflow是代码决定，Agent是模型决定

何为Workflow？就是开发者在代码里预先写好一条路线，LLM按这条路线去进行任务和调用工具。当任务的步骤能提前确定的时候，就适合用Workflow，来保证可预测性和一致性。Workflow大致分成
- Prompt Chain，提示词链，把一个大任务拆成几步，按顺序调用LLM，每一步处理上一步的输出，并且在每步之间都可以加上校验的'gate'来确保任务在正轨，且每个任务足够轻能以更高的准确度进行
- Routing，路由系统，根据输入的提示词来将任务分类，导向到专门的任务中
- Parallelization，并行，让多个AI同时工作，可以是一个任务拆成多个小任务进行，也可以是多次进行同一个任务获得多样化的输出，最后由代码把结果合起来
- Orchestrator-workers，编排，通常就是父Agent-子Agent这种。与并行的区别就是编排的子任务不是预先定义好的，而是编排器根据输入自行决定的
- Evaluator-optimizer，评估-优化，一个LLM负责生成，另一个LLM负责评估活干的怎么样并给出反馈，然后生成的LLM根据反馈再改，这样循环直到评估通过。当我们有明确的评估标准的时候这种方式才会很有效。注意它虽然也有loop，但什么时候继续、什么时候停是代码规定的，所以它还是Workflow

我觉得这些Workflow也都可以互相组合。但在我自己的实际的工程和实验中，我觉得不少模式对成本要求较高（当然Routing可以把简单问题分给便宜的模型以降低成本），子Agent相信大家也能体会出来是多么的消耗Token，因为每个Agent都给了一定的上下文且并行的工作，多出来的这部分上下文就会承担更多的成本

何为Agent？就是由模型自己决定下一步做什么，用什么工具，什么时候结束。当任务每步做什么都没法提前预测，Agent是更好的选择。

其实Agent看起来还是很简单的，就是个简单的Loop而已—人类输入，LLM调用工具，根据环境的反馈再调用工具工作，以此最后到某个目标后完成任务退出Loop并向用户输出。中间遇到拿不准的地方，也可以停下来问人类。当然，Agent需要承受比如说工具调用失败，环境爆炸了，模型天马行空跑错东西了这些试错成本，而且错误会一步步累积，所以在开发的时候需要考虑好这些问题的错误处理，也要设置停止条件，比如最多跑多少轮，避免无限loop

当然A/的建议做法是尽可能的压缩系统复杂度，能用简单方案就不上复杂的，只有简单方案效果不够的时候再考虑Workflow和Agent的事情。框架方面，A/建议先直接调LLM的API，很多模式几行代码就能写出来；如果要用框架，也一定要搞懂它到底在干什么（骗你的其实都用AI一把梭了

A/最后总结了三条原则：
- 保持简单
- 让Agent的规划步骤对人可见
- 认真设计和测试给Agent用的工具

---
## 实践
说了这么多来实践一下Agent，体验一下Agent的结构

造一个结构极其简单的Agent，功能是查本地文件，只有两个工具（list_file && read_file)，使用`@anthropic-ai/sdk`
tools部分需要的是定义工具，编写工具函数（辅助函数和全局变量忽略掉相信大家也能看懂的😁）
```ts
export const tools: Anthropic.Tool[] = [
  {
    name: "list_files",
    description:
      "列出一个目录下的文件和子目录。子目录名以 / 结尾。路径相对于工作目录，用 \".\" 表示工作目录本身。",
    input_schema: {
      type: "object",
      properties: {
        dir: { type: "string", description: "要列出的目录，例如 \".\" 或 \"loop/src\"" },
      },
      required: ["dir"],
    },
  },
  {
    name: "read_file",
    description: `读取一个文本文件的内容。路径相对于工作目录。超过 ${MAX_FILE_CHARS} 个字符的部分会被截断。`,
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "要读取的文件，例如 \"plan.md\"" },
      },
      required: ["path"],
    },
  },
];
export async function executeTool(name: string, input: unknown): Promise<string> {
  const args = input as Record<string, unknown>;
  switch (name) {
    case "list_files":
      return listFiles(requireString(args, "dir"));
    case "read_file":
      return readFile(requireString(args, "path"));
    default:
      throw new Error(`根本没有这样 ${name} 的工具`);
  }
}

async function listFiles(dir: string): Promise<string> {
  const entries = await fs.readdir(resolveInRoot(dir), { withFileTypes: true });
  const names = entries
    .filter((e) => e.name !== "node_modules" && !e.name.startsWith("."))
    .map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
  return names.length > 0 ? names.join("\n") : "空目录";
}

async function readFile(file: string): Promise<string> {
  const text = await fs.readFile(resolveInRoot(file), "utf8");
  if (text.length <= MAX_FILE_CHARS) return text;
  return `${text.slice(0, MAX_FILE_CHARS)}\n…（已截断，原文共 ${text.length} 个字符）`;
}
```

最重要的还是loop的编写，这里手写一下以好好体会

```ts

async function runAgent(question: string): Promise<void> {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: question }];

  let turn = 0;
  for (; turn < MAX_TURNS; turn++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      tools,
      messages,
    });

    const modelReply = response.content;
    messages.push({ role: "assistant", content: modelReply });
    console.log( `第 ${turn + 1} 轮--stop_reason: ${response.stop_reason}`);

    // 模型说做完了,所以这一轮没有工具要执行，打印最终回答后退出
    if (response.stop_reason === "end_turn") {
      const answer = modelReply.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("\n");
      console.log(`模型的最终回答 \n${answer}`);
      return;
    }
    // 其他情况（如max_tokens截断）,工具参数可能不完整，不能执行
    if (response.stop_reason !== "tool_use") {
      console.log(`模型停在了 ${response.stop_reason}，不再继续`);
      return;
    }

    const toolResultArray: Anthropic.ToolResultBlockParam[] = [];
    // 模型的回答分为多个block，代码判断每个block的类型，来做不同的事
    for (const block of modelReply) {
      if (block.type === "tool_use") {
        console.log(block.id, block.name, block.input);
        try {
          const toolResult = await executeTool(block.name, block.input);
          console.log(`工具 ${block.name} 返回: ${toolResult}`);
          toolResultArray.push({ type: "tool_result", tool_use_id: block.id, content: toolResult });
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          console.error(`工具 ${block.name} 出错: ${reason}`);
          toolResultArray.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `错误：${reason}`,
            is_error: true,
          });
        }
      } else if (block.type === "text") {
        console.log(block.text);
      } else if (block.type === "thinking") {
        console.log("正在检查是否是中国账号...（思考中）");
      }
    }
    messages.push({ role: "user", content: toolResultArray });
  }

  console.log(`已经跑满 ${MAX_TURNS} 轮，滚了`);
}

```

以此我们可以看到就是loop就是 1.初始提示词->2.模型输出内容，调用工具等->3.判断是否结束->不结束模型获取工具输出的结果，再跳回2，重复就好了。

在设计的时候务必注意max token和max turn，不要让模型一直跑把上下文跑炸,也不要让模型跑无限个turn

