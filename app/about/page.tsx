import Navbar from "@/components/Navbar";
import AboutPage from "@/components/AboutPage";
import ClientLoader from "@/components/ClientLoader";
import { getAllEvents } from "@/app/actions/public-events";
import { getBoardMembers } from "@/app/actions/public-board";

export default async function About() {
  let events: Awaited<ReturnType<typeof getAllEvents>> = [];
  let boardMembers: Awaited<ReturnType<typeof getBoardMembers>> = [];

  try {
    const [eventsData, boardMembersData] = await Promise.all([
      getAllEvents(),
      getBoardMembers()
    ]);
    events = eventsData;
    boardMembers = boardMembersData;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  return (
    <ClientLoader>
      {/* The Navigation */}
      <Navbar />

      <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">

        {/* About Page Content */}
        <div className="flex-1 w-full flex flex-col items-center">
          <AboutPage events={events} boardMembers={boardMembers} />
        </div>
      </main>
    </ClientLoader>
  );
}
