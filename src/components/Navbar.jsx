import { faAngleDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

// eslint-disable-next-line react/prop-types
export default function Navbar({ isDropdownOpen, toggleDropdown }) {
  const [username, setUsername] = useState("")
  const dropDownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
          try {
              const userDoc = await getDoc(doc(db, "users", user.uid))
              if (userDoc.exists()) {
                  setUsername(userDoc.data().username)
              } else {
                console.error("User document does not exist")
              }
          } catch (error) {
              console.error("Error fetching username:", error)
          }
      } else {
          navigate("/login")
      }
  })

    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        toggleDropdown()
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen, toggleDropdown])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out: ", error)
    }
  }
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-transparent text-white">
        <div 
          className="flex items-center space-x-4 relative cursor-pointer"
          onClick={toggleDropdown}
        >
            <FontAwesomeIcon 
                icon={faUser} 
                className="text-3xl text-gray-400 "
            />
            <span className="font-semibold">{username}</span>

            <FontAwesomeIcon 
                icon={faAngleDown}
                className="text-xl text-doit-green cursor-pointer hover:opacity-70" 
            />

            {isDropdownOpen && (
                <div 
                  className="flex flex-col items-center absolute top-10 py-2 w-60 border border-doit-grayborder bg-doit-graybtn rounded-lg z-10"
                  ref={dropDownRef}
                >
                <button 
                  disabled={true} 
                  className="flex flex-row items-center space-x-3 cursor-not-allowed text-white py-2 px-2 w-[90%] rounded-lg"
                >
                  <FontAwesomeIcon icon={faUser} className="text-doit-green" />
                  <span>Profile</span>
                </button>
    
                <button 
                  className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] hover:bg-doit-darkgray rounded-lg"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faAngleDown} className="text-doit-green" />
                  <span>Logout</span>
                </button>
              </div>
            )}
        </div>

        <h1 className="text-3xl font-bold">
            Do<span className="text-doit-green">IT</span>
        </h1>
    </div>
  )
}
