import React, { createContext, useContext, useState, ReactNode } from "react";

interface StreamerContextValue {
  nick: string;
  setNick: (nick: string) => void;
}

// Контекст хранения ника Twitch-канала с сохранением в localStorage
const StreamerContext = createContext<StreamerContextValue | null>(null);

export const StreamerProvider = ({ children }: { children: ReactNode }) => {
  const [nick, setNickState] = useState(() => localStorage.getItem("streamer_nick") || "");

  const setNick = (newNick: string) => {
    const trimmed = newNick.trim();
    setNickState(trimmed);
    localStorage.setItem("streamer_nick", trimmed);
  };

  return (
    <StreamerContext.Provider value={{ nick, setNick }}>{children}</StreamerContext.Provider>
  );
};

export const useStreamer = () => {
  const ctx = useContext(StreamerContext);
  if (!ctx) throw new Error("useStreamer must be used within StreamerProvider");
  return ctx;
};