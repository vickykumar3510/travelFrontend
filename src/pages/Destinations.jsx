import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FavouritesContext } from "../context/FavouritesContext";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);
  const { addToFavourites, isFavourite } = useContext(FavouritesContext);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("https://travel-backend-wheat-seven.vercel.app/destinations");
      setDestinations(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Error while loading itineraries.");
    }
  };

  return (
    <>
    <Header />
    <div className="page-container">
      <div className="page-header">
        <h2>Itineraries</h2>
      </div>

      {destinations.length === 0 ? (
        <p className="empty-state">No itineraries found.</p>
      ) : (
        <ul className="destination-grid">
          {destinations.map((destination) => (
            <li key={destination._id} className="destination-card">
              <strong className="destination-title">{destination.destination}</strong>
              <p className="destination-meta">
                {destination.city}, {destination.country} · {destination.days} days · ₹ {destination.budget.estimated}
              </p>

              <div className="destination-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelected(destination)}
                >
                  Details
                </button>

                <button
                  type="button"
                  className={`btn ${isFavourite(destination._id) ? "btn-favourite-added" : "btn-favourite"}`}
                  onClick={() => addToFavourites(destination)}
                  disabled={isFavourite(destination._id)}
                >
                  {isFavourite(destination._id) ? "Added" : "Save Trip"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="detail-panel" ref={detailRef}>
          <div className="detail-title">
            <span className="detail-title-text">{selected.destination}</span>
          </div>

          <div className="detail-summary">
            <div className="detail-summary-item">
              <span className="detail-label">City</span>
              <span className="detail-value">{selected.city}</span>
            </div>
            <div className="detail-summary-item">
              <span className="detail-label">Country</span>
              <span className="detail-value">{selected.country}</span>
            </div>
            <div className="detail-summary-item">
              <span className="detail-label">Duration</span>
              <span className="detail-value">{selected.days} days</span>
            </div>
            <div className="detail-summary-item detail-summary-budget">
              <span className="detail-label">Budget</span>
              <span className="detail-value">₹{selected.budget.estimated}</span>
            </div>
          </div>

          <section className="detail-section">
            <h3 className="detail-section-title">Top Attractions</h3>
            <ul className="detail-list">
              {selected.topAttractions.map((attraction, index) => (
                <li key={index}>{attraction}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section">
            <h3 className="detail-section-title">Itinerary</h3>
            <div className="day-plans">
              {selected.itinerary.map((dayPlan, index) => (
                <div key={index} className="day-plan">
                  <strong>Day {dayPlan.day}</strong>
                  <ul>
                    {dayPlan.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h3 className="detail-section-title">Local Tips</h3>
            <ul className="detail-list">
              {selected.localTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </section>

          <div className="detail-actions">
            <button
              type="button"
              className={`btn ${isFavourite(selected._id) ? "btn-favourite-added" : "btn-favourite"}`}
              onClick={() => addToFavourites(selected)}
              disabled={isFavourite(selected._id)}
            >
              {isFavourite(selected._id) ? "Added to Saved Trips" : "Add to Saved Trips"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
    
  );
}


export default Destinations;
