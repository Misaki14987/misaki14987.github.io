---
layout: ../../layouts/MarkdownLayout.astro
title: 'React+GSAP搓一个简单的词云组件'
pubDate: 2025-12-6
author: 'M1saK1'
category: '不使用d3实现一个简单的无碰撞词云'
image:
  url: 'src/assets/2025.jpg'
  alt: 'wordcloud'
tags: ['Frontend', 'Web Development']
---

起因是在杭电助手接了一个学校图书馆的活，做一个图书馆借阅数据的年度总结的前端，其中有一个需求是要有一个词云，展示用户这年阅读的关键词。嘛没做过这种需求...遂借助互联网神力发现可以使用`d3.js`中的`d3-cloud`来实现，甚至 react 还有个别人写好的库`react-wordcloud`，赶紧塞到我的项目中。
结果打包的时候尴尬了，d3 疑似有点重了，依赖打包后有点大，cicd 过不了(其实可以拆一下 bundle 但我当时忘了)。悲愤之下决定自己搓一个，感觉也算不难，分享一下心得.

## 设计思路

词云的目标是在不依赖 d3 的情况下，让词条位置恰当，之间不碰撞，词条的大小适中，随权重变化，并且适配移动端（~~在此基础上做得炫酷一点~~)

---

## 词条处理

如何让词条位置在合适的位置？这里我给每个词条都定义了一个外接的矩形，用于判定其占位，是否碰撞等等

矩形是根据宽度，高度，旋转角来计算的，代码如下

```typescript
const BOUND_PADDING = 8;
const getRotatedBounds = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotate: number,
): Bounds => {
  const radians = (rotate * Math.PI) / 180; // 角度转弧度
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const centerX = x + width / 2; // 以词的中心为参考
  const centerY = y + height / 2;
  // 旋转矩形的轴对齐包围盒尺寸（加绝对值避免负数）
  const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
  const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);
  // 生成带 padding 的最小外接矩形，后续用它来做碰撞检测
  return {
    minX: centerX - rotatedWidth / 2 - BOUND_PADDING,
    maxX: centerX + rotatedWidth / 2 + BOUND_PADDING,
    minY: centerY - rotatedHeight / 2 - BOUND_PADDING,
    maxY: centerY + rotatedHeight / 2 + BOUND_PADDING,
  };
};
```

判定矩形是否相撞，这里使用了 AABB 算法

关于碰撞检测的算法，这个视频比较短小精罕<https://youtu.be/59BTXB-kFNs>，~~这种碰撞算法在游戏中使用的很多啊，我也想做游戏了~~

代码如下，还是挺简单的：）

```typescript
const intersects = (a: Placement, b: Placement) => {
  // AABB 判定：只要两个包围盒在任一轴上不分离，就视为相交
  return !(
    (
      a.bounds.maxX < b.bounds.minX || // A 在 B 左侧且不重叠
      a.bounds.minX > b.bounds.maxX || // A 在 B 右侧且不重叠
      a.bounds.maxY < b.bounds.minY || // A 在 B 上方且不重叠
      a.bounds.minY > b.bounds.maxY
    ) // A 在 B 下方且不重叠
  );
};
```

---

词条的大小是随着权重而改变的。这里问了一下 AI 有没有什么更好的方法，代码如下

```typescript
const mapFontSize = (
  value: number,
  min: number,
  max: number,
  minFont: number,
  maxFont: number,
) => {
  if (max === min) return (minFont + maxFont) / 2; // 防止除以 0，统一给中间值
  const span = max - min || 1;
  return minFont + ((value - min) / span) * (maxFont - minFont); // 线性映射权重到字号
};
```

预先定义好 minFont 和 maxFont 防止过大或过小，也能根据屏幕的大小来适配字体大小。先把权重压成 0-1 的比例  (value - min) / (max - min)，比例 0 对应最小字号，比例 1 对应最大字号。然后用这个比例在线性插值：字号 = minFont + 比例 \* (maxFont - minFont)。比如权重区间 10 ～ 50、字号区间 20 ～ 60，权重 30 的比例是 0.5，算出来字号就是 40。极端情况下如果  max === min（所有权重都一样），直接取字号区间的中间值，避免除以 0

---

## 词云构造

词条已经处理好了，如何排列词条构成词云呢？思路如下

先将词条从大到小进行一个排列，将最小和最大权重的词条挑出来，定义一些基本的量

```typescript
const sorted = [...words].sort((a, b) => b.value - a.value); //排序
const min = Math.min(...sorted.map((w) => w.value));
const max = Math.max(...sorted.map((w) => w.value));
const isCompact = size.width < 640; //计算屏幕
const minFont = isCompact ? 14 : 20; //最小的字
const maxFont = isCompact ? 36 : 60; //最大的字
const centerX = size.width / 2; //确定容器的横轴中心
const centerY = isCompact ? size.height * 0.5 : size.height * 0.38; //确定容器的纵轴中心
```

然后测量文字，交替地去横着竖着螺旋排列，最后判断是否碰撞

```typescript
const fontSize = mapFontSize(word.value, min, max, minFont, maxFont);
//...
const metrics = ctx.measureText(word.text);
const textWidth = metrics.width;
const textHeight = fontSize * (
  metrics.actualBoundingBoxAscent
    ? (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / fontSize
    : 1
);
const isVertical = index % 2 === 1; //交替
const rotate = isVertical ? -90 : 0; //横着还是竖着，这是一个问题

let angle = Math.random() * Math.PI * 2; //从一个随机的角度开始排列
let radius = 0;
let attempts = 0; //定义attempt，当词条塞不下导致程序无限循环时还能退出防止崩溃
while (attempts < MAX_ATTEMPTS && !placedWord) {
    const x = centerX + radius * Math.cos(angle) - textWidth / 2;
    const y = centerY + radius * Math.sin(angle) - textHeight / 2;
    const bounds = getRotatedBounds(x, y, textWidth, textHeight, rotate); //计算词条容器
    const candidate: Placement = {
          ...word,
          fontSize,
          x,
          y,
          rotate,
          width: textWidth,
          height: textHeight,
          bounds,
        }; //定义Placement的类型
    //是否放进去了
    const fitsInside =
          bounds.minX >= 0 &&
          bounds.minY >= 0 &&
          bounds.maxX <= size.width &&
          bounds.maxY <= size.height;
    //放进去了就判断是否碰撞，不碰撞就可以了
    if (
          fitsInside &&
          !placed.some((existing) => intersects(existing, candidate))
        ) {
          placedWord = candidate;
          placed.push(candidate);
          break;
        }
        angle += ANGLE_STEP; // 继续沿螺旋前进
        radius += RADIUS_STEP * ANGLE_STEP;
        attempts += 1;
      }
});
```

> 这里的 ctx 是一个`canvas` 对象

这样一个基本的词云就完成了

---

## 交互优化

写了一个 gsap 的淡入动画，刚开始接触 gsap，动画略显粗糙简便：（

```typescript
useEffect(() => {
  if (!containerRef.current) return;
  gsap.fromTo(
    containerRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 0.6, ease: 'power2.out' }, // 渐显动画
  );
}, [words]);
```

需要监控容器尺寸来调整词云的参数，这里使用`useLayoutEffect`来监控, `ResizeObserver`来获取容器参数

```typescript
useLayoutEffect(() => {
  const container = containerRef.current;
  if (!container) return;
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    setSize({ width, height }); // 实时记录容器尺寸，驱动布局
  });
  observer.observe(container);
  return () => observer.disconnect();
}, []);
```

---

总的代码如下

<details>
<summary>Code</summary>

```typescript
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

interface WordDatum {
  text: string;
  value: number;
  color: string;
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Placement extends WordDatum {
  fontSize: number;
  x: number;
  y: number;
  rotate: number;
  width: number;
  height: number;
  bounds: Bounds;
}

interface WordCloudProps {
  words: WordDatum[];
}

const ANGLE_STEP = 0.45; // 每次沿螺旋前进的角度步进（弧度）
const RADIUS_STEP = 4; // 每次迭代半径增量，用于向外扩散
const MAX_ATTEMPTS = 1200; // 单词寻找位置的最大尝试次数，防止无限循环
const BOUND_PADDING = 8; // 旋转包围盒的额外留白，避免边缘贴得过紧

const mapFontSize = (
  value: number,
  min: number,
  max: number,
  minFont: number,
  maxFont: number
) => {
  if (max === min) return (minFont + maxFont) / 2; // 防止除以 0，统一给中间值
  const span = max - min || 1;
  return minFont + ((value - min) / span) * (maxFont - minFont); // 线性映射权重到字号
};

const getRotatedBounds = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotate: number
): Bounds => {
  const radians = (rotate * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin); // 旋转后的宽高（含 padding）
  const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);
  return {
    minX: centerX - rotatedWidth / 2 - BOUND_PADDING,
    maxX: centerX + rotatedWidth / 2 + BOUND_PADDING,
    minY: centerY - rotatedHeight / 2 - BOUND_PADDING,
    maxY: centerY + rotatedHeight / 2 + BOUND_PADDING,
  };
};

const intersects = (a: Placement, b: Placement) => {
  // 简单的轴对齐包围盒碰撞检测
  return !(
    a.bounds.maxX < b.bounds.minX ||
    a.bounds.minX > b.bounds.maxX ||
    a.bounds.maxY < b.bounds.minY ||
    a.bounds.minY > b.bounds.maxY
  );
};

const WordCloud = ({ words }: WordCloudProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height }); // 实时记录容器尺寸，驱动布局
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' } // 渐显动画
    );
  }, [words]);

  const placements = useMemo(() => {
    if (!words.length || size.width === 0 || size.height === 0) return [];
    const sorted = [...words].sort((a, b) => b.value - a.value); // 权重从大到小排，先放大的
    const min = Math.min(...sorted.map((w) => w.value));
    const max = Math.max(...sorted.map((w) => w.value));
    const placed: Placement[] = [];
    const isCompact = size.width < 640; // 小屏降低字号
    const minFont = isCompact ? 14 : 20;
    const maxFont = isCompact ? 36 : 60;
    const centerX = size.width / 2;
    const centerY = isCompact ? size.height * 0.5 : size.height * 0.38; // 稍偏上让词云更稳
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    sorted.forEach((word, index) => {
      const fontSize = mapFontSize(word.value, min, max, minFont, maxFont);
      ctx.font = `600 ${fontSize}px 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif`;
      const metrics = ctx.measureText(word.text); // canvas 测量文本宽高
      const textWidth = metrics.width;
      const textHeight =
        fontSize *
        (metrics.actualBoundingBoxAscent
          ? (metrics.actualBoundingBoxAscent +
              metrics.actualBoundingBoxDescent) /
            fontSize
          : 1);
      const isVertical = index % 2 === 1; // 交替竖排/横排
      const rotate = isVertical ? -90 : 0;
      let angle = Math.random() * Math.PI * 2; // 从随机角度开始
      let radius = 0; // 从中心向外螺旋
      let attempts = 0;
      let placedWord: Placement | null = null;

      while (attempts < MAX_ATTEMPTS && !placedWord) {
        const x = centerX + radius * Math.cos(angle) - textWidth / 2;
        const y = centerY + radius * Math.sin(angle) - textHeight / 2;
        const bounds = getRotatedBounds(x, y, textWidth, textHeight, rotate);
        const candidate: Placement = {
          ...word,
          fontSize,
          x,
          y,
          rotate,
          width: textWidth,
          height: textHeight,
          bounds,
        };
        const fitsInside =
          bounds.minX >= 0 &&
          bounds.minY >= 0 &&
          bounds.maxX <= size.width &&
          bounds.maxY <= size.height;

        if (
          fitsInside &&
          !placed.some((existing) => intersects(existing, candidate))
        ) {
          placedWord = candidate;
          placed.push(candidate);
          break;
        }
        angle += ANGLE_STEP; // 继续沿螺旋前进
        radius += RADIUS_STEP * ANGLE_STEP;
        attempts += 1;
      }
    });

    return placed;
  }, [words, size.height, size.width]);

  return (
    <div ref={containerRef} className='keyword-cloud'>
      {placements.length === 0 && (
        <p className='text-sm text-neutral-500'>暂无关键词</p>
      )}
      {placements.map(({ text, fontSize, x, y, rotate, color }) => (
        <span
          key={`${text}-${x}-${y}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
            transformOrigin: 'center',
            fontSize,
            color,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
};

export default WordCloud;
```

</details>
第一次写这种讲解代码思路的文档，如有错误或表述不恰当的地方请务必指正，感谢
