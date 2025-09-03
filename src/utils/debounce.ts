type DebounceOptions = {
  leading?: boolean
  maxWait?: number
  trailing?: boolean
}

function nativeMax(a: number, b: number): number {
  return Math.max(a, b)
}

function nativeMin(a: number, b: number): number {
  return Math.min(a, b)
}

function now(): number {
  return Date.now()
}

// biome-ignore lint/suspicious/noExplicitAny: any is needed
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 0,
  options?: DebounceOptions
) {
  let lastArgs: Parameters<T> | undefined
  let lastThis: unknown
  let maxWait = 0
  let result: ReturnType<T> | undefined
  let timerId: number | undefined
  let lastCallTime: number | undefined
  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  if (typeof func !== "function") {
    throw new TypeError("func must be a Function Object")
  }

  if (options !== undefined) {
    leading = !!options.leading
    maxing = options.maxWait !== undefined
    const maxWaitOption = options.maxWait !== undefined ? options.maxWait : Number.NaN
    maxWait = maxing === true ? nativeMax(maxWaitOption || 0, wait) : maxWait
    trailing = "trailing" in options ? !!options.trailing : trailing
  }

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs
    const thisArg = lastThis

    if (!args) {
      return result
    }

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args) as ReturnType<T>
    return result
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait)
    // Invoke the leading edge.
    return leading === true ? invokeFunc(time) : result
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0)
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing === true ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0)
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing === true && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired(): void {
    const time = now()
    if (shouldInvoke(time)) {
      trailingEdge(time)
      return
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing === true && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush(): ReturnType<T> | undefined {
    return timerId === undefined ? result : trailingEdge(now())
  }

  function debounced(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing === true) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  return debounced
}
