import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ChevronRight, Target, CalendarDays } from 'lucide-react';
import { courses, type Course } from '@/data/mockFinance';
import { classRosters } from '@/data/mockClassReports';
import CourseDetailLayout from '@/components/courseHub/CourseDetailLayout';

// Giáo vụ quản lý tất cả lớp — map className → courseCode
const allClasses = [
  { courseCode: 'IELTS01', className: 'IELTS 6.5 - Lớp A1', schedule: 'T2-T4-T6 • 18:00-19:30', teacher: 'Lê Hoàng Cường' },
  { courseCode: 'IELTS02', className: 'IELTS 7.0 - Lớp B1', schedule: 'T3-T5-T7 • 19:45-21:15', teacher: 'Lê Hoàng Cường' },
];

const CoordinatorMyCourse = () => {
  const [selected, setSelected] = useState<{ course: Course; className: string; teacherName: string } | null>(null);

  const myClasses = allClasses.map((c) => ({
    enrollment: c,
    course: courses.find((co) => co.code === c.courseCode)!,
    studentCount: classRosters[c.className]?.length ?? 0,
  })).filter((x) => x.course);

  if (selected) {
    return (
      <CourseDetailLayout
        course={selected.course}
        role="Coordinator"
        className={selected.className}
        teacherName={selected.teacherName}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Quản lý lớp học</h2>
        <p className="text-sm text-muted-foreground">Chọn lớp để xem syllabus và điểm danh.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {myClasses.map(({ enrollment, course, studentCount }) => (
          <Card
            key={enrollment.className}
            className="border-border/60 overflow-hidden hover:shadow-elegant transition cursor-pointer group"
            onClick={() => setSelected({ course, className: enrollment.className, teacherName: enrollment.teacher })}
          >
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
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 p-2 rounded-md bg-muted/30">
                  <Users className="h-3 w-3 text-primary" />
                  <span>{studentCount} học viên</span>
                </div>
                <div className="flex items-center gap-1 p-2 rounded-md bg-muted/30">
                  <BookOpen className="h-3 w-3 text-primary" />
                  <span>{course.sessions} buổi</span>
                </div>
                <div className="col-span-2 flex items-center gap-1 p-2 rounded-md bg-muted/30">
                  <CalendarDays className="h-3 w-3 text-primary" />
                  <span>{enrollment.schedule}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition">
                Vào lớp & điểm danh <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoordinatorMyCourse;
