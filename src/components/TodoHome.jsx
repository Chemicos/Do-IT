import { useEffect, useRef, useState } from "react";
import AddSection from "./addSection";
import Navbar from "./Navbar";
import Section from "./Section";
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// eslint-disable-next-line react/prop-types
export default function TodoHome() {
  const [sections, setSections] = useState([])
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [user, setUser] = useState(null)

  const scrollContainerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Grab and drag functionality --------------
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.classList.add("cursor-grabbing")
    scrollContainerRef.current.classList.remove("cursor-grab")
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    scrollContainerRef.current.classList.add("cursor-grab")
    scrollContainerRef.current.classList.remove("cursor-grabbing")
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1; // scroll sensitivity
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }
// --------------------------------------------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchSections = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "sections"),
            where("userId", "==", user.uid)
          )

          const querySnapshot = await getDocs(q)
          const loadedSections = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setSections(loadedSections)
        } catch (error) {
          console.error("Error fetching sections:", error)
        }
      }
    }

    fetchSections()
  }, [user])

  const handleUpdateSectionName = (sectionId, newTitle) => {
      setSections((prevSections) => prevSections.map((section) => 
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    )
  }

  const handleDeleteSection = (sectionId) => {
    setSections((prevSections) => prevSections.filter(section => section.id !== sectionId))
  }

  const handleAddSection = (sectionData) => {
    setSections((prevSections) => [...prevSections, {...sectionData, id: sectionData.sectionId}])
  }

  const toggleDropdown = (id) => {
    setActiveDropdownId((prevId) => (prevId === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-doit-darkgray">
      <Navbar 
        isDropdownOpen={activeDropdownId === "navbar"} 
        toggleDropdown={() => toggleDropdown("navbar")} 
      />

      <div 
        className="flex w-4/5 mx-auto space-x-20 mt-4 overflow-x-auto h-[600px] select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={scrollContainerRef}
      >
        <div className="flex space-x-20">
          {sections.map((section) => (
              <Section 
                key={section.id}
                sectionId={section.id}
                sectionName={section.title}
                sectionCount={section.taskCount}
                isDropdownOpen={activeDropdownId === section.id}
                toggleDropdown={() => toggleDropdown(section.id)}
                onDeleteSection={handleDeleteSection}
                onUpdateSectionName={handleUpdateSectionName}
              />
          ))}
        </div>

      <AddSection onAddSection={handleAddSection} />
      </div>
      
    </div>
  )
}
