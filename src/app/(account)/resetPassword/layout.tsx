import type { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'Reset your password'
}


export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
