// src/hooks/useLessons.js
import { useState, useEffect, useCallback } from "react";
import { getCachedLessons, clearLessonCache } from "../utils/api";

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
      console.error("Error in useLessons hook:", err);
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
  };
};