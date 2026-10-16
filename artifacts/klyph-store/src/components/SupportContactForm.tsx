'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export default function SupportContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('sizing');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate real concierge dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="support-form-success" role="status" aria-live="polite">
        <div className="form-success-icon">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>
        <h3>Inquiry Dispatched to Concierge</h3>
        <p>
          Thank you, <strong>{name}</strong>. Your request regarding{' '}
          <strong>{topic === 'sizing' ? 'Ring Sizing' : topic === 'order' ? 'Order Status' : topic === 'tech' ? 'Hardware Diagnostics' : 'Returns & Exchanges'}</strong>{' '}
          has been routed to our senior hardware concierge.
        </p>
        <span className="form-success-note">
          We will review your telemetry query and reply to <strong>{email}</strong> within 12 hours.
        </span>
        <button
          type="button"
          className="button-secondary"
          onClick={() => {
            setIsSubmitted(false);
            setMessage('');
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="support-contact-form" onSubmit={handleSubmit} noValidate>
      <div className="support-form-grid">
        <div className="form-field">
          <label htmlFor="support-name">Your Full Name</label>
          <input
            id="support-name"
            type="text"
            required
            placeholder="e.g. Elena Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="support-input"
            autoComplete="name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="support-email">Email Address</label>
          <input
            id="support-email"
            type="email"
            required
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="support-input"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="support-topic">Inquiry Topic</label>
        <select
          id="support-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="support-select"
        >
          <option value="sizing">Ring Sizing &amp; Measurement Calibration</option>
          <option value="order">Order Status &amp; Air Courier Tracking</option>
          <option value="tech">Hardware Diagnostics &amp; PPG Telemetry</option>
          <option value="returns">30-Day Fit Guarantee &amp; Exchanges</option>
          <option value="warranty">2-Year Hardware Warranty Service</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="support-message">How can our concierge engineers assist you?</label>
        <textarea
          id="support-message"
          required
          rows={4}
          placeholder="Please describe your sizing question, order details, or hardware questions…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="support-textarea"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
        className="button-primary support-submit-btn"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="button-spinner" aria-hidden="true" />
            <span>Dispatching to Concierge…</span>
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            <span>Send Concierge Inquiry</span>
          </>
        )}
      </button>
    </form>
  );
}
