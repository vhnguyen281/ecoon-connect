"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";

function Message({ message, onDeleteSuccess }) {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);
  const { unReadCount, setUnReadCount } = useGlobalContext();

  const handleReadClick = async () => {
    try {
      const response = await fetch(`/api/messages/${message._id}`, {
        method: "PUT",
      });

      if (response.status === 200) {
        const { read } = await response.json();
        setIsRead(read);
        setUnReadCount((prev) => (read ? prev - 1 : prev + 1));

        if (read) {
          toast.success("Message marked as read");
        } else {
          toast.success("Message marked as unread");
        }
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      toast.error("Error updating message status");
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`/api/messages/${message._id}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        setIsDeleted(true);
        toast.success("Message deleted successfully");

        // Refetch messages from parent
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        console.error("Failed to delete message");
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };

  if (isDeleted) return null;

  return (
    <div className="relative bg-white p-4 mt-5 rounded-md shadow-2xs border border-gray-200">
      <h2 className="text-xl mb-4">
        {!isRead && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-md px-2 py-1 text-sm font-semibold">
            New
          </div>
        )}
        <span className="font-bold">Property Inquiry: </span>
        {message.property?.name || "Property"}
      </h2>
      <p className="text-gray-700">{message.body || "No message content"}</p>

      <ul className="mt-4">
        <li>
          <strong>Name: </strong> {message.name}
        </li>

        <li>
          <strong> Reply Email: </strong>
          <a href={`mailto:${message.email}`} className="text-blue-500">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone: </strong>
          <a href={`tel:${message.phone}`} className="text-blue-500">
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleReadClick}
        className={`mt-4 mr-3 ${
          isRead ? "bg-gray-500" : "bg-blue-500"
        } text-white py-1 px-3 rounded-md`}
      >
        {isRead ? "Mark As New" : "Mark As Read"}
      </button>
      <button
        onClick={handleDeleteClick}
        className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
      >
        Delete
      </button>
    </div>
  );
}

export default Message;
