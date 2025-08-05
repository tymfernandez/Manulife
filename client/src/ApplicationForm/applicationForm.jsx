import { useState } from 'react';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    contactNumber: '',
    positionAppliedFor: '',
    referralName: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const positionOptions = [
    'Financial Advisor',
    'Unit Head Associate', 
    'Branch Head'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('emailAddress', formData.emailAddress);
      submitData.append('contactNumber', formData.contactNumber);
      submitData.append('positionAppliedFor', formData.positionAppliedFor);
      submitData.append('referralName', formData.referralName);
      
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      const response = await fetch('http://localhost:3000/api/Applications', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Application submitted successfully!');
        setFormData({
          fullName: '',
          emailAddress: '',
          contactNumber: '',
          positionAppliedFor: '',
          referralName: ''
        });
        setResumeFile(null);
        e.target.reset();
      } else {
        setMessage(`Error: ${result.message}`);
      }
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Application Form</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number *
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position Applied For *
          </label>
          <select
            name="positionAppliedFor"
            value={formData.positionAppliedFor}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a position</option>
            {positionOptions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resume Upload
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referral Name
          </label>
          <input
            type="text"
            name="referralName"
            value={formData.referralName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;