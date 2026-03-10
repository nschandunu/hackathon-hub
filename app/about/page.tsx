import Navbar from "@/components/Navbar";
import AboutPage from "@/components/AboutPage";
import ClientLoader from "@/components/ClientLoader";
import { getAllEvents } from "@/app/actions/public-events";

export default async function About() {
  let events: Awaited<ReturnType<typeof getAllEvents>> = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <ClientLoader>
      {/* The Navigation */}
      <Navbar />

      <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">

        {/* About Page Content */}
        <div className="flex-1 w-full flex flex-col items-center">
          <AboutPage events={events} />
        </div>
      </main>
    </ClientLoader>
  );
}
