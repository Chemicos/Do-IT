import { signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db, googleProvider } from "../../../firebaseConfig"
import { Oval } from "react-loader-spinner"
import { doc, getDoc, setDoc } from "firebase/firestore"

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        setErrorMessage("")

        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            const userDocRef = doc(db, "users", user.uid)
            const userDocSnap = await getDoc(userDocRef)

            if (!userDocSnap.exists()) {
                const userData = {
                    uid: user.uid,
                    username: user.displayName || "User",
                    createdAt: new Date(),
                    avatar: user.photoURL || ""
                }

                await setDoc(userDocRef, userData)
            }

            navigate("/")
        } catch (error) {
            console.error("Error signing in with Google:", error)
            setErrorMessage("Failed to sign in with Google. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-doit-darkgray">
        <div className="flex flex-col justify-center w-screen md:w-full md:max-w-md h-screen md:h-auto p-8 space-y-6 md:shadow-md md:rounded-xl md:bg-doit-graybtn">
            <h1 className="text-4xl font-bold text-center text-white">
                Do<span className="text-green-500">IT</span>
            </h1>
            <h2 className="text-2xl font-semibold text-white text-center">
                Welcome
            </h2>
            <p className="text-sm text-center text-gray-300">
                Sign in with your Google account to access the app.
            </p>

                {errorMessage && 
                    <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                }
            
                {isLoading ? (
                    <button className="w-full px-4 py-4 font-semibold text-white bg-doit-graybtn rounded-lg border border-gray-300 transition flex justify-center">
                        <Oval
                            height="25"
                            width="25"
                            strokeColor="#4fa94d"
                            strokeWidth="5"
                            visible={true}
                            ariaLabel="oval-loading"
                        />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full px-4 py-4 font-semibold text-white bg-doit-darkgray rounded-lg 
                        border border-gray-300 active:bg-doit-graybtn md:hover:bg-doit-graybtn flex items-center justify-center space-x-3 transition"
                    >
                        <img 
                            src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"
                            className="w-5 h-5"    
                        />
                        <span>Sign in with Google</span>
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}
