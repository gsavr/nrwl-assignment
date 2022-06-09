import { useState } from "react";

import { BackendService } from "../../backend";

interface AddTicketProps {
  backend: BackendService;
  setFilter: any;
}

export const AddTicket = ({ backend, setFilter }: AddTicketProps) => {
  const [ticketDescription, setTicketDescription] = useState("");
  const payload = { description: ticketDescription.trim() };
  const [addingTicket, setAddingTicket] = useState(false);
  const [error, setError] = useState("");

  //add ticket on backend
  const onSubmit = (
    payload: { description: string },
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (payload.description.length >= 2) {
      setAddingTicket(true);
      setError("");
      setTicketDescription("");
      const newTicket = backend.newTicket(payload);
      newTicket.subscribe((_) => {
        setAddingTicket(false);
        setFilter("open");
        setFilter("all");
      });
      return newTicket;
    } else {
      setError("please add description");
    }
  };

  return (
    <div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => onSubmit(payload, e)}
      >
        <label>Description: </label>
        <br />
        <input
          type="text"
          name="Description"
          onChange={(e) => setTicketDescription(e.target.value)}
        />
        <br /> <br />
        <button type="submit">Add ticket</button>
      </form>
      {/* display when adding ticket */}
      {addingTicket ? <div>Adding new Ticket...</div> : ""}
      {error}
    </div>
  );
};
