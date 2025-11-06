import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Technology', href: '#technology' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Use Cases', href: '#usecases' },
    { name: 'Team', href: '#team' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-light bg-white shadow' : 'navbar-dark bg-transparent'} transition-all`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className="container">
        <a className="navbar-brand fw-bold" href="#home">
          <span className={scrolled ? 'gradient-text' : 'text-white'}>Secure Share</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <a className="nav-link" href={item.href}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
