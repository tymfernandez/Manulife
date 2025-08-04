import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])        
  const [currentIndex, setCurrentIndex] = useState(-1) 

  const fetchUser = async () => {
    const res = await fetch('https://randomuser.me/api/')
    const data = await res.json()
    const newUser = data.results[0]

    const newUsers = [...users.slice(0, currentIndex + 1), newUser] 
    setUsers(newUsers)
    setCurrentIndex(newUsers.length - 1)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const currentUser = users[currentIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {currentUser && (
        <div className="bg-white p-6 rounded shadow-md text-center mb-4">
          <img
            src={currentUser.picture.large}
            alt="User"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold">
            {currentUser.name.title} {currentUser.name.first} {currentUser.name.last}
          </h2>
          <p className="text-gray-600 capitalize">{currentUser.gender}</p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex <= 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={fetchUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default App
