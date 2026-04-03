import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  addRoom,
  addWorker,
  applyForRoom,
  assignWorker,
  deleteRoom,
  getAllGrievances,
  getAvailableRooms,
  getGrievancesByStatus,
  getMyGrievances,
  getRooms,
  getStudentProfile,
  getWorkers,
  updateGrievanceStatus
} from '../api/hostelApi'
import { useAuth } from '../context/AuthContext'

const grievanceStatuses = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']
const defaultRoomForm = { floor: '', roomNumber: '', capacity: '', occupiedCount: 0 }
const defaultWorkerForm = { name: '', type: '' }
const defaultCategoryForm = { name: '' }

function statCard({ label, value, tone = 'dark' }) {
  return (
    <div className="col-md-4">
      <div className={`card border-0 shadow-sm stat-card stat-${tone} metric-card`}>
        <div className="card-body p-3 p-xl-4">
          <div className="text-uppercase small fw-bold text-secondary metric-label">{label}</div>
          <div className="display-6 fw-bold text-white metric-value">{value}</div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [grievances, setGrievances] = useState([])
  const [workers, setWorkers] = useState([])
  const [rooms, setRooms] = useState([])
  const [availableRooms, setAvailableRooms] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [roomForm, setRoomForm] = useState(defaultRoomForm)
  const [workerForm, setWorkerForm] = useState(defaultWorkerForm)
  const [categoryForm, setCategoryForm] = useState(defaultCategoryForm)
  const [categories, setCategories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hostel_categories') || '[]')
    } catch {
      return []
    }
  })
  const [assignments, setAssignments] = useState({})
  const [statusUpdates, setStatusUpdates] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const refreshStudentData = async () => {
    const profileData = await getStudentProfile(user.registrationNumber)
    setProfile(profileData)
    const grievanceData = await getMyGrievances(user.registrationNumber)
    setGrievances(grievanceData)
    const roomData = await getAvailableRooms()
    setAvailableRooms(roomData)
  }

  const refreshWardenData = async (filter = statusFilter) => {
    const grievanceData = filter === 'ALL' ? await getAllGrievances() : await getGrievancesByStatus(filter)
    setGrievances(grievanceData)
    const workerData = await getWorkers()
    setWorkers(workerData)
  }

  const refreshAdminData = async () => {
    const roomData = await getRooms()
    const workerData = await getWorkers()
    const grievanceData = await getAllGrievances()
    setRooms(roomData)
    setWorkers(workerData)
    setGrievances(grievanceData)
  }

  useEffect(() => {
    let alive = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        if (user.role === 'STUDENT') {
          await refreshStudentData()
        } else if (user.role === 'WARDEN') {
          await refreshWardenData()
        } else {
          await refreshAdminData()
        }
      } catch (err) {
        if (alive) setError(err?.response?.data?.message || err.message || 'Unable to load dashboard')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [user.role])

  useEffect(() => {
    if (user.role === 'WARDEN') {
      refreshWardenData(statusFilter).catch((err) => {
        setError(err?.response?.data?.message || err.message || 'Unable to refresh grievances')
      })
    }
  }, [statusFilter])

  useEffect(() => {
    localStorage.setItem('hostel_categories', JSON.stringify(categories))
  }, [categories])

  const visibleGrievances = useMemo(() => grievances || [], [grievances])

  const handleRoomFormChange = (event) => {
    const { name, value } = event.target
    setRoomForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleWorkerFormChange = (event) => {
    const { name, value } = event.target
    setWorkerForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (event) => {
    const { name, value } = event.target
    setCategoryForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitRoom = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    try {
      await addRoom({
        floor: Number(roomForm.floor),
        roomNumber: Number(roomForm.roomNumber),
        capacity: Number(roomForm.capacity),
        occupiedCount: Number(roomForm.occupiedCount || 0)
      })
      setMessage('Room added successfully.')
      setRoomForm(defaultRoomForm)
      refreshAdminData()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to add room')
    }
  }

  const submitWorker = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    try {
      await addWorker(workerForm)
      setMessage('Worker added successfully.')
      setWorkerForm(defaultWorkerForm)
      refreshAdminData()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to add worker')
    }
  }

  const submitCategory = (event) => {
    event.preventDefault()
    if (!categoryForm.name.trim()) return
    setCategories((prev) => [...prev, categoryForm.name.trim()])
    setCategoryForm(defaultCategoryForm)
    setMessage('Category saved locally. Connect a backend endpoint later if needed.')
  }

  const removeCategory = (index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index))
  }

  const handleApplyRoom = async () => {
    setMessage('')
    setError('')
    try {
      await applyForRoom(user.registrationNumber)
      setMessage('Room request submitted.')
      if (user.role === 'STUDENT') {
        await refreshStudentData()
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to apply for room')
    }
  }

  const handleAssignWorker = async (grievanceId) => {
    const workerId = assignments[grievanceId]
    if (!workerId) return
    setError('')
    try {
      await assignWorker({ grievanceId, workerId: Number(workerId), role: 'WARDEN' })
      setMessage('Worker assigned successfully.')
      refreshWardenData()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to assign worker')
    }
  }

  const handleStatusUpdate = async (grievanceId) => {
    const status = statusUpdates[grievanceId]
    if (!status) return
    setError('')
    try {
      await updateGrievanceStatus({ grievanceId, status })
      setMessage('Grievance status updated.')
      refreshWardenData()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to update status')
    }
  }

  const handleDeleteRoom = async (roomId) => {
    setError('')
    try {
      await deleteRoom(roomId)
      setMessage('Room deleted successfully.')
      refreshAdminData()
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to delete room')
    }
  }

  const totalGrievances = visibleGrievances.length
  const pendingGrievances = visibleGrievances.filter((item) => item.status === 'PENDING').length
  const assignedGrievances = visibleGrievances.filter((item) => item.status === 'ASSIGNED').length
  const previewRooms = availableRooms.slice(0, 4)

  return (
    <div className="dashboard-page py-3 py-xl-4">
      <div className="container-fluid px-3 px-xl-4">
        <div className="card border-0 shadow-sm rounded-4 mb-3 mb-xl-4 dashboard-hero">
          <div className="card-body p-3 p-xl-4 d-flex justify-content-between align-items-start gap-3 flex-wrap">
            <div>
              <div className="dashboard-kicker text-secondary text-uppercase small fw-semibold mb-1">Hostel command center</div>
              <h1 className="h2 fw-bold mb-1 text-white">Dashboard</h1>
              <p className="text-white-50 mb-0">Signed in as {user.role} • {user.registrationNumber}</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/profile" className="btn btn-dashboard-outline">Open profile</Link>
              <Link to="/complaints" className="btn btn-warning">Go to complaints</Link>
            </div>
          </div>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {message ? <div className="alert alert-success">{message}</div> : null}
        {loading ? <div className="alert alert-info">Loading dashboard data...</div> : null}

        <div className="row g-3 mb-3 mb-xl-4">
          {statCard({ label: 'Total grievances', value: totalGrievances, tone: 'primary' })}
          {statCard({ label: 'Pending', value: pendingGrievances, tone: 'danger' })}
          {statCard({ label: 'Assigned', value: assignedGrievances, tone: 'success' })}
        </div>

        {user.role === 'STUDENT' ? (
          <div className="row g-3 g-xl-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 rounded-4 dashboard-card-tight">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">Recent grievances</h2>
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleGrievances.length ? visibleGrievances.map((item) => (
                          <tr key={item.grievanceId || `${item.type}-${item.timeSlot}`}>
                            <td>{item.type}</td>
                            <td><span className="badge text-bg-secondary">{item.status || 'PENDING'}</span></td>
                            <td>{item.timeSlot || '-'}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan="3" className="text-center text-secondary py-4">No grievances yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="vstack gap-3">
                <div className="card shadow-sm border-0 rounded-4 dashboard-card-tight">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-3">
                      <h2 className="h5 fw-bold mb-0">My room</h2>
                      <button className="btn btn-sm btn-warning" onClick={handleApplyRoom}>Apply for room</button>
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="info-box">
                          <span className="text-secondary small">Room</span>
                          <div className="fw-bold">{profile?.room?.roomNumber ?? 'Not assigned'}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="info-box">
                          <span className="text-secondary small">Floor</span>
                          <div className="fw-bold">{profile?.room?.floor ?? '-'}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="info-box">
                          <span className="text-secondary small">Capacity</span>
                          <div className="fw-bold">{profile?.room?.capacity ?? '-'}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="info-box">
                          <span className="text-secondary small">Available</span>
                          <div className="fw-bold">{availableRooms.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card shadow-sm border-0 rounded-4 dashboard-card-tight">
                  <div className="card-body p-4">
                    <h2 className="h5 fw-bold mb-3">Profile summary</h2>
                    <div className="vstack gap-2">
                      <div className="info-box">
                        <span className="text-secondary small">Name</span>
                        <div className="fw-bold">{profile?.name || 'Student'}</div>
                      </div>
                      <div className="info-box">
                        <span className="text-secondary small">Email</span>
                        <div className="fw-bold text-break">{profile?.email || '-'}</div>
                      </div>
                      <div className="info-box">
                        <span className="text-secondary small">Registration ID</span>
                        <div className="fw-bold">{user.registrationNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-4 dashboard-card-tight">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <h2 className="h5 fw-bold mb-0">Available rooms</h2>
                    <span className="badge text-bg-secondary">{availableRooms.length} open</span>
                  </div>
                  <div className="row g-3">
                    {previewRooms.length ? previewRooms.map((room) => (
                      <div className="col-md-6 col-xl-3" key={room.roomId}>
                        <div className="info-box h-100">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div>
                              <div className="fw-bold">Room {room.roomNumber}</div>
                              <div className="text-secondary small">Floor {room.floor}</div>
                            </div>
                            <span className="badge text-bg-light border text-dark">{room.occupiedCount}/{room.capacity}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-12">
                        <div className="text-secondary">No available rooms to show.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {user.role === 'WARDEN' ? (
          <div className="row g-4">
            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <h2 className="h5 fw-bold mb-0">Grievance board</h2>
                    <div className="btn-group flex-wrap" role="group">
                      {['ALL', ...grievanceStatuses].map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`btn btn-sm ${statusFilter === status ? 'btn-dark' : 'btn-outline-dark'}`}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Worker</th>
                          <th>Assign</th>
                          <th>Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleGrievances.length ? visibleGrievances.map((item) => (
                          <tr key={item.grievanceId}>
                            <td>{item.grievanceId}</td>
                            <td>{item.type}</td>
                            <td className="text-wrap" style={{ minWidth: '260px' }}>{item.description}</td>
                            <td><span className="badge text-bg-warning">{item.status || 'PENDING'}</span></td>
                            <td>{item.worker?.name || '-'}</td>
                            <td style={{ minWidth: '220px' }}>
                              <div className="d-flex gap-2 align-items-center">
                                <select
                                  className="form-select form-select-sm"
                                  value={assignments[item.grievanceId] || ''}
                                  onChange={(e) => setAssignments((prev) => ({ ...prev, [item.grievanceId]: e.target.value }))}
                                >
                                  <option value="">Worker</option>
                                  {workers.map((worker) => (
                                    <option key={worker.workerId} value={worker.workerId}>
                                      {worker.name} • {worker.type}
                                    </option>
                                  ))}
                                </select>
                                <button className="btn btn-sm btn-primary" onClick={() => handleAssignWorker(item.grievanceId)}>Go</button>
                              </div>
                            </td>
                            <td style={{ minWidth: '220px' }}>
                              <div className="d-flex gap-2 align-items-center">
                                <select
                                  className="form-select form-select-sm"
                                  value={statusUpdates[item.grievanceId] || ''}
                                  onChange={(e) => setStatusUpdates((prev) => ({ ...prev, [item.grievanceId]: e.target.value }))}
                                >
                                  <option value="">Status</option>
                                  {grievanceStatuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                                <button className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(item.grievanceId)}>Save</button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="7" className="text-center text-secondary py-4">No grievances found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {user.role === 'ADMIN' ? (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">Add room</h2>
                  <form className="vstack gap-3" onSubmit={submitRoom}>
                    <div className="row g-2">
                      <div className="col-6">
                        <input className="form-control" name="floor" placeholder="Floor" value={roomForm.floor} onChange={handleRoomFormChange} required />
                      </div>
                      <div className="col-6">
                        <input className="form-control" name="roomNumber" placeholder="Room number" value={roomForm.roomNumber} onChange={handleRoomFormChange} required />
                      </div>
                      <div className="col-6">
                        <input className="form-control" name="capacity" placeholder="Capacity" value={roomForm.capacity} onChange={handleRoomFormChange} required />
                      </div>
                      <div className="col-6">
                        <input className="form-control" name="occupiedCount" placeholder="Occupied" value={roomForm.occupiedCount} onChange={handleRoomFormChange} />
                      </div>
                    </div>
                    <button className="btn btn-warning w-100" type="submit">Create room</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">Add worker</h2>
                  <form className="vstack gap-3" onSubmit={submitWorker}>
                    <input className="form-control" name="name" placeholder="Worker name" value={workerForm.name} onChange={handleWorkerFormChange} required />
                    <input className="form-control" name="type" placeholder="Worker type" value={workerForm.type} onChange={handleWorkerFormChange} required />
                    <button className="btn btn-dark w-100" type="submit">Create worker</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">Grievance categories</h2>
                  <form className="d-flex gap-2 mb-3" onSubmit={submitCategory}>
                    <input className="form-control" name="name" placeholder="Add category" value={categoryForm.name} onChange={handleCategoryChange} />
                    <button className="btn btn-outline-dark" type="submit">Add</button>
                  </form>
                  <div className="d-flex flex-column gap-2">
                    {categories.length ? categories.map((category, index) => (
                      <div key={`${category}-${index}`} className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2">
                        <span>{category}</span>
                        <button className="btn btn-sm btn-link text-danger p-0" onClick={() => removeCategory(index)}>Delete</button>
                      </div>
                    )) : (
                      <div className="text-secondary">No local categories yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h2 className="h5 fw-bold mb-0">Rooms and workers</h2>
                    <button className="btn btn-outline-dark btn-sm" onClick={refreshAdminData}>Refresh</button>
                  </div>
                  <div className="row g-4">
                    <div className="col-lg-7">
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th>Room</th>
                              <th>Floor</th>
                              <th>Capacity</th>
                              <th>Occupied</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rooms.length ? rooms.map((room) => (
                              <tr key={room.roomId}>
                                <td>{room.roomNumber}</td>
                                <td>{room.floor}</td>
                                <td>{room.capacity}</td>
                                <td>{room.occupiedCount}</td>
                                <td className="text-end">
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRoom(room.roomId)}>Delete</button>
                                </td>
                              </tr>
                            )) : (
                              <tr><td colSpan="5" className="text-center text-secondary py-4">No rooms yet.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th>Worker</th>
                              <th>Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workers.length ? workers.map((worker) => (
                              <tr key={worker.workerId}>
                                <td>{worker.name}</td>
                                <td>{worker.type}</td>
                              </tr>
                            )) : (
                              <tr><td colSpan="2" className="text-center text-secondary py-4">No workers yet.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
