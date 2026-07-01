import React from 'react';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Profile</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="space-y-6">
          <div className="pb-6 border-b">
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="text-2xl font-bold text-gray-800">{user?.name || 'N/A'}</p>
          </div>

          <div className="pb-6 border-b">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-xl text-gray-800">{user?.email || 'N/A'}</p>
          </div>

          <div className="pb-6 border-b">
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="text-xl text-gray-800">{user?.phone || 'N/A'}</p>
          </div>

          <div className="pb-6 border-b">
            <p className="text-gray-600 text-sm">Account Status</p>
            <p className="text-xl text-green-600 font-semibold">Active</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Member Since</p>
            <p className="text-xl text-gray-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
