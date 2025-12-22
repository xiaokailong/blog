'use client'

import { useInView } from 'react-intersection-observer'

export const ShowInView = ({ children, rootMargin = '0px', triggerOnce = true, ...rest }: any) => {
  const { ref, inView } = useInView({
    rootMargin,
    triggerOnce
  })

  return (
    <div ref={ref} data-role="intersection-observer" {...rest}>
      {inView && children}
    </div>
  )
}
