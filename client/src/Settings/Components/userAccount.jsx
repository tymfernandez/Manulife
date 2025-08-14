import React from "react";

const UserAccount = () => {

  return (
    <>
    <div className="space-y-6">
      {/* Password Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Password Management
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">
                Change Password
              </h4>
              <p className="text-sm text-gray-500">
                Update Your Password Regularly To Keep Your Account Secure.
              </p>
            </div>
            <button 
              onClick={() => alert('Password change functionality')}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">
                Recover Password
              </h4>
              <p className="text-sm text-gray-500">
                Set Up Password Recovery Options For Your Account.
              </p>
            </div>
            <button 
              onClick={() => alert('Recovery setup functionality')}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Configure Recovery
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Two-Factor Authentication
        </h3>

        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="font-medium text-gray-900">
              Enable Two-Factor Authentication
            </h4>
            <p className="text-sm text-gray-500">
              Add An Extra Layer Of Security To Your Account With 2FA.
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-3">Disabled</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>
        </div>
      </div>


    </div>
    <style jsx>{`
      .toggle-checkbox:checked {
        right: 0;
        border-color: #10b981;
        background-color: #10b981;
      }
      .toggle-checkbox {
        transition: all 0.3s ease;
        top: 0;
        left: 0;
      }
      .toggle-label {
        transition: all 0.3s ease;
      }
      .toggle-checkbox:checked + .toggle-label {
        background-color: #10b981;
      }
    `}</style>
    </>
  );
};

export default UserAccount;