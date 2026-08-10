import UploadCard from "./UploadCard";

export default function UploadGallery({ photos, onDelete }) {
  return (
    <div className="mt-12">
      <p className="text-[11px] tracking-[2px] uppercase font-semibold text-[#888888] mb-6">
        Your Uploads ({photos.length})
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {photos.map((photo) => (
          <UploadCard
            key={photo.id}
            photo={photo}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}