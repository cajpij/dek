/** Odkaz na tutéž aplikaci v režimu plátna. */
export function displayUrl(): string {
  const { origin, pathname, search } = window.location
  return `${origin}${pathname}${search}#display`
}

/** Odkaz na kvíz pro účastníky — stejná adresa, jiný pohled. */
export function quizUrl(): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}#quiz`
}

/** Odkaz na knowledge base — rozcestník, ke kterému se tým vrací po workshopu. */
export function kbUrl(): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}#kb`
}

/** Odkaz na stránku o MCP serveru nad katalogem dek.cz. */
export function mcpUrl(): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}#mcp`
}

export function openDisplayWindow(): void {
  const win = window.open(displayUrl(), 'runsheet-display', 'width=1280,height=800')
  win?.focus()
}

export function toggleFullscreen(): void {
  if (document.fullscreenElement) {
    void document.exitFullscreen()
  } else {
    void document.documentElement.requestFullscreen().catch(() => undefined)
  }
}

/** Klávesové zkratky nesmí střílet, když uživatel píše do pole. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
}
