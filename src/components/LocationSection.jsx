import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarkedAlt, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

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
    <section className="w-full py-24 px-4 md:px-12 bg-[#f7f7f7] dark:bg-gray-900 transition-colors duration-500 relative">
      {/* Section Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-orange-500 dark:text-orange-400 drop-shadow-lg flex items-center justify-center gap-3">
        <FaMapMarkerAlt className="text-5xl" />
        Our Location
      </h2>

      {/* Card */}
      <motion.div
        className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 relative z-10 transition-colors duration-500"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Info Section */}
        <motion.div
          className="space-y-6 flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-500">
            <strong className="text-orange-500 dark:text-orange-400">
              Address:
            </strong>
            <br />
            250 Front Street West,
            <br />
            Toronto, ON M5V 3G5,
            <br />
            Canada
          </p>

          <motion.a
            href="https://www.google.com/maps/dir/?api=1&destination=43.65107,-79.347015"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 border-2 border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            <FaMapMarkedAlt className="text-lg" />
            Navigate with Google Maps
          </motion.a>
        </motion.div>

        {/* Map Section */}
        <motion.div
          className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[350px] md:h-[400px] shadow-xl transition-colors duration-500"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
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
              <Popup className="dark:text-black">
                We are located here in Toronto!
              </Popup>
            </Marker>
          </MapContainer>
        </motion.div>
      </motion.div>

      {/* Optional: Background Glow */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-orange-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}
