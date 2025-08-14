import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const DataExport = () => {
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const exportFormats = ["PDF", "Excel", "CSV", "JSON"];

  return (
    <div className="space-y-6">
      {/* Export Data Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>

        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="font-medium text-gray-900">Export Your Data</h4>
            <p className="text-sm text-gray-500">
              Export All Information And Profile
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Format Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-20 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <span className="text-xs">{selectedFormat}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-20 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {exportFormats.map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        setSelectedFormat(format);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-left hover:bg-gray-100"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
