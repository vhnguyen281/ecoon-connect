"use client";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import Message from "./Message";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMessages = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border-b-gray-500 m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Messages</h1>
          {messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            messages.map((message) => (
              <Message
                key={message._id}
                message={message}
                onDeleteSuccess={getMessages}
              />
            ))
          )}
          <div className="space-y-4"></div>
        </div>
      </div>
    </section>
  );
}

export default Messages;
