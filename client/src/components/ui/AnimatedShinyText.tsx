import { CSSProperties, FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface AnimatedShinyTextProps {
  children: ReactNode
  className?: string
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <p
      style={
        {
          '--shimmer-width': `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        'mx-auto text-neutral-600/70 dark:text-secondary/70 text-center',

        // Shine effect
        'animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',

        // Shine gradient
        'bg-gradient-to-r from-transparent via-background/80 via-50% to-transparent  dark:via-white/80',

        className
      )}
    >
      {children}
    </p>
  )
}
