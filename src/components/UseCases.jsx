import { motion } from 'framer-motion'

const UseCases = () => {
  const useCases = [
    {
      icon: '🏥',
      title: 'Healthcare',
      description: 'Secure storage and search of patient records, medical histories, and diagnostic reports while maintaining HIPAA compliance.',
      benefits: ['Patient privacy', 'Regulatory compliance', 'Multi-provider access']
    },
    {
      icon: '💼',
      title: 'Enterprise',
      description: 'Protect confidential business documents, financial records, and intellectual property in cloud environments.',
      benefits: ['Data sovereignty', 'Audit trails', 'Role-based access']
    },
    {
      icon: '🏛️',
      title: 'Government',
      description: 'Safeguard classified information and sensitive government data with military-grade encryption and access controls.',
      benefits: ['National security', 'Compartmentalization', 'Need-to-know basis']
    },
    {
      icon: '⚖️',
      title: 'Legal',
      description: 'Secure client documents, case files, and privileged communications with granular access management.',
      benefits: ['Attorney-client privilege', 'Document integrity', 'Controlled sharing']
    },
    {
      icon: '🎓',
      title: 'Education',
      description: 'Protect student records, research data, and academic materials while enabling collaborative access.',
      benefits: ['FERPA compliance', 'Research collaboration', 'Data privacy']
    },
    {
      icon: '💰',
      title: 'Financial',
      description: 'Secure banking records, transaction data, and financial reports with end-to-end encryption.',
      benefits: ['PCI DSS compliance', 'Fraud prevention', 'Secure transactions']
    }
  ]

  return (
    <section id="usecases" className="py-5 bg-light">
      <div className="container py-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="display-4 fw-bold mb-3">
            <span className="gradient-text">Use Cases</span>
          </h2>
          <p className="lead text-muted">
            Real-world applications of privacy-preserving keyword search
          </p>
        </div>

        <div className="row g-4">
          {useCases.map((useCase, index) => (
            <div className="col-md-6 col-lg-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <motion.div
                whileHover={{ y: -10 }}
                className="card h-100 border-0 shadow-sm"
              >
                <div className="card-body p-4">
                  <div className="display-3 mb-3 text-center">{useCase.icon}</div>
                  <h4 className="card-title text-center mb-3">{useCase.title}</h4>
                  <p className="card-text text-muted mb-4">
                    {useCase.description}
                  </p>
                  <div className="border-top pt-3">
                    <h6 className="text-muted small mb-2">Key Benefits:</h6>
                    <ul className="list-unstyled small">
                      {useCase.benefits.map((benefit, idx) => (
                        <li key={idx} className="mb-1">
                          <span className="text-success">✓</span> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12" data-aos="fade-up">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5 text-center">
                <h3 className="mb-4">Why Organizations Choose Us</h3>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="display-4 gradient-text fw-bold">99.9%</div>
                    <p className="text-muted mb-0">Uptime</p>
                  </div>
                  <div className="col-md-3">
                    <div className="display-4 gradient-text fw-bold">256-bit</div>
                    <p className="text-muted mb-0">Encryption</p>
                  </div>
                  <div className="col-md-3">
                    <div className="display-4 gradient-text fw-bold">0</div>
                    <p className="text-muted mb-0">Data Breaches</p>
                  </div>
                  <div className="col-md-3">
                    <div className="display-4 gradient-text fw-bold">&lt;1s</div>
                    <p className="text-muted mb-0">Search Time</p>
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

export default UseCases
