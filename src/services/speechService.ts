export interface SpeechServiceCallbacks {
  onTranscriptChange: (text: string, isFinal: boolean) => void;
  onAudioLevelChange: (level: number) => void;
  onError: (error: string) => void;
  onStatusChange: (status: 'idle' | 'listening' | 'processing') => void;
}

export class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private systemStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private silenceTimer: any = null;
  private callbacks: SpeechServiceCallbacks;
  private currentTranscript = '';

  constructor(callbacks: SpeechServiceCallbacks) {
    this.callbacks = callbacks;
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser environment.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStatusChange('listening');
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk;
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim();
        if (combined) {
          this.currentTranscript = combined;
          this.callbacks.onTranscriptChange(combined, Boolean(finalTranscript));

          // Reset silence timer
          if (this.silenceTimer) clearTimeout(this.silenceTimer);
          this.silenceTimer = setTimeout(() => {
            if (this.currentTranscript.length > 5) {
              this.callbacks.onTranscriptChange(this.currentTranscript, true);
            }
          }, 1800);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          this.callbacks.onError(`Speech Error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        // Automatically restart if user hasn't explicitly stopped
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // Ignored if already started
          }
        } else {
          this.callbacks.onStatusChange('idle');
        }
      };
    } catch (e) {
      console.error('Error initializing SpeechRecognition:', e);
    }
  }

  // Start capturing microphone audio and analysis
  public async startMicrophone(): Promise<boolean> {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.setupAudioAnalyser(this.micStream);

      if (this.recognition) {
        this.isListening = true;
        try {
          this.recognition.start();
        } catch {
          // May already be active
        }
      }
      return true;
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      this.callbacks.onError('Microphone permission denied or unavailable.');
      return false;
    }
  }

  // Start capturing system loopback audio (Zoom / Google Meet / Teams tab audio)
  public async startSystemAudioLoopback(): Promise<boolean> {
    try {
      // In WebRTC, getDisplayMedia with audio allows capturing system/tab audio
      this.systemStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Extract only audio tracks
      const audioTracks = this.systemStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const loopbackStream = new MediaStream(audioTracks);
        this.setupAudioAnalyser(loopbackStream);
        return true;
      } else {
        this.callbacks.onError('No system audio track detected. Make sure to check "Share system audio".');
        return false;
      }
    } catch (err: any) {
      console.warn('System loopback capture cancelled or failed:', err);
      return false;
    }
  }

  private setupAudioAnalyser(stream: MediaStream) {
    try {
      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));

        this.callbacks.onAudioLevelChange(normalized);
        this.animationFrameId = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Audio analyser setup error:', err);
    }
  }

  public stop() {
    this.isListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    if (this.systemStream) {
      this.systemStream.getTracks().forEach((track) => track.stop());
      this.systemStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {
        // Ignored
      }
      this.audioContext = null;
    }

    this.callbacks.onAudioLevelChange(0);
    this.callbacks.onStatusChange('idle');
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}
