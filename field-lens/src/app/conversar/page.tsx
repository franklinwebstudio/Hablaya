"use client";

import { useRouter } from "next/navigation";
import { ConversationApp } from "../../components/ConversationApp";

export default function ConversarPage() {
  const router = useRouter();
  return <ConversationApp onBack={() => router.push("/")} />;
}
