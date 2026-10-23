'use client';

import React, { useState, useEffect, useRef } from "react";
import styles from "./classroom-studio.module.css";

interface StudioVideoStageProps {
  teacherName: string;
  learnerName: string;
  role: "teacher" | "learner";
}

export function StudioVideoStage({
  teacherName,
  learnerName,
  role,
}: StudioVideoStageProps) {
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [hasMediaAccess, setHasMediaAccess] = useState(false);
  const [audioMeterLevels, setAudioMeterLevels] = useState<number[]>([12, 18, 25, 14, 8]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize browser camera/microphone
  useEffect(() => {
    let active = true;

    async function initMedia() {
      try {
        if (typeof navigator !== "undefined" && navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (!active) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasMediaAccess(true);
        }
      } catch {
        // Fallback demo mode if permission denied or no hardware
        setHasMediaAccess(false);
      }
    }

    initMedia();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Simulate audio level pulse
  useEffect(() => {
    if (micMuted) {
      setAudioMeterLevels([4, 4, 4, 4, 4]);
      return;
    }
    const interval = setInterval(() => {
      const levels = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 24 + 6)
      );
      setAudioMeterLevels(levels);
    }, 150);
    return () => clearInterval(interval);
  }, [micMuted]);

  const toggleMic = () => {
    const nextState = !micMuted;
    setMicMuted(nextState);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !nextState;
      });
    }
  };

  const toggleCamera = () => {
    const nextState = !cameraOff;
    setCameraOff(nextState);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !nextState;
      });
    }
  };

  const toggleScreenShare = async () => {
    if (screenSharing) {
      setScreenSharing(false);
      // revert back to camera
      if (streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
          setScreenSharing(true);
          if (videoRef.current) {
            videoRef.current.srcObject = screenStream;
          }
          screenStream.getVideoTracks()[0].onended = () => {
            setScreenSharing(false);
            if (streamRef.current && videoRef.current) {
              videoRef.current.srcObject = streamRef.current;
            }
          };
        }
      } catch {
        // user cancelled screen share prompt
      }
    }
  };

  return (
    <aside className={styles.leftPane} aria-label="بخش پخش زنده و کنترل‌های مالتی‌مدیا">
      {/* Teacher Video Feed Card */}
      <div className={styles.videoFeedCard}>
        <div className={styles.videoWindow}>
          <div className={styles.avatarFallback}>
            <div className={styles.avatarCircle}>👨‍🏫</div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
              {teacherName.split("(")[0]}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              استاد راهنمای آیلتس و مکالمه
            </span>
          </div>

          <div className={styles.videoOverlayBadge}>
            <span style={{ color: "#22c55e" }}>●</span>
            <span>استاد (آنلاین)</span>
            <div className={styles.soundWaveMini}>
              <div className={styles.soundWaveBar} style={{ height: "100%" }} />
              <div className={styles.soundWaveBar} style={{ height: "60%" }} />
              <div className={styles.soundWaveBar} style={{ height: "80%" }} />
            </div>
          </div>
        </div>

        <div className={styles.videoControlBar}>
          <span className={styles.feedIdentity}>{teacherName.split(" ")[0]} {teacherName.split(" ")[1]}</span>
          <div className={styles.feedActions}>
            <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>
              کیفیت: 1080p HD
            </span>
          </div>
        </div>
      </div>

      {/* Learner Video Feed Card */}
      <div className={styles.videoFeedCard}>
        <div className={styles.videoWindow}>
          {hasMediaAccess && !cameraOff ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={styles.videoElement}
            />
          ) : (
            <div className={styles.avatarFallback}>
              <div
                className={styles.avatarCircle}
                style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}
              >
                🧑‍🎓
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                {learnerName}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {cameraOff ? "تصویر دوربین خاموش است" : "حالت شبیه‌ساز دانشجو"}
              </span>
            </div>
          )}

          <div className={styles.videoOverlayBadge}>
            <span style={{ color: micMuted ? "#ef4444" : "#22c55e" }}>●</span>
            <span>{role === "learner" ? "شما (زبان‌آموز)" : learnerName}</span>
            {!micMuted && (
              <div className={styles.soundWaveMini}>
                <div
                  className={styles.soundWaveBar}
                  style={{ height: `${audioMeterLevels[0]}px` }}
                />
                <div
                  className={styles.soundWaveBar}
                  style={{ height: `${audioMeterLevels[2]}px` }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.videoControlBar}>
          <span className={styles.feedIdentity}>
            {role === "learner" ? "دوربین و میکروفون شما" : "تصویر زبان‌آموز"}
          </span>
          <div className={styles.feedActions}>
            <button
              type="button"
              className={`${styles.feedActionBtn} ${micMuted ? styles.feedActionBtnActive : ""}`}
              onClick={toggleMic}
              title={micMuted ? "وصل کردن میکروفون" : "قطع میکروفون"}
            >
              {micMuted ? "🔇 وصل میکروفون" : "🎤 قطع صدا"}
            </button>
            <button
              type="button"
              className={`${styles.feedActionBtn} ${cameraOff ? styles.feedActionBtnActive : ""}`}
              onClick={toggleCamera}
              title={cameraOff ? "روشن کردن دوربین" : "خاموش کردن دوربین"}
            >
              {cameraOff ? "📷 روشن تصویر" : "🚫 قطع تصویر"}
            </button>
            <button
              type="button"
              className={`${styles.feedActionBtn} ${screenSharing ? styles.feedActionBtnActive : ""}`}
              onClick={toggleScreenShare}
              title="اشتراک‌گذاری صفحه"
            >
              🖥️ {screenSharing ? "توقف اسکرین" : "اشتراک صفحه"}
            </button>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Card */}
      <div className={styles.deviceTelemetryCard}>
        <div className={styles.telemetryRow}>
          <span>پایش سیگنال صوتی (Audio Input):</span>
          <div className={styles.audioMeterBar}>
            {audioMeterLevels.map((lvl, i) => (
              <div
                key={i}
                className={styles.meterUnit}
                style={{
                  height: `${lvl}px`,
                  background: lvl > 20 ? "#ef4444" : lvl > 14 ? "#f59e0b" : "#22c55e",
                }}
              />
            ))}
          </div>
        </div>
        <div className={styles.telemetryRow}>
          <span>پایداری اتصال سرور ایندورا:</span>
          <span style={{ color: "#22c55e", fontWeight: 700 }}>عالی (24ms)</span>
        </div>
      </div>
    </aside>
  );
}
