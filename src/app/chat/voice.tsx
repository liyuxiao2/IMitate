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
    let silenceTimeout: ReturnType<typeof setTimeout> | null = null;

    recognition.continuous = true; // allow continuous input
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      if (onStart) onStart();
    };

    recognition.onresult = (event) => {
      // Reset silence timer
      if (silenceTimeout) clearTimeout(silenceTimeout);
      silenceTimeout = setTimeout(() => {
        console.log('1 second of silence detected — stopping recognition');
        recognition.stop();
      }, 1000);

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      if (onStop) onStop();
      resolve(finalTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (onStop) onStop();
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.start();
  });
}
