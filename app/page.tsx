import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import ClientLoader from "@/components/ClientLoader";

export default function Home() {
  return (
    <>
      <ClientLoader />
      
      {/* The New Gamified Navbar */}
      <Navbar />

      <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
        
        {/* Inject our Animated Landing Page */}
        <div className="flex-1 w-full flex flex-col items-center">
          <LandingPage />
        </div>

        {/* Minimalist Professional Footer */}
        <footer className="w-full flex flex-col md:flex-row items-center justify-between border-t border-white/5 px-10 py-12 text-xs text-neutral-500 bg-black">
          <div className="mb-4 md:mb-0">
            <p className="font-medium text-neutral-400">NSBM GREEN UNIVERSITY</p>
            <p>© 2026 Hackathon Hub. Built for the future.</p>
          </div>
          
          <div className="flex gap-8 items-center uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </footer>
      </main>
    </>
  );
}