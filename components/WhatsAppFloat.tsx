import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/94784860781?text=Hello%20BIONZ%20Trading!%20I%20have%20a%20question%20about%20your%20services." 
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center justify-center"
    >
      <FaWhatsapp size={30} />
    </a>
  );
}
