import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import axiosConfig from '../../api/axiosConfig';

const ShippingManager = () => {
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState('districts');

    useEffect(() => {
        fetchDistricts();
    }, []);

    const fetchDistricts = async () => {
        try {
            setLoading(true);
            const res = await axiosConfig.get('/shipping/districts');
            setDistricts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching districts:', error);
            setLoading(false);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const res = await axiosConfig.get(`/shipping/districts/${districtId}/wards`);
            setWards(res.data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    const handleSelectDistrict = (district) => {
        setSelectedDistrict(district);
        fetchWards(district.id);
    };

    const calculateFee = async (districtName, wardName) => {
        try {
            const params = new URLSearchParams({ district: districtName });
            if (wardName) params.append('ward', wardName);
            
            const res = await axiosConfig.get(`/shipping/fee?${params}`);
            return res.data.fee;
        } catch (error) {
            console.error('Error calculating fee:', error);
            return 0;
        }
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">🚚 Quản Lý Vận Chuyển</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('districts')}
                        className={`flex-1 py-4 text-center font-semibold ${
                            activeTab === 'districts'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        📍 Quận
                    </button>
                    <button
                        onClick={() => setActiveTab('wards')}
                        className={`flex-1 py-4 text-center font-semibold ${
                            activeTab === 'wards'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        🏘️ Phường
                    </button>
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={`flex-1 py-4 text-center font-semibold ${
                            activeTab === 'calculator'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        🧮 Tính Phí
                    </button>
                </div>

                <div className="p-6">
                    {/* Districts Tab */}
                    {activeTab === 'districts' && (
                        <div>
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-bold">Danh sách Quận</h2>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm quận
                                </button>
                            </div>

                            {showAddForm && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-blue-900">
                                        Tính năng thêm quận sẽ được cập nhật trong phiên bản tới
                                    </p>
                                </div>
                            )}

                            <div className="grid gap-4">
                                {districts.map((district) => (
                                    <div
                                        key={district.id}
                                        onClick={() => handleSelectDistrict(district)}
                                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                                            selectedDistrict?.id === district.id ? 'border-blue-600 bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{district.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    📌 Mã: {district.code || 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    📍 Khoảng cách: {district.distanceFromHub || 0}km
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    💰 Phí cơ bản: ₫{district.baseShippingFee?.toLocaleString('vi-VN')}
                                                </p>
                                                <p className="text-sm mt-2">
                                                    {district.active ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                                            ✓ Hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                                            ✗ Tạm ngưng
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Wards Tab */}
                    {activeTab === 'wards' && (
                        <div>
                            {selectedDistrict ? (
                                <>
                                    <h2 className="text-xl font-bold mb-4">
                                        Phường thuộc <span className="text-blue-600">{selectedDistrict.name}</span>
                                    </h2>
                                    {wards.length > 0 ? (
                                        <div className="grid gap-3">
                                            {wards.map((ward) => (
                                                <div key={ward.id} className="p-4 border rounded-lg bg-white hover:shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold">{ward.name}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                📌 Mã: {ward.code || 'N/A'}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                💰 Phí bổ sung: ₫{(ward.additionalShippingFee || 0).toLocaleString('vi-VN')}
                                                            </p>
                                                            <p className="text-xs mt-2">
                                                                {ward.active ? (
                                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                                                        ✓ Hoạt động
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                                                                        ✗ Tạm ngưng
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Chưa có phường nào</p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">Vui lòng chọn một quận để xem phường</p>
                            )}
                        </div>
                    )}

                    {/* Calculator Tab */}
                    {activeTab === 'calculator' && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">🧮 Công cụ tính phí vận chuyển</h2>
                            <ShippingFeeCalculator districts={districts} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ShippingFeeCalculator = ({ districts }) => {
    const [selectedDist, setSelectedDist] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [wards, setWards] = useState([]);
    const [fee, setFee] = useState(null);

    const handleDistrictChange = async (e) => {
        const distName = e.target.value;
        setSelectedDist(distName);
        setSelectedWard('');
        setFee(null);

        // Fetch wards for selected district
        const district = districts.find(d => d.name === distName);
        if (district) {
            try {
                const res = await axiosConfig.get(`/shipping/districts/${district.id}/wards`);
                setWards(res.data);
            } catch (error) {
                console.error('Error fetching wards:', error);
            }
        }
    };

    const handleCalculate = async () => {
        if (!selectedDist) return;

        try {
            const params = new URLSearchParams({ district: selectedDist });
            if (selectedWard) params.append('ward', selectedWard);

            const res = await axiosConfig.get(`/shipping/fee?${params}`);
            setFee(res.data.fee);
        } catch (error) {
            console.error('Error calculating fee:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-2">Chọn Quận</label>
                    <select
                        value={selectedDist}
                        onChange={handleDistrictChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">-- Chọn quận --</option>
                        {districts.map((d) => (
                            <option key={d.id} value={d.name}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                {wards.length > 0 && (
                    <div>
                        <label className="block text-sm font-semibold mb-2">Chọn Phường (tùy chọn)</label>
                        <select
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">-- Không chọn --</option>
                            {wards.map((w) => (
                                <option key={w.id} value={w.name}>
                                    {w.name} (+₫{(w.additionalShippingFee || 0).toLocaleString('vi-VN')})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    onClick={handleCalculate}
                    className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Tính Phí
                </button>

                {fee !== null && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-gray-600">Phí vận chuyển dự kiến:</p>
                        <p className="text-3xl font-bold text-green-600">
                            ₫{fee.toLocaleString('vi-VN')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShippingManager;
