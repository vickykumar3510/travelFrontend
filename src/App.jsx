import Header from "./components/Header"
import Footer from "./components/Footer"

export default function App(){
  return(
    <>
    <Header />
    <main className="main-content home-page">
      <section className="hero">
        <h1>Welcome to Travel Planner</h1>
        <p className="hero-description">Discover the future of travel with AI-powered planning. Our intelligent assistant helps you design personalized itineraries, suggest hidden gems, optimize routes, and manage bookings seamlessly. Whether you're exploring a new city or planning a global adventure, Travel Planner AI makes every trip smarter, faster, and unforgettable.</p>
      </section>
    </main>
    <Footer />
    </>
  )
}
