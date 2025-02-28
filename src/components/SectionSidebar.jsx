import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionMenu from "./SectionMenu";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";

export default function SectionSidebar({ sections, activeSectionId, onSelectSection, onMarkSection, onEditSection, onUpdateSectionName, onDeleteSection, closeSidebar}) {
  return (
    <div className="flex flex-col w-full space-y-4 text-white p-2 md:py-2 md:px-4">
        <h3 className="text-gray-400 text-sm">Sections</h3>
            {sections.length === 0 && (
                <p className="text-white text-md font-semibold">Try creating a section.</p>
            )}

        <div className="flex flex-col">
            {sections.map((section) => (
                <div 
                    key={section.id} 
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition active:bg-doit-graybtn
                       ${section.id === activeSectionId ? "bg-doit-graybtn" : ""} `}                    
                >
                    <div className="flex items-center space-x-2 w-full"
                        onClick={() => {
                            onSelectSection(section.id)
                            closeSidebar()
                        }}
                    >
                        {section.isImportant && (
                            <FontAwesomeIcon 
                                icon={faThumbTack} 
                                className="text-doit-green text-sm"
                            />
                        )}

                        <span className="text-white text-md font-semibold capitalize">
                            {section.title.length > 15 ? `${section.title.slice(0, 15)}...` : section.title}
                        </span>
                        <span className="text-gray-400 text-sm font-semibold">
                            {section.taskCount || 0}/10
                        </span>    
                    </div>

                    <SectionMenu
                        sectionName={section.title}
                        isImportant={section.isImportant}
                        onMark={() => onMarkSection(section.id, !section.isImportant)}
                        onUpdateSectionName={(newTitle) => onUpdateSectionName(section.id, newTitle)}
                        onDelete={() => onDeleteSection?.(section.id)}
                        onEditSection={() => onEditSection(section.id, section.title)}
                    />    
                </div>
            ))}
        </div>
    </div>
  )
}
