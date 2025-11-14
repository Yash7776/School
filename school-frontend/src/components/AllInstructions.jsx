import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AllInstructions = ({ isHeadmaster = false }) => {
    const [instruction, setinstruction] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredInstructions, setFilteredInstructions] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState('')

    useEffect(() => {
        fetchInstructions()
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredInstructions(instruction)
        } else {
            const filtered = instruction.filter((inst) =>
                inst.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inst.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredInstructions(filtered)
        }
    }, [searchQuery, instruction])

    const fetchInstructions = async (search = '') => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        const url = search 
            ? `https://school-backend-nwxn.onrender.com/api/instructions/?search=${encodeURIComponent(search)}`
            : 'https://school-backend-nwxn.onrender.com/api/instructions/'
        
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`,
                'content-Type': 'application/json'
            },
        })
        let data = await response.json()
        console.log({ 'data': data })
        console.log({ 'response': response })
        if (response.status === 200) {
            setinstruction(data)
            setFilteredInstructions(data)
        }
        else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    const handleEdit = (inst) => {
        setEditingId(inst.id)
        setEditContent(inst.content)
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditContent('')
    }

    const handleSaveEdit = async (id) => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        
        try {
            let response = await fetch(`https://school-backend-nwxn.onrender.com/api/instructions/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: editContent })
            })
            
            if (response.status === 200) {
                toast.success('Instruction updated successfully')
                setEditingId(null)
                setEditContent('')
                fetchInstructions()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to update instruction')
            }
        } catch (error) {
            toast.error('Error updating instruction')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this instruction?')) {
            return
        }

        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        
        try {
            let response = await fetch(`https://school-backend-nwxn.onrender.com/api/instructions/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (response.status === 200) {
                toast.success('Instruction deleted successfully')
                fetchInstructions()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to delete instruction')
            }
        } catch (error) {
            toast.error('Error deleting instruction')
        }
    }

    return (
        <div className="w-full">
            <div className="mb-5">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by teacher or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-11 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm placeholder-gray-500 transition-all"
                    />
                    <svg
                        className="absolute left-3.5 top-3.5 h-5 w-5 text-green-500"
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {filteredInstructions.length} result{filteredInstructions.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredInstructions.length === 0 ? (
                    <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-600">No instructions found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                ) : (
                    filteredInstructions.map((instruction) => (
                        <div
                            key={instruction.id}
                            className="group bg-gradient-to-br from-white to-green-50/30 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <span className="text-white font-bold text-sm">
                                            {instruction.teacher_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                                            {instruction.teacher_name}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            ID: {instruction.teacher}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="whitespace-nowrap">
                                            {new Date(instruction.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    {isHeadmaster && (
                                        <div className="flex items-center space-x-1 ml-2">
                                            <button
                                                onClick={() => handleEdit(instruction)}
                                                className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(instruction.id)}
                                                className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {editingId === instruction.id ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                        rows="3"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSaveEdit(instruction.id)}
                                            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 text-sm leading-relaxed pl-13">
                                    {instruction.content}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AllInstructions