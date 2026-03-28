import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Heart, 
  Users, 
  Zap, 
  Coffee, 
  Laptop, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Search,
  Send,
  Sparkles,
  Target,
  Award
} from 'lucide-react';

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedJob, setExpandedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    { id: 'all', label: 'All Departments' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'operations', label: 'Operations' },
    { id: 'support', label: 'Customer Support' }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $150k',
      description: 'We are looking for an experienced Frontend Developer to lead our web application development. You will work with React, TypeScript, and modern web technologies to create exceptional user experiences.',
      requirements: [
        '5+ years of experience with React and modern JavaScript',
        'Strong understanding of web performance optimization',
        'Experience with e-commerce platforms',
        'Bachelor\'s degree in Computer Science or equivalent experience'
      ]
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'design',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'Join our design team to create beautiful, intuitive interfaces for our millions of users. You will own the design process from research to final implementation.',
      requirements: [
        '3+ years of UX/UI design experience',
        'Proficiency in Figma and design systems',
        'Portfolio demonstrating e-commerce or consumer app designs',
        'Experience conducting user research and usability testing'
      ]
    },
    {
      id: 3,
      title: 'Digital Marketing Manager',
      department: 'marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $110k',
      description: 'Lead our digital marketing efforts across SEO, SEM, social media, and email campaigns. You will drive growth and brand awareness for our expanding e-commerce platform.',
      requirements: [
        '4+ years of digital marketing experience',
        'Proven track record of driving ROI in e-commerce',
        'Experience with Google Analytics, Facebook Ads, and marketing automation',
        'Strong analytical and project management skills'
      ]
    },
    {
      id: 4,
      title: 'Customer Support Specialist',
      department: 'support',
      location: 'Remote',
      type: 'Full-time',
      salary: '$45k - $55k',
      description: 'Be the voice of our company! Help our customers have the best shopping experience by resolving inquiries via chat, email, and phone.',
      requirements: [
        '1+ years of customer service experience',
        'Excellent written and verbal communication skills',
        'Ability to work flexible hours including weekends',
        'E-commerce or retail experience preferred'
      ]
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      department: 'engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$130k - $160k',
      description: 'Build and maintain our cloud infrastructure, CI/CD pipelines, and monitoring systems. Ensure our platform scales reliably to serve millions of customers.',
      requirements: [
        '4+ years of DevOps or SRE experience',
        'Strong experience with AWS, Docker, and Kubernetes',
        'Infrastructure as Code experience (Terraform/CloudFormation)',
        'Python or Go programming skills'
      ]
    },
    {
      id: 6,
      title: 'Supply Chain Coordinator',
      department: 'operations',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$60k - $75k',
      description: 'Manage vendor relationships, inventory levels, and logistics operations. Optimize our supply chain to ensure fast, reliable delivery to customers.',
      requirements: [
        '2+ years of supply chain or logistics experience',
        'Experience with inventory management systems',
        'Strong negotiation and analytical skills',
        'Bachelor\'s degree in Supply Chain Management or related field'
      ]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Salary',
      description: 'Top-tier compensation packages with regular performance reviews'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive medical, dental, and vision coverage for you and your family'
    },
    {
      icon: Laptop,
      title: 'Remote First',
      description: 'Work from anywhere with flexible schedules and home office stipend'
    },
    {
      icon: Zap,
      title: 'Learning Budget',
      description: '$2,000 annual budget for courses, conferences, and professional development'
    },
    {
      icon: Coffee,
      title: 'Flexible PTO',
      description: 'Unlimited paid time off plus 12 weeks paid parental leave'
    },
    {
      icon: Users,
      title: 'Team Events',
      description: 'Regular virtual and in-person retreats, happy hours, and team building'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Customer Obsessed',
      description: 'Every decision starts with our customers. We exist to serve them and make their lives better.'
    },
    {
      icon: Zap,
      title: 'Move Fast',
      description: 'Speed matters. We take calculated risks, learn quickly, and constantly iterate to improve.'
    },
    {
      icon: Users,
      title: 'Inclusive Culture',
      description: 'Diverse perspectives drive innovation. We build a workplace where everyone belongs and thrives.'
    },
    {
      icon: Award,
      title: 'Excellence Always',
      description: 'Good enough is never enough. We hold ourselves to the highest standards in everything we do.'
    }
  ];

  const testimonials = [
    {
      quote: "I've grown more in 2 years here than in 5 years at my previous company. The learning opportunities are endless.",
      author: "Sarah Chen",
      role: "Senior Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      quote: "The remote-first culture actually works here. I feel connected to my team despite being thousands of miles away.",
      author: "Marcus Johnson",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      quote: "Finally, a company that values work-life balance. Unlimited PTO isn't just a perk—it's actually encouraged.",
      author: "Emily Rodriguez",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">We're hiring!</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Join Our Mission to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Redefine Commerce
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10">
            We're building the future of online shopping. Join a team of passionate innovators, 
            creators, and problem-solvers who are transforming how the world shops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#open-positions" 
              className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center gap-2"
            >
              View Open Positions
              <ArrowRight className="w-5 h-5" />
            </a>
            <button className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
              Learn About Culture
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">50+</div>
              <div className="text-purple-200 text-sm">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">12</div>
              <div className="text-purple-200 text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">$2M</div>
              <div className="text-purple-200 text-sm">Funding Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">4.9</div>
              <div className="text-purple-200 text-sm">Employee Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from how we build products to how we treat each other.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perks & Benefits</h2>
            <p className="text-xl text-gray-600">We take care of our team so they can do their best work</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Life at Our Company</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">Find your perfect role and join our growing team</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedDepartment === dept.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No positions found matching your criteria.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {departments.find(d => d.id === job.department)?.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden md:block text-purple-600 font-semibold">{job.salary}</span>
                      {expandedJob === job.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedJob === job.id && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                      <p className="text-gray-600 mb-6 leading-relaxed">{job.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="md:hidden text-purple-600 font-semibold">{job.salary}</span>
                        <button className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 ml-auto">
                          Apply Now
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Diversity Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
            <Globe className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Committed to Diversity</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            We believe diverse teams build better products. We are committed to creating an inclusive 
            workplace where everyone feels welcome, regardless of race, gender, age, sexual orientation, 
            disability, or background. We actively work to eliminate bias in our hiring process and 
            ensure equal opportunities for all.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Equal Opportunity Employer
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Inclusive Hiring Practices
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Employee Resource Groups
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-4 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Hiring Process</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Apply', desc: 'Submit your resume and tell us why you\'re excited about the role' },
              { step: '2', title: 'Review', desc: 'Our team reviews applications and reaches out within 5 business days' },
              { step: '3', title: 'Interview', desc: 'Virtual interviews with the hiring team and potential teammates' },
              { step: '4', title: 'Offer', desc: 'Receive an offer and join our mission to transform commerce' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't see the right role?</h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for talented people to join our team. 
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            Send General Application
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;