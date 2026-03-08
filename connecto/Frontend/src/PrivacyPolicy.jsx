import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function FinePrint({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-xl mt-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2 text-left text-slate-400 hover:text-slate-600 transition-colors"
      >
        <span className="text-[10px] font-semibold tracking-wide uppercase">{title}</span>
        <span className="text-[10px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-[10px] leading-relaxed text-slate-400 space-y-2 font-normal">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="font-sans bg-white text-slate-900 min-h-screen flex flex-col selection:bg-black selection:text-white">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-black mb-4">Privacy &amp; Data Policy</h1>
          <p className="text-lg text-slate-500 font-medium">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed text-slate-700">

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">1. Introduction</h2>
            <p>
              ConnectHub operates a dual-sided matchmaking platform connecting brands with content creators. Our core value proposition relies on deterministic data integrity. To bypass fraudulent metrics, we mandate API synchronization of creator social media accounts. This Policy outlines how we collect, process, and protect data in compliance with the Digital Personal Data Protection (DPDP) Act 2023, GDPR, and CCPA.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">2. Data We Collect &amp; API Synchronization</h2>
            <p className="mb-4">We collect data necessary to provide accurate, real-time analytics:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong className="text-black">PII:</strong> Email addresses, phone numbers, and location data provided during registration.</li>
              <li><strong className="text-black">Authenticated Social Data:</strong> Via OAuth integrations, we access private metrics including verified audience demographics, geographic distribution, true engagement rates and content performance.</li>
              <li><strong className="text-black">Attribution Data:</strong> Pixel conversions, custom promo code usage, and UTM parameters to measure ROI and execute hybrid affiliate payouts.</li>
              <li><strong className="text-black">Profile Media:</strong> Profile images and social handles uploaded by the Creator are stored securely on our servers for matchmaking purposes.</li>
            </ul>

            <FinePrint title="Profile Photo, Handle &amp; Media — Risk Disclosure">
              <p>Profile images, social media handles, and linked content uploaded by the Creator are stored on third-party cloud infrastructure. While ConnectHub implements industry-standard encryption at rest (AES-256) and in transit (TLS 1.3), ConnectHub cannot and does not guarantee absolute immunity from unauthorized access, disclosure, or exfiltration resulting from sophisticated cyberattacks, zero-day exploits in underlying cloud provider systems, insider threats at infrastructure vendors, or social engineering attacks targeting individual user accounts. In the event of an unauthorized disclosure of profile media, ConnectHub's aggregate maximum liability shall be limited to the total platform fees paid by the affected party in the preceding three (3) calendar months, or INR 10,000, whichever is lower. By uploading profile imagery, handles, or any other personally identifiable media to this platform, the Creator irrevocably acknowledges and accepts this inherent risk of digital asset storage and grants ConnectHub a non-exclusive, worldwide, royalty-free license to display such imagery within the platform interface exclusively for the purpose of creator-brand matchmaking. ConnectHub shall not be liable for any reputational, commercial, emotional, or personal damage resulting from accidental public exposure of profile data arising from Creator-side account compromise (e.g., weak passwords, credential reuse across services, phishing, malware, or sharing login details with third parties).</p>
            </FinePrint>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">3. Password Security &amp; Account Compromise</h2>
            <p>
              ConnectHub strictly uses OAuth 2.0 flows — we never store your social media passwords. Your ConnectHub account password is protected with bcrypt hashing and salting. You are responsible for maintaining its confidentiality.
            </p>

            <FinePrint title="Password Leakage &amp; Credential Risk — User Responsibilities">
              <p>ConnectHub shall bear no liability whatsoever for losses, unauthorized data access, unauthorized campaign creation, unauthorized financial transactions, or any other damages arising from: (a) the Creator's or Brand's own reuse of passwords across multiple external platforms or services; (b) phishing attacks conducted by third-party actors impersonating ConnectHub's branding, domain, or communications without authorization; (c) malware, spyware, keyloggers, or screen-capture software installed on the user's own device that captures credentials at the point of entry; (d) the user voluntarily sharing their login credentials with third-party tools, social media management agencies, virtual assistants, or any other individual or entity; or (e) brute-force attacks succeeding against user-chosen weak passwords that do not meet minimum complexity recommendations. The User agrees and acknowledges that they are solely and entirely responsible for maintaining the confidentiality and security of their login information. ConnectHub reserves the unilateral right to immediately suspend or permanently terminate any account exhibiting anomalous login behavior, unusual geographic access patterns, or suspicious activity without prior notice, refund, or financial compensation of any kind.</p>
            </FinePrint>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">4. Consent, Rights &amp; Data Erasure</h2>
            <p>
              In adherence to the DPDP Act (Phase 2), all processing is conducted under verifiable consent mechanisms. You may revoke API connection permissions at any time, triggering our erasure protocol to remove proprietary analytics from our servers within 72 business hours.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">5. How We Share Information</h2>
            <p>
              Authenticated audience data is shared exclusively with brand partners inside the platform to facilitate transparent campaign tracking. We do not sell personal data to third-party data brokers. We use secure API middleware for universal social account connections.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">6. Security &amp; Breach Reporting</h2>
            <p>
              We maintain enterprise-grade security architectures. In the event of a security compromise, we adhere to mandatory 48-hour breach reporting protocols as required by the DPDP Act.
            </p>

            <FinePrint title="Breach Notification — Scope &amp; Cap of Liability">
              <p>ConnectHub's obligation to notify affected parties is triggered exclusively in the event of a breach that directly exposes sensitive Personally Identifiable Information (PII), such as government-issued identification numbers or financial account details. The exposure of publicly available or semi-public creator profile data (e.g., follower counts, public engagement rates, content thumbnails) aggregated from existing social media platforms shall not constitute a reportable breach or a liability event under this policy. The aggregate maximum liability of ConnectHub for any and all data breaches, data leaks, unauthorized disclosures, or security incidents, regardless of cause, frequency, severity, or cumulative effect, shall in no event exceed INR 50,000 or the equivalent of three (3) months of subscription fees paid by the affected user, whichever is lower. This limitation applies regardless of whether the breach resulted from ConnectHub's own negligence, the negligence of its vendors, or force majeure events.</p>
            </FinePrint>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">7. Contact Us</h2>
            <p>
              For data privacy concerns or consent modifications, please contact our Data Protection Officer at <span className="font-semibold text-black">privacy@connecthub.example.com</span>.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
