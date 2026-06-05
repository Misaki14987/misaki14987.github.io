const COLLAPSE_AFTER_LINES = 18;
const RESET_LABEL_MS = 1200;

const codeLanguage = (code: HTMLElement | null) =>
  Array.from(code?.classList || [])
    .find((name) => name.startsWith("language-"))
    ?.replace("language-", "") || "code";

export const initializeCodeBlocks = (
  article: HTMLElement,
  signal: AbortSignal
) => {
  article.querySelectorAll<HTMLElement>("pre").forEach((pre) => {
    if (pre.parentElement?.classList.contains("code-block")) return;

    const code = pre.querySelector<HTMLElement>("code");
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.before(wrapper);
    wrapper.append(pre);

    const toolbar = document.createElement("div");
    toolbar.className = "code-block__toolbar";

    const label = document.createElement("span");
    label.textContent = codeLanguage(code);

    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = "复制";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code?.textContent || "");
        copy.textContent = "已复制";
      } catch {
        copy.textContent = "复制失败";
      }

      window.setTimeout(() => {
        copy.textContent = "复制";
      }, RESET_LABEL_MS);
    }, { signal });

    toolbar.append(label, copy);
    wrapper.prepend(toolbar);

    const lineCount = code?.textContent?.split("\n").length || 0;
    if (lineCount <= COLLAPSE_AFTER_LINES) return;

    wrapper.classList.add("is-collapsed");
    const expand = document.createElement("button");
    expand.type = "button";
    expand.className = "code-block__expand";
    expand.textContent = "展开代码";
    expand.addEventListener("click", () => {
      const collapsed = wrapper.classList.toggle("is-collapsed");
      expand.textContent = collapsed ? "展开代码" : "收起代码";
    }, { signal });
    wrapper.append(expand);
  });
};
