'use client'

import React from "react"

export function ShinyText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className="absolute inset-0 opacity-0 animate-[shine_3s_ease-in-out_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
