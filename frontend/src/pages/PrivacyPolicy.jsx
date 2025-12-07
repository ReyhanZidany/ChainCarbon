// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import logo from "../assets/chaincarbon_logo_transparent.png";

const PrivacyPolicy = () => {
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
              <FiLock className="h-8 w-8 text-gray-700" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose max-w-none">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                ChainCarbon ("ChainCarbon", "we", "us", or "our") respects your privacy and is 
                committed to protecting your personal data. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our Platform. Please read this Privacy 
                Policy carefully.
              </p>
            </div>

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">1.1 Personal Information</h3>
                  <p className="text-gray-700 mb-3">
                    We collect personal information that you voluntarily provide to us when you register on the Platform, 
                    including:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="list-disc">Full name and contact details (email address)</li>
                    <li className="list-disc">Company name, registration number, and business information</li>
                    <li className="list-disc">Business address and location information</li>
                    <li className="list-disc">Company website and professional profiles</li>
                    <li className="list-disc">Identification documents for verification purposes</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">1.2 Technical Data</h3>
                  <p className="text-gray-700 mb-3">
                    We automatically collect certain information when you visit, use, or navigate the Platform:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="list-disc">Internet Protocol (IP) address and geolocation data</li>
                    <li className="list-disc">Browser type and version</li>
                    <li className="list-disc">Operating system and device information</li>
                    <li className="list-disc">Usage data and navigation patterns</li>
                    <li className="list-disc">Cookies and similar tracking technologies</li>
                    <li className="list-disc">Log files and analytics data</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">1.3 Transaction Data</h3>
                  <p className="text-gray-700 mb-3">
                    When you engage in transactions on the Platform, we collect:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="list-disc">Carbon credit transaction details</li>
                    <li className="list-disc">Certificate issuance and retirement records</li>
                    <li className="list-disc">Blockchain transaction hashes</li>
                    <li className="list-disc">Payment history and invoices</li>
                    <li className="list-disc">Communication records related to transactions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  We use the information we collect or receive for the following purposes:
                </p>
                <div className="space-y-3 text-gray-700">
                  <p><strong>2.1</strong> To provide, maintain, and improve the Platform and our services</p>
                  <p><strong>2.2</strong> To process and facilitate carbon credit transactions</p>
                  <p><strong>2.3</strong> To verify user identity and maintain account security</p>
                  <p><strong>2.4</strong> To comply with legal and regulatory requirements</p>
                  <p><strong>2.5</strong> To communicate with you regarding your account and transactions</p>
                  <p><strong>2.6</strong> To detect, prevent, and address fraud and security issues</p>
                  <p><strong>2.7</strong> To conduct analytics and research to improve our services</p>
                  <p><strong>2.8</strong> To send marketing communications (with your consent)</p>
                  <p><strong>2.9</strong> To enforce our Terms of Service and other agreements</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Legal Basis for Processing
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  We process your personal information based on the following legal grounds:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Contract Performance</h4>
                    <p className="text-sm text-gray-700">Processing necessary to perform our contract with you and provide our services</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Legal Obligation</h4>
                    <p className="text-sm text-gray-700">Processing required to comply with applicable laws and regulations</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Legitimate Interest</h4>
                    <p className="text-sm text-gray-700">Processing necessary for our legitimate business interests</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Consent</h4>
                    <p className="text-sm text-gray-700">Processing based on your explicit consent (which you may withdraw at any time)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">4.1 Service Providers</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We may share your information with third-party service providers who perform services on our behalf, 
                    such as payment processing, data analysis, email delivery, hosting services, and customer service.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">4.2 Regulatory Authorities</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We may disclose your information to regulatory authorities, government agencies, or law enforcement 
                    officials when required by law or to comply with legal processes.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">4.3 Business Transfers</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    In connection with any merger, sale of company assets, financing, or acquisition of all or a portion 
                    of our business, your information may be transferred to the acquiring entity.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">4.4 Blockchain Network</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Transaction data recorded on the blockchain is publicly accessible and immutable. This data may include 
                    transaction amounts, dates, and certificate information, but does not include your personal identification information.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="list-disc">Encryption of data in transit and at rest using industry-standard protocols</li>
                  <li className="list-disc">Regular security assessments and penetration testing</li>
                  <li className="list-disc">Access controls and authentication mechanisms</li>
                  <li className="list-disc">Employee training on data protection and security</li>
                  <li className="list-disc">Incident response procedures and monitoring systems</li>
                  <li className="list-disc">Regular backups and disaster recovery plans</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we 
                  strive to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Data Retention
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                  Privacy Policy, unless a longer retention period is required or permitted by law. The retention period 
                  depends on:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="list-disc">The nature of the information collected</li>
                  <li className="list-disc">The purpose for which it was collected</li>
                  <li className="list-disc">Legal or regulatory requirements</li>
                  <li className="list-disc">Whether a legal claim may be brought</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Please note that blockchain transaction records are permanent and cannot be deleted or modified.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Your Rights
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Under applicable data protection laws, you have the following rights regarding your personal information:
                </p>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">7.1 Right of Access</h4>
                    <p className="text-sm text-gray-700">You have the right to request copies of your personal data</p>
                  </div>
                  
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">7.2 Right to Rectification</h4>
                    <p className="text-sm text-gray-700">You have the right to request correction of inaccurate or incomplete data</p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">7.3 Right to Erasure</h4>
                    <p className="text-sm text-gray-700">You have the right to request deletion of your personal data under certain conditions</p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">7.4 Right to Restrict Processing</h4>
                    <p className="text-sm text-gray-700">You have the right to request restriction of processing of your personal data</p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">7.5 Right to Data Portability</h4>
                    <p className="text-sm text-gray-700">You have the right to request transfer of your data to another organization</p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">7.6 Right to Object</h4>
                    <p className="text-sm text-gray-700">You have the right to object to processing of your personal data</p>
                  </div>

                  <div className="border-l-4 border-gray-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">7.7 Right to Withdraw Consent</h4>
                    <p className="text-sm text-gray-700">You have the right to withdraw your consent at any time</p>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">
                  To exercise any of these rights, please contact us using the information provided in Section 12.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Cookies and Tracking Technologies
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to collect and store information. You can control 
                  cookies through your browser settings. We use the following types of cookies:
                </p>
                <table className="w-full text-sm text-gray-700 border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Essential</td>
                      <td className="border border-gray-300 px-4 py-2">Required for basic platform functionality</td>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Performance</td>
                      <td className="border border-gray-300 px-4 py-2">Analytics and platform improvement</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Functional</td>
                      <td className="border border-gray-300 px-4 py-2">Remember preferences and settings</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Marketing</td>
                      <td className="border border-gray-300 px-4 py-2">Deliver targeted advertising</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and maintained on servers located outside of your jurisdiction 
                  where data protection laws may differ. By using the Platform, you consent to the transfer of your 
                  information to Indonesia and other countries where we operate. We ensure appropriate safeguards are 
                  in place to protect your personal information.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Children's Privacy
              </h2>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  The Platform is not intended for individuals under the age of 18. We do not knowingly collect personal 
                  information from children. If you are a parent or guardian and believe your child has provided us with 
                  personal information, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                  posting the new Privacy Policy on this page and updating the "Last Updated" date. We will also send 
                  you an email notification if the changes are significant. You are advised to review this Privacy Policy 
                  periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact Information
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Company Name:</strong> PT ChainCarbon Indonesia</p>
                  <p><strong>Data Protection Officer:</strong> dpo@chaincarbon.com</p>
                  <p><strong>General Inquiries:</strong> privacy@chaincarbon.com</p>
                  <p><strong>Phone:</strong> +62 21 1234 5678</p>
                  <p><strong>Address:</strong> Jakarta, Indonesia</p>
                  <p><strong>Website:</strong> www.chaincarbon.com</p>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  We will respond to your inquiries within 30 business days.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link 
                to="/terms"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Terms of Service →
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

export default PrivacyPolicy;