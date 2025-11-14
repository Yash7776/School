import React,{useState,useEffect} from 'react'
import { toast } from 'react-toastify'

const AllFeedBack = ({ isHeadmaster = false }) => {
    const [feedback, setfeedback] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredFeedback, setFilteredFeedback] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState('')

    useEffect(() => {
        fetchFeedback()
    },[])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredFeedback(feedback)
        } else {
            const filtered = feedback.filter((feed) =>
                feed.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feed.student_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredFeedback(filtered)
        }
    }, [searchQuery, feedback])

    const fetchFeedback = async (search = '') => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        const url = search 
            ? `http://127.0.0.1:8000/api/feedback/?search=${encodeURIComponent(search)}`
            : 'http://127.0.0.1:8000/api/feedback/'
        
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
            setfeedback(data)
            setFilteredFeedback(data)
        }
        else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    const handleEdit = (feed) => {
        setEditingId(feed.id)
        setEditContent(feed.content)
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditContent('')
    }

    const handleSaveEdit = async (id) => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/feedback/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: editContent })
            })
            
            if (response.status === 200) {
                toast.success('Feedback updated successfully')
                setEditingId(null)
                setEditContent('')
                fetchFeedback()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to update feedback')
            }
        } catch (error) {
            toast.error('Error updating feedback')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return
        }

        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/feedback/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (response.status === 200) {
                toast.success('Feedback deleted successfully')
                fetchFeedback()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to delete feedback')
            }
        } catch (error) {
            toast.error('Error deleting feedback')
        }
    }

    return (
        <div className="w-full">
            <div className="mb-5">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by student or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-11 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm placeholder-gray-500 transition-all"
                    />
                    <svg
                        className="absolute left-3.5 top-3.5 h-5 w-5 text-blue-500"
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {filteredFeedback.length} result{filteredFeedback.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredFeedback.length === 0 ? (
                    <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-dashed border-blue-200">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-600">No feedback found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                ) : (
                    filteredFeedback.map((feed) => (
                        <div
                            key={feed.id}
                            className="group bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                        <span className="text-white font-bold text-sm">
                                            {feed.student_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                            {feed.student_name}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            Roll: {feed.student}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="whitespace-nowrap">
                                            {new Date(feed.created_at).toLocaleDateString('en-US', {
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
                                                onClick={() => handleEdit(feed)}
                                                className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(feed.id)}
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
                            
                            {editingId === feed.id ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                            onClick={() => handleSaveEdit(feed.id)}
                                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 text-sm leading-relaxed pl-13">
                                    {feed.content}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AllFeedBack