import { faCheck, faEllipsis, faPen, faPlus, faThumbTack, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import SectionEdit from "./SectionEdit"
import TaskEdit from "./TaskEdit"
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { v4 as uuidv4 } from "uuid"
import pencilCheckMarkSound from '../assets/pencil_checkmark.mp3'
import { Oval } from "react-loader-spinner"

export default function Section({ sectionId, sectionName: initialSectionName, isDropdownOpen, isImportant, toggleDropdown, onDeleteSection, onUpdateSectionName, onUpdateSectionImportance, onUpdateSectionTaskCount }) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(null)
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [tasks, setTasks] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [sectionName, setSectionName] = useState(initialSectionName)
  const [isLoading, setIsLoading] = useState(false)

  const dropdownRef = useRef(null)
  const addTaskRef = useRef(null)
  
  const [hoveredTask, setHoveredTask] = useState(null)

  // IMPORTANCE FUNCTIONALITY
  const handleMarkAsImportant = async () => {
    try {
      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, {
        isImportant: true,
      })
      onUpdateSectionImportance(sectionId, true)
    } catch (error) {
      console.error("Error marking section as important:", error)
    }
  }

  const handleUndoImportant = async () => {
    try {
      const sectionRef = doc(db, "sections", sectionId)
      await updateDoc(sectionRef, {
        isImportant: false, 
      })
      onUpdateSectionImportance(sectionId, false) 
    } catch (error) {
      console.error("Error undoing section importance:", error)
    }
  }
// 

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const sectionRef = doc(db, "sections", sectionId)
        const sectionSnapshot = await getDoc(sectionRef)
  
        if (sectionSnapshot.exists()) {
          const sectionData = sectionSnapshot.data()
          setTasks(sectionData.tasks || [])
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [sectionId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [toggleDropdown])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addTaskRef.current && !addTaskRef.current.contains(event.target)) {
        handleCancelTask()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setSectionName(initialSectionName)
  }, [initialSectionName])
  
  const handleAddTask = () => {
    setIsAddingTask(true)
  }

  const handleCancelTask = () => {
    setIsAddingTask(false)
    setTaskName("")
    setTaskDescription("")
  }

  const handleSaveTask = async () => {
    if (taskName.trim()) {
      const newTask = {
        taskId: uuidv4(),
        name: taskName,
        description: taskDescription.trim() ? taskDescription : "",
        sectionId: sectionId
      }

      try {
        const sectionRef = doc(db, "sections", sectionId)

        await updateDoc(sectionRef, {
          tasks: arrayUnion(newTask),
          taskCount: (tasks.length + 1)
        })

        setTasks((prevTasks) => [...prevTasks, newTask])
        onUpdateSectionTaskCount(sectionId, tasks.length + 1)

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
      const sectionSnap = await getDoc(sectionRef)

      if (sectionSnap.exists()) {
        const sectionData = sectionSnap.data()
        const updatedTasks = sectionData.tasks.filter(t => t.taskId !== task.taskId)

        await updateDoc(sectionRef, {
          tasks: updatedTasks,
          taskCount: Math.max(0, updatedTasks.length)
        })

        setTasks(updatedTasks)
        onUpdateSectionTaskCount(sectionId, updatedTasks.length)
      }
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
    setHoveredTask(null)
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
  <div className="flex flex-col mx-auto space-y-4 rounded-lg w-72 md:w-full h-[500px] md:h-full">
    <div className="flex items-center justify-between w-full md:w-[300px] space-x-1">
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
            {isImportant && (
              <FontAwesomeIcon 
                icon={faThumbTack} 
                className="text-doit-green text-lg ml-2" 
                title="Important"
              />
            )}
          
            <h3 className="text-white text-lg font-semibold">
              {sectionName.length > 15 ? `${sectionName.slice(0, 15)}...` : sectionName}
            </h3>

            <span className="text-gray-400 font-semibold">{tasks.length}/10</span>
          </>
        )}
      </div>

      <div className="relative">
        <FontAwesomeIcon 
          icon={faEllipsis}
          className={`${isEditing ? "hidden" : ""} 
          text-doit-green text-xl cursor-pointer active:bg-doit-graybtn p-2 rounded-lg duration-150 
          md:hover:bg-doit-graybtn`
          }
          onClick={toggleDropdown}
        />

        {isDropdownOpen && (
          <div ref={dropdownRef} className="flex flex-col items-center absolute right-0 py-2 w-60 border border-doit-grayborder bg-doit-graybtn rounded-lg z-10">
            <button 
              className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] hover:bg-doit-darkgray rounded-lg transition duration-150"
              onClick={() => {
                isImportant ? handleUndoImportant() : handleMarkAsImportant()
                toggleDropdown(null)
              }}
            >
              <FontAwesomeIcon icon={faThumbTack} className="text-doit-green" />
              <span>{isImportant ? "Unmark" : "Mark"}</span>
            </button>

            <button 
              className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] hover:bg-doit-darkgray rounded-lg transition duration-150"
              onClick={handleEditClick}
            >
              <FontAwesomeIcon icon={faPen} className="text-doit-green" />
              <span>Edit</span>
            </button>

            <button 
              className="flex flex-row items-center space-x-3 text-white py-2 px-2 w-[90%] hover:bg-doit-darkgray rounded-lg transition duration-150"
              onClick={() => {
                onDeleteSection(sectionId, sectionName)
                toggleDropdown(null)
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="text-red-500" />
              <span className="text-red-500">Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="flex flex-col flex-1 overflow-hidden">
      <div className={`flex-1 overflow-y-auto space-y-4 pr-2 transition-all duration-300 max-h-full`}>
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <Oval 
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="oval-loading"
            />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex text-gray-400 text-lg">
            Let&apos;s add some tasks.
          </div>
        ) : (
          tasks.map((task, index) => (
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
                className="flex items-center justify-between p-3 bg-doit-graybtn rounded-lg hover:bg-opacity-70 cursor-pointer"
              >
                <div className="w-full" 
                  onClick={() => handleDeleteTask(task)}
                  onMouseEnter={() => setHoveredTask(task.taskId)}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  <h4 className={`text-lg ${hoveredTask === task.taskId ? "line-through text-doit-green" : "text-white"}`}>
                    {task.name}
                  </h4>
                  <p className={`text-sm ${hoveredTask === task.taskId ? "line-through text-doit-green" : "text-gray-400"}`}>
                    {task.description}
                  </p>
                </div>

                <FontAwesomeIcon 
                  icon={faPen} 
                  className="text-doit-green cursor-pointer p-2 rounded-lg h-5 w-5 hover:bg-doit-darkgray duration-150"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditTask(index)
                  }}
                />
              </div>
            )
          ))
        )}
      </div>

      <div className="">
        {isAddingTask ? (
          <div 
            ref={addTaskRef}
            className="flex p-3 justify-between border md:w-[370px] border-doit-grayborder rounded-lg mt-4"
          >
            <div className="flex flex-col">
              <input 
                type="text"
                placeholder="Task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-transparent text-white rounded-lg focus:outline-none placeholder:text-lg text-lg pr-2" 
              />
              <input 
                type="text" 
                placeholder="Description (optional)"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full bg-transparent text-gray-400 rounded-lg focus:outline-none placeholder:text-sm text-sm pr-2"
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
          tasks.length < 10 ? (
            <button onClick={handleAddTask} className="flex items-center space-x-2 text-gray-400 hover:text-doit-green active:text-doit-green mt-4">
              <FontAwesomeIcon icon={faPlus} className="text-doit-green" />
              <span className="text-xl">Add task</span>
            </button>
          ) : null
        )}
      </div>
    </div>
  </div>
  )
}