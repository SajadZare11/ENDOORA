"use client";

import { useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { endooraApi, EndooraApiError } from "@/lib/endoora-api";

type RoomCredentials = { token: string; server_url: string; is_teacher: boolean };

export function LiveClassroom({ sessionId, title }: { sessionId: string; title?: string }) {
  const [credentials, setCredentials] = useState<RoomCredentials | null>(null);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");

  async function join() {
    setJoining(true);
    setMessage("");
    try {
      const room = await endooraApi<RoomCredentials>("/live-classes/token/", {
        method: "POST",
        json: { session_id: sessionId },
      });
      setCredentials(room);
    } catch (error) {
      const denied = error instanceof EndooraApiError && [401, 403, 404].includes(error.status);
      setMessage(denied ? "برای ورود، با حساب عضو همین کلاس وارد شوید." : "ارتباط با سرویس کلاس برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <main dir="rtl" className="account-panel">
      <h1>{title || "کلاس آنلاین"}</h1>
      {message && <p role="status">{message}</p>}
      {credentials ? (
        <LiveKitRoom token={credentials.token} serverUrl={credentials.server_url}
          connect audio={false} video={false}
          data-lk-theme="default" style={{ height: "75dvh" }}
          onError={() => setMessage("ارتباط کلاس با خطا روبه‌رو شد. اتصال و مجوزهای دستگاه را بررسی کنید.")}
          onDisconnected={() => { setCredentials(null); setMessage("اتصال به کلاس پایان یافت."); }}>
          <VideoConference />
        </LiveKitRoom>
      ) : (
        <button type="button" disabled={joining} onClick={join}>
          {joining ? "در حال اتصال…" : "ورود به کلاس"}
        </button>
      )}
    </main>
  );
}
