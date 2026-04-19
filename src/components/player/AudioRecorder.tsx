import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Upload, Play, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  value?: { audioBlobUrl?: string; audioFileName?: string; recordedDurationSec?: number };
  onChange: (v: { audioBlobUrl?: string; audioFileName?: string; recordedDurationSec?: number }) => void;
  readOnly?: boolean;
  maxSec?: number;
}

const AudioRecorder = ({ value, onChange, readOnly, maxSec = 120 }: Props) => {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => () => { stopStream(); if (timerRef.current) clearInterval(timerRef.current); }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onChange({ audioBlobUrl: url, audioFileName: `recording-${Date.now()}.webm`, recordedDurationSec: elapsed });
        stopStream();
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= maxSec) {
            stop();
          }
          return next;
        });
      }, 1000);
    } catch {
      toast.error('Không thể truy cập microphone. Vui lòng dùng tuỳ chọn upload file.');
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const clear = () => {
    if (value?.audioBlobUrl) URL.revokeObjectURL(value.audioBlobUrl);
    onChange({});
    setElapsed(0);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onChange({ audioBlobUrl: url, audioFileName: f.name, recordedDurationSec: 0 });
  };

  const hasAudio = !!value?.audioBlobUrl;
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;

  return (
    <div className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
      {!hasAudio && !recording && !readOnly && (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={start} className="gap-2">
            <Mic className="h-4 w-4" /> Ghi âm
          </Button>
          <span className="text-xs text-muted-foreground">hoặc</span>
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={onFile} />
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" /> Tải file audio
          </Button>
          <span className="text-xs text-muted-foreground">Tối đa {maxSec}s</span>
        </div>
      )}

      {recording && (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-mono">{mm}:{String(ss).padStart(2, '0')} / {Math.floor(maxSec / 60)}:{String(maxSec % 60).padStart(2, '0')}</span>
          <Button size="sm" variant="destructive" onClick={stop} className="gap-2">
            <Square className="h-4 w-4" /> Dừng
          </Button>
        </div>
      )}

      {hasAudio && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Play className="h-4 w-4 text-success" />
            <span className="font-medium truncate">{value.audioFileName}</span>
            {value.recordedDurationSec ? <span className="text-xs text-muted-foreground">— {value.recordedDurationSec}s</span> : null}
          </div>
          <audio controls src={value.audioBlobUrl} className="w-full h-10" />
          {!readOnly && (
            <Button size="sm" variant="ghost" onClick={clear} className="gap-2 text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Xoá & ghi lại
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
