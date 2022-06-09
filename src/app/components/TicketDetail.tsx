import { useState, useEffect } from "react";
import { BackendService, Ticket, User } from "../../backend";
import { Link, useParams } from "react-router-dom";
import { firstValueFrom } from "rxjs";
import { UserDropdown } from "./UserDropdown";

interface TicketDetailProps {
  backend: BackendService;
}

export const TicketDetail = ({ backend }: TicketDetailProps) => {
  let params = useParams();
  const id = Number(params.id);

  const [ticket, setTicket] = useState({} as Ticket);
  const [completing, setCompleting] = useState(false);
  const [user, setUser] = useState({} as User | undefined);
  const [settingNewUser, setSettingNewUser] = useState(false);

  //find ticket detail when component loads
  useEffect(() => {
    const fetchData = async () => {
      const result = await firstValueFrom(backend.ticket(id));
      setTicket(result);
    };
    fetchData();
  }, [backend, id]);

  //fetch user assigned to ticket(if there is one) when tickets id fetched
  useEffect(() => {
    if (typeof ticket.assigneeId === "number") {
      const userId = ticket.assigneeId;
      const fetchData = async () => {
        const result = await firstValueFrom(backend.user(userId));
        setUser(result);
      };
      fetchData();
    }
  }, [backend, ticket.assigneeId]);

  //mark ticket completed on backend
  const markComplete = (id: number) => {
    setCompleting(true);
    const completeTicket = backend.complete(id, true);
    completeTicket.subscribe((_) => {
      setCompleting(false);
    });
    return completeTicket;
  };

  //display user assigned or if no user is assigned
  const assignedUser = () => {
    if (ticket.assigneeId === null) {
      return <span>--Not Assigned. Please assign to a user.--</span>;
    } else if (typeof ticket.assigneeId === "number" && !user?.name) {
      return <span>...Loading...</span>;
    } else if (typeof ticket.assigneeId === "number" && user?.name) {
      return <span>{user.name}</span>;
    }
  };

  return (
    <div className="app">
      <Link to="/">Back to Homepage</Link>
      <h3>
        Ticket {id + 1}:{" "}
        {ticket.description ? ticket.description : "...Loading..."}
      </h3>
      <div> Assigned to: {assignedUser()} </div>
      <br />
      <UserDropdown
        backend={backend}
        completed={ticket.completed}
        ticketId={id}
        settingNewUser={settingNewUser}
        setSettingNewUser={setSettingNewUser}
      />
      <br />
      <div> Status: {ticket.completed ? "Closed" : "Open"} </div>
      <br />
      <button disabled={ticket.completed} onClick={() => markComplete(id)}>
        Mark Completed
      </button>
      <br />
      {completing ? <div>Marking Ticket as Complete...</div> : ""}
    </div>
  );
};
