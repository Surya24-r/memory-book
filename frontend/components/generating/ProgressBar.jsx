export default function ProgressBar({ progress }) {
  return (
    <div className="w-full mt-8">

      <div className="w-full h-[8px] bg-[#E7E7E7] rounded-full overflow-hidden">

        <div
          className="h-full bg-[#F4B323] rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-4 flex justify-between">

        <span className="text-[15px] text-[#777777]">
          Generating...
        </span>

        <span className="text-[18px] font-semibold">
          {progress}%
        </span>

      </div>

    </div>
  );
} 