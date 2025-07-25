import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Welcome } from "@/components/welcome";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/auth");
  }
  return <Welcome />;
}