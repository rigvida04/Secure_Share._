const Footer = () => {
  return (
    <footer className="gradient-bg text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h4 className="mb-4">Secure Share</h4>
            <p className="text-white-50">
              Privacy Preserving Keyword Search with Access Control for 
              Secret Sharing-Based Data Outsourcing
            </p>
            <p className="text-white-50 small mb-0">
              A BCA Academic Project
            </p>
          </div>

          <div className="col-lg-4">
            <h5 className="mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#home" className="text-white-50 text-decoration-none">Home</a>
              </li>
              <li className="mb-2">
                <a href="#about" className="text-white-50 text-decoration-none">About</a>
              </li>
              <li className="mb-2">
                <a href="#features" className="text-white-50 text-decoration-none">Features</a>
              </li>
              <li className="mb-2">
                <a href="#technology" className="text-white-50 text-decoration-none">Technology</a>
              </li>
              <li className="mb-2">
                <a href="#architecture" className="text-white-50 text-decoration-none">Architecture</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4">
            <h5 className="mb-4">Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="https://github.com/rigvida04/Secure_Share._" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none">
                  📚 Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="https://github.com/rigvida04/Secure_Share._" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none">
                  🐙 GitHub Repository
                </a>
              </li>
              <li className="mb-2">
                <span className="text-white-50">📧 contact@secureshare.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 bg-white opacity-25" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-white-50 small mb-0">
              © 2024 Secure Share. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-white-50 small mb-0">
              Built with React, Bootstrap, Tailwind CSS, and Framer Motion
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
