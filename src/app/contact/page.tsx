'use client';

import { useState } from 'react';
import { config } from '@/lib/config';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <section className="py-20 px-4 bg-beige/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-text-dark mb-4 tracking-tight">
              Custom Orders
            </h1>
            <div className="w-24 h-1 bg-gold-accent mx-auto mb-6" />
            <p className="text-text-light max-w-2xl mx-auto">
              Have something special in mind? Let&apos;s bring your vision to life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: 1,
                title: 'Choose',
                description: 'Browse our collection or describe your custom idea. Share your preferences for style, color, and size.',
              },
              {
                step: 2,
                title: 'Customize',
                description: "We'll discuss details, colors, and personalization options. Every detail matters to create your perfect piece.",
              },
              {
                step: 3,
                title: 'Order',
                description: 'Place your order via WhatsApp or Instagram. We\'ll confirm timelines and keep you updated throughout the process.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-cream p-8 rounded-lg shadow-md text-center">
                  <div className="w-12 h-12 rounded-full bg-gold-accent/20 flex items-center justify-center mx-auto mb-4 font-heading text-xl font-semibold text-text-dark">
                    {item.step}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-text-dark mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed">{item.description}</p>
                </div>
                {item.step < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-dusty-pink -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              href={config.whatsapp.getHrefWithMessage(config.whatsapp.defaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Start Your Custom Order
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-dark mb-4 tracking-tight">
              Get in Touch
            </h2>
            <div className="w-24 h-1 bg-gold-accent mx-auto mb-6" />
            <p className="text-text-light max-w-2xl mx-auto">
              Ready to order or have questions? We&apos;d love to hear from you.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-cream p-8 rounded-lg shadow-md">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-heading text-xl font-semibold text-text-dark mb-3">
                  WhatsApp
                </h3>
                <p className="text-text-light mb-4">
                  Chat with us directly for quick responses and easy ordering.
                </p>
                <a
                  href={config.whatsapp.getHrefWithMessage(config.whatsapp.defaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Message Us
                </a>
              </div>
              <div className="bg-cream p-8 rounded-lg shadow-md">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="font-heading text-xl font-semibold text-text-dark mb-3">
                  Instagram
                </h3>
                <p className="text-text-light mb-4">
                  Follow us for latest creations, behind-the-scenes, and inspiration.
                </p>
                <a
                  href={config.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Follow Us
                </a>
              </div>
            </div>
            <div className="bg-cream p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-dusty-pink/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-dusty-pink/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent/50"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-dusty-pink/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent/50 resize-none"
                    placeholder="Tell us about your custom order or question..."
                  />
                </div>
                {submitted ? (
                  <p className="text-sage-green font-medium">Thank you! We&apos;ll get back to you soon.</p>
                ) : (
                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
