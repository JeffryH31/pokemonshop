import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useUpdateProfile } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore()
  const { mutate: update, isPending } = useUpdateProfile()

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    password_confirmation: '',
  })

  if (!isAuthenticated) return <Navigate to="/login" />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Record<string, string> = {}
    if (form.name !== user?.name) payload.name = form.name
    if (form.email !== user?.email) payload.email = form.email
    if (form.password) {
      payload.password = form.password
      payload.password_confirmation = form.password_confirmation
    }
    if (Object.keys(payload).length > 0) update(payload)
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#e5b13a22] border border-[#e5b13a44] flex items-center justify-center">
            <span className="text-[#e5b13a] text-xl font-bold font-display">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-[#f0ece4]">{user?.name}</h1>
            <p className="text-sm text-[#5a5550]">{user?.email}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-[#a09a8e] uppercase tracking-wide mb-2">Edit Profile</h2>

          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            icon={<User size={14} />}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            icon={<Mail size={14} />}
          />

          <div className="border-t border-[#2a2a38] pt-4">
            <p className="text-xs text-[#5a5550] mb-3">Leave blank to keep current password</p>
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              icon={<Lock size={14} />}
            />
            <div className="mt-3">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat new password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                icon={<Lock size={14} />}
              />
            </div>
          </div>

          <Button type="submit" loading={isPending} className="w-full">
            Save Changes
          </Button>
        </form>

        {/* Role badge */}
        {user?.role === 'admin' && (
          <div className="mt-4 bg-[#e5b13a11] border border-[#e5b13a33] rounded-xl p-4 text-center">
            <p className="text-sm text-[#e5b13a] font-semibold">Administrator Account</p>
            <p className="text-xs text-[#5a5550] mt-1">You have access to the admin panel</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
