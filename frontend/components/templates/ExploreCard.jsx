import Image from "next/image";

export default function ExploreCard({ title, image }) {
  return (
    <div className="bg-[#FFF6D9] rounded-[18px] overflow-hidden h-[88px] flex items-center justify-between cursor-pointer hover:shadow-md transition">

      <div className="px-5">
        <p className="text-[15px] font-medium text-[#111111] leading-5">
          {title}
        </p>
      </div>

      <Image
        src={image}
        alt={title}
        width={92}
        height={88}
        className="h-full w-[92px] object-cover"
      />

    </div>
  );
}