import Image from "next/image";

export default function Theme() {
  return (
    <section className="w-full bg-[#F7F6F4]">
      <div className="max-w-[1440px] mx-auto px-10 py-[80px]">
        <div>
          <p className="text-[11px] font-semibold tracking-[3px] text-[#E9A900]">
            CURATED THEMES
          </p>

          <h2 className="mt-4 text-[52px] leading-[1.02] text-[#121212]">
            Designed by artists to match
            <br />
            the mood of your memories.
          </h2>
        </div>

        <div className="mt-[75px] grid grid-cols-4 gap-[24px]">
          <div className="relative  rounded-[28px] overflow-hidden">
            <Image
              src="/images/EverlastingWedding.svg"
              alt="Wedding-c"
              width={330}
              height={390}
              className="object-contain"
            />

        
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        
            <div className="absolute left-[24px] bottom-[25px]">
              <p className="text-[#F6BE24] text-[11px] font-semibold tracking-[2px]">
                01
              </p>

              <h3 className="mt-2 text-white text-[23px] leading-none">
                EverLasting Wedding
              </h3>
            </div>
            
          </div>
          <div className="relative  rounded-[28px] overflow-hidden">
            <Image
              src="/images/baby.svg"
              alt="Baby-c"
              width={330}
              height={386}
              className="object-contain"
            />

            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        
            <div className="absolute left-[24px] bottom-[25px]">
              <p className="text-[#F6BE24] text-[11px] font-semibold tracking-[2px]">
                02
              </p>

              <h3 className="mt-2 text-white text-[23px] leading-none">
                First Steps
              </h3>
            </div>
            
          </div>
          <div className="relative  rounded-[28px] overflow-hidden">
            <Image
              src="/images/Wanderlust.svg"
              alt="Wanderlust-c"
              width={322}
              height={386}
              className="object-contain"
            />

        
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

            
            <div className="absolute left-[24px] bottom-[25px]">
              <p className="text-[#F6BE24] text-[11px] font-semibold tracking-[2px]">
                03
              </p>

              <h3 className="mt-2 text-white text-[23px] leading-none">
                Wanderlust
              </h3>
            </div>
            
          </div>
          <div className="relative  rounded-[28px] overflow-hidden">
            <Image
              src="/images/Family.svg"
              alt="Family-c"
              width={322}
              height={386}
              className="object-contain"
            />

        
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

            
            <div className="absolute left-[24px] bottom-[25px]">
              <p className="text-[#F6BE24] text-[11px] font-semibold tracking-[2px]">
                04
              </p>

              <h3 className="mt-2 text-white text-[23px] leading-none">
                Family Chronicle
              </h3>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
