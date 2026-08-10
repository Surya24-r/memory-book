import Image from "next/image";
import Link from "next/link";

export default function TemplatesHero() {
  return (
    <section className="w-full bg-[#FAF9F7] pt-14 pb-10">
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        <p className="uppercase tracking-[3px] text-[11px] font-semibold text-[#F4B61E]">
          CHOOSE YOUR CANVAS
        </p>

        <h1 className="mt-3 text-[52px] leading-[60px] text-[#111111]">
          What will you design today?
        </h1>

        <p className="mt-4 text-[18px] text-[#666666]">
          Every memory deserves the right format. Pick what feels like home.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/templates">
            <button className="flex items-center gap-2 border border-[#E5E5E5] rounded-full px-6 py-3 bg-white hover:bg-[#FFF9E8] transition">
              <Image
                src="/images/templatesicon.svg"
                alt=""
                width={18}
                height={18}
              />
              <span className="text-[15px]">Templates</span>
            </button>
          </Link>

          <Link href="/custom">
            <button className="flex items-center gap-2 border border-[#E5E5E5] rounded-full px-6 py-3 bg-white hover:bg-[#FFF9E8] transition">
              <Image
                src="/images/customicon.svg"
                alt=""
                width={18}
                height={18}
              />
              <span className="text-[15px]">Custom</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
