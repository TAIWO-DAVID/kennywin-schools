"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onClose: () => void
  form: {
    level: string
    grade: string
    stream: string
  }
  setForm: (form: any) => void
  onSubmit: () => void
  loading?: boolean
}

export default function CreateClassModal({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* LEVEL */}
          <div>
            <Label className="mb-1">Level</Label>
            <Select
              value={form.level}
              onValueChange={(value) =>
                setForm({ ...form, level: value })
              }
            >
              <SelectTrigger>
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

          {/* GRADE */}
          {form.level !== "Creche" && (
            <div>
              <Label className="mb-1">Grade</Label>
              <Input
                type="number"
                value={form.grade}
                placeholder="e.g. 1"
                onChange={(e) =>
                  setForm({ ...form, grade: e.target.value })
                }
              />
            </div>
          )}

          {/* STREAM */}
          <div>
            <Label className="mb-1">Stream (optional)</Label>
            <Input
              value={form.stream}
              placeholder="e.g. A"
              onChange={(e) =>
                setForm({
                  ...form,
                  stream: e.target.value.toUpperCase(),
                })
              }
            />
          </div>

          {/* PREVIEW */}
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Preview</p>
            <p className="text-lg font-semibold">
              {form.level}
              {form.level !== "Creche" && form.grade && ` ${form.grade}`}
              {form.stream && ` ${form.stream}`}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={onSubmit}
            disabled={
              !form.level ||
              (form.level !== "Creche" && !form.grade) ||
              loading
            }
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}