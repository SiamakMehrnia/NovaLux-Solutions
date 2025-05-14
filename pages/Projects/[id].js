import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects?id=${id}`);
        const data = await response.json();
        if (data.success) {
          setProject(data.data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <div className="h-screen bg-black text-white flex justify-center items-center">
        <h1>Loading project details...</h1>
      </div>
    );
  }

  const { title, category, createdAt, sections } = project;

  const sectionArray = Object.values(sections);

  return (
    <div className="min-h-screen  text-white p-10 space-y-12">
      <FlickeringGrid 
        className="fixed inset-0 z-[-1] bg opacity-20 pointer-events-none bg-white" 
        intensity={0.5}
        speed={1.5}
      />
      <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-400 mb-2">Category: {category}</p>
        <p className="text-sm text-gray-500">Created on: {new Date(createdAt).toLocaleDateString()}</p>
      </div>

      {sectionArray.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row gap-10 mb-8 ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } items-center`}
        >
          {/* Image */}
          <div className="w-full md:w-1/2 overflow-hidden rounded-lg shadow-lg">
            <img
              src={section.image}
              alt={`Section ${index + 1}`}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 space-y-4 bg-[#232323] p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">Section {index + 1}</h2>
            <p className="text-gray-300">{section.description}</p>
          </div>
        </div>
      ))}

      {/* Back to Projects Button */}
      <div className="flex justify-center mt-10">
        <Link href="/">
          <button className="bg-[#FF7E00] py-2 px-6 rounded-lg hover:bg-[#FF9100] transition">
            Back to Projects
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetails;