import React,{useState,useEffect} from 'react'

const AllFeedBack = () => {
    useEffect(() => {
        fetchFeedback()
    },[])

    const [feedback, setfeedback] = useState([])
    const fetchFeedback = async () => {
        let authToken = JSON.parse(localStorage.getItem('authToken'))
        let access = authToken
        let response = await fetch('http://127.0.0.1:8000/api/feedback/', {
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
        }
        else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }
    return (
        <>
            {feedback.map((feed) => (
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
))}
    
        </>
    )
}

export default AllFeedBack