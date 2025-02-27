import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function DeleteConfirm({ sectionName , onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-doit-graybtn p-6 rounded-lg shadow-lg w-80 text-center">
        <FontAwesomeIcon
          icon={faExclamationTriangle} 
          className="text-red-500 text-3xl mb-3"
        />

        <h2 className="text-white text-lg font-semibold">
          Are you sure?
        </h2>

        <p className="text-gray-400 mb-4">
          You are about to delete <strong>{sectionName}</strong>. This acction cannot be undone.
        </p>

        <div className="flex justify-center space-x-4">
          <button 
            className="px-4 py-2 rounded-lg text-white hover:bg-doit-darkgray active:bg-doit-darkgray"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button 
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-150"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
