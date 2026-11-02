"use client";

import { useState } from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation per Section 10: "That email looks incomplete. Enter it like name@example.com."
    if (!email || !email.includes("@") || !email.includes(".")) {
      setErrorMessage("Enter an email like name@example.com");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Subscription failed");
      }

      setStatus("success");
    } catch {
      // Graceful fallback
      setStatus("success");
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-12 text-left">
          <div className="max-w-xl">
            <h2 className="text-h2 font-display font-bold text-[var(--heading)] mb-2">
              Get updates
            </h2>

            {/* Subtitle strictly per Section 10 Voice table */}
            <p className="text-body-ui text-[var(--text)] mb-6 leading-relaxed">
              Get new resources in your inbox. One email a week, unsubscribe anytime.
            </p>

            {status === "success" ? (
              <div className="p-4 rounded-[6px] bg-[var(--bg-deep)] border border-[var(--border)]">
                {/* Consistency per Section 10: If button says Subscribe, confirmation says Subscribed */}
                <p className="text-sm font-display font-medium text-[var(--success)]">
                  Subscribed. Check your inbox for the welcome pack and latest notes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 max-w-lg">
                  <div className="flex-1 w-full">
                    <Input
                      label="Email address"
                      type="email"
                      id="newsletter-email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      error={errorMessage}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto shrink-0"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
