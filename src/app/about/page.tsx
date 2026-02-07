import Link from 'next/link';
import AboutPhoto from '@/components/AboutPhoto';

export default function About() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-text-dark mb-3 tracking-tight">
            Abha Tikekar
          </h1>
          <p className="font-display text-2xl md:text-3xl text-gold-accent mb-4">A Story Woven with Love</p>
          <div className="w-24 h-1 bg-gold-accent mx-auto mb-8" />
        </div>
        <div className="max-w-2xl mx-auto">
          <p className="text-text-light mb-6 leading-relaxed font-light text-lg">
            From the quiet corners of her home in Dombivli, Abha Tikekar began her crochet journey with no training, no shortcuts—only patience, courage, and a dream in her hands. As a homemaker, her days were filled with caring for family, yet she found moments to create, stitch by stitch, believing in herself even when the path was uncertain.
          </p>
          <p className="text-text-light mb-6 leading-relaxed font-light text-lg">
            What started as a simple experiment slowly bloomed into something beautiful. Today, Abha has created 20+ unique crochet pieces, each carrying warmth, emotion, and countless hours of dedication. Every creation tells a story of perseverance, self-belief, and a woman who chose to follow her passion without giving up her responsibilities.
          </p>
          <div className="my-10 flex justify-center">
            <AboutPhoto />
          </div>
          <p className="text-text-light mb-8 leading-relaxed font-light text-lg">
            Abha Tikekar is not just a creator—she is a reminder that strength, creativity, and dreams can quietly grow at home, and still touch many hearts.
          </p>
          <p className="font-heading text-xl text-text-dark italic text-center font-medium mb-10">
            A true superwoman, weaving love into every stitch.
          </p>
        </div>
        <div className="text-center">
          <Link href="/collection" className="btn-primary">
            View Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
