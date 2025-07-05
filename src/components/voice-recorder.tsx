'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onAudioSubmit: (audioDataUri: string) => void;
  disabled: boolean;
}

export function VoiceRecorder({ onAudioSubmit, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64String = reader.result as string;
            onAudioSubmit(base64String);
          };
           // Stop all tracks to turn off the microphone indicator
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        let message = 'Could not access the microphone.';
        if (err instanceof Error && err.name === 'NotAllowedError') {
          message = 'Microphone access was denied. Please allow access in your browser settings.';
        }
        setError(message);
        toast({
          variant: "destructive",
          title: "Microphone Error",
          description: message,
        })
      }
    } else {
      const message = 'Your browser does not support audio recording.';
      setError(message);
      toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: message,
      })
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
       <Button 
        onClick={handleButtonClick} 
        disabled={disabled} 
        size="lg"
        className="w-full max-w-xs transition-all duration-300"
        variant={isRecording ? 'destructive' : 'default'}
       >
        {isRecording ? (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span>Stop Recording</span>
            <Square className="w-5 h-5" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Start Recording</span>
            <Mic className="w-5 h-5" />
          </div>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
