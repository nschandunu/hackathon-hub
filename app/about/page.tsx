import Navbar from "@/components/Navbar";
import AboutPage from "@/components/AboutPage";
import ClientLoader from "@/components/ClientLoader";

export default function About() {
  return (
    <>
      <ClientLoader />
      
      {/* The Navigation */}
      <Navbar />

      <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
        
        {/* About Page Content */}
        <div className="flex-1 w-full flex flex-col items-center">
          <AboutPage />
        </div>
      </main>
    </>
  );
}
