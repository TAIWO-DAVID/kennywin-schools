"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ClassFormData {
  level: string
  grade: string
  stream: string
}

interface Props {
  value: ClassFormData
  onChange: (val: ClassFormData) => void
  onSubmit: () => void
  submitText?: string
  loading?: boolean
}

export function ClassForm({
  value,
  onChange,
  onSubmit,
  submitText = "Save",
  loading = false,
}: Props) {
  const update = (field: keyof ClassFormData, val: string) => {
    onChange({ ...value, [field]: val })
  }

  return (
    <div className="space-y-4">
      {/* Level */}
      <div>
        <Label className="mb-1">Level</Label>
        <Select value={value.level} onValueChange={(v) => update("level", v)}>
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

      {/* Grade */}
      {value.level !== "Creche" && (
        <div>
          <Label className="mb-1">Grade</Label>
          <Input
            type="number"
            value={value.grade}
            onChange={(e) => update("grade", e.target.value)}
            placeholder="e.g 1"
          />
        </div>
      )}

      {/* Stream */}
      <div>
        <Label className="mb-1">Stream (optional)</Label>
        <Input
          value={value.stream}
          onChange={(e) =>
            update("stream", e.target.value.toUpperCase())
          }
          placeholder="A, B..."
        />
      </div>

      {/* Preview */}
      <div className="rounded-md bg-muted p-3">
        <p className="text-xs text-muted-foreground">Preview</p>
        <p className="text-lg font-semibold">
          {value.level}
          {value.level !== "Creche" && value.grade && ` ${value.grade}`}
          {value.stream && ` ${value.stream}`}
        </p>
      </div>

      <Button
        onClick={onSubmit}
        disabled={
          !value.level ||
          (value.level !== "Creche" && !value.grade) ||
          loading
        }
      >
        {loading ? "Saving..." : submitText}
      </Button>
    </div>
  )
}