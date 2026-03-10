import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import ClientLoader from "@/components/ClientLoader";
import { getAllEvents } from "@/app/actions/public-events";

export default async function Home() {
  let events: Awaited<ReturnType<typeof getAllEvents>> = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <ClientLoader>
      {/* The New Gamified Navbar */}
      <Navbar />

      <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
        {/* Inject our Animated Landing Page */}
        <div className="flex-1 w-full flex flex-col items-center">
          <LandingPage events={events} />
        </div>
      </main>
    </ClientLoader>
  );
}