import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const initialHistoryData = [
    {
        id: 1,
        user: 'User1',
        time: '2025-04-13T15:30:00',
        result: 'Success',
        imageUrl: 'https://via.placeholder.com/150',
        modelName: 'Model A',
        description: 'تمت العملية بنجاح، نتائج دقيقة.',
    },
    {
        id: 2,
        user: 'User2',
        time: '2025-04-12T18:20:00',
        result: 'Failure',
        imageUrl: 'https://via.placeholder.com/150',
        modelName: 'Model B',
        description: 'حدث خطأ أثناء المعالجة، يجب تحسين المدخلات.',
    },
    {
        id: 3,
        user: 'User3',
        time: '2025-04-11T10:00:00',
        result: 'Success',
        imageUrl: 'https://via.placeholder.com/150',
        modelName: 'Model C',
        description: 'نجاح العملية، تم الحصول على النتائج المتوقعة.',
    },
];

const ModelHistoryPage = () => {
    const [historyData, setHistoryData] = useState(initialHistoryData);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const confirmDelete = (id) => {
        setConfirmDeleteId(id);
    };

    const handleDelete = () => {
        const updatedHistory = historyData.filter(item => item.id !== confirmDeleteId);
        setHistoryData(updatedHistory);
        setConfirmDeleteId(null);
    };

    const cancelDelete = () => {
        setConfirmDeleteId(null);
    };

    const handleSort = () => {
        const sorted = [...historyData].sort((a, b) => {
            return sortOrder === 'asc'
                ? new Date(a.time) - new Date(b.time)
                : new Date(b.time) - new Date(a.time);
        });
        setHistoryData(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
    };

    const closeModal = () => {
        setSelectedRecord(null);
    };

    return (
        <motion.div 
            className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white-300 to-white-200 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="w-full max-w-7xl bg-white p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">Model History</h1>

                <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
                        <tr>
                            <th
                                className="py-3 px-6 text-left cursor-pointer"
                                onClick={handleSort}
                            >
                                <span>Time</span>
                                {sortOrder === 'asc' ? (
                                    <span className="ml-2 text-sm">↑</span>
                                ) : (
                                    <span className="ml-2 text-sm">↓</span>
                                )}
                            </th>
                            <th className="py-3 px-6 text-left">User</th>
                            <th className="py-3 px-6 text-left">Result</th>
                            <th className="py-3 px-6 text-left">Model</th>
                            <th className="py-3 px-6 text-left">Image</th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="py-3 px-6">{format(new Date(item.time), 'yyyy-MM-dd HH:mm')}</td>
                                <td className="py-3 px-6">{item.user}</td>
                                <td className="py-3 px-6">
                                    <span
                                        className={`px-2 py-1 rounded-full text-white ${
                                            item.result === 'Success' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    >
                                        {item.result}
                                    </span>
                                </td>
                                <td className="py-3 px-6">{item.modelName}</td>
                                <td className="py-3 px-6">
                                    <img
                                        src={item.imageUrl}
                                        alt="Model Result"
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                </td>
                                <td className="py-3 px-6 flex space-x-3">
                                    <button
                                        onClick={() => handleViewDetails(item)}
                                        className="text-sky-500 hover:text-sky-700 transition duration-200"
                                    >
                                        <i className="fa fa-eye text-xl"></i>
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(item.id)}
                                        className="text-red-500 hover:text-red-700 transition duration-200"
                                    >
                                        <i className="fa fa-trash-alt text-xl"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal لعرض التفاصيل */}
                {selectedRecord && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            exit={{ y: 50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-semibold mb-4">Details of Operation</h2>
                            <div className="mb-4"><strong>Model Name:</strong> {selectedRecord.modelName}</div>
                            <div className="mb-4"><strong>User:</strong> {selectedRecord.user}</div>
                            <div className="mb-4"><strong>Time:</strong> {format(new Date(selectedRecord.time), 'yyyy-MM-dd HH:mm')}</div>
                            <div className="mb-4"><strong>Result:</strong> {selectedRecord.result}</div>
                            <div className="mb-4"><strong>Description:</strong> {selectedRecord.description}</div>
                            <div className="mb-4">
                                <strong>Uploaded Image:</strong>
                                <img src={selectedRecord.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded-md mt-2" />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="bg-red-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Modal to confirm deletion */}
                {confirmDeleteId !== null && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold mb-4 text-center">Confirm Deletion</h2>
                            <p className="mb-6 text-center">
                                Are you sure you want to delete this record? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={cancelDelete}
                                    className="bg-gray-300 text-black py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white py-2 px-4 rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* CSS الخاصة بالـ Modal */}
                <style>
                    {`
                        .modal-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.5);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 1000;
                        }

                        .modal-content {
                            background-color: white;
                            padding: 2rem;
                            border-radius: 8px;
                            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                            width: 90%;
                            max-width: 500px;
                        }
                    `}
                </style>
            </motion.div>
        </motion.div>
    );
};

export default ModelHistoryPage;
