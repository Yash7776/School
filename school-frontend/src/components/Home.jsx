import React from "react";
import { Link, useLocation } from 'react-router-dom'
import AuthContext from '../Contex/AuthContext.jsx'
import { useContext } from "react";
import FeedBack from './FeedBack.jsx'
import Instruction from './Instruction.jsx'
import AllFeedBack from './AllFeedBack.jsx'
import AllInstruction from './AllInstructions.jsx'
const Home = () => {
  let { user, logoutUser } = useContext(AuthContext)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white font-sans">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">MySchool</h1>
        <nav>
          <ul className="flex gap-6 text-blue-700 font-medium">
            <li><Link to="/" className="hover:text-blue-500">{user && user.email}</Link></li>
            <li><Link to="/" className="hover:text-blue-500">{user && user.profiles[0].role}</Link></li>
            <li><Link to="/" onClick={logoutUser} className="hover:text-blue-500">Logout</Link></li>
          </ul>
        </nav>
      </header>

      <section className="text-center p-10 px-2">
  <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
    Welcome {user && user.username}
  </h2>

 
  {user && user.profiles[0].role === "Student" && <FeedBack />}
  {(user && user.profiles[0].role === "Teacher") && <Instruction />}
  {(user && user.profiles[0].role === "Headmaster") && <Instruction />}
</section>

<section className="p-8 max-w-7xl mx-auto">
  {user && user.profiles[0].role === "Student" && (
    <div className="max-w-4xl mx-auto">
      <AllInstruction />
    </div>
  )}
  
  {user && user.profiles[0].role === "Teacher" && (
    <div className="max-w-4xl mx-auto">
      <AllFeedBack />
    </div>
  )}
  
  {user && user.profiles[0].role === "Headmaster" && (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-green-800 mb-4">📋 Instructions</h3>
        <AllInstruction />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-blue-800 mb-4">💬 Feedback</h3>
        <AllFeedBack />
      </div>
    </div>
  )}
</section>

      <footer className="bg-blue-800 text-white p-6 text-center mt-12">
        &copy; {new Date().getFullYear()} MySchool. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
