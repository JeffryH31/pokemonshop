import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
  variant?: 'solid' | 'outline' | 'ghost'
}

export default function Badge({ children, color = '#c2bcb0', className, variant = 'ghost' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide',
        className,
      )}
      style={{
        color,
        backgroundColor: variant === 'ghost' ? `${color}22` : variant === 'solid' ? color : 'transparent',
        border: variant === 'outline' ? `1px solid ${color}66` : undefined,
      }}
    >
      {children}
    </span>
  )
}
