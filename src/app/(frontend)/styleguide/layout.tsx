import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <main className="min-h-screen w-full container mx-auto py-16">{children}</main>
}

export default Layout
