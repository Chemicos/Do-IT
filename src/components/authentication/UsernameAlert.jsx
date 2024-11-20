import { useState } from "react"

// eslint-disable-next-line react/prop-types
export default function UsernameAlert({ onSave }) {
    const [username, setUsername] = useState("")

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="flex flex-col space-y-4 bg-gray-200 p-8 rounded-lg shadow-md w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">How do you want us to call you?</h2>
            <input 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:outline-green-500"
            />
            <button 
                onClick={() => onSave(username)}
                className="w-full px-4 py-2 font-semibold cursor-pointer hover:text-white hover:bg-doit-green rounded-lg duration-150"
                disabled={!username.trim()}
            >
                Save
            </button>
        </div>
    </div>
  )
}
