import Image from "next/image";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="w-full bg-[#FAF9F7] py-20">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="bg-[#F8C53A] rounded-[40px] px-20 py-16 flex items-center justify-between">

          {/* Left Side */}
          <div>
            <h2 className="text-[64px] leading-none font-serif text-[#121212]">
              Ready to hold your story?
            </h2>

            <p className="mt-6 text-[24px] leading-10 text-[#4A4A4A] ">
              Start designing your MemoryBook today. Free preview
              <br />
              — pay only when you love it.
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            <Link
              href="/custom"
              className="bg-[#121212] text-white px-12 py-5 rounded-full text-[20px] font-medium hover:bg-black transition"
            >
              Start Designing
            </Link>

            <Link
              href="/contact"
              className="bg-[#FFE69A] text-[#121212] px-12 py-5 rounded-full text-[20px] font-medium border border-[#E5C764]"
            >
              Talk to us
            </Link>
          

          </div>

        </div>
      </div>
    </section>
  );
}