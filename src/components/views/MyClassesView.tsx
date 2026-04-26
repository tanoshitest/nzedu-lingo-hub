import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Clock,
  Target,
  GraduationCap
} from 'lucide-react';
import { mockClasses } from '@/data/mockClasses';
import { motion } from 'framer-motion';

interface MyClassesViewProps {
  teacherId: string;
  onSelectClass: (syllabusId: string, className: string) => void;
}

export function MyClassesView({ teacherId, onSelectClass }: MyClassesViewProps) {
  // Filter classes assigned to this teacher
  const myClasses = mockClasses.filter(c => c.teacherId === teacherId);

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lớp của tôi</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <GraduationCap size={16} className="text-blue-500" /> 
            Chào thầy Lê Hoàng Cường, bạn có {myClasses.length} lớp học đang phụ trách.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
          <Calendar size={14} className="text-blue-500" /> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {myClasses.map((cls, idx) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="group relative border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 overflow-hidden cursor-pointer" onClick={() => onSelectClass(cls.syllabusId, cls.name)}>
              {/* Header Gradient */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <CardContent className="p-0">
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-black text-[10px] uppercase tracking-tighter py-0.5">
                          {cls.level}
                        </Badge>
                        <Badge variant="outline" className="text-slate-400 border-slate-100 font-bold text-[10px]">
                          {cls.id}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mt-2">{cls.name}</h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500">
                      <Users size={28} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lịch học</p>
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Calendar size={14} className="text-blue-400" /> {cls.schedule.split(' • ')[0]}
                      </p>
                      <p className="text-xs text-slate-500 pl-5">{cls.schedule.split(' • ')[1]}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiến độ syllabus</p>
                      <div className="flex flex-col items-end gap-1">
                         <span className="text-sm font-black text-slate-900">Day {cls.currentDay} / 24</span>
                         <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[25%] rounded-full"></div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-6 flex justify-between items-center group-hover:bg-blue-50/50 transition-colors border-t border-slate-100/50">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400">
                          S{i}
                        </div>
                      ))}
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[8px] font-black text-white">
                        +{cls.studentsCount - 4}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{cls.studentsCount} học viên đang theo học</span>
                  </div>
                  <Button variant="ghost" className="text-blue-600 font-black text-xs gap-2 group-hover:translate-x-1 transition-transform">
                    VÀO LỚP HỌC <ArrowRight size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
