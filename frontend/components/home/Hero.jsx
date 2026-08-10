import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="max-w-[1440px] mx-auto px-10 py-20">
        <div className="flex items-center justify-between gap-16">
          <div className="w-[55%]">
            <div className="inline-flex items-center gap-2 border border-[#F3C238]/40 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#F3C238] rounded-full"></span>

              <span className="text-[11px] font-semibold tracking-[3px] text-[#333333]">
                AI-POWERED · PRINTED IN INDIA
              </span>
            </div>
            <h1 className="mt-8 text-[64px] leading-[1.05] text-[#121212]">
              Your life is a story
              <br />
              worth {" "}
              <span className="text-[#F3B719] italic">holding</span>.
            </h1>
            <p className="mt-8 max-w-[650px] text-[18px] leading-8 text-[#666666]">
              Turn thousands of photos into a professionally designed,
              heirloom-quality photo book. AI curates the story. You add the
              final touch.
            </p>
            <Link href="/templates">
            <button className="mt-8 bg-[#F6BE24] text-[#121212] px-8 py-4 rounded-full text-[16px] font-medium cursor-pointer hover:bg-[#F3B719] transition-all duration-300">
              Create your own book
              <span className="ml-5">→</span>
            </button>
            </Link>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-2">
                <Image
                  src="/images/Ellipse 4.svg"
                  alt="Customer"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                />

                <Image
                  src="/images/Ellipse 5.svg"
                  alt="Customer"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                />

                <Image
                  src="/images/Ellipse 6.svg"
                  alt="Customer"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                />
              </div>
              <p className="text-[11px] font-medium tracking-[2.5px] text-[#555555]">
                TRUSTED BY 12,000+ FAMILIES
              </p>
            </div>
        </div>
            <div className="w-[45%] flex justify-center">
              <Image
                src="/images/Hero.svg"
                alt="Photo Album"
                width={520}
                height={620}
                className="w-full max-w-[500px] rounded-[28px] object-cover"
                priority
              />
            </div>
          </div>
        
      </div>
    </section>
  );
}
