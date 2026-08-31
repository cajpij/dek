/** Odkaz na tutéž aplikaci v režimu plátna. */
export function displayUrl(): string {
  const { origin, pathname, search } = window.location
  return `${origin}${pathname}${search}#display`
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
