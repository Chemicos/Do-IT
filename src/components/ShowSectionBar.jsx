import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import SectionSidebar from "./SectionSidebar"

export default function ShowSectionBar({ sections = [], onSelectSection, activeSectionId, onMarkSection, onEditSection, onUpdateSectionName, onDeleteSection }) {
    const [isOpen, setIsOpen] = useState(false)
    const [overlayClass, setOverlayClass] = useState("opacity-0")
    const [sidebarClass, setSidebarClass] = useState("-translate-x-full")

    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && 
                !document.querySelector(".section-edit-modal")?.contains(event.target)) {
                    setIsOpen(false)
                }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev)
    }

    const closeSidebar = () => {
        setOverlayClass("opacity-0")
        setSidebarClass("-translate-x-full")
    
        setTimeout(() => {
          setIsOpen(false)
        }, 300) 
      }
    
      useEffect(() => {
        if (isOpen) {
          setOverlayClass("opacity-0")
          setSidebarClass("-translate-x-full")
    
          setTimeout(() => {
            setOverlayClass("opacity-70")
            setSidebarClass("translate-x-0")
          }, 0)
        }
      }, [isOpen])
    

  return (
    <div>
        <div className="hidden md:flex md:w-[300px] md:h-full md:static md:translate-x-0 border-r border-gray-400 border-opacity-20 text-white">
            <SectionSidebar
                sections={sections}
                activeSectionId={activeSectionId}
                onSelectSection={onSelectSection}
                onMarkSection={onMarkSection}
                onEditSection={onEditSection}
                onDeleteSection={onDeleteSection}
                onUpdateSectionName={onUpdateSectionName}
                closeSidebar={closeSidebar}
            />
        </div>

        <div className="md:hidden">
            <button
                onClick={toggleSidebar}
                className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center bg-doit-green text-black text-2xl
                transition-transform duration-100 ease-in-out active:scale-110 z-40"
            >
                <FontAwesomeIcon className="-rotate-90" icon={faAngleDown} />
            </button>

            {isOpen && (
                <>
                    <div
                        className={`
                        fixed inset-0 bg-black z-40 
                        transition-opacity duration-300 
                        ${overlayClass}
                        `}
                        onClick={closeSidebar}
                    />

                    <div
                        ref={menuRef}
                        className={`
                        fixed top-0 left-0 w-[80%] h-full p-4 bg-doit-darkgray text-white z-40
                        transform transition-transform duration-300
                        ${sidebarClass}
                        `}
                    >
                        <SectionSidebar
                            sections={sections}
                            activeSectionId={activeSectionId}
                            onSelectSection={onSelectSection}
                            onMarkSection={onMarkSection}
                            onEditSection={onEditSection}
                            onDeleteSection={onDeleteSection}
                            onUpdateSectionName={onUpdateSectionName}
                            closeSidebar={closeSidebar}
                        />
                    </div>
                </>
            )}
        </div>
    </div>
  )
}
