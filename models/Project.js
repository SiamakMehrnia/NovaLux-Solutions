import mongoose from "mongoose";


const SectionSchema = new mongoose.Schema({
  image: { type: String },  // Base64 String
  description: { type: String, required: true },
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String },
  category: { type: String, required: true },
  sections: {
    section1: { type: SectionSchema, required: true },
    section2: { type: SectionSchema, required: true },
    section3: { type: SectionSchema, required: true },
    section4: { type: SectionSchema, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);