import { useEffect, useRef } from "react"

export default function SectionEdit({ sectionName, setSectionName, onSave, onCancel }) {
  const sectionEditRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionEditRef.current && !sectionEditRef.current.contains(event.target)) {
        onCancel()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onCancel])
  return (
    <div 
      ref={sectionEditRef}
      className="section-edit-modal flex flex-col w-72 space-y-2"
    >
      <input 
        type="text" 
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
        className="w-full px-4 py-4 rounded-lg bg-transparent text-white placeholder-gray-400 border border-doit-grayborder
                focus:outline-none focus:border-doit-green"
      />

      <div className="flex space-x-2">
        <button 
          onClick={onSave} 
          className="text-white font-semibold px-4 py-2 rounded-lg focus:outline-none
        bg-doit-green hover:opacity-80"
        >
            Save
        </button>

        <button 
          onClick={onCancel} 
          className="text-gray-400 transition duration-150 active:bg-doit-darkgray active:text-white px-4 py-2 rounded-lg
          md:hover:bg-doit-graybtn md:hover:text-white"
        >
            Cancel
        </button>
      </div>
    </div>
  )
}
