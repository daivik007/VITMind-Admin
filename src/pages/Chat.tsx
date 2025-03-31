
import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample AI responses for demonstration
const aiResponses = [
  "I understand you're going through a difficult time. Could you tell me more about what you're experiencing?",
  "Thank you for sharing that with me. It takes courage to talk about these things.",
  "It sounds like you're feeling overwhelmed. Let's explore some coping strategies that might help.",
  "Your feelings are valid. Many people go through similar experiences.",
  "Have you tried deep breathing exercises when you feel anxious? It can help calm your nervous system.",
  "Remember that healing is not linear. Some days will be better than others, and that's okay.",
  "Would it help to talk about what triggered these feelings?",
  "Self-care is important. What activities bring you joy or peace?",
  "I'm here to support you through this journey. You don't have to face this alone."
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { checkForEmergency } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI therapy assistant. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check if message contains emergency keywords
    const isEmergency = checkForEmergency(input);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // If emergency is detected, show a notification
    if (isEmergency) {
      setTimeout(() => {
        const emergencyResponse: Message = {
          id: `emergency-${Date.now()}`,
          content: "I notice you may be going through a crisis. Remember, you're not alone. Would you like me to connect you with a human counselor immediately?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, emergencyResponse]);
        setIsTyping(false);
      }, 1500);
    } else {
      // Simulate AI response after a delay
      setTimeout(() => {
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: randomResponse,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center p-4 border-b bg-white">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mr-4"
        >
          <ArrowUp className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <h1 className="text-xl font-bold">AI Therapy Assistant</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.sender === "ai" ? (
                    <>
                      <AvatarImage src="/placeholder.svg" alt="AI" />
                      <AvatarFallback className="bg-therapy-500 text-white">AI</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://randomuser.me/api/portraits/lego/1.jpg" alt="You" />
                      <AvatarFallback>You</AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <Card
                  className={`${
                    message.sender === "ai" 
                      ? "bg-white border-therapy-100" 
                      : "bg-therapy-600 text-white"
                  }`}
                >
                  <CardContent className="p-3">
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <footer className="p-4 bg-white border-t">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2">
          <Input
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
