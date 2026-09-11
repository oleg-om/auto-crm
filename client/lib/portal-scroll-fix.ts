// When a scrollable dropdown (Radix Select's viewport, or a cmdk Combobox list) is portaled while a
// Dialog has scroll-locked the page, react-remove-scroll (the lock Radix Dialog uses) installs its own
// wheel/touchmove listener on `document` that blocks scrolling anywhere it doesn't recognize as
// "inside" the Dialog - which includes these portals, since they're sibling portals under <body>, not
// DOM descendants of the Dialog's own content. A React onWheel/onTouchMove prop on the dropdown runs
// too late to help: React delegates those from the app's root container, a descendant of `document`,
// so react-remove-scroll's own document-level listener already ran (and can stop the event) before it
// gets there. Fixed by installing a single window-level CAPTURE-phase listener here, at module load -
// capture runs window -> document -> ..., so ours always fires before react-remove-scroll's (added
// later, on Dialog mount, on document) gets a look, letting us scroll the target ourselves and swallow
// the event before the lock ever sees it.
// See https://github.com/radix-ui/primitives/issues/1128

const findScrollTarget = (target: EventTarget | null): HTMLElement | null => {
  const el = target instanceof Element ? target : null
  return (
    el?.closest<HTMLElement>('[data-radix-select-viewport]') ??
    el?.closest<HTMLElement>('[cmdk-list]') ??
    null
  )
}

declare global {
  interface Window {
    portalScrollFixInstalled?: boolean
  }
}

const installPortalScrollFix = (): void => {
  if (typeof window === 'undefined' || window.portalScrollFixInstalled) return
  window.portalScrollFixInstalled = true
  let touchStartY: number | null = null

  window.addEventListener(
    'wheel',
    (event) => {
      const target = findScrollTarget(event.target)
      if (!target) return
      target.scrollBy({ top: event.deltaY })
      event.preventDefault()
      event.stopPropagation()
    },
    { capture: true, passive: false }
  )

  window.addEventListener(
    'touchstart',
    (event) => {
      const clientY = event.touches[0]?.clientY
      touchStartY = findScrollTarget(event.target) && clientY != null ? clientY : null
    },
    { capture: true, passive: true }
  )

  window.addEventListener(
    'touchmove',
    (event) => {
      const target = findScrollTarget(event.target)
      const currentY = event.touches[0]?.clientY
      if (!target || touchStartY == null || currentY == null) return
      target.scrollBy({ top: touchStartY - currentY })
      touchStartY = currentY
      event.preventDefault()
      event.stopPropagation()
    },
    { capture: true, passive: false }
  )
}

export default installPortalScrollFix
