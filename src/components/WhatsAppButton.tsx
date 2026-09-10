export default function WhatsAppButton() {
  const whatsappNumber = "+96541103254";
  const message = "Hi! I'd like to know more about your services.";

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contact us on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
      <span className="absolute inset-[-6px] rounded-full border-2 border-[#25D366] opacity-20 animate-pulse" />

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-transform duration-200 group-hover:scale-110">
        {/* Official WhatsApp logo SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-8 w-8"
          fill="white"
        >
          <path d="M4.868 43.303l2.694-9.835a18.858 18.858 0 0 1-2.52-9.457C5.044 13.668 13.731 5 24.394 5c5.17.002 10.027 2.016 13.687 5.676a19.17 19.17 0 0 1 5.667 13.702c-.004 10.668-8.693 19.336-19.354 19.336a19.38 19.38 0 0 1-9.265-2.357L4.868 43.303zm10.733-6.187l.59.35a16.084 16.084 0 0 0 8.196 2.247c8.892 0 16.12-7.228 16.124-16.112a16.071 16.071 0 0 0-4.727-11.444 16.072 16.072 0 0 0-11.397-4.731c-8.9 0-16.128 7.228-16.132 16.11a16.08 16.08 0 0 0 2.473 8.603l.384.611-1.634 5.966 6.123-1.6zm18.122-9.303c-.122-.204-.445-.325-.93-.57-.486-.246-2.876-1.417-3.32-1.582-.447-.163-.772-.245-1.098.245-.324.49-1.26 1.582-1.544 1.907-.285.325-.57.366-1.055.122-.487-.245-2.056-.758-3.917-2.417-1.45-1.291-2.426-2.886-2.712-3.372-.285-.487-.03-.75.214-.993.22-.218.487-.57.73-.855.244-.285.325-.49.488-.815.162-.325.08-.612-.04-.857-.123-.245-1.098-2.643-1.504-3.618-.397-.95-.8-.82-1.098-.835a19.9 19.9 0 0 0-.936-.017c-.325 0-.854.122-1.3.612-.447.488-1.707 1.66-1.707 4.057 0 2.397 1.748 4.712 1.99 5.037.245.325 3.437 5.245 8.329 7.352 1.163.503 2.072.803 2.78 1.027 1.167.372 2.23.32 3.07.193.936-.14 2.876-1.175 3.28-2.31.406-1.134.406-2.107.284-2.31z" />
        </svg>
      </span>
    </button>
  );
}
