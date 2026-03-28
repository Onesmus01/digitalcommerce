import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, Truck, RefreshCcw, CreditCard, Package, Mail } from 'lucide-react';

const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns', icon: RefreshCcw },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'orders', label: 'Orders', icon: Package },
  ];

  const faqs = [
    {
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee. International orders may take 10-15 business days depending on the destination country.'
    },
    {
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free standard shipping on all orders over $50. Orders under $50 have a flat shipping rate of $5.99. Free shipping is automatically applied at checkout when your cart qualifies.'
    },
    {
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive an email with a tracking number. You can also track your order by logging into your account and viewing your order history. Tracking information typically updates within 24 hours of shipment.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all unused items in their original packaging. Simply initiate a return through your account dashboard or contact our support team. Once we receive the item, refunds are processed within 5-7 business days.'
    },
    {
      category: 'returns',
      question: 'How do I exchange an item?',
      answer: 'To exchange an item for a different size or color, please return the original item for a refund and place a new order. This ensures you get the new item quickly while we process your return.'
    },
    {
      category: 'returns',
      question: 'Do I have to pay for return shipping?',
      answer: 'Return shipping is free for defective or incorrect items. For size exchanges or change of mind, a $5.99 return shipping fee applies, which will be deducted from your refund amount.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption.'
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard SSL encryption and never store your full credit card details on our servers. All payments are processed through PCI-compliant payment gateways.'
    },
    {
      category: 'payment',
      question: 'Do you offer buy now, pay later options?',
      answer: 'Yes! We partner with Klarna and Afterpay to offer installment payment options. Simply select your preferred option at checkout to split your purchase into 4 interest-free payments.'
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'Orders can be modified or cancelled within 1 hour of placement. After that, we begin processing immediately to ensure fast shipping. Please contact support immediately if you need to make changes.'
    },
    {
      category: 'orders',
      question: 'What if an item is out of stock?',
      answer: 'If an item becomes out of stock after you place your order, we will notify you via email within 24 hours. You can choose to wait for restocking, receive a full refund, or select an alternative item.'
    },
    {
      category: 'orders',
      question: 'Do you offer gift wrapping?',
      answer: 'Yes! We offer premium gift wrapping for $3.99 per item. You can also include a personalized message up to 200 characters. Select the gift wrap option at checkout.'
    },
    {
      category: 'general',
      question: 'How do I contact customer support?',
      answer: 'Our support team is available 24/7 via live chat, email at support@yourstore.com, or phone at 1-800-123-4567. We typically respond to emails within 2 hours during business hours.'
    },
    {
      category: 'general',
      question: 'Do you have a loyalty program?',
      answer: 'Yes! Join our Rewards Program to earn points on every purchase. Get 1 point per $1 spent, and redeem 100 points for $5 off. Members also get early access to sales and exclusive discounts.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No questions found matching your search.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                className="mt-4 text-purple-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-white/90 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/30">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;