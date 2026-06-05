// components/skeletons/ClassCardSkeleton.tsx

export function ClassCardSkeleton() {
  return (
    <div
      className="
        rounded-xl border border-slate-200/70 bg-white
        p-4 space-y-4
        animate-pulse
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 skeleton rounded" />
          <div className="h-3 w-20 skeleton rounded" />
        </div>

        <div className="h-8 w-8 skeleton rounded-md" />
      </div>

      {/* TEACHER BLOCK */}
      <div className="rounded-lg bg-slate-100 p-3 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-2 w-16 skeleton rounded" />
          <div className="h-3 w-24 skeleton rounded" />
        </div>

        <div className="h-2 w-2 bg-slate-300 rounded-full" />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <div className="h-9 flex-1 skeleton rounded-md" />
        <div className="h-9 w-9 skeleton rounded-md" />
      </div>
    </div>
  )
}