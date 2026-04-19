import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, ChevronRight, Target } from 'lucide-react';
import { courses, type Course } from '@/data/mockFinance';
import CourseDetailLayout from '@/components/courseHub/CourseDetailLayout';

// Học viên S001 (Hoàng Minh Đức) đang học IELTS Foundation 5.5 (IELTS01) - lớp A1
const studentEnrollments = [
  { courseCode: 'IELTS01', className: 'IELTS 6.5 - Lớp A1', teacherName: 'Lê Hoàng Cường', sessionsDone: 12, totalSessions: 30 },
];

const StudentMyCourse = () => {
  const [selected, setSelected] = useState<Course | null>(null);
  const myCourses = studentEnrollments.map((e) => ({
    enrollment: e,
    course: courses.find((c) => c.code === e.courseCode)!,
  })).filter((x) => x.course);

  if (selected) {
    const enrollment = studentEnrollments.find((e) => e.courseCode === selected.code);
    return (
      <CourseDetailLayout
        course={selected}
        role="Student"
        studentId="S001"
        className={enrollment?.className}
        teacherName={enrollment?.teacherName}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Khoá học của tôi</h2>
        <p className="text-sm text-muted-foreground">Tiếp tục hành trình học tập của bạn.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {myCourses.map(({ enrollment, course }) => {
          const pct = Math.round((enrollment.sessionsDone / enrollment.totalSessions) * 100);
          return (
            <Card key={course.id} className="border-border/60 overflow-hidden hover:shadow-elegant transition group cursor-pointer" onClick={() => setSelected(course)}>
              <div className="gradient-hero p-5 text-primary-foreground">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">{course.code}</Badge>
                  {course.syllabus && (
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <Target className="h-3 w-3" /> Band {course.syllabus.overview.targetBandOut}
                    </div>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold">{course.name}</h3>
                <div className="text-xs opacity-90 mt-1">{enrollment.className}</div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Tiến độ</span>
                    <span className="font-semibold">{enrollment.sessionsDone}/{enrollment.totalSessions} buổi</span>
                  </div>
                  <Progress value={pct} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> GV. {enrollment.teacherName}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.syllabus?.overview.totalWeeks ?? 12} tuần</span>
                </div>
                <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  Vào lớp học <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentMyCourse;
