import React, { useState } from 'react';
import { SyllabusMatrixView } from '../components/syllabus/SyllabusMatrixView';
import { ClassLessonList } from '../components/class/ClassLessonList';
import { LessonDetailModal } from '../components/lesson/LessonDetailModal';
import { ExtraLessonForm } from '../components/lesson/ExtraLessonForm';
import { 
  mockSyllabusLessons, 
  mockClass, 
  mockClassLessons as initialClassLessons, 
  mockUsers 
} from '../data/mockSyllabusData';
import { ClassLesson, User } from '../types/syllabus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { User as UserIcon, Settings, Layout, ClipboardList } from 'lucide-react';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';

export default function SyllabusDemo() {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Start as Lead Teacher
  const [classLessons, setClassLessons] = useState<ClassLesson[]>(initialClassLessons);
  const [selectedLesson, setSelectedLesson] = useState<ClassLesson | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExtraFormOpen, setIsExtraFormOpen] = useState(false);

  const handleToggleStatus = (lessonId: string) => {
    setClassLessons(prev => prev.map(l => 
      l.id === lessonId 
        ? { ...l, status: l.status === 'Completed' ? 'Pending' : 'Completed' } 
        : l
    ));
    toast.info('Lesson status updated');
  };

  const handleAddExtraLesson = (data: any) => {
    const newLesson: ClassLesson = {
      ...data,
      id: `extra-${Date.now()}`,
      classId: mockClass.id,
      weekNumber: 0, // Extra lessons don't have a syllabus week by default
      lessonNumber: classLessons.length + 1,
      assignedTeacherId: currentUser.id,
    };
    setClassLessons(prev => [...prev, newLesson]);
    setIsExtraFormOpen(false);
    toast.success('Extra lesson added successfully');
  };

  const handleLessonSelect = (lesson: ClassLesson) => {
    setSelectedLesson(lesson);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Mini Top Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">NZEDU LingoHub</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <UserIcon className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">{currentUser.name}</span>
            <Badge className="h-4 px-1.5 text-[9px] uppercase bg-primary/10 text-primary border-none">
              {currentUser.role.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="flex gap-1 border-l border-slate-200 pl-4">
            <button 
              onClick={() => setCurrentUser(mockUsers[0])}
              className={`text-[10px] font-bold px-2 py-1 rounded ${currentUser.role === 'LEAD_TEACHER' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}
            >
              LEAD
            </button>
            <button 
              onClick={() => setCurrentUser(mockUsers[1])}
              className={`text-[10px] font-bold px-2 py-1 rounded ${currentUser.role === 'PART_TIME_TEACHER' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}
            >
              PT
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Curriculum Management</h1>
          <p className="text-slate-500 max-w-2xl">
            Manage course syllabi, track class progress, and coordinate with teaching staff.
          </p>
        </header>

        <Tabs defaultValue="class" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 border border-slate-200 h-11">
            <TabsTrigger value="class" className="data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <ClipboardList className="w-4 h-4" /> Active Class
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <Settings className="w-4 h-4" /> Syllabus Blueprint
            </TabsTrigger>
          </TabsList>

          <TabsContent value="class" className="mt-0">
            <ClassLessonList 
              currentClass={mockClass}
              lessons={classLessons}
              currentUser={currentUser}
              onLessonSelect={handleLessonSelect}
              onToggleStatus={handleToggleStatus}
              onAddExtraLesson={() => setIsExtraFormOpen(true)}
            />
          </TabsContent>

          <TabsContent value="syllabus" className="mt-0">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Master Blueprint: Everybody Up 1</h3>
                  <p className="text-xs text-slate-500">Standard 20-week curriculum template</p>
                </div>
                <Badge className="bg-slate-900">v1.2.0</Badge>
              </div>
              <SyllabusMatrixView lessons={mockSyllabusLessons} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <LessonDetailModal 
        lesson={selectedLesson}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ExtraLessonForm 
        isOpen={isExtraFormOpen}
        onClose={() => setIsExtraFormOpen(false)}
        onSubmit={handleAddExtraLesson}
      />

      <Toaster />
    </div>
  );
}
