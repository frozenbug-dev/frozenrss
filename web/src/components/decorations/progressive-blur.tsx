import type {PropsWithChildren} from 'react'

type ProgressiveBlurProps = PropsWithChildren<{
  className?: string
  backgroundColor?: string
  position?: 'top' | 'bottom'
  height?: string
  blurAmount?: string
}>

export const ProgressiveBlur = ({
  className = '',
  backgroundColor = 'white',
  position = 'top',
  blurAmount = '4px',
  children,
}: ProgressiveBlurProps) => {
  const isTop = position === 'top'

  return (
    <div
      className={`pointer-events-none absolute left-0 w-full select-none ${className}`}
      style={{
        [isTop ? 'top' : 'bottom']: 0,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
          : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  )
}
