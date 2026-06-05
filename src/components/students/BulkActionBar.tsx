import { DeleteIcon, Trash, Trash2 } from "lucide-react"

type Props = {
  count: number
  onClear: () => void
  onDelete: () => void
}

export function BulkActionBar({ count, onClear, onDelete }: Props) {
  if (!count) return null

  return (
    <div className="sticky top-0 bg-white border rounded-md px-4 py-2 flex justify-between">
      <span>{count} selected</span>

      <div className="flex gap-5">
        <button onClick={onClear}>Clear</button>
        <button onClick={onDelete} className="flex gap-1 text-red-600">
          <Trash2 className="h-4 w-4 self-center"/>
          <span className="self-center">Delete</span>
        </button>
      </div>
    </div>
  )
}