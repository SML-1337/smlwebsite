/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Hammer, 
  Cpu,
  Lightbulb, 
  Droplets, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight,
  Menu,
  X,
  Star,
  CheckCircle2,
  Shield,
  Square,
  Wrench,
  Filter,
  Mountain,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const services = [
  {
    title: "General Repairs & Painting",
    description: "Expert fixes for everything from cabinets to full room painting and touch-ups. Expert in creating punchlists and closing them out.",
    icon: Hammer,
  },
  {
    title: "Technical & Safety",
    description: "Smart home setup, Home theater audio and visual, security system installs, and smoke detector safety upgrades.",
    icon: Cpu,
  },
  {
    title: "Lockout Services",
    description: "Emergency home and automobile lockout assistance, available when you need it most.",
    icon: Key,
  },
  {
    title: "Waterproofing",
    description: "Basement and foundation waterproofing, full envelope solutions, and finish glazing to protect your home from moisture.",
    icon: Shield,
  },
  {
    title: "Framing & Structural",
    description: "Structural framing for additions, renovations, new builds, and professional window and door installation.",
    icon: Square,
  },
  {
    title: "Hardscape & Pergolas",
    description: "Custom stone walkways, patios, retaining walls, beautiful pergolas, repointing, and light masonry.",
    icon: Mountain,
  },
];

const testimonials = [
  {
    name: "Alen Hasanic",
    text: "Knowledgeable, on time, on the clock, gets it done!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    text: "Fixed my kitchen sink in under an hour. Very fair pricing and great attitude.",
    rating: 5,
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus('success');
      } else {
        throw new Error(result.details || result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('idle');
      
      const message = error instanceof Error ? error.message : 'Failed to send message';
      
      // Use a more readable alert for long error messages
      if (message.includes('App Password')) {
        alert(`🚨 ACTION REQUIRED: GMAIL SETUP 🚨\n\n${message}`);
      } else {
        alert(`Error: ${message}. Please ensure your email settings are configured in the Secrets panel.`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-orange selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-brand-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-brand-orange p-2 rounded-lg flex gap-1">
                <Hammer className="text-white w-5 h-5" />
                <Cpu className="text-white w-5 h-5" />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">
                SPLIT SECOND<span className="text-brand-orange"> SERVICES</span>
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Services', 'About', 'Testimonials', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors"
                >
                  {item}
                </a>
              ))}
              <a 
                href="#contact" 
                className="bg-brand-orange text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform active:scale-95"
              >
                Get a Quote
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-black border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {['Services', 'About', 'Testimonials', 'Contact'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-brand-orange"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#FF6321_0%,transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest mb-6">
                <CheckCircle2 className="w-4 h-4" />
                Trusted Local Professional
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-8">
                WE FIX WHAT <br />
                <span className="text-brand-orange">OTHERS CAN'T.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg mb-10 leading-relaxed">
                Premium handyman services for your home and office. Reliable, efficient, and built on a foundation of quality craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contact" 
                  className="bg-brand-orange text-white px-8 py-4 rounded-full font-black text-lg hover:shadow-[0_0_30px_rgba(255,99,33,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                  Book Estimate
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#services" 
                  className="border border-white/20 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-white/5 transition-all text-center"
                >
                  Our Services
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border-4 border-brand-orange/30 shadow-2xl relative group">
                <img 
                  src="https://raw.githubusercontent.com/SML-1337/smlwebsite/main/manchester.jpg" 
                  alt="Manchester NH Skyline"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1620127252536-03bdfcf6d5c3?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-brand-black/80 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-orange p-3 rounded-xl">
                      <Phone className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Emergency Service</p>
                      <p className="text-white font-black text-xl">(603) 722-3494</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.2em] mb-4">What We Do</h2>
            <p className="text-4xl lg:text-5xl font-black text-brand-black tracking-tight">
              COMPLETE HOME SOLUTIONS
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-gray-50 hover:bg-brand-black transition-all duration-500 border border-transparent hover:border-brand-orange/30"
              >
                <div className="bg-brand-orange/10 group-hover:bg-brand-orange p-4 rounded-2xl inline-block mb-6 transition-colors">
                  <service.icon className="w-8 h-8 text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-white transition-colors">{service.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-400 transition-colors leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-brand-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://raw.githubusercontent.com/SML-1337/smlwebsite/main/mountain.jpg" 
                alt="Old Man of the Mountain"
                className="rounded-3xl shadow-2xl border border-white/10 w-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/OldManMountain.jpg/800px-OldManMountain.jpg";
                }}
              />
              <div className="absolute -bottom-8 -right-8 bg-brand-orange p-8 rounded-3xl shadow-2xl hidden md:block">
                <p className="text-5xl font-black">15+</p>
                <p className="text-sm font-bold uppercase tracking-widest opacity-80">Years Experience</p>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.2em] mb-4">Our Story</h2>
              <h3 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">
                QUALITY WORK <br />
                IS OUR SIGNATURE.
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Split Second Services LLC was founded on the principle that every home deserves professional, reliable care. We don't just fix things; we provide peace of mind.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Licensed and Fully Insured",
                  "Transparent Upfront Pricing",
                  "100% Satisfaction Guarantee",
                  "Clean and Professional Staff"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-bold">
                    <div className="bg-brand-orange/20 p-1 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.2em] mb-4">Reviews</h2>
            <p className="text-4xl font-black text-brand-black">WHAT CLIENTS SAY</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 italic mb-8 leading-relaxed">"{t.text}"</p>
                <p className="font-black text-brand-black">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-black rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 items-center">
              <div className="p-6 sm:p-10 lg:p-20">
                <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.2em] mb-4">Contact Us</h2>
                <h3 className="text-4xl lg:text-5xl font-black text-white mb-8">READY TO START?</h3>
                <p className="text-gray-400 mb-12 max-w-md">Fill out the form and we'll get back to you within 24 hours with a free estimate.</p>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="bg-white/5 p-4 rounded-2xl">
                      <Phone className="text-brand-orange w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Call Us</p>
                      <p className="text-white font-bold text-lg">(603) 722-3494</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="bg-white/5 p-4 rounded-2xl">
                      <Mail className="text-brand-orange w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Email Us</p>
                      <p className="text-white font-bold text-lg">splitsecondservicesllc@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="bg-white/5 p-4 rounded-2xl">
                      <MapPin className="text-brand-orange w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Location</p>
                      <p className="text-white font-bold text-lg">Greater Manchester Area</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 sm:p-10 lg:p-20 lg:border-l border-t lg:border-t-0 border-white/10">
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="bg-brand-orange p-6 rounded-full mb-6">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-3xl font-black text-white mb-4">MESSAGE SENT!</h4>
                    <p className="text-gray-400">We'll be in touch very soon.</p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="mt-8 text-brand-orange font-bold hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name</label>
                        <input 
                          required
                          name="name"
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                        <input 
                          required
                          name="email"
                          type="email" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Service Needed</label>
                      <select 
                        name="service"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all appearance-none"
                      >
                        {services.map(s => (
                          <option key={s.title} className="bg-brand-black" value={s.title}>{s.title}</option>
                        ))}
                        <option className="bg-brand-black" value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message</label>
                      <textarea 
                        required
                        name="message"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all resize-none"
                      />
                    </div>
                    <button 
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-brand-orange text-white py-4 rounded-xl font-black text-lg hover:shadow-[0_0_20px_rgba(255,99,33,0.3)] transition-all disabled:opacity-50"
                    >
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-black py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-brand-orange p-1.5 rounded-md flex gap-0.5">
                <Hammer className="text-white w-4 h-4" />
                <Cpu className="text-white w-4 h-4" />
              </div>
              <span className="text-white font-black text-xl tracking-tighter">
                SPLIT SECOND<span className="text-brand-orange"> SERVICES</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 Split Second Services LLC. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Sitemap'].map((item) => (
                <a key={item} href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
