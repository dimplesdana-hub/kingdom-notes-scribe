import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAssemblyAiToken } from "./assemblyai.functions";

type Status = "idle" | "connecting" | "live" | "error";

interface V3Msg {
  type: "Begin" | "Turn" | "Termination";
  transcript?: string;
  end_of_turn?: boolean;
  error?: string;
}

export function useLiveTranscription() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [partial, setPartial] = useState("");
  const [finals, setFinals] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const procRef = useRef<ScriptProcessorNode | null>(null);
  const srcRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const fetchToken = useServerFn(getAssemblyAiToken);

  const stop = useCallback(() => {
    try {
      procRef.current?.disconnect();
      srcRef.current?.disconnect();
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ terminate_session: true }));
      }
      wsRef.current?.close();
      ctxRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    wsRef.current = null;
    ctxRef.current = null;
    procRef.current = null;
    srcRef.current = null;
    streamRef.current = null;
    setStatus("idle");
    setPartial("");
  }, []);

  const reset = useCallback(() => {
    setFinals([]);
    setPartial("");
    setError(null);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      setStatus("connecting");

      const { token } = await fetchToken({ data: undefined as any });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      srcRef.current = source;
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      procRef.current = processor;

      const ws = new WebSocket(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("live");
        source.connect(processor);
        processor.connect(ctx.destination);
      };

      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data) as PartialMsg;
        if (msg.message_type === "PartialTranscript" && msg.text !== undefined) {
          setPartial(msg.text);
        } else if (msg.message_type === "FinalTranscript" && msg.text) {
          setFinals((prev) => [...prev, msg.text!]);
          setPartial("");
        } else if (msg.error) {
          setError(msg.error);
        }
      };

      ws.onerror = () => setError("Connection error");
      ws.onclose = () => {
        if (status !== "idle") setStatus("idle");
      };

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        const input = e.inputBuffer.getChannelData(0);
        // Float32 -> Int16 PCM
        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        // base64 encode
        const bytes = new Uint8Array(pcm.buffer);
        let bin = "";
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        const b64 = btoa(bin);
        ws.send(JSON.stringify({ audio_data: b64 }));
      };
    } catch (e: any) {
      setError(e?.message ?? "Failed to start");
      setStatus("error");
      stop();
    }
  }, [fetchToken, status, stop]);

  return { status, error, partial, finals, start, stop, reset };
}
