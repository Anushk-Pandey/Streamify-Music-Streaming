import React, { useEffect, useRef, useState } from "react";
import { Send, Music, Play, Radio, Users, Sparkles } from "lucide-react";
import { useChatStore, Message } from "../store/useChatStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useAuthStore } from "../store/useAuthStore";

export const ChatPage: React.FC = () => {
  const { messages, fetchMessages, sendMessage, onlineUsers, syncPartyTrack } = useChatStore();
  const { currentSong, playSong } = usePlayerStore();
  const { user } = useAuthStore();
  const [text, setText] = useState("");
  const [attachSong, setAttachSong] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !attachSong) return;
    sendMessage(
      text.trim() || (attachSong && currentSong ? `Vibing to ${currentSong.title}!` : ""),
      attachSong && currentSong ? currentSong : undefined
    );
    if (attachSong && currentSong) syncPartyTrack(currentSong);
    setText("");
    setAttachSong(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-13rem)] flex flex-col p-4 md:p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl m-4 backdrop-blur-xl">
      {/* Room Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Collaborative Listening Lounge</h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Socket.IO Real-Time • {onlineUsers.length} Active Listeners
            </p>
          </div>
        </div>

        {currentSong && (
          <button
            onClick={() => syncPartyTrack(currentSong)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            Sync Track
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-2">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-zinc-600" />
            <span>No messages yet. Say hello or share what you're listening to!</span>
          </div>
        ) : (
          messages.map((msg: Message) => {
            const isMe = msg.senderId === user?.clerkId;
            return (
              <div key={msg._id} className={`flex flex-col max-w-md ${isMe ? "ml-auto items-end" : "items-start"}`}>
                <span className="text-[10px] text-zinc-500 mb-1 px-1">
                  {isMe ? "You" : msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className={`p-3 rounded-2xl text-xs ${isMe ? "bg-emerald-500 text-black font-medium" : "bg-zinc-800 text-zinc-200 border border-zinc-700/60"}`}>
                  {msg.content}
                  {msg.sharedSong && (
                    <div
                      onClick={() => playSong(msg.sharedSong!)}
                      className={`mt-2 p-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer ${isMe ? "bg-black/20 text-black" : "bg-zinc-900 text-white border border-zinc-700"}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={msg.sharedSong.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div className="truncate">
                          <p className="font-bold text-xs truncate">{msg.sharedSong.title}</p>
                          <p className="text-[10px] opacity-80 truncate">{msg.sharedSong.artist}</p>
                        </div>
                      </div>
                      <Play className="w-4 h-4 fill-current flex-shrink-0" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="pt-3 border-t border-zinc-800 flex items-center gap-2">
        {currentSong && (
          <button
            type="button"
            onClick={() => setAttachSong(!attachSong)}
            title="Attach currently playing track"
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${attachSong ? "bg-emerald-500 text-black border-emerald-400" : "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
          >
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Attach Track</span>
          </button>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts or vibe with other listeners..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!text.trim() && !attachSong}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold disabled:opacity-40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
