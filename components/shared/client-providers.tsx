'use client'

import React from 'react'
import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs'

export default function ClientProviders({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <KindeProvider>
            {children}
        </KindeProvider>
    )
}
