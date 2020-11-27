import React from 'react'
import { Link } from 'react-router-dom'

const Admin = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-around z-10">
        <div className="w-64 h-screen bg-gray-800 mt-8 sm:mt-0">
          <nav className="mt-10">
            <Link
              to="/place/list"
              className="flex items-center py-2 px-8 bg-gray-700 text-gray-100 border-r-4 border-gray-100"
            >
              <span className="mx-4 font-medium">Адреса</span>
            </Link>

            <button
              type="button"
              className="flex items-center mt-5 py-2 px-8 text-gray-400 border-r-4 border-gray-800 hover:bg-gray-700 hover:text-gray-100 hover:border-gray-100"
            >
              <span className="mx-4 font-medium">Accounts</span>
            </button>

            <button
              type="button"
              className="flex items-center mt-5 py-2 px-8 text-gray-400 border-r-4 border-gray-800 hover:bg-gray-700 hover:text-gray-100 hover:border-gray-100"
            >
              <span className="mx-4 font-medium">Tickets</span>
            </button>

            <button
              type="button"
              className="flex items-center mt-5 py-2 px-8 text-gray-400 border-r-4 border-gray-800 hover:bg-gray-700 hover:text-gray-100 hover:border-gray-100"
            >
              <span className="mx-4 font-medium">Settings</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Admin
