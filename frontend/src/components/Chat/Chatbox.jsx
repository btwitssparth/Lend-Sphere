import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getMessages, sendMessage } from '../../api/messages';
import { useAuth } from '../../Context/AuthContext';
import { Button } from '../Ui/Button';
import { Send, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ChatBox = ({ rentalId, isOpen, onClose, rentalStatus }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    
    // 🔥 FIX: Instantly determine lock status directly from the prop!
    const isLocked = ["Pending", "Completed", "Cancelled"].includes(rentalStatus);
    
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isOpen || !rentalId || !user) return;

        const fetchHistory = async () => {
            try {
                const res = await getMessages(rentalId);
                // Make sure to safely access the messages array
                setMessages(res.data?.data?.messages || []);
            } catch (error) {
                console.error("Failed to load messages:", error);
                // If it fails, we still show an empty chat instead of breaking
                setMessages([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        socketRef.current = io(SOCKET_URL, {
            withCredentials: true,
        });

        socketRef.current.on("connect", () => {
            socketRef.current.emit("join_chat", rentalId);
        });

        socketRef.current.on("receive_message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [rentalId, isOpen, user]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isLocked) return;

        const textObj = newMessage.trim();
        setNewMessage(""); 

        try {
            await sendMessage(rentalId, textObj);
        } catch (error) {
            console.error("Failed to send message", error);
            alert(error.response?.data?.message || "Failed to send message.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-6 right-6 w-[380px] h-[500px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col overflow-hidden z-50 transition-colors"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Rental Chat</h3>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {rentalStatus === 'Active' ? '🟢 In Progress' : `Status: ${rentalStatus}`}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto p-5 bg-white dark:bg-zinc-950 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 space-y-2">
                            <p className="text-sm font-medium">No messages yet.</p>
                            <p className="text-xs text-center px-4">Start the conversation to coordinate your rental.</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.sender === user?._id;
                            return (
                                <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div 
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                                            isMe 
                                                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-sm' 
                                                : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    {isLocked ? (
                        <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            Chat is locked until Approved.
                        </div>
                    ) : (
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                                type="text" 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..." 
                                className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                            />
                            <Button 
                                type="submit" 
                                size="icon" 
                                disabled={!newMessage.trim()}
                                className="rounded-xl shrink-0 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border-none shadow-none"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatBox;