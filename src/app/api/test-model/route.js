import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import Note from "@/models/Note";

export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      models: {
        ticket: Ticket.modelName,
        note: Note.modelName,
      },
    });
  } catch (error) {
    console.error("Model test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Model test failed",
      },
      { status: 500 }
    );
  }
}