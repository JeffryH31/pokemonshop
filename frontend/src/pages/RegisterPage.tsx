import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User } from 'lucide-react'
import { useRegister } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email) newErrors.email = 'Email is required'
    if (!form.password || form.password.length < 8) newErrors.password = 'Min 8 characters'
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = 'Passwords do not match'
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)
    setErrors({})
    register(form)
  }

  const field = (key: keyof typeof form, value: string) =>
    setForm({ ...form, [key]: value })

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#e5b13a] opacity-[0.03] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#e5b13a] flex items-center justify-center mb-3 shadow-lg shadow-[#e5b13a22]">
            <span className="text-[#0a0a0f] font-bold text-xl font-display">P</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Create account</h1>
          <p className="text-sm text-[#5a5550] mt-1">Join PokéShop and start collecting</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#16161f] border border-[#2a2a38] rounded-2xl p-6 space-y-4"
        >
          <Input
            label="Full Name"
            type="text"
            placeholder="Ash Ketchum"
            value={form.name}
            onChange={(e) => field('name', e.target.value)}
            error={errors.name}
            icon={<User size={14} />}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => field('email', e.target.value)}
            error={errors.email}
            icon={<Mail size={14} />}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => field('password', e.target.value)}
            error={errors.password}
            icon={<Lock size={14} />}
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={form.password_confirmation}
            onChange={(e) => field('password_confirmation', e.target.value)}
            error={errors.password_confirmation}
            icon={<Lock size={14} />}
            autoComplete="new-password"
          />

          <Button type="submit" loading={isPending} className="w-full" size="lg">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-[#5a5550] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-[#e5b13a] hover:text-[#f0c547] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
