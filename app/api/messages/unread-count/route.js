import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/Utils/getSessionUser";

export const dynamic = "force-dynamic";

//GET /api/messages/unread-count/

export const GET = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { userId } = sessionUser;

    const count = await Message.countDocuments({
      receiver: userId,
      read: false,
    });

    return new Response(JSON.stringify(count), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in fetching unread messages count:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
