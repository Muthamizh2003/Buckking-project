import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isOwnProfile = user?.username === username
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({})

  useEffect(() => {
    api.get(`/profiles/by-username/${username}`).then((res) => { setProfile(res.data); setForm(res.data) }).catch(() => setError('Failed to load profile'))
  }, [username])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put(`/profiles/${profile.id}`, form)
      setProfile(res.data)
      setEditing(false)
    } catch { setError('Failed to update profile') }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      await api.post(`/profiles/${profile.id}/avatar`, fd)
      const updated = await api.get(`/profiles/by-username/${username}`)
      setProfile(updated.data)
      setForm(updated.data)
    } catch { setError('Failed to upload avatar') }
  }

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!profile) return <div className="text-center py-5"><div className="spinner mx-auto"></div></div>

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="mb-0 fw600">Profile</h5>
            <div className="d-flex gap-2">
              {isOwnProfile && !editing && (
                <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing(true)}>Edit</button>
              )}
              {editing && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setForm(profile) }}>Cancel</button>
              )}
            </div>
          </div>
          <div className="card-body">
            {editing ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Display Name</label>
                    <input className="form-control" name="displayName" value={form.displayName || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input className="form-control" name="location" value={form.location || ''} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" name="bio" rows="3" value={form.bio || ''} onChange={handleChange}></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Website</label>
                    <input className="form-control" name="website" value={form.website || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">GitHub</label>
                    <input className="form-control" name="githubUrl" value={form.githubUrl || ''} onChange={handleChange} placeholder="https://github.com/..." />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">LinkedIn</label>
                    <input className="form-control" name="linkedinUrl" value={form.linkedinUrl || ''} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" name="email" type="email" value={form.email || ''} onChange={handleChange} placeholder="your@email.com" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Mobile</label>
                    <input className="form-control" name="mobile" value={form.mobile || ''} onChange={handleChange} placeholder="10-digit number" pattern="\d{10}" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Save changes</button>
              </form>
            ) : (
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="" className="avatar-circle" />
                  ) : (
                    <div className="avatar-placeholder mx-auto">
                      {profile.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  {isOwnProfile && (
                    <div className="mt-2">
                      <label className="btn btn-outline-primary btn-sm" style={{cursor:'pointer'}}>
                        Upload avatar <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <h4 className="fw-bold mb-1">{profile.displayName || 'No display name'}</h4>
                  {profile.bio && <p className="text-muted" style={{fontSize:'0.875rem'}}>{profile.bio}</p>}
                  {profile.location && <p className="text-muted" style={{fontSize:'0.8125rem'}}>📍 {profile.location}</p>}
                  {profile.email && <p className="text-muted" style={{fontSize:'0.8125rem'}}>✉️ {profile.email}</p>}
                  {profile.mobile && <p className="text-muted" style={{fontSize:'0.8125rem'}}>📞 {profile.mobile}</p>}
                  <hr />
                  <div className="d-flex flex-column gap-2" style={{fontSize:'0.875rem'}}>
                    {profile.website && (
                      <div><span className="text-muted me-2">Website:</span><a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a></div>
                    )}
                    {profile.githubUrl && (
                      <div><span className="text-muted me-2">GitHub:</span><a href={profile.githubUrl} target="_blank" rel="noreferrer">{profile.githubUrl}</a></div>
                    )}
                    {profile.linkedinUrl && (
                      <div><span className="text-muted me-2">LinkedIn:</span><a href={profile.linkedinUrl} target="_blank" rel="noreferrer">{profile.linkedinUrl}</a></div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <button className="btn btn-ghost mt-2" onClick={() => navigate(-1)}>← Back</button>
      </div>
    </div>
  )
}
