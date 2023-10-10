import { useAuth0 } from "@auth0/auth0-react";
import { API, graphqlOperation } from 'aws-amplify';
import { listPayments, listEvents, listTickets } from '../graphql/queries';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Marquee from './Marquee';
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
  const [misOptionsState, setMisOptionsState] = useState(null);
  const [lineOptionsState, setLineOptionsState] = useState(null);

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
            '#7D53DE',
            '#E4FF1A',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            // Add more colors if needed for different locations
          ],
          hoverBackgroundColor: ['#7D53DE', '#E4FF1A', '#FFCE56', '#33FFCC', '#FF99FF'],
          borderColor: 'white',
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
    justifyContent: 'space-between',  // This will space the rows more evenly
    height: '90vh',   // Reduced the height a bit
    marginTop: '5vh',               // Added margin to the top
    marginBottom: '30vh',            // Added margin to the bottom
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0', // Add vertical space between rows
    marginBottom: '10vh'
  };

  const superQuadrantStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const titleStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica Display ExtraBold',
    fontSize: '30px',        // Adjust font size of the title
    fontWeight: 'bold',     // Make the title bold
    marginBottom: '1vh',   // Spacing between the title and the chart
    color: '#E8EBF7',
  };

  const quadrantStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid rgba(228, 255, 26, 0.7)', // Green border with 50% opacity
    backgroundColor: 'rgba(255, 255, 255, 0)', // White background with 70% opacity
    padding: '2vh',
    borderRadius: '8px',
    width: '50vh',
    // maxWidth: '400px', 
    height: '40vh', // Set the height of each quadrant if needed
    margin: '10px 50px', // Adjusted right and left margins to 20px
  };

  const chartStyle = {
    width: '100%',
    height: '100%',
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
      const filterEventsList = eventsList.filter((event) => event.userID === user.sub);

      // Fetch payments data for the user's events
      const allPaymentsData = await API.graphql(graphqlOperation(listPayments));
      const allPaymentsList = allPaymentsData.data.listPayments.items;

      // Fetch all tickets data
      const allTicketsData = await API.graphql(graphqlOperation(listTickets));
      const allTicketsList = allTicketsData.data.listTickets.items;


      // Calculate total income for each event for Chart 1
      const eventsWithPayments = filterEventsList.map((event) => {
        const eventPayments = allPaymentsList.filter((payment) => payment.eventID === event.id && payment.paymentStatus === 'COMPLETED');
        const totalIncome = eventPayments.reduce((acc, payment) => acc + payment.amount * 0.8695689981, 0);
        return { ...event, totalIncome };
      });

      // Calculate daily incomes for each event for Chart 2
      const last5Days = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last5Days.push(date.toISOString().slice(0, 10));
      }

      // Calculate daily combined incomes for all events for Chart 2
      const dailyCombinedIncomes = last5Days.map((day) => {
        const dailyIncome = eventsWithPayments.reduce((acc, event) => {
          const eventPayments = allPaymentsList.filter((payment) =>
            payment.eventID === event.id &&
            payment.paymentStatus === 'COMPLETED' &&
            payment.createdDate.slice(0, 10) === day
          );
          const dailyEventIncome = eventPayments.reduce((innerAcc, payment) => innerAcc + payment.amount * 0.8695689981, 0);
          return acc + dailyEventIncome;
        }, 0);
        return dailyIncome;
      });

      // Set the data for Chart 4 (Bubble Chart)
      const eventLocationsData = getEventLocationsData(filterEventsList);
      console.log('eventLocationsData:', eventLocationsData); // Add this line
      setEventLocations(eventLocationsData);

      const maxIncome = Math.floor(Math.max(...eventsWithPayments.map(event => event.totalIncome)));
      const maxDailyIncome = Math.floor(...dailyCombinedIncomes);

      const localMisOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            min: 0,
            max: maxIncome + Math.floor(maxIncome * 0.1)
          },
          x: {
            ticks: {
              color: 'rgba(228, 255, 26)',
              font: {
                family: 'Helvetica Display Bold',
              }
            }
          }
        }
      };

      const localLineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        font: {
          family: 'Helvetica Display Bold'
        },
        scales: {
          y: {
            min: 0,
            max: maxDailyIncome + Math.floor(maxDailyIncome * 0.1),
            font: {
              family: 'Helvetica Display Bold'
            }
          },
          x: {
            ticks: {
              color: 'rgba(228, 255, 26)',
              font: {
                family: 'Helvetica Display Bold'
              }
            }
          }
        }
      };

      // Set the state with these new options:
      setMisOptionsState(localMisOptions);
      setLineOptionsState(localLineOptions);

      // LINECHART X EVENTO

      // const lineChartData = {
      //   labels: last5Days,
      //   datasets: eventsWithPayments.map((event) => {
      //     const eventPayments = allPaymentsList.filter((payment) => payment.eventID === event.id && payment.paymentStatus === 'COMPLETED');
      //     const dailyIncomes = last5Days.map((day) => {
      //       const income = eventPayments.reduce((acc, payment) => {
      //         return acc + (payment.createdDate.slice(0, 10) === day ? payment.amount : 0);
      //       }, 0);
      //       return income;
      //     });
      //     return {
      //       label: event.nameEvent,
      //       data: dailyIncomes,
      //       backgroundColor: 'rgba(228, 255, 26)',
      //     };
      //   }),
      // };
      // setLineData(lineChartData);

      // LINECHART TOTAL

      const lineChartData = {
        labels: last5Days,
        datasets: [
          {
            label: "INGRESOS TOTALES",
            font: {
              family: 'Helvetica Display Bold'
            },
            data: dailyCombinedIncomes,
            backgroundColor: '#E4FF1A',
            borderColor: '#7D53DE',
          }
        ],
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

      // Calculate count of tickets for each event for Chart 3
      const eventsWithTickets = filterEventsList.map((event) => {
        const eventTickets = allTicketsList.filter((ticket) => ticket.eventID === event.id);
        const ticketCount = eventTickets.length;
        return { ...event, ticketCount };
      });

      // Prepare data for Chart 3 (Pie Chart)
      const data3 = {
        labels: eventsWithTickets.map((event) => event.nameEvent),
        datasets: [
          {
            data: eventsWithTickets.map((event) => event.ticketCount),
            backgroundColor: ['#E4FF1A', '#7D53DE', '#FFCE56', '#33FFCC', '#FF99FF'], // You can add more colors if needed
            hoverBackgroundColor: ['#E4FF1A', '#7D53DE', '#FFCE56', '#33FFCC', '#FF99FF'],
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
    maintainAspectRatio: false,
    animation: true,
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
        ticks: {
          color: 'rgba(228, 255, 26)',
          font: {
            family: 'Helvetica Display Bold',
          }
        }
      }
    }
  };

  var midata = {
    labels: eventos,
    datasets: [
      {
        label: 'Ingresos',
        data: events.map((event) => event.totalIncome),
        backgroundColor: 'rgba(228, 255, 26, 0.5)'
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: true,
    font:
    {
      family: 'Helvetica Display Bold'
    },
    scales: {
      y: {
        min: 0,
        max: 6000,
        font: {
          family: 'Helvetica Display Bold'
        }
      },
      x: {
        ticks: {
          color: 'rgba(228, 255, 26)',
          font: {
            family: 'Helvetica Display Bold'
          }
        },
      },
    },
  };

  const options3 = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const bubbleOptions = {
    responsive: true,
    font:
    {
      family: 'Helvetica Display Bold'
    },
    plugins: {
      legend: {
        display: false, // Hide the legend since we are using custom labels
      },
      // tooltip: {
      //   callbacks: {
      //     label: (context) => {
      //       const label = context.label || '';
      //       const value = context.parsed.y || 0;
      //       return `${label}: ${value} events`;
      //     },
      //   },
      // },
    },
    scales: {
      y: {
        grid: { display: false },
        display: false
      },
      x: {
        grid: { display: false },
        display: false
      },
    },
  };

  return (
    <>
      <br />
      <br />
      <Marquee text='DASHBOARD' />
      <div className="event-class">
        <div style={containerStyle}>
          <br />
          <div style={rowStyle}>
            <div style={superQuadrantStyle}>
              <div style={titleStyle}>INGRESOS POR EVENTO</div>
              <div style={quadrantStyle}>
                {/* Chart 1 */}
                {eventNames && (
                  <div style={chartStyle}>
                    <Bar data={midata} options={misOptionsState} onClick={() => handleChartClick(midata, misoptions, 'Bar')} />
                  </div>
                )}
              </div>
            </div>
            <div style={superQuadrantStyle}>
              <div style={titleStyle}>INGRESOS POR DÍA</div>
              <div style={quadrantStyle}>
                {/* Chart 2 */}
                {lineData && (
                  <div style={chartStyle}>
                    <Line data={lineData} options={lineOptionsState} onClick={() => handleChartClick(lineData, lineOptions, 'Line')} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={rowStyle}>
            <div style={superQuadrantStyle}>
              <div style={titleStyle}>TICKETS VENDIDOS</div>
              <div style={quadrantStyle}>
                {/* Chart 3 */}
                {ticketData && (
                  <div style={chartStyle}>
                    <Pie data={ticketData} options={options3} onClick={() => handleChartClick(ticketData, options3, 'Pie')} />
                  </div>
                )}
              </div>
            </div>
            <div style={superQuadrantStyle}>
              <div style={titleStyle}>UBICACIONES DE MIS EVENTOS</div>
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
            <br />
            <br />
          </div>
          {/* Add the Modal component here */}
          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)} selectedChartInfo={selectedChartInfo} />
          )}
        </div>
      </div>
    </>
  );
};

const Modal = ({ onClose, selectedChartInfo }) => {
  const buttonBackStyle = {
    marginTop: '10px',
    fontFamily: 'Helvetica Display ExtraBold',
    fontSize: '25px',
    alignItems: 'center',
    background: '#E4FF1A',
    padding: '10px 15px',
    color: '#272727',
    transition: '0.2s',
    width: 'auto',
    border: 0,
    borderRadius: '10px',
    display: 'inline-block',
  }
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
          background: 'rgba(255, 255, 255, 0.8)',
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
            <Bar data={selectedChartInfo.data} options={selectedChartInfo.localMisOptions} />
          </div>
        )}
        {selectedChartInfo && selectedChartInfo.type === 'Line' && (
          <div style={{ width: '100%', height: '100%' }}>
            {/* Render the Line chart with the selected data and options */}
            <Line data={selectedChartInfo.data} options={selectedChartInfo.localLineOptions} />
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
        <button onClick={onClose} style={buttonBackStyle} className="btn-Buy">
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
          VOLVER
        </button>
      </div>
    </div>
  );
};

export default Charts;