
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CountUp } from "@/components/CountUp";
import {
  User,
  GraduationCap,
  MapPin,
  FileText,
  CheckCircle,
  Upload,
  CreditCard,
  Mail,
  Phone,
  MessageCircle,
  AlertCircle,
  BookOpen,
  Camera,
  FileCheck,
  UserCheck,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Download,
  Eye,
  X,
  Check,
  Users,
  Award,
  Globe,
} from "lucide-react"

interface FormErrors {
  [key: string]: string
}

export default function EnrollPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({})


  // useEffect(() => {
  //   AOS.init({
  //     duration: 1000, // animation duration in ms
  //     // once: true,     // whether animation should happen only once
  //   });
  // }, []);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Nigerian",

    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Academic Information
    previousSchool: "",
    gradeLevel: "",
    program: "",
    startDate: "",

    // Guardian Information
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: "",

    // Additional Information
    medicalConditions: "",
    specialNeeds: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Documents
    birthCertificate: null,
    transcripts: null,
    passportPhoto: null,

    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
  })

  const totalSteps = 6
  const formSteps = 4

  // Update progress based on current step
  useEffect(() => {
    if (currentStep > 0 && currentStep <= formSteps) {
      setProgress((currentStep / formSteps) * 100)
    }
  }, [currentStep])

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.gender) newErrors.gender = "Gender is required"
        break
      case 2:
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        if (!formData.address.trim()) newErrors.address = "Address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required"
        if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian phone is required"
        if (!formData.guardianRelation) newErrors.guardianRelation = "Guardian relationship is required"
        break
      case 3:
        if (!formData.gradeLevel) newErrors.gradeLevel = "Grade level is required"
        if (!formData.startDate) newErrors.startDate = "Start date is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: file }))
    handleInputChange(field, file)
  }

  const nextStep = () => {
    if (currentStep > 0 && currentStep <= formSteps) {
      if (!validateStep(currentStep)) {
        return
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(4)) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    nextStep() // Go to confirmation page
  }

  const startEnrollment = () => {
    setCurrentStep(1)
  }

  const FileUploadArea = ({
    field,
    label,
    accept = ".pdf,.jpg,.jpeg,.png",
    maxSize = "5MB",
    required = false,
  }: {
    field: string
    label: string
    accept?: string
    maxSize?: string
    required?: boolean
  }) => {
    const file = uploadedFiles[field]

    return (
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            file ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-yellow-400 hover:bg-yellow-50"
          }`}
        >
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <FileCheck className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-700">{file.name}</span>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileUpload(field, null)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">
                {accept.replace(/\./g, "").toUpperCase()} (Max {maxSize})
              </p>
              <input
                type="file"
                accept={accept}
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null
                  handleFileUpload(field, selectedFile)
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"></div> */}
        <div className="max-w-6xl mx-auto px-4 py-8 relative">
          <div className="text-center">
            <div className="shaky-btn inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Join Our Academic Excellence
            </div>
            <h1 className="animate-blob animation-finite animation-duration-2s text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Enroll Now
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Begin your journey with us. Follow the steps below to apply for admission into our school.
            </p>
          </div>

          {/* Enhanced Progress Bar */}
          {currentStep > 0 && currentStep <= formSteps && (
            <div className="mt-10">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep} of {formSteps}
                  </span>
                  <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                {[
                  { step: 1, title: "Personal Info", icon: User },
                  { step: 2, title: "Contact & Guardian", icon: MapPin },
                  { step: 3, title: "Academic & Documents", icon: GraduationCap },
                  { step: 4, title: "Review & Submit", icon: FileText },
                ].map(({ step, title, icon: Icon }) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                          step < currentStep
                            ? "bg-green-500 text-white border-green-500 shadow-lg"
                            : step === currentStep
                              ? "bg-yellow-500 text-white border-yellow-500 shadow-lg animate-pulse"
                              : "bg-white text-gray-400 border-gray-300"
                        }`}
                      >
                        {step < currentStep ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          step <= currentStep ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {title}
                      </span>
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-1 mx-4 transition-all duration-500 ${
                          step < currentStep ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Information Page */}
        {currentStep === 0 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Users, label: "Students Enrolled", value: <CountUp end={2500} suffix="" className="shaky-btn" /> },
                { icon: Award, label: "Years of Excellence", value: <CountUp end={25} suffix="+" className="shaky-btn"/>  },
                { icon: Globe, label: "Success Rate", value: <CountUp end={98} suffix="%" className="shaky-btn"/>  },
                { icon: Star, label: "Rating", value: "4.9/5" },
              ].map((stat, index) => (
                <Card key={index} className="text-center p-4 hover:shadow-lg transition-shadow">
                  <stat.icon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Enhanced Admission Requirements */}
            <Card className="border-0 py-0 shadow-xl overflow-hidden">
              <CardHeader className="p-5 bg-gradient-to-r from-gray-800 to-gray-900 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"></div>
                <CardTitle className="flex items-center gap-3 text-2xl relative">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  Admission Requirements
                </CardTitle>
                <CardDescription className="text-gray-200 text-lg">
                  Ensure you have all required documents before starting your application
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: FileText, text: "Completed Application Form", status: "Required" },
                    { icon: FileCheck, text: "Birth Certificate or Age Declaration", status: "Required" },
                    { icon: BookOpen, text: "Previous School Results / Transcripts", status: "Required" },
                    { icon: Camera, text: "Passport Photograph (recent)", status: "Required" },
                    { icon: GraduationCap, text: "Entrance Exam (if applicable)", status: "Conditional" },
                  ].map((req, index) => (
                    <div
                      key={index}
                      className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                          <req.icon className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium text-sm leading-relaxed">{req.text}</p>
                          <Badge variant={req.status === "Required" ? "default" : "secondary"} className="mt-2 text-xs">
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced How to Enroll */}
            <Card className="border-0 py-0 shadow-xl overflow-hidden">
              <CardHeader className="p-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white relative">
                <div className="absolute inset-0 bg-white/10"></div>
                <CardTitle className="flex py-0 items-center gap-3 text-2xl relative">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  How to Enroll
                </CardTitle>
                <CardDescription className="text-yellow-100 text-lg">
                  Follow these simple steps to complete your enrollment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 md:p-8">
                <div className="space-y-6">
                  {[
                    { step: 1, text: "Create an account or log in", icon: User, time: "2 min" },
                    { step: 2, text: "Fill the online enrollment form", icon: FileText, time: "10 min" },
                    { step: 3, text: "Upload the required documents", icon: Upload, time: "5 min" },
                    { step: 4, text: "Pay the application/enrollment fee", icon: CreditCard, time: "3 min" },
                    { step: 5, text: "Submit your application", icon: CheckCircle, time: "1 min" },
                    { step: 6, text: "Track your application status", icon: AlertCircle, time: "Ongoing" },
                    { step: 7, text: "Accept admission and complete registration", icon: GraduationCap, time: "5 min" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-6 p-4 hover:bg-yellow-50 rounded-xl transition-all duration-300 hover:shadow-md"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                          {item.step}
                        </div>
                        {index < 6 && (
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-yellow-200"></div>
                        )}
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <item.icon className="w-6 h-6 text-gray-600 mb-2" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Est. {item.time}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Start Button */}
            <div className="text-center py-8">
              <div className="inline-flex flex-col items-center gap-4">
                <Button
                  onClick={startEnrollment}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700
                   text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1
                    transition-all duration-300 animate-float"
                >
                  <GraduationCap className="w-6 h-6 mr-3" />
                  Start Enrollment
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Secure & Encrypted Application Process
                </p>
              </div>
            </div>

            {/* Enhanced Need Help Section */}
            <Card className="border-0 py-0 shadow-xl overflow-hidden">
              <CardHeader className="p-5 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  Need Help?
                </CardTitle>
                <CardDescription className="text-gray-200 text-lg">
                  Our admissions team is here to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email Support",
                      value: "admissions@school.com",
                      description: "Get detailed responses within 24 hours",
                      action: "Send Email",
                    },
                    {
                      icon: Phone,
                      title: "Phone Support",
                      value: "+234 801 234 5678",
                      description: "Speak directly with our team",
                      action: "Call Now",
                    },
                    {
                      icon: MessageCircle,
                      title: "WhatsApp Chat",
                      value: "Chat with us",
                      description: "Quick responses and instant help",
                      action: "Start Chat",
                    },
                  ].map((contact, index) => (
                    <Card
                      key={index}
                      data-aos="zoom-in"
                      className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                          <contact.icon className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{contact.title}</h3>
                          <p className="text-yellow-600 font-medium">{contact.value}</p>
                          <p className="text-sm text-gray-600 mt-2">{contact.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                        >
                          {contact.action}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Form Steps */}
        {currentStep > 0 && currentStep <= formSteps && (
          <div className="animate-in slide-in-from-right duration-500">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <Card className="py-0 border-0 shadow-xl overflow-hidden">
                  <CardHeader className="p-5 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <User className="w-6 h-6" />
                      </div>
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-gray-200">
                      Please provide your basic personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 transition-colors ${
                            errors.firstName ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 transition-colors ${
                            errors.lastName ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                          Date of Birth <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 transition-colors ${
                            errors.dateOfBirth ? "border-red-500" : ""
                          }`}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.dateOfBirth}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Gender <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) => handleInputChange("gender", value)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                        </RadioGroup>
                        {errors.gender && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.gender}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nationality" className="text-gray-700 font-medium">
                          Nationality
                        </Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => handleInputChange("nationality", e.target.value)}
                          className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                          placeholder="Enter your nationality"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Contact & Guardian Information */}
              {currentStep === 2 && (
                <Card className="py-0 border-0 shadow-xl overflow-hidden">
                  <CardHeader className="p-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <MapPin className="w-6 h-6" />
                      </div>
                      Contact & Guardian Information
                    </CardTitle>
                    <CardDescription className="text-yellow-100">
                      Your contact details and guardian information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Student Contact */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-yellow-600" />
                        Student Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                            placeholder="student@example.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700 font-medium">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                              errors.phone ? "border-red-500" : ""
                            }`}
                            placeholder="+234 801 234 5678"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address" className="text-gray-700 font-medium">
                            Street Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                              errors.address ? "border-red-500" : ""
                            }`}
                            placeholder="Enter your full address"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.address}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-gray-700 font-medium">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                              errors.city ? "border-red-500" : ""
                            }`}
                            placeholder="Enter your city"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.city}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-gray-700 font-medium">
                            State/Province
                          </Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                            placeholder="Enter your state"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guardian Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-yellow-600" />
                        Guardian Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="guardianName" className="text-gray-700 font-medium">
                            Guardian Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="guardianName"
                            value={formData.guardianName}
                            onChange={(e) => handleInputChange("guardianName", e.target.value)}
                            className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                              errors.guardianName ? "border-red-500" : ""
                            }`}
                            placeholder="Enter guardian's full name"
                          />
                          {errors.guardianName && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.guardianName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianRelation" className="text-gray-700 font-medium">
                            Relationship <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.guardianRelation}
                            onValueChange={(value) => handleInputChange("guardianRelation", value)}
                          >
                            <SelectTrigger
                              className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                                errors.guardianRelation ? "border-red-500" : ""
                              }`}
                            >
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="guardian">Legal Guardian</SelectItem>
                              <SelectItem value="grandparent">Grandparent</SelectItem>
                              <SelectItem value="uncle">Uncle</SelectItem>
                              <SelectItem value="aunt">Aunt</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.guardianRelation && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.guardianRelation}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianPhone" className="text-gray-700 font-medium">
                            Guardian Phone <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="guardianPhone"
                            type="tel"
                            value={formData.guardianPhone}
                            onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                            className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                              errors.guardianPhone ? "border-red-500" : ""
                            }`}
                            placeholder="+234 801 234 5678"
                          />
                          {errors.guardianPhone && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.guardianPhone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianEmail" className="text-gray-700 font-medium">
                            Guardian Email
                          </Label>
                          <Input
                            id="guardianEmail"
                            type="email"
                            value={formData.guardianEmail}
                            onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                            className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                            placeholder="guardian@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Academic Information & Documents */}
              {currentStep === 3 && (
                <Card className="py-0 border-0 shadow-xl overflow-hidden">
                  <CardHeader className="p-5 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      Academic Information & Documents
                    </CardTitle>
                    <CardDescription className="text-gray-200">
                      Academic background and required documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Academic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-yellow-600" />
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="previousSchool" className="text-gray-700 font-medium">
                            Previous School
                          </Label>
                          <Input
                            id="previousSchool"
                            value={formData.previousSchool}
                            onChange={(e) => handleInputChange("previousSchool", e.target.value)}
                            className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                            placeholder="Enter your previous school name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gradeLevel" className="text-gray-700 font-medium">
                            Grade Level <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.gradeLevel}
                            onValueChange={(value) => handleInputChange("gradeLevel", value)}
                          >
                            <SelectTrigger
                              className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                                errors.gradeLevel ? "border-red-500" : ""
                              }`}
                            >
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nursery-1">Nursery 1</SelectItem>
                              <SelectItem value="nursery-2">Nursery 2</SelectItem>
                              <SelectItem value="kindergarten">Kindergarten</SelectItem>
                              <SelectItem value="primary-1">Primary 1</SelectItem>
                              <SelectItem value="primary-2">Primary 2</SelectItem>
                              <SelectItem value="primary-3">Primary 3</SelectItem>
                              <SelectItem value="primary-4">Primary 4</SelectItem>
                              <SelectItem value="primary-5">Primary 5</SelectItem>
                              <SelectItem value="primary-6">Primary 6</SelectItem>
                              <SelectItem value="jss-1">JSS 1</SelectItem>
                              <SelectItem value="jss-2">JSS 2</SelectItem>
                              <SelectItem value="jss-3">JSS 3</SelectItem>
                              <SelectItem value="ss-1">SS 1</SelectItem>
                              <SelectItem value="ss-2">SS 2</SelectItem>
                              <SelectItem value="ss-3">SS 3</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gradeLevel && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.gradeLevel}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-gray-700 font-medium">
                            Preferred Start Date <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                            className={`border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 ${
                              errors.startDate ? "border-red-500" : ""
                            }`}
                          />
                          {errors.startDate && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.startDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-yellow-600" />
                        Required Documents
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <FileUploadArea
                            field="birthCertificate"
                            label="Birth Certificate"
                            accept=".pdf,.jpg,.jpeg,.png"
                            maxSize="5MB"
                            required
                          />
                        </div>
                        <div className="relative">
                          <FileUploadArea
                            field="transcripts"
                            label="Previous School Results/Transcripts"
                            accept=".pdf,.jpg,.jpeg,.png"
                            maxSize="5MB"
                          />
                        </div>
                        <div className="relative md:col-span-2 max-w-md">
                          <FileUploadArea
                            field="passportPhoto"
                            label="Passport Photograph"
                            accept=".jpg,.jpeg,.png"
                            maxSize="2MB"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-yellow-600" />
                        Additional Information
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="medicalConditions" className="text-gray-700 font-medium">
                            Medical Conditions or Allergies
                          </Label>
                          <Textarea
                            id="medicalConditions"
                            value={formData.medicalConditions}
                            onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                            className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                            placeholder="Please list any medical conditions, allergies, or medications..."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyContact" className="text-gray-700 font-medium">
                              Emergency Contact Name
                            </Label>
                            <Input
                              id="emergencyContact"
                              value={formData.emergencyContact}
                              onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                              className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                              placeholder="Emergency contact full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyPhone" className="text-gray-700 font-medium">
                              Emergency Contact Phone
                            </Label>
                            <Input
                              id="emergencyPhone"
                              type="tel"
                              value={formData.emergencyPhone}
                              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                              className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                              placeholder="+234 801 234 5678"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Review and Submit */}
              {currentStep === 4 && (
                <Card className="py-0 border-0 shadow-xl overflow-hidden">
                  <CardHeader className="p-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FileText className="w-6 h-6" />
                      </div>
                      Review & Submit Application
                    </CardTitle>
                    <CardDescription className="text-yellow-100">
                      Please review your information before submitting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Application Summary */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Application Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="text-gray-900">
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-900">{formData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Phone:</span>
                            <span className="text-gray-900">{formData.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Grade Level:</span>
                            <span className="text-gray-900">{formData.gradeLevel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Guardian:</span>
                            <span className="text-gray-900">{formData.guardianName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Start Date:</span>
                            <span className="text-gray-900">{formData.startDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <CreditCard className="w-5 h-5 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-2">Application Fee Payment</h4>
                            <p className="text-sm mb-3">
                              An application fee of <strong>₦5,000</strong> is required to process your enrollment
                              application.
                            </p>
                          </div>
                          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay Application Fee
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Terms and Conditions</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="terms"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                            className="mt-1"
                          />
                          <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                            I accept the{" "}
                            <a href="#" className="text-yellow-600 hover:underline font-medium">
                              Terms and Conditions
                            </a>{" "}
                            and understand the enrollment policies of the school. I acknowledge that all information
                            provided is accurate and complete.
                          </Label>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="privacy"
                            checked={formData.privacyAccepted}
                            onCheckedChange={(checked) => handleInputChange("privacyAccepted", checked as boolean)}
                            className="mt-1"
                          />
                          <Label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed">
                            I consent to the collection and processing of personal data as outlined in the{" "}
                            <a href="#" className="text-yellow-600 hover:underline font-medium">
                              Privacy Policy
                            </a>
                            . I understand how my data will be used and stored.
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <Alert>
                      <AlertCircle className="w-5 h-5" />
                      <AlertDescription>
                        <h4 className="font-semibold text-gray-900 mb-2">Important Notice</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>
                            • After submitting, you'll receive a confirmation email with your application reference
                            number
                          </li>
                          <li>• Our admissions team will review your application within 3-5 business days</li>
                          <li>• You can track your application status using your reference number</li>
                          <li>• Ensure all uploaded documents are clear and legible</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 bg-transparent"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Previous
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Step {currentStep} of {formSteps}
                  </p>
                </div>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!formData.termsAccepted || !formData.privacyAccepted || isSubmitting}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Confirmation Page */}
        {currentStep === 5 && (
          <div className="text-center space-y-8 animate-in fade-in duration-700">
            <Card className="border-0 shadow-2xl max-w-3xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Application Submitted Successfully!</h2>
                <p className="text-green-100 text-lg">
                  Thank you for choosing our school. Your enrollment application has been received.
                </p>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Application Reference:</span>
                      <span className="font-mono text-green-600 font-bold">
                        ENR-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Submitted:</span>
                      <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Expected Response:</span>
                      <span className="text-gray-900">3-5 business days</span>
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    What happens next?
                  </h3>
                  <div className="space-y-3">
                    {[
                      "You will receive a confirmation email with your application details",
                      "Our admissions team will review your application and documents",
                      "We will contact you within 3-5 business days with updates",
                      "You can track your application status using your reference number",
                      "If accepted, you'll receive admission instructions and next steps",
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    onClick={() => setCurrentStep(0)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Return to Home
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
//   )
// <<<<<<< HEAD

// =======
// =======
// // app/enroll/page.tsx
// import React from 'react';
// import Link from 'next/link';

// export default function EnrollPage() {
//   return (
//     <main className="min-h-screen bg-gray-100 text-gray-800 px-4 py-10">
//       <section className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-4 text-center">Enroll Now</h1>
//         <p className="text-lg text-center mb-10">
//           Begin your journey with us. Follow the steps below to apply for admission into our school.
//         </p>

//         {/* Requirements */}
//         <div className="bg-white rounded-xl shadow p-6 mb-10">
//           <h2 className="text-2xl font-semibold mb-4">Admission Requirements</h2>
//           <ul className="list-disc pl-5 space-y-2">
//             <li>Completed Application Form</li>
//             <li>Birth Certificate or Age Declaration</li>
//             <li>Previous School Results / Transcripts</li>
//             <li>Passport Photograph (recent)</li>
//             <li>Entrance Exam (if applicable)</li>
//           </ul>
//         </div>

//         {/* Steps */}
//         <div className="bg-white rounded-xl shadow p-6 mb-10">
//           <h2 className="text-2xl font-semibold mb-4">How to Enroll</h2>
//           <ol className="list-decimal pl-5 space-y-3">
//             <li>Create an account or log in</li>
//             <li>Fill the online enrollment form</li>
//             <li>Upload the required documents</li>
//             <li>Pay the application/enrollment fee</li>
//             <li>Submit your application</li>
//             <li>Track your application status</li>
//             <li>Accept admission and complete registration</li>
//           </ol>
//         </div>

//         {/* Enrollment Button */}
//         <div className="text-center mb-10">
//           <Link href="/enroll/form">
//             <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition">
//               Start Enrollment
//             </span>
//           </Link>
//         </div>


//         {/* Contact Info */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
//           <p className="mb-2">📧 Email: <a href="mailto:admissions@school.com" className="text-blue-600 hover:underline">admissions@school.com</a></p>
//           <p className="mb-2">📞 Phone: <a href="tel:+2348012345678" className="text-blue-600 hover:underline">+234 801 234 5678</a></p>
//           <p className="mb-2">💬 WhatsApp: <a href="https://wa.me/2348012345678" target="_blank" className="text-blue-600 hover:underline">Chat with us</a></p>
//         </div>
//       </section>
//     </main>
  );
}
// app/enroll/page.tsx
// import React from 'react';

// export default function EnrollPage() {
//   return (
//     <main className="min-h-screen bg-gray-100 text-gray-800 px-4 py-10">
//       <section className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-4 text-center">Enroll Now</h1>
//         <p className="text-lg text-center mb-10">
//           Begin your journey with us. Follow the steps below to apply for admission into our school.
//         </p>

//         {/* Requirements */}
//         <div className="bg-white rounded-xl shadow p-6 mb-10">
//           <h2 className="text-2xl font-semibold mb-4">Admission Requirements</h2>
//           <ul className="list-disc pl-5 space-y-2">
//             <li>Completed Application Form</li>
//             <li>Birth Certificate or Age Declaration</li>
//             <li>Previous School Results / Transcripts</li>
//             <li>Passport Photograph (recent)</li>
//             <li>Entrance Exam (if applicable)</li>
//           </ul>
//         </div>

//         {/* Steps */}
//         <div className="bg-white rounded-xl shadow p-6 mb-10">
//           <h2 className="text-2xl font-semibold mb-4">How to Enroll</h2>
//           <ol className="list-decimal pl-5 space-y-3">
//             <li>Create an account or log in</li>
//             <li>Fill the online enrollment form</li>
//             <li>Upload the required documents</li>
//             <li>Pay the application/enrollment fee</li>
//             <li>Submit your application</li>
//             <li>Track your application status</li>
//             <li>Accept admission and complete registration</li>
//           </ol>
//         </div>

//         {/* Enrollment Button */}
//         <div className="text-center mb-10">
//           <Link href="/enroll/form">
//             <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition">
//               Start Enrollment
//             </span>
//           </Link>
//         </div>


//         {/* Contact Info */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
//           <p className="mb-2">📧 Email: <a href="mailto:admissions@school.com" className="text-blue-600 hover:underline">admissions@school.com</a></p>
//           <p className="mb-2">📞 Phone: <a href="tel:+2348012345678" className="text-blue-600 hover:underline">+234 801 234 5678</a></p>
//           <p className="mb-2">💬 WhatsApp: <a href="https://wa.me/2348012345678" target="_blank" className="text-blue-600 hover:underline">Chat with us</a></p>
//         </div>
//       </section>
//     </main>
//   );
// }
