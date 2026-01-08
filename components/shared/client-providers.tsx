'use client'

import React from 'react'
import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs'

import { Toaster } from 'sonner'

export default function ClientProviders({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <KindeProvider>
            {children}
            <Toaster position="top-center" richColors />
        </KindeProvider>
    )
}
