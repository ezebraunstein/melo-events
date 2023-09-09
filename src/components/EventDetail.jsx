import { GoogleMap, MarkerF } from "@react-google-maps/api";

function formatDate(inputDate) {
    const parts = inputDate.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


const EventDetail = ({ eventData, selectedLocation }) => (
    <div>
        {eventData && (
            <div className="event-container">
                <div className="data-container">
                    <div>
                        <h4 className="eventName"> {eventData.nameEvent}</h4>
                    </div>
                    <div>
                        <h4 className="eventDate">{formatDate(eventData.startDateE.slice(0, 10))}</h4>
                    </div>
                    {eventData.descriptionEvent && (
                        <div>
                            <h4 className="eventDescription"> {eventData.descriptionEvent}</h4>
                            <br />
                        </div>
                    )}
                    {eventData.nameLocationEvent ? (
                        <div>
                            <h4 className="eventLocation">📍{eventData.nameLocationEvent}</h4>
                            <br />
                        </div>
                    ) : (
                        <div>
                            <h4 className="eventLocation">📍Secret Location</h4>
                            <br />
                        </div>
                    )}
                </div>
                <div className="image-container">
                    <img className="image-style" src={eventData.imageUrl} alt="" />
                </div>
                {eventData.nameLocationEvent && (
                    <div className="map-container">
                        <GoogleMap
                            mapContainerStyle={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "10px"
                            }}
                            zoom={15}
                            center={selectedLocation || { lat: -34.397, lng: 150.644 }}
                        >
                            {selectedLocation && (
                                <MarkerF position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                            )}
                        </GoogleMap>
                    </div>
                )}
            </div>
        )}
    </div>
);

export default EventDetail;