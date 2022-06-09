import React from "react";
import ReactDOM from "react-dom";
import { BackendService } from "./backend";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app/app";
import { TicketDetail } from "./app/components/TicketDetail";

const backend = new BackendService();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App backend={backend} />} />
        <Route
          path="/ticket/:id"
          element={<TicketDetail backend={backend} />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
