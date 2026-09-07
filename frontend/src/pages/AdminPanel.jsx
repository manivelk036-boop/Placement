import { useEffect, useState } from 'react';
import { 
  BookOpen, Video, Plus, Edit2, Trash2, Shield, AlertTriangle, 
  CheckCircle2, ChevronRight, Play, X 
} from 'lucide-react';
import api from '../services/api';

export default function AdminPanel() {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // Note Modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Video Modal state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [orderNo, setOrderNo] = useState(1);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get('/career-goals');
      const list = res.data.data || [];
      setCareers(list);
      if (list.length > 0) {
        selectCareer(list[0]);
      }
    } catch (err) {
      handleError(err, 'Failed to fetch career goals');
    } finally {
      setLoading(false);
    }
  };

  const selectCareer = async (career) => {
    setSelectedCareer(career);
    setSelectedModule(null);
    setSelectedLesson(null);
    setModules([]);
    setLessons([]);
    setNotes([]);
    setVideos([]);
    setErrorMsg(null);

    try {
      const res = await api.get(`/career-goals/${career.id}/modules`);
      const list = res.data.data || [];
      setModules(list);
      if (list.length > 0) {
        selectModule(career.id, list[0]);
      }
    } catch (err) {
      handleError(err, 'Failed to fetch modules');
    }
  };

  const selectModule = async (careerId, moduleItem) => {
    setSelectedModule(moduleItem);
    setSelectedLesson(null);
    setLessons([]);
    setNotes([]);
    setVideos([]);
    setErrorMsg(null);

    try {
      const res = await api.get(`/career-goals/${careerId}/modules/${moduleItem.id}/lessons`);
      const list = res.data.data || [];
      setLessons(list);
      if (list.length > 0) {
        selectLesson(careerId, moduleItem.id, list[0]);
      }
    } catch (err) {
      handleError(err, 'Failed to fetch lessons');
    }
  };

  const selectLesson = async (careerId, moduleId, lessonItem) => {
    setSelectedLesson(lessonItem);
    setErrorMsg(null);
    fetchLessonContent(careerId, moduleId, lessonItem.id);
  };

  const fetchLessonContent = async (careerId, moduleId, lessonId) => {
    try {
      const [notesRes, videosRes] = await Promise.all([
        api.get(`/career-goals/${careerId}/modules/${moduleId}/lessons/${lessonId}/notes`),
        api.get(`/career-goals/${careerId}/modules/${moduleId}/lessons/${lessonId}/videos`)
      ]);
      setNotes(notesRes.data.data || []);
      setVideos(videosRes.data.data || []);
    } catch (err) {
      handleError(err, 'Failed to fetch lesson content');
    }
  };

  const handleError = (err, defaultMsg) => {
    if (err.response?.status === 403) {
      setErrorMsg('Access Denied: You must be an Administrator (ROLE_ADMIN) to perform this action.');
    } else if (err.response?.data?.message) {
      setErrorMsg(err.response.data.message);
    } else {
      setErrorMsg(defaultMsg);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // ==========================================
  // NOTE CRUD HANDLERS
  // ==========================================

  const openAddNoteModal = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(true);
  };

  const openEditNoteModal = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setShowNoteModal(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!selectedCareer || !selectedModule || !selectedLesson) return;
    setErrorMsg(null);

    const payload = { title: noteTitle, content: noteContent };
    const { id: cId } = selectedCareer;
    const { id: mId } = selectedModule;
    const { id: lId } = selectedLesson;

    try {
      if (editingNote) {
        await api.put(`/admin/lms/career-goals/${cId}/modules/${mId}/lessons/${lId}/notes/${editingNote.id}`, payload);
        showNotification('Note updated successfully!');
      } else {
        await api.post(`/admin/lms/career-goals/${cId}/modules/${mId}/lessons/${lId}/notes`, payload);
        showNotification('Note created successfully!');
      }
      setShowNoteModal(false);
      fetchLessonContent(cId, mId, lId);
    } catch (err) {
      handleError(err, 'Failed to save note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    const { id: cId } = selectedCareer;
    const { id: mId } = selectedModule;
    const { id: lId } = selectedLesson;

    try {
      await api.delete(`/admin/lms/career-goals/${cId}/modules/${mId}/lessons/${lId}/notes/${noteId}`);
      showNotification('Note deleted successfully');
      fetchLessonContent(cId, mId, lId);
    } catch (err) {
      handleError(err, 'Failed to delete note');
    }
  };

  // ==========================================
  // VIDEO CRUD HANDLERS
  // ==========================================

  const openAddVideoModal = () => {
    setEditingVideo(null);
    setVideoTitle('');
    setYoutubeUrl('');
    setDurationMinutes(15);
    setOrderNo(videos.length + 1);
    setShowVideoModal(true);
  };

  const openEditVideoModal = (vid) => {
    setEditingVideo(vid);
    setVideoTitle(vid.title);
    setYoutubeUrl(vid.youtubeUrl);
    setDurationMinutes(vid.durationMinutes || 15);
    setOrderNo(vid.orderNo || 1);
    setShowVideoModal(true);
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!selectedCareer || !selectedModule || !selectedLesson) return;
    setErrorMsg(null);

    const payload = {
      title: videoTitle,
      youtubeUrl,
      durationMinutes: parseInt(durationMinutes, 10),
      orderNo: parseInt(orderNo, 10)
    };
    const { id: cId } = selectedCareer;
    const { id: mId } = selectedModule;
    const { id: lId } = selectedLesson;

    try {
      if (editingVideo) {
        await api.put(`/admin/lms/career-goals/${cId}/modules/${mId}/lessons/${lId}/videos/${editingVideo.id}`, payload);
        showNotification('Video updated successfully!');
      } else {
        await api.post(`/admin/lms/career-goals/${cId}/modules/${mId}/lessons/${lId}/videos`, payload);
        showNotification('Video added successfully!');
      }
      setShowVideoModal(false);
      fetchLessonContent(cId, mId, lId);
    } catch (err) {
      handleError(err, 'Failed to save video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    const { id: cId } = selectedCareer;
    const { id: mId } = selectedModule;
    const { id: lId } = selectedLesson;

    try {
      await api.delete(`/admin/lms/career-goals/${cId}/modules/${mId}/lessons/${lId}/videos/${videoId}`);
      showNotification('Video deleted successfully');
      fetchLessonContent(cId, mId, lId);
    } catch (err) {
      handleError(err, 'Failed to delete video');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-indigo-400" />
            <h1 className="text-3xl font-extrabold text-white">LMS Admin Panel</h1>
          </div>
          <p className="mt-1 text-slate-400">
            Manage Notes and YouTube Videos across the strict Career → Module → Lesson hierarchy.
          </p>
        </div>
      </div>

      {/* Error / Success Notifications */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div className="font-medium">{successMsg}</div>
        </div>
      )}

      {/* 3-Step Selection Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Career Goals */}
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            1. Select Career ({careers.length})
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {careers.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCareer(c)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-sm font-medium ${
                  selectedCareer?.id === c.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="truncate">{c.name}</span>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Modules */}
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            2. Select Module ({modules.length})
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {modules.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3">Select a Career Goal first</p>
            ) : (
              modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectModule(selectedCareer.id, m)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-sm font-medium ${
                    selectedModule?.id === m.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{m.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Step 3: Lessons */}
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            3. Select Lesson ({lessons.length})
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {lessons.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3">Select a Module first</p>
            ) : (
              lessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => selectLesson(selectedCareer.id, selectedModule.id, l)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-sm font-medium ${
                    selectedLesson?.id === l.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{l.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Selected Breadcrumb path */}
      {selectedCareer && selectedModule && selectedLesson && (
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-xl">
          <span>{selectedCareer.name}</span>
          <ChevronRight className="h-3 w-3" />
          <span>{selectedModule.name}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white">{selectedLesson.name}</span>
        </div>
      )}

      {/* Content Management Area: Notes & Videos */}
      {selectedLesson && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notes Management */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <h3>Lesson Notes ({notes.length})</h3>
              </div>
              <button onClick={openAddNoteModal} className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3">
                <Plus className="h-4 w-4" /> Add Note
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No notes created for this lesson yet.
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-white text-sm">{note.title}</h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditNoteModal(note)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos Management */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Video className="h-5 w-5 text-red-400" />
                <h3>YouTube Videos ({videos.length})</h3>
              </div>
              <button onClick={openAddVideoModal} className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3">
                <Plus className="h-4 w-4" /> Add Video
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No YouTube videos attached to this lesson yet.
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((vid) => (
                  <div key={vid.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{vid.title}</h4>
                        <span className="text-[10px] text-slate-400">Order #{vid.orderNo} • {vid.durationMinutes || 0} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditVideoModal(vid)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:underline"
                    >
                      <Play className="h-3.5 w-3.5" /> Watch: {vid.youtubeUrl}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingNote ? 'Edit Note' : 'Add Note'}
              </h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note Title"
                  className="input w-full bg-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content</label>
                <textarea
                  required
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter note content..."
                  className="input w-full bg-slate-800 text-white font-mono text-xs"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-sm px-5">
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingVideo ? 'Edit YouTube Video' : 'Add YouTube Video'}
              </h3>
              <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Java Variables Tutorial"
                  className="input w-full bg-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube URL</label>
                <input
                  type="url"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="input w-full bg-slate-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="input w-full bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order #</label>
                  <input
                    type="number"
                    min="1"
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    className="input w-full bg-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-sm px-5">
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
