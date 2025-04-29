export class SpeechRecognitionService {
  recognition: SpeechRecognition | null = null
  isListening = false

  constructor(
    private onResult: (transcript: string) => void,
    private onEnd: () => void,
    private onError: (error: string) => void,
  ) {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition: SpeechRecognitionStatic = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = "en-US"

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        this.onResult(transcript)
      }

      this.recognition.onend = () => {
        this.isListening = false
        this.onEnd()
      }

      this.recognition.onerror = (event) => {
        this.isListening = false
        this.onError(`Speech recognition error: ${event.error}`)
      }
    }
  }

  start() {
    if (this.recognition) {
      try {
        this.recognition.start()
        this.isListening = true
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        this.onError("Failed to start speech recognition")
      }
    } else {
      this.onError("Speech recognition is not supported in this browser")
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }
}

// Type definitions for browsers
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic
    webkitSpeechRecognition: SpeechRecognitionStatic
  }
}

interface SpeechRecognitionStatic {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}
