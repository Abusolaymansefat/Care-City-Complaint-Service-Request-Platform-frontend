import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const subscribe = (onStoreChange: () => void) => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mediaQuery.addEventListener("change", onStoreChange)
    return () => mediaQuery.removeEventListener("change", onStoreChange)
  }
  const getSnapshot = () =>
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
