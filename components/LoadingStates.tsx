import React from 'react'

type InlineSpinnerProps = {
  className?: string
}

export function InlineSpinner({ className = '' }: InlineSpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`.trim()}
    />
  )
}

type SectionSkeletonProps = {
  lines?: number
  className?: string
}

export function SectionSkeleton({ lines = 3, className = '' }: SectionSkeletonProps) {
  return (
    <div className={`rounded-3xl border border-stone-200 bg-white p-6 shadow-sm ${className}`.trim()}>
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-40 rounded bg-stone-200" />
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-4 rounded bg-stone-100" />
        ))}
      </div>
    </div>
  )
}

type ProductGridSkeletonProps = {
  count?: number
}

export function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-card border border-maroon/10 bg-white p-4 shadow-sm">
          <div className="animate-pulse space-y-3">
            <div className="aspect-[3/4] w-full rounded-card bg-stone-200" />
            <div className="h-3 w-20 rounded bg-stone-100" />
            <div className="h-4 w-4/5 rounded bg-stone-200" />
            <div className="h-4 w-1/3 rounded bg-stone-100" />
            <div className="h-9 w-full rounded-card bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
