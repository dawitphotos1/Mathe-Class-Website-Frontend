
// src/components/TestEmail.jsx
import React, { useState } from 'react';
import axios from 'axios';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [result, setResult] = useState('');
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({
    to: 'test@example.com',
    subject: 'Test Email from Math Class',
    message: 'This is a test email to verify email configuration.'
  });

  const testEmail = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await axios.post('https://mathe-class-website-backend-1.onrender.com/api/v1/test-email', formData);
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
      const response = await axios.get('https://mathe-class-website-backend-1.onrender.com/api/v1/test-email/config');
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
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px', background: '#f8f9fa' }}>
      <h3>🔧 Email Configuration Test</h3>
      
      <button onClick={checkConfig} disabled={configLoading} style={{ marginBottom: '15px', marginRight: '10px' }}>
        {configLoading ? 'Checking...' : 'Check Email Config'}
      </button>

      {config && (
        <div style={{ marginBottom: '20px', padding: '10px', background: 'white', borderRadius: '5px' }}>
          <h4>📋 Configuration Status:</h4>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <input
          name="to"
          value={formData.to}
          onChange={handleChange}
          placeholder="Recipient email"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Email subject"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Email message"
          style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '60px' }}
        />
      </div>

      <button onClick={testEmail} disabled={loading} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
        {loading ? 'Sending Test Email...' : 'Send Test Email'}
      </button>

      {result && (
        <pre style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {result}
        </pre>
      )}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
        <strong>💡 Tips:</strong>
        <ul>
          <li>Use a real email address to test delivery</li>
          <li>Check spam folder if email doesn't arrive</li>
          <li>Yahoo requires App Password (not regular password)</li>
          <li>Enable 2-factor authentication in Yahoo account</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEmail;