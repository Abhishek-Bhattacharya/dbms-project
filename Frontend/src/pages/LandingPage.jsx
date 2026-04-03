import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Role-based access',
    text: 'Separate flows for admin, warden, and student with clean routing and guarded pages.'
  },
  {
    title: 'Fast complaint handling',
    text: 'Raise grievances, assign workers, and track status updates in one dashboard.'
  },
  {
    title: 'Room visibility',
    text: 'Students can view their room allocation and admins can manage room inventory.'
  }
]

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-section py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4 justify-content-center">
            <div className="col-lg-10 col-xl-9 text-center">
              <span className="badge badge-accent mb-3 px-3 py-2">HostelFlow</span>
              <h1 className="display-5 fw-bold text-white mb-3">Smart Hostel Management, Simplified.</h1>
              <p className="lead text-light-emphasis mb-4">
                All your hostel operations—rooms, complaints, staff, and students—managed in one seamless platform.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link className="btn btn-warning btn-lg" to="/auth">Login / Sign up</Link>
                <Link className="btn btn-dashboard-outline btn-lg" to="/dashboard">Open dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-4">
        <div className="row g-4">
          {features.map((feature) => (
            <div key={feature.title} className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold">{feature.title}</h5>
                  <p className="card-text text-secondary mb-0">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
