import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      index: true,
    },

    noteText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;