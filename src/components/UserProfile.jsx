import { faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import Confirmation from "./Confirmation";
import { Oval, RotatingLines } from "react-loader-spinner";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ConfirmationDeleteAccount from "./ConfirmationDeleteAccount";

export default function UserProfile({ onClose, user, username: initialUsername, onUsernameChange }) {
    const [username, setUsername] = useState(initialUsername)
    const [avatar, setAvatar] = useState("")
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)

    const [isSaving, setIsSaving] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setUsername(initialUsername)
    }, [initialUsername])

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

    const isDisabled = username == ""

    const handleSaveChanges = async () => {
        setIsSaving(true)
        try {
            if (username !== initialUsername) {
                const userRef = doc(db, "users", user.uid)
                await updateDoc(userRef, {username})

                onUsernameChange(username)
            }

            setShowConfirmation(true)
        } catch (error) {
            console.error("Error updating profile:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!auth.currentUser) return

        try {
            const userId = auth.currentUser.uid
            
            await deleteDoc(doc(db, "users", userId))

            const sectionsQuery = query(collection(db, "sections"), where("userId", "==", userId))
            const sectionsSnapshot = await getDocs(sectionsQuery)
            sectionsSnapshot.forEach(async (docSnap) => {
                await deleteDoc(doc(db, "sections", docSnap.id))
            })
            await deleteUser(auth.currentUser)

            navigate("/login")            
        } catch (error) {
            console.error("Error deleting account:", error)
        } 
    }

    const handleCloseConfirmation = () => {
        onClose()
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative bg-doit-darkgray text-white w-full md:w-[400px] h-screen  md:h-auto md:rounded-lg
        flex flex-col items-center p-4 gap-6"
        >
            <button 
                className="absolute -top-3 -right-3 w-10 h-10 text-white hidden
                bg-doit-graybtn md:flex justify-center items-center rounded-full hover:text-red-600 transition"
                onClick={onClose}
            >
                <FontAwesomeIcon icon={faX} /> 
            </button>

            {showDeleteConfirmation ? (
                <ConfirmationDeleteAccount 
                    onCancel={() => setShowDeleteConfirmation(false)}
                    onConfirm={handleDeleteAccount}
                />
            ) : showConfirmation ? (
                <Confirmation onClose={handleCloseConfirmation} />
            ) : (
                <div className="flex flex-col w-full p-0 md:p-4 my-auto gap-6 items-center">
                    {isLoadingAvatar ? (
                        <Oval
                            height="50"
                            width="50"
                            color="#4fa94d"
                            strokeWidth="5"
                            visible={true}
                        />
                    ) : avatar ? (
                        <img 
                            src={avatar} 
                            alt="user avatar" 
                            className="w-32 h-32 md:w-20 md:h-20 rounded-full"
                        />
                    ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-700 text-gray-400 rounded-full">
                            No Avatar
                        </div>
                    )}

                    <p className="text-2xl">{username}</p>

                    <div className="flex flex-col w-full px-4 md:px-8 gap-6">
                        <div className="flex flex-col gap-2">
                                <button 
                                    className="text-red-500 font-semibold w-full py-2 rounded-md active:bg-doit-graybtn md:hover:bg-doit-graybtn transition duration-150"
                                    onClick={() => setShowDeleteConfirmation(true)}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                    Delete Account
                                </button>

                            <label className="text-gray-400">Username</label>
                            
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-doit-darkgray text-white rounded-md border border-gray-500 focus:outline-none focus:ring-doit-green focus:ring-1
                                    py-3 pl-3 pr-10 hover:border-doit-green transition"
                            />                        
                        </div>
                    </div>

                    <div className="flex w-full px-8 justify-between mt-auto gap-4">
                        <button 
                            className="text-gray-400 duration-150 w-full active:text-white md:hover:text-white py-2 hover:bg-doit-graybtn rounded-md
                            active:bg-doit-graybtn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                    {isSaving ? (
                        <button
                            type="button"
                            className="text-white font-semibold w-full py-2 rounded-md 
                                    bg-doit-green opacity-80 cursor-not-allowed 
                                    transition duration-150 flex items-center justify-center"
                            disabled
                        >
                            <RotatingLines
                                height="20"
                                width="20"
                                strokeColor="white"
                                strokeWidth="5"
                                visible={true}
                            />
                        </button>
                    ) : (
                        <button 
                            className={`text-white font-semibold w-full py-2 rounded-md
                            ${isDisabled ? "bg-gray-500 cursor-not-allowed opacity-50" : "bg-doit-green hover:bg-opacity-60 transition duration-150"}`}
                            onClick={handleSaveChanges}
                            disabled={isDisabled}
                        >
                            Save
                        </button>
                    )}
                    </div>        
                </div>
            )}
        </div>
    </div>
  )
}
