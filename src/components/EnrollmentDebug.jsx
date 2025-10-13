// Create this file: src/components/EnrollmentDebug.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EnrollmentDebug = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEnrollments = async (status = 'pending') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/admin/enrollments?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('🔍 FRONTEND: API Response:', data);
      
      if (data.success) {
        setEnrollments(data.enrollments || []);
      } else {
        setError(data.error || 'Failed to fetch enrollments');
      }
    } catch (err) {
      console.error('❌ FRONTEND: API Call failed:', err);
      setError('API call failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEnrollments('pending');
    }
  }, [user]);

  return (
    <div style={{ padding: '20px', border: '2px solid red', margin: '10px' }}>
      <h3>🎯 ENROLLMENT DEBUG COMPONENT</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => fetchEnrollments('pending')} style={{ margin: '5px' }}>
          Load Pending Enrollments
        </button>
        <button onClick={() => fetchEnrollments('approved')} style={{ margin: '5px' }}>
          Load Approved Enrollments
        </button>
        <button onClick={() => fetchEnrollments('')} style={{ margin: '5px' }}>
          Load All Enrollments
        </button>
      </div>

      {loading && <p>⏳ Loading enrollments...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}

      <div>
        <h4>Enrollments Found: {enrollments.length}</h4>
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            <p><strong>Enrollment ID:</strong> {enrollment.id}</p>
            <p><strong>Student:</strong> {enrollment.student?.name} ({enrollment.student?.email})</p>
            <p><strong>Course:</strong> {enrollment.course?.title}</p>
            <p><strong>Payment Status:</strong> {enrollment.payment_status}</p>
            <p><strong>Approval Status:</strong> {enrollment.approval_status}</p>
            <p><strong>Created:</strong> {new Date(enrollment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {enrollments.length === 0 && !loading && (
        <p>📭 No enrollments found with current filters</p>
      )}
    </div>
  );
};

export default EnrollmentDebug;