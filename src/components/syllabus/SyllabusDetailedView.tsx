import React, { useState } from 'react';
import { phaseLessons, phases } from '../../data/excelSyllabusData';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users,
  ClipboardCheck,
  ExternalLink,
  ArrowLeft,
  Monitor,
  FileText as FileIcon,
  Lock,
  ArrowRight
} from 'lucide-react';
import { mockExercises, mockExerciseResults, type Exercise, type ExerciseResult } from '../../data/mockExercises';
import { ExercisePlayer } from '../player/ExercisePlayer';
import { ExerciseReview } from '../player/ExerciseReview';
import { ExercisePreview } from '../player/ExercisePreview';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '../ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';

interface SyllabusDetailedViewProps {
  activeLessonId: string;
  onLessonChange: (id: string) => void;
  userRole?: string;
  className?: string;
}

// Mock assigned lessons for Part-time teacher demo
const assignedLessonIds = ['nk1-1', 'nk1-3', 'nk1-5', 'nk2-2', 'nk2-4'];

export const SyllabusDetailedView: React.FC<SyllabusDetailedViewProps> = ({ 
  activeLessonId, 
  onLessonChange,
  userRole = 'Admin',
  className
}) => {
  const isStudent = userRole === 'Student';
  const [activeTab, setActiveTab] = useState<string>(isStudent ? 'in-class' : 'materials');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [viewingResult, setViewingResult] = useState<ExerciseResult | null>(null);
  const [showingExerciseList, setShowingExerciseList] = useState(false);
  const [previewingExercise, setPreviewingExercise] = useState<Exercise | null>(null);
  
  const activeLesson = phaseLessons.find(l => l.id === activeLessonId) || phaseLessons[0];
  const activePhase = phases.find(p => p.id === activeLesson.phaseId);

  const isPartTime = userRole === 'PART_TIME_TEACHER';

  // Define tabs based on role
  const allTabs = [
    { id: 'materials', label: 'Teaching material' },
    { id: 'in-class', label: 'In class' },
    { id: 'outcome', label: 'Lesson outcome' },
    { id: 'after-class', label: 'After class' },
  ];

  const visibleTabs = isStudent 
    ? allTabs.filter(tab => ['in-class', 'after-class'].includes(tab.id))
    : allTabs;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* CỘT TRÁI: ROADMAP */}
      <aside className="w-[380px] flex-shrink-0 border-r border-slate-100 flex flex-col bg-[#FDFDFD]">
        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
            {/* Sticky Left Header */}
            <div className="sticky top-0 z-20 bg-[#FDFDFD]/95 backdrop-blur-md px-7 py-4 border-b border-slate-50 mb-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] font-black text-blue-600 uppercase tracking-widest">
                    <BookOpen className="w-4 h-4" /> SYLLABUS
                  </div>
                  {className && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold">
                      {className}
                    </Badge>
                  )}
               </div>
            </div>
            
            <div className="p-4 pt-0 flex-1">
              <Accordion 
                type="single" 
                collapsible 
                defaultValue={activePhase?.id}
                className="space-y-2"
              >
                {phases.map((phase) => (
                  <AccordionItem key={phase.id} value={phase.id} className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-xl hover:bg-slate-50 transition-all group">
                      <div className="flex flex-col items-start text-left">
                        <span className={cn(
                          "text-[11px] font-black uppercase tracking-widest transition-colors",
                          phase.id === activePhase?.id ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
                        )}>
                          UNIT {phase.id.replace('NK', '')}
                        </span>
                        <span className="text-[13px] font-bold text-slate-700 truncate max-w-[200px]">
                          {phase.label.split(' - ')[1] || phase.label}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 px-1">
                      {/* Phase Goal dropdown */}
                      {phase.goals && phase.goals.length > 0 && (
                         <div className="mb-4 px-3">
                            <Accordion type="single" collapsible>
                               <AccordionItem value="goals" className="border-none">
                                  <AccordionTrigger className="py-2 text-[10px] font-black text-blue-500/70 hover:text-blue-600 uppercase tracking-widest hover:no-underline">
                                     <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                        Mục tiêu Unit
                                     </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-1 pb-3">
                                     <div className="bg-blue-50/50 rounded-xl p-3 space-y-2 border border-blue-100/50">
                                        {phase.goals.map((goal, idx) => (
                                           <div key={idx} className="flex gap-2 text-[11px] text-blue-700/80 font-bold leading-relaxed">
                                              <span className="shrink-0 text-blue-400">•</span>
                                              <span>{goal}</span>
                                           </div>
                                        ))}
                                     </div>
                                  </AccordionContent>
                               </AccordionItem>
                            </Accordion>
                         </div>
                      )}

                      <div className="space-y-1 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-slate-100 ml-2">
                        {phaseLessons
                          .filter(lesson => lesson.phaseId === phase.id)
                          .map((lesson) => {
                            const isSelected = activeLesson.id === lesson.id;
                            const isTest = lesson.type === 'test';
                            const isLocked = isPartTime && !assignedLessonIds.includes(lesson.id);
                            
                            return (
                              <button
                                key={lesson.id}
                                disabled={isLocked}
                                onClick={() => onLessonChange(lesson.id)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all relative z-10",
                                  isSelected 
                                    ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50" 
                                    : "text-slate-500 hover:bg-slate-50",
                                  isLocked && "opacity-40 grayscale cursor-not-allowed filter blur-[1px]"
                                )}
                              >
                                <div className={cn(
                                  "w-2 h-2 rounded-full shrink-0 transition-transform",
                                  isSelected ? "scale-125 bg-blue-600" : (isTest ? "bg-red-400" : "bg-slate-200")
                                )} />
                                <div className="flex flex-col min-w-0 flex-1">
                                  {isTest && (
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-0.5">TEST</span>
                                  )}
                                  <span className={cn(
                                    "text-xs font-bold truncate leading-tight",
                                    isTest ? "text-red-600/80" : ""
                                  )}>
                                    {isTest ? lesson.topicName : `Day ${lesson.lessonNumber}  ${lesson.topicName.split(': ')[1] || lesson.topicName}`}
                                  </span>
                                </div>
                                {isLocked && (
                                  <Lock className="w-3 h-3 text-slate-400" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Course Exercises Section */}
              <div className="p-2 border-t border-slate-50 mt-4">
                <div className="flex items-center gap-2 px-3 py-4 text-[12px] font-black text-blue-600 uppercase tracking-widest">
                  <ClipboardCheck className="w-4 h-4" /> BÀI TẬP TRONG KHOÁ
                </div>
                <div className="space-y-1">
                  {['Assignment', 'Vocabulary', 'Exercises', 'Finaltest'].map((item) => (
                    <button 
                      key={item} 
                      onClick={() => {
                        if (item === 'Exercises') {
                          setShowingExerciseList(true);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                        showingExerciseList && item === 'Exercises' ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100">{item}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* CỘT PHẢI: LESSON DETAILS */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {previewingExercise ? (
          <ScrollArea className="flex-1">
            <ExercisePreview 
              exercise={previewingExercise} 
              onBack={() => setPreviewingExercise(null)} 
            />
          </ScrollArea>
        ) : activeExercise ? (
          <ScrollArea className="flex-1 bg-slate-50/30">
             <ExercisePlayer 
                exercise={activeExercise} 
                onSubmit={(ans) => {
                  // Giả lập lưu kết quả
                  const res: ExerciseResult = {
                    studentId: 'U005',
                    exerciseId: activeExercise.id,
                    score: 100, // Mock score logic
                    answers: activeExercise.questions.map(q => ({
                      questionId: q.id,
                      studentAnswer: ans[q.id],
                      isCorrect: ans[q.id] === q.correctAnswer
                    })),
                    submittedAt: new Date().toLocaleString('vi-VN')
                  };
                  setViewingResult(res);
                  setActiveExercise(null);
                }}
                onCancel={() => setActiveExercise(null)}
             />
          </ScrollArea>
        ) : viewingResult ? (
          <ScrollArea className="flex-1">
            <ExerciseReview 
              exercise={mockExercises.find(e => e.id === viewingResult.exerciseId) || mockExercises[0]} 
              result={viewingResult} 
              onBack={() => setViewingResult(null)} 
            />
          </ScrollArea>
        ) : showingExerciseList ? (
          <ScrollArea className="flex-1">
            <div className="p-8 max-w-4xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Danh sách bài tập</h1>
                    <p className="text-slate-500 mt-1">Hoàn thành bài tập để củng cố kiến thức Day {activeLesson.lessonNumber}</p>
                 </div>
                 <Button variant="ghost" onClick={() => setShowingExerciseList(false)} className="gap-2">
                   <ArrowLeft size={16} /> Quay lại
                 </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {mockExercises.filter(e => e.lessonId === activeLessonId).map((ex) => {
                    const result = mockExerciseResults.find(r => r.exerciseId === ex.id);
                    return (
                      <Card key={ex.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                         <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-stretch">
                               <div className="p-6 flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                     <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold">{ex.questions.length} câu hỏi</Badge>
                                     {result && (
                                       <Badge className={cn(
                                         "font-bold border-none",
                                         result.status === 'graded' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                                       )}>
                                         {result.status === 'graded' ? 'Đã chấm' : 'Chờ chấm'}
                                       </Badge>
                                     )}
                                  </div>
                                  <h3 className="text-xl font-bold text-slate-900 mb-1">{ex.title}</h3>
                                  <p className="text-sm text-slate-500">{ex.description}</p>
                               </div>
                               <div className="bg-slate-50 p-6 flex flex-col justify-center items-center gap-2 md:w-48 group-hover:bg-blue-50 transition-colors">
                                  {userRole === 'Admin' ? (
                                    <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all" onClick={() => setPreviewingExercise(ex)}>
                                       Xem chi tiết <ChevronRight size={14} />
                                    </Button>
                                  ) : result ? (
                                    <>
                                       <div className="text-2xl font-black text-emerald-600">{result.score}%</div>
                                       <Button size="sm" variant="outline" className="w-full text-xs font-bold" onClick={() => setViewingResult(result)}>
                                          Xem kết quả
                                       </Button>
                                    </>
                                  ) : (
                                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-bold gap-1" onClick={() => setActiveExercise(ex)}>
                                       Làm bài ngay <ArrowRight size={14} />
                                    </Button>
                                  )}
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                    );
                 })}
                 {mockExercises.filter(e => e.lessonId === activeLessonId).length === 0 && (
                   <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Monitor size={40} />
                      </div>
                      <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Chưa có bài tập cho Day này</h3>
                   </div>
                 )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="flex-1">
            {activeLesson.type === 'test' ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-4">
              <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center mb-4">
                <Monitor className="w-12 h-12 text-slate-200" />
              </div>
              <h1 className="text-4xl font-black text-slate-200 uppercase tracking-[0.2em]">Coming soon</h1>
              <p className="text-slate-400 font-bold italic">{activeLesson.topicName}</p>
            </div>
          ) : (
            <div className="flex flex-col min-h-full">
              {/* Sticky Right Header & Tabs - Title removed, only tabs remain sticky */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-8 py-2 w-full border-b border-slate-50">
                {/* Main Content Tabs */}
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                  {visibleTabs.map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "py-3 text-[12px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                        activeTab === tab.id ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-8 pt-4 max-w-5xl mx-auto w-full flex-1">
                <div className="py-4 min-h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'materials' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileIcon className="w-6 h-6 text-orange-500" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">File pptx bài giảng</h4>
                                <p className="text-xs text-slate-400">Slide bài giảng Day {activeLesson.lessonNumber} - {activeLesson.topicName}</p>
                              </div>
                            </div>
                            <Button variant="ghost" className="text-blue-600 font-bold text-xs gap-2 group-hover:bg-blue-50">
                              Xem bài giảng <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Monitor className="w-6 h-6 text-blue-500" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">Bài quiz kiểm tra</h4>
                                <p className="text-xs text-slate-400">Quiz kiểm tra từ vựng Day {activeLesson.lessonNumber}</p>
                              </div>
                            </div>
                            <Button variant="ghost" className="text-blue-600 font-bold text-xs gap-2 group-hover:bg-blue-50">
                              Làm bài Quiz <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === 'outcome' && (
                        <div className="grid grid-cols-1 gap-3">
                          {(activeLesson.lessonOutcome || "After lesson, Ss can: - remember 80% new words; - recognise new words; - pronounce words clearly; - answer with full sentences")
                            .split(';').map((outcome, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white transition-all">
                                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                <span className="text-[14px] font-bold text-slate-700 leading-tight">
                                  {outcome.replace('- ', '').trim()}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}

                      {activeTab === 'in-class' && (
                        <div className="space-y-8">
                          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                            <div className="space-y-4 flex-1">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Book References</h4>
                              <div className="flex gap-8">
                                <div className="text-sm font-bold text-slate-600">Pupil Book: <span className="text-blue-600 ml-1">p. {activeLesson.pages.pupilBook}</span></div>
                                <div className="text-sm font-bold text-slate-600">Activity Book: <span className="text-emerald-600 ml-1">p. {activeLesson.pages.activityBook}</span></div>
                              </div>
                            </div>
                            <BookOpen className="w-8 h-8 text-slate-200" />
                          </div>

                          {/* Hướng dẫn giảng dạy section */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <ClipboardCheck className="w-4 h-4 text-indigo-500" /> Hướng dẫn giảng dạy (Teacher's Guide)
                            </h3>
                            <div className="p-6 rounded-3xl bg-indigo-50/30 border border-indigo-100/50 shadow-sm shadow-indigo-100/20">
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold shrink-0">1</div>
                                  <div>
                                    <h5 className="text-sm font-black text-indigo-900">Warm-up & Review</h5>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Chào hỏi học sinh, ôn tập các từ vựng của buổi học trước bằng game nhanh hoặc bài hát.</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold shrink-0">2</div>
                                  <div>
                                    <h5 className="text-sm font-black text-indigo-900">Presentation</h5>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Giới thiệu chủ đề hôm nay: {activeLesson.topicName}. Sử dụng Flashcards hoặc slide để trình bày từ vựng mới.</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold shrink-0">3</div>
                                  <div>
                                    <h5 className="text-sm font-black text-indigo-900">Practice & Activity</h5>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Học sinh làm việc nhóm, thực hành cấu trúc câu. Giáo viên quan sát và sửa phát âm cho từng bé.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <BookOpen className="w-4 h-4" /> Từ vựng đã học
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                              {activeLesson.vocabularyList?.map((vocab, idx) => (
                                <Accordion key={idx} type="single" collapsible className="w-full">
                                  <AccordionItem value={`vocab-${idx}`} className="border rounded-2xl px-5 py-1 bg-white hover:border-blue-200 transition-all">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                      <div className="flex items-center gap-4 text-left">
                                        <span className="text-base font-black text-slate-900">{vocab.word}</span>
                                        <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-md">{vocab.phonetics}</span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5 pt-2 border-t border-slate-50 mt-1">
                                      <div className="space-y-4">
                                        <div>
                                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nghĩa tiếng Việt</span>
                                          <p className="text-sm font-bold text-slate-700">{vocab.meaning}</p>
                                        </div>
                                        <div>
                                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ví dụ</span>
                                          <p className="text-sm text-slate-600 italic">"{vocab.example}"</p>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'after-class' && (
                        <div className="space-y-10">
                          {/* Part 1: Review from In-Class */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">Kiến thức đã học (Review)</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pupil Book</h4>
                                  <div className="text-sm font-bold text-blue-600">Trang {activeLesson.pages.pupilBook}</div>
                                </div>
                                <BookOpen className="w-6 h-6 text-slate-200" />
                              </div>
                              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity Book</h4>
                                  <div className="text-sm font-bold text-emerald-600">Trang {activeLesson.pages.activityBook}</div>
                                </div>
                                <ClipboardCheck className="w-6 h-6 text-slate-200" />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Từ vựng chính</h4>
                              <div className="flex flex-wrap gap-2">
                                {activeLesson.vocabularyList?.map((vocab, idx) => (
                                  <div key={idx} className="bg-white border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm shadow-slate-100/50">
                                    <span className="text-sm font-black text-slate-900">{vocab.word}</span>
                                    <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-md">{vocab.phonetics}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Part 2: Homework */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">Bài tập về nhà (Homework)</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {(activeLesson.homeworkList || [
                                "Thuộc lòng 80% từ vựng",
                                "Thực hành luyện hỏi và trả lời cấu trúc đã học",
                                "Hoàn thành sách BT: trang 4-5",
                                "Hoàn thành sách Extra Workbook"
                              ]).map((hw, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white transition-all group">
                                  <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-black text-[11px] group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    {idx + 1}
                                  </div>
                                  <span className="text-[15px] font-bold text-slate-700 leading-tight">
                                    {hw}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>
            </div>
          )}
        </ScrollArea>
      )}
    </main>
    </div>
  );
};
