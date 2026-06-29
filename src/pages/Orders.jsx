import { useContext, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { OrdersContext } from "../context/OrdersContext";

function Orders() {
  const { orders } = useContext(OrdersContext);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h2>My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <p className="empty-state">No orders yet. Book a trip from your favourites.</p>
        ) : (
          <ul className="destination-grid">
            {orders.map((order) => (
              <li key={order.orderId} className="destination-card">
                <strong className="destination-title">{order.destination}</strong>
                <p className="destination-meta">
                  {order.city}, {order.country} · {order.days} days · ₹ {order.budget.estimated}
                </p>
                <small className="card-meta-note">Ordered on: {order.orderedAt}</small>

                <div className="destination-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSelected(order)}
                  >
                    Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {selected && (
          <div className="detail-panel">
            <div className="detail-title">
              <span className="detail-title-text">{selected.destination}</span>
              <span className="detail-title-sub">Ordered on: {selected.orderedAt}</span>
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
                <span className="detail-value">₹{selected.budget?.estimated}</span>
              </div>
            </div>

            <section className="detail-section">
              <h3 className="detail-section-title">Top Attractions</h3>
              {selected.topAttractions?.length > 0 ? (
                <ul className="detail-list">
                  {selected.topAttractions.map((attraction, index) => (
                    <li key={index}>{attraction}</li>
                  ))}
                </ul>
              ) : (
                <p className="detail-empty">No attractions available.</p>
              )}
            </section>

            <section className="detail-section">
              <h3 className="detail-section-title">Itinerary</h3>
              {selected.itinerary?.length > 0 ? (
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
              ) : (
                <p className="detail-empty">No itinerary available.</p>
              )}
            </section>

            <section className="detail-section">
              <h3 className="detail-section-title">Local Tips</h3>
              {selected.localTips?.length > 0 ? (
                <ul className="detail-list">
                  {selected.localTips.map((tip, index) => (
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

export default Orders;
