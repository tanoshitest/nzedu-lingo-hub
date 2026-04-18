import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  { name: 'Hoàng Minh Đức', course: 'IELTS 7.5', text: 'Sau 6 tháng tại NZedu, mình đã đạt IELTS 7.5 và nhận học bổng du học Úc. Giáo viên rất tận tâm và lộ trình học rõ ràng.', rating: 5 },
  { name: 'Vũ Thị Hà', course: 'TOEIC 850', text: 'Mình từ TOEIC 450 lên 850 chỉ sau 4 tháng. Phương pháp học tại NZedu giúp mình tự tin trong công việc tại công ty đa quốc gia.', rating: 5 },
  { name: 'Đỗ Quang Huy', course: 'Giao tiếp', text: 'Lớp ít học viên, được nói nhiều với giáo viên bản ngữ. Giờ mình đã có thể trò chuyện thoải mái với khách nước ngoài.', rating: 5 },
];

const TestimonialsSection = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm mb-4">
            <span className="text-primary font-medium">Học viên nói gì</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Niềm tin từ hơn 1,250 học viên</h2>
          <p className="text-muted-foreground text-lg">Câu chuyện thành công thực tế từ các bạn đã học tại NZedu</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant transition-all"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-foreground/90">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="h-10 w-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-primary font-medium">{t.course}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
