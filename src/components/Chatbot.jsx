import { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Xin chào! Tôi là trợ lý ảo của cửa hàng. Tôi có thể giúp bạn tìm hiểu về sản phẩm, giá cả và các thông tin khác. Bạn cần hỗ trợ gì ạ?'
        }
    ]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            setIsLoading(true);
            // Sửa lại URL endpoint
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chatbot`, {
                method: 'POST',
                body: JSON.stringify({ message: input }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prev => [...prev,
            { type: 'user', text: input },
            { type: 'bot', text: data.response }
            ]);
            setInput('');
        } catch (error) {
            console.error('Chatbot error:', error);
            // Thêm thông báo lỗi cho người dùng
            setMessages(prev => [...prev,
            { type: 'user', text: input },
            { type: 'bot', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderMessageContent = (text) => {
        // Check if text contains markdown image/link
        const imageRegex = /\[(.*?)\]\((.*?)\)/g;
        const matches = [...text.matchAll(imageRegex)];

        if (matches.length > 0) {
            // Split text by markdown links
            const parts = text.split(imageRegex);

            return (
                <div className="flex flex-col gap-2">
                    {/* Text before images */}
                    {parts[0] && <p>{parts[0]}</p>}

                    {/* Images grid */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {matches.map((match, index) => {
                            const [_, alt, url] = match;
                            return (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={alt}
                                        className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                        onClick={() => window.open(url, '_blank')}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Text after images */}
                    {parts[parts.length - 1] && <p>{parts[parts.length - 1]}</p>}
                </div>
            );
        }

        // If no images, return plain text
        return <p>{text}</p>;
    };

    const renderAvatar = (type) => {
        if (type === 'bot') {
            return (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                    <img
                        src="https://www.shutterstock.com/image-vector/cute-chat-bot-smiling-flat-260nw-2175518705.jpg"
                        alt="Bot Avatar"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                            // Fallback to initial letter if image fails to load
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = 'B';
                        }}
                    />
                </div>
            );
        }
        return null; // No avatar for user messages
    };

    return (
        <div className="fixed bottom-16 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
                >
                    <FiMessageCircle size={24} />
                </button>
            ) : (
                <div className="bg-gray-700 rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-500">
                        <div className="flex items-center">
                            {renderAvatar('bot')}
                            <h3 className="font-semibold text-white">Chat với trợ lý</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto text-white">
                        {messages.map((msg, index) => (
                            <div key={index}
                                className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.type === 'bot' && renderAvatar('bot')}
                                <div className={`p-3 rounded-lg max-w-[85%] ${msg.type === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-white'
                                    }`}>
                                    {renderMessageContent(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-500">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập câu hỏi..."
                                className="flex-1 p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Gửi
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;