
// eslint-disable-next-line react/prop-types
export default function SectionEdit({ sectionName, setSectionName, onSave, onCancel }) {
  return (
    <div className="flex flex-col w-72 items center space-y-2">
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
          className="text-gray-400 duration-150 hover:text-white px-4 py-2 hover:bg-doit-graybtn rounded-lg"
        >
            Cancel
        </button>
      </div>
    </div>
  )
}
