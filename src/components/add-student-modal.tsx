"use client"

import type React from "react"

import type { CreateStudentPayload } from "@/types/student"
// import type { ClassType } from "@/"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, User, GraduationCap, DollarSign } from "lucide-react"
import { findStudentsByName } from "@/lib/students"
import type { Student } from "@/types/student"
import { calculateAge } from "@/utils/date"
import supabase from "@/lib/supabase/supabaseClient"
import { getClassName, sortClasses } from "@/utils/school/classes/classes"
import { generateUniqueStudentId } from "@/utils/school/student"
import { createStudent } from "@/services/students/students.service"

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onStudentAdded: (student: Student) => void
}

export function AddStudentModal({ isOpen, onClose, onStudentAdded }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    gender: "",
    // email: "",
    dateOfBirth: "",
    age: "",
    class_id: "",
    educational_level: "",
    stream: "",
    status: "active",
    grade: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    parentAddress: "",
    address: "",
    // feesTotal: "",
    // feesPaid: "",
    // feesDueDate: "",
  })

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("id, level, grade, stream");

      if (error) {
        console.error(error);
        return;
      }

      setClassList(data || []);
    };

    fetchClasses();
  }, []);

  const [classList, setClassList] = useState<
    { id: number; level: string; grade: number; stream: string }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false)

  const classOptions = {
    "early-years": ["Creche", "KG1", "KG2", "Nursery 1", "Nursery 2"],
    "primary": ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"],
    "junior-secondary": ["JS1", "JS2", "JS3"],
    "senior-secondary": ["SS1", "SS2", "SS3"],
  }

  const streamOptions = ["science", "arts", "commercial"]

  const handleInputChange = (field: string, value: string) => {
    // Define fields that should always be numbers
    const numericFields = ["grade", "feesTotal", "feesPaid"];

    setFormData((prev) => ({
      ...prev,
      [field]: numericFields.includes(field)
        ? value === "" ? "" : Number(value) // convert to number (but allow empty string so input can clear)
        : value,
    }));

    // Auto-set educational level based on class
    if (field === "class_id") {
      const selectedClass = classList.find(
        (cls) => String(cls.id) === value
      );

      if (selectedClass) {
        setFormData((prev) => ({
          ...prev,
          educational_level: selectedClass.level,
          stream:
            selectedClass.level !== "senior-secondary"
              ? ""
              : selectedClass.stream || prev.stream,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const student = await createStudent(formData);

      onStudentAdded(student);

      alert(`Student ${student.first_name} added successfully`);

      onClose();

      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        dateOfBirth: "",
        gender: "",
        age: "",
        class_id: "",
        educational_level: "",
        stream: "",
        status: "active",
        grade: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        parentAddress: "",
        address: "",
      });

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent  aria-describedby={undefined} className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            Add New Student
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit } className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Student Information */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Student Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="first_name" className="text-sm">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="Enter student's first name"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-sm">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Enter student's last name"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="middle_name" className="text-sm">
                      Middle Name *
                    </Label>
                    <Input
                      id="middle_name"
                      value={formData.middle_name}
                      onChange={(e) => handleInputChange("middle_name", e.target.value)}
                      placeholder="Enter student's middle name"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-sm">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value as "male" | "female")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div>
                    <Label htmlFor="email" className="text-sm">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value as "male" | "female")}
                      placeholder="student@school.edu"
                      required
                      className="text-sm"
                    />
                  </div> */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth" className="text-sm">
                        Date of Birth *
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        placeholder="Date of Birth"
                        required
                        className="text-sm"
                      />
                    </div>
                    <div>
                    <Label htmlFor="address" className="text-sm">
                      Home Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter home address"
                      className="text-sm"
                    />
                  </div>
                    <div>
                      <Label htmlFor="grade" className="text-sm">
                        Current Grade (%) *
                      </Label>
                      <Input
                        id="grade"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.grade}
                        onChange={(e) => handleInputChange("grade", e.target.value)}
                        placeholder="85"
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="class_id" className="text-sm">
                      Class *
                    </Label>
                    <Select
                      value={formData.class_id ? String(formData.class_id) : ""}
                      onValueChange={(value) => handleInputChange("class_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortClasses(classList).map((cls) => (
                          <SelectItem key={cls.id} value={String(cls.id)}>
                            {getClassName(cls)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.educational_level === "senior-secondary" && (
                    <div>
                      <Label htmlFor="stream" className="text-sm">
                        Stream *
                      </Label>
                      <Select value={formData.stream} onValueChange={(value) => handleInputChange("stream", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                          {streamOptions.map((stream) => (
                            <SelectItem key={stream} value={stream}>
                              {stream.charAt(0).toUpperCase() + stream.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="status" className="text-sm">
                      Status
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parent/Guardian Information */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Parent/Guardian Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="parentName" className="text-sm">
                      Parent/Guardian Name *
                    </Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => handleInputChange("parentName", e.target.value)}
                      placeholder="Enter parent's full name"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentPhone" className="text-sm">
                      Phone Number *
                    </Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                      placeholder="+234 xxx xxx xxxx"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentEmail" className="text-sm">
                      Email Address
                    </Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                      placeholder="parent@email.com"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parent_address" className="text-sm">
                      Home Address
                    </Label>
                    <Input
                      id="parent_address"
                      value={formData.parentAddress}
                      onChange={(e) => handleInputChange("parentAddress", e.target.value)}
                      placeholder="Enter home address"
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fees Information */}
          {/* <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Fees Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="feesTotal" className="text-sm">
                    Total Fees (₦) *
                  </Label>
                  <Input
                    id="feesTotal"
                    type="number"
                    min="0"
                    value={formData.feesTotal}
                    onChange={(e) => handleInputChange("feesTotal", e.target.value)}
                    placeholder="150000"
                    required
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="feesPaid" className="text-sm">
                    Amount Paid (₦) *
                  </Label>
                  <Input
                    id="feesPaid"
                    type="number"
                    min="0"
                    value={formData.feesPaid}
                    onChange={(e) => handleInputChange("feesPaid", e.target.value)}
                    placeholder="75000"
                    required
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="feesDueDate" className="text-sm">
                    Due Date *
                  </Label>
                  <Input
                    id="feesDueDate"
                    type="date"
                    value={formData.feesDueDate}
                    onChange={(e) => handleInputChange("feesDueDate", e.target.value)}
                    required
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-sm">Balance (₦)</Label>
                <div className="h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                  <Badge
                    variant={
                      Number.parseInt(formData.feesTotal || "0") - Number.parseInt(formData.feesPaid || "0") > 0
                        ? "destructive"
                        : "default"
                    }
                    className={
                      Number.parseInt(formData.feesTotal || "0") - Number.parseInt(formData.feesPaid || "0") === 0
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    ₦
                    {(
                      Number.parseInt(formData.feesTotal || "0") - Number.parseInt(formData.feesPaid || "0")
                    ).toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {isSubmitting ? "Adding Student..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}