import React, { useState, useEffect } from "react";
import { useApi } from "../../../context/AppContext";
import pencilImg from "../../../assets/pencil.png";
import { toast } from "react-hot-toast";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  friend: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  lastMessage: string;
  unreadCount: number;
  lastTime: string;
}

const Messaging: React.FC = () => {
  const api = useApi();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState({
    inbox: false,
    messages: false,
    sending: false,
  });

  // Fetch inbox on component mount
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        setLoading(prev => ({ ...prev, inbox: true }));
        const inbox = await api.getInbox();
        setConversations(inbox);
        if (inbox.length > 0) {
          setSelectedConversation(inbox[0]);
        }
      } catch (error) {
        console.error("Failed to fetch inbox:", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(prev => ({ ...prev, inbox: false }));
      }
    };

    fetchInbox();
  }, [api]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        setLoading(prev => ({ ...prev, messages: true }));
        const chatMessages = await api.getChat(selectedConversation.friend._id);
        setMessages(chatMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    fetchMessages();
  }, [api, selectedConversation]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedConversation) return;
    
    try {
      setLoading(prev => ({ ...prev, sending: true }));
      const newMessage = await api.sendMessage(selectedConversation.friend._id, input);
      setMessages(prev => [...prev, newMessage]);
      setInput("");
      
      // Update last message in conversations
      setConversations(prev => 
        prev.map(conv => 
          conv.friend._id === selectedConversation.friend._id
            ? { 
                ...conv, 
                lastMessage: input, 
                lastTime: new Date().toISOString(),
                unreadCount: 0 // Reset unread count since we're the ones sending
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#18191A] rounded-lg shadow-lg overflow-hidden">
      {/* Header with Inbox title and Compose button */}
      <div className="flex justify-between items-center p-4 border-b border-[#2C2F33]">
        <h2 className="text-white text-xl font-bold" style={{ fontFamily: "'Protest Riot', sans-serif" }}>
          Inbox
        </h2>
        <button
          className="text-white text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            backgroundColor: "#0404FF",
            width: "121px",
            height: "48px",
            borderRadius: "12px",
          }}
          onClick={() => {
            // TODO: Implement compose new message functionality
            toast("Compose new message feature coming soon!");
          }}
        >
          <img src={pencilImg} alt="Compose" className="w-3 h-3" />
          Compose
        </button>
      </div>

      {/* Main content area - inbox and chat side by side */}
      <div className="flex flex-1 overflow-hidden">
        {/* Inbox List */}
        <div className="w-1/3 bg-[#23272A] border-r border-[#2C2F33] flex flex-col overflow-hidden">
          {loading.inbox ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-white">Loading conversations...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-400">No conversations yet</div>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              {conversations.map((conv) => (
                <div key={conv.friend._id}>
                  <div
                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-[#202225] ${
                      selectedConversation?.friend._id === conv.friend._id ? "bg-[#202225]" : ""
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="relative">
                      <img
                        src={conv.friend.profilePicture || "/src/assets/profileimg.png"}
                        alt={conv.friend.username}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/src/assets/profileimg.png";
                        }}
                      />
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">{conv.friend.username}</div>
                      <div className="text-gray-400 text-xs truncate">{conv.lastMessage}</div>
                    </div>
                    <div className="text-gray-400 text-xs ml-2 whitespace-nowrap">
                      {new Date(conv.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <hr className="border-[#2C2F33]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-[#2C2F33] p-4">
                <div className="flex items-center">
                  <img
                    src={selectedConversation.friend.profilePicture || "/src/assets/profileimg.png"}
                    alt={selectedConversation.friend.username}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/src/assets/profileimg.png";
                    }}
                  />
                  <div className="text-white font-semibold text-lg">
                    {selectedConversation.friend.username}
                  </div>
                </div>
                <span className="text-green-400 text-xs">online</span>
              </div>

              {/* Messages area */}
              <div className="flex-1 p-4 overflow-y-auto">
                {loading.messages ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-white">Loading messages...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-gray-400">No messages yet</div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.sender === selectedConversation.friend._id 
                            ? "justify-start" 
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.sender !== selectedConversation.friend._id 
                              ? "bg-blue-500 text-white rounded-tr-none" 
                              : "bg-[#2C2F33] text-white rounded-tl-none"
                          }`}
                        >
                          <div className="text-sm break-words">{message.content}</div>
                          <div className="text-xs opacity-70 text-right mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message input */}
              <div className="border-t border-[#2C2F33] p-4">
                <div className="flex items-center">
                  <textarea
                    className="flex-1 bg-[#23272A] text-white rounded px-3 py-2 outline-none resize-none"
                    placeholder="Write a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={{
                      minHeight: "64px",
                      maxHeight: "120px",
                      borderRadius: "15px",
                      border: "1px solid #FFFFFF",
                    }}
                    disabled={loading.sending}
                    rows={1}
                  />
                  <button
                    className="ml-3 text-white font-semibold disabled:opacity-50"
                    style={{
                      width: "121px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: "#0404FF",
                    }}
                    onClick={handleSendMessage}
                    disabled={loading.sending || !input.trim()}
                  >
                    {loading.sending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending
                      </span>
                    ) : "Send"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-400">Select a conversation to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;