import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import { auth, db } from "../../firebaseConfig"
import { v4 as uuidv4 } from "uuid"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"

// eslint-disable-next-line react/prop-types
export default function AddSection({ onAddSection }) {
    const [isAdding, setIsAdding] = useState(false)
    const [sectionName, setSectionName] = useState("")

    const addSectionRef = useRef(null)

    const [scaleClass, setScaleClass] = useState("scale-50")

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (addSectionRef.current && !addSectionRef.current.contains(event.target)) {
            handleCancelClick()
          }
        }
        document.addEventListener("mousedown", handleClickOutside)
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside)
        }
      }, [])

    useEffect(() => {
        if (isAdding) {
            setScaleClass("scale-50")

            setTimeout(() => {
               setScaleClass("scale-100") 
            }, 0)
        } else {
            setScaleClass("scale-50")
        }
    }, [isAdding])

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
                    createdAt: serverTimestamp(),
                    isImportant: false
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
        <button
            onClick={handleAddClick}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center bg-doit-green hover:bg-opacity-70 
            transition-transform duration-100 ease-in-out active:scale-110 text-black text-2xl" 
          >
            <FontAwesomeIcon icon={faPlus} />
        </button>

        {isAdding && (
            <div 
                ref={addSectionRef}
                className={`fixed bottom-24 right-6 w-[80%] md:w-[300px]  z-50 space-y-2 p-4 bg-doit-graybtn text-white rounded-xl
                transform transition-transform duration-200 ease-in-out ${scaleClass} shadow-md border border-doit-grayborder
                `}
            >
                <input 
                    type="text" 
                    placeholder="Name this section"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="w-full px-4 py-4 rounded-lg bg-transparent text-white placeholder-gray-400 border border-doit-grayborder
                    focus:outline-none focus:border-doit-green"
                />

                <div className="flex space-x-2 justify-between
                md:justify-start"
                >
                    <button
                        onClick={handleAddSection}
                        className={`px-4 py-2 text-white rounded-lg focus:outline-none font-semibold w-full
                            ${sectionName.trim() 
                                ? "opacity-100 bg-doit-green hover:opacity-80 active:bg-opacity-80"
                                : "bg-doit-green opacity-50 cursor-not-allowed"
                            }
                        md:w-auto`}
                        disabled={!sectionName.trim()}
                    >
                        Add section
                    </button>
                    <button
                        onClick={handleCancelClick}
                        className="text-white duration-150 px-4 py-2 hover:bg-doit-graybtn active:bg-doit-darkgray rounded-lg bg-doit-graybtn w-full
                        md:bg-transparent md:text-gray-400 md:hover:text-white md:w-auto"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}
