import { motion } from 'framer-motion'

const About = () => {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <motion.div
              data-aos="fade-up"
              className="text-center mb-5"
            >
              <h2 className="display-4 fw-bold mb-3">
                <span className="gradient-text">About the Project</span>
              </h2>
              <p className="lead text-muted">
                A cutting-edge BCA academic project exploring the intersection of 
                cryptography, cloud computing, and data privacy
              </p>
            </motion.div>

            <div className="row g-4">
              <div className="col-md-6" data-aos="fade-right">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="display-6 mb-3">🎯</div>
                    <h4 className="card-title mb-3">Project Goal</h4>
                    <p className="card-text text-muted">
                      To develop a secure and efficient system that enables users to 
                      outsource their sensitive data to cloud servers while preserving 
                      privacy through secret sharing techniques. The system allows 
                      keyword-based searches without revealing data content to the cloud provider.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6" data-aos="fade-left">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="display-6 mb-3">🔬</div>
                    <h4 className="card-title mb-3">Research Focus</h4>
                    <p className="card-text text-muted">
                      Our research focuses on implementing Shamir's Secret Sharing scheme 
                      combined with searchable encryption to provide both data confidentiality 
                      and search functionality. We also integrate fine-grained access control 
                      mechanisms to manage user permissions effectively.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12" data-aos="fade-up">
                <div className="card border-0 shadow-sm gradient-bg text-white">
                  <div className="card-body p-5">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h4 className="card-title mb-3">Why This Matters</h4>
                        <p className="card-text mb-0">
                          With increasing data breaches and privacy concerns, traditional 
                          cloud storage solutions expose sensitive information to potential 
                          threats. Our system addresses this by ensuring that even the cloud 
                          provider cannot access the actual data content while still enabling 
                          powerful search capabilities and flexible access control.
                        </p>
                      </div>
                      <div className="col-md-4 text-center">
                        <div className="display-1">💡</div>
                      </div>
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

export default About
