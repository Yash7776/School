import React, { useState, useEffect } from 'react'

const AllInstructions = () => {
    const [instruction, setinstruction] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredInstructions, setFilteredInstructions] = useState([])

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
            ? `http://127.0.0.1:8000/api/instructions/?search=${encodeURIComponent(search)}`
            : 'http://127.0.0.1:8000/api/instructions/'
        
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

    return (
        <>
            <div className="mb-6 w-full">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search instructions by teacher name or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        Found {filteredInstructions.length} result{filteredInstructions.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {filteredInstructions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No instructions found
                </div>
            ) : (
                filteredInstructions.map((instruction) => (
                    <div
                        key={instruction.id}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-green-600 mb-6 animate__animated animate__pulse"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-semibold text-green-800">
                                    {instruction.teacher_name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Teacher ID: {instruction.teacher}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(instruction.created_at).toLocaleString()}
                            </p>
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed">
                            {instruction.content}
                        </p>
                    </div>
                ))
            )}
        </>
    )
}

export default AllInstructions