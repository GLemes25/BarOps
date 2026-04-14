import { getEvents } from "@/actions/event-actions";
import { EventsTable } from "./events-table";

const EventsPage = async () => {
  const events = await getEvents();

  return <EventsTable initialData={events} />;
};

export default EventsPage;
