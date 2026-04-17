"use client";

import { useState } from "react";

export function ShareButtons({
  readingId,
}: {
  readingId: string | null;
}) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!readingId) return null;

  const handleShare = async () => {
    setLoading(true);
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readingId }),
    });
    const data = await res.json();
    setShareUrl(data.shareUrl);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    let url = shareUrl;
    if (!url) {
      setLoading(true);
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId }),
      });
      const data = await res.json();
      url = data.shareUrl;
      setShareUrl(url);
      setLoading(false);
    }
    if (navigator.share && url) {
      navigator.share({ title: "คำทำนายจากดูยิปซี", url });
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {!shareUrl ? (
        <button
          onClick={handleShare}
          disabled={loading}
          className="btn-cosmic px-6 py-2.5 text-sm cursor-pointer"
        >
          <span>
            {loading ? "กำลังสร้างลิงก์..." : "🔗 แชร์คำทำนาย"}
          </span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="rounded-full px-4 py-2 text-sm bg-cosmic-700/50 hover:bg-cosmic-600/50 text-cosmic-200 transition-colors cursor-pointer"
            >
              {copied ? "✅ คัดลอกแล้ว!" : "📋 คัดลอกลิงก์"}
            </button>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="rounded-full px-4 py-2 text-sm bg-cosmic-700/50 hover:bg-cosmic-600/50 text-cosmic-200 transition-colors cursor-pointer"
              >
                📤 แชร์
              </button>
            )}
          </div>
          <p className="text-xs text-cosmic-200/40 break-all">{shareUrl}</p>
        </div>
      )}
    </div>
  );
}
