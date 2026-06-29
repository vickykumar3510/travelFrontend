import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { FavouritesContext } from "../context/FavouritesContext";

const AiPlanner = () => {
  const [prompt, setPrompt] = useState("");
  const [travelPlan, setTravelPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToFavourites, isFavourite } = useContext(FavouritesContext);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setTravelPlan(null);

    try {
      const res = await axios.post(
        "https://travel-backend-wheat-seven.vercel.app/api/ai/travel-plan",
        { prompt }
      );

      setTravelPlan({
        ...JSON.parse(res.data.answer),
        _id: `ai-${Date.now()}`,
      });
      toast.success("Travel plan generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate travel plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="page-container">
        <div className="page-header">
          <h2>AI Travel Planner</h2>
        </div>

        <div className="ai-planner-input">
          <div className="ai-prompt-card">
            <form onSubmit={handleGenerate}>
              <label className="ai-prompt-label" htmlFor="ai-prompt">
                Describe your dream trip
              </label>
              <textarea
                id="ai-prompt"
                className="form-textarea"
                rows="6"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Example:
Plan a 5-day trip to Goa with a budget of ₹25,000.
Include top attractions, itinerary and local tips.`}
              />

              <div className="ai-form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Generating..." : "Generate Travel Plan"}
                </button>
              </div>
            </form>
          </div>

          {loading && (
            <p className="ai-loading">Generating your travel plan...</p>
          )}
        </div>

        {travelPlan && (
          <div className="detail-panel ai-result">
            <div className="detail-title">
              <span className="detail-title-text">{travelPlan.destination}</span>
              <span className="detail-title-sub">AI Generated Plan</span>
            </div>

            <div className="detail-summary">
              <div className="detail-summary-item">
                <span className="detail-label">City</span>
                <span className="detail-value">{travelPlan.city}</span>
              </div>
              <div className="detail-summary-item">
                <span className="detail-label">Country</span>
                <span className="detail-value">{travelPlan.country}</span>
              </div>
              <div className="detail-summary-item">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{travelPlan.days} days</span>
              </div>
              <div className="detail-summary-item detail-summary-budget">
                <span className="detail-label">Budget</span>
                <span className="detail-value">₹{travelPlan.budget?.estimated}</span>
              </div>
            </div>

            <section className="detail-section">
              <h3 className="detail-section-title">Top Attractions</h3>
              {travelPlan.topAttractions?.length > 0 ? (
                <ul className="detail-list">
                  {travelPlan.topAttractions.map((attraction, index) => (
                    <li key={index}>{attraction}</li>
                  ))}
                </ul>
              ) : (
                <p className="detail-empty">No attractions available.</p>
              )}
            </section>

            <section className="detail-section">
              <h3 className="detail-section-title">Itinerary</h3>
              {travelPlan.itinerary?.length > 0 ? (
                <div className="day-plans">
                  {travelPlan.itinerary.map((dayPlan, index) => (
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
              ) : (
                <p className="detail-empty">No itinerary available.</p>
              )}
            </section>

            <section className="detail-section">
              <h3 className="detail-section-title">Local Tips</h3>
              {travelPlan.localTips?.length > 0 ? (
                <ul className="detail-list">
                  {travelPlan.localTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="detail-empty">No tips available.</p>
              )}
            </section>

            <div className="detail-actions">
              <button
                type="button"
                className={`btn ${isFavourite(travelPlan._id) ? "btn-favourite-added" : "btn-favourite"}`}
                onClick={() => addToFavourites(travelPlan)}
                disabled={isFavourite(travelPlan._id)}
              >
                {isFavourite(travelPlan._id)
                  ? "♥ Added to Favourites"
                  : "♥ Add to Favourites"}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AiPlanner;
