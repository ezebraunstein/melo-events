import './App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Slider from "./components/Slider";
import HomeEvents from "./components/HomeEvents";
import CreateEvent from "./components/CreateEvent";
import CreateUser from "./components/CreateUser";
import OwnerEvents from "./components/OwnerEvents";
import Event from "./components/MyEvent";
import EditEvent from "./components/EditEvent";
import Login from "./functions/login";
import BuyEvent from './components/BuyEvent';
import Layout from "./components/Layout";
import Charts from './components/Charts'
import RRPPEvents from "./components/RRPPEvents";
import RRPPEvent from "./components/RRPPEvent";
import RRPPData from "./components/RRPPData";
import ProtectedRoute from "./functions/protectedRoute";
import Logo from "./components/Logo";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import agiles from './images/foto-agiles.jpeg';
import './CSS/Buttons.css'
import './CSS/Event.css'
import './CSS/EventBox.css'
import './CSS/Layout.css'
import './CSS/Modal.css'
import './CSS/Ticket.css'
import './CSS/Hamburguer.css'

const SuccessfulPurchaseRedirect = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timerDuration = 4500; // Total duration for the timer
    const updateInterval = 50; // How often to update the progress bar (in ms)

    const timer = setTimeout(() => {
      navigate('/');
    }, timerDuration);

    const progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const diff = (updateInterval / timerDuration) * 100;
        return Math.min(oldProgress + diff, 100);
      });
    }, updateInterval);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <Layout>
      <div className="message-container">
        <h1 className="titleMessage">Gracias por tu compra!</h1>
        <p className="textMessage2">Enviamos los tickets a tu mail</p>
        <p className="textMessage3">Revisá la casilla de spam</p>
        <br />
        <br />
        <br />
        <p className="textMessage3">Redirigiendo a la página principal...</p>
        <Box sx={{ width: '60%' }}>
          <LinearProgress sx={{
            backgroundColor: '#272727',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#E4FF1A'
            }
          }} variant="determinate" value={progress} />
        </Box>
      </div>
    </Layout>
  );
};

const FailedPurchaseRedirect = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timerDuration = 4500; // Total duration for the timer
    const updateInterval = 50; // How often to update the progress bar (in ms)

    const timer = setTimeout(() => {
      navigate('/');
    }, timerDuration);

    const progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const diff = (updateInterval / timerDuration) * 100;
        return Math.min(oldProgress + diff, 100);
      });
    }, updateInterval);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <Layout>
      <div className="message-container">
        <h1 className="titleMessage">Hubo un error!</h1>
        <p1 className="textMessage2">Por favor volvé a intentarlo</p1>
        <br />
        <br />
        <br />
        <p className="textMessage3">Redirigiendo a la página principal...</p>
        <Box sx={{ width: '60%' }}>
          <LinearProgress sx={{
            backgroundColor: '#272727',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#E4FF1A'
            }
          }} variant="determinate" value={progress} />
        </Box>
      </div>
    </Layout>
  );
};

function App() {

  return (

    <div style={{ backgroundColor: '#272727' }}>
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
        <Route path="/mis-eventos-rrpp" element={
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
        {/* <Route path="/compra-exitosa" element={
          <Layout>
            <div className="message-container">
              <h1 className="titleMessage">Gracias por tu compra!</h1>
              <p1 className="textMessage2">Enviamos los tickets a tu mail</p1>
              <p2 className="textMessage3">Revisá la casilla de spam</p2>
            </div>
          </Layout>
        } /> */}
        <Route path="/compra-exitosa" element={<SuccessfulPurchaseRedirect />} />
        {/* <Route path="/compra-fallida" element={
          <Layout>
            <div className="message-container">
              <h1 className="titleMessage">Hubo un error!</h1>
              <p1 className="textMessage2">Por favor volvé a intentarlo</p1>
            </div>
          </Layout>
        } /> */}
        <Route path="/compra-fallida" element={<FailedPurchaseRedirect />} />
        <Route path="/logo" element={
          <Layout>
            <Logo />
          </Layout>
        } />
        <Route path="/agiles" element={
          <Layout>
            <div className="message-container">
              <br />
              <br />
              <h1 className="titleMessage">Ágiles</h1>
              <p className="textMessage1">Grupo 8</p>
              <p className="textMessage2">2023</p>
              <img src={agiles} alt="imagen" width='1000px' height='500px' />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;
