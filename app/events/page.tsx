import Navbar from "@/components/Navbar";
import ClientLoader from "@/components/ClientLoader";
import EventsPage from "@/components/EventsPage";
import { getAllEvents } from "@/app/actions/public-events";
import GlassSurface from "@/components/glass-surface";

export const metadata = {
  title: "Events | Hackathon Hub",
  description:
    "Browse all hackathons, workshops, and tech gatherings from Hackathon Hub NSBM.",
};

export default async function Events() {
  let events: Awaited<ReturnType<typeof getAllEvents>> = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <>
      <ClientLoader />
      <Navbar />
      <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
        <div className="flex-1 w-full flex flex-col items-center">
          <EventsPage events={events} />
        </div>
      </main>
    </>
  );
}
