import { FileText, Download, BookOpen, Headphones, Video, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const materials = [
  { icon: BookOpen, name: 'Cambridge IELTS 17 - Full Set', type: 'PDF', size: '24 MB', category: 'Sách giáo trình', color: 'bg-primary/10 text-primary' },
  { icon: Headphones, name: 'IELTS Listening Practice Pack', type: 'MP3', size: '156 MB', category: 'Audio luyện tập', color: 'bg-info/10 text-info' },
  { icon: Video, name: 'Speaking Tips - Part 2 Cue Cards', type: 'MP4', size: '320 MB', category: 'Video bài giảng', color: 'bg-warning/10 text-warning' },
  { icon: FileText, name: 'Writing Task 2 - 50 Sample Essays', type: 'PDF', size: '8 MB', category: 'Tài liệu viết', color: 'bg-success/10 text-success' },
  { icon: FileSpreadsheet, name: 'Vocabulary Tracker Template', type: 'XLSX', size: '120 KB', category: 'Tài liệu hỗ trợ', color: 'bg-destructive/10 text-destructive' },
  { icon: BookOpen, name: 'Grammar in Use - Advanced', type: 'PDF', size: '18 MB', category: 'Sách giáo trình', color: 'bg-primary/10 text-primary' },
];

const TeacherMaterials = () => (
  <div className="space-y-6">
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="font-display">Thư viện tài liệu</CardTitle>
        <p className="text-sm text-muted-foreground">Tài liệu giảng dạy được chia sẻ trong hệ thống</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {materials.map((m) => (
            <div key={m.name} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg flex-shrink-0 ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{m.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-xs">{m.type}</Badge>
                  <span className="text-xs text-muted-foreground">{m.size}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default TeacherMaterials;
