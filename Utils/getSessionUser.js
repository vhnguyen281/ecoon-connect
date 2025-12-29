import { auth } from "@/Utils/authOptions";

export const getSessionUser = async () => {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }
    return {
      user: session.user,
      userId: session.user.id,
    };
  } catch (error) {
    console.log("Error fetching session user:", error);
    return null;
  }
};
