import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsconfig from "./aws-exports";
import awsExports from "./aws-exports";

Amplify.configure(awsconfig);
Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

