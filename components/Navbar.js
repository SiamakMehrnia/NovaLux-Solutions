import { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    console.log(`Scrolling to: ${sectionId}`);
    console.log("Section found:", section);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.warn(`Section with id "${sectionId}" not found`);
    }

    setIsOpen(false); // بستن منو پس از کلیک
  };

  const menuItems = [
    { id: "home", name: "Home" },
    { id: "projects", name: "Projects" },
    { id: "about", name: "About Us" },
    { id: "contact", name: "Contact" },
  ];

  return (
    <nav className="bg-[#1f1f1f] text-white fixed w-full z-50 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto h-16 px-6">
        {/* Logo */}
        <h1
          className="text-xl font-semibold cursor-pointer"
          onClick={() => scrollToSection("home")}
        >
          NovaLux-Solutions
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="text-lg cursor-pointer hover:text-gray-300 transition duration-300"
              onClick={() => scrollToSection(item.id)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden cursor-pointer p-2 z-50" onClick={toggleMenu}>
          {isOpen ? <X size={30} /> : <Menu size={34} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-16 left-0 w-full bg-[#1f1f1f] text-white flex flex-col items-center z-40 py-4"
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="py-3 cursor-pointer hover:text-gray-300 transition duration-300 w-full text-center"
                onClick={() => scrollToSection(item.id)}
              >
                {item.name}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
