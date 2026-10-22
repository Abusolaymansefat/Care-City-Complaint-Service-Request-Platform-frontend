"use client";

import { useEffect, useRef } from "react";
import { useGoogleOAuth } from "@react-oauth/google";
import { toast } from "sonner";
import { useGoogleAuth } from "@/hooks/useAuth";

type GoogleCredential = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredential) => void;
          }) => void;
          renderButton: (
            container: HTMLElement,
            options: { theme: "outline"; size: "large"; text: "continue_with"; width: number },
          ) => void;
        };
      };
    };
    __citycareGoogleInitialized?: boolean;
    __citycareGoogleCredentialHandler?: (credential: string) => void;
    __citycareGoogleClientId?: string;
  }
}

export default function GoogleButton() {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const { mutate } = useGoogleAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const credentialHandlerRef = useRef(mutate);

  useEffect(() => {
    if (!clientId) return;
    if (!scriptLoadedSuccessfully) return;

    const container = containerRef.current;
    if (!container) return;

    const googleId = window.google?.accounts.id;
    if (!googleId) {
      toast.error("Google sign-in could not initialize. Please reload and try again.");
      return;
    }

    if (window.__citycareGoogleInitialized && window.__citycareGoogleClientId !== clientId) {
      toast.error("Google sign-in configuration changed. Please reload the page.");
      return;
    }

    credentialHandlerRef.current = mutate;
    window.__citycareGoogleCredentialHandler = (credential) => credentialHandlerRef.current(credential);

    if (!window.__citycareGoogleInitialized) {
      googleId.initialize({
        client_id: clientId,
        callback: ({ credential }) => {
          if (credential) window.__citycareGoogleCredentialHandler?.(credential);
          else toast.error("Google login failed");
        },
      });
      window.__citycareGoogleInitialized = true;
      window.__citycareGoogleClientId = clientId;
    }

    googleId.renderButton(container, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: 320,
    });

    return () => {
      window.__citycareGoogleCredentialHandler = undefined;
      container.replaceChildren();
    };
  }, [clientId, mutate, scriptLoadedSuccessfully]);

  if (!clientId) {
    return <p className="text-center text-sm text-muted-foreground">Google sign-in is not configured.</p>;
  }

  return (
    <div className="flex justify-center">
      <div ref={containerRef} />
    </div>
  );
}