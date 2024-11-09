type Options = {
  duration: number,
  playSpeed?: number
}

export class CancelledAnimationGroupError extends Error {}

export interface AnimationGroupType {
  cancelAll: () => void,
  delay(ms: number, options?: { playSpeed?: number }): Promise<void>,
  animate(tickHandle: (elapsedMs: number, normalizedTime: number) => boolean | void, options: Options): Promise<void>
}

export const AnimationGroup = (): AnimationGroupType => {
  const _cancelCallbacks: (() => void)[] = []

  return {
    cancelAll() {
      _cancelCallbacks.forEach(cb => cb())
    },
    delay(ms, options) {
      return new Promise((res, rej) => {
        let cancelled = false
        _cancelCallbacks.push(() => {
          rej(new CancelledAnimationGroupError())
          cancelled = true
        })
        setTimeout(() => {
          if (!cancelled) res()
        }, ms / (options?.playSpeed ?? 1))
      })
    },
    animate(tickHandle, options) {
      return new Promise((res, rej) => {
        const startTime = Date.now()
        let cancelled = false
        _cancelCallbacks.push(() => {
          rej(new CancelledAnimationGroupError())
          cancelled = true
        })

        const tick = () => {
          if (cancelled) return

          const nowMs = Date.now()
          const elapsed = (nowMs - startTime) * (options?.playSpeed ?? 1)
          if (tickHandle(elapsed, elapsed / options.duration) === false || (elapsed > (options?.duration ?? Infinity))) {
            res()
          } else {
            requestAnimationFrame(tick)
          }
        }
        tick()
      })
    },
  }
}