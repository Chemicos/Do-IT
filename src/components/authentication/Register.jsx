import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import UsernameAlert from "./UsernameAlert";


export default function Register() {
    const [showUsernamePopup, setShowUsernamePopup] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordStrength, setPasswordStrength] = useState("weak")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handlePasswordChange = (e) => {
        const value = e.target.value
        setPassword(value)

        if (value.length > 8) setPasswordStrength("strong")
        else if (value.length > 4) setPasswordStrength("medium")
        else setPasswordStrength("weak")
    }

    useEffect(() => {
        if (password == "" || confirmPassword == "") {
            setShowPassword(false)
            setShowConfirmPassword(false)
        }
    }, [password, confirmPassword])

    const isDisabled = password !== confirmPassword || password == "" || email == ""

    const handleRegister = async (username) => {
        if (isDisabled) return

        setIsLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: username,
                createdAt: new Date(),
            })

            navigate("/") 
        } catch (error) {
            setErrorMessage("Failed to register user. Please try again.")
            console.log("Error registering: ", error)
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-doit-darkgray">
        <div className="w-screen md:w-full md:max-w-md h-screen md:h-auto p-8 space-y-6 md:shadow-md rounded-xl md:bg-doit-graybtn">
            <h1 className="text-4xl font-bold text-center text-white">
                Do<span className="text-green-500">IT</span>
            </h1>
            <h2 className="text-2xl font-semibold text-white text-center">
                Welcome
            </h2>
            <p className="text-sm text-center text-gray-300">
                Enter your email and password to create your account
            </p>

            <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault()
                setShowUsernamePopup(true)
            }}>
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
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-300">Password</label>

                        <span className={`${password ? "text-sm" : "hidden"} ${
                            passwordStrength === "weak" ? "text-red-500" : passwordStrength === "medium" ? "text-yellow-500" : "text-green-500"
                        }`}>
                            {passwordStrength}
                        </span>
                    </div>

                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="w-full px-4 py-4 rounded-lg bg-gray-200 duration-150 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
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

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Confirm Password</label>

                    <div className="relative">
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            className="w-full px-4 py-4 rounded-lg bg-gray-200 duration-150 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span 
                            className={`absolute inset-y-0 right-4 flex items-center text-gray-600 text-2xl duration-150
                         ${confirmPassword ? "cursor-pointer hover:text-black" : "cursor-not-allowed"}`}
                            onClick={() => confirmPassword && setShowConfirmPassword(!showConfirmPassword)}        
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>

                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                <button 
                    type="submit" 
                    className={`w-full px-4 py-4 font-semibold text-white rounded-lg transition duration-150
                    ${isDisabled ? "bg-gray-500 cursor-not-allowed opacity-50" : "bg-black active:bg-slate-900 md:hover:bg-doit-green"}`}
                    disabled={isDisabled}
                >
                    Sign Up
                </button>
            </form>

            <p className="text-sm text-center text-gray-300">
                Already have an account?
                <Link to='/login' className="text-white font-semibold hover:underline"> Sign In</Link>
            </p>
        </div>

        {showUsernamePopup && (
            <UsernameAlert 
                onSave={handleRegister}
                isLoading={isLoading}
            />
        )}
    </div>
  )
}
