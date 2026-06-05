"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"

interface AddSubjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (
    payload: {
      name: string
      code: string
      is_active: boolean
    }
  ) => Promise<void>
}

export function AddSubjectModal({
  open,
  onClose,
  onSubmit,
}: AddSubjectModalProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Subject
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1">Name</Label>
            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-1">Code</Label>
            <Input
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={async () => {
              await onSubmit({
                name,
                code,
                is_active: true,
              })

              setName("")
              setCode("")
            }}
          >
            Create Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}