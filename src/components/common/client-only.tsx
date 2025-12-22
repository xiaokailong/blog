'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

export function ClientOnly({ fallback = null, children }: any) {
  const isServer = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true
  )

  return isServer ? <>{fallback}</> : <>{children}</>
}
