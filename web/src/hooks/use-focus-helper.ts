export function useFocusHelper(container: HTMLElement | null, dataAttr = 'data-focus-index') {
  return {
    getCurrentFocusIndex: () => {
      const focused = document.activeElement
      if (!focused) return
      const index = focused.getAttribute(dataAttr)
      if (!index) return
      return Number(index)
    },
    focusElementByIndex: (index: number) => {
      if (index < 0) return
      // @ts-expect-error
      container?.querySelector(`[${dataAttr}="${index}"]`)?.focus()
    },
  }
}
