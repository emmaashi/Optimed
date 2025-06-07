"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Stethoscope, AlertTriangle, Clock } from "lucide-react"

interface SymptomCheckerProps {
  onClose: () => void
}

const symptoms = [
  { id: "headache", label: "Headache", severity: 2 },
  { id: "fever", label: "Fever", severity: 3 },
  { id: "chest-pain", label: "Chest Pain", severity: 5 },
  { id: "nausea", label: "Nausea", severity: 2 },
  { id: "dizziness", label: "Dizziness", severity: 3 },
  { id: "shortness-breath", label: "Shortness of Breath", severity: 4 },
  { id: "abdominal-pain", label: "Abdominal Pain", severity: 3 },
  { id: "back-pain", label: "Back Pain", severity: 2 },
]

export function SymptomChecker({ onClose }: SymptomCheckerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [assessment, setAssessment] = useState<any>(null)

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const generateAssessment = () => {
    const selectedSymptomData = symptoms.filter((s) => selectedSymptoms.includes(s.id))
    const maxSeverity = Math.max(...selectedSymptomData.map((s) => s.severity))

    let urgency = "low"
    let recommendation = "Consider seeing your family doctor"
    let waitTime = 60

    if (maxSeverity >= 5) {
      urgency = "emergency"
      recommendation = "Seek emergency care immediately"
      waitTime = 0
    } else if (maxSeverity >= 4) {
      urgency = "urgent"
      recommendation = "Visit urgent care within 2 hours"
      waitTime = 30
    } else if (maxSeverity >= 3) {
      urgency = "moderate"
      recommendation = "Schedule appointment within 24 hours"
      waitTime = 45
    }

    setAssessment({
      severity: maxSeverity,
      urgency,
      recommendation,
      waitTime,
      symptoms: selectedSymptomData.map((s) => s.label),
    })
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "bg-red-100 text-red-700 border-red-200"
    if (severity >= 3) return "bg-orange-100 text-orange-700 border-orange-200"
    if (severity >= 2) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              AI Symptom Checker
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!assessment ? (
            <>
              <div>
                <h3 className="font-medium mb-3">Select your symptoms:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {symptoms.map((symptom) => (
                    <Button
                      key={symptom.id}
                      variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
                      onClick={() => toggleSymptom(symptom.id)}
                      className="justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{symptom.label}</div>
                        <Badge className={`text-xs mt-1 ${getSeverityColor(symptom.severity)}`}>
                          Level {symptom.severity}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateAssessment} disabled={selectedSymptoms.length === 0} className="flex-1">
                  Generate Assessment
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Assessment Results
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(assessment.severity)}>{assessment.urgency.toUpperCase()}</Badge>
                    <span className="text-sm text-gray-600">Severity: {assessment.severity}/5</span>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Symptoms:</p>
                    <p className="text-sm text-gray-600">{assessment.symptoms.join(", ")}</p>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Recommendation:</p>
                    <p className="text-sm text-gray-700">{assessment.recommendation}</p>
                  </div>

                  {assessment.waitTime > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>Estimated wait: {assessment.waitTime} minutes</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Find Nearby Care</Button>
                <Button variant="outline" onClick={() => setAssessment(null)}>
                  Check Again
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
