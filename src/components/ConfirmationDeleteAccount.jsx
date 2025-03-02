
export default function ConfirmationDeleteAccount({ onCancel, onConfirm }) {
  return (
    <div className="flex flex-col items-center w-full md:w-[400px] my-auto p-4 gap-8">
      <h1 className="text-xl font-semibold text-gray-400">Are you sure?</h1>
      <p className="text-md text-gray-400 text-center">
        This action will permanently delete your account and all associated data. 
        This cannot be undone.
      </p>

      <div className="flex space-x-4">
        <button 
          className="px-4 py-2 rounded-lg text-white hover:bg-doit-graybtn active:bg-doit-graybtn transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="px-5 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-opacity-70 transition"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
