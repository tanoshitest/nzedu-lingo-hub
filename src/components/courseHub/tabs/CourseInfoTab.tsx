import SyllabusViewer from '@/components/syllabus/SyllabusViewer';
import { Card, CardContent } from '@/components/ui/card';
import type { TabContext } from '../shared/TabContext';

const CourseInfoTab = ({ course }: TabContext) => {
  if (!course.syllabus) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Khoá học này chưa có giáo trình chi tiết.
        </CardContent>
      </Card>
    );
  }
  return <SyllabusViewer syllabus={course.syllabus} courseName={course.name} courseCode={course.code} />;
};

export default CourseInfoTab;
