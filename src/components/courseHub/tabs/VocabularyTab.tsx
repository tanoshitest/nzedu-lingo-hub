import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Library, CheckCircle2, Circle } from 'lucide-react';
import { vocabItems } from '@/data/mockCourseHub';
import type { TabContext } from '../shared/TabContext';

const VocabularyTab = ({ course }: TabContext) => {
  const list = vocabItems.filter((v) => v.courseCode === course.code);
  const learned = list.filter((v) => v.learned).length;

  return (
    <div className="space-y-4">
      <Card className="border-border/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="h-4 w-4 text-primary" />
            <span className="text-sm">Đã học <span className="font-bold text-primary">{learned}</span> / {list.length} từ</span>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{Math.round((learned / (list.length || 1)) * 100)}%</Badge>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((v) => (
          <Card key={v.id} className={v.learned ? 'border-success/30 bg-success/5' : 'border-border/60'}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{v.word}</CardTitle>
                  <div className="text-xs text-muted-foreground italic">{v.phonetic} • {v.partOfSpeech}</div>
                </div>
                {v.learned ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="font-medium">{v.meaningVi}</div>
              <div className="text-muted-foreground italic">"{v.exampleEn}"</div>
              <Badge variant="outline" className="text-[10px]">{v.topic}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VocabularyTab;
