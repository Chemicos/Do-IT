import { useEffect, useState } from "react";
import AddSection from "./AddSection";
import Navbar from "./Navbar";
import Section from "./Section";
import { auth, db } from "../../firebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";
import ShowSectionBar from "./ShowSectionBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faPlus } from "@fortawesome/free-solid-svg-icons";
import SectionEdit from "./SectionEdit";
import { Oval } from "react-loader-spinner";
import DeleteConfirm from "./DeleteConfirm";

export default function TodoHome() {
  const [sections, setSections] = useState([])
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [activeSectionId, setActiveSectionId] = useState(null)
  const [user, setUser] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [username, setUsername] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [showSectionLimitMessage, setShowSectionLimitMessage] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const [isEditingSection, setIsEditingSection] = useState(false)
  const [editingSectionName, setEditingSectionName] = useState("")
  const [editingSectionId, setEditingSectionId] = useState(null)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        navigate("/login")
        return  
      }

      setUser(authUser)
      try {
        const userDocRef = doc(db, "users", authUser.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().username || "")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    const fetchSections = async () => {
      if (user) {
        setIsLoading(true)
        try {
          const q = query(
            collection(db, "sections"),
            where("userId", "==", user.uid),
            orderBy("isImportant", "desc"),
            orderBy("createdAt", "desc")
          )

          const querySnapshot = await getDocs(q);
          const loadedSections = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          setSections(loadedSections)

          if (!activeSectionId && loadedSections.length > 0) {
            setActiveSectionId(loadedSections[0].id)
          }
        } catch (error) {
          console.error("Error fetching sections:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchSections()
  }, [user, activeSectionId])

  const handleSelectSection = (sectionId) => {
    setActiveSectionId(sectionId)
  }

  const handleUpdateSectionTaskCount = (sectionId, newTaskCount) => {
    setSections((prevSections) => prevSections.map((section) => 
      section.id === sectionId ? {
        ...section, 
        taskCount: newTaskCount
      } : section))
  }

  const handleUpdateSectionName = async (sectionId, newTitle) => {
    try {
      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, { title: newTitle })

      setSections((prevSections) =>
          prevSections.map((section) =>
              section.id === sectionId ? { ...section, title: newTitle } : section
          )
      )
      setIsEditingSection(false);
    } catch (error) {
        console.error("Error updating section title:", error)
    }
  }

  const handleUpdateSectionImportance = async (sectionId, isImportant) => {
    try {
      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, { isImportant })
      
      setSections((prevSections) =>
        sortSectionsByImportantAndDate(
          prevSections.map((section) =>
            section.id === sectionId ? { ...section, isImportant } : section
          )
        )
      )
    } catch (error) {
      console.error("Error updating importance:", error)
    }
  }

  const handleMarkSection = async (sectionId, isImportant) => {
    try {
      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, { isImportant })

      setSections((prevSections) => {
        const updated = prevSections.map((s) =>
          s.id === sectionId ? { ...s, isImportant } : s
        )
        return sortSectionsByImportantAndDate(updated)
      })
    } catch (error) {
      console.error("Error marking section:", error)
    }
  }

  const sortSectionsByImportantAndDate = (sections) => {
    return sections.sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1
      if (!a.isImportant && b.isImportant) return 1
  
      const aDate = a.createdAt?.seconds || 0
      const bDate = b.createdAt?.seconds || 0
      return bDate - aDate
    })
  }

  const handleDeleteSectionClick = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId)
    setSectionToDelete(section)
    setShowConfirmDelete(true)
  }

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return

    try {
      await deleteDoc(doc(db, "sections", sectionToDelete.id))
      setSections((prevSections) => {
        const updatedSections = prevSections.filter(
          (section) => section.id !== sectionToDelete.id
        )
  
        const deletedIndex = prevSections.findIndex(
          (section) => section.id === sectionToDelete.id
        )
  
        const nextActiveSection = updatedSections[deletedIndex] || updatedSections[deletedIndex - 1] || null
  
        setActiveSectionId(nextActiveSection ? nextActiveSection.id : null)
  
        return updatedSections
      })

      setShowConfirmDelete(false)
      setSectionToDelete(null)
    } catch (error) {
      console.error("Error deleting section:", error)
    }
  }

  const handleAddSection = (sectionData) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections, { ...sectionData, id: sectionData.sectionId }]
      return updatedSections
    })

    setActiveSectionId(sectionData.sectionId)
  }

  const toggleDropdown = (id) => {
    setActiveDropdownId((prevId) => (prevId === id ? null : id))
  }

  const openProfile = () => {
    setIsProfileOpen(true)
    toggleDropdown(null)
  }

  const closeProfile = () => setIsProfileOpen(false)

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername)
  }

  const handleShake = () => {
    setIsShaking(true)
    setShowSectionLimitMessage(true)
    setIsFadingOut(false)

    setTimeout(() => {
      setIsShaking(false)
    }, 600)

    setTimeout(() => {
      setIsFadingOut(true)
    }, 1700)

    setTimeout(() => {
      setShowSectionLimitMessage(false)
    }, 2000)
  }

  const handleEditSection = (sectionId, sectionName) => {
    setIsEditingSection(true)
    setEditingSectionId(sectionId)
    setEditingSectionName(sectionName)
  }

  return (
    <div className="min-h-screen bg-doit-darkgray">
      <Navbar 
        isDropdownOpen={activeDropdownId === "navbar"} 
        toggleDropdown={() => toggleDropdown("navbar")} 
        onProfileClick={openProfile}
        username={username}
      />

      <div className="flex">
        <ShowSectionBar
          sections={sections}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
          onMarkSection={handleMarkSection}
          onDeleteSection={handleDeleteSectionClick}
          onUpdateSectionName={handleUpdateSectionName}
          onEditSection={handleEditSection}
        />
      
        <div 
          className="flex w-[90%] mx-auto justify-center h-[650px] md:h-[calc(100vh-6rem)]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Oval
                visible={true}
                height="80"
                width="80"              
                color="#4fa94d"
                ariaLabel="oval-loading"
              />
            </div>
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full text-center space-y-6">
              <h2 className="flex flex-col md:flex-row items-center gap-2 text-white text-xl font-semibold">
                Start being productive by pressing the
                  <FontAwesomeIcon 
                    className="h-3 w-3 p-1 rounded-full bg-doit-green text-black" 
                    icon={faPlus} 
                  />
                  icon.
              </h2>
            </div>
          ) : (
            <div className="flex justify-center w-full md:w-[80%] md:h-[90%] md:justify-start space-x-0 md:space-x-20">
              {sections.find(section => section.id === activeSectionId) && (
                <Section 
                  key={activeSectionId}
                  sectionId={activeSectionId}
                  sectionName={sections.find(section => section.id === activeSectionId)?.title}
                  sectionCount={sections.find(section => section.id === activeSectionId)?.taskCount}
                  isImportant={sections.find(section => section.id === activeSectionId)?.isImportant}
                  isDropdownOpen={activeDropdownId === activeSectionId}
                  toggleDropdown={() => toggleDropdown(activeSectionId)}
                  onDeleteSection={handleDeleteSectionClick}
                  onUpdateSectionName={handleUpdateSectionName}
                  onUpdateSectionImportance={handleUpdateSectionImportance}
                  onUpdateSectionTaskCount={handleUpdateSectionTaskCount}
                />
              )}
            </div>
          )}
        </div>

        {sections.length < 5 ? (
          <AddSection onAddSection={handleAddSection} />
          ) : (
            <button className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center bg-red-500 hover:bg-opacity-70 
              transition-transform duration-300 ease-in-out text-white text-2xl
              ${isShaking ? "shake-animation" : ""}`}
              onClick={handleShake}
            >
              <FontAwesomeIcon 
                icon={faExclamation} 
              /> 
            </button>
          )
        } 

        {showConfirmDelete && (
          <DeleteConfirm 
            sectionName={sectionToDelete?.title}
            onConfirm={confirmDeleteSection}
            onCancel={() => setShowConfirmDelete(false)}
          />
        )}

        {showSectionLimitMessage && (
            <div className={`fixed bottom-24 right-10 bg-doit-graybtn text-white text-sm px-4 py-2  
              rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow-lg
              transition-opacity duration-300 ${isFadingOut ? "opacity-0" : "opacity-100"}`}
            >
              <span className="text-red-500">You&apos;ve reached the limit of added sections.</span>
            </div>
        )}      
      </div>


      {isProfileOpen && (
        <UserProfile 
          onClose={closeProfile}
          username={username} 
          user={user}
          onUsernameChange={handleUsernameChange}
        />
      )}

      {isEditingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-doit-graybtn p-6 rounded-lg">
            <SectionEdit
              sectionName={editingSectionName}
              setSectionName={setEditingSectionName}
              onSave={() => handleUpdateSectionName(editingSectionId, editingSectionName)}
              onCancel={() => setIsEditingSection(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
