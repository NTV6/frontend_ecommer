import { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiShoppingCart } from 'react-icons/fi';

import { chatbotService } from '../services/api';
import { formatCurrency } from '../utils/index';

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            responseType: 'general_response',
            message: 'Xin chào! Tôi là trợ lý ảo của cửa hàng. Tôi có thể giúp bạn tìm hiểu về sản phẩm, giá cả và các thông tin khác. Bạn cần hỗ trợ gì ạ?',
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

        // Add user message immediately
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

        try {
            setIsLoading(true);
            const { data } = await chatbotService.sendMessage(userMessage);

            // Add bot response with structured data
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
                message: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
                data: null
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderProductCard = (product) => (
        <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(product.image, '_blank')}
                />
            )}
            <div className="p-3">
                <h4 className="font-semibold text-white mb-1">{product.name}</h4>

                {product.priceRange && (
                    <div className="text-green-400 font-semibold">
                        {product.priceRange.min === product.priceRange.max
                            ? formatCurrency(product.priceRange.min)
                            : `${formatCurrency(product.priceRange.min)} - ${formatCurrency(product.priceRange.max)}`
                        }
                    </div>
                )}
                {product.inStock !== undefined && (
                    <div className={`text-xs mt-1 ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                        {product.inStock ? '✓ Còn hàng' : '✗ Hết hàng'}
                    </div>
                )}
            </div>
        </div>
    );

    const renderProductDetail = (product) => (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
                {product.variants && product.variants.length > 0 && (
                    <div>
                        <h4 className="text-white font-semibold mb-2">Các phiên bản:</h4>
                        <div className="space-y-3">
                            {product.variants.map((variant, idx) => (
                                <div key={idx} className="bg-gray-700 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-white font-medium">
                                                {variant.color} - {variant.size}
                                            </span>
                                            <div className="text-green-400 font-semibold mt-1">
                                                {formatCurrency(variant.price)}
                                            </div>
                                        </div>
                                        <div className={`text-sm ${variant.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
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
        <div className="space-y-2">
            {categories.map((category) => (
                <div key={category.id} className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FiShoppingCart className="text-blue-400" />
                            <span className="text-white font-medium">{category.name}</span>
                        </div>
                        {category.productCount !== undefined && (
                            <span className="text-gray-400 text-sm">
                                {category.productCount} sản phẩm
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderBotMessage = (msg) => {
        return (
            <div className="mb-4 flex justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <img
                        src="https://www.shutterstock.com/image-vector/cute-chat-bot-smiling-flat-260nw-2175518705.jpg"
                        alt="Bot Avatar"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.textContent = 'B';
                        }}
                    />
                </div>

                <div className="max-w-[85%]">
                    {msg.message && (
                        <div className="bg-gray-600 text-white p-3 rounded-lg mb-2">
                            {msg.message}
                        </div>
                    )}

                    {msg.data && (
                        <div className="mt-2">
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
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors"
                >
                    <FiMessageCircle size={24} />
                </button>
            ) : (
                <div className="bg-gray-700 rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-500">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                <img
                                    src="https://www.shutterstock.com/image-vector/cute-chat-bot-smiling-flat-260nw-2175518705.jpg"
                                    alt="Bot Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.textContent = 'B';
                                    }}
                                />
                            </div>
                            <h3 className="font-semibold text-white">Chat với trợ lý</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto text-white">
                        {messages.map((msg, index) => (
                            msg.type === 'user' ? (
                                <div key={index} className="mb-4 flex justify-end">
                                    <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[85%]">
                                        {msg.text}
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
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2 flex-shrink-0">
                                    <img
                                        src="https://www.shutterstock.com/image-vector/cute-chat-bot-smiling-flat-260nw-2175518705.jpg"
                                        alt="Bot Avatar"
                                        className="w-full h-full rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.textContent = 'B';
                                        }}
                                    />
                                </div>
                                <div className="bg-gray-600 text-white p-3 rounded-lg">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
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
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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