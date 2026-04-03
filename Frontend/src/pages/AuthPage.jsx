import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = ['STUDENT', 'WARDEN', 'ADMIN']

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ registrationNumber: '', password: '', role: 'STUDENT' })
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const data = await login({
        registrationNumber: form.registrationNumber,
        password: form.password
      })
      if (data.role && data.role !== form.role) {
        setError(`Logged in as ${data.role}. The selected role was only for filtering.`)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed')
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    try {
      await register({
        registrationNumber: form.registrationNumber,
        password: form.password,
        role: form.role
      })
      setSuccess('Account created successfully. Please log in.')
      setMode('login')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-page py-5">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-dark text-white p-4 border-0">
                <h2 className="h4 fw-bold mb-1">Welcome back</h2>
                <p className="mb-0 text-white-50">Login or create a role-based account for the hostel system.</p>
              </div>
              <div className="card-body p-4 p-md-5">
                <ul className="nav nav-pills nav-fill mb-4">
                  <li className="nav-item">
                    <button className={`nav-link ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Login</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign up</button>
                  </li>
                </ul>

                {error ? <div className="alert alert-danger">{error}</div> : null}
                {success ? <div className="alert alert-success">{success}</div> : null}

                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="vstack gap-3">
                  <div>
                    <label className="form-label">Registration ID</label>
                    <input className="form-control form-control-lg" name="registrationNumber" value={form.registrationNumber} onChange={onChange} placeholder="Enter registration ID" required />
                  </div>
                  <div>
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control form-control-lg" name="password" value={form.password} onChange={onChange} placeholder="Enter password" required />
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <select className="form-select form-select-lg" name="role" value={form.role} onChange={onChange}>
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="form-text">The backend returns the actual role after login.</div>
                  </div>
                  <button type="submit" className="btn btn-warning btn-lg w-100" disabled={loading}>
                    {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
