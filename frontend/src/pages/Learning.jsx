import { useEffect, useState } from 'react';
import { 
  BookOpen, Video, ChevronRight, Play, FileText, 
  HelpCircle, Layers, CheckCircle2, ChevronDown
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Learning() {
  const { student } = useAuth();
  const [careers, setCareers] = useState([]);
  const [selectedCareerId, setSelectedCareerId] = useState(null);
  
  const [modules, setModules] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState(null);
  
  const [lessonsMap, setLessonsMap] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'videos' | 'quizzes'

  useEffect(() => {
    fetchCareerGoals();
  }, []);

  const fetchCareerGoals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/career-goals');
      const list = res.data.data || [];
      setCareers(list);
      
      // Default to student's goal or first goal
      let initialCareer = list[0];
      if (student?.careerGoal) {
        const goalStr = student.careerGoal.replace(/_/g, ' ').toLowerCase();
        const matched = list.find(c => c.name.toLowerCase() === goalStr || c.name.toLowerCase().includes(goalStr));
        if (matched) initialCareer = matched;
      }
      if (initialCareer) {
        selectCareer(initialCareer.id);
      }
    } catch (err) {
      console.error('Failed to load career goals', err);
    } finally {
      setLoading(false);
    }
  };

  const selectCareer = async (careerId) => {
    setSelectedCareerId(careerId);
    setModules([]);
    setActiveModuleId(null);
    setLessonsMap({});
    setActiveLesson(null);
    setNotes([]);
    setVideos([]);
    setQuizzes([]);

    try {
      const res = await api.get(`/career-goals/${careerId}/modules`);
      const modList = res.data.data || [];
      setModules(modList);
      if (modList.length > 0) {
        toggleModule(careerId, modList[0].id);
      }
    } catch (err) {
      console.error('Failed to load modules', err);
    }
  };

  const toggleModule = async (careerId, moduleId) => {
    if (activeModuleId === moduleId) {
      // Accordion toggle
      setActiveModuleId(null);
      return;
    }
    setActiveModuleId(moduleId);

    // Fetch lessons for module if not already loaded
    if (!lessonsMap[moduleId]) {
      try {
        const res = await api.get(`/career-goals/${careerId}/modules/${moduleId}/lessons`);
        const lessonList = res.data.data || [];
        setLessonsMap(prev => ({ ...prev, [moduleId]: lessonList }));
        if (lessonList.length > 0 && !activeLesson) {
          selectLesson(careerId, moduleId, lessonList[0]);
        }
      } catch (err) {
        console.error('Failed to load lessons', err);
      }
    } else if (lessonsMap[moduleId]?.length > 0 && (!activeLesson || activeLesson.moduleId !== moduleId)) {
      selectLesson(careerId, moduleId, lessonsMap[moduleId][0]);
    }
  };

  const selectLesson = async (careerId, moduleId, lesson) => {
    setActiveLesson(lesson);
    setLoadingContent(true);
    setNotes([]);
    setVideos([]);
    setQuizzes([]);

    try {
      const [notesRes, videosRes, quizzesRes] = await Promise.all([
        api.get(`/career-goals/${careerId}/modules/${moduleId}/lessons/${lesson.id}/notes`),
        api.get(`/career-goals/${careerId}/modules/${moduleId}/lessons/${lesson.id}/videos`),
        api.get(`/career-goals/${careerId}/modules/${moduleId}/lessons/${lesson.id}/quizzes`)
      ]);
      setNotes(notesRes.data.data || []);
      setVideos(videosRes.data.data || []);
      setQuizzes(quizzesRes.data.data || []);
    } catch (err) {
      console.error('Failed to load lesson content', err);
    } finally {
      setLoadingContent(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const selectedCareerObj = careers.find(c => c.id === selectedCareerId);

  return (
    <div className="space-y-6">
      {/* Header & Career Goal Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Learning Hub</h1>
          <p className="mt-1 text-slate-400">
            Explore lessons, read notes, and watch curated YouTube tutorials for your chosen career path.
          </p>
        </div>

        {/* Career Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shrink-0">
          <Layers className="h-4 w-4 text-violet-400 ml-2" />
          <select
            value={selectedCareerId || ''}
            onChange={(e) => selectCareer(Number(e.target.value))}
            className="bg-transparent text-white font-semibold text-sm outline-none cursor-pointer pr-4"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Module/Lesson Navigation | Right Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Modules & Lessons (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            {selectedCareerObj?.name} Modules ({modules.length})
          </h2>

          <div className="space-y-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {modules.map((mod) => {
              const isModActive = activeModuleId === mod.id;
              const modLessons = lessonsMap[mod.id] || [];

              return (
                <div
                  key={mod.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isModActive
                      ? 'bg-slate-900 border-violet-500/50 shadow-lg shadow-violet-950/20'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(selectedCareerId, mod.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{mod.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mod.description}</p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isModActive ? 'rotate-180 text-violet-400' : ''
                      }`}
                    />
                  </button>

                  {/* Accordion Lessons List */}
                  {isModActive && (
                    <div className="border-t border-slate-800/80 bg-slate-950/50 p-2 space-y-1">
                      {modLessons.length === 0 ? (
                        <p className="text-xs text-slate-500 italic p-2">Loading lessons...</p>
                      ) : (
                        modLessons.map((les) => {
                          const isLesActive = activeLesson?.id === les.id;
                          return (
                            <button
                              key={les.id}
                              onClick={() => selectLesson(selectedCareerId, mod.id, les)}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 ${
                                isLesActive
                                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-600/30'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <span className="truncate">{les.name}</span>
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lesson Content Details (8 cols) */}
        <div className="lg:col-span-8">
          {activeLesson ? (
            <div className="card space-y-6">
              {/* Lesson Title Banner */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-1">
                  <span>{selectedCareerObj?.name}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>{modules.find(m => m.id === activeLesson.moduleId)?.name}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{activeLesson.name}</h2>
                {activeLesson.description && (
                  <p className="text-slate-400 text-sm mt-1">{activeLesson.description}</p>
                )}
              </div>

              {/* Tabs: Notes | Videos | Quizzes */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'notes'
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BookOpen className="h-4 w-4" /> Notes ({notes.length})
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'videos'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Video className="h-4 w-4" /> Videos ({videos.length})
                </button>

                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'quizzes'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <HelpCircle className="h-4 w-4" /> Quiz ({quizzes.length})
                </button>
              </div>

              {/* Content Panel */}
              {loadingContent ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <div className="pt-2">
                  {/* TAB 1: NOTES */}
                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      {notes.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-sm">
                          No notes available for this lesson yet.
                        </div>
                      ) : (
                        notes.map((note) => (
                          <div key={note.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center gap-2 text-violet-400 font-bold text-base">
                              <FileText className="h-5 w-5" />
                              <h3>{note.title}</h3>
                            </div>
                            <div className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950/70 p-4 rounded-xl border border-slate-800/60">
                              {note.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 2: VIDEOS */}
                  {activeTab === 'videos' && (
                    <div className="space-y-6">
                      {videos.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-sm">
                          No videos available for this lesson yet.
                        </div>
                      ) : (
                        videos.map((vid) => {
                          const embedUrl = getEmbedUrl(vid.youtubeUrl);
                          return (
                            <div key={vid.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-base">{vid.title}</h3>
                                <span className="text-xs text-slate-400">{vid.durationMinutes || 0} mins</span>
                              </div>

                              {embedUrl ? (
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                                  <iframe
                                    src={embedUrl}
                                    title={vid.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              ) : (
                                <a
                                  href={vid.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-red-400 hover:underline"
                                >
                                  <Play className="h-4 w-4" /> Watch on YouTube: {vid.youtubeUrl}
                                </a>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* TAB 3: QUIZZES */}
                  {activeTab === 'quizzes' && (
                    <div className="space-y-4">
                      {quizzes.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-sm">
                          No quiz available for this lesson currently.
                        </div>
                      ) : (
                        quizzes.map((q, idx) => (
                          <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <h3 className="font-bold text-white text-sm">
                              Q{idx + 1}. {q.question}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div className={`p-3 rounded-xl border ${q.correctAnswer === 'A' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                                A. {q.optionA}
                              </div>
                              <div className={`p-3 rounded-xl border ${q.correctAnswer === 'B' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                                B. {q.optionB}
                              </div>
                              <div className={`p-3 rounded-xl border ${q.correctAnswer === 'C' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                                C. {q.optionC}
                              </div>
                              <div className={`p-3 rounded-xl border ${q.correctAnswer === 'D' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                                D. {q.optionD}
                              </div>
                            </div>
                            {q.explanation && (
                              <p className="text-xs text-slate-400 italic pt-1">
                                Explanation: {q.explanation}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-20 text-slate-500">
              Select a lesson from the left module list to view its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
