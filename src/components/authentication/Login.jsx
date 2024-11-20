import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../../firebaseConfig"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (password == "") {
            setShowPassword(false)
        }
    }, [password])

    const isDisabled = password == "" || email == "";

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch (error) {
            console.log("Error logging in: ", error)
        }
    }

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-doit-darkgray">
        <div className="w-full max-w-md p-8 space-y-6 md:shadow-md rounded-xl bg-doit-graybtn">
            <h1 className="text-4xl font-bold text-center text-white">
                Do<span className="text-green-500">IT</span>
            </h1>
            <h2 className="text-2xl font-semibold text-white text-center">
                Welcome
            </h2>
            <p className="text-sm text-center text-gray-300">
                Enter your email and password to access your account
            </p>

            <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-200">Email</label>
                    <input 
                        type="email"
                        className="w-full px-4 py-4 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 duration-150 focus:ring-green-500"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm mb-2 font-medium text-gray-200">Password</label>

                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="w-full px-4 py-4 rounded-lg bg-gray-200 duration-150 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span 
                            className={`absolute inset-y-0 right-4 flex items-center text-gray-600 text-2xl duration-150
                             ${password ? "cursor-pointer hover:text-black" : "cursor-not-allowed"}`}
                            onClick={() => password && setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className={`w-full px-4 py-4 font-semibold text-white rounded-lg
                    ${isDisabled ? "bg-gray-500 cursor-not-allowed opacity-50" : "bg-black hover:bg-doit-green"}`}
                    disabled={isDisabled}
                >
                    Sign In
                </button>
            </form>

            <p className="text-sm text-center text-gray-300">
                You have no account?
                <Link to='/register' className="text-white font-semibold hover:underline"> Sign Up</Link>
            </p>
            </div>
        </div>
    </div>
  )
}
