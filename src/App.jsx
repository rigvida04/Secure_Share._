import { useEffect } from 'react'
import AOS from 'aos'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Technology from './components/Technology'
import Architecture from './components/Architecture'
import UseCases from './components/UseCases'
import Team from './components/Team'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    })
  }, [])

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Technology />
      <Architecture />
      <UseCases />
      <Team />
      <Footer />
    </div>
  )
}

export default App
