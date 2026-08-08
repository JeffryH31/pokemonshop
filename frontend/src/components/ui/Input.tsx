import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#c2bcb0]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2bcb0]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border border-[#2a2a38] bg-[#16161f] px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#c2bcb0] transition-colors',
              'focus:outline-none focus:border-[#e5b13a] focus:ring-1 focus:ring-[#e5b13a33]',
              'hover:border-[#3a3a4a]',
              icon && 'pl-9',
              error && 'border-red-500/60 focus:border-red-500',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
export default Input

