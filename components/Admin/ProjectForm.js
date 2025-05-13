import { useState } from "react";
import Swal from "sweetalert2";

const ProjectForm = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [sections, setSections] = useState([
    { image: null, description: "" },
    { image: null, description: "" },
    { image: null, description: "" },
    { image: null, description: "" },
  ]);

  const categories = ["E-Commerce", "CRM", "Blog", "Portfolio"];

  /** تبدیل فایل به Base64 */
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  /** آپلود پروژه */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Title and Category are required.",
      });
      return;
    }

    try {
      // تبدیل تصاویر به Base64
      const sectionData = await Promise.all(
        sections.map(async (section) => {
          const base64Image = section.image
            ? await convertToBase64(section.image)
            : "";
          return {
            image: base64Image,
            description: section.description,
          };
        })
      );

      // ساختار داده‌ها
      const payload = {
        title,
        link,
        category,
        sections: {
          section1: sectionData[0],
          section2: sectionData[1],
          section3: sectionData[2],
          section4: sectionData[3],
        },
      };

      // ارسال به API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Project Uploaded!",
          text: "Your project has been successfully uploaded.",
        });

        // ریست فرم
        setTitle("");
        setLink("");
        setCategory("");
        setSections([
          { image: null, description: "" },
          { image: null, description: "" },
          { image: null, description: "" },
          { image: null, description: "" },
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  /** تغییر فایل */
  const handleFileChange = (index, file) => {
    const updatedSections = [...sections];
    updatedSections[index].image = file;
    setSections(updatedSections);
  };

  /** تغییر توضیحات */
  const handleDescriptionChange = (index, text) => {
    const updatedSections = [...sections];
    updatedSections[index].description = text;
    setSections(updatedSections);
  };

  return (
    <div className="bg-[#1f1f1f] p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl text-white mb-6">Upload New Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-300 mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
            placeholder="Project Title"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-gray-300 mb-1">Project Link:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
            placeholder="https://project-link.com"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-300 mb-1">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div key={index} className="bg-[#2e2e2e] p-4 rounded-lg mb-4">
            <h3 className="text-lg text-gray-300 mb-2">Section {index + 1}</h3>

            <div className="mb-2">
              <label className="block text-gray-300 mb-1">Image:</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Description:</label>
              <textarea
                value={section.description}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                placeholder={`Description for Section ${index + 1}`}
              ></textarea>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-[#FF7E00] py-2 px-6 rounded hover:bg-[#FF9100]"
          >
            Upload Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;