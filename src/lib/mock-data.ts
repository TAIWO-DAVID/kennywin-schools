// import type { Student, FeeInfo } from "@/types/student"

// export const mockStudent: Student = {
//     id: "1",
//     student_id: "STD001",
//     first_name: "John",
//     last_name: "Doe",
//     middle_name: "Michael",
//     email: "john.doe@standardschool.edu",
//     gender: "Male",
//     dob: "2008-05-15",
//     age: 16,
//     address: "123 Education Street, Learning City",
//     status: "Active",
//     educational_level: "senior-secondary",
//     class_id: "SS2A",
//     stream: "science",
//     subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English Language", "Civic Education"],
//     results: [
//         { subject: "Mathematics", score: 85, grade: 1 },
//         { subject: "Physics", score: 78, grade: 2 },
//         { subject: "Chemistry", score: 92, grade: 1 },
//         { subject: "Biology", score: 88, grade: 1 },
//         { subject: "English Language", score: 75, grade: 2 },
//         { subject: "Civic Education", score: 80, grade: 2 },
//     ],
//     class: {
//         id: 2,
//         name: "SS2A",
//         level: "Senior Secondary 2",
//     },
//     students: undefined
// }

// export const mockFeeInfo: FeeInfo = {
//   tuition: 150000,
//   amount_paid: 100000,
//   balance: 50000,
//   due_date: "2024-03-15",
// }

// // Mock Flutterwave payment function
// export const initiatePayment = async (amount: number, email: string, name: string) => {
//   // This would normally integrate with Flutterwave
//   console.log("Initiating payment:", { amount, email, name })

//   // Simulate payment process
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         status: "success",
//         transaction_id: "TXN_" + Date.now(),
//         message: "Payment initiated successfully",
//       })
//     }, 1000)
//   })
// }
