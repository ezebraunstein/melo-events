import './App.css';
import React from "react";
import { Route, Routes } from 'react-router-dom';
import Slider from "./components/Slider";
import HomeEvents from "./components/HomeEvents";
import CreateEvent from "./components/CreateEvent";
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
import ProtectedRoute from "./functions/protectedRoute";

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
        <Route path="/crear-evento" element={
          <ProtectedRoute>
            <Layout>
              <CreateEvent />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/crear-usuario" element={
          <ProtectedRoute>
            <Layout>
              <CreateUser />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/mis-eventos" element={
          <ProtectedRoute>
            <Layout>
              <OwnerEvents />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/mi-evento/:eventId" element={
          <ProtectedRoute>
            <Layout>
              <Event />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/mi-evento/:eventId/rrpp" element={
          <ProtectedRoute>
            <Layout>
              <RRPPData />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/editar-evento/:eventId" element={
          <ProtectedRoute>
            <Layout>
              <EditEvent />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/comprar-tickets/:eventId/:rrppEventId?" element={
          <Layout>
            <BuyEvent />
          </Layout>
        } />
        <Route path="/mi-evento-rrpp" element={
          <ProtectedRoute>
            <Layout>
              <RRPPEvents />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/mi-evento-rrpp/:rrppEventId" element={
          <ProtectedRoute>
            <Layout>
              <RRPPEvent />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/compra-exitosa" element={
          <Layout>
            <div className="containerMessage">
              <h1 className="titleMessage">Gracias por tu compra!</h1>
              <p1 className="textMessage1">Enviamos los tickets a tu mail</p1>
              <p2 className="textMessage2">Por favor revisa la casilla de spam</p2>
            </div>
          </Layout>
        } />
        <Route path="/compra-fallida" element={
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
