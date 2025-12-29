import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/Utils/getSessionUser";

export const dynamic = "force-dynamic";

//PUT /api/messages/:id/

export const PUT = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = await params;

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { userId } = sessionUser;

    const message = await Message.findById(id);

    if (!message) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }

    // Only the receiver can mark the message as read
    if (message.receiver.toString() !== userId) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    message.read = !message.read;
    await message.save();

    return new Response(JSON.stringify({ read: message.read }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in updating message:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

//DELETE /api/messages/:id/

export const DELETE = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = await params;

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { userId } = sessionUser;

    const message = await Message.findById(id);

    if (!message) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }

    // Only the receiver can delete the message
    if (message.receiver.toString() !== userId) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    await message.deleteOne();

    return new Response(
      JSON.stringify({ message: "Message deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in deleting message:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
