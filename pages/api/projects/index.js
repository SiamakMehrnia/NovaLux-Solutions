import connectDB from "../../../lib/connect";
import Project from "@/models/Project";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "16mb",
    },
  },
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
          console.log(`🔍 Fetching project with id: ${id}`);
          const project = await Project.findById(id);

          if (!project) {
            console.log("⛔ Project not found");
            return res.status(404).json({ success: false, error: "Project not found" });
          }

          return res.status(200).json({ success: true, data: project });
        }

        const projects = await Project.find({});
        return res.status(200).json({ success: true, data: projects });

      /** ✅ POST - ایجاد پروژه جدید با تصاویر Base64 */
      case "POST":
        console.log("📝 Creating new project...");
        const { title, link, category, sections } = req.body;

        if (!title || !category || !sections) {
          return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // بررسی Base64 تصاویر
        const sectionKeys = ["section1", "section2", "section3", "section4"];
        for (let key of sectionKeys) {
          if (!sections[key].image.startsWith("data:image/")) {
            return res.status(400).json({ success: false, error: `Invalid image format in ${key}` });
          }
        }

        const newProject = new Project({ title, link, category, sections });
        await newProject.save();

        console.log("✅ Project created:", newProject);
        return res.status(201).json({ success: true, data: newProject });

      /** ✅ PUT - ویرایش پروژه */
      case "PUT":
        if (!id) {
          return res.status(400).json({ success: false, error: "Project ID is required" });
        }

        console.log(`🛠️ Updating project with id: ${id}`);
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProject) {
          return res.status(404).json({ success: false, error: "Project not found" });
        }

        console.log("✅ Project updated:", updatedProject);
        return res.status(200).json({ success: true, data: updatedProject });

      /** ✅ DELETE - حذف پروژه */
      case "DELETE":
        if (!id) {
          return res.status(400).json({ success: false, error: "Project ID is required" });
        }

        console.log(`🗑️ Deleting project with id: ${id}`);
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
          return res.status(404).json({ success: false, error: "Project not found" });
        }

        console.log("✅ Project deleted:", deletedProject);
        return res.status(200).json({ success: true, message: "Project deleted successfully" });

      default:
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (err) {
    console.log("🚨 Server Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
