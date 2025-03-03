import { faAngleDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Oval } from "react-loader-spinner";

export default function Navbar({ isDropdownOpen, toggleDropdown, username, onProfileClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const [scaleClass, setScaleClass] = useState("scale-50 opacity-0")
  const [isVisible, setIsVisible] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
  
  const dropDownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isDropdownOpen) {
      setIsVisible(true)

      setTimeout(() => {
        setScaleClass("scale-100 opacity-100")
      }, 50)
    } else {
      setScaleClass("scale-50 opacity-0")

      setTimeout(() => {
        setIsVisible(false)
      }, 200)
    }
  }, [isDropdownOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        if (isDropdownOpen) {
          toggleDropdown()
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen, toggleDropdown])

  useEffect(() => {
    const fetchAvatar = async () => {
      if (auth.currentUser) {
        setIsLoadingAvatar(true)

        try {
          const userDocRef = doc(db, "users", auth.currentUser.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            setAvatar(userDocSnap.data().avatar || "")
          }
        } catch (error) {
          console.error("Error fetching avatar:", error)
        } finally {
          setIsLoadingAvatar(false)
        }
      }
    }

    fetchAvatar()
  }, [])

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoadingAvatar ? (
            <Oval
              height="30"
              width="30"
              color="#4fa94d"
              strokeWidth="5"
              visible={true}
            />
          ) : (
            <img 
              src={avatar} 
              alt="user avatar" 
              className="w-10 h-10 rounded-full"
            />            
          )}

          <span className="hidden md:inline font-semibold">{username}</span>

            <FontAwesomeIcon 
                icon={faAngleDown}
                className={`text-xl text-doit-green cursor-pointer hover:opacity-70 transform duration-150
                  ${isHovered ? "rotate-180" : "rotate-0"} ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} 
            />

            {isVisible && (
                <div 
                  className={`flex flex-col items-center absolute top-12 py-2 w-60 border border-doit-grayborder bg-doit-graybtn rounded-lg z-10
                    transform transition-transform ease-in-out ${scaleClass}
                    ${isDropdownOpen ? "visible" : "invisible"}`}
                  ref={dropDownRef}
                >
                <button 
                  className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] active:bg-doit-darkgray md:hover:bg-doit-darkgray rounded-lg
                  transition duration-150"
                  onClick={(e) => {e.stopPropagation(); onProfileClick()}}
                >
                  <FontAwesomeIcon icon={faUser} className="text-doit-green" />
                  <span>Profile</span>
                </button>
    
                <button 
                  className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] active:bg-doit-darkgray md:hover:bg-doit-darkgray rounded-lg
                  transition duration-150"
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
