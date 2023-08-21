import { useAuth0 } from "@auth0/auth0-react";
import { API, graphqlOperation } from 'aws-amplify';
import { listPayments } from '../graphql/queries';
import { listEvents } from "../graphql/queries";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

const Charts = () => {

  const { user } = useAuth0();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChartInfo, setSelectedChartInfo] = useState(null);

  // Add the event handler for chart click
  const handleChartClick = (chartData, chartOptions, chartType) => {
    setSelectedChartInfo({ data: chartData, options: chartOptions, type: chartType });
    setIsModalOpen(true);
  };

  const getEventLocationsData = (events) => {
    const eventCounts = {};

    events.forEach((event) => {
      const eventName = event.nameLocationEvent;
      if (eventCounts[eventName]) {
        eventCounts[eventName] += 1;
      } else {
        eventCounts[eventName] = 1;
      }
    });

    const data = {
      labels: Object.keys(eventCounts),
      datasets: [
        {
          data: Object.values(eventCounts),
          backgroundColor: [
            'rgba(0, 220, 195, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            // Add more colors if needed for different locations
          ],
          borderColor: 'rgba(0, 220, 195, 1)',
          borderWidth: 1,
        },
      ],
    };

    return data;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Set the height of the container to fill the viewport
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0', // Add vertical space between rows
  };

  const textStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    margin: '20px',
    maxWidth: '800px', // Set the maximum width of the container if needed
    fontFamily: 'Fun City 2',
  };

  const quadrantStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid green',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px', // Set the maximum width of each quadrant if needed
    height: '400px', // Set the height of each quadrant if needed
    margin: '10px',
  };

  const chartStyle = {
    maxWidth: '100%', // Set the maximum width of the chart if needed
  };

  const [events, setEvents] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [lineData, setLineData] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [eventLocations, setEventLocations] = useState(null);

  const fetchEvents = async () => {
    try {
      const eventsData = await API.graphql(graphqlOperation(listEvents));
      const eventsList = eventsData.data.listEvents.items;
      const filterEventsList = eventsList.filter((event) => event.userID === user.username);

      // Fetch payments data for the user's events
      const allPaymentsData = await API.graphql(graphqlOperation(listPayments));
      const allPaymentsList = allPaymentsData.data.listPayments.items;

      // Calculate total income for each event for Chart 1
      const eventsWithPayments = filterEventsList.map((event) => {
        const eventPayments = allPaymentsList.filter((payment) => payment.eventID === event.id);
        const totalIncome = eventPayments.reduce((acc, payment) => acc + payment.amount, 0);
        return { ...event, totalIncome };
      });

      // Calculate daily incomes for each event for Chart 2
      const last5Days = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last5Days.push(date.toISOString().slice(0, 10));
      }

      // Set the data for Chart 4 (Bubble Chart)
      const eventLocationsData = getEventLocationsData(filterEventsList);
      console.log('eventLocationsData:', eventLocationsData); // Add this line
      setEventLocations(eventLocationsData);

      const lineChartData = {
        labels: last5Days,
        datasets: eventsWithPayments.map((event) => {
          const eventPayments = allPaymentsList.filter((payment) => payment.eventID === event.id);
          const dailyIncomes = last5Days.map((day) => {
            const income = eventPayments.reduce((acc, payment) => {
              return acc + (payment.createdDate.slice(0, 10) === day ? payment.amount : 0);
            }, 0);
            return income;
          });
          return {
            label: event.nameEvent,
            data: dailyIncomes,
            backgroundColor: 'rgba(0, 220, 195, 0.5)',
          };
        }),
      };
      setLineData(lineChartData);

      const eventNamesArray = eventsWithPayments.map((event) => event.nameEvent);
      setEventNames(eventNamesArray);
      setEvents(eventsWithPayments);

      // Calculate count of completed payments for each event for Chart 3
      const eventsWithPaymentsNew = filterEventsList.map((event) => {
        const eventPayments = allPaymentsList.filter((payment) => payment.eventID === event.id);
        const completedPaymentsCount = eventPayments.filter(
          (payment) => payment.paymentStatus === 'COMPLETED'
        ).length;
        return { ...event, completedPaymentsCount };
      });

      // Prepare data for Chart 3 (Pie Chart)
      const data3 = {
        labels: eventsWithPaymentsNew.map((event) => event.nameEvent),
        datasets: [
          {
            data: eventsWithPaymentsNew.map((event) => event.completedPaymentsCount),
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#33FFCC', '#FF99FF'], // You can add more colors if needed
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#33FFCC', '#FF99FF'],
          },
        ],
      };

      // Set the data for Chart 3
      setTicketData(data3);

    } catch (error) {
      console.log("", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
  );

  var eventos = eventNames;

  var misoptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 7000
      },
      x: {
        ticks: { color: 'rgba(0, 220, 195)' }
      }
    }
  };

  var midata = {
    labels: eventos,
    datasets: [
      {
        label: 'Ingresos',
        data: events.map((event) => event.totalIncome),
        backgroundColor: 'rgba(0, 220, 195, 0.5)'
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    animation: false,
    scales: {
      y: {
        min: 0,
        max: 6000,
      },
      x: {
        ticks: { color: 'rgba(0, 220, 195)' },
      },
    },
  };

  const options3 = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const bubbleOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend since we are using custom labels
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value} events`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10, // Adjust the maximum value based on your data
      },
      x: {
        ticks: { color: 'rgba(0, 220, 195)' },
      },
    },
  };

  return (
    <div style={containerStyle}>
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap" />
      </Helmet>
      <h1 style={{ ...textStyle, fontFamily: 'Titan One, cursive', color: '#869e31' }}>
        <FontAwesomeIcon icon={faGaugeHigh} beat style={{ color: "#1f513a", marginRight: '16px' }} />
        Dashboard
        <FontAwesomeIcon icon={faGaugeHigh} beat style={{ color: "#1f513a", marginLeft: '16px' }} />
      </h1>
      <div style={rowStyle}>
        <div style={quadrantStyle}>
          {/* Chart 1 */}
          {eventNames && (
            <div style={chartStyle}>
              <Bar data={midata} options={misoptions} onClick={() => handleChartClick(midata, misoptions, 'Bar')} />
            </div>
          )}
        </div>
        <div style={quadrantStyle}>
          {/* Chart 2 */}
          {lineData && (
            <div style={chartStyle}>
              <Line data={lineData} options={lineOptions} onClick={() => handleChartClick(lineData, lineOptions, 'Line')} />
            </div>
          )}
        </div>
      </div>
      <div style={rowStyle}>
        <div style={quadrantStyle}>
          {/* Chart 3 */}
          {ticketData && (
            <div style={chartStyle}>
              <Pie data={ticketData} options={options3} onClick={() => handleChartClick(ticketData, options3, 'Pie')} />
            </div>
          )}
        </div>
        <div style={quadrantStyle}>
          {/* Chart 4 */}
          {eventLocations && (
            <div>
              <div style={chartStyle}>
                <Doughnut data={eventLocations} options={bubbleOptions} onClick={() => handleChartClick(eventLocations, bubbleOptions, 'Doughnut')} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Add the Modal component here */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} selectedChartInfo={selectedChartInfo} />
      )}
    </div>
  );
};

const Modal = ({ onClose, selectedChartInfo }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          width: '80%', // Adjust the width of the modal as needed
          height: '80%', // Adjust the height of the modal as needed
          display: 'flex',
          flexDirection: 'column', // Use flex column to align the chart in the center
        }}
      >
        {/* Conditionally render the appropriate chart inside the modal based on the chart type */}
        {selectedChartInfo && selectedChartInfo.type === 'Bar' && (
          <div style={{ width: '100%', height: '100%' }}>
            {/* Render the Bar chart with the selected data and options */}
            <Bar data={selectedChartInfo.data} options={selectedChartInfo.options} />
          </div>
        )}
        {selectedChartInfo && selectedChartInfo.type === 'Line' && (
          <div style={{ width: '100%', height: '100%' }}>
            {/* Render the Line chart with the selected data and options */}
            <Line data={selectedChartInfo.data} options={selectedChartInfo.options} />
          </div>
        )}
        {selectedChartInfo && selectedChartInfo.type === 'Pie' && (
          <div style={{ width: '100%', height: '100%' }}>
            {/* Render the Pie chart with the selected data and options */}
            <Pie data={selectedChartInfo.data} options={selectedChartInfo.options} />
          </div>
        )}
        {selectedChartInfo && selectedChartInfo.type === 'Doughnut' && (
          <div style={{ width: '100%', height: '95%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Render the Doughnut chart with the selected data and options */}
            <Doughnut data={selectedChartInfo.data} options={selectedChartInfo.options} />
          </div>
        )}
        <button onClick={onClose} style={{ marginTop: '10px' }} className="btn-Buy">
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
          Volver
        </button>
      </div>
    </div>
  );
};

export default Charts;