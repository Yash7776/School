import React,{useState,useEffect} from 'react'

const AllFeedBack = () => {
    const [feedback, setfeedback] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredFeedback, setFilteredFeedback] = useState([])

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

    return (
        <>
            <div className="mb-6 w-full">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search feedback by student name or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
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
                    <p className="mt-2 text-sm text-gray-600">
                        Found {filteredFeedback.length} result{filteredFeedback.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {filteredFeedback.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No feedback found
                </div>
            ) : (
                filteredFeedback.map((feed) => (
                    <div
                        key={feed.id}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-blue-600 mb-6 animate__animated animate__pulse"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-semibold text-blue-800">
                                    {feed.student_name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Roll Number: {feed.student}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(feed.created_at).toLocaleString()}
                            </p>
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed">{feed.content}</p>
                    </div>
                ))
            )}
        </>
    )
}

export default AllFeedBack