import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppContext } from "./AppContext/AppContext";
import { initial, reducer } from "./AppContext/reducer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppContext initial={initial} reducer={reducer}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AppContext>
);
