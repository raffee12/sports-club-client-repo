import { useState } from "react";

function CourtCard({ court, onBook }) {
  const slots =
    Array.isArray(court.slots) && court.slots.length > 0
      ? court.slots
      : ["No slots available"];

  const [selectedSlot, setSelectedSlot] = useState(slots[0]);
  const [imageUrl, setImageUrl] = useState(court.image?.trim() || "");

  const handleImageError = () => {
    // No fallback – just clear the src if it errors
    setImageUrl("");
  };

  return (
    <div className="bg-[#001f45] rounded-lg shadow-lg overflow-hidden text-gray-200 flex flex-col w-full max-w-md mx-auto">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={court.name || "Court Image"}
          className="h-48 w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="h-48 w-full bg-gray-800 flex items-center justify-center text-sm text-gray-400 italic">
          No Image
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-1">
          {court.name || "Unnamed Court"}
        </h3>
        <p className="mb-2 text-orange-400 font-semibold">
          {court.type || "Type not specified"}
        </p>

        <label
          className="mb-1 block font-medium"
          htmlFor={`slot-select-${court._id || court.id}`}
        >
          Select Slot
        </label>
        <select
          id={`slot-select-${court._id || court.id}`}
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="mb-3 rounded px-2 py-1 text-black"
          disabled={slots[0] === "No slots available"}
        >
          {slots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <p className="mb-4 font-semibold">
          Price per session: $
          {typeof court.pricePerSession === "number"
            ? court.pricePerSession
            : "N/A"}
        </p>

        <button
          onClick={() => onBook(selectedSlot)}
          className="mt-auto bg-orange-600 hover:bg-orange-700 rounded py-2 text-white font-semibold transition"
          disabled={slots[0] === "No slots available"}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default CourtCard;
