import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/Utils/getSessionUser";

export const dynamic = "force-dynamic";

//Get api/messages

export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { userId } = sessionUser;
    // Fetch messages for the logged-in user, sorted by read status and date
    const readMessages = await Message.find({ receiver: userId, read: true })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .populate("property", "name");

    const unreadMessages = await Message.find({ receiver: userId, read: false })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .populate("property", "name");

    const messages = [...unreadMessages, ...readMessages];

    return new Response(JSON.stringify(messages), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in fetching messages:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

//POST api/messages

export const POST = async (request) => {
  try {
    await connectDB();
    const { name, email, phone, message, property, recipient } =
      await request.json();
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { userId } = sessionUser;

    // Cant send message to yourself
    if (userId === recipient) {
      return new Response(
        JSON.stringify({ message: "Cannot send message to yourself" }),
        {
          status: 400,
        }
      );
    }

    const newMessage = new Message({
      sender: userId,
      receiver: recipient,
      property,
      name,
      email,
      phone,
      body: message,
    });

    await newMessage.save();

    return new Response(
      JSON.stringify({ message: "Message sent successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in sending message:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
