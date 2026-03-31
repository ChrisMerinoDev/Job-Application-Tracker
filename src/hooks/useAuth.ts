"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		let isMounted = true;

		// Get initial session
		supabase.auth.getUser().then(({ data: { user }, error }) => {
			if (isMounted) {
				if (error) {
					console.error("Auth error:", error);
				}
				setUser(user ?? null);
				setLoading(false);
			}
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (isMounted) {
				setUser(session?.user ?? null);
			}
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	const signUp = useCallback(
		async (email: string, password: string) => {
			const { error } = await supabase.auth.signUp({ email, password });
			if (error) throw error;
		},
		[supabase.auth],
	);

	const signIn = useCallback(
		async (email: string, password: string) => {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw error;
		},
		[supabase.auth],
	);

	const signInWithGoogle = useCallback(async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
		if (error) throw error;
	}, [supabase.auth]);

	const signOut = useCallback(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	}, [supabase.auth]);

	return { user, loading, signUp, signIn, signInWithGoogle, signOut };
}
