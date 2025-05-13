import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
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

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="h-screen bg-gradient-to-b from-[#1f1f1f] to-[#2e2e2e] flex justify-center items-center overflow-hidden p-10"
    >
      <div className="w-full overflow-x-auto scrollbar-hide flex space-x-6 p-6">
        {projects.length === 0 ? (
          <p className="text-white">Loading projects...</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="min-w-[250px] max-w-[250px] bg-[#333333] p-4 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 hover:bg-[#444444] cursor-pointer flex flex-col"
            >
              <div className="flex-1 mb-4">
                <img
                  src={project.sections.section1.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg text-white font-semibold mb-2">
                {project.title}
              </h3>
              <p className="text-gray-300 mb-4">{project.category}</p>
              <button
                className="bg-[#FF7E00] text-white py-2 px-4 rounded-lg hover:bg-[#FF9100] transition"
                onClick={() => router.push(`/Projects/${project._id}`)}
              >
                View Project
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Projects;
