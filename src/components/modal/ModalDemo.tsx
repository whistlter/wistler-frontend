import { useModal } from '@/providers/ModalProvider';
import React from 'react';


export const ModalDemo: React.FC = () => {
    const { openModal, } = useModal();

    const openCenterModal = () => {
        openModal(
            <div>
                <h2 className="text-2xl font-bold mb-4">Center Modal</h2>
                <p className="text-gray-600 mb-4">
                    This is a traditional center modal that appears in the middle of the screen.
                </p>
                <p className="text-sm text-gray-500">
                    Perfect for alerts, confirmations, and short forms.
                </p>
            </div>,
            { type: 'center' }
        );
    };

    const openSideModal = () => {
        openModal(
            ({ close }) => (
                <div>
                    <h2 className="text-2xl font-bold mb-6 pr-8">Create Community</h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Community Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Enter name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                                rows={4}
                                placeholder="Enter description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                <option>Select</option>
                                <option>Technology</option>
                                <option>Sports</option>
                                <option>Arts</option>
                                <option>Business</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-600">Attach photo or take a picture</p>
                                <p className="text-xs text-gray-400 mt-1">jpg, jpeg, png • up to 2mb</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visibility
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                <option>Select visibility</option>
                                <option>Public</option>
                                <option>Private</option>
                                <option>Safe space</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Assignment
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Select a user to own and manage this community.
                            </p>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                <option>Select user</option>
                                <option>Henry Smith</option>
                                <option>Jane Doe</option>
                                <option>John Anderson</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-6 border-t">
                        <button
                            onClick={close}
                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                alert('Community created!');
                                close();
                            }}
                            className="flex-1 px-4 py-3 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                        >
                            Create community
                        </button>
                    </div>
                </div>
            ),
            { type: 'side', width: 'w-[500px]' }
        );
    };

    const openConfirmModal = () => {
        let closeModal: () => void;
        openModal(
            ({ close }) => (
                closeModal = close,
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Delete Community?</h2>
                    <p className="text-gray-600 mb-6">
                        This action cannot be undone. All members will lose access.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={closeModal}
                            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                alert('Community deleted!');
                                close();
                            }}
                            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ),
            { type: 'center', width: 'max-w-sm' }
        );
    };

    const openWideFormModal = () => {
        openModal(
            ({ close }) => (
                <div>
                    <h2 className="text-2xl font-bold mb-6 pr-8">User Registration</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={close}
                            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                alert('User registered!');
                                close();
                            }}
                            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Register
                        </button>
                    </div>
                </div>
            ),
            { type: 'center', width: 'max-w-2xl' }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    React Modal Service
                </h1>
                <p className="text-gray-600 mb-8">
                    Center and Side modal support with smooth animations
                </p>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold mb-6">Try Different Modal Types</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Center Modals</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={openCenterModal}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Simple Center Modal
                                </button>
                                <button
                                    onClick={openConfirmModal}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Confirmation Modal
                                </button>
                            </div>
                            <button
                                onClick={openWideFormModal}
                                className="w-full mt-3 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                                Wide Form Modal
                            </button>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Side Modal</h3>
                            <button
                                onClick={openSideModal}
                                className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                            >
                                Create Community (Side Modal)
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Features:</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>✓ Center modal: appears in middle with fade & scale</li>
                            <li>✓ Side modal: slides from right edge</li>
                            <li>✓ Only one modal open at a time</li>
                            <li>✓ Smooth transitions between modals</li>
                            <li>✓ Configurable width for both types</li>
                            <li>✓ Close on ESC, overlay, or X button</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-3">Usage Examples:</h3>
                    <div className="space-y-3 text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded">
                        <div>
                            <span className="text-gray-500">// Center modal (default)</span>
                            <div className="text-green-400">openModal(&lt;Content /&gt;)</div>
                        </div>
                        <div className="mt-3">
                            <span className="text-gray-500">// Side modal</span>
                            <div className="text-green-400">openModal(&lt;Content /&gt;, {'{ type: "side" }'})</div>
                        </div>
                        <div className="mt-3">
                            <span className="text-gray-500">// Custom width</span>
                            <div className="text-green-400">openModal(&lt;Content /&gt;, {'{ width: "w-[600px]" }'})</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
