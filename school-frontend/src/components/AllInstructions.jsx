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
        <div className="w-full">
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search instructions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                    <svg
                        className="absolute left-3 top-3 h-4 w-4 text-gray-400"
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
                    <p className="mt-2 text-xs text-gray-500">
                        {filteredInstructions.length} result{filteredInstructions.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredInstructions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No instructions found</p>
                    </div>
                ) : (
                    filteredInstructions.map((instruction) => (
                        <div
                            key={instruction.id}
                            className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition duration-200 border-l-4 border-green-500"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-green-700">
                                        {instruction.teacher_name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        Teacher ID: {instruction.teacher}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                    {new Date(instruction.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {instruction.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AllInstructions