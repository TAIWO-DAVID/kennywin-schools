// components/modals/edit-class-modal.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type EditForm = {
  level: string
  grade: string
  stream: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: EditForm
  setForm: (form: EditForm) => void
  onSubmit: () => void
  loading?: boolean
}

export function EditClassModal({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold">
            Edit Class
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update class details and preview changes.
          </p>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-5 pt-2">
          {/* Level + Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Level</Label>
              <Select
                value={form.level}
                onValueChange={(value) =>
                  setForm({ ...form, level: value })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Creche">Creche</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="Nursery">Nursery</SelectItem>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="JSS">JSS</SelectItem>
                  <SelectItem value="SSS">SSS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Input
                type="number"
                value={form.grade}
                onChange={(e) =>
                  setForm({ ...form, grade: e.target.value })
                }
                className="h-10"
              />
            </div>
          </div>

          {/* Stream */}
          <div className="space-y-1.5">
            <Label>Stream</Label>
            <Input
              placeholder="e.g. A"
              value={form.stream}
              onChange={(e) =>
                setForm({
                  ...form,
                  stream: e.target.value.toUpperCase(),
                })
              }
              className="h-10"
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg border bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Preview
            </p>

            <p className="text-xl font-semibold text-slate-800">
              {form.level} {form.grade}
              {form.stream && ` ${form.stream}`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={onSubmit}
            disabled={!form.level || !form.grade || loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}