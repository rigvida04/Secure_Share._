import { motion } from 'framer-motion'

const Architecture = () => {
  const workflowSteps = [
    {
      step: '1',
      title: 'Data Encryption',
      description: 'User encrypts sensitive data locally using AES-256 encryption before uploading',
      icon: '🔐'
    },
    {
      step: '2',
      title: 'Secret Sharing',
      description: 'Encrypted data is split into multiple shares using Shamir\'s Secret Sharing scheme',
      icon: '✂️'
    },
    {
      step: '3',
      title: 'Cloud Distribution',
      description: 'Shares are distributed across different cloud servers for redundancy and security',
      icon: '☁️'
    },
    {
      step: '4',
      title: 'Index Creation',
      description: 'Searchable encrypted index is generated for keyword-based queries',
      icon: '📑'
    },
    {
      step: '5',
      title: 'Access Control',
      description: 'Attribute-based policies define who can search and access specific data',
      icon: '🛡️'
    },
    {
      step: '6',
      title: 'Secure Search',
      description: 'Users perform encrypted keyword searches without exposing query content',
      icon: '🔍'
    }
  ]

  return (
    <section id="architecture" className="py-5 bg-white">
      <div className="container py-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="display-4 fw-bold mb-3">
            <span className="gradient-text">System Architecture</span>
          </h2>
          <p className="lead text-muted">
            How our privacy-preserving system works
          </p>
        </div>

        <div className="row g-4 mb-5">
          {workflowSteps.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card h-100 border-0 shadow-sm position-relative"
              >
                <div className="position-absolute top-0 start-0 m-3">
                  <span className="badge gradient-bg text-white fs-5 rounded-circle p-3" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.step}
                  </span>
                </div>
                <div className="card-body p-4 pt-5">
                  <div className="display-3 mb-3 text-center">{item.icon}</div>
                  <h5 className="card-title text-center mb-3">{item.title}</h5>
                  <p className="card-text text-muted text-center">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-12" data-aos="fade-up">
            <div className="card border-0 shadow-lg gradient-bg text-white">
              <div className="card-body p-5">
                <h3 className="mb-4 text-center">System Components</h3>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="text-center p-4 bg-white bg-opacity-10 rounded-4">
                      <div className="display-4 mb-3">👤</div>
                      <h5 className="mb-3">Client Side</h5>
                      <ul className="list-unstyled text-start small">
                        <li className="mb-2">• Data encryption module</li>
                        <li className="mb-2">• Key management</li>
                        <li className="mb-2">• Search interface</li>
                        <li className="mb-2">• Access policy creation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-4 bg-white bg-opacity-10 rounded-4">
                      <div className="display-4 mb-3">🖥️</div>
                      <h5 className="mb-3">Server Side</h5>
                      <ul className="list-unstyled text-start small">
                        <li className="mb-2">• Share storage management</li>
                        <li className="mb-2">• Index maintenance</li>
                        <li className="mb-2">• Query processing</li>
                        <li className="mb-2">• Authentication service</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-4 bg-white bg-opacity-10 rounded-4">
                      <div className="display-4 mb-3">☁️</div>
                      <h5 className="mb-3">Cloud Layer</h5>
                      <ul className="list-unstyled text-start small">
                        <li className="mb-2">• Distributed storage</li>
                        <li className="mb-2">• Load balancing</li>
                        <li className="mb-2">• Backup & recovery</li>
                        <li className="mb-2">• Monitoring & logging</li>
                      </ul>
                    </div>
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

export default Architecture
