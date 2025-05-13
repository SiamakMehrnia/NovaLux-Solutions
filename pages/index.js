import AboutUs from "@/components/AboutUs";
import Navbar from "@/components/Navbar";
import Intro from "@/components/Intro";
import Projects from "@/components/Projects";
import ContactsUs from "@/components/ContactsUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
<>
<Navbar />
<Intro />
<Projects />
<AboutUs />
<ContactsUs />
<Footer />
</>
  );
}
