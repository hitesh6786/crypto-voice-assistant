"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Send, Volume2, VolumeX, AlertTriangle, Bot, User } from "lucide-react"
import { SpeechRecognitionService } from "@/lib/speech-recognition"
import { TextToSpeechService } from "@/lib/text-to-speech"
import LiveKitProvider from "./livekit-provider"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_QUESTIONS = [
  "What's the price of Bitcoin?",
  "Tell me about Ethereum",
  "How is the crypto market doing?",
  "What is blockchain?",
  "Tell me about Avalanche",
  "What is Aptos?",
  "Show me the top performing coins",
  "What are NFTs?",
  "Explain DeFi",
  "What is staking?",
]

export default function CryptoAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your crypto voice assistant. You can ask me about cryptocurrency prices, market trends, or general information. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [livekitError, setLivekitError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)

  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null)
  const textToSpeechRef = useRef<TextToSpeechService | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Initialize services
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Generate a random username
      const randomUsername = `user-${Math.floor(Math.random() * 10000)}`
      setUsername(randomUsername)

      // Initialize speech recognition
      speechRecognitionRef.current = new SpeechRecognitionService(
        handleSpeechResult,
        () => setIsListening(false),
        (error) => {
          toast({
            title: "Speech Recognition Error",
            description: error,
            variant: "destructive",
          })
          setIsListening(false)
        },
      )

      // Initialize text-to-speech
      textToSpeechRef.current = new TextToSpeechService()

      // Speak the welcome message
      setTimeout(() => {
        if (textToSpeechRef.current) {
          setIsSpeaking(true)
          textToSpeechRef.current.speak(messages[0].content)
          setIsSpeaking(false)
        }
      }, 1000)

      // Check if LiveKit is available
      checkLivekitAvailability()
    }
  }, [])

  // Check if LiveKit is available
  const checkLivekitAvailability = async () => {
    try {
      // Only check if the environment variable is set
      if (!process.env.NEXT_PUBLIC_LIVEKIT_URL) {
        setLivekitError("LiveKit URL is not configured")
        setIsInitialized(true)
        return
      }

      // Notify the server about the room we want to use
      const response = await fetch("/api/livekit/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: "crypto-assistant-room" }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setLivekitError(data.error || "LiveKit service is not available")
      }
    } catch (error) {
      console.error("Error checking LiveKit availability:", error)
      setLivekitError("Failed to connect to LiveKit service")
    } finally {
      // Allow the app to initialize even if LiveKit is not available
      setIsInitialized(true)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSpeechResult = (transcript: string) => {
    setInput(transcript)
    handleSendMessage(transcript)
  }

  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop()
      setIsListening(false)
    } else {
      speechRecognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      textToSpeechRef.current?.stop()
      setIsSpeaking(false)
    } else {
      // Speak the last assistant message
      const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant")
      if (lastAssistantMessage && textToSpeechRef.current) {
        setIsSpeaking(true)
        textToSpeechRef.current.speak(lastAssistantMessage.content)
        setIsSpeaking(false)
      }
    }
  }

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setTypingIndicator(true)

    try {
      // Process the command
      const response = await fetch("/api/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: text }),
      })

      const data = await response.json()

      // Simulate a slight delay for more natural conversation
      await new Promise((resolve) => setTimeout(resolve, 500))
      setTypingIndicator(false)

      if (response.ok) {
        // Add assistant message
        const assistantMessage: Message = { id: Date.now().toString(), role: "assistant", content: data.response }
        setMessages((prev) => [...prev, assistantMessage])

        // Speak the response
        if (textToSpeechRef.current) {
          setIsSpeaking(true)
          textToSpeechRef.current.speak(data.response)
          setIsSpeaking(false)
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process command",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing command:", error)
      toast({
        title: "Error",
        description: "Failed to process command",
        variant: "destructive",
      })
      setTypingIndicator(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    handleSendMessage(question)
  }

  // If not initialized yet, show loading
  if (!isInitialized) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p>Initializing crypto assistant...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const assistantContent = (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      {livekitError && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>LiveKit Warning</AlertTitle>
          <AlertDescription>{livekitError}</AlertDescription>
        </Alert>
      )}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Crypto Voice Assistant
        </CardTitle>
        <CardDescription className="text-blue-100">
          Ask about crypto prices, market trends, and trading information
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="h-[400px] overflow-y-auto mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {message.role === "assistant" && (
                    <div className="bg-blue-500 text-white p-1 rounded-full">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-200 dark:bg-gray-700 rounded-tl-none"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="bg-gray-500 text-white p-1 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {typingIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 mb-4"
              >
                <div className="bg-blue-500 text-white p-1 rounded-full">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg rounded-tl-none">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length < 3 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant={isListening ? "destructive" : "outline"}
            onClick={toggleListening}
            disabled={isLoading}
            className={isListening ? "animate-pulse" : ""}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={toggleSpeaking}
            disabled={isLoading}
            className={isSpeaking ? "animate-pulse" : ""}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
        <p className="text-xs text-gray-500">
          Disclaimer: This assistant provides information only, not financial advice.
        </p>
      </CardFooter>
    </Card>
  )

  // If LiveKit is not available or there's an error, just return the assistant content without the LiveKit provider
  if (livekitError || !process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    return assistantContent
  }

  // Otherwise, wrap the assistant content with the LiveKit provider
  return <LiveKitProvider username={username}>{assistantContent}</LiveKitProvider>
}
