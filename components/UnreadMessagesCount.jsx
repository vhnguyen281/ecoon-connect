import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

function UnreadMessagesCount({ session }) {
  const { unReadCount, setUnReadCount } = useGlobalContext();

  useEffect(() => {
    if (!session) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/unread-count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUnReadCount(data);
        } else {
          console.error("Failed to fetch unread messages count");
        }
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    fetchUnreadCount();
  }, [session, setUnReadCount]);

  return unReadCount > 0 ? (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
      {unReadCount}
    </span>
  ) : null;
}

export default UnreadMessagesCount;
