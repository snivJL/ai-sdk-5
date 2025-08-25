import { Chat } from "@/components/chat/chat";
import { generateUUID } from "@/lib/utils";
import { auth } from "../(auth)/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }
  const id = generateUUID();

  return <Chat key={id} id={id} session={session} initialMessages={[]} />;
}
