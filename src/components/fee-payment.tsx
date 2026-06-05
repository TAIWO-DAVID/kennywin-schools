"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FeeInfo } from "@/types/student"
// import { initiatePayment } from "@/lib/mock-data"
import { CreditCard, DollarSign, Calendar, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FeePaymentProps {
  feeInfo: FeeInfo
  studentEmail: string
  studentName: string
}

export function FeePayment({ feeInfo, studentEmail, studentName }: FeePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  // const handlePayment = async () => {
  //   setIsProcessing(true)

  //   try {
  //     const result = await initiatePayment(feeInfo.balance, studentEmail, studentName)

  //     toast({
  //       title: "Payment Initiated",
  //       description: "Your payment is being processed. You will be redirected to complete the payment.",
  //     })

  //     // In a real implementation, this would redirect to Flutterwave
  //     console.log("Payment result:", result)
  //   } catch (error) {
  //     toast({
  //       title: "Payment Failed",
  //       description: "There was an error processing your payment. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  // const isOverdue = new Date(feeInfo.due_date) < new Date()
  const paymentPercentage = ((feeInfo.amount_paid / feeInfo.tuition) * 100).toFixed(1)

  return (
    <div className="animate-slide-in">
      <Card className="shadow-lg border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            School Fee Payment
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Tuition</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(feeInfo.tuition)}</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-muted-foreground">Amount Paid</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(feeInfo.amount_paid)}</p>
                <p className="text-xs text-muted-foreground">{paymentPercentage}% completed</p>
              </CardContent>
            </Card>

            <Card
              className={`${feeInfo.balance > 0 ? "bg-orange-50 dark:bg-orange-950/20" : "bg-green-50 dark:bg-green-950/20"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className={`h-4 w-4 ${feeInfo.balance > 0 ? "text-orange-600" : "text-green-600"}`} />
                  <span className="text-sm font-medium text-muted-foreground">Balance</span>
                </div>
                <p className={`text-2xl font-bold ${feeInfo.balance > 0 ? "text-orange-600" : "text-green-600"}`}>
                  {formatCurrency(feeInfo.balance)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Payment Due Date</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-lg">{new Date(feeInfo.due_date).toLocaleDateString()}</span>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div> */}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{paymentPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${paymentPercentage}%` }}
              />
            </div>
          </div>

          {/* {feeInfo.balance > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 h-12 text-lg font-semibold"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay {formatCurrency(feeInfo.balance)} Now
                  </>
                )}
              </Button>
            </div>
          )} */}

          {feeInfo.balance === 0 && (
            <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-green-600 text-lg font-semibold">✅ All fees have been paid!</div>
              <p className="text-muted-foreground mt-1">Thank you for keeping your account up to date.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
