"use client"

import { useState } from "react"
import { Search, Plus, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import LoadingSpinner from "@/components/LoadingSpinner"

interface Parent {
  id: number
  name: string
  email: string
  subject: string
  joinDate: string
}

const initialParents: Parent[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    subject: "Mathematics",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@school.edu",
    subject: "Physics",
    joinDate: "2022-08-20",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@school.edu",
    subject: "English Literature",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "David Thompson",
    email: "david.thompson@school.edu",
    subject: "History",
    joinDate: "2021-09-05",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@school.edu",
    subject: "Chemistry",
    joinDate: "2023-02-28",
  },
]

export default function ParentsComponent() {
  const [parents, setParents] = useState<Parent[]>(initialParents)
  const [searchTerm, setSearchTerm] = useState("")
  const [newParentEmail, setNewParentEmail] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loadingAddParent, setLoadingAddParent] = useState(false)

  // Filter parents based on search term
  const filteredParents = parents.filter(
    (parrent) =>
      parrent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parrent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parrent.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addParent = async () => {
    const res = await fetch('/api/create-user', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: newParentEmail, account_type: "parents"})
    })
    const data = await res.json()
    console.log(data)
      alert(data.message || data.error)
    return data
  }

  const handleAddParent = async () => {
    if (newParentEmail.trim()) {
      setLoadingAddParent(true)
      await addParent()

      setLoadingAddParent(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parents</h1>
          <p className="text-muted-foreground">Manage and view all parents</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Parent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Add New Parent
              </DialogTitle>
              <DialogDescription>
                Enter the email address of the new parrent to send them an invitation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="parrent@school.edu"
                    value={newParentEmail}
                    onChange={(e) => setNewParentEmail(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddParent()
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddParent} disabled={loadingAddParent}>
                {loadingAddParent ? (
                  <div className="flex items-center justify-center gap-4">
                      Loading... <LoadingSpinner />
                    </div>
                )
                 : "Add Parent"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search parents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Parents Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParents.length > 0 ? (
              filteredParents.map((parrent) => (
                <TableRow key={parrent.id}>
                  <TableCell className="font-medium">{parrent.name}</TableCell>
                  <TableCell className="text-muted-foreground">{parrent.email}</TableCell>
                  <TableCell>{parrent.subject}</TableCell>
                  <TableCell>{parrent.joinDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No parents found matching your search." : "No parents found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredParents.length} of {parents.length} parents
      </div>
    </div>
  )
}