---
title: "从零写一个 GNOME Shell 扩展"
pubDate: 2026-06-02
author: "M1saK1"
category: "GNOME"
tags: ["GNOME"]
cover: "./msz.jpg"
---

第一次用 GNOME是在 Ubuntu 上。说实话我挺认这种 UI 思路的：极简、专注，要什么自己加。习惯了这套快捷键之后操作很顺。但Ubuntu是大便所以我扬掉了。但当时一直有个想法就是我想要桌面上常驻一块小面板，能看到今天的任务、能编辑、能加日程，最好还能同步 Google 日历。翻了半天 GNOME 扩展商店没有东西。后面又去试了 Conky（<https://github.com/brndnmtthws/conky>），但我完全不喜欢在终端里手搓配置文件那种感觉。我想要的是类似 Planify（<https://github.com/alainm23/planify>）那种带 GUI 的东西，但能浮在桌面上。

然后这事就一直搁着，直到今年在Fedora上，某天突然又想起来了。现在有各种AI工具写代码的摩擦比去年小太多了，于是花了大概一天把它搓了出来。

所以这篇文章就以这个 Task Dashboard 为例，介绍一下 GNOME Shell 扩展怎么写。(其实GJS一坨大便

## Gnome扩展是什么

GNOME Shell 扩展是一段运行在 GNOME Shell 进程里的 JavaScript 代码，通过 GJS 调用 GNOME 平台能力，使用 Shell 暴露的 UI 模块修改桌面行为。

跟普通应用相比，扩展有几个特点：

- 直接跑在 Shell 进程里，没有独立的进程边界
- UI 使用 St（GNOME Shell Toolkit），不是 GTK
- 改完代码需要重新加载 Shell 才能生效（至少要 disable/enable）
- 桌面用户能直接开关、配置

最简单的一个扩展只需要两个文件：`metadata.json` 和 `extension.js`。

## 最小示例

`metadata.json` 描述扩展自身信息：

```json
{
  "uuid": "yodel@misaki.local",
  "name": "I love hdu",
  "description": "Fuck hdu.",
  "shell-version": ["45", "46", "47"],
  "version": 1
}
```

`uuid` 决定了扩展安装到哪个目录，格式推荐 `扩展名@域名`：

```
~/.local/share/gnome-shell/extensions/hello@misaki.local
```

`shell-version` 声明兼容的 GNOME Shell 版本号。版本对不上时 GNOME 会拒绝加载扩展。

`extension.js` 是入口，导出一个继承自 `Extension` 的类：

```js
import { Extension } from "resource:///org/gnome/Shell/Extensions/js/extensions.js";
import { PanelMenu } from "resource:///org/gnome/shell/ui/panelMenu.js";
import St from "gi://St";

export default class HelloExtension extends Extension {
  enable() {
    this._indicator = new PanelMenu.Button(0.0, "Hello", false);
    this._indicator.add_child(new St.Label({ text: "Hi" }));
    Main.panel.addToStatusArea(this.uuid, this._indicator, 0, "right");
  }

  disable() {
    this._indicator?.destroy();
    this._indicator = null;
  }
}
```

这个例子会在顶栏右侧出现一个写着 "Hi" 的按钮。点开是空菜单。`Main` 是从 `main.js` 引入的全局对象。

## 生命周期

扩展的入口类实现两个方法：

- `enable()`：用户在 GNOME 扩展设置里开启扩展时调用
- `disable()`：关闭扩展时调用，必须清理 `enable()` 里创建的所有资源

`enable()` 里的典型工作：

1. 创建顶栏入口
2. 构建 UI Actor
3. 加载配置或数据
4. 注册 GObject 信号监听
5. 启动定时器
6. 监听文件变化

`disable()` 必须做反向操作：

1. 销毁 UI Actor
2. 移除 timeout
3. 断开 signal handler
4. 取消 file monitor
5. 解除事件订阅

**资源清理是 GNOME 扩展开发里最严肃的事**。扩展跑在 Shell 进程里，泄漏一个 signal handler、忘清一个 timeout，最终都会让整个桌面卡顿或崩溃。每次改完代码要 disable/enable 一次确认没有泄漏。(一坨石)

## 常用 UI 模块

GNOME Shell 的 UI 模块名都以 `St` 开头（GIR 命名空间 `gi://St`）

| 模块            | 作用          |
| --------------- | ------------- |
| `St.BoxLayout`  | 横向/纵向盒子 |
| `St.Label`      | 文本          |
| `St.Button`     | 按钮          |
| `St.Icon`       | 图标          |
| `St.Entry`      | 单行输入框    |
| `St.ScrollView` | 滚动容器      |
| `St.Clipboard`  | 剪贴板        |

需要复杂控件（文本编辑器、树形列表、富输入）时，Shell 侧做不了，要打开一个独立的 GTK 应用窗口。

样式通过 CSS 控制，扩展目录下放一个 `stylesheet.css`：

```css
.hello-label {
  font-weight: bold;
  padding: 0 8px;
}
```

在 `metadata.json` 里声明：

```json
{
  "uuid": "hello@misaki.local",
  "name": "Hello",
  "stylesheet": "stylesheet.css",
  "shell-version": ["45"],
  "version": 1
}
```

`enable()` 里给 Actor 设置 style class：

```js
this._label = new St.Label({ text: "Hi", style_class: "hello-label" });
```

## 顶栏入口

顶栏按钮的基类是 `PanelMenu.Button`，派生类实现 `_init()` 构造子项。常见模式是 Icon + Label 横向排列：

```js
import { PanelMenu } from "resource:///org/gnome/shell/ui/panelMenu.js";
import St from "gi://St";
import Clutter from "gi://Clutter";

class HelloIndicator extends PanelMenu.Button {
  _init() {
    super._init(0.0, "Hello Indicator", false);

    const box = new St.BoxLayout({ style_class: "panel-status-menu-box" });
    box.add_child(
      new St.Icon({
        icon_name: "face-smile-symbolic",
        style_class: "system-status-icon",
      }),
    );
    box.add_child(
      new St.Label({ text: "Hello", y_align: Clutter.ActorAlign.CENTER }),
    );
    this.add_child(box);
  }
}
```

挂到顶栏用 `Main.panel.addToStatusArea()`：

```js
Main.panel.addToStatusArea(this.uuid, this._indicator, 0, "right");
```

参数分别是：扩展 uuid、按钮实例、位置索引、分区名（`"left"` / `"center"` / `"right"`）。

## 菜单项

按钮点开后是菜单。`PanelMenu.Button` 内部维护一个 `Menu`，可以使用标准的 `MenuItem`：

```js
import * as Menu from "resource:///org/gnome/shell/ui/menu.js";

this.menu.addMenuItem(new Menu.MenuItem("刷新", null, () => this._refresh()));

this.menu.addMenuItem(new Menu.SeparatorMenuItem());

// Switch / Slider 也可以添加
this.menu.addMenuItem(new PopupMenu.PopupSwitchMenuItem("启用", true));
this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
```

菜单项需要响应点击就传一个回调，需要复杂内容就继承 `PopupBaseMenuItem` 自定义。

## 桌面层 UI

除了顶栏入口和菜单，扩展还可以在桌面上添加 Actor。常见做法是在 `enable()` 里构造一个 `St.Widget`，用 `Main.layoutManager.addChrome()` 加到桌面层：

```js
const widget = new St.Widget({
  name: "hello-overlay",
  layout_manager: new Clutter.BoxLayout(),
});

widget.set_position(50, 50);
widget.set_size(200, 100);

Main.layoutManager.addChrome(widget);
```

桌面层 Actor 的位置、内容需要自己管理——没有 GTK 那种布局系统，定位和尺寸都要手动算。

## 本地数据

扩展需要保存状态时，可以写到 `~/.config/<应用名>/` 下的 JSON 文件：

```js
const file = Gio.File.new_for_path(
  GLib.build_filenamev([GLib.get_user_config_dir(), "hello", "data.json"]),
);

const [contents] = await file.load_contents_async(null);
const data = JSON.parse(new TextDecoder().decode(contents));
```

写入：

```js
const bytes = new TextEncoder().encode(JSON.stringify(data, null, 2));
await file.replace_contents_bytes_async(
  new GLib.Bytes(bytes),
  null,
  false,
  Gio.FileCreateFlags.REPLACE_DESTINATION,
  null,
);
```

读取时需要兜底：文件不存在、JSON 损坏、字段缺失都要处理，否则用户遇到一次坏数据，Shell 就崩一次。

## 定时刷新

定时器用 `GLib.timeout_add()`：

```js
this._timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 15000, () => {
  this._refresh();
  return GLib.SOURCE_CONTINUE; // 返回 false 停止
});
```

`disable()` 里移除：

```js
if (this._timeoutId) {
  GLib.Source.remove(this._timeoutId);
  this._timeoutId = 0;
}
```

时间间隔不要太短。Shell 进程里跑密集的逻辑会让整个桌面卡顿，刷新频率通常 10-30 秒就够。

## 文件监听

如果需要响应外部文件变化，用 `Gio.File.monitor_file()`：

```js
this._monitor = file.monitor(Gio.FileMonitorFlags.NONE, null);
this._monitorId = this._monitor.connect("changed", () => {
  this._reloadData();
});
```

清理：

```js
this._monitor.disconnect(this._monitorId);
this._monitor.cancel();
```

文件变化事件可能连续触发（编辑器保存时通常触发多次），需要 debounce。

## 调试

GNOME 扩展的调试方式跟 Web 开发完全不同。反正让Agent做吧）

**查看日志**：

```bash
journalctl --user -f /usr/bin/gnome-shell
```

`log()` 和 `logError()` 的输出会出现在这里。

**重载扩展**：

```bash
gnome-extensions disable hello@misaki.local
gnome-extensions enable hello@misaki.local
```

**查看扩展状态**：

```bash
gnome-extensions info hello@misaki.local
```

**列出已安装扩展**：

```bash
gnome-extensions list --enabled
```

**Looking Glass**：按下 `Alt + F2` 输入 `lg` 回车，可以打开 GNOME 内部的 JavaScript 控制台和 inspector。能直接看 Main 的状态、执行 JS、临时调用扩展方法。调试 UI 问题时会用到。

修改 `extension.js` 后不会自动生效——`disable` 再 `enable` 是最低成本的迭代方式，复杂场景下需要重启 Shell（注销重新登录，或在 Wayland 下按 `Alt + F2` 输入 `r`）。

## 安装与分发

开发时直接放到扩展目录：

```
~/.local/share/gnome-shell/extensions/hello@misaki.local/
├── metadata.json
├── extension.js
├── stylesheet.css
└── prefs.js   (可选)
```

**`prefs.js`** 是扩展的配置窗口入口。如果写了它，GNOME 扩展设置里会出现"设置"按钮。

然后我还没分发,后面有空了再

https://github.com/Misaki14987/Task-Dashboard 项目地址
![Task Dashboard 效果演示](./image.png)

> 是谁在喜欢Gnome？哦是我（后面换笔记本还是用Hyprland吧
