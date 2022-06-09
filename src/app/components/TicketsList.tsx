import React, { useEffect, useState } from "react";
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

  //fetch list of tickets from backend
  useEffect(() => {
    const fetchData = async () => {
      const result = await firstValueFrom(backend.tickets());
      setTickets(result);
    };
    fetchData();
  }, [backend, tickets]);

  //create list of tickets to display
  const listOfTickets = (tickets: Ticket[]) => {
    return tickets.map((t) => (
      <li key={t.id}>
        Ticket: {t.id + 1}, {t.description}, {t.completed ? "Closed" : "Open"}{" "}
        <button>
          <Link to={`/ticket/${t.id}`}>Details</Link>
        </button>
      </li>
    ));
  };

  //filter for tickets - all, open, or closed tickets
  const displayTickets = () => {
    if (filter === "all") {
      return listOfTickets(tickets);
    } else if (filter === "open") {
      const openTickets = tickets.filter(
        (ticket) => ticket.completed === false
      );
      return listOfTickets(openTickets);
    } else if (filter === "closed") {
      const closedTickets = tickets.filter(
        (ticket) => ticket.completed === true
      );
      return listOfTickets(closedTickets);
    }
  };

  return (
    <div>
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("open")}>Open Tickets</button>
      <button onClick={() => setFilter("closed")}>Closed Tickets</button>
      <div>
        {tickets.length ? (
          <ul>{displayTickets()}</ul>
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
