import Header from "../components/Header"
import Hero from "../components/Hero"
import Features from "../components/Features"
import HowItWorks from "../components/HowItWorks"
import Tokenomics from "../components/Tokenomics"
import CTA from "../components/CTA"
import Footer from "../components/Footer"

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white text-gray-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Tokenomics />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default Landing