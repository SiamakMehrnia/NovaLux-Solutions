import { useState } from "react";
import Swal from "sweetalert2";

const EditProjectForm = ({ project, onComplete }) => {
  const [title, setTitle] = useState(project.title);
  const [link, setLink] = useState(project.link);
  const [category, setCategory] = useState(project.category);
  const [sections, setSections] = useState(Object.values(project.sections));

  const categories = ["E-Commerce", "CRM", "Blog", "Portfolio"];

  /** آپدیت پروژه */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        link,
        category,
        sections: {
          section1: sections[0],
          section2: sections[1],
          section3: sections[2],
          section4: sections[3],
        },
      };

      const response = await fetch(`/api/projects?id=${project._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Updated!", "The project has been updated successfully.", "success");
        onComplete();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  return (
    <div className="bg-[#1f1f1f] p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl text-white mb-6">Edit Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Link:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {sections.map((section, index) => (
          <div key={index} className="bg-[#2e2e2e] p-4 rounded-lg mb-4">
            <h3 className="text-lg text-gray-300 mb-2">Section {index + 1}</h3>

            <div>
              <label className="block text-gray-300 mb-1">Description:</label>
              <textarea
                value={section.description}
                onChange={(e) => {
                  const updatedSections = [...sections];
                  updatedSections[index].description = e.target.value;
                  setSections(updatedSections);
                }}
                className="w-full p-2 bg-gray-800 text-white rounded"
              ></textarea>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-[#FF7E00] py-2 px-6 rounded hover:bg-[#FF9100]"
          >
            Update
          </button>

          <button
            type="button"
            className="bg-gray-600 py-2 px-6 rounded hover:bg-gray-700"
            onClick={onComplete}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectForm;