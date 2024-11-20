import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { auth, db } from "../../firebaseConfig"
import { v4 as uuidv4 } from "uuid"
import { doc, setDoc } from "firebase/firestore"

// eslint-disable-next-line react/prop-types
export default function AddSection({ onAddSection }) {
    const [isAdding, setIsAdding] = useState(false)
    const [sectionName, setSectionName] = useState("")

    const handleAddClick = () => {
        setIsAdding(true)
    }

    const handleCancelClick = () => {
        setIsAdding(false)
        setSectionName("")
    }

    const handleAddSection = async () => {
        if (sectionName.trim()) {
            try {
                const sectionId = uuidv4()
                const sectionData = {
                    sectionId: sectionId,
                    userId: auth.currentUser.uid,
                    title: sectionName,
                    createdAt: new Date()
                }
                await setDoc(doc(db, "sections", sectionId), sectionData)
    
                onAddSection(sectionData)
                setSectionName("")
                setIsAdding(false)
            } catch (error) {
                console.error("Error saving section: ", error)
            }
        }
    }
  return (
    <div>
        {isAdding ? (
            <div className="flex flex-col w-72 space-y-2">
                <input 
                    type="text" 
                    placeholder="Name this section"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="w-full px-4 py-4 rounded-lg bg-transparent text-white placeholder-gray-400 border border-doit-grayborder
                    focus:outline-none focus:border-doit-green"
                />

                <div className="flex space-x-2">
                    <button
                        onClick={handleAddSection}
                        className={`px-4 py-2 text-white rounded-lg focus:outline-none font-semibold
                            ${sectionName.trim() 
                                ? "opacity-100 bg-doit-green hover:opacity-80"
                                : "bg-doit-green opacity-50 cursor-not-allowed"
                            }`}
                        disabled={!sectionName.trim()}
                    >
                        Add section
                    </button>
                    <button
                        onClick={handleCancelClick}
                        className="text-gray-400 duration-150 hover:text-white px-4 py-2 hover:bg-doit-graybtn rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ) : (
            <button
                onClick={handleAddClick}
                className="flex items-center pl-4 md:w-72 py-4 space-x-2 bg-doit-graybtn text-gray-400 rounded-lg
                hover:bg-gray-700 focus:outline-none duration-150"
            >
                <FontAwesomeIcon icon={faPlus} className="text-doit-green text-xl" />
                <span>Add section</span>
            </button>
        )}
    </div>
  )
}
