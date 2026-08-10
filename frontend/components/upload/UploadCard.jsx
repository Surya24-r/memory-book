import Image from "next/image";

export default function UploadCard({ photo, onDelete }) {
  const imageSrc = photo.preview || photo.url;

  return (
    <div className="relative group rounded-[16px] overflow-hidden aspect-square border border-[#EBEBEB] bg-[#F9F9F9] shadow-sm">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="Uploaded photo"
          fill
          className="object-cover"
          unoptimized
        />
      )}

      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(photo.id);
          }}
          className="w-7 h-7 rounded-full bg-white/90 text-[#111111] font-medium flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-md text-sm"
          title="Delete photo"
        >
          ✕
        </button>
      </div>
    </div>
  );
}