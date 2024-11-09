import { MutableRefObject, useEffect, useLayoutEffect, useState } from "react"

export function useWindowResize() {
  const [_, setRefreshIndex] = useState(0)

  useLayoutEffect(() => {
    const listener = () => {
      setRefreshIndex((c) => c + 1)
    }
    window.addEventListener('resize', listener)
    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])
}

export function useResizeObserver(el?: HTMLElement | null) {
  const [size, setSize] = useState<{ width: number, height: number }>()
  useLayoutEffect(() => {
    if (!el) return

    const resizeObserver = new ResizeObserver(entry => {
      setSize({
        width: entry[0].contentRect.width,
        height: entry[0].contentRect.height
      })
    })
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect() // clean up 
  }, [el])

  return size
}