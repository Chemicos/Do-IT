import { faEye, faEyeSlash, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import Confirmation from "./Confirmation";
import { RotatingLines } from "react-loader-spinner";

export default function UserProfile({ onClose, user, username: initialUsername, onUsernameChange }) {
    const [username, setUsername] = useState(initialUsername)
    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordError, setOldPasswordError] = useState("")
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)

    const [isSaving, setIsSaving] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    useEffect(() => {
        setUsername(initialUsername)
    }, [initialUsername])

    useEffect(() => {
        if (oldPassword == "") {
            setShowOldPassword(false)
            setOldPasswordError("")
        }
    }, [oldPassword])

    useEffect(() => {
        if (newPassword == "") {
            setShowNewPassword(false)
        }
    }, [newPassword])

    const isDisabled = oldPassword == "" || newPassword == ""

    const handleSaveChanges = async () => {
        setIsSaving(true)
        try {
            if (username !== initialUsername) {
                const userRef = doc(db, "users", user.uid)
                await updateDoc(userRef, {username})

                onUsernameChange(username)
            }

            if (newPassword.trim().length > 0) {
                if (newPassword.trim().length < 6) {
                    setNewPasswordError("Password should be at least 6 characters!")
                    setIsSaving(false)
                    return
                }
            }

            if (newPassword.trim().length > 0) {
                if (oldPassword.trim().length > 0) {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        user.email,
                        oldPassword
                    )

                    await updatePassword(userCredential.user, newPassword)
                } else {
                    await updatePassword(auth.currentUser, newPassword)
                }
            }

            setShowConfirmation(true)
        } catch (error) {
            console.error("Error updating profile:", error)

            if (error.code === "auth/invalid-credential") {
                setOldPasswordError("Old password is incorrect!")
            }

            if (error.code === "auth/weak-password") {
                setNewPasswordError("Password should be at least 6 characters!")
            }
        } finally {
            setIsSaving(false)
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

            {showConfirmation ? (
                <Confirmation onClose={handleCloseConfirmation} />
            ) : (
                <div className="flex flex-col w-full p-0 md:p-4 my-auto gap-6 items-center">
                    <h1 className="text-2xl text-gray-400">Edit your profile</h1>

                    <p className="text-2xl">{username}</p>

                    <div className="flex flex-col w-full px-4 md:px-8 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-400">Username</label>

                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-doit-darkgray text-white rounded-md border border-gray-500 focus:outline-none focus:ring-doit-green focus:ring-1
                                        py-3 pl-3 pr-10 hover:border-doit-green transition"
                                />
                            </div>                    
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-400">Old Password</label>
                            <div className="relative">
                                <input 
                                    type={showOldPassword ? "text" : "password"} 
                                    value={oldPassword}
                                    onChange={(e) => {
                                        setOldPassword(e.target.value) 
                                        setOldPasswordError("")
                                    }}
                                    className="w-full bg-doit-darkgray text-white rounded-md border border-gray-500 focus:outline-none focus:ring-doit-green focus:ring-1
                                        py-3 pl-3 pr-12 hover:border-doit-green transition"
                                />

                                <button 
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xl hover:text-white"
                                    onClick={() => oldPassword && setShowOldPassword(!showOldPassword)}
                                >
                                    <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />

                                </button>
                            </div>                
                            {oldPasswordError && (
                                <p className="text-pink-600 text-sm">{oldPasswordError}</p>
                            )}
                        </div> 

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-400">New Password</label>
                            <div className="relative">
                                <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value)
                                    setNewPasswordError("")
                                }}
                                className="w-full bg-doit-darkgray text-white rounded-md border border-gray-500 focus:outline-none focus:ring-doit-green focus:ring-1
                                    py-3 pl-3 pr-12 hover:border-doit-green transition"
                                />

                                <button 
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xl hover:text-white"
                                    onClick={() => newPassword && setShowNewPassword(!showNewPassword)}
                                >
                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {newPasswordError && (
                                <p className="text-pink-600 text-sm">{newPasswordError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full px-8 justify-between mt-auto gap-4">
                        <button 
                            className="text-gray-400 duration-150 w-full hover:text-white py-2 hover:bg-doit-graybtn rounded-md
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
