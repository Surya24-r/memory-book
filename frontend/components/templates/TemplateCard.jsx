import Image from "next/image";

export default function TemplateCard({ image, alt }) {
  return (
    <div className="mb-5 break-inside-avoid cursor-pointer group">
      <div className="overflow-hidden rounded-[20px]">
        <Image
          src={image}
          alt={alt}
          width={500}
          height={500}
          className="w-full h-auto rounded-[20px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
}