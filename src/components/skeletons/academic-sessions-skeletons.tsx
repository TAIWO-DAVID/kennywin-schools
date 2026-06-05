import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AcademicSessionsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" /> {/* Title */}
        <Skeleton className="h-10 w-32 rounded-md" /> {/* Button */}
      </div>

      {/* Sessions list */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>

        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border p-3 rounded-md"
            >
              {/* Left */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Right button */}
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}