import React from "react";
import { Route, Routes } from 'react-router-dom';
import Slider from "./components/Slider";
import HomeEvents from "./components/HomeEvents";
import CreateEvent from "./components/CreateEvent";
import CreateTypeTicket from "./components/CreateTypeTicket";
import CreateUser from "./components/CreateUser";
import OwnerEvents from "./components/OwnerEvents";
import Event from "./components/Event";
import EditEvent from "./components/EditEvent";
import Login from "./functions/Login";
import BuyEvent from './components/BuyEvent';
import Layout from "./components/Layout";
import Charts from './components/Charts'
import RRPPEvents from "./components/RRPPEvents";
import RRPPEvent from "./components/RRPPEvent";
import RRPPData from "./components/RRPPData";
import ProtectedRoute from "./functions/ProtectedRoute";
import './App.css';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Slider />
            <HomeEvents />
          </Layout>
        } />
        <Route path="/charts" element={
          <ProtectedRoute>
            <Layout>
              <Charts />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/create-event" element={
          <ProtectedRoute>
            <Layout>
              <CreateEvent />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/create-typeticket" element={
          <ProtectedRoute>
            <Layout>
              <CreateTypeTicket />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/create-user" element={
          <ProtectedRoute>
            <Layout>
              <CreateUser />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/owner-events" element={
          <ProtectedRoute>
            <Layout>
              <OwnerEvents />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <Layout>
              <OwnerEvents />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/events/:eventId" element={
          <ProtectedRoute>
            <Layout>
              <Event />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/events/:eventId/rrpp" element={
          <ProtectedRoute>
            <Layout>
              <RRPPData />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/edit-event/:eventId" element={
          <ProtectedRoute>
            <Layout>
              <EditEvent />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/buy-ticket/:eventId/:rrppEventId?" element={
          <Layout>
            <BuyEvent />
          </Layout>
        } />
        <Route path="/rrpp-events" element={
          <ProtectedRoute>
            <Layout>
              <RRPPEvents />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/rrpp-events/:rrppEventId" element={
          <ProtectedRoute>
            <Layout>
              <RRPPEvent />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/checkout/success" element={
          <Layout>
            <div className="containerMessage">
              <h1 className="titleMessage">Gracias por tu compra!</h1>
              <p1 className="textMessage1">Enviamos los tickets a tu mail</p1>
              <p2 className="textMessage2">Por favor revisa la casilla de spam</p2>
            </div>
          </Layout>
        } />
        <Route path="/checkout/failure" element={
          <Layout>
            <div className="containerMessage">
              <h1 className="titleMessage">Hubo un error al procesar tu compra!</h1>
              <p1 className="textMessage1">Por favor volvé a intentarlo</p1>
            </div>
          </Layout>
        } />

      </Routes>
    </div>
  );
}

export default App;
