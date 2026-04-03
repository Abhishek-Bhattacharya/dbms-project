import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export const loginUser = (payload) => api.post('/auth/login', payload).then((res) => res.data)
export const registerUser = (payload) => api.post('/auth/register', payload).then((res) => res.data)

export const getStudentProfile = (regNo) => api.get('/students/me', { params: { regNo } }).then((res) => res.data)
export const getMyGrievances = (regNo) => api.get('/students/my-grievances', { params: { regNo } }).then((res) => res.data)
export const applyForRoom = (regNo) => api.post('/rooms/apply', null, { params: { regNo } }).then((res) => res.data)
export const createGrievance = (payload) => api.post('/grievances', payload).then((res) => res.data)

export const getAllGrievances = () => api.get('/grievances').then((res) => res.data)
export const getGrievancesByStatus = (status) => api.get('/grievances/status', { params: { status } }).then((res) => res.data)
export const assignWorker = ({ grievanceId, workerId, role = 'WARDEN' }) =>
  api.put('/grievances/assign', null, { params: { grievanceId, workerId, role } }).then((res) => res.data)
export const updateGrievanceStatus = ({ grievanceId, status }) =>
  api.put('/grievances/update-status', null, { params: { grievanceId, status } }).then((res) => res.data)

export const getWorkers = () => api.get('/workers').then((res) => res.data)
export const addWorker = (payload) => api.post('/workers', payload, { params: { role: 'ADMIN' } }).then((res) => res.data)

export const getRooms = () => api.get('/rooms').then((res) => res.data)
export const getAvailableRooms = () => api.get('/rooms/available').then((res) => res.data)
export const addRoom = (payload) => api.post('/rooms', payload).then((res) => res.data)
export const deleteRoom = (roomId) => api.delete(`/rooms/${roomId}`, { params: { role: 'ADMIN' } }).then((res) => res.data)

export default api
