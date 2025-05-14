import connectDB from "../../../lib/connect";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "32mb",
    },
  },
};

// تابع آپلود تصویر به Cloudinary
const uploadToCloudinary = async (image, key) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "novalux",
    });
    console.log(`✅ Uploaded ${key}: ${uploadResponse.secure_url}`);
    return uploadResponse.secure_url;
  } catch (error) {
    console.log(`⛔ Error uploading ${key}:`, error.message);
    throw new Error(`Error uploading ${key}`);
  }
};

export default async function handler(req, res) {
  console.log("📦 Request received:", req.method);

  await connectDB();

  const { method, query } = req;
  const { id } = query;

  try {
    switch (method) {
      /** ✅ GET - دریافت پروژه یا همه پروژه‌ها */
      case "GET":
        console.log("🔍 Fetching projects...");

        if (id) {
          const project = await Project.findById(id);
          if (!project) {
            return res.status(404).json({ success: false, error: "Project not found" });
          }
          return res.status(200).json({ success: true, data: project });
        }

        const projects = await Project.find({});
        return res.status(200).json({ success: true, data: projects });

      /** ✅ POST - ایجاد پروژه جدید با آپلود تصاویر */
      case "POST":
        const { title, link, category, sections } = req.body;

        if (!title || !category || !sections) {
          console.log("⛔ Missing fields:", { title, category, sections });
          return res.status(400).json({ success: false, error: "All fields are required" });
        }

        console.log("📝 Uploading images...");
        const uploadedSections = {};

        // آپلود تصاویر
        for (const key of ["section1", "section2", "section3", "section4"]) {
          const { image, description } = sections[key];

          if (!image || (!image.startsWith("data:image/") && !image.startsWith("https://"))) {
            console.log(`⛔ Invalid image format for ${key}`);
            uploadedSections[key] = { image: "", description };
            continue;
          }

          try {
            const uploadedUrl = await uploadToCloudinary(image, key);
            uploadedSections[key] = { image: uploadedUrl, description };
          } catch (error) {
            console.log(`⛔ Skipping ${key} due to upload error.`);
            uploadedSections[key] = { image: "", description };
          }
        }

        const newProject = new Project({
          title,
          link,
          category,
          sections: uploadedSections,
        });

        await newProject.save();
        console.log("✅ Project created:", newProject);

        return res.status(201).json({ success: true, data: newProject });

      /** ✅ PUT - ویرایش پروژه */
      case "PUT":
        if (!id) {
          return res.status(400).json({ success: false, error: "Project ID is required" });
        }

        const { updatedTitle, updatedLink, updatedCategory, updatedSections } = req.body;

        const updatedData = {
          title: updatedTitle,
          link: updatedLink,
          category: updatedCategory,
          sections: {},
        };

        for (const key of ["section1", "section2", "section3", "section4"]) {
          const { image, description } = updatedSections[key];

          if (image && image.startsWith("data:image/")) {
            try {
              const uploadedUrl = await uploadToCloudinary(image, key);
              updatedData.sections[key] = { image: uploadedUrl, description };
            } catch (error) {
              console.log(`⛔ Skipping ${key} during update.`);
              updatedData.sections[key] = { image: "", description };
            }
          } else {
            updatedData.sections[key] = { image, description };
          }
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
          new: true,
        });

        if (!updatedProject) {
          return res.status(404).json({ success: false, error: "Project not found" });
        }

        return res.status(200).json({ success: true, data: updatedProject });

      /** ✅ DELETE - حذف پروژه */
      case "DELETE":
        if (!id) {
          return res.status(400).json({ success: false, error: "Project ID is required" });
        }

        const projectToDelete = await Project.findById(id);

        if (!projectToDelete) {
          return res.status(404).json({ success: false, error: "Project not found" });
        }

        for (const key of ["section1", "section2", "section3", "section4"]) {
          const imageUrl = projectToDelete.sections[key]?.image;

          if (imageUrl) {
            try {
              const publicId = imageUrl.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(`novalux/${publicId}`);
            } catch (error) {
              console.log(`⛔ Error deleting ${key}: ${error.message}`);
            }
          }
        }

        await Project.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Project deleted successfully" });

      default:
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (err) {
    console.log("🚨 Server Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
