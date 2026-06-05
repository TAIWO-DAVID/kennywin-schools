"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase/supabaseClient"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, Trash2, Upload, CheckCircle, ArrowRight, X } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const MAX_FILE_SIZE = 5 * 1024 * 1024

type Institution = {
  institution_name: string
  year_graduated: string
  qualification: string
}

type Teacher = {
  first_name: string
  last_name: string
  date_of_birth?: string
  gender?: string
  marital_status?: string
  profile_img?: string
  phone_number?: string
  alternative_phone_number?: string
  home_address?: string
  nin?: string
  institutions_attended?: Institution[]
}

type TeacherFormProps = {
  teacher: Teacher
  onProfileImgChange?: (url: string) => void
}

type FormState = {
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  marital_status: string
  profile_img: string
  phone_number: string
  alternative_phone_number: string
  home_address: string
  nin: string
  institutions_attended: Institution[]
}

export default function TeacherForm({ teacher, onProfileImgChange }: TeacherFormProps) {
  const { session } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)

  const [form, setForm] = useState<FormState>({
    first_name: teacher.first_name || "",
    last_name: teacher.last_name || "",
    date_of_birth: teacher.date_of_birth || "",
    gender: teacher.gender || "",
    marital_status: teacher.marital_status || "",
    profile_img: teacher.profile_img || "",
    phone_number: teacher.phone_number || "",
    alternative_phone_number: teacher.alternative_phone_number || "",
    home_address: teacher.home_address || "",
    nin: teacher.nin || "",
    institutions_attended: teacher.institutions_attended?.length
      ? teacher.institutions_attended
      : [{ institution_name: "", year_graduated: "", qualification: "" }],
  })

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!session?.user?.id) return

      const { data, error } = await supabase
        .from("teachers")
        .select("first_name, last_name")
        .eq("teacher_id", session.user.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching teacher info:", error.message)
        return
      }

      if (data) {
        setForm((prev) => ({
          ...prev,
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
        }))
      }
    }

    fetchTeacher()
  }, [session?.user?.id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      const updated = { ...prev }
      delete updated[name]
      return updated
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      const updated = { ...prev }
      delete updated[name]
      return updated
    })
  }

  const handleInstitutionChange = (
    index: number,
    field: keyof Institution,
    value: string
  ) => {
    const newInstitutions = [...form.institutions_attended]
    newInstitutions[index][field] = value
    setForm((prev) => ({ ...prev, institutions_attended: newInstitutions }))

    const errorKey =
      field === "institution_name"
        ? `institution_name_${index}`
        : field === "year_graduated"
          ? `year_${index}`
          : `qualification_${index}`

    setErrors((prev) => {
      const updated = { ...prev }
      delete updated[errorKey]
      return updated
    })
  }

  const addInstitution = () => {
    setForm((prev) => ({
      ...prev,
      institutions_attended: [
        ...prev.institutions_attended,
        { institution_name: "", year_graduated: "", qualification: "" },
      ],
    }))
  }

  const removeInstitution = (index: number) => {
    setForm((prev) => ({
      ...prev,
      institutions_attended: prev.institutions_attended.filter((_, i) => i !== index),
    }))
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File must be less than 5MB")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setUploadingImage(true)

    try {
      const filename = `teachers/profile-${Date.now()}-${file.name}`

      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(filename, file, { cacheControl: "3600", upsert: true })

      if (error) throw error
      if (!data?.path) throw new Error("Upload returned no path")

      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(data.path)

      if (!urlData?.publicUrl) throw new Error("Could not get public URL")

      setForm((prev) => ({ ...prev, profile_img: urlData.publicUrl }))
      onProfileImgChange?.(urlData.publicUrl)
      toast.success("Image uploaded successfully!")
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      await handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await handleFileUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    setForm((prev) => ({ ...prev, profile_img: "" }))
    onProfileImgChange?.("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return false
    return /^(?:\+234|234|0)[789][01]\d{8}$/.test(phone)
  }

  const formatPhone = (phone: string): string => {
    if (phone.startsWith("0")) return "+234" + phone.slice(1)
    if (phone.startsWith("234")) return "+" + phone
    return phone
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!form.date_of_birth) newErrors.date_of_birth = "Date of birth is required"
      if (!form.gender) newErrors.gender = "Gender is required"
      if (!form.marital_status) newErrors.marital_status = "Marital status is required"
    }

    if (step === 2) {
      if (!form.phone_number.trim()) {
        newErrors.phone_number = "Phone number is required"
      } else if (!validatePhone(form.phone_number)) {
        newErrors.phone_number = "Enter a valid Nigerian phone number"
      }

      if (form.alternative_phone_number && !validatePhone(form.alternative_phone_number)) {
        newErrors.alternative_phone_number = "Invalid phone number"
      }

      if (!form.home_address.trim()) newErrors.home_address = "Home address is required"

      if (!form.nin.trim()) {
        newErrors.nin = "NIN is required"
      } else if (!/^\d{11}$/.test(form.nin)) {
        newErrors.nin = "NIN must be exactly 11 digits"
      }
    }

    if (step === 3) {
      form.institutions_attended.forEach((inst, index) => {
        if (!inst.institution_name.trim()) newErrors[`institution_name_${index}`] = "Required"
        if (!inst.year_graduated.trim()) newErrors[`year_${index}`] = "Required"
        if (!inst.qualification.trim()) newErrors[`qualification_${index}`] = "Required"
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1)
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep() || !session?.user) return

    setLoading(true)

    try {
      const { data: existingTeacher, error: checkError } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("nin", form.nin)
        .neq("teacher_id", session.user.id)
        .maybeSingle()

      if (checkError) {
        toast.error("Error checking NIN: " + checkError.message)
        return
      }

      if (existingTeacher) {
        toast.error("This NIN already belongs to another teacher.")
        return
      }

      const formattedForm = {
        ...form,
        phone_number: formatPhone(form.phone_number),
        alternative_phone_number: form.alternative_phone_number
          ? formatPhone(form.alternative_phone_number)
          : "",
      }

      const { error: updateError } = await supabase
        .from("teachers")
        .update({
          ...formattedForm,
          profile_completed: true,
          status: "active",
        })
        .eq("teacher_id", session.user.id)

      if (updateError) {
        toast.error("Error: " + updateError.message)
        return
      }

      const { data: updatedTeacher, error: fetchError } = await supabase
        .from("teachers")
        .select("profile_completed")
        .eq("teacher_id", session.user.id)
        .maybeSingle()

      if (fetchError || !updatedTeacher) {
        toast.error("Error fetching updated profile")
        return
      }

      if (updatedTeacher.profile_completed) {
        toast.success("Profile completed! Redirecting to dashboard...")
        router.replace("/teacher/dashboard")
      } else {
        toast.error("Profile not fully completed, please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  const stepTitles = ["Personal Information", "Contact & Identity", "Educational Background"]
  const stepDescriptions = [
    "Tell us about yourself",
    "Where we can reach you",
    "Your professional qualifications",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Step {step} of 3 - {stepDescriptions[step - 1]}
          </p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 relative">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  step >= s ? "bg-primary" : "bg-border"
                }`}
              />
              {step > s && (
                <CheckCircle className="absolute -top-2 -right-1 w-5 h-5 text-primary fill-primary" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-semibold text-foreground">{stepTitles[0]}</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={form.first_name}
                    disabled
                    className="mt-2 h-11 bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={form.last_name}
                    disabled
                    className="mt-2 h-11 bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className={`mt-2 h-11 ${errors.date_of_birth ? "border-destructive" : ""}`}
                />
                {errors.date_of_birth && (
                  <p className="text-destructive text-sm mt-2">{errors.date_of_birth}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
                    <SelectTrigger className={`mt-2 h-11 w-full ${errors.gender ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-destructive text-sm mt-2">{errors.gender}</p>}
                </div>

                <div>
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select
                    value={form.marital_status}
                    onValueChange={(v) => handleSelectChange("marital_status", v)}
                  >
                    <SelectTrigger className={`mt-2 h-11 w-full ${errors.marital_status ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.marital_status && (
                    <p className="text-destructive text-sm mt-2">{errors.marital_status}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-semibold text-foreground">{stepTitles[1]}</h2>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="090..., 234..., or +234..."
                  value={form.phone_number}
                  onChange={handleChange}
                  className={`mt-2 h-11 ${errors.phone_number ? "border-destructive" : ""}`}
                />
                {errors.phone_number && (
                  <p className="text-destructive text-sm mt-2">{errors.phone_number}</p>
                )}
              </div>

              <div>
                <Label htmlFor="alternative_phone_number">Alternative Phone Number (Optional)</Label>
                <Input
                  id="alternative_phone_number"
                  name="alternative_phone_number"
                  placeholder="090..., 234..., or +234..."
                  value={form.alternative_phone_number}
                  onChange={handleChange}
                  className={`mt-2 h-11 ${errors.alternative_phone_number ? "border-destructive" : ""}`}
                />
                {errors.alternative_phone_number && (
                  <p className="text-destructive text-sm mt-2">{errors.alternative_phone_number}</p>
                )}
              </div>

              <div>
                <Label>Profile Picture</Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer relative ${
                    dragActive
                      ? "border-primary bg-primary/5 scale-105"
                      : form.profile_img
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary hover:bg-accent"
                  } ${uploadingImage ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploadingImage}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
                      <p className="text-sm font-medium text-foreground">Uploading...</p>
                      <p className="text-xs text-muted-foreground">Please wait while we upload your image</p>
                    </div>
                  ) : form.profile_img ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <img
                          src={form.profile_img}
                          alt="Profile"
                          className="w-24 h-24 rounded-lg object-cover border-4 border-primary shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <CheckCircle size={20} />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-primary">Image uploaded</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to change or drag new image
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage()
                        }}
                        className="text-xs text-destructive hover:bg-destructive/10 px-3 py-1 rounded transition-colors flex items-center gap-1"
                      >
                        <X size={14} /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          {dragActive ? "Drop your image here" : "Drag image here or click to select"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF or WebP - Max 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="home_address">Home Address</Label>
                <Textarea
                  id="home_address"
                  name="home_address"
                  placeholder="Enter your residential address"
                  value={form.home_address}
                  onChange={handleChange}
                  className={`mt-2 min-h-24 ${errors.home_address ? "border-destructive" : ""}`}
                />
                {errors.home_address && (
                  <p className="text-destructive text-sm mt-2">{errors.home_address}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                <Input
                  id="nin"
                  name="nin"
                  placeholder="11-digit NIN"
                  value={form.nin}
                  onChange={handleChange}
                  className={`mt-2 h-11 ${errors.nin ? "border-destructive" : ""}`}
                />
                {errors.nin && <p className="text-destructive text-sm mt-2">{errors.nin}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-semibold text-foreground">{stepTitles[2]}</h2>

              {form.institutions_attended.map((inst, index) => (
                <div key={index} className="border border-border rounded-lg p-6 bg-accent relative">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeInstitution(index)}
                      className="absolute top-4 right-4 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`institution_name_${index}`}>Institution Name</Label>
                      <Input
                        id={`institution_name_${index}`}
                        placeholder="University or College name"
                        value={inst.institution_name}
                        onChange={(e) => handleInstitutionChange(index, "institution_name", e.target.value)}
                        className={`mt-2 h-11 ${errors[`institution_name_${index}`] ? "border-destructive" : ""}`}
                      />
                      {errors[`institution_name_${index}`] && (
                        <p className="text-destructive text-sm mt-2">{errors[`institution_name_${index}`]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`year_graduated_${index}`}>Year Graduated</Label>
                        <Input
                          id={`year_graduated_${index}`}
                          type="number"
                          placeholder="2020"
                          value={inst.year_graduated}
                          onChange={(e) => handleInstitutionChange(index, "year_graduated", e.target.value)}
                          className={`mt-2 h-11 ${errors[`year_${index}`] ? "border-destructive" : ""}`}
                        />
                        {errors[`year_${index}`] && (
                          <p className="text-destructive text-sm mt-2">{errors[`year_${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`qualification_${index}`}>Qualification</Label>
                        <Input
                          id={`qualification_${index}`}
                          placeholder="B.S., M.A., etc."
                          value={inst.qualification}
                          onChange={(e) => handleInstitutionChange(index, "qualification", e.target.value)}
                          className={`mt-2 h-11 ${errors[`qualification_${index}`] ? "border-destructive" : ""}`}
                        />
                        {errors[`qualification_${index}`] && (
                          <p className="text-destructive text-sm mt-2">{errors[`qualification_${index}`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addInstitution}
                className="w-full h-11 text-primary border-primary hover:bg-primary/5"
              >
                <PlusCircle size={18} className="mr-2" /> Add Another Institution
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-between">
          <Button onClick={prevStep} variant="outline" disabled={step === 1 || loading} className="px-8 h-11">
            Back
          </Button>

          {step < 3 ? (
            <Button onClick={nextStep} disabled={loading} className="px-8 h-11 gap-2">
              Next <ArrowRight size={18} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="px-8 h-11">
              {loading ? "Completing..." : "Complete Profile"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
