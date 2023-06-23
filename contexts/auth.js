import { useRouter, useSegments } from "expo-router";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

// This hook can be used to access the user info.
export function useAuth() {
    return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
export function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        console.log(`useProtectedRoute useEffect called`);
        const inAuthGroup = segments[0] === "(authentication)"
        // User is not signed in and initial segment is not in auth group
        if (!user && !inAuthGroup) {
            // Redirect to index.js to onboarding screen
            console.log(`inAuthGroup: ${inAuthGroup}`);
            router.replace("/");
        } else if (user && inAuthGroup) {
            if (segments[1] === "CreateAccount") {
                router.replace("/(authentication)/AccountCreated");
            } else if (segments[1] === "Login") {
                router.replace("/(home)/Expenses/")
            }
        }
    }, [user, segments, router]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useProtectedRoute(user);

  useEffect(() => {
      console.log(`AuthProvider useEffect called`);
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
          console.log(`onAuthStateChange event: ${event}`);
          if (event === "SIGNED_IN") {
              setUser(session.user);
          } else if (event === "SIGNED_OUT") {
              setUser(null);
          }
      })

      return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</ AuthContext.Provider>
}



