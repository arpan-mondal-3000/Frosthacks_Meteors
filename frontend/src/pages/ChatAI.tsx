import React, { useState, useRef, useEffect, JSX } from "react";
import { House, Send } from "lucide-react";
import { useNavbar } from "../contexts/NavbarContext";
import { fetchAIResponse } from "../api";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

const ChatAI = () => {
  const { setNavbar } = useNavbar();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string | JSX.Element; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  //send

  const sendMessage = async() => {
    if(input.trim() === "") return
    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);
    const aiResponse = await fetchAIResponse(input);

    setIsLoading(false);
    const aiMsg = { text: aiResponse, sender: "ai" };

    setMessages((prev) => [
      ...prev, // Remove "AI is typing..."
      { text: <ReactMarkdown>{aiResponse}</ReactMarkdown>, sender: "ai" } // Render Markdown
    ]);
    setInput("");
  }

  useEffect(() => {
    setNavbar(false);
    return () => setNavbar(true);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full font-primary text-2xl font-black flex justify-between items-center px-4 py-4 border-b-2 border-gray-300 bg-white shadow-md">
        <div className="tracking-wider">
          AUSADHI <span className="text-green-600">MITRA</span>
        </div>

        <Link className="bg-green-600 p-3 rounded-lg text-white" to="/"><House /></Link>
      </nav>

      {/* Chat Container */}
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="bg-green-700 text-white text-center py-4 text-xl font-semibold">
          AI Doctor Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-4 rounded-xl shadow-md max-w-3xs ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white border border-gray-300 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 bg-white shadow-md flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Describe your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-green-700 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition flex items-center"
            onClick={sendMessage}
          >
            {isLoading ? "Loading..." : <Send size={24} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatAI;
