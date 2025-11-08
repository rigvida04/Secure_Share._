import { motion } from 'framer-motion'

const Features = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Secret Sharing',
      description: 'Data is divided into encrypted shares distributed across multiple servers, ensuring no single point of failure or data exposure.',
      color: 'primary'
    },
    {
      icon: '🔍',
      title: 'Keyword Search',
      description: 'Perform efficient keyword searches on encrypted data without revealing the content to cloud providers using searchable encryption.',
      color: 'success'
    },
    {
      icon: '🛡️',
      title: 'Access Control',
      description: 'Fine-grained access control mechanisms allow data owners to define who can search and access specific data segments.',
      color: 'warning'
    },
    {
      icon: '☁️',
      title: 'Cloud Outsourcing',
      description: 'Seamlessly outsource your data to cloud infrastructure while maintaining complete control and privacy over your information.',
      color: 'info'
    },
    {
      icon: '⚡',
      title: 'High Performance',
      description: 'Optimized algorithms ensure fast search operations even on large encrypted datasets without compromising security.',
      color: 'danger'
    },
    {
      icon: '🔐',
      title: 'End-to-End Encryption',
      description: 'Data is encrypted on the client side before upload and remains encrypted throughout its lifecycle in the cloud.',
      color: 'secondary'
    }
  ]

  return (
    <section id="features" className="py-5 bg-white">
      <div className="container py-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="display-4 fw-bold mb-3">
            <span className="gradient-text">Key Features</span>
          </h2>
          <p className="lead text-muted">
            Powerful capabilities that make our system unique and secure
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <motion.div
                whileHover={{ y: -10 }}
                className="card h-100 border-0 shadow-sm"
              >
                <div className="card-body p-4">
                  <div className={`display-4 mb-3 text-${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h4 className="card-title mb-3">{feature.title}</h4>
                  <p className="card-text text-muted">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12" data-aos="fade-up">
            <div className="bg-light rounded-4 p-5">
              <div className="row align-items-center">
                <div className="col-md-4 text-center mb-4 mb-md-0">
                  <div className="display-3">📊</div>
                </div>
                <div className="col-md-8">
                  <h3 className="mb-3">Comprehensive Security Model</h3>
                  <p className="text-muted mb-3">
                    Our system implements multiple layers of security including cryptographic 
                    protocols, secure multi-party computation techniques, and robust authentication 
                    mechanisms to ensure complete data protection.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Shamir's Secret Sharing Scheme</li>
                    <li className="mb-2">✓ Attribute-Based Access Control (ABAC)</li>
                    <li className="mb-2">✓ Homomorphic Encryption for Search</li>
                    <li className="mb-2">✓ Zero-Knowledge Proof Authentication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
