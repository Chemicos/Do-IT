/* eslint-disable react/prop-types */
import { faEllipsis, faPen, faThumbTack, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
// import SectionEdit from "./SectionEdit";

export default function SectionMenu({ isImportant = false, onMark, onDelete, onEditSection}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)
  
    const toggleMenu = () => {
      setMenuOpen((prev) => !prev)
    }
  
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setMenuOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
  
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="text-doit-green text-xl active:bg-doit-darkgray p-2 rounded-lg transition duration-200"
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
  
        {menuOpen && (
          <div
            className="absolute right-0 top-8 w-auto border border-doit-grayborder bg-doit-graybtn rounded-xl p-2 
              flex flex-col space-y-2 items-start z-10 shadow-md"
          >
            <button
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white transition duration-150
                active:bg-doit-darkgray md:active:bg-transparent md:hover:bg-doit-darkgray"
                onClick={() => {
                onMark?.()
                setMenuOpen(false)
                }}
            >
                <FontAwesomeIcon icon={faThumbTack} className="text-doit-green" />
                <span className="font-semibold">{isImportant ? "Unmark" : "Mark"}</span>
            </button>
  
            <button
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white transition duration-150
              active:bg-doit-darkgray md:active:bg-transparent md:hover:bg-doit-darkgray"
              onClick={() => {
                onEditSection()
                setMenuOpen(false)
              }}
            >
              <FontAwesomeIcon icon={faPen} className="text-doit-green" />
              <span className="font-semibold">Edit</span>
            </button>
  
            <button
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white transition duration-150
              active:bg-doit-darkgray md:active:bg-transparent md:hover:bg-doit-darkgray"
              onClick={async () => {
                if (onDelete) {
                    await onDelete()
                    setMenuOpen(false)
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="text-red-500" />
              <span className="font-semibold text-red-500">Delete</span>
            </button>
          </div>
        )}
      </div>
    
  )
}
