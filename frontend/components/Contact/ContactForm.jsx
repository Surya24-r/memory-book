"use client";

export default function ContactForm() {
  return (
    <section className="w-full bg-[#FAF9F7] py-20">
      <div className="max-w-[1280px] mx-auto px-8">

        <div className="grid grid-cols-2 gap-24">

          {/* Left */}

          <div>

            <p className="text-[12px] uppercase tracking-[3px] text-[#F3B719] font-medium">
              SAY HELLO
            </p>

            <h2 className="mt-4 text-[48px] leading-[56px] text-[#111111]">
              We'd love to hear from you.
            </h2>

            <p className="mt-5 text-[16px] leading-8 text-[#666666] max-w-[420px]">
              Have a question, a bulk order, or want to partner with our
              lab? Drop us a note and we'll respond within 24 hours.
            </p>

            <div className="mt-14 space-y-10">

              <div>
                <p className="uppercase tracking-[2px] text-[12px] text-[#777777]">
                  STUDIO
                </p>

                <p className="mt-2 text-[18px] leading-8 text-[#111111]">
                  Sri Venkateshwara Photo Studio &
                  <br />
                  Colour Lab
                </p>
              </div>

              <div>
                <p className="uppercase tracking-[2px] text-[12px] text-[#777777]">
                  EMAIL
                </p>

                <p className="mt-2 text-[18px] text-[#111111]">
                  hello@memorybook.in
                </p>
              </div>

              <div>
                <p className="uppercase tracking-[2px] text-[12px] text-[#777777]">
                  PHONE / WHATSAPP
                </p>

                <p className="mt-2 text-[18px] text-[#111111]">
                  +91 98765 43210
                </p>
              </div>

              <div>
                <p className="uppercase tracking-[2px] text-[12px] text-[#777777]">
                  HOURS
                </p>

                <p className="mt-2 text-[18px] text-[#111111]">
                  Mon – Sat · 10am – 8pm IST
                </p>
              </div>

            </div>

          </div>

          {/* Right */}

          <div className="border border-[#E8E8E8] rounded-[32px] bg-white p-9">

            <form className="space-y-6">

              <div>

                <label className="block text-[12px] uppercase tracking-[2px] text-[#666666] mb-3">
                  NAME
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full h-12 rounded-full border border-[#E5E5E5] px-5 text-[16px] placeholder:text-[#A0A0A0] outline-none focus:border-[#F3B719]"
                />

              </div>

              <div>

                <label className="block text-[12px] uppercase tracking-[2px] text-[#666666] mb-3">
                  EMAIL
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 rounded-full border border-[#E5E5E5] px-5 text-[16px] placeholder:text-[#A0A0A0] outline-none focus:border-[#F3B719]"
                />

              </div>

              <div>

                <label className="block text-[12px] uppercase tracking-[2px] text-[#666666] mb-3">
                  MESSAGE
                </label>

                <textarea
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full rounded-[24px] border border-[#E5E5E5] px-5 py-4 text-[16px] placeholder:text-[#A0A0A0] outline-none resize-none focus:border-[#F3B719]"
                />

              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-full bg-[#F9DE8A] hover:bg-[#F6D468] transition font-medium text-[18px] text-[#111111]"
              >
                Send message
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}