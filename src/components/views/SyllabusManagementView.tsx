import React, { useState } from 'react';
import { mockCourses } from '../../data/mockSyllabusData';
import { phaseLessons } from '../../data/excelSyllabusData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, BookOpen, Users, ChevronRight, Clock, Calendar } from 'lucide-react';
import { SyllabusDetailedView } from '../syllabus/SyllabusDetailedView';

interface SyllabusManagementViewProps {
  userRole?: string;
}

const assignedLessonIds = ['nk1-1', 'nk1-3', 'nk1-5', 'nk2-2', 'nk2-4'];

const SyllabusManagementView: React.FC<SyllabusManagementViewProps> = ({ userRole = 'Admin' }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const isPartTime = userRole === 'PART_TIME_TEACHER';
  
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const selectedCourse = mockCourses.find(c => c.id === selectedCourseId);
  
  // Set default active lesson based on role
  const defaultLessonId = isPartTime ? assignedLessonIds[0] : phaseLessons[0].id;
  const activeLesson = phaseLessons.find(l => l.id === (activeLessonId || defaultLessonId)) || phaseLessons[0];

  if (selectedCourseId && selectedCourse) {
    return (
      <div className="flex flex-col h-screen bg-white overflow-hidden">
        {/* Top Header Section - Now spans full width with lesson info */}
        <div className="flex-shrink-0 h-16 border-b border-slate-100 flex items-center px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30 justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSelectedCourseId(null);
                setActiveLessonId(null);
              }}
              className="rounded-full w-8 h-8 p-0 border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 leading-none">
                  {selectedCourse.name}
                </h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">QUẢN LÝ CHI TIẾT</p>
              </div>
              
              <div className="h-8 w-px bg-slate-100"></div>

              <div>
                <h2 className="text-sm font-black text-blue-600 flex items-center gap-2 leading-none uppercase tracking-tight">
                  BUỔI {activeLesson.lessonNumber}: {activeLesson.topicName.split(': ')[1] || activeLesson.topicName}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      <Clock className="w-2.5 h-2.5" /> 90 PHÚT
                   </div>
                   <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      <Calendar className="w-2.5 h-2.5" /> TUẦN {activeLesson.weekNumber}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <SyllabusDetailedView 
            activeLessonId={activeLessonId || defaultLessonId} 
            onLessonChange={setActiveLessonId} 
            userRole={userRole}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Danh sách Syllabus</h2>
        <p className="text-sm text-muted-foreground">Chọn một khóa học để xem chi tiết ma trận nội dung giảng dạy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCourses.map((course) => (
          <Card 
            key={course.id} 
            className="group hover:shadow-lg transition-all border-slate-200 overflow-hidden cursor-pointer bg-white flex flex-col h-full"
            onClick={() => setSelectedCourseId(course.id)}
          >
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="bg-white border-slate-200">v1.2</Badge>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">{course.name}</CardTitle>
              <CardDescription className="line-clamp-1">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lớp đang học:</span>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none h-5 px-1.5 text-[10px]">
                    {course.activeClasses.length} lớp
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {course.activeClasses.map((className) => (
                    <div key={className} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{className}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary hover:text-primary hover:bg-primary/5 gap-2 text-sm font-bold p-0 h-auto py-2 border-t border-slate-50 rounded-none pt-4">
                Xem chi tiết <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SyllabusManagementView;
