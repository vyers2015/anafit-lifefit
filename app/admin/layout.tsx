'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdminSidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login')
      } else {
        setChecking(false)
      }
    })
  }, [pathname, router, isLoginPage])

  // Login page: full screen, no sidebar
  if (isLoginPage) {
    return (
      <div className="fixed inset-0 z-[200] bg-warm-50 overflow-auto">
        {children}
      </div>
    )
  }

  if (checking) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#1E1008] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Verificando acesso...
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-[#F7F3F0]">
        {children}
      </main>
    </div>
  )
}
