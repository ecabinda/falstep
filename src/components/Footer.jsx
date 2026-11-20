import React from "react";

export function Footer() {
  return (
    <footer className="w-full bg-[#f7f5f0] border-t border-[#e5ded8]">
      <div className="w-full px-4 md:px-12 py-12 max-w-[1600px] mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#e5ded8]">
          <div className="md:col-span-2">
            <span className="font-['Anton'] text-xl uppercase tracking-tight text-[#201511]">
              FALSTEP
            </span>
            <p className="text-sm text-[#4e4541] mt-3 max-w-sm leading-relaxed">
              Independent sartorial laboratory operating at the intersection of
              Mediterranean leisure aesthetics and brutalist London drop culture.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#201511] mb-3">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs uppercase text-[#4e4541]">
              <li><a href="#drops" className="hover:text-[#201511] underline underline-offset-4">CLIENT SERVICE</a></li>
              <li><a href="#shipping" className="hover:text-[#201511] underline underline-offset-4">SHIPPING & DROPS</a></li>
              <li><a href="#terms" className="hover:text-[#201511] underline underline-offset-4">TERMS OF RELEASE</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#201511] mb-3">
              ARCHIVES
            </h4>
            <ul className="space-y-2 text-xs uppercase text-[#4e4541]">
              <li><a href="#lookbook" className="hover:text-[#201511] underline underline-offset-4">LOOKBOOK ARCHIVE</a></li>
              <li><a href="#authenticity" className="hover:text-[#201511] underline underline-offset-4">AUTHENTICITY</a></li>
              <li><a href="#privacy" className="hover:text-[#201511] underline underline-offset-4">PRIVACY POLICY</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[#4e4541] text-xs gap-4">
          <p className="font-mono uppercase text-[11px]">
            &copy; 2025 FALSTEP LTD. CRAFTED FOR THE CULTURALLY ASTUTE.
          </p>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span className="text-[#201511] font-bold">VAT 402 9182 04</span>
            <span>PORTO / LONDON</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
