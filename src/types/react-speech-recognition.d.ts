declare module "react-speech-recognition" {
  export function useSpeechRecognition(): {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: () => boolean;
    isMicrophoneAvailable: boolean;
  };

  const SpeechRecognition: {
    startListening: (options?: { continuous?: boolean; language?: string }) => void;
    stopListening: () => void;
    abortListening: () => void;
    browserSupportsSpeechRecognition: () => boolean;
  };

  export default SpeechRecognition;
}
