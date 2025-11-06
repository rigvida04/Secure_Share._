import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section id="home" className="gradient-bg min-vh-100 d-flex align-items-center text-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-3 fw-bold mb-4">
                Privacy Preserving Keyword Search
              </h1>
              <h3 className="h4 mb-4">
                With Access Control for Secret Sharing-Based Data Outsourcing
              </h3>
              <p className="lead mb-4">
                Secure your data in the cloud while maintaining full search capabilities 
                and granular access control through advanced secret sharing techniques.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <motion.a
                  href="#about"
                  className="btn btn-light btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.a>
                <motion.a
                  href="#features"
                  className="btn btn-outline-light btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Features
                </motion.a>
              </div>
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white bg-opacity-10 rounded-4 p-5 backdrop-blur">
                <div className="display-1 mb-3">🔐</div>
                <h4 className="mb-3">Secure • Private • Efficient</h4>
                <div className="d-flex justify-content-around mt-4">
                  <div>
                    <div className="display-6 fw-bold">256-bit</div>
                    <small>Encryption</small>
                  </div>
                  <div>
                    <div className="display-6 fw-bold">100%</div>
                    <small>Privacy</small>
                  </div>
                  <div>
                    <div className="display-6 fw-bold">Fast</div>
                    <small>Search</small>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
