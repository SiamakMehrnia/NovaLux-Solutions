import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditProjectForm from "./EditProjectForm";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  /** دریافت لیست پروژه‌ها */
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  /** حذف پروژه */
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This project will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7E00",
      cancelButtonColor: "#555",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/projects?id=${id}`, {
            method: "DELETE",
          });

          const data = await response.json();
          if (data.success) {
            Swal.fire("Deleted!", "Your project has been deleted.", "success");
            fetchProjects(); // Refresh the list
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the project.", "error");
        }
      }
    });
  };

  /** شروع ویرایش */
  const handleEdit = (project) => {
    setEditingProject(project);
  };

  /** پایان ویرایش */
  const handleEditComplete = () => {
    setEditingProject(null);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl text-white mb-6">Projects List</h2>

      {editingProject ? (
        <EditProjectForm project={editingProject} onComplete={handleEditComplete} />
      ) : (
        <>
          {projects.length === 0 ? (
            <p className="text-gray-400">No projects found.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-[#2e2e2e] p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg text-white">{project.title}</h3>
                    <p className="text-gray-400">{project.category}</p>
                  </div>

                  <div className="flex space-x-4">
                    {/* Edit Button */}
                    <button
                      className="bg-[#FF7E00] py-1 px-3 rounded hover:bg-[#FF9100]"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      className="bg-red-600 py-1 px-3 rounded hover:bg-red-700"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsList;