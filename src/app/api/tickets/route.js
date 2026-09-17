import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function generateTicketId() {
  const latestTicket = await Ticket.findOne()
    .sort({ createdAt: -1 })
    .select("ticketId")
    .lean();

  if (!latestTicket) {
    return "TKT-001";
  }

  const latestNumber = Number(latestTicket.ticketId.replace("TKT-", ""));

  return `TKT-${String(latestNumber + 1).padStart(3, "0")}`;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      subject,
      description,
    } = body;

    if (
      !customer_name?.trim() ||
      !customer_email?.trim() ||
      !subject?.trim() ||
      !description?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(customer_email.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid customer email.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const ticketId = await generateTicketId();

    const ticket = await Ticket.create({
      ticketId,
      customerName: customer_name.trim(),
      customerEmail: customer_email.trim(),
      subject: subject.trim(),
      description: description.trim(),
    });

    return NextResponse.json(
      {
        ticket_id: ticket.ticketId,
        created_at: ticket.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create ticket error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create ticket.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search?.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        { ticketId: searchRegex },
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { subject: searchRegex },
        { description: searchRegex },
      ];
    }

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "ticketId customerName subject status priority createdAt"
      )
      .lean();

    const formattedTickets = tickets.map((ticket) => ({
      ticket_id: ticket.ticketId,
      customer_name: ticket.customerName,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.createdAt,
    }));

    return NextResponse.json(formattedTickets);
  } catch (error) {
    console.error("Get tickets error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tickets.",
      },
      { status: 500 }
    );
  }
}