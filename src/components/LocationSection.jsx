import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LocationSection() {
  const position = [43.65107, -79.347015]; // Toronto, Canada

  return (
    <section className="bg-[#001f45] text-gray-200 px-6 py-12 rounded-xl shadow-lg">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Info Section */}
        <div className="space-y-5">
          <h2 className="text-4xl font-bold text-white flex items-center gap-3">
            <FaMapMarkerAlt className="text-orange-500 text-3xl" />
            Our Location
          </h2>
          <p className="text-lg leading-relaxed">
            <strong className="text-orange-400">Address:</strong>
            <br />
            250 Front Street West,
            <br />
            Toronto, ON M5V 3G5,
            <br />
            Canada
          </p>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=43.65107,-79.347015"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition"
          >
            Navigate with Google Maps
          </a>
        </div>

        {/* Map Section */}
        <div className="rounded-lg overflow-hidden border border-gray-600 h-[300px] md:h-[350px]">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>We are located here in Toronto!</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
