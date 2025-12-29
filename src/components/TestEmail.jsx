
// // src/components/TestEmail.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const TestEmail = () => {
//   const [loading, setLoading] = useState(false);
//   const [configLoading, setConfigLoading] = useState(false);
//   const [result, setResult] = useState('');
//   const [config, setConfig] = useState(null);
//   const [formData, setFormData] = useState({
//     to: 'test@example.com',
//     subject: 'Test Email from Math Class',
//     message: 'This is a test email to verify email configuration.'
//   });

//   const testEmail = async () => {
//     setLoading(true);
//     setResult('');
//     try {
//       const response = await axios.post('https://mathe-class-website-backend-1.onrender.com/api/v1/test-email', formData);
//       setResult(`✅ SUCCESS: ${JSON.stringify(response.data, null, 2)}`);
//     } catch (error) {
//       setResult(`❌ ERROR: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkConfig = async () => {
//     setConfigLoading(true);
//     try {
//       const response = await axios.get('https://mathe-class-website-backend-1.onrender.com/api/v1/test-email/config');
//       setConfig(response.data);
//     } catch (error) {
//       setResult(`❌ Config Check Failed: ${error.message}`);
//     } finally {
//       setConfigLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px', background: '#f8f9fa' }}>
//       <h3>🔧 Email Configuration Test</h3>
      
//       <button onClick={checkConfig} disabled={configLoading} style={{ marginBottom: '15px', marginRight: '10px' }}>
//         {configLoading ? 'Checking...' : 'Check Email Config'}
//       </button>

//       {config && (
//         <div style={{ marginBottom: '20px', padding: '10px', background: 'white', borderRadius: '5px' }}>
//           <h4>📋 Configuration Status:</h4>
//           <pre>{JSON.stringify(config, null, 2)}</pre>
//         </div>
//       )}

//       <div style={{ marginBottom: '15px' }}>
//         <input
//           name="to"
//           value={formData.to}
//           onChange={handleChange}
//           placeholder="Recipient email"
//           style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//         />
//         <input
//           name="subject"
//           value={formData.subject}
//           onChange={handleChange}
//           placeholder="Email subject"
//           style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//         />
//         <textarea
//           name="message"
//           value={formData.message}
//           onChange={handleChange}
//           placeholder="Email message"
//           style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '60px' }}
//         />
//       </div>

//       <button onClick={testEmail} disabled={loading} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
//         {loading ? 'Sending Test Email...' : 'Send Test Email'}
//       </button>

//       {result && (
//         <pre style={{ 
//           marginTop: '15px', 
//           padding: '10px', 
//           background: result.includes('✅') ? '#d4edda' : '#f8d7da',
//           border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
//           borderRadius: '4px',
//           whiteSpace: 'pre-wrap'
//         }}>
//           {result}
//         </pre>
//       )}

//       <div style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
//         <strong>💡 Tips:</strong>
//         <ul>
//           <li>Use a real email address to test delivery</li>
//           <li>Check spam folder if email doesn't arrive</li>
//           <li>Yahoo requires App Password (not regular password)</li>
//           <li>Enable 2-factor authentication in Yahoo account</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TestEmail;






// src/components/TestEmail.jsx - UPDATED VERSION
import React, { useState } from 'react';
import axios from 'axios';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [result, setResult] = useState('');
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({
    to: 'greenw17@yahoo.com', // Use your admin email as default
    subject: '🧪 Test Email from Math Class Platform',
    message: 'This is a test email to verify email configuration is working.'
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mathe-class-website-backend-1.onrender.com/api/v1';

  const testEmail = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await axios.post(`${API_BASE_URL}/test-email`, formData);
      setResult(`✅ SUCCESS: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`❌ ERROR: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkConfig = async () => {
    setConfigLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/test-email/config`);
      setConfig(response.data);
    } catch (error) {
      setResult(`❌ Config Check Failed: ${error.message}`);
    } finally {
      setConfigLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      margin: '20px', 
      borderRadius: '8px', 
      background: '#f8f9fa',
      maxWidth: '800px'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔧 Email Configuration Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkConfig} 
          disabled={configLoading}
          style={{ 
            padding: '10px 15px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {configLoading ? 'Checking...' : '📋 Check Email Config'}
        </button>
        
        <button 
          onClick={() => window.open('https://mail.yahoo.com', '_blank')}
          style={{ 
            padding: '10px 15px',
            background: '#720e9e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📨 Open Yahoo Mail
        </button>
      </div>

      {config && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          background: 'white', 
          borderRadius: '5px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ color: '#495057', marginTop: 0 }}>📊 Configuration Status:</h4>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '14px',
            overflow: 'auto'
          }}>
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Recipient Email:
          </label>
          <input
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="Enter email address"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Subject:
          </label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Email subject"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Message:
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Email message"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      <button 
        onClick={testEmail} 
        disabled={loading}
        style={{ 
          background: '#28a745', 
          color: 'white', 
          border: 'none', 
          padding: '12px 24px', 
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        {loading ? '📤 Sending Test Email...' : '🚀 Send Test Email'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <h4 style={{ 
            marginTop: 0, 
            color: result.includes('✅') ? '#155724' : '#721c24' 
          }}>
            {result.includes('✅') ? '✅ Test Result' : '❌ Test Result'}
          </h4>
          <pre style={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '14px',
            margin: 0
          }}>
            {result}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '4px' }}>
        <h5 style={{ marginTop: 0, color: '#004085' }}>💡 Testing Tips:</h5>
        <ul style={{ marginBottom: 0, fontSize: '14px' }}>
          <li>Use <strong>greenw17@yahoo.com</strong> as the recipient</li>
          <li>Check both inbox and spam folder</li>
          <li>Gmail SMTP requires "App Password" not regular password</li>
          <li>Enable 2-factor authentication in Gmail account first</li>
          <li>Allow less secure apps in Gmail settings (if not using app password)</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEmail;