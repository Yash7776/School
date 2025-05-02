import React, { useState, useEffect } from 'react'

const AllInstructions = () => {
    useEffect(() => {
        fetchInstructions()
    }, [])

    const [instruction, setinstruction] = useState([])
    const fetchInstructions = async () => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        let response = await fetch('http://127.0.0.1:8000/api/instructions/', {
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
        }
        else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }
    return (
        <>
            {instruction.map((instruction) => (
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
            ))}
        </>
    )
}

export default AllInstructions