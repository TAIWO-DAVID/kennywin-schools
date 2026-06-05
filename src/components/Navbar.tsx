import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section id="home" className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold">Landing Page</h1>
      </section>
      <section id="about" className="h-screen bg-gray-200">About Section</section>
      <section id="services" className="h-screen bg-gray-300">Services</section>
      <section id="contact" className="h-screen bg-gray-400">Contact</section>
    </main>
  );
}
