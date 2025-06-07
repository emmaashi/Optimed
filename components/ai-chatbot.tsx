"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, AlertTriangle, Clock, MapPin } from "lucide-react"
import { useChat } from "ai/react"
import { supabase } from "@/lib/supabase"

interface InjuryAssessment {
  severity: number
  urgency: "emergency" | "urgent" | "moderate" | "low"
  recommendedAction: string
  estimatedWaitTime: number
}

interface AIChatbotProps {
  userId: string
  onQueueJoin: (assessment: InjuryAssessment, hospitalId: string) => void
}

export function AIChatbot({ userId, onQueueJoin }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [assessment, setAssessment] = useState<InjuryAssessment | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<string>("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm your AI health assistant. I'm here to help assess your injury and find you the best care option. Can you tell me what happened and what symptoms you're experiencing?",
      },
    ],
    onFinish: async (message) => {
      console.log("Chat finished with message:", message)

      // Save chat session to Supabase
      try {
        await saveChatSession([...messages, message])
      } catch (error) {
        console.error("Error saving chat session:", error)
      }

      // Check if the AI provided an assessment
      if (message.content.includes("ASSESSMENT:")) {
        parseAssessment(message.content)
      }
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  const saveChatSession = async (chatMessages: any[]) => {
    try {
      await supabase.from("chat_sessions").upsert({
        user_id: userId,
        messages: chatMessages,
        injury_assessment: assessment,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving chat session:", error)
    }
  }

  const parseAssessment = (content: string) => {
    // Parse AI response for assessment data
    const severityMatch = content.match(/Severity: (\d)/)
    const urgencyMatch = content.match(/Urgency: (\w+)/)
    const actionMatch = content.match(/Action: ([^\n]+)/)
    const waitTimeMatch = content.match(/Wait Time: (\d+)/)

    if (severityMatch && urgencyMatch && actionMatch && waitTimeMatch) {
      const newAssessment: InjuryAssessment = {
        severity: Number.parseInt(severityMatch[1]),
        urgency: urgencyMatch[1] as any,
        recommendedAction: actionMatch[1],
        estimatedWaitTime: Number.parseInt(waitTimeMatch[1]),
      }
      setAssessment(newAssessment)
    }
  }

  const handleJoinQueue = () => {
    if (assessment && selectedHospital) {
      onQueueJoin(assessment, selectedHospital)
      setIsOpen(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-700 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Debug logging
  useEffect(() => {
    console.log("Messages updated:", messages)
    console.log("Is loading:", isLoading)
    console.log("Error:", error)
  }, [messages, isLoading, error])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 text-emerald-600" />
            AI Health Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
            ×
          </Button>
        </div>
        {error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">Error: {error.message}</div>}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-500" : "bg-emerald-500"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {assessment && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Assessment Complete
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getUrgencyColor(assessment.urgency)}>{assessment.urgency.toUpperCase()}</Badge>
                <span className="text-xs text-gray-600">Severity: {assessment.severity}/5</span>
              </div>
              <p className="text-xs text-gray-700">{assessment.recommendedAction}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>Est. wait: {assessment.estimatedWaitTime} min</span>
              </div>

              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full mt-2 p-2 text-xs border rounded"
              >
                <option value="">Select Hospital</option>
                <option value="toronto-general">Toronto General Hospital</option>
                <option value="mount-sinai">Mount Sinai Hospital</option>
                <option value="st-michaels">St. Michael's Hospital</option>
              </select>

              <Button onClick={handleJoinQueue} disabled={!selectedHospital} className="w-full mt-2 h-8 text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                Join Queue
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Describe your injury or symptoms..."
            className="flex-1 h-10"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-10 w-10" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Debug info */}
        <div className="text-xs text-gray-500 mt-2">
          Messages: {messages.length} | Loading: {isLoading ? "Yes" : "No"}
        </div>
      </CardContent>
    </Card>
  )
}