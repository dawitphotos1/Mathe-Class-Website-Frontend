// // src/hooks/useLessons.js (Frontend React Hook)
// import { useState, useEffect, useCallback } from "react";
// import { getCachedLessons, clearLessonCache } from "../utils/api";

// export const useLessons = (courseId) => {
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchLessons = useCallback(async () => {
//     if (!courseId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const lessonsData = await getCachedLessons(courseId);
//       setLessons(lessonsData);
//     } catch (err) {
//       setError(err.message);
//       console.error("❌ Error in useLessons hook:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [courseId]);

//   const refreshLessons = useCallback(() => {
//     clearLessonCache(courseId);
//     fetchLessons();
//   }, [courseId, fetchLessons]);

//   useEffect(() => {
//     fetchLessons();
//   }, [fetchLessons]);

//   return {
//     lessons,
//     loading,
//     error,
//     refreshLessons,
//     refetch: refreshLessons,
//   };
// };

// // Hook for single lesson with sublessons
// export const useLessonWithSublessons = (lessonId) => {
//   const [lesson, setLesson] = useState(null);
//   const [sublessons, setSublessons] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchLessonData = useCallback(async () => {
//     if (!lessonId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       // Fetch lesson and sublessons in parallel with throttling
//       const [lessonResponse, sublessonsResponse] = await Promise.all([
//         api.get(`/lessons/${lessonId}`),
//         api.get(`/lessons/${lessonId}/sublessons`),
//       ]);

//       setLesson(lessonResponse.data.lesson);
//       setSublessons(sublessonsResponse.data.sublessons || []);
//     } catch (err) {
//       setError(err.message);
//       console.error("❌ Error fetching lesson with sublessons:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [lessonId]);

//   useEffect(() => {
//     fetchLessonData();
//   }, [fetchLessonData]);

//   return {
//     lesson,
//     sublessons,
//     loading,
//     error,
//     refetch: fetchLessonData,
//   };
// };




// src/hooks/useLessons.js
import { useState, useEffect, useCallback } from 'react';
import { getCachedLessons, clearLessonCache } from '../utils/api';

export const useLessons = (courseId) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const lessonsData = await getCachedLessons(courseId);
      setLessons(lessonsData);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error in useLessons hook:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const refreshLessons = useCallback(() => {
    clearLessonCache(courseId);
    fetchLessons();
  }, [courseId, fetchLessons]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return {
    lessons,
    loading,
    error,
    refreshLessons,
    refetch: refreshLessons
  };
};

// Hook for single lesson with sublessons
export const useLessonWithSublessons = (lessonId) => {
  const [lesson, setLesson] = useState(null);
  const [sublessons, setSublessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessonData = useCallback(async () => {
    if (!lessonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch lesson and sublessons in parallel with throttling
      const [lessonResponse, sublessonsResponse] = await Promise.all([
        api.get(`/lessons/${lessonId}`),
        api.get(`/lessons/${lessonId}/sublessons`)
      ]);
      
      setLesson(lessonResponse.data.lesson);
      setSublessons(sublessonsResponse.data.sublessons || []);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching lesson with sublessons:', err);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

  return {
    lesson,
    sublessons,
    loading,
    error,
    refetch: fetchLessonData
  };
};