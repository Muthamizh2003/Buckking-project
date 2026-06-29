import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import UserTable from '../components/UserTable'
import RoleManager from '../components/RoleManager'

export default function DashboardPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [tab, setTab] = useState('users')
  const isAdmin = user?.roles?.includes('ADMIN')
  const isModerator = user?.roles?.includes('MODERATOR')

  const fetchUsers = async () => {
    try {
      const endpoint = isAdmin ? '/users' : '/users/regular'
      const res = await api.get(endpoint)
      setUsers(res.data)
    } catch (err) {
      setError('Failed to fetch users')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [isAdmin])

  const handleBlock = async (id) => { await api.put(`/users/${id}/block`); fetchUsers() }
  const handleUnblock = async (id) => { await api.put(`/users/${id}/unblock`); fetchUsers() }
  const handleDelete = async (id) => { if (window.confirm('Delete this user?')) { await api.delete(`/users/${id}`); fetchUsers() } }
  const handleRemove = async (id) => { if (window.confirm('Remove this user from community?')) { await api.delete(`/users/${id}/remove`); fetchUsers() } }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard</h3>
          <p className="text-muted mb-0" style={{fontSize:'0.875rem'}}>
            {isAdmin ? 'Manage all users and roles' : 'Manage your community'}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="label">Total users</div>
            <div className="value">{users.length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="label">Signed in as</div>
            <div className="value" style={{fontSize:'1.125rem'}}>{user?.name || user?.username}</div>
            <div className="sub">{user?.roles?.join(', ')}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <ul className="nav nav-pills" style={{gap:'0.25rem'}}>
            <li className="nav-item">
              <button className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('users')}>Users</button>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <button className={`btn btn-sm ${tab === 'roles' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('roles')}>Roles</button>
              </li>
            )}
          </ul>
        </div>
        <div className="card-body p-0">
          {tab === 'users' && (
            <UserTable
              users={users}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              isModerator={isModerator}
              onBlock={handleBlock}
              onUnblock={handleUnblock}
              onDelete={handleDelete}
              onRemove={handleRemove}
              onRefresh={fetchUsers}
            />
          )}
          {tab === 'roles' && <RoleManager users={users} onRefresh={fetchUsers} />}
        </div>
      </div>
    </div>
  )
}
