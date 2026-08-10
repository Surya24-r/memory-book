"use client";

export default function Faq() {
  return (
    <section className="w-full bg-[#FAF9F7] py-28">
      <div className="max-w-[900px] mx-auto px-8">

        
        <div className="text-center">
          <p className="text-[12px] tracking-[5px] uppercase text-[#F3B719] font-medium">
            Common Questions
          </p>

          <h2 className="mt-5 text-[64px] leading-none font-serif text-[#121212]">
            Everything you need to know.
          </h2>
        </div>

        

        <div className="mt-20">

          
          <details className="group border-b border-[#E6E6E6]">
            <summary className="flex items-center justify-between py-8 cursor-pointer list-none">
              <span className="text-[18px] text-[#121212]">
                How long does delivery take?
              </span>

              <div className="w-11 h-11 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[28px] text-[#444444] group-open:rotate-45 transition">
                +
              </div>
            </summary>

            <p className="pb-8 pr-16 text-[16px] leading-8 text-[#666666]">
              Most MemoryBooks are printed and delivered within 7–10 business
              days across India.
            </p>
          </details>

        
          <details className="group border-b border-[#E6E6E6]">
            <summary className="flex items-center justify-between py-8 cursor-pointer list-none">
              <span className="text-[18px] text-[#121212]">
                Is my data safe with your AI?
              </span>

              <div className="w-11 h-11 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[28px] text-[#444444] group-open:rotate-45 transition">
                +
              </div>
            </summary>

            <p className="pb-8 pr-16 text-[16px] leading-8 text-[#666666]">
              Yes. Your photos are securely processed and never shared with
              third parties.
            </p>
          </details>

        
          <details className="group border-b border-[#E6E6E6]">
            <summary className="flex items-center justify-between py-8 cursor-pointer list-none">
              <span className="text-[18px] text-[#121212]">
                What kind of paper do you use?
              </span>

              <div className="w-11 h-11 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[28px] text-[#444444] group-open:rotate-45 transition">
                +
              </div>
            </summary>

            <p className="pb-8 pr-16 text-[16px] leading-8 text-[#666666]">
              We use premium archival-quality paper to preserve your memories
              for generations.
            </p>
          </details>

          
          <details className="group border-b border-[#E6E6E6]">
            <summary className="flex items-center justify-between py-8 cursor-pointer list-none">
              <span className="text-[18px] text-[#121212]">
                Do you offer international shipping?
              </span>

              <div className="w-11 h-11 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[28px] text-[#444444] group-open:rotate-45 transition">
                +
              </div>
            </summary>

            <p className="pb-8 pr-16 text-[16px] leading-8 text-[#666666]">
              Currently we deliver across India. International shipping will be
              available soon.
            </p>
          </details>

          
          <details className="group border-b border-[#E6E6E6]">
            <summary className="flex items-center justify-between py-8 cursor-pointer list-none">
              <span className="text-[18px] text-[#121212]">
                What happens if my book is damaged?
              </span>

              <div className="w-11 h-11 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[28px] text-[#444444] group-open:rotate-45 transition">
                +
              </div>
            </summary>

            <p className="pb-8 pr-16 text-[16px] leading-8 text-[#666666]">
              If your MemoryBook arrives damaged, we'll replace it free of
              charge.
            </p>
          </details>

        </div>

      </div>
    </section>
  );
}