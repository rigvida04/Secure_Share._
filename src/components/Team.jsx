import { motion } from 'framer-motion'

const Team = () => {
  return (
    <section id="team" className="py-5 bg-white">
      <div className="container py-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="display-4 fw-bold mb-3">
            <span className="gradient-text">Project Team</span>
          </h2>
          <p className="lead text-muted">
            BCA Academic Project Team
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg" data-aos="fade-up">
              <div className="card-body p-5">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center mb-4 mb-md-0">
                    <div className="rounded-circle bg-gradient-primary d-inline-flex align-items-center justify-content-center gradient-bg text-white" style={{ width: '150px', height: '150px' }}>
                      <span className="display-3">👥</span>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h3 className="mb-4">About the Team</h3>
                    <p className="text-muted mb-4">
                      This project is developed as part of the Bachelor of Computer Applications (BCA) 
                      curriculum, focusing on advanced topics in cryptography, cloud computing, and 
                      data security. Our team has worked diligently to implement cutting-edge privacy-preserving 
                      techniques and create a practical solution for secure data outsourcing.
                    </p>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">🎓</span>
                          <div>
                            <div className="fw-bold">Academic Level</div>
                            <small className="text-muted">BCA Program</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">📚</span>
                          <div>
                            <div className="fw-bold">Focus Area</div>
                            <small className="text-muted">Cryptography & Security</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">💻</span>
                          <div>
                            <div className="fw-bold">Technology</div>
                            <small className="text-muted">Full Stack Development</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">🔬</span>
                          <div>
                            <div className="fw-bold">Research</div>
                            <small className="text-muted">Privacy & Security</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-6" data-aos="fade-right">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="mb-4">📧 Contact Information</h4>
                <div className="mb-3">
                  <div className="d-flex align-items-start mb-3">
                    <span className="me-3 fs-5">✉️</span>
                    <div>
                      <div className="fw-bold">Email</div>
                      <a href="mailto:contact@secureshare.edu" className="text-decoration-none">
                        contact@secureshare.edu
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-3">
                    <span className="me-3 fs-5">🐙</span>
                    <div>
                      <div className="fw-bold">GitHub</div>
                      <a href="https://github.com/rigvida04/Secure_Share._" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        github.com/rigvida04/Secure_Share._
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6" data-aos="fade-left">
            <div className="card h-100 border-0 shadow-sm gradient-bg text-white">
              <div className="card-body p-4">
                <h4 className="mb-4">🎯 Project Goals</h4>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <strong>✓</strong> Implement secure secret sharing algorithms
                  </li>
                  <li className="mb-3">
                    <strong>✓</strong> Enable privacy-preserving keyword search
                  </li>
                  <li className="mb-3">
                    <strong>✓</strong> Develop fine-grained access control
                  </li>
                  <li className="mb-3">
                    <strong>✓</strong> Create user-friendly interface
                  </li>
                  <li className="mb-3">
                    <strong>✓</strong> Demonstrate practical application
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team
