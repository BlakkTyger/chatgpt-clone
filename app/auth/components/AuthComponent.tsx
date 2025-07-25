"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";

export default function AuthComponent() {
	const handleLoginWithGithub = () => {
		supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			},
		});
	};

	return (
		<div className=" w-full h-screen flex justify-center items-center">
			<div className="w-96 border shadow-sm p-5 rounded-sm space-y-3">
				<h1 className=" font-bold text-lg">
					{"ChatGPT Clone"}
				</h1>
				<p className="text-sm">
					{
						"It is platform that build using NextJS, NodeJS, Supabase and LLM APIs to create a ChatGPT like chatbot."
					}
				</p>
				<Button
					className="w-full bg-indigo-500"
					onClick={handleLoginWithGithub}
				>
					Login With Github
				</Button>
			</div>
		</div>
	);
}