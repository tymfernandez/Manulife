<<<<<<< HEAD
import { useAuth } from '../lib/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, signOut } = useAuth()
=======
import { useAuth } from "../lib/authContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, signOut } = useAuth();
>>>>>>> recruitmentManagement

  return (
    <div className="min-h-screen bg-[#141414] p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="text-blue-400 hover:text-blue-300">
            Profile
          </Link>
          <span className="text-white">Welcome, {user?.email}</span>

          {/* This is the link to the application form for debugging purposes only*/}
          <Link
            to="/application-form"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Application Form
          </Link>

<<<<<<< HEAD
          
=======
>>>>>>> recruitmentManagement
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="text-white text-xl">Welcome to Manulife!</p>
      </div>
    </div>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> recruitmentManagement
}
