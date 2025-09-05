import { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useActivityLogger } from '../hooks/useActivityLogger';

const RecruitmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("Position");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [dateFilter, setDateFilter] = useState("Date");
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { logEdit, logDelete } = useActivityLogger();

  const positions = ["Branch Head", "Unit Head", "Unit Head Associate", "Financial Advisor"];
  const statuses = ["Interview", "Life Champion Event", "Exam passed (Trad)", "Exam passed (VL)", "Jump Start Program (JSP)", "eRecruitment", "Tagged/Appointed"];
  const dateOptions = ["Last 7 days", "Last 30 days", "Last 90 days"];
  const rowOptions = [5, 10, 15, 20];

  const [recruits, setRecruits] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRecruits();
    }, 100); // Debounce initial load
    
    return () => clearTimeout(timeoutId);
  }, []);

  const fetchRecruits = async () => {
    try {
      
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/recruitment`, {
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      
      const processedData = result.data.map(recruit => ({
        id: recruit.id,
        fullName: recruit.full_name,
        email: recruit.email_address,
        position: recruit.position_applied_for,
        status: recruit.status || recruit.application_status || 'Interview',
        date: recruit.created_at,
        lastEdited: recruit.updated_at || recruit.created_at,
        daysOld: Math.floor((new Date() - new Date(recruit.created_at)) / (1000 * 60 * 60 * 24)),
        daysLastEdited: Math.floor((new Date() - new Date(recruit.updated_at || recruit.created_at)) / (1000 * 60 * 60 * 24)),
        referralName: recruit.referral_name || '',
        resumeUrl: recruit.resume_url
      }));
      setRecruits(processedData);
    } catch (error) {
      setSampleData();
    }
  };

  const setSampleData = () => {
    setRecruits([
    {
      id: 1,
      fullName: "Arthur Pendragon",
      email: "arthur.pendragon@email.com",
      position: "Region Head",
      status: "Interview",
      date: "2025-07-30",
      lastEdited: "2025-08-01",
      daysOld: 7,
      daysLastEdited: 5,
      referralCode: "John Smith"
    },
    {
      id: 2,
      fullName: "Gil Archer",
      email: "gil.archer@email.com",
      position: "Region Head",
      status: "Life Champion Event",
      date: "2025-07-31",
      lastEdited: "2025-08-02",
      daysOld: 6,
      daysLastEdited: 4,
      referralCode: "Maria Garcia"
    },
    {
      id: 3,
      fullName: "Saber Altria",
      email: "saber.altria@email.com",
      position: "Branch Leader",
      status: "Pending",
      date: "2025-08-01",
      lastEdited: "2025-08-01",
      daysOld: 5,
      daysLastEdited: 5,
      referralCode: ""
    },
    {
      id: 4,
      fullName: "Lancer Cu",
      email: "lancer.cu@email.com",
      position: "Unit Head",
      status: "Approved",
      date: "2025-08-02",
      lastEdited: "2025-08-03",
      daysOld: 4,
      daysLastEdited: 3,
      referralCode: "David Lee"
    },
    {
      id: 5,
      fullName: "Archer Emiya",
      email: "archer.emiya@email.com",
      position: "Financial Advisor",
      status: "Rejected",
      date: "2025-08-03",
      lastEdited: "2025-08-03",
      daysOld: 3,
      daysLastEdited: 3,
      referralCode: ""
    },
    {
      id: 6,
      fullName: "Rider Medusa",
      email: "rider.medusa@email.com",
      position: "Branch Leader",
      status: "Interview",
      date: "2025-08-04",
      lastEdited: "2025-08-05",
      daysOld: 2,
      daysLastEdited: 1,
      referralCode: "Sarah Johnson"
    },
    {
      id: 7,
      fullName: "Caster Merlin",
      email: "caster.merlin@email.com",
      position: "Unit Head",
      status: "Life Champion Event",
      date: "2025-08-05",
      lastEdited: "2025-08-05",
      daysOld: 1,
      daysLastEdited: 1,
      referralCode: ""
    },
    {
      id: 8,
      fullName: "Assassin Hassan",
      email: "assassin.hassan@email.com",
      position: "Financial Advisor",
      status: "Pending",
      date: "2025-07-29",
      lastEdited: "2025-07-30",
      daysOld: 8,
      daysLastEdited: 7,
      referralCode: "Mike Chen"
    },
    {
      id: 9,
      fullName: "Berserker Hercules",
      email: "berserker.hercules@email.com",
      position: "Region Head",
      status: "Approved",
      date: "2025-07-28",
      lastEdited: "2025-07-29",
      daysOld: 9,
      daysLastEdited: 8,
      referralCode: ""
    },
    {
      id: 10,
      fullName: "Ruler Jeanne",
      email: "ruler.jeanne@email.com",
      position: "Financial Advisor",
      status: "Rejected",
      date: "2025-07-27",
      lastEdited: "2025-07-28",
      daysOld: 10,
      daysLastEdited: 9,
      referralCode: "Lisa Wong"
    }
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'Branch Head': return 'bg-purple-100 text-purple-800';
      case 'Unit Head': return 'bg-blue-100 text-blue-800';
      case 'Unit Head Associate': return 'bg-cyan-100 text-cyan-800';
      case 'Financial Advisor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (recruit) => {
    setEditingId(recruit.id);
    setEditData({
      fullName: recruit.fullName,
      email: recruit.email,
      position: recruit.position,
      status: recruit.status,
      referralName: recruit.referralName
    });
  };

  const handleSave = async (id) => {
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/recruitment/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.access_token}`
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          email: editData.email,
          position: editData.position,
          status: editData.status,
          referralName: editData.referralName || ''
        })
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message);

      const updatedRecruit = { 
        ...recruits.find(r => r.id === id), 
        ...editData,
        lastEdited: new Date().toISOString(),
        daysLastEdited: 0
      };
      setRecruits(recruits.map(recruit => 
        recruit.id === id 
          ? updatedRecruit
          : recruit
      ));
      // Log recruitment update
      logEdit('Recruitment Record', `${updatedRecruit.fullName} (${updatedRecruit.position})`);
      setEditingId(null);
      setEditData({});
    } catch (error) {
      // Handle error silently
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async () => {
    const deletedRecruit = recruits.find(r => r.id === deleteId);
    
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/recruitment/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRecruits(recruits.filter(recruit => recruit.id !== deleteId));
        logDelete('Recruitment Record', `${deletedRecruit?.fullName || 'Unknown'}`);
      }
    } catch (error) {
      // Handle error silently
    }
    
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredRecruits = recruits.filter(recruit => {
    const searchMatch = searchTerm === "" || 
      recruit.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruit.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruit.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruit.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const positionMatch = positionFilter === "Position" || recruit.position === positionFilter;
    const statusMatch = statusFilter === "Status" || recruit.status === statusFilter;
    
    let dateMatch = true;
    if (dateFilter !== "Date") {
      const days = dateFilter === "Last 7 days" ? 7 : dateFilter === "Last 30 days" ? 30 : 90;
      dateMatch = recruit.daysOld <= days;
    }
    
    return searchMatch && positionMatch && statusMatch && dateMatch;
  }).sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedAndFilteredRecruits.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRecruits = sortedAndFilteredRecruits.slice(startIndex, startIndex + rowsPerPage);

  const CustomDropdown = ({ value, options, onChange, show, setShow, placeholder }) => (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
      >
        <span className={value === placeholder ? "text-gray-500" : "text-gray-900"}>
          {value}
        </span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 origin-top ${show ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
        {options.map((option) => (
          <div
            key={option}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer last:rounded-b-lg"
            onClick={() => {
              onChange(option);
              setShow(false);
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );

  const [activeItem, setActiveItem] = useState('recruits');

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="flex-1 p-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Recruitment Management</h1>
        
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className={positionFilter === "Position" ? "text-gray-500" : "text-gray-900"}>
                    {positionFilter}
                  </span>
                </div>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 origin-top ${showPositionDropdown ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-t-lg"
                  onClick={() => {
                    setPositionFilter("Position");
                    setShowPositionDropdown(false);
                  }}
                >
                  Position
                </div>
                {positions.map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer last:rounded-b-lg"
                    onClick={() => {
                      setPositionFilter(option);
                      setShowPositionDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center justify-between w-48 px-4 py-2 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className={statusFilter === "Status" ? "text-gray-500" : "text-gray-900"}>
                    {statusFilter}
                  </span>
                </div>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 origin-top ${showStatusDropdown ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-t-lg"
                  onClick={() => {
                    setStatusFilter("Status");
                    setShowStatusDropdown(false);
                  }}
                >
                  Status
                </div>
                {statuses.map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer last:rounded-b-lg"
                    onClick={() => {
                      setStatusFilter(option);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={dateFilter === "Date" ? "text-gray-500" : "text-gray-900"}>
                    {dateFilter}
                  </span>
                </div>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 origin-top ${showDateDropdown ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-t-lg"
                  onClick={() => {
                    setDateFilter("Date");
                    setShowDateDropdown(false);
                  }}
                >
                  Date
                </div>
                {dateOptions.map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer last:rounded-b-lg"
                    onClick={() => {
                      setDateFilter(option);
                      setShowDateDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-x-auto rounded-lg">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-emerald-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-48" onClick={() => handleSort('fullName')}>
                  <div className="flex items-center gap-1">
                    Full Name
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-64" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-1">
                    Email
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-44" onClick={() => handleSort('position')}>
                  <div className="flex items-center gap-1">
                    Position
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-52" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    Status
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-36" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    First Created
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-36" onClick={() => handleSort('lastEdited')}>
                  <div className="flex items-center gap-1">
                    Last Edited
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-24" onClick={() => handleSort('daysOld')}>
                  <div className="flex items-center gap-1">
                    Days Old
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-32" onClick={() => handleSort('daysLastEdited')}>
                  <div className="flex items-center gap-1">
                    Days Last Edited
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase cursor-pointer hover:bg-opacity-80 w-32" onClick={() => handleSort('referralCode')}>
                  <div className="flex items-center gap-1">
                    Referral Name
                    <div className="flex flex-col -space-y-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase w-16">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecruits.map((recruit) => (
                <tr key={recruit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {editingId === recruit.id ? (
                      <input
                        type="text"
                        value={editData.fullName}
                        onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      recruit.fullName
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editingId === recruit.id ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      recruit.email
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      {editingId === recruit.id ? (
                        <select
                          value={editData.position}
                          onChange={(e) => setEditData({...editData, position: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        >
                          {positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(recruit.position)}`}>
                          {recruit.position}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" style={{width: '200px'}}>
                    {editingId === recruit.id ? (
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs overflow-hidden"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs truncate block">{recruit.status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(recruit.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(recruit.lastEdited)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{recruit.daysOld} days</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{recruit.daysLastEdited} days</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingId === recruit.id ? (
                      <input
                        type="text"
                        value={editData.referralName}
                        onChange={(e) => setEditData({...editData, referralName: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        placeholder="Enter name"
                      />
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        recruit.referralName ? 'bg-blue-100 text-blue-800' : 'text-gray-400'
                      }`}>
                        {recruit.referralName || '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {recruit.resumeUrl ? (
                      <a href={recruit.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {editingId === recruit.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(recruit.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(recruit)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(recruit.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <CustomDropdown
              value={rowsPerPage.toString()}
              options={rowOptions.map(String)}
              onChange={(value) => {
                setRowsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
              show={showRowsDropdown}
              setShow={setShowRowsDropdown}
              placeholder="5"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, sortedAndFilteredRecruits.length)} of {sortedAndFilteredRecruits.length} entries
            </span>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ‹
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    currentPage === page
                      ? 'text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                  style={currentPage === page ? {backgroundColor: '#065f46'} : {}}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ›
              </button>
            </div>
          </div>
          </div>
        </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this recruitment record? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentManagement;