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

export default function TermsOfService() {
  return (
    <div className="font-sans bg-white text-slate-900 min-h-screen flex flex-col selection:bg-black selection:text-white">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-black mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-500 font-medium">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed text-slate-700">

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">1. The ConnectHub Marketplace</h2>
            <p>
              ConnectHub is a dual-sided matchmaking platform facilitating direct, data-driven creator-brand partnerships. By accessing ConnectHub, you accept these Terms in their entirety.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">2. Creator Verification &amp; Fraud Prevention</h2>
            <p>
              Creators must authenticate social media profiles via our secure API. We actively monitor for fraudulent engagement.
            </p>
            <FinePrint title="Creator-Side Fraud — Liability &amp; Consequences">
              <p>If a Creator is found to have engaged in follower fraud (e.g., purchased bots, engagement rings, follow-unfollow automation scripts) at any point, ConnectHub reserves the right to immediately and permanently suspend the account. ConnectHub will recover any disbursed fees or campaign payouts based on fraudulent metrics and share this evidence with affected Brand partners. The Creator holds sole financial and legal liability for any losses suffered by Brands due to Creator-side metric manipulation. ConnectHub assumes zero liability for verifying the absolute authenticity of every individual follower within a Creator's network.</p>
            </FinePrint>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">3. Brand Integrity &amp; Product Standards</h2>
            <p>
              Brands using ConnectHub are required to represent their products and services truthfully and accurately within campaign briefs. ConnectHub is a neutral matchmaking facilitator.
            </p>
            <FinePrint title="Fraudulent Products &amp; Brand Misrepresentation — User Risk">
              <p>ConnectHub makes no warranty, express or implied, regarding the quality, safety, legality, or merchantability of any product or service advertised by a Brand. Creators who promote a Brand's product do so at their own reputational and legal risk. ConnectHub shall bear no liability for: (a) any personal, financial, or reputational harm suffered by a Creator resulting from promoting a fraudulent, counterfeit, or unsafe Brand product; or (b) any consumer claims or legal actions brought against a Creator arising from Brand-side false advertising. ConnectHub's responsibility is strictly limited to matchmaking infrastructure.</p>
            </FinePrint>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">4. Escrow &amp; Payments</h2>
            <p>
              Campaign funds are secured in escrow prior to a Creator commencing work. Compensation is disbursed automatically upon the Brand's approval of deliverables. We support performance-based hybrid models tracked via UTM and pixel attribution.
            </p>
            <FinePrint title="Payment Delays &amp; Failures — Limitation of Liability">
              <p>ConnectHub does not guarantee any minimum or exact payout timeline. Disbursement of funds is strictly contingent upon the Brand's formal approval within the platform. If a Brand delays approval, ConnectHub shall not be liable for any financial distress or opportunity cost suffered by the Creator. Furthermore, payment failures arising from Brand insolvency, fraudulent credit card chargebacks, banking network failures, or third-party payment gateway outages shall not constitute a breach by ConnectHub. While we will make commercially reasonable recovery efforts, ConnectHub explicitly denies liability for unpaid Creator wages resulting from Brand default.</p>
            </FinePrint>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">5. ROI &amp; Campaign Performance</h2>
            <p>
              ConnectHub's algorithm uses authenticated audience data to optimize alignment. However, individual campaign results will vary depending on content quality and market variables.
            </p>
            <FinePrint title="Low ROI, No Clicks &amp; Zero Sales — No Guarantees">
              <p>ConnectHub explicitly disclaims all warranties, representations, or guarantees regarding anticipated or actual campaign performance. If a campaign generates zero clicks, zero product sales, zero engagement, or produces a completely negative Return on Investment (ROI), ConnectHub shall bear no financial liability, refund obligation, or penalty to the Brand. Campaign outcomes are heavily dependent on third-party social media algorithms, consumer sentiment, and ad fatigue, over which ConnectHub has absolutely no control. Brands agree not to initiate chargebacks or legal action against ConnectHub or Creators solely on the basis of poor campaign performance or low sales.</p>
            </FinePrint>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">6. Ad Standards</h2>
            <p>
              Parties must adhere to ASCI guidelines regarding sponsored content disclosures.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">7. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts located in Bangalore, Karnataka.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
