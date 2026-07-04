import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { FavouritesContext } from "../context/FavouritesContext";
import { useAuth } from "../context/AuthContext";
import { ASIAN_DESTINATIONS } from "../data/asianDestinations";

function parseAiAnswer(answer) {
  if (typeof answer !== "string") return answer;

  let text = answer.trim();
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) text = fenced[1].trim();

  return JSON.parse(text);
}

const AiPlanner = () => {
  const [destinationKey, setDestinationKey] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [travelPlan, setTravelPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const detailRef = useRef(null);
  const { addToFavourites, isFavourite } = useContext(FavouritesContext);
  const { token } = useAuth();

  useEffect(() => {
    if (travelPlan && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [travelPlan]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!destinationKey) {
      toast.error("Please select a destination.");
      return;
    }

    const daysNum = Number(days);
    const budgetNum = Number(budget);

    if (!days || daysNum < 1) {
      toast.error("Please enter a valid number of days.");
      return;
    }

    if (!budget || budgetNum < 1) {
      toast.error("Please enter a valid budget.");
      return;
    }

    const [country, city] = destinationKey.split("|");
    const prompt = `Plan a ${daysNum}-day trip to ${city}, ${country} with a budget of ₹${budgetNum}. Include top attractions, itinerary and local tips.`;

    setLoading(true);
    setTravelPlan(null);

    try {
      const res = await axios.post(
        "https://travel-backend-wheat-seven.vercel.app/api/ai/travel-plan",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTravelPlan({
        ...parseAiAnswer(res.data.answer),
        budget: { estimated: budgetNum },
        _id: `ai-${Date.now()}`,
      });
      toast.success("Travel plan generated!");
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      if (status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (status === 429) {
        toast.error("AI service is busy. Please try again in a moment.");
      } else if (err instanceof SyntaxError) {
        toast.error("Could not read the travel plan. Please try again.");
      } else {
        toast.error(err.response?.data?.error || "Failed to generate travel plan.");
      }
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
          <form className="ai-planner-form" onSubmit={handleGenerate}>
            <div className="ai-form-field ai-form-field-destination">
              <label className="ai-prompt-label" htmlFor="ai-destination">
                Destination
              </label>
              <select
                id="ai-destination"
                className="form-input"
                value={destinationKey}
                onChange={(e) => setDestinationKey(e.target.value)}
              >
                <option value="">Select country and city</option>
                {ASIAN_DESTINATIONS.map((destination) => {
                  const key = `${destination.country}|${destination.city}`;
                  return (
                    <option key={key} value={key}>
                      {destination.country} — {destination.city}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="ai-form-field">
              <label className="ai-prompt-label" htmlFor="ai-days">
                Trip duration (days)
              </label>
              <input
                id="ai-days"
                type="number"
                className="form-input"
                min="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>

            <div className="ai-form-field">
              <label className="ai-prompt-label" htmlFor="ai-budget">
                Budget (₹)
              </label>
              <input
                id="ai-budget"
                type="number"
                className="form-input"
                min="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 25000"
              />
            </div>

            <div className="ai-form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Generating..." : "Generate Travel Plan"}
              </button>
            </div>
          </form>

          {loading && (
            <p className="ai-loading">Generating your travel plan...</p>
          )}
        </div>

        {travelPlan && (
          <div className="detail-panel ai-result" ref={detailRef}>
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
                  ? "Added to Saved Trips"
                  : "Add to Saved Trips"}
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
