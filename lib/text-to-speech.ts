export class TextToSpeechService {
  synth: SpeechSynthesis | null = null
  voices: SpeechSynthesisVoice[] = []

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis

      // Get voices
      this.voices = this.synth.getVoices()

      if (this.voices.length === 0) {
        // Voices might not be loaded yet
        window.speechSynthesis.onvoiceschanged = () => {
          this.voices = this.synth!.getVoices()
        }
      }
    }
  }

  speak(text: string) {
    if (!this.synth) {
      console.error("Speech synthesis not supported")
      return
    }

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Try to find a good voice
    const preferredVoice =
      this.voices.find(
        (voice) => voice.name.includes("Google") && voice.name.includes("US") && voice.name.includes("Female"),
      ) || this.voices.find((voice) => voice.lang === "en-US")

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    this.synth.speak(utterance)
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }
}
