import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Upload,
  Users,
  CheckCircle,
  AlertCircle,
  Loader,
  Home,
  ArrowLeft,
} from "lucide-react";
import { logActivity, ACTIVITY_TYPES } from "../utils/activityLogger";

const ApplicationForm = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    contactNumber: "",
    positionAppliedFor: "",
    referralName: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [completedFields, setCompletedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const positionOptions = [
    {
      value: "Financial Advisor",
      icon: "💼",
      description: "Help clients achieve their financial goals",
    },
    {
      value: "Unit Head Associate",
      icon: "🎯",
      description: "Lead and manage financial advisory teams",
    },
    {
      value: "Branch Head",
      icon: "👑",
      description: "Oversee branch operations and strategy",
    },
  ];

  const steps = [
    {
      id: 1,
      title: "Personal Info",
      fields: ["fullName", "emailAddress", "contactNumber"],
    },
    {
      id: 2,
      title: "Position & Resume",
      fields: ["positionAppliedFor", "resume"],
    },
    { id: 3, title: "Final Details", fields: ["referralName"] },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear existing errors for this field
    setFieldErrors({
      ...fieldErrors,
      [name]: "",
    });
    
    // Validation for fullName - only letters and spaces, minimum 3 letters
    if (name === 'fullName') {
      const lettersOnly = /^[a-zA-Z\s]*$/;
      if (!lettersOnly.test(value)) {
        return; // Don't update if invalid characters
      }
      
      // Check minimum length (excluding spaces)
      const lettersCount = value.replace(/\s/g, '').length;
      if (value.length > 0 && lettersCount < 3) {
        setFieldErrors({
          ...fieldErrors,
          [name]: "Name must contain at least 3 letters",
        });
      }
    }
    
    // Validation for emailAddress - must be a valid email format
    if (name === 'emailAddress') {
      // Basic email validation pattern
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (value.length > 0 && !emailPattern.test(value)) {
        setFieldErrors({
          ...fieldErrors,
          [name]: "Please enter a valid email address",
        });
      }
    }
    
    // Validation for contactNumber - only 11 digits
    if (name === 'contactNumber') {
      const numbersOnly = /^[0-9]*$/;
      if (!numbersOnly.test(value) || value.length > 11) {
        return; // Don't update if invalid characters or more than 11 digits
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Mark field as completed if it has value and meets requirements
    const isCompleted = () => {
      if (name === 'contactNumber') {
        return value.length === 11;
      }
      if (name === 'fullName') {
        const lettersCount = value.replace(/\s/g, '').length;
        return lettersCount >= 3;
      }
      if (name === 'emailAddress') {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(value);
      }
      return value.length > 0;
    };
    
    setCompletedFields({
      ...completedFields,
      [name]: isCompleted(),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setCompletedFields({
      ...completedFields,
      resume: !!file,
    });
  };

  const getStepProgress = (step) => {
    if (currentStep !== step) return 0; // Only show progress for current step
    const stepFields = steps.find((s) => s.id === step)?.fields || [];
    const completed = stepFields.filter((field) => {
      if (field === "resume") {
        // Resume not required for Financial Advisor
        if (formData.positionAppliedFor === "Financial Advisor") return true;
        return !!resumeFile;
      }
      if (field === "referralName") return true; // Optional field
      return completedFields[field];
    }).length;
    return Math.round((completed / stepFields.length) * 100);
  };

  const canProceedToStep = (step) => {
    if (step <= 1) return true;
    const prevStep = steps.find((s) => s.id === step - 1);
    let requiredFields = prevStep.fields.filter(
      (field) => field !== "referralName"
    );

    // Resume not required for Financial Advisor
    if (formData.positionAppliedFor === "Financial Advisor") {
      requiredFields = requiredFields.filter((field) => field !== "resume");
    }

    return requiredFields.every((field) => completedFields[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("emailAddress", formData.emailAddress);
      submitData.append("contactNumber", formData.contactNumber);
      submitData.append("positionAppliedFor", formData.positionAppliedFor);
      submitData.append("referralName", formData.referralName);

      if (resumeFile) {
        submitData.append("resume", resumeFile);
      }

      const res = await fetch(`${API_BASE}/api/Applications`, {
        method: 'POST',
        body: submitData,
      });

      const result = await res.json().catch(() => ({ success: false, message: 'Invalid server response' }));

      if (!res.ok || !result.success) {
        throw new Error(result.message || `Request failed with status ${res.status}`);
      }

      // Log application submission (anonymous user)
      try {
        await logActivity(
          ACTIVITY_TYPES.CREATE,
          `New application submitted: ${formData.fullName} for ${formData.positionAppliedFor}${formData.referralName ? ` (Referred by: ${formData.referralName})` : ''}`,
          { id: 'anonymous', email: formData.emailAddress },
          { firstName: formData.fullName.split(' ')[0], lastName: formData.fullName.split(' ').slice(1).join(' '), role: 'Applicant' }
        );
      } catch (logError) {
        console.error('Failed to log application activity:', logError);
      }

      setIsSubmitted(true);
      // Clear form data
      setFormData({
        fullName: "",
        emailAddress: "",
        contactNumber: "",
        positionAppliedFor: "",
        referralName: "",
      });
      setResumeFile(null);
      setCompletedFields({});
      setCurrentStep(1);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step.id
                ? "bg-gradient-to-r from-green-500 to-emerald-600 border-transparent text-white"
                : "border-gray-300 text-gray-400"
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircle size={20} />
            ) : (
              <span className="font-semibold">{step.id}</span>
            )}
          </div>
          <div className="ml-3">
            <div
              className={`text-sm font-medium ${
                currentStep >= step.id ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.title}
            </div>
            <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-1 rounded-full transition-all duration-500"
                style={{ width: `${getStepProgress(step.id)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderThankYouPage = () => (
    <div className="text-center animate-fadeIn">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          Thank You!
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Your application has been submitted successfully
        </p>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">
            What happens next?
          </h3>
          <div className="text-left space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-gray-700">
                Our HR team will review your application within 2-3 business
                days
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-gray-700">
                If shortlisted, we'll contact you via email or phone
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <span className="text-gray-700">
                We'll schedule an interview to discuss your qualifications
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setMessage("");
            }}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Submit Another Application
          </button>
          <button
            onClick={() => {
              // Replace with your actual home page navigation
              window.location.href = "/";
            }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Let's get to know you
        </h3>
        <p className="text-gray-600">
          Tell us a bit about yourself to get started
        </p>
      </div>

      <div className="relative">
        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Full Name (minimum 3 letters)"
          required
          pattern="[a-zA-Z\s]+"
          title="Please enter only letters and spaces, minimum 3 letters"
          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-0 transition-all duration-200 text-gray-700 placeholder-gray-400 ${
            fieldErrors.fullName 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-green-500'
          }`}
        />
        {completedFields.fullName && !fieldErrors.fullName && (
          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
        )}
        {fieldErrors.fullName && (
          <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
        )}
      </div>
      {fieldErrors.fullName && (
        <div className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {fieldErrors.fullName}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="email"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleInputChange}
          placeholder="Email Address"
          required
          pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address"
          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-0 transition-all duration-200 text-gray-700 placeholder-gray-400 ${
            fieldErrors.emailAddress 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-green-500'
          }`}
        />
        {completedFields.emailAddress && !fieldErrors.emailAddress && (
          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
        )}
        {fieldErrors.emailAddress && (
          <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
        )}
      </div>
      {fieldErrors.emailAddress && (
        <div className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {fieldErrors.emailAddress}
        </div>
      )}

      <div className="relative">
        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          placeholder="Contact Number"
          required
          pattern="[0-9]{11}"
          title="Please enter exactly 11 digits"
          maxLength="11"
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-200 text-gray-700 placeholder-gray-400"
        />
        {completedFields.contactNumber && (
          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Choose your path
        </h3>
        <p className="text-gray-600">
          Select the position that excites you most
        </p>
      </div>

      <div className="space-y-4">
        {positionOptions.map((position) => (
          <div
            key={position.value}
            onClick={() =>
              handleInputChange({
                target: { name: "positionAppliedFor", value: position.value },
              })
            }
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
              formData.positionAppliedFor === position.value
                ? "border-green-500 bg-green-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-4">{position.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {position.value}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {position.description}
                </p>
              </div>
              {formData.positionAppliedFor === position.value && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {formData.positionAppliedFor !== "Financial Advisor" && (
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Your Resume{" "}
            {formData.positionAppliedFor && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
              resumeFile
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload
              className={`mx-auto h-8 w-8 mb-2 ${
                resumeFile ? "text-green-500" : "text-gray-400"
              }`}
            />
            {resumeFile ? (
              <div>
                <p className="text-sm font-medium text-green-700">
                  File uploaded successfully!
                </p>
                <p className="text-xs text-green-600 mt-1">{resumeFile.name}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Drop your resume here or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, DOC, or DOCX files only
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {formData.positionAppliedFor === "Financial Advisor" && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-700">
            <CheckCircle className="inline h-4 w-4 mr-2" />
            Resume upload is not required for Financial Advisor position.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Almost done!</h3>
        <p className="text-gray-600">Just one more optional detail</p>
      </div>

      <div className="relative">
        <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          name="referralName"
          value={formData.referralName}
          onChange={handleInputChange}
          placeholder="Referral Name (Optional)"
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-200 text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mt-8">
        <h4 className="font-semibold text-gray-800 mb-3">
          Application Summary
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{formData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{formData.emailAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Position:</span>
            <span className="font-medium">{formData.positionAppliedFor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Resume:</span>
            <span className="font-medium">
              {resumeFile ? resumeFile.name : "Not uploaded"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600">
            Start your journey with us today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isSubmitted ? (
            <>
              {renderStepIndicator()}

              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center ${
                    message.includes("Error")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {message.includes("Error") ? (
                    <AlertCircle className="h-5 w-5 mr-3" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-3" />
                  )}
                  {message}
                </div>
              )}

              <div className="min-h-[400px]">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                <div className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </div>

                {currentStep < steps.length ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceedToStep(currentStep + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            renderThankYouPage()
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ApplicationForm;
