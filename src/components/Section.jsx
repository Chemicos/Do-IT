import { faCheck, faEllipsis, faPen, faPlus, faThumbTack, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import SectionEdit from "./SectionEdit"
import TaskEdit from "./TaskEdit"
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { v4 as uuidv4 } from "uuid"
import pencilCheckMarkSound from '../assets/pencil_checkmark.mp3'

// eslint-disable-next-line react/prop-types
export default function Section({ sectionId, sectionName: initialSectionName, isDropdownOpen, toggleDropdown, onDeleteSection, onUpdateSectionName }) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(null)
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [tasks, setTasks] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [sectionName, setSectionName] = useState(initialSectionName)
  
  const [hoveredTask, setHoveredTask] = useState(null)

  const handleDeleteSection = async () => {
    try {
      await deleteDoc(doc(db, "sections", sectionId))
      onDeleteSection(sectionId)
    } catch (error) {
      console.log("Error deleting section: ", error)
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const sectionRef = doc(db, "sections", sectionId)
      const sectionSnapshot = await getDoc(sectionRef)

      if (sectionSnapshot.exists()) {
        const sectionData = sectionSnapshot.data()
        setTasks(sectionData.tasks || [])
      }
    }

    fetchTasks()
  }, [sectionId])

  const handleAddTask = () => {
    setIsAddingTask(true)
  }

  const handleCancelTask = () => {
    setIsAddingTask(false)
    setTaskName("")
    setTaskDescription("")
  }

  const handleSaveTask = async () => {
    if (taskName.trim() && taskDescription.trim()) {
      const newTask = {
        taskId: uuidv4(),
        name: taskName,
        description: taskDescription,
        sectionId: sectionId
      };

      try {
        const sectionRef = doc(db, "sections", sectionId)

        await updateDoc(sectionRef, {
          tasks: arrayUnion(newTask)
        })

        setTasks((prevTasks) => [...prevTasks, newTask])
        setIsAddingTask(false)
        setTaskName("")
        setTaskDescription("")
      } catch (error) {
        console.error("Error saving task: ", error)
      }
    }
  }

  const handleEditTask = (taskIndex) => {
    setIsEditingTask(taskIndex)
    const task = tasks[taskIndex]
    setTaskName(task.name)
    setTaskDescription(task.description)
  }

  const handleSaveEditTask = async () => {
    const updatedTasks = [...tasks]
    const editedTask = { ...updatedTasks[isEditingTask], name: taskName, description: taskDescription }
    updatedTasks[isEditingTask] = editedTask

    try {
      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, {
        tasks: arrayRemove(tasks[isEditingTask]),
      })
      await updateDoc(sectionRef, {
        tasks: arrayUnion(editedTask),
      })

      setTasks(updatedTasks)
      setIsEditingTask(null)
      setTaskName("")
      setTaskDescription("")
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (task) => {
    try {
      const audio = new Audio(pencilCheckMarkSound)
      audio.play()

      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, {
        tasks: arrayRemove({
          taskId: task.taskId,
          name: task.name,
          description: task.description,
          sectionId: task.sectionId
        }),
      })

      setTasks(tasks.filter((t) => t.taskId !== task.taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    toggleDropdown()
  }

  const handleCancelEdit = () => {
    setIsEditingTask(null)
    setIsEditing(false)
    setSectionName(initialSectionName)
    setTaskName("")
    setTaskDescription("")
  }
  
  const handleSaveEdit = async () => {
    try {
      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, { title: sectionName })

      onUpdateSectionName(sectionId, sectionName)
      setIsEditing(false)
    } catch (error) {
      console.log("Error updating section title: ", error)
    }
  }

  return (
    <div className="flex flex-col space-y-4 rounded-lg w-72 h-14">
      <div className="flex items-center justify-between w-full space-x-1">
        <div className="flex items-center space-x-2">

          {isEditing ? (
            <SectionEdit 
              sectionName={sectionName}
              setSectionName={setSectionName}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <h3 className="text-white text-lg font-semibold">
                {sectionName.length > 20 ? `${sectionName.slice(0, 20)}...` : sectionName}
              </h3>
              <span className="text-gray-400 font-semibold">{tasks.length}</span>
            </>
          )}
        </div>

        <div className="relative">
          <FontAwesomeIcon 
              icon={faEllipsis}
              className={`${isEditing ? "hidden" : ""} text-doit-green text-xl cursor-pointer duration-150 hover:bg-doit-graybtn p-2 rounded-lg`}
              onClick={toggleDropdown}
          />

          {isDropdownOpen && (
            <div className="flex flex-col items-center absolute right-0 py-2 w-60 border border-doit-grayborder bg-doit-graybtn rounded-lg z-10">
              <button className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] hover:bg-doit-darkgray rounded-lg">
                <FontAwesomeIcon icon={faThumbTack} className="text-doit-green" />
                <span>Important</span>
              </button>

              <button 
                className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] hover:bg-doit-darkgray rounded-lg"
                onClick={handleEditClick}
              >
                <FontAwesomeIcon icon={faPen} className="text-doit-green" />
                <span>Edit</span>
              </button>

              <button 
                className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] hover:bg-doit-darkgray rounded-lg"
                onClick={handleDeleteSection}
              >
                <FontAwesomeIcon icon={faTrash} className="text-doit-green" />
                <span>Delete</span>
              </button>
              
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          isEditingTask === index ? (
            <TaskEdit 
              key={index}
              taskName={taskName}
              taskDescription={taskDescription}
              setTaskName={setTaskName}
              setTaskDescription={setTaskDescription}
              onSave={handleSaveEditTask}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div 
              key={task.taskId} 
              className="flex items-center justify-between p-3 bg-doit-graybtn rounded-lg
              hover:bg-opacity-70 cursor-pointer"
              onClick={() => handleDeleteTask(task)}
              onMouseEnter={() => setHoveredTask(task.taskId)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <div>
                <h4 className={`text-lg ${hoveredTask === task.taskId ? "line-through text-doit-green" : "text-white"}`}>
                  {task.name}
                </h4>
                <p className={`text-sm ${hoveredTask === task.taskId ? "line-through text-doit-green" : "text-gray-400"}`}>
                  {task.description}
                </p>
              </div>
  
              <FontAwesomeIcon 
                icon={faPen} 
                className="text-doit-green cursor-pointer p-2 rounded-lg hover:bg-doit-darkgray duration-150"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditTask(index)
                }}
              />
            </div>
          )
        ))}
      </div>

      {isAddingTask ? (
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
            <button onClick={handleCancelTask}>
             <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-2xl cursor-pointer hover:text-white" /> 
            </button>

            <button onClick={handleSaveTask}>
             <FontAwesomeIcon icon={faCheck} className="text-doit-green text-2xl cursor-pointer hover:opacity-50" />
            </button>
            </div>
        </div>
      ) : (
        <button onClick={handleAddTask} className="flex items-center md:w-72 space-x-2 text-gray-400 hover:text-doit-green">
          <FontAwesomeIcon icon={faPlus} className="text-doit-green" />
          <span className="text-lg">Add task</span>
        </button>
      )}
    </div>
  )
}