import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null)
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users)
        } else {
            const filtered = users.filter((user) =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredUsers(filtered)
        }
    }, [searchQuery, users])

    const fetchUsers = async () => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        
        try {
            let response = await fetch('http://127.0.0.1:8000/api/users/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
            })
            
            if (response.status === 200) {
                let data = await response.json()
                setUsers(data)
                setFilteredUsers(data)
            } else {
                toast.error('Failed to fetch users')
            }
        } catch (error) {
            toast.error('Error fetching users')
        }
    }

    const handleEdit = (user) => {
        setEditingUser(user.id)
        setEditForm({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role
        })
    }

    const handleCancelEdit = () => {
        setEditingUser(null)
        setEditForm({
            username: '',
            email: '',
            password: '',
            role: ''
        })
    }

    const handleSaveEdit = async (userId) => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            })
            
            if (response.status === 200) {
                toast.success('User updated successfully')
                setEditingUser(null)
                setEditForm({ username: '', email: '', password: '', role: '' })
                fetchUsers()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to update user')
            }
        } catch (error) {
            toast.error('Error updating user')
        }
    }

    const handleDelete = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            return
        }

        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (response.status === 200) {
                toast.success('User deleted successfully')
                fetchUsers()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to delete user')
            }
        } catch (error) {
            toast.error('Error deleting user')
        }
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Student':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Teacher':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'Headmaster':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    User Management
                </h2>
                <p className="text-gray-600">Manage all users, roles, and permissions</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by username, email, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-11 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm placeholder-gray-500 transition-all"
                    />
                    <svg
                        className="absolute left-3.5 top-3.5 h-5 w-5 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                {searchQuery && (
                    <div className="mt-2 flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <p className="text-gray-500 font-medium">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                                        {editingUser === user.id ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={editForm.username}
                                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                        placeholder="Username"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="email"
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                        placeholder="Email"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={editForm.role}
                                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                    >
                                                        <option value="Student">Student</option>
                                                        <option value="Teacher">Teacher</option>
                                                        <option value="Headmaster">Headmaster</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="password"
                                                        value={editForm.password}
                                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                        placeholder="New password (optional)"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleSaveEdit(user.id)}
                                                            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center shadow-md">
                                                            <span className="text-white font-bold text-sm">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold text-gray-800">{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(user.date_joined).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                                            title="Edit User"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id, user.username)}
                                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Students</p>
                            <p className="text-3xl font-bold">{users.filter(u => u.role === 'Student').length}</p>
                        </div>
                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Teachers</p>
                            <p className="text-3xl font-bold">{users.filter(u => u.role === 'Teacher').length}</p>
                        </div>
                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Users</p>
                            <p className="text-3xl font-bold">{users.length}</p>
                        </div>
                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserManagement
