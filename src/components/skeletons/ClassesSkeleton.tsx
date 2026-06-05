import { ClassCardSkeleton } from "./ClassCardSkeleton"

export function ClassesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Fake level header */}
      <div className="flex items-center gap-4">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ClassCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}