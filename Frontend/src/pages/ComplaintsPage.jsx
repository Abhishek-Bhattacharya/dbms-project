import { useEffect, useMemo, useState } from 'react'
import {
  assignWorker,
  createGrievance,
  getAllGrievances,
  getGrievancesByStatus,
  getMyGrievances,
  getStudentProfile,
  getWorkers,
  updateGrievanceStatus
} from '../api/hostelApi'
import { useAuth } from '../context/AuthContext'

const statuses = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']
const defaultForm = { type: '', description: '', timeSlot: '' }

export default function ComplaintsPage() {
  const { user } = useAuth()
  const [form, setForm] = useState(defaultForm)
  const [grievances, setGrievances] = useState([])
  const [workers, setWorkers] = useState([])
  const [profile, setProfile] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [assignments, setAssignments] = useState({})
  const [statusUpdates, setStatusUpdates] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const refresh = async (filter = statusFilter) => {
    if (user.role === 'STUDENT') {
      const student = await getStudentProfile(user.registrationNumber)
      setProfile(student)
      const items = await getMyGrievances(user.registrationNumber)
      setGrievances(items)
      return
    }

    const items = filter === 'ALL' ? await getAllGrievances() : await getGrievancesByStatus(filter)
    setGrievances(items)
    if (user.role === 'WARDEN') {
      setWorkers(await getWorkers())
    }
  }

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        await refresh()
      } catch (err) {
        if (active) setError(err?.response?.data?.message || err.message || 'Unable to load complaints')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user.role, user.registrationNumber])

  useEffect(() => {
    if (user.role === 'WARDEN') {
      refresh(statusFilter).catch((err) => {
        setError(err?.response?.data?.message || err.message || 'Unable to refresh complaints')
      })
    }
  }, [statusFilter])

  const visibleGrievances = useMemo(() => grievances || [], [grievances])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await createGrievance({
        type: form.type,
        description: form.description,
        timeSlot: form.timeSlot,
        student: profile ? { studentId: profile.studentId } : undefined
      })
      setForm(defaultForm)
      setMessage('Grievance submitted successfully.')
      await refresh()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to submit grievance')
    }
  }

  const handleAssign = async (grievanceId) => {
    const workerId = assignments[grievanceId]
    if (!workerId) return
    try {
      await assignWorker({ grievanceId, workerId: Number(workerId), role: 'WARDEN' })
      setMessage('Worker assigned.')
      await refresh()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to assign worker')
    }
  }

  const handleStatusUpdate = async (grievanceId) => {
    const status = statusUpdates[grievanceId]
    if (!status) return
    try {
      await updateGrievanceStatus({ grievanceId, status })
      setMessage('Status updated.')
      await refresh()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to update status')
    }
  }

  return (
    <div className="complaints-page py-4">
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
          <div>
            <h1 className="h3 fw-bold text-white mb-1">Complaints / Requests</h1>
            <p className="text-white-50 mb-0">{user.role === 'STUDENT' ? 'Raise a grievance and track your requests.' : 'Review and manage hostel grievances.'}</p>
          </div>
          {user.role === 'WARDEN' ? (
            <div className="btn-group flex-wrap">
              {statuses.map((status) => (
                <button key={status} type="button" className={`btn btn-sm ${statusFilter === status ? 'btn-warning' : 'btn-outline-light'}`} onClick={() => setStatusFilter(status)}>
                  {status}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {message ? <div className="alert alert-success">{message}</div> : null}
        {loading ? <div className="alert alert-info">Loading complaints...</div> : null}

        {user.role === 'STUDENT' ? (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">Raise grievance</h2>
                  <form className="vstack gap-3" onSubmit={handleSubmit}>
                    <div>
                      <label className="form-label">Category</label>
                      <input className="form-control" name="type" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} placeholder="Plumbing, electrical, cleaning..." required />
                    </div>
                    <div>
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows="5" name="description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Describe the issue" required />
                    </div>
                    <div>
                      <label className="form-label">Preferred time slot</label>
                      <input className="form-control" name="timeSlot" value={form.timeSlot} onChange={(e) => setForm((prev) => ({ ...prev, timeSlot: e.target.value }))} placeholder="Morning / Evening / 4-6 PM" />
                    </div>
                    <button className="btn btn-warning w-100" type="submit">Submit grievance</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">My grievances</h2>
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Worker</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleGrievances.length ? visibleGrievances.map((item) => (
                          <tr key={item.grievanceId}>
                            <td>{item.type}</td>
                            <td><span className="badge text-bg-secondary">{item.status || 'PENDING'}</span></td>
                            <td>{item.worker?.name || '-'}</td>
                            <td>{item.timeSlot || '-'}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan="4" className="text-center text-secondary py-4">No grievances yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Assign</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleGrievances.length ? visibleGrievances.map((item) => (
                      <tr key={item.grievanceId}>
                        <td>{item.grievanceId}</td>
                        <td>{item.type}</td>
                        <td style={{ minWidth: '260px' }}>{item.description}</td>
                        <td><span className="badge text-bg-warning">{item.status || 'PENDING'}</span></td>
                        <td style={{ minWidth: '220px' }}>
                          <div className="d-flex gap-2">
                            <select className="form-select form-select-sm" value={assignments[item.grievanceId] || ''} onChange={(e) => setAssignments((prev) => ({ ...prev, [item.grievanceId]: e.target.value }))}>
                              <option value="">Worker</option>
                              {workers.map((worker) => (
                                <option key={worker.workerId} value={worker.workerId}>{worker.name}</option>
                              ))}
                            </select>
                            <button className="btn btn-sm btn-primary" onClick={() => handleAssign(item.grievanceId)}>Assign</button>
                          </div>
                        </td>
                        <td style={{ minWidth: '220px' }}>
                          <div className="d-flex gap-2">
                            <select className="form-select form-select-sm" value={statusUpdates[item.grievanceId] || ''} onChange={(e) => setStatusUpdates((prev) => ({ ...prev, [item.grievanceId]: e.target.value }))}>
                              <option value="">Status</option>
                              {statuses.filter((status) => status !== 'ALL').map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            <button className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(item.grievanceId)}>Save</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="text-center text-secondary py-4">No grievances found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
