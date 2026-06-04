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
  // Accumulates short turns until we have a real paragraph worth of text
  const paragraphBufRef = useRef<string>("");

  const fetchToken = useServerFn(getAssemblyAiToken);

  const flushBuffer = useCallback((setter: typeof setFinals) => {
    const buf = paragraphBufRef.current.trim();
    if (buf) {
      setter((prev) => [...prev, buf]);
      paragraphBufRef.current = "";
    }
  }, []);

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
    // Flush any remaining buffered text before clearing
    paragraphBufRef.current = "";
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
    paragraphBufRef.current = "";
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      setStatus("connecting");
      paragraphBufRef.current = "";

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

      // end_utterance_silence_threshold=1500 waits 1.5s of silence before ending
      // a turn — dramatically reduces word-by-word fragmentation.
      const ws = new WebSocket(
        `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&format_turns=true&speech_model=universal-streaming-english&end_utterance_silence_threshold=1500&token=${token}`
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

        if (msg.type === "Termination") {
          // Flush remaining buffer on session end
          const buf = paragraphBufRef.current.trim();
          if (buf) {
            setFinals((prev) => [...prev, buf]);
            paragraphBufRef.current = "";
          }
          return;
        }

        if (msg.type === "Turn" && typeof msg.transcript === "string") {
          if (msg.end_of_turn) {
            const t = msg.transcript.trim();
            if (!t) return;

            // Append to paragraph buffer
            paragraphBufRef.current = paragraphBufRef.current
              ? `${paragraphBufRef.current} ${t}`
              : t;

            // Flush to finals when we have a substantial paragraph:
            // at least 120 chars OR ends with strong punctuation AND >= 60 chars
            const buf = paragraphBufRef.current;
            const strongEnd = /[.!?]["']?\s*$/.test(buf);
            if (buf.length >= 120 || (strongEnd && buf.length >= 60)) {
              setFinals((prev) => [...prev, buf]);
              paragraphBufRef.current = "";
            }

            setPartial("");
          } else {
            setPartial(msg.transcript);
          }
        } else if ((msg as any).error) {
          setError((msg as any).error);
        }
      };

      ws.onerror = () => setError("Connection error");
      ws.onclose = () => {
        // Flush buffer on unexpected close
        const buf = paragraphBufRef.current.trim();
        if (buf) {
          setFinals((prev) => [...prev, buf]);
          paragraphBufRef.current = "";
        }
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
  }, [fetchToken, status, stop, flushBuffer]);

  return { status, error, partial, finals, start, stop, reset };
}
