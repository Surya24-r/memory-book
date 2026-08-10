import Image from "next/image";

export default function Trust() {
  return (
    <section className="w-full bg-white py-0">
      <div className="max-w-[1230px] mx-auto bg-[#111111] rounded-[30px] overflow-hidden">
        <div className="grid grid-cols-2 min-h-[650px]">
          {/* LEFT SIDE */}
          <div className="px-[64px] py-[65px]">
            {/* Trust label */}
            <div className="inline-flex bg-[#F6BE24] rounded-full px-4 py-[6px]">
              <span className="text-[10px] font-bold tracking-[3px] text-black">
                TRUST
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-7 text-white text-[48px] leading-[1.05] italic font-serif">
              Printed by the lab your
              <br />
              family already trusts
            </h2>

            {/* FEATURES */}
            <div className="mt-12">
              {/* Feature 1 */}
              <div className="flex gap-6 pb-7">
                <div className="shrink-0 w-[44px] h-[44px] rounded-full bg-[#F6BE24] flex items-center justify-center text-[16px] text-black">
                  1
                </div>

                <div>
                  <h3 className="text-white text-[16px] font-semibold">
                    In-house printing &amp; binding
                  </h3>

                  <p className="mt-2 text-[#929292] text-[16px] leading-[1.55]">
                    We control the entire process from the first pixel to the
                    final stitch in our Kumbakonam facility.
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#777777] my-5" />

              {/* Feature 2 */}
              <div className="flex gap-6 py-2">
                <div className="shrink-0 w-[44px] h-[44px] rounded-full bg-[#F6BE24] flex items-center justify-center text-[16px] text-black">
                  2
                </div>

                <div>
                  <h3 className="text-white text-[16px] font-semibold">
                    Fade-safe archival inks
                  </h3>

                  <p className="mt-2 text-[#929292] text-[16px] leading-[1.55]">
                    Your memories deserve to last generations. We use only
                    premium pigment inks designed for 100+ years.
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#777777] my-5" />

              {/* Feature 3 */}
              <div className="flex gap-6 pt-2">
                <div className="shrink-0 w-[44px] h-[44px] rounded-full bg-[#F6BE24] flex items-center justify-center text-[16px] text-black">
                  3
                </div>

                <div>
                  <h3 className="text-white text-[16px] font-semibold">
                    Reprint guarantee on defects
                  </h3>

                  <p className="mt-2 text-[#929292] text-[16px] leading-[1.55]">
                    Not happy with the craftsmanship? We will reprint your book
                    for free, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-[48px] pl-[25px]">
            <div className="grid grid-cols-2 gap-3 h-full">
              {/* TALL LEFT IMAGE */}
              <div className="relative min-h-[560px] rounded-[24px] overflow-hidden">
                <Image
                  src="/images/Books.svg"
                  alt="Stack of printed memory books"
                  fill
                  className="object-cover"
                />
              </div>

              {/* RIGHT TWO IMAGES */}
              <div className="grid grid-rows-2 gap-3">
                <div className="relative rounded-[24px] overflow-hidden">
                  <Image
                    src="/images/Binding.svg"
                    alt="Book binding process"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="relative rounded-[24px] overflow-hidden">
                  <Image
                    src="/images/Printing.svg"
                    alt="Photo book printing process"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
