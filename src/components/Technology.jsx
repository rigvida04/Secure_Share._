import { motion } from 'framer-motion'

const Technology = () => {
  const techStack = [
    {
      category: 'Cryptography',
      technologies: [
        { name: 'Shamir Secret Sharing', icon: '🔐' },
        { name: 'AES-256 Encryption', icon: '🔒' },
        { name: 'RSA Key Exchange', icon: '🔑' },
        { name: 'SHA-256 Hashing', icon: '#️⃣' }
      ]
    },
    {
      category: 'Backend',
      technologies: [
        { name: 'Node.js / Python', icon: '⚙️' },
        { name: 'RESTful APIs', icon: '🌐' },
        { name: 'JWT Authentication', icon: '🎫' },
        { name: 'WebSocket', icon: '🔌' }
      ]
    },
    {
      category: 'Frontend',
      technologies: [
        { name: 'React.js', icon: '⚛️' },
        { name: 'Bootstrap 5', icon: '🎨' },
        { name: 'Tailwind CSS', icon: '💨' },
        { name: 'Framer Motion', icon: '✨' }
      ]
    },
    {
      category: 'Cloud & Storage',
      technologies: [
        { name: 'AWS S3 / Azure', icon: '☁️' },
        { name: 'MongoDB', icon: '🍃' },
        { name: 'Redis Cache', icon: '💾' },
        { name: 'Docker', icon: '🐳' }
      ]
    }
  ]

  return (
    <section id="technology" className="py-5 bg-light">
      <div className="container py-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="display-4 fw-bold mb-3">
            <span className="gradient-text">Technology Stack</span>
          </h2>
          <p className="lead text-muted">
            Built with modern and robust technologies
          </p>
        </div>

        <div className="row g-4">
          {techStack.map((stack, index) => (
            <div className="col-md-6" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header gradient-bg text-white py-3">
                  <h4 className="mb-0">{stack.category}</h4>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {stack.technologies.map((tech, techIndex) => (
                      <div className="col-6" key={techIndex}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="d-flex align-items-center p-3 bg-light rounded-3"
                        >
                          <span className="fs-3 me-3">{tech.icon}</span>
                          <span className="fw-medium">{tech.name}</span>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12" data-aos="fade-up">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <h3 className="text-center mb-4">Implementation Highlights</h3>
                <div className="row g-4">
                  <div className="col-md-4 text-center">
                    <div className="display-4 text-primary mb-3">🏗️</div>
                    <h5>Modular Architecture</h5>
                    <p className="text-muted small">
                      Clean separation of concerns with microservices architecture
                    </p>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="display-4 text-success mb-3">🚀</div>
                    <h5>Scalable Design</h5>
                    <p className="text-muted small">
                      Horizontal scaling capabilities to handle growing data volumes
                    </p>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="display-4 text-warning mb-3">🔄</div>
                    <h5>Real-time Updates</h5>
                    <p className="text-muted small">
                      WebSocket integration for instant notifications and updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Technology
