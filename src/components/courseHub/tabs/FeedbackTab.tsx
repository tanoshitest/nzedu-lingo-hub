import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Star } from 'lucide-react';
import { courseFeedbacks } from '@/data/mockCourseHub';
import { cn } from '@/lib/utils';
import type { TabContext } from '../shared/TabContext';

const FeedbackTab = ({ course, role }: TabContext) => {
  const list = courseFeedbacks.filter((f) => f.courseCode === course.code);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const submit = () => {
    if (!comment.trim()) return toast.error('Vui lòng nhập nhận xét');
    toast.success('Đã gửi feedback. Cảm ơn bạn!');
    setComment('');
  };

  return (
    <div className="space-y-4">
      {role === 'Student' && (
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Đánh giá khoá học</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Mức độ hài lòng</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} onClick={() => setRating(i)}>
                    <Star className={cn('h-6 w-6 transition', i <= rating ? 'fill-warning text-warning' : 'text-muted-foreground')} />
                  </button>
                ))}
              </div>
            </div>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Chia sẻ cảm nhận của bạn về khoá học..." rows={4} />
            <Button onClick={submit} className="w-full">Gửi đánh giá</Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Feedback từ học viên khác ({list.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {list.map((f) => (
            <div key={f.id} className="p-3 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">{f.studentName}</div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('h-3 w-3', i < f.rating ? 'fill-warning text-warning' : 'text-muted-foreground')} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{f.comment}</p>
              <div className="text-[11px] text-muted-foreground mt-1">{f.createdAt}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackTab;
