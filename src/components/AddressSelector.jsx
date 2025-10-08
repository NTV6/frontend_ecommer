import { useState, useEffect } from 'react';

const AddressSelector = ({ value, onChange, required = false, onValidityChange }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [loading, setLoading] = useState(false);

    // Load danh sách tỉnh/thành khi component mount
    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        // Kiểm tra tính hợp lệ của địa chỉ mỗi khi có thay đổi
        const isValid = !!(selectedProvince && selectedDistrict && selectedWard);
        onValidityChange?.(isValid);
    }, [selectedProvince, selectedDistrict, selectedWard, onValidityChange]);

    const fetchProvinces = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://provinces.open-api.vn/api/p/');
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDistricts = async (provinceCode) => {
        try {
            setLoading(true);
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
            setWards([]);
        } catch (error) {
            console.error('Error fetching districts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWards = async (districtCode) => {
        try {
            setLoading(true);
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
        } catch (error) {
            console.error('Error fetching wards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProvinceChange = (e) => {
        const code = e.target.value;
        const provinceName = provinces.find(p => p.code.toString() === code)?.name || '';

        setSelectedProvince(code);
        setSelectedDistrict('');
        setSelectedWard('');
        setDistricts([]);
        setWards([]);

        if (code) {
            fetchDistricts(code);
        }

        updateAddress(provinceName, '', '');
    };

    const handleDistrictChange = (e) => {
        const code = e.target.value;
        const districtName = districts.find(d => d.code.toString() === code)?.name || '';
        const provinceName = provinces.find(p => p.code.toString() === selectedProvince)?.name || '';

        setSelectedDistrict(code);
        setSelectedWard('');
        setWards([]);

        if (code) {
            fetchWards(code);
        }

        updateAddress(provinceName, districtName, '');
    };

    const handleWardChange = (e) => {
        const code = e.target.value;
        const wardName = wards.find(w => w.code.toString() === code)?.name || '';
        const districtName = districts.find(d => d.code.toString() === selectedDistrict)?.name || '';
        const provinceName = provinces.find(p => p.code.toString() === selectedProvince)?.name || '';

        setSelectedWard(code);
        updateAddress(provinceName, districtName, wardName);
    };

    const updateAddress = (province, district, ward) => {
        const addressParts = [ward, district, province].filter(Boolean);
        const fullAddress = addressParts.join(', ');
        onChange(fullAddress);
    };

    return (
        <div className="space-y-3">
            {/* Tỉnh/Thành phố */}
            <div className='flex flex-col sm:flex-row gap-3'>
                <select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    required={required}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                    <option value="">Tỉnh/Thành phố</option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </select>

                {/* Quận/Huyện */}
                <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince || loading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                    <option value="">Quận/Huyện</option>
                    {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                            {district.name}
                        </option>
                    ))}
                </select>

                {/* Phường/Xã */}
                <select
                    value={selectedWard}
                    onChange={handleWardChange}
                    disabled={!selectedDistrict || loading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                    <option value="">Phường/Xã</option>
                    {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default AddressSelector;