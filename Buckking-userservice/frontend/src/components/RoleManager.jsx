import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function RoleManager({ users, onRefresh }) {
  const [roles, setRoles] = useState([])
  const [newRole, setNewRole] = useState('')
  const [assignUserId, setAssignUserId] = useState('')
  const [assignRole, setAssignRole] = useState('')
  const [removeUserId, setRemoveUserId] = useState('')
  const [removeRole, setRemoveRole] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    api.get('/roles').then((res) => setRoles(res.data)).catch(() => {})
  }, [])

  const msg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleCreateRole = async (e) => {
    e.preventDefault()
    if (!newRole.trim()) return
    try {
      await api.post('/roles', { name: newRole.toUpperCase() })
      setNewRole('')
      const res = await api.get('/roles')
      setRoles(res.data)
      msg('success', `Role "${newRole.toUpperCase()}" created`)
    } catch { msg('danger', 'Failed to create role') }
  }

  const handleAssignRole = async (e) => {
    e.preventDefault()
    if (!assignUserId || !assignRole) return
    try {
      await api.post('/roles/assign', { userId: assignUserId, roleName: assignRole })
      msg('success', 'Role assigned')
      onRefresh()
    } catch { msg('danger', 'Failed to assign role') }
  }

  const handleRemoveRole = async (e) => {
    e.preventDefault()
    if (!removeUserId || !removeRole) return
    try {
      await api.post('/roles/remove', { userId: removeUserId, roleName: removeRole })
      msg('success', 'Role removed')
      onRefresh()
    } catch { msg('danger', 'Failed to remove role') }
  }

  return (
    <div className="p-3">
      {message.text && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

      <div className="row g-3">
        <div className="col-md-4">
          <div className="section-title">Roles</div>
          <form onSubmit={handleCreateRole} className="mb-3">
            <div className="input-group">
              <input className="form-control" placeholder="New role name" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
              <button className="btn btn-primary" type="submit">Create</button>
            </div>
          </form>
          {roles.map((r) => (
            <div key={r.id} className="d-flex align-items-center justify-content-between py-2 border-bottom" style={{fontSize:'0.875rem'}}>
              <span className="fw500">{r.name}</span>
              <span className="text-muted" style={{fontSize:'0.75rem'}}>ID: {r.id}</span>
            </div>
          ))}
        </div>
        <div className="col-md-8">
          <div className="section-title">Assign Role</div>
          <form onSubmit={handleAssignRole} className="row g-2 mb-4">
            <div className="col-md-5">
              <select className="form-select" value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)}>
                <option value="">Select user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={assignRole} onChange={(e) => setAssignRole(e.target.value)}>
                <option value="">Select role...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-warning w-100" type="submit">Assign</button>
            </div>
          </form>

          <div className="section-title" style={{color:'var(--danger)'}}>Remove Role</div>
          <form onSubmit={handleRemoveRole} className="row g-2">
            <div className="col-md-5">
              <select className="form-select" value={removeUserId} onChange={(e) => setRemoveUserId(e.target.value)}>
                <option value="">Select user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username} [{u.roles?.join(', ')}]</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={removeRole} onChange={(e) => setRemoveRole(e.target.value)}>
                <option value="">Select role...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-danger w-100" type="submit">Remove</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
