// src/pages/teachers/CreateCourseAdvanced.jsx
import React, { useState } from "react";
import axiosInstance from '../../utils/axiosInstance';
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const CreateCourseAdvanced = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const addUnit = () => {
    setUnits([
      ...units,
      {
        id: Date.now(),
        title: "",
        description: "",
        lessons: [],
      },
    ]);
  };

  const addLesson = (unitId) => {
    setUnits(
      units.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              lessons: [
                ...unit.lessons,
                {
                  id: Date.now(),
                  title: "",
                  content: "",
                  video_url: "",
                  file_url: "",
                  is_preview: false,
                },
              ],
            }
          : unit
      )
    );
  };

  const updateUnitField = (unitId, field, value) => {
    setUnits(units.map((unit) => (unit.id === unitId ? { ...unit, [field]: value } : unit)));
  };

  const updateLessonField = (unitId, lessonId, field, value) => {
    setUnits(
      units.map((unit) =>
        unit.id === unitId
          ? { ...unit, lessons: unit.lessons.map((l) => (l.id === lessonId ? { ...l, [field]: value } : l)) }
          : unit
      )
    );
  };

  const removeUnit = (unitId) => setUnits(units.filter((u) => u.id !== unitId));
  const removeLesson = (unitId, lessonId) => {
    setUnits(units.map((unit) => (unit.id === unitId ? { ...unit, lessons: unit.lessons.filter((l) => l.id !== lessonId) } : unit)));
  };

  const handleSubmit = async () => {
    if (!title || !description || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);

      if (thumbnail) formData.append("thumbnail", thumbnail);

      formData.append("units", JSON.stringify(units));

      // Backend route used in your earlier code: /api/courses/create-with-units
      const res = await axiosInstance.post("/api/courses/create-with-units", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created successfully!");
      setUnits([]);
      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-10 py-10">
      <h1 className="text-3xl font-bold mb-6">Create Course (Advanced)</h1>

      {loading && <Loading />}

      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <label className="font-semibold block mb-2">Course Title:</label>
        <input type="text" className="input mb-4" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="font-semibold block mb-2">Description:</label>
        <textarea className="input mb-4" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="font-semibold block mb-2">Price:</label>
        <input type="number" className="input mb-4" value={price} onChange={(e) => setPrice(e.target.value)} />

        <label className="font-semibold block mb-2">Thumbnail:</label>
        <input type="file" className="mb-4" onChange={(e) => setThumbnail(e.target.files[0])} />
      </div>

      <h2 className="text-2xl font-bold mb-4">Units</h2>

      {units.map((unit) => (
        <div key={unit.id} className="bg-gray-100 p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Unit</h3>
            <button className="text-red-600" onClick={() => removeUnit(unit.id)}>Remove Unit</button>
          </div>

          <label className="block mt-4">Unit Title:</label>
          <input className="input" value={unit.title} onChange={(e) => updateUnitField(unit.id, "title", e.target.value)} />

          <label className="block mt-4">Unit Description:</label>
          <textarea className="input" rows={4} value={unit.description} onChange={(e) => updateUnitField(unit.id, "description", e.target.value)} />

          <h4 className="text-lg mt-6 font-semibold">Lessons</h4>

          {unit.lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white p-4 rounded mt-4 shadow">
              <div className="flex justify-between">
                <strong>Lesson</strong>
                <button className="text-red-600" onClick={() => removeLesson(unit.id, lesson.id)}>Remove Lesson</button>
              </div>

              <label className="block mt-2">Lesson Title:</label>
              <input className="input" value={lesson.title} onChange={(e) => updateLessonField(unit.id, lesson.id, "title", e.target.value)} />

              <label className="block mt-2">Content (HTML allowed):</label>
              <textarea className="input" rows={4} value={lesson.content} onChange={(e) => updateLessonField(unit.id, lesson.id, "content", e.target.value)} />

              <label className="block mt-2">Video URL:</label>
              <input className="input" value={lesson.video_url} onChange={(e) => updateLessonField(unit.id, lesson.id, "video_url", e.target.value)} />

              <label className="block mt-2">File URL:</label>
              <input className="input" value={lesson.file_url} onChange={(e) => updateLessonField(unit.id, lesson.id, "file_url", e.target.value)} />

              <label className="block mt-2 flex items-center gap-2">
                <input type="checkbox" checked={lesson.is_preview} onChange={(e) => updateLessonField(unit.id, lesson.id, "is_preview", e.target.checked)} />
                Mark as Free Preview
              </label>
            </div>
          ))}

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => addLesson(unit.id)}>+ Add Lesson</button>
        </div>
      ))}

      <button className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4" onClick={addUnit}>+ Add Unit</button>

      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-6 w-full" onClick={handleSubmit}>Create Course</button>
    </div>
  );
};

export default CreateCourseAdvanced;
