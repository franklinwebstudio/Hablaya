"use client";

import { useState } from "react";
import { ConversationApp } from "../components/ConversationApp";
import { Landing } from "../components/Landing";

export default function HomePage() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <ConversationApp onBack={() => setStarted(false)} />;
  }

  return <Landing onStart={() => setStarted(true)} />;
}
