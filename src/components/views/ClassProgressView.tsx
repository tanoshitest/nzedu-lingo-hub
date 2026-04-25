import React, { useState } from 'react';
import { ClassLessonList } from '../class/ClassLessonList';
import { LessonDetailModal } from '../lesson/LessonDetailModal';
import { ExtraLessonForm } from '../lesson/ExtraLessonForm';
import { 
  mockClass, 
  mockClassLessons as initialClassLessons, 
  mockUsers 
} from '../../data/mockSyllabusData';
import { ClassLesson, User } from '../../types/syllabus';
import { toast } from 'sonner';

interface ClassProgressViewProps {
  userRole: 'LEAD_TEACHER' | 'PART_TIME_TEACHER' | 'ADMIN' | 'COORDINATOR';
}

const ClassProgressView = ({ userRole }: ClassProgressViewProps) => {
  // Simulate current user based on role prop
  const currentUser: User = userRole === 'PART_TIME_TEACHER' ? mockUsers[1] : mockUsers[0];
  
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
    toast.info('Trạng thái bài học đã được cập nhật');
  };

  const handleAddExtraLesson = (data: any) => {
    const newLesson: ClassLesson = {
      ...data,
      id: `extra-${Date.now()}`,
      classId: mockClass.id,
      weekNumber: 0,
      lessonNumber: classLessons.length + 1,
      assignedTeacherId: currentUser.id,
    };
    setClassLessons(prev => [...prev, newLesson]);
    setIsExtraFormOpen(false);
    toast.success('Đã thêm buổi học ngoại khóa');
  };

  const handleLessonSelect = (lesson: ClassLesson) => {
    setSelectedLesson(lesson);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <ClassLessonList 
        currentClass={mockClass}
        lessons={classLessons}
        currentUser={currentUser}
        onLessonSelect={handleLessonSelect}
        onToggleStatus={handleToggleStatus}
        onAddExtraLesson={() => setIsExtraFormOpen(true)}
      />

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
    </div>
  );
};

export default ClassProgressView;
