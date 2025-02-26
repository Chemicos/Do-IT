
export default function Confirmation({ onClose }) {
  return (
    <div className="flex flex-col items-center w-full md:w-[400px] my-auto p-4 gap-8">
      <h1 className="text-xl font-semibold text-gray-400">Your changes have been saved</h1>

      <div className="relative">
        <svg className="checkmark" viewBox="0 0 52 52">
            <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
            />
            <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
        </svg>
      </div>

      <button 
        className="px-5 py-2 rounded-md bg-doit-green text-white font-semibold hover:bg-opacity-70 transition"
        onClick={onClose}
      >
            OK
      </button>
    </div>
  )
}
