import Image from "next/image";

export default function TrendingCard({ image, alt }) {
  return (
    <div className="min-w-[300px] h-[200px] rounded-[20px] overflow-hidden flex-shrink-0 cursor-pointer group">
      <Image
        src={image}
        alt={alt}
        width={300}
        height={200}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}