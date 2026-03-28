import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Truck, 
  Shield, 
  Users, 
  Award, 
  Globe, 
  Leaf,
  ArrowRight,
  Star,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';

const AboutPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Heart },
    { number: "100+", label: "Products", icon: ShoppingBag },
    { number: "25", label: "Countries Served", icon: Globe },
    { number: "99%", label: "Satisfaction Rate", icon: Star }
  ];

  const timeline = [
    {
      year: "2018",
      title: "The Beginning",
      description: "Started from a small garage with a vision to revolutionize online shopping experiences."
    },
    {
      year: "2019",
      title: "First Milestone",
      description: "Reached our first 10,000 customers and expanded our product catalog significantly."
    },
    {
      year: "2021",
      title: "Going Global",
      description: "Expanded operations to international markets, bringing quality to doorsteps worldwide."
    },
    {
      year: "2023",
      title: "Sustainability Focus",
      description: "Launched eco-friendly initiatives and committed to carbon-neutral shipping."
    },
    {
      year: "2025",
      title: "Industry Leader",
      description: "Recognized as one of the top emerging ecommerce platforms globally."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and transactions are protected with bank-level encryption and security measures."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "We partner with leading logistics providers to ensure your orders arrive on time, every time."
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Sustainable packaging and carbon-neutral shipping options for environmentally conscious shopping."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built by shoppers, for shoppers. We listen to your feedback and continuously improve."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Visionary leader with 10+ years in ecommerce innovation"
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Tech enthusiast driving digital transformation"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Customer Experience",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Passionate about creating delightful shopping journeys"
    },
    {
      name: "David Kim",
      role: "Operations Director",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Ensuring seamless logistics and supply chain excellence"
    }
  ];

  const testimonials = [
    {
      text: "The best shopping experience I've ever had online. Fast shipping and amazing quality!",
      author: "Jessica M.",
      role: "Verified Buyer"
    },
    {
      text: "Customer service went above and beyond to help me. Truly a company that cares.",
      author: "Robert K.",
      role: "Loyal Customer"
    },
    {
      text: "Love their commitment to sustainability. Shopping here feels good in every way.",
      author: "Amanda L.",
      role: "Eco Advocate"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-white/90 text-sm font-medium tracking-wider uppercase">Est. 2018</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            We're on a Mission to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Redefine Shopping
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            More than just an online store. We're building a community of conscious 
            consumers who value quality, sustainability, and exceptional experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-900 rounded-full font-semibold hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center gap-2 group">
              Explore Our Story
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
              Join Our Team
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <stat.icon className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to industry leadership, every step has been driven by our passion for excellence.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-600 to-pink-600 hidden md:block" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                      <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10 hidden md:block" />
                  
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our core values drive every decision we make and every product we deliver.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet the Visionaries</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming your shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl bg-gray-50 hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-w-3 aspect-h-4 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-300 font-medium mb-2">{member.role}</p>
                  <p className="text-white/80 text-sm">{member.bio}</p>
                </div>
                <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-purple-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Customer Love</h2>
            <p className="text-xl text-indigo-200">Real stories from our amazing community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-indigo-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
                <Leaf className="w-4 h-4" />
                Sustainability Initiative
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Shopping That Doesn't Cost the Earth
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're committed to reducing our carbon footprint by 50% by 2026. From 
                eco-friendly packaging to carbon-neutral shipping, every order plants 
                a tree through our partnership with global reforestation projects.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "100% recyclable packaging materials",
                  "Carbon-neutral delivery options",
                  "Ethical sourcing from verified suppliers",
                  "Zero-waste warehouse initiatives"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <button className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center gap-2">
                Learn More About Our Impact
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop" 
                alt="Sustainability"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold text-green-600 mb-1">1M+</div>
                <div className="text-gray-600 font-medium">Trees Planted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Connect</h2>
              <p className="text-xl text-gray-400 mb-8">
                Have questions or want to collaborate? We'd love to hear from you. 
                Reach out to our team and we'll get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Visit Us</p>
                    <p className="font-semibold">123 Innovation Drive, Tech City, TC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Us</p>
                    <p className="font-semibold">hello@yourstore.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Call Us</p>
                    <p className="font-semibold">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                {[Instagram, Twitter, Facebook, Linkedin].map((Icon, index) => (
                  <button 
                    key={index}
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
                />
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 text-gray-400">
                  <option>General Inquiry</option>
                  <option>Partnership</option>
                  <option>Careers</option>
                  <option>Press</option>
                </select>
                <textarea 
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400 resize-none"
                />
                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity duration-300">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-lg text-white/90 mb-8">
            Subscribe to our newsletter for exclusive deals, new arrivals, and behind-the-scenes content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-white/70 mt-4">Join 50,000+ subscribers. No spam, unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-purple-500" />
            <span className="text-white font-bold text-xl">YourStore</span>
          </div>
          <p className="text-sm">© 2025 YourStore. All rights reserved. Made with ❤️ for shoppers worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;