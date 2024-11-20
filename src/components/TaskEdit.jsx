import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// eslint-disable-next-line react/prop-types
export default function TaskEdit({ taskName, taskDescription, setTaskName, setTaskDescription, onSave, onCancel }) {
  return (
      <div className="flex p-3 justify-between border border-doit-grayborder rounded-lg">
          <div className="flex flex-col">
            <input 
              type="text"
              placeholder="Task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-transparent text-white rounded-lg focus:outline-none placeholder:text-lg text-lg
              pr-2" 
            />
            <input 
              type="text" 
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full bg-transparent text-gray-400 rounded-lg focus:outline-none placeholder:text-sm text-sm
              pr-2"
            />
          </div>

          <div className="flex space-x-4">
            <button onClick={onCancel}>
             <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-2xl cursor-pointer hover:text-white" /> 
            </button>

            <button onClick={onSave}>
             <FontAwesomeIcon icon={faCheck} className="text-doit-green text-2xl cursor-pointer hover:opacity-50" />
            </button>
            </div>
        </div>
  )
}
