import { BackendService } from "../backend";
import { TicketsList } from "./components/TicketsList";

import "./app.css";

interface AppProps {
  backend: BackendService;
}

const App = ({ backend }: AppProps) => {
  return (
    <div className="app">
      <h2>Tickets</h2>
      <TicketsList backend={backend} />
    </div>
  );
};

export default App;
