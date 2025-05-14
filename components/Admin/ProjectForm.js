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

  /** آپلود فایل به Cloudinary */
  const uploadToCloudinary = async (file) => {
    if (!file) {
      console.warn("No file provided for upload");
      return "";
    }

    console.log("Uploading file to Cloudinary:", file);
    console.log("File type:", file.type);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "novalux");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dr5h0ms9o/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Upload Response:", data);

      if (data.secure_url) {
        console.log("Uploaded image URL:", data.secure_url);
        return data.secure_url;
      } else {
        console.error("Cloudinary upload error:", data);
        return "";
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return "";
    }
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

    console.log("Sections before upload:", sections);

    try {
      Swal.fire({
        title: "Uploading...",
        text: "Please wait while your project is being uploaded.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const sectionData = await Promise.all(
        sections.map(async (section, idx) => {
          console.log(`Section ${idx + 1} image before upload:`, section.image);
          if (section.image) {
            const imageUrl = await uploadToCloudinary(section.image);
            console.log(`Section ${idx + 1} image after upload:`, imageUrl);
            return {
              image: imageUrl || "",
              description: section.description,
            };
          } else {
            console.log(`Section ${idx + 1} has no image to upload.`);
            return {
              image: "",
              description: section.description,
            };
          }
        })
      );

      console.log("Section Data after upload:", sectionData);

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

      console.log("Payload being sent to API:", payload);

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
    if (!file) {
      console.warn(`No file selected for section ${index + 1}`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.warn(`Selected file for section ${index + 1} is not an image:`, file.type);
      return;
    }

    console.log(`File selected for section ${index + 1}:`, file);

    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      image: file,
    };
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

        {sections.map((section, index) => (
          <div key={index} className="bg-[#2e2e2e] p-4 rounded-lg mb-4">
            <h3 className="text-lg text-gray-300 mb-2">Section {index + 1}</h3>

            <div className="mb-2">
              <label className="block text-gray-300 mb-1">Image:</label>
              <input
                type="file"
                accept="image/*"
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