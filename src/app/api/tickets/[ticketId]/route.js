import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import Note from "@/models/Note";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { ticketId } = await params;

    const ticket = await Ticket.findOne({ ticketId }).lean();

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    const notes = await Note.find({ ticketId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      ticket_id: ticket.ticketId,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
      notes: notes.map((note) => ({
        note_id: note._id,
        note_text: note.noteText,
        created_at: note.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch ticket.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { ticketId } = await params;
    const body = await request.json();

    const { status, priority, note } = body;

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    const allowedStatuses = ["Open", "In Progress", "Closed"];
    const allowedPriorities = ["Low", "Medium", "High", "Urgent"];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status.",
        },
        { status: 400 }
      );
    }

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid priority.",
        },
        { status: 400 }
      );
    }

    if (status !== undefined) {
      ticket.status = status;
    }

    if (priority !== undefined) {
      ticket.priority = priority;
    }

    await ticket.save();

    let createdNote = null;

    if (note?.trim()) {
      const newNote = await Note.create({
        ticketId,
        noteText: note.trim(),
      });

      createdNote = {
        note_id: newNote._id,
        note_text: newNote.noteText,
        created_at: newNote.createdAt,
      };
    }

    return NextResponse.json({
      success: true,
      message: "Ticket updated successfully.",
      ticket: {
        ticket_id: ticket.ticketId,
        status: ticket.status,
        priority: ticket.priority,
        updated_at: ticket.updatedAt,
      },
      note: createdNote,
    });
  } catch (error) {
    console.error("Update ticket error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update ticket.",
      },
      { status: 500 }
    );
  }
}