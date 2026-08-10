import Image from "next/image";

export default function TemplateCard({ image, alt }) {
  return (
    <div className="break-inside-avoid mb-5 cursor-pointer">
      <Image
        src={image}
        alt={alt}
        width={300}
        height={400}
        className="w-full rounded-[16px] object-cover hover:scale-[1.02] transition-transform duration-300"
      />
    </div>
  );
}