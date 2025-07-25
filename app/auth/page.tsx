import React from "react";
import AuthComponent from "./components/AuthComponent";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function page() {
	const supabase = await createClient();
	const { data } = await supabase.auth.getSession();

	if (data.session) {
		return redirect("/");
	}

	return <AuthComponent />;
}