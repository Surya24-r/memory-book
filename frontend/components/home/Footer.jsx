import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F7F5F2] border-t border-[#E8E8E8]">
      <div className="max-w-[1280px] mx-auto px-8 pt-16 pb-8">

        <div className="grid grid-cols-4 gap-16">

          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">

              <Image
                src="/images/Group 1.svg"
                alt="MemoryBook Logo"
                width={36}
                height={36}
              />

              <span className="font-audiowide text-[20px]">
                MemoryBook
              </span>

            </div>

            <p className="mt-6 text-[16px] leading-8 text-[#666666] max-w-[310px]">
              Crafted with care by Sri Venkateshwara Photo Studio &
              Colour Lab. Preserving family stories,
              one page at a time.
            </p>

          </div>

          {/* Explore */}

          <div>

            <h4 className="uppercase tracking-[2px] text-[12px] text-[#777777] font-semibold">
              Quick Links
            </h4>

            <div className="mt-5 flex flex-col gap-4 text-[16px] text-[#222222]">

              <Link href="/faq">
                FAQ
              </Link>

              <Link href="/contact">
                Contact
              </Link>

              <Link href="/pricing">
                Pricing
              </Link>

            </div>

          </div>

          {/* Legal */}

          <div>

            <h4 className="uppercase tracking-[2px] text-[12px] text-[#777777] font-semibold">
              Legal
            </h4>

            <div className="mt-5 flex flex-col gap-4 text-[16px] text-[#222222]">

              <Link href="/">
                Privacy
              </Link>

              <Link href="/">
                Terms
              </Link>

              <Link href="/">
                Refund Policy
              </Link>

              <Link href="/">
                Help Center
              </Link>

            </div>

          </div>

          {/* Company */}

          <div>

            <h4 className="uppercase tracking-[2px] text-[12px] text-[#777777] font-semibold">
              Company
            </h4>

            <div className="mt-5 flex flex-col gap-4 text-[16px] text-[#222222]">

              <Link href="/contact">
                Contact
              </Link>

              <Link href="/">
                Privacy
              </Link>

              <Link href="/">
                Terms
              </Link>

              <Link href="/">
                Returns
              </Link>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-14 border-t border-[#E5E5E5] pt-6 flex items-center justify-between">

          <p className="uppercase tracking-[2px] text-[12px] text-[#777777]">
            © 2026 SRI VENKATESHWARA PHOTO STUDIO & COLOUR LAB.
          </p>

          <p className="uppercase tracking-[2px] text-[12px] text-[#777777]">
            DEVELOPED BY INTERASOUL PRIVATE LIMITED
          </p>

        </div>

      </div>
    </footer>
  );
}