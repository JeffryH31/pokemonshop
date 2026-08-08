import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none'

    const variants = {
      primary:
        'bg-[#e5b13a] text-[#0a0a0f] hover:bg-[#f0c547] active:scale-95 shadow-md shadow-[#e5b13a22] focus-visible:outline-[#e5b13a]',
      secondary:
        'bg-[#1c1c28] text-[#f0ece4] hover:bg-[#2a2a38] border border-[#2a2a38] hover:border-[#e5b13a44] active:scale-95',
      ghost:
        'bg-transparent text-[#c2bcb0] hover:text-[#f0ece4] hover:bg-[#1c1c28] active:scale-95',
      danger:
        'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 active:scale-95',
      outline:
        'bg-transparent text-[#e5b13a] border border-[#e5b13a] hover:bg-[#e5b13a] hover:text-[#0a0a0f] active:scale-95',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
