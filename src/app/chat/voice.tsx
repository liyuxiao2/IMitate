'use client';

// Type declarations for Speech Recognition API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: ISpeechRecognitionEvent) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: ISpeechRecognitionErrorEvent) => any) | null;
}

interface ISpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface ISpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface ISpeechRecognitionConstructor {
  new(): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: ISpeechRecognitionConstructor;
    webkitSpeechRecognition: ISpeechRecognitionConstructor;
  }
}

export default function startSpeechRecognition(
  onStart?: () => void,
  onStop?: () => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    let finalTranscript = '';

    recognition.continuous = false; // 👈 safer for short bursts of speech
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      if (onStart) onStart();

      // ⏱️ Stop listening after 5 seconds
      setTimeout(() => {
        recognition.stop(); // 👈 manually end it after 5s
      }, 5000);
    };

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      if (onStop) onStop();

      setTimeout(() => {
        console.log('Final transcript:', finalTranscript);
        resolve(finalTranscript.trim());
      }, 500);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);

      if (event.error === "aborted") {
        if (onStop) onStop();
        resolve(finalTranscript.trim());
        return;
      }

      if (onStop) onStop();
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.start();
  });
}
