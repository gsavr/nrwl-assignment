import React, { useEffect, useMemo, useState } from "react";
import { AddTicket } from "./AddTicket";
import { firstValueFrom } from "rxjs";
import { BackendService, Ticket } from "../../backend";
import { Link } from "react-router-dom";

interface TicketsListProps {
  backend: BackendService;
}

export const TicketsList = ({ backend }: TicketsListProps) => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  //fetch list of tickets from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await firstValueFrom(backend.tickets());
      setLoading(false);
      setTickets(result);
    };
    fetchData();
  }, [backend]);

  //filter for tickets - all, open, or closed tickets
  const displayTickets = useMemo(() => {
    if (filter === "all") {
      return tickets;
    } else if (filter === "open") {
      return tickets.filter((ticket) => ticket.completed === false);
    } else if (filter === "closed") {
      return tickets.filter((ticket) => ticket.completed === true);
    }
  }, [filter, tickets]);

  return (
    <div>
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("open")}>Open Tickets</button>
      <button onClick={() => setFilter("closed")}>Closed Tickets</button>
      <div>
        {!loading ? (
          <ul>
            {displayTickets?.map((t) => (
              <li key={t.id}>
                Ticket: {t.id + 1}, {t.description},{" "}
                {t.completed ? "Closed" : "Open"}{" "}
                <button>
                  <Link to={`/ticket/${t.id}`}>Details</Link>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <br />
            {/* display when tickets are loading */}
            <span>...Loading...</span>
          </div>
        )}
      </div>
      <h2>Add a new ticket</h2>
      <AddTicket setFilter={setFilter} backend={backend} />
    </div>
  );
};
