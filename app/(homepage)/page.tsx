// app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Welcome } from "@/components/welcome"; // We'll create this component

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Middleware should already handle this, but it's good practice
  if (!session) {
    return redirect("/auth");
  }

  // This page will now just show a welcome message.
  // The logic to start a chat is moved to the sidebar.
  return <Welcome />;
}