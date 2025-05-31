import { IoClose } from 'react-icons/io5';

const ImagePreview = ({ imageUrl, onClose }) => {
    return (
        <div
            className="fixed -inset-6 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl max-h-[90vh] p-2"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                    <IoClose size={20} className='text-black' />
                </button>
                <img
                    src={imageUrl}
                    alt="Profile Preview"
                    className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
            </div>
        </div>
    );
};

export default ImagePreview;