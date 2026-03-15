"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

const EMOJIS = [
  "😀","😂","😍","🥰","😎","🤔","😅","🙏","👍","👎",
  "🔥","❤️","✅","⚡","🎉","💯","😭","🤣","😊","😢",
  "👏","🚀","💡","⭐","🎯","💪","🙌","😤","🤯","😱",
];

interface MessageUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: MessageUser;
}

const ROOMS = ["general", "design", "engineering", "random"];

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState("general");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load history when room changes
  useEffect(() => {
    setMessages([]);
    fetch(`/api/chat/send?roomId=${roomId}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []));
  }, [roomId]);

  // Pusher subscription
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${roomId}`);
    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${roomId}`);
      pusher.disconnect();
    };
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim(), roomId }),
    });
    setInput("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const initials = (name: string | null) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#0f0e1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #2e2b45; border-radius: 4px; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#0a0814", borderRight: "1px solid #1e1b30", display: "flex", flexDirection: "column", padding: "1.5rem 0" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#6c5ce7", padding: "0 1.25rem 1.5rem" }}>Nexus</div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#4a4870", padding: "0 1.25rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Channels</div>
        {ROOMS.map((room) => (
          <button
            key={room}
            onClick={() => setRoomId(room)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 1.25rem",
              background: roomId === room ? "rgba(108,92,231,0.15)" : "transparent",
              border: "none", cursor: "pointer", color: roomId === room ? "#a29bfe" : "#6b6b8a",
              fontSize: 14, fontWeight: roomId === room ? 500 : 400, fontFamily: "'DM Sans', sans-serif",
              borderLeft: roomId === room ? "2px solid #6c5ce7" : "2px solid transparent",
              transition: "all .15s",
            }}
          >
            <span style={{ opacity: 0.5 }}>#</span> {room}
          </button>
        ))}

        {session?.user && (
          <div style={{ marginTop: "auto", padding: "1rem 1.25rem", borderTop: "1px solid #1e1b30", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce7,#e84393)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {initials(session.user.name ?? null)}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#c4c0e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{session.user.name}</div>
              <div style={{ fontSize: 11, color: "#4a4870" }}>Online</div>
            </div>
          </div>
        )}
      </div>

      {/* Main chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1e1b30", background: "#0a0814", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#4a4870", fontSize: 18 }}>#</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e0deff", fontSize: 16 }}>{roomId}</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#4a4870", fontSize: 13, marginTop: "4rem" }}>
              No messages yet. Say hello!
            </div>
          )}
          {messages.map((msg, i) => {
            const prevMsg = messages[i - 1];
            const sameUser = prevMsg?.user?.id === msg.user?.id;
            return (
              <div key={msg.id} style={{ display: "flex", gap: 12, marginBottom: sameUser ? 4 : 16, alignItems: "flex-start" }}>
                {!sameUser ? (
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce7,#e84393)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, marginTop: 2 }}>
                    {initials(msg.user?.name ?? null)}
                  </div>
                ) : (
                  <div style={{ width: 34, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  {!sameUser && (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#a29bfe" }}>{msg.user?.name || "Unknown"}</span>
                      <span style={{ fontSize: 11, color: "#4a4870" }}>{formatTime(msg.createdAt)}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 14, color: "#c4c0e8", lineHeight: 1.5, background: "transparent" }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1e1b30", background: "#0a0814" }}>
          {/* Attachment preview */}
          {attachment && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: "#1a1830", borderRadius: 8, padding: "6px 12px", border: "1px solid #2e2b45" }}>
              <span style={{ fontSize: 16 }}>📎</span>
              <span style={{ fontSize: 12, color: "#a29bfe", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{attachment.name}</span>
              <button onClick={() => setAttachment(null)} style={{ background: "none", border: "none", color: "#4a4870", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
            </div>
          )}

          <div style={{ position: "relative", display: "flex", gap: 10, alignItems: "center", background: "#1a1830", borderRadius: 12, padding: "10px 14px", border: "1px solid #2e2b45" }}>
            {/* Attachment button */}
            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} />
            <button
              onClick={() => fileRef.current?.click()}
              title="Attach file"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#4a4870", fontSize: 18, display: "flex", alignItems: "center", padding: 0, transition: "color .15s", flexShrink: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#a29bfe"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#4a4870"; }}
            >📎</button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${roomId}`}
              disabled={!session}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e0deff", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
            />

            {/* Emoji button + picker */}
            <div ref={emojiRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setShowEmoji((v) => !v)}
                title="Emoji"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", padding: 0, transition: "transform .15s", color: showEmoji ? "#a29bfe" : "unset" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >😊</button>

              {showEmoji && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 10px)", right: 0,
                  background: "#1a1830", border: "1px solid #2e2b45", borderRadius: 12,
                  padding: 10, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)", zIndex: 100, width: 210,
                }}>
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      onClick={() => { setInput((v) => v + em); setShowEmoji(false); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, borderRadius: 6, padding: "4px", transition: "background .1s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,92,231,0.2)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                    >{em}</button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending || !session}
              style={{ background: "linear-gradient(135deg,#6c5ce7,#e84393)", border: "none", borderRadius: 8, padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: !input.trim() || !session ? 0.4 : 1, transition: "opacity .15s", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}
            >Send</button>
          </div>
          {!session && <div style={{ fontSize: 12, color: "#4a4870", marginTop: 6, textAlign: "center" }}>Please log in to send messages</div>}
        </div>
      </div>
    </div>
  );
}
