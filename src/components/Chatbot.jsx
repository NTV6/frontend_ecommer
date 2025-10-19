import { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiShoppingCart, FiPackage } from 'react-icons/fi';
import { chatbotService } from '../services/api';
import { formatCurrency } from '../utils/index';
import '../../styles/Chatbot.css';

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            responseType: 'general_response',
            message: 'Xin chào! 👋 Tôi là trợ lý ảo của cửa hàng. Tôi có thể giúp bạn:\n• Tìm kiếm sản phẩm\n• Xem thông tin chi tiết\n• So sánh giá cả\n\nBạn muốn tìm gì hôm nay?',
            data: null
        }
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

        try {
            setIsLoading(true);
            const { data } = await chatbotService.sendMessage(userMessage);
            setMessages(prev => [...prev, {
                type: 'bot',
                responseType: data.type,
                message: data.message,
                data: data.data
            }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                responseType: 'error',
                message: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau. 😔',
                data: null
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderProductCard = (product) => (
        <div key={product.id} className="dark:bg-gray-800 bg-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(product.image, '_blank')}
                />
            )}

            <div className="p-3">
                <h4 className="font-semibold mb-1">{product.name}</h4>

                {product.priceRange && (
                    <div className="dark:text-green-400 text-green-600 font-semibold">
                        {product.priceRange.min === product.priceRange.max
                            ? formatCurrency(product.priceRange.min)
                            : `${formatCurrency(product.priceRange.min)} - ${formatCurrency(product.priceRange.max)}`
                        }
                    </div>
                )}
                {product.inStock !== undefined && (
                    <div className={`text-xs mt-1 ${product.inStock ? 'dark:text-green-400 text-green-600' : 'dark:text-red-400 text-red-600'}`}>
                        {product.inStock ? '✓ Còn hàng' : '✗ Hết hàng'}
                    </div>
                )}
            </div>
        </div>
    );

    const renderProductDetail = (product) => (
        <div className="bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 from-gray-100 to-gray-200 rounded-xl overflow-hidden border border-gray-500">
            <div className="p-3">
                {product.variants && product.variants.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FiPackage className="text-blue-400" size={18} />
                            <h4 className="font-bold text-lg">Các phiên bản</h4>
                        </div>
                        <div className="space-y-3">
                            {product.variants.map((variant, idx) => (
                                <div key={idx} className="dark:bg-gray-700 bg-gray-300 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-medium">
                                                {variant.color} - Size {variant.size}
                                            </span>
                                            <div className="text-green-700 dark:text-green-400 font-semibold mt-1">
                                                {formatCurrency(variant.price)}
                                            </div>
                                        </div>
                                        <div className={`text-sm ${variant.stock > 0 ? 'dark:text-green-400 text-green-700' : 'dark:text-red-400 text-red-600'}`}>
                                            {variant.stock > 0 ? `Còn ${variant.stock}` : 'Hết hàng'}
                                        </div>
                                    </div>

                                    {variant.images && variant.images.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {variant.images.slice(0, 3).map((img, imgIdx) => (
                                                <img
                                                    key={imgIdx}
                                                    src={img}
                                                    alt={`${variant.color} ${variant.size}`}
                                                    className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => window.open(img, '_blank')}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCategoryList = (categories) => (
        <div className="grid grid-cols-1 gap-2">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className="bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 from-gray-200 to-gray-300 rounded-lg p-3 hover:from-gray-750 hover:to-gray-850 transition-all duration-300 border border-gray-500 hover:border-blue-500/50 cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 p-2.5 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                <FiShoppingCart className="text-blue-400" size={16} />
                            </div>
                            <span className="font-semibold text-base group-hover:text-blue-400 transition-colors">
                                {category.name}
                            </span>
                        </div>
                        {category.productCount !== undefined && (
                            <div className="dark:bg-gray-700 px-3 py-1 rounded-full">
                                <span className="text-gray-300 text-sm font-medium">
                                    {category.productCount} SP
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const BotAvatar = ({ size = 40 }) => (
        <div
            className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
            style={{ width: size, height: size }}
        >
            <img
                src="https://www.shutterstock.com/image-vector/cute-chat-bot-smiling-flat-260nw-2175518705.jpg"
                alt="Bot Avatar"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="font-bold text-sm">AI</span>';
                }}
            />
        </div>
    );

    const renderBotMessage = (msg) => {
        return (
            <div className="mb-4 flex justify-start animate-fadeIn">
                <BotAvatar size={40} />

                <div className="max-w-[80%] ml-2">
                    {msg.message && (
                        <div className="bg-gradient-to-br from-white to-gray-300 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl rounded-tl-none mb-2 shadow-lg border border-gray-500">
                            <p className="whitespace-pre-line leading-relaxed">{msg.message}</p>
                        </div>
                    )}

                    {msg.data && (
                        <div className="mt-3">
                            {msg.responseType === 'product_list' && msg.data.products && (
                                <div className="grid grid-cols-1 gap-3">
                                    {msg.data.products.map(product => renderProductCard(product))}
                                </div>
                            )}

                            {msg.responseType === 'product_detail' && msg.data.product && (
                                renderProductDetail(msg.data.product)
                            )}

                            {msg.responseType === 'category_list' && msg.data.categories && (
                                renderCategoryList(msg.data.categories)
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed bottom-16 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full p-3 shadow-2xl transition-all duration-300 hover:scale-110 group"
                >
                    <FiMessageCircle size={24} className="text-white group-hover:rotate-12 transition-transform" />
                </button>
            ) : (
                <div className="bg-gradient-to-b from-white to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-w-[400px] max-h-[700px] flex flex-col border border-gray-500 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 border-b border-blue-500">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <BotAvatar size={40} />
                                <div>
                                    <h3 className="text-white font-bold text-lg">Trợ lý AI</h3>
                                    <p className="text-white text-xs">Luôn sẵn sàng hỗ trợ</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                            >
                                <FiX size={24} className='text-white' />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            msg.type === 'user' ? (
                                <div key={index} className="mb-4 flex justify-end animate-fadeIn">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg">
                                        <p className="leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            ) : (
                                <div key={index}>
                                    {renderBotMessage(msg)}
                                </div>
                            )
                        ))}

                        {isLoading && (
                            <div className="mb-4 flex justify-start">
                                <BotAvatar size={40} />
                                <div className="bg-gradient-to-br from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl rounded-tl-none shadow-lg ml-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 bg-gray-400 dark:bg-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 p-3 border border-gray-600 dark:bg-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-br text-white from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-5 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg disabled:hover:shadow-none"
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