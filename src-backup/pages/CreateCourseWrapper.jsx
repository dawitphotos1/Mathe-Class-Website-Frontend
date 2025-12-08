
// src/pages/CreateCourseWrapper.jsx
import React, { useState } from 'react';
import CreateCourse from './CreateCourse';
import CreateCourseWithUnits from './CreateCourseWithUnits';

const CreateCourseWrapper = () => {
  const [creationMode, setCreationMode] = useState('simple'); // 'simple' or 'advanced'

  return (
    <div className="create-course-wrapper">
      <div className="creation-mode-selector">
        <h2>Choose Creation Method</h2>
        <div className="mode-buttons">
          <button 
            className={`mode-btn ${creationMode === 'simple' ? 'active' : ''}`}
            onClick={() => setCreationMode('simple')}
          >
            🚀 Simple Course
          </button>
          <button 
            className={`mode-btn ${creationMode === 'advanced' ? 'active' : ''}`}
            onClick={() => setCreationMode('advanced')}
          >
            🎯 Advanced Course with Units
          </button>
        </div>
        
        <div className="mode-description">
          {creationMode === 'simple' ? (
            <p>Quickly create a course and add units/lessons later</p>
          ) : (
            <p>Create complete course structure with custom URLs for everything</p>
          )}
        </div>
      </div>

      {creationMode === 'simple' ? <CreateCourse /> : <CreateCourseWithUnits />}
    </div>
  );
};

export default CreateCourseWrapper;