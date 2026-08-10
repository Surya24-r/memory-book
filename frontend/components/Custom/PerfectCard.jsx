import Image from "next/image";

export default function PerfectCard({
  image,
  title,
  pages,
  price,
}) {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden rounded-[20px] bg-white">
        <Image
          src={image}
          alt={title}
          width={500}
          height={700}
          className="w-full h-auto rounded-[20px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-[20px] font-semibold text-[#111111]">
          {title}
        </h3>

        <p className="mt-2 text-[15px] text-[#666666]">
          {pages}
        </p>

        <p className="mt-1 text-[16px] font-medium text-[#111111]">
          {price}
        </p>
      </div>
    </div>
  );
}