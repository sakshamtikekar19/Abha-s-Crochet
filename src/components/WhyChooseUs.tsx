const features = [
  {
    icon: '🧶',
    title: '100% Handmade',
    description: 'Every piece is crafted by hand with meticulous attention to detail. No machines, just love and skill.',
  },
  {
    icon: '✨',
    title: 'Custom & Personalized',
    description: 'Make it yours. We offer customization options to create pieces that reflect your unique style and needs.',
  },
  {
    icon: '🎨',
    title: 'Premium Yarn Quality',
    description: 'We use only the finest yarns, ensuring your crochet pieces are soft, durable, and beautiful for years to come.',
  },
  {
    icon: '❤️',
    title: 'Made with Love',
    description: "Each creation carries the warmth and care of handmade craftsmanship. You're not just buying a product—you're receiving a piece of art.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-cream via-beige/80 to-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-slide-up animate-fill-both">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-dark mb-4 tracking-tight">
            Why Choose Us
          </h2>
          <div className="w-24 h-1 bg-gold-accent mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`bg-cream/90 backdrop-blur-sm p-8 rounded-xl border border-dusty-pink/30 shadow-sm hover:border-dusty-pink/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center animate-slide-up animate-fill-both ${
                i === 0 ? 'animate-delay-100' : i === 1 ? 'animate-delay-200' : i === 2 ? 'animate-delay-300' : 'animate-delay-400'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-dusty-pink/30 flex items-center justify-center text-2xl mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl font-semibold text-text-dark mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-text-light text-sm leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
