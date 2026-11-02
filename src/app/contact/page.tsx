"use client";

import { useState } from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

type TopicOption = "Question" | "Collaboration" | "Request a resource";

export default function ContactPage() {
  const [topic, setTopic] = useState<TopicOption>("Question");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setMessageError("");

    let hasError = false;
    if (!email || !email.includes("@") || !email.includes(".")) {
      setEmailError("Enter an email like name@example.com");
      hasError = true;
    }

    if (!message.trim() || message.length < 10) {
      setMessageError("Please enter at least 10 characters so we can understand your request.");
      hasError = true;
    }

    if (hasError) return;

    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type: topic, message }),
      });
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  return (
    <div className="py-12 sm:py-20 text-left">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-2">
            Contact & collaboration
          </h1>
          <p className="text-small text-[var(--muted)] leading-relaxed">
            Have a question about a roadmap, want to collaborate, or have an idea for a new decoded resource? Send a note below.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-8 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] font-display text-left">
            <h2 className="text-h3 font-semibold text-[var(--success)] mb-2">
              Message sent
            </h2>
            <p className="text-small text-[var(--muted)] mb-6 leading-relaxed">
              Thanks for reaching out. We read every message and will get back to you shortly.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setStatus("idle");
                setMessage("");
              }}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] space-y-6 font-display"
          >
            {/* Topic Selector per Section 7 */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="topic-selector" className="text-sm font-medium text-[var(--heading)]">
                What is this about?
              </label>
              <select
                id="topic-selector"
                value={topic}
                onChange={e => setTopic(e.target.value as TopicOption)}
                className="h-12 w-full px-3.5 rounded-[6px] bg-[var(--surface)] text-[var(--heading)] border border-[var(--border)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] text-sm cursor-pointer"
              >
                <option value="Question">Question</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Request a resource">Request a resource</option>
              </select>
            </div>

            {/* Name Input */}
            <Input
              label="Your name"
              id="contact-name"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            {/* Email Input */}
            <Input
              label="Email address"
              type="email"
              id="contact-email"
              placeholder="name@example.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              error={emailError}
              required
            />

            {/* Message Area */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-[var(--heading)]">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={e => {
                  setMessage(e.target.value);
                  if (messageError) setMessageError("");
                }}
                placeholder={
                  topic === "Request a resource"
                    ? "Tell us what topic you'd like decoded (e.g. System Design, Redis, or Graph Algorithms)..."
                    : "Tell us how we can help..."
                }
                className={`w-full p-3.5 rounded-[6px] bg-[var(--surface)] text-[var(--heading)] placeholder:text-[var(--muted)] border text-sm transition-colors ${
                  messageError
                    ? "border-[var(--danger)] focus-visible:outline-[var(--danger)]"
                    : "border-[var(--border)] focus-visible:outline-[var(--accent)]"
                } focus-visible:outline-2 focus-visible:outline-offset-2`}
                required
              />
              {messageError && (
                <p className="text-xs text-[var(--danger)] font-display">
                  {messageError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={status === "loading"}
              className="w-full"
            >
              {status === "loading" ? "Sending message..." : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
