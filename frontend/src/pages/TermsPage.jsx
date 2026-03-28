import React from 'react';
import { FileText, UserCheck, ShoppingCart, CreditCard, Truck, RefreshCcw, Scale, Copyright, AlertTriangle, Gavel, Mail, Phone, Globe } from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = "March 28, 2026";

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none text-gray-600 mb-12">
          <p className="text-xl leading-relaxed">
            Welcome to our website. These Terms of Service ("Terms") govern your access to and use of our website, 
            services, and applications (collectively, the "Service"). By accessing or using the Service, you agree 
            to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-12 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contents</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {[
              'Acceptance of Terms',
              'Use of the Service',
              'Account Registration',
              'Product Information',
              'Orders and Payment',
              'Shipping and Delivery',
              'Returns and Refunds',
              'Intellectual Property',
              'User Conduct',
              'Limitation of Liability',
              'Indemnification',
              'Governing Law',
              'Changes to Terms',
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
              <UserCheck className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                By accessing our website, placing an order, or using our services, you confirm that you are at least 
                18 years old or have reached the age of majority in your jurisdiction, and that you have the legal 
                capacity to enter into binding contracts.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and our company regarding your use of 
                the Service. You agree to comply with all applicable laws and regulations when using our Service.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Use of the Service</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our 
                Service for personal, non-commercial purposes. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Use the Service for any illegal purpose or in violation of any laws.</li>
                <li>Attempt to gain unauthorized access to any portion of the Service.</li>
                <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                <li>Use any robot, spider, or other automated device to access the Service.</li>
                <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Account Registration</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                To access certain features of the Service, you must register for an account. You agree to provide 
                accurate, current, and complete information during the registration process and to update such 
                information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any 
                activities or actions under your password. You agree not to disclose your password to any third party. 
                You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              <p>
                We reserve the right to terminate or suspend your account immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Product Information</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                We make every effort to display as accurately as possible the colors, features, specifications, and 
                details of the products available on the Service. However, we do not guarantee that the colors, 
                features, specifications, and details of the products will be accurate, complete, reliable, current, 
                or free of error.
              </p>
              <p>
                All products are subject to availability. We reserve the right to discontinue any products at any time 
                for any reason. Prices for all products are subject to change without notice.
              </p>
              <p>
                We reserve the right to limit the quantities of any products or services that we offer. All 
                descriptions of products or product pricing are subject to change at any time without notice, at our 
                sole discretion.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Orders and Payment</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                By placing an order, you agree to provide current, complete, and accurate purchase and account 
                information. You agree to promptly update your account and other information, including your email 
                address and credit card numbers and expiration dates, so that we can complete your transactions and 
                contact you as needed.
              </p>
              <p>
                All payments are processed securely through our third-party payment processors. By submitting your 
                payment information, you grant us the right to provide this information to these third parties 
                subject to our Privacy Policy.
              </p>
              <p>
                You represent and warrant that you have the legal right to use any credit card(s) or other payment 
                method(s) utilized in connection with any purchase. We reserve the right to refuse any order placed 
                through the Service.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">6. Shipping and Delivery</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Shipping and delivery dates are estimates only and cannot be guaranteed. We are not liable for any 
                delays in shipments. Risk of loss and title for items purchased from our Service pass to you upon 
                delivery of the items to the carrier.
              </p>
              <p>
                You are responsible for providing accurate shipping information. We are not responsible for items 
                shipped to incorrect addresses provided by you. Additional fees may apply for address corrections 
                or reshipments.
              </p>
              <p>
                For international orders, you are responsible for all duties, import taxes, customs fees, and any 
                other charges imposed by your country's customs authorities.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCcw className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">7. Returns and Refunds</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                We accept returns within 30 days of delivery for most items in new, unused condition with original 
                packaging. Certain items (such as intimate apparel, perishable goods, or customized products) may not 
                be eligible for return.
              </p>
              <p>
                To initiate a return, you must contact our customer service team to obtain a Return Authorization. 
                Items returned without authorization may not be accepted.
              </p>
              <p>
                Refunds will be issued to the original payment method within 5-10 business days after we receive and 
                inspect the returned item. Shipping costs are non-refundable unless the return is due to our error.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Copyright className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Intellectual Property</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive 
                property of our company and its licensors. The Service is protected by copyright, trademark, and other 
                laws of both the United States and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the 
                prior written consent of our company. You may not frame or utilize framing techniques to enclose any 
                trademark, logo, or other proprietary information without our express written consent.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">9. User Conduct</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Upload, post, email, transmit, or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
                <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                <li>Upload, post, email, transmit, or otherwise make available any unsolicited or unauthorized advertising, promotional materials, "junk mail," "spam," or any other form of solicitation.</li>
                <li>Upload, post, email, transmit, or otherwise make available any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware.</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">10. Limitation of Liability</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                In no event shall our company, nor its directors, employees, partners, agents, suppliers, or 
                affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your access to or use of or inability to access or use the Service.</li>
                <li>Any conduct or content of any third party on the Service.</li>
                <li>Any content obtained from the Service.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
              <p className="mt-4">
                Our total liability to you for all claims arising from or relating to these Terms or your use of 
                the Service shall not exceed the amount paid by you, if any, for accessing the Service during the 
                twelve (12) month period immediately preceding the date of the claim.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">11. Indemnification</h2>
            </div>
            <div className="text-gray-600 leading-relaxed">
              <p>
                You agree to defend, indemnify, and hold harmless our company and its licensee and licensors, and 
                their employees, contractors, agents, officers, and directors, from and against any and all claims, 
                damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to 
                attorney's fees), resulting from or arising out of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your use and access of the Service.</li>
                <li>Your violation of any term of these Terms.</li>
                <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right.</li>
                <li>Any claim that your content caused damage to a third party.</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your State/Country], 
                without regard to its conflict of law provisions.
              </p>
              <p className="mt-4">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of 
                those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, 
                the remaining provisions of these Terms will remain in effect.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
                revision is material, we will try to provide at least 30 days' notice prior to any new terms taking 
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="mt-4">
                By continuing to access or use our Service after those revisions become effective, you agree to be 
                bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>
            </div>
          </section>

          {/* Section 14 - Contact */}
          <section id="section-14" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <div className="text-gray-600 leading-relaxed mb-6">
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">legal@yourstore.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">1-800-123-4567</span>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-600 mt-1" />
                  <span className="text-gray-700">
                    YourStore Inc.<br />
                    123 Legal Avenue<br />
                    Tech City, TC 12345<br />
                    United States
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Agreement Footer */}
        <div className="mt-16 p-6 bg-purple-50 rounded-2xl border border-purple-100">
          <p className="text-center text-purple-900 font-medium">
            By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2026 YourStore. All rights reserved. These Terms are effective as of {lastUpdated}.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;