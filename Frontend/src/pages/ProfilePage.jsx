import { useEffect, useState } from 'react'
import { getStudentProfile } from '../api/hostelApi'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user.role !== 'STUDENT') return
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await getStudentProfile(user.registrationNumber)
        if (active) setProfile(data)
      } catch (err) {
        if (active) setError(err?.response?.data?.message || err.message || 'Unable to load profile')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="profile-page py-4">
      <div className="container py-2">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
                  <div>
                    <h1 className="h3 fw-bold mb-1">Profile</h1>
                    <p className="text-secondary mb-0">Account details and room assignment</p>
                  </div>
                  <span className="badge text-bg-dark px-3 py-2">{user.role}</span>
                </div>

                {error ? <div className="alert alert-danger">{error}</div> : null}
                {loading ? <div className="alert alert-info">Loading profile...</div> : null}

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="info-box h-100">
                      <span className="text-secondary small">Registration ID</span>
                      <div className="fw-bold">{user.registrationNumber}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-box h-100">
                      <span className="text-secondary small">Role</span>
                      <div className="fw-bold">{user.role}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-box h-100">
                      <span className="text-secondary small">Name</span>
                      <div className="fw-bold">{profile?.name || '-'}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-box h-100">
                      <span className="text-secondary small">Email</span>
                      <div className="fw-bold">{profile?.email || '-'}</div>
                    </div>
                  </div>
                  {user.role === 'STUDENT' ? (
                    <>
                      <div className="col-md-6">
                        <div className="info-box h-100">
                          <span className="text-secondary small">Student ID</span>
                          <div className="fw-bold">{profile?.studentId || '-'}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-box h-100">
                          <span className="text-secondary small">Room allotted</span>
                          <div className="fw-bold">{profile?.room?.roomNumber ?? 'Not assigned'}</div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {user.role !== 'STUDENT' ? (
                  <div className="alert alert-warning mt-4 mb-0">Profile details beyond login identity are available for students only.</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
