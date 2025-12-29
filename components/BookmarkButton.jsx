"use client";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { FaBookmark } from "react-icons/fa";
import { useEffect, useState } from "react";

function BookmarkButton({ property }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const checkBookmarkStatus = async () => {
      try {
        const res = await fetch("/api/bookmarks/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyId: property._id }),
        });
        const result = await res.json();
        if (res.ok) {
          setIsBookmarked(result.isBookmarked);
        }
      } catch (error) {
        console.error("Error bookmarking property:", error);
      } finally {
        setLoading(false);
      }
    };
    checkBookmarkStatus();
  }, [property._id, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error("You must be logged in to bookmark properties.");
      return;
    }
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId: property._id }),
      });
      const result = await res.json();
      if (res.ok) {
        setIsBookmarked(result.isBookmarked);
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to bookmark property.");
      }
    } catch (error) {
      console.error("Error bookmarking property:", error);
      toast.error("An error occurred while bookmarking the property.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return isBookmarked ? (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" /> Remove Bookmark
    </button>
  ) : (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" /> Bookmark Property
    </button>
  );
}

export default BookmarkButton;
