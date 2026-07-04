import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import { useAuth } from "../context/AuthContext";

const PREVIEW_LIMIT = 6;

function Landing() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          "https://travel-backend-wheat-seven.vercel.app/destinations"
        );
        setTrips(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load trip previews.");
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  const previewTrips = trips.slice(0, PREVIEW_LIMIT);

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <Header />
      <main className="main-content home-page landing-page">
        <HeroCarousel />

        <section className="hero landing-hero">
          <h1>Find your next trip</h1>
          <p className="hero-description">
            Browse curated itineraries across Asia and beyond. Preview trips here,
            then sign in to save plans, use the AI planner, and book when you are ready.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Log in to explore itineraries
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Get Started
            </Link>
          </div>
        </section>

        <section className="landing-section landing-features">
          <h2 className="landing-section-title">How it works</h2>
          <ul className="landing-feature-grid">
            <li className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true">
                1
              </span>
              <h3>Browse itineraries</h3>
              <p>Explore ready-made trips with day-by-day plans, budgets, and local tips.</p>
            </li>
            <li className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true">
                2
              </span>
              <h3>Generate with AI</h3>
              <p>Create a custom plan by destination, duration, and budget after you sign in.</p>
            </li>
            <li className="landing-feature-card">
              <span className="landing-feature-icon" aria-hidden="true">
                3
              </span>
              <h3>Save and book</h3>
              <p>Keep favourite trips in one place and book them when you are ready to go.</p>
            </li>
          </ul>
        </section>

        <section className="landing-section landing-trips">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Popular trips</h2>
            {trips.length > PREVIEW_LIMIT && (
              <Link to="/login" className="btn btn-outline">
                Log in to view all
              </Link>
            )}
          </div>

          {previewTrips.length === 0 ? (
            <p className="empty-state">Loading trips...</p>
          ) : (
            <ul className="destination-grid">
              {previewTrips.map((trip) => (
                <li key={trip._id} className="destination-card">
                  <strong className="destination-title">{trip.destination}</strong>
                  <p className="destination-meta">
                    {trip.city}, {trip.country} · {trip.days} days · ₹{" "}
                    {trip.budget.estimated}
                  </p>
                  <div className="destination-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setSelected(trip)}
                    >
                      Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {selected && (
          <div className="detail-panel landing-detail" ref={detailRef}>
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
              <Link to="/signup" className="btn btn-primary">
                Sign up to save trips
              </Link>
              <Link to="/login" className="btn btn-outline">
                Log in
              </Link>
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

        <section className="landing-cta">
          <h2>Ready to build your next trip?</h2>
          <p>Create a free account to save itineraries, use the AI planner, and book trips.</p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">
              Create account
            </Link>
            <Link to="/login" className="btn btn-outline">
              Log in
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Landing;
