import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="w-full bg-[#FAF9F7] py-28">
      <div className="max-w-[1440px] mx-auto px-10">
    
        <div className="text-center">
          <p className="text-[13px] tracking-[5px] uppercase text-[#F3B719] font-medium">
            Trusted by Storytellers
          </p>

          <h2 className="mt-5 text-[68px] leading-[1.05] font-serif text-[#121212]">
            Loved by families across India.
          </h2>
        </div>

        
        <div className="mt-20 flex justify-center gap-8">

          <div className="w-[430px] min-h-[350px] bg-white rounded-[32px] border border-[#ECECEC] px-10 py-11 shadow-[0_15px_35px_rgba(0,0,0,0.04)] flex flex-col">
            <p className="text-[#F3B719] text-[18px] tracking-[3px]">★★★★★</p>

            <p className="mt-8 text-[17px] leading-[1.6] italic text-[#121212]">
              "I had 3,000 photos of my baby's first year. MemoryBook organized
              them into the most beautiful book in five minutes."
            </p>

            <div className="mt-auto pt-6 border-t border-[#ECECEC]">
              <h3 className="text-[17px] font-semibold text-[#121212]">
                Ananya Sharma
              </h3>
              <p className="mt-2 text-[13px] tracking-[2px] uppercase text-[#777]">
                NEW PARENT · BENGALURU
              </p>
            </div>
          </div>

          
          <div className="w-[430px] min-h-[350px] bg-white rounded-[32px] border border-[#ECECEC] px-10 py-11 shadow-[0_15px_35px_rgba(0,0,0,0.04)] flex flex-col">
            <p className="text-[#F3B719] text-[18px] tracking-[3px]">★★★★★</p>

            <p className="mt-8 text-[17px] leading-[1.6] italic text-[#121212]">
              "As a wedding photographer, the paper quality and color accuracy
              are the best I've seen at this price point."
            </p>

            <div className="mt-auto pt-6 border-t border-[#ECECEC]">
              <h3 className="text-[17px] font-semibold text-[#121212]">
                Vikram Singh
              </h3>
              <p className="mt-2 text-[13px] tracking-[2px] uppercase text-[#777]">
                STUDIO OWNER · DELHI
              </p>
            </div>
          </div>

    
          <div className="w-[430px] min-h-[350px] bg-white rounded-[32px] border border-[#ECECEC] px-10 py-11 shadow-[0_15px_35px_rgba(0,0,0,0.04)] flex flex-col">
            <p className="text-[#F3B719] text-[18px] tracking-[3px]">★★★★★</p>

            <p className="mt-8 text-[17px] leading-[1.6] italic text-[#121212]">
              "The gold foil cover feels incredibly premium. It's the
              centerpiece of our living room now."
            </p>

            <div className="mt-auto pt-6 border-t border-[#ECECEC]">
              <h3 className="text-[17px] font-semibold text-[#121212]">
                Priya Menon
              </h3>
              <p className="mt-2 text-[13px] tracking-[2px] uppercase text-[#777]">
                TRAVEL WRITER · KOCHI
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}