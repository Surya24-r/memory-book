import Image from "next/image";

export default function Work() {
  return (
    <section className="w-full bg-white border-t border-[#E4E4E4]">
      <div className="max-w-[1440px] mx-auto px-10 pt-[90px] pb-[140px]">

        {/* Heading */}
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[4px] text-[#777777]">
            HOW IT WORKS
          </p>

          <h2 className="mt-5 text-[52px] leading-[1.05] text-[#121212]">
            Three calm steps to your
            <br />
            heirloom
          </h2>
        </div>

        {/* Cards */}
        <div className="mt-[75px] grid grid-cols-3 gap-[60px] max-w-[1050px] mx-auto">

          {/* CARD 01 */}
          <div className="h-[220px] rounded-[24px] border border-[#E8E8E8] px-[28px] py-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.08)]">

            <div className="flex items-start justify-between">

              <Image
                src="/images/camera.svg"
                alt="Upload photos"
                width={84}
                height={84}
                className="w-[84px] h-[84px]"
              />

              <Image
                src="/images/01.svg"
                alt="Step 01"
                width={44}
                height={27}
                className="mt-[12px]"
              />

            </div>

            <h3 className="mt-[4px] text-[20px] font-semibold text-[#121212]">
              Upload photos
            </h3>

            <p className="mt-[7px] text-[14px] leading-[22px] text-[#777777]">
              Drop your temple &amp; darshan
              <br />
              photos.
            </p>
          </div>


          {/* CARD 02 */}
          <div className="h-[220px] rounded-[24px] border border-[#E8E8E8] px-[28px] py-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.08)]">

            <div className="flex items-start justify-between">

              <Image
                src="/images/blis.svg"
                alt="Auto-designed"
                width={84}
                height={84}
                className="w-[84px] h-[84px]"
              />

              <Image
                src="/images/02.svg"
                alt="Step 02"
                width={44}
                height={27}
                className="mt-[12px]"
              />

            </div>

            <h3 className="mt-[4px] text-[20px] font-semibold text-[#121212]">
              Auto-designed
            </h3>

            <p className="mt-[7px] text-[14px] leading-[22px] text-[#777777]">
              We lay out every page for
              <br />
              you.
            </p>
          </div>


          {/* CARD 03 */}
          <div className="h-[220px] rounded-[24px] border border-[#E8E8E8] px-[28px] py-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.08)]">

            <div className="flex items-start justify-between">

              <Image
                src="/images/square.svg"
                alt="Printed and delivered"
                width={84}
                height={84}
                className="w-[84px] h-[84px]"
              />

              <Image
                src="/images/03.svg"
                alt="Step 03"
                width={44}
                height={27}
                className="mt-[12px]"
              />

            </div>

            <h3 className="mt-[4px] text-[20px] font-semibold text-[#121212]">
              Printed &amp; Delivered
            </h3>

            <p className="mt-[7px] text-[14px] leading-[22px] text-[#777777]">
              Hand-bound &amp; shipped in
              <br />
              7–10 days.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}