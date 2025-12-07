// src/pages/TermsOfService.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/register" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <FiArrowLeft className="h-5 w-5" />
              Back to Registration
            </Link>
            <Link to="/">
              <img src={logo} alt="ChainCarbon Logo" className="h-10 w-auto" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Title */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <FiShield className="h-8 w-8 text-gray-700" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Terms of Service
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Effective Date: January 1, 2024 | Last Updated: January 1, 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="prose max-w-none">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of the ChainCarbon platform 
                ("Platform"), including any services, features, content, and applications offered by ChainCarbon 
                ("we", "us", or "our"). By accessing or using the Platform, you agree to be bound by these Terms 
                and our Privacy Policy.
              </p>
            </div>

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  By registering for an account, accessing, or using any part of the Platform, you acknowledge 
                  that you have read, understood, and agree to be bound by these Terms. If you do not agree to 
                  these Terms, you may not access or use the Platform.
                </p>
                <div className="space-y-3 text-gray-700">
                  <p><strong>1.1</strong> You must be at least 18 years of age to use this Platform.</p>
                  <p><strong>1.2</strong> You represent and warrant that you have the legal capacity and authority to enter into these Terms.</p>
                  <p><strong>1.3</strong> If you are using the Platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Account Registration and Security
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-gray-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2.1 Account Creation</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    To access certain features of the Platform, you must register for an account. You agree to 
                    provide accurate, current, and complete information during the registration process and to 
                    update such information to keep it accurate, current, and complete.
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2.2 Account Security</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You are responsible for safeguarding your account credentials and for any activities or actions 
                    under your account. You agree to notify us immediately of any unauthorized access to or use of 
                    your account.
                  </p>
                </div>

                <div className="border-l-4 border-gray-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2.3 Account Verification</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    All accounts are subject to verification by our regulatory team. We reserve the right to reject 
                    any account registration or suspend any account at our sole discretion.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Use of the Platform
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">3.1 License Grant</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Subject to your compliance with these Terms, we grant you a limited, non-exclusive, 
                  non-transferable, non-sublicensable license to access and use the Platform for your business purposes.
                </p>

                <h3 className="font-semibold text-gray-900 mb-3">3.2 Restrictions</h3>
                <p className="text-gray-700 mb-2">You agree not to:</p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="list-disc">Use the Platform for any illegal or unauthorized purpose</li>
                  <li className="list-disc">Violate any laws in your jurisdiction</li>
                  <li className="list-disc">Infringe upon the intellectual property rights of others</li>
                  <li className="list-disc">Transmit any viruses, malware, or other harmful code</li>
                  <li className="list-disc">Attempt to gain unauthorized access to the Platform</li>
                  <li className="list-disc">Interfere with or disrupt the Platform or servers</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Carbon Credit Trading
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">4.1 Marketplace Participation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Platform provides a marketplace for buying, selling, and retiring carbon credits. 
                    All transactions must comply with applicable carbon credit standards and regulations.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">4.2 Verification and Validation</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    All carbon credits listed on the Platform must be properly verified and validated. 
                    You represent and warrant that:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="list-disc">All information provided about carbon credits is accurate and complete</li>
                    <li className="list-disc">You have the legal right to list and sell the carbon credits</li>
                    <li className="list-disc">The carbon credits are not subject to any liens or encumbrances</li>
                    <li className="list-disc">The carbon credits have not been previously sold or retired</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">4.3 Transaction Fees</h3>
                  <p className="text-gray-700 mb-3">ChainCarbon charges the following fees:</p>
                  <table className="w-full text-sm text-gray-700 border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Fee Type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Listing Fee</td>
                        <td className="border border-gray-300 px-4 py-2">0.5% of total value</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Transaction Fee</td>
                        <td className="border border-gray-300 px-4 py-2">2.0% of sale price</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Blockchain Verification</td>
                        <td className="border border-gray-300 px-4 py-2">Included</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Blockchain Technology
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Platform utilizes Hyperledger Fabric blockchain technology to record and verify all 
                  carbon credit transactions. You acknowledge and agree that:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="list-disc">All transactions are permanently recorded on the blockchain</li>
                  <li className="list-disc">Blockchain records are immutable and cannot be altered or deleted</li>
                  <li className="list-disc">Transaction information may be publicly accessible for verification purposes</li>
                  <li className="list-disc">We are not responsible for any errors or vulnerabilities in the blockchain technology</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Intellectual Property Rights
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Platform and its entire contents, features, and functionality (including but not limited to 
                  all information, software, text, displays, images, video, and audio, and the design, selection, 
                  and arrangement thereof) are owned by ChainCarbon, its licensors, or other providers of such 
                  material and are protected by copyright, trademark, patent, trade secret, and other intellectual 
                  property or proprietary rights laws.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Disclaimer of Warranties
              </h2>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-3 uppercase font-semibold text-sm">
                  Important Legal Notice
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO REPRESENTATIONS OR 
                  WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE PLATFORM OR THE INFORMATION, 
                  CONTENT, MATERIALS, OR PRODUCTS INCLUDED ON THE PLATFORM.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, 
                  INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Limitation of Liability
              </h2>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CHAINCARBON, ITS AFFILIATES, 
                  DIRECTORS, OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, 
                  GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="list-disc">Your access to or use of or inability to access or use the Platform</li>
                  <li className="list-disc">Any conduct or content of any third party on the Platform</li>
                  <li className="list-disc">Any content obtained from the Platform</li>
                  <li className="list-disc">Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Indemnification
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless ChainCarbon and its affiliates, licensors, and 
                  service providers, and their respective officers, directors, employees, contractors, agents, 
                  licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, 
                  judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising 
                  out of or relating to your violation of these Terms or your use of the Platform.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Termination
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-gray-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">10.1 By You</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You may terminate your account at any time by contacting our support team.
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">10.2 By Us</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We may suspend or terminate your account immediately, without prior notice or liability, for any 
                    reason whatsoever, including without limitation if you breach these Terms.
                  </p>
                </div>

                <div className="border-l-4 border-gray-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">10.3 Effect of Termination</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Upon termination, your right to use the Platform will immediately cease. All provisions of these 
                    Terms which by their nature should survive termination shall survive termination.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Governing Law and Dispute Resolution
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the Republic of 
                  Indonesia, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Any disputes arising out of or in connection with these Terms shall be resolved through good faith 
                  negotiations. If the parties are unable to resolve the dispute through negotiations, the dispute 
                  shall be submitted to the exclusive jurisdiction of the courts of Jakarta, Indonesia.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Changes to Terms
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time at our sole discretion. If a 
                  revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. 
                  What constitutes a material change will be determined at our sole discretion. By continuing to access 
                  or use the Platform after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Miscellaneous
              </h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>13.1 Entire Agreement:</strong> These Terms constitute the entire agreement between you and ChainCarbon regarding the use of the Platform.</p>
                <p><strong>13.2 Severability:</strong> If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced.</p>
                <p><strong>13.3 Waiver:</strong> No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.</p>
                <p><strong>13.4 Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign or transfer these Terms at any time without restriction.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. Contact Information
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Company Name:</strong> PT ChainCarbon Indonesia</p>
                  <p><strong>Email:</strong> legal@chaincarbon.com</p>
                  <p><strong>Phone:</strong> +62 21 1234 5678</p>
                  <p><strong>Address:</strong> Jakarta, Indonesia</p>
                  <p><strong>Website:</strong> www.chaincarbon.com</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link 
                to="/privacy"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Privacy Policy →
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Back to Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;