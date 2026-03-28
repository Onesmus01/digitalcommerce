import React from 'react';
import { Shield, Lock, Eye, UserX, Database, Globe, Mail, Phone } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = "March 28, 2026";

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none text-gray-600 mb-12">
          <p className="text-xl leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you visit our website or make a purchase. 
            Please read this privacy policy carefully. If you do not agree with the terms of this 
            privacy policy, please do not access the site.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-12 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contents</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {[
              'Information We Collect',
              'How We Use Your Information',
              'Sharing Your Information',
              'Cookies and Tracking',
              'Data Security',
              'Your Privacy Rights',
              'Third-Party Links',
              'Children\'s Privacy',
              'Changes to This Policy',
              'Contact Us'
            ].map((item, index) => (
              <li key={index}>
                <a href={`#section-${index + 1}`} className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                We may collect information about you in a variety of ways. The information we may collect via the website includes:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Personal Data</h3>
              <p>
                Personally identifiable information, such as your name, shipping address, email address, 
                telephone number, and demographic information (age, gender, hometown) that you voluntarily 
                give to us when you register with the website or when you choose to participate in various 
                activities related to the website, such as online chat and message boards.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Payment Data</h3>
              <p>
                Financial information, such as data related to your payment method (e.g., valid credit card number, 
                card brand, expiration date) that we may collect when you purchase, order, return, exchange, or 
                request information about our services from the website. We store only very limited, if any, 
                financial information that we collect.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Derivative Data</h3>
              <p>
                Information our servers automatically collect when you access the website, such as your IP address, 
                browser type, operating system, access times, and the pages you have viewed directly before and 
                after accessing the website.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, 
                and customized experience. Specifically, we may use information collected about you via the website to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Create and manage your account.</li>
                <li>Process your transactions and send related information including purchase confirmations and invoices.</li>
                <li>Deliver the products and services you request.</li>
                <li>Personalize your shopping experience and deliver content and product offerings relevant to your interests.</li>
                <li>Email you regarding your account or order.</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the website.</li>
                <li>Increase the efficiency and operation of the website.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the website.</li>
                <li>Notify you of updates to the website.</li>
                <li>Offer new products, services, and/or recommendations to you.</li>
                <li>Perform other business activities as needed.</li>
                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Sharing Your Information</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">By Law or to Protect Rights</h3>
              <p>
                If we believe the release of information about you is necessary to respond to legal process, 
                to investigate or remedy potential violations of our policies, or to protect the rights, property, 
                and safety of others, we may share your information as permitted or required by any applicable law, 
                rule, or regulation.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Third-Party Service Providers</h3>
              <p>
                We may share your information with third parties that perform services for us or on our behalf, 
                including payment processing, data analysis, email delivery, hosting services, customer service, 
                and marketing assistance.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Marketing Communications</h3>
              <p>
                With your consent, or with an opportunity for you to withdraw consent, we may share your information 
                with third parties for marketing purposes, as permitted by law.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Cookies and Tracking Technologies</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                We may use cookies, web beacons, tracking pixels, and other tracking technologies on the website 
                to help customize the website and improve your experience. When you access the website, your personal 
                information is not collected through the use of tracking technology.
              </p>
              <p>
                Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware 
                that such action could affect the availability and functionality of the website. You may not decline 
                web beacons; however, they can be rendered ineffective by declining all cookies or by modifying your 
                browser's settings to notify you each time a cookie is tendered and permit you to accept or decline cookies.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. 
                While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
                that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission 
                can be guaranteed against any interception or other type of misuse.
              </p>
              <p>
                Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. 
                Therefore, we cannot guarantee complete security if you provide personal information.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <UserX className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">6. Your Privacy Rights</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                In some regions (like the European Economic Area), you have certain rights under data protection laws. 
                These may include the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Withdraw your consent.</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                The website may contain links to third-party websites and applications of interest, including advertisements 
                and external services, that are not affiliated with us. Once you have used these links to leave the website, 
                any information you provide to these third parties is not covered by this Privacy Policy, and we cannot 
                guarantee the safety and privacy of your information.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                We do not knowingly solicit information from or market to children under the age of 13. If you become aware 
                of any data we have collected from children under age 13, please contact us using the contact information 
                provided below.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time in order to reflect changes to our practices or for 
                other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
              </p>
              <p className="mt-4">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
                are effective when they are posted on this page.
              </p>
            </div>
          </section>

          {/* Section 10 - Contact */}
          <section id="section-10" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <div className="text-gray-600 leading-relaxed mb-6">
              <p>
                If you have questions or comments about this Privacy Policy, please contact us:
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">onesmuswambua747@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">0759755575</span>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-600 mt-1" />
                  <span className="text-gray-700">
                    YourStore Inc.<br />
                    123 Nairobi Street<br />
                    Nairobi City, TC 12345<br />
                    Kenya
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2026 YourStore. All rights reserved. This Privacy Policy is effective as of {lastUpdated}.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;