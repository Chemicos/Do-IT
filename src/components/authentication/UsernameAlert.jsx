import { useState } from "react"
import { RotatingLines } from "react-loader-spinner"

// eslint-disable-next-line react/prop-types
export default function UsernameAlert({ onSave, isLoading }) {
    const [username, setUsername] = useState("")

    const isDisabled = username.trim().length < 4

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="flex flex-col space-y-4 bg-doit-graybtn p-8 rounded-lg shadow-md w-80 text-center">
            <h2 className="text-lg text-gray-400 font-semibold mb-4">How should I call you?</h2>
            <input 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 rounded-lg focus:outline-none focus:outline-green-500"
            />
            <button 
                onClick={() => onSave(username)}
                className={`w-full px-4 py-2 cursor-pointer rounded-lg duration-150 flex justify-center
                    ${isDisabled ? 
                        "bg-doit-darkgray cursor-not-allowed" : 
                        "bg-doit-green active:bg-opacity-50 md:hover:text-white active:bg-green-500 md:hover:bg-doit-green"
                    }
                `}
                disabled={isDisabled}
            >
                {isLoading ? (
                    <RotatingLines 
                    height="25"
                    width="25"
                    strokeColor="white"
                    strokeWidth="5"
                    visible={true}
                    />
                ) : (
                    <span className="font-semibold text-white">Save</span>
                )}
            </button>
        </div>
    </div>
  )
}
