import { Link } from 'react-router-dom'

export default function UserTable({ users, currentUserId, isAdmin, isModerator, onBlock, onUnblock, onDelete, onRemove }) {
  if (users.length === 0) {
    return <div className="empty-state"><p>No users found</p></div>
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Username</th>
            <th>Role</th>
            {isAdmin && <th>Status</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isAdminUser = u.roles?.includes('ADMIN')
            return (
              <tr key={u.id}>
                <td>
                  <div className="fw500">{u.name}</div>
                  <div className="text-muted" style={{fontSize:'0.8125rem'}}>{u.email}</div>
                </td>
                <td style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{u.username}</td>
                <td>
                  {u.roles?.map((r) => (
                    <span key={r} className={`badge me-1 ${r === 'ADMIN' ? 'bg-danger' : r === 'MODERATOR' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{r}</span>
                  ))}
                  {(!u.roles || u.roles.length === 0) && <span className="badge bg-secondary">N/A</span>}
                </td>
                {isAdmin && (
                  <td>
                    <span className={`badge ${u.blocked ? 'bg-danger' : 'bg-success'}`} style={{fontSize:'0.75rem'}}>
                      {u.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                )}
                <td className="text-end">
                  <Link to={`/profile/${u.username}`} className="btn btn-sm btn-ghost">View</Link>
                  {isAdmin && u.id !== currentUserId && !isAdminUser && (
                    <>
                      {u.blocked
                        ? <button className="btn btn-sm btn-ghost" onClick={() => onUnblock(u.id)} style={{color:'var(--success)'}}>Unblock</button>
                        : <button className="btn btn-sm btn-ghost" onClick={() => onBlock(u.id)} style={{color:'var(--warning)'}}>Block</button>
                      }
                      <button className="btn btn-sm btn-ghost" onClick={() => onDelete(u.id)} style={{color:'var(--danger)'}}>Delete</button>
                    </>
                  )}
                  {isModerator && !isAdmin && u.id !== currentUserId && (
                    <button className="btn btn-sm btn-ghost" onClick={() => onRemove(u.id)} style={{color:'var(--danger)'}}>Remove</button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
