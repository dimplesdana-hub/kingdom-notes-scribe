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
        wsRef.current.send(JSON.stringify({ type: "Terminate" }));
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
        `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&format_turns=true&speech_model=universal_streaming&token=${token}`
      );
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("live");
        source.connect(processor);
        processor.connect(ctx.destination);
      };

      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data) as V3Msg;
        if (msg.type === "Turn" && typeof msg.transcript === "string") {
          if (msg.end_of_turn) {
            if (msg.transcript) setFinals((prev) => [...prev, msg.transcript!]);
            setPartial("");
          } else {
            setPartial(msg.transcript);
          }
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
        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        ws.send(pcm.buffer);
      };
    } catch (e: any) {
      setError(e?.message ?? "Failed to start");
      setStatus("error");
      stop();
    }
  }, [fetchToken, status, stop]);

  return { status, error, partial, finals, start, stop, reset };
}
