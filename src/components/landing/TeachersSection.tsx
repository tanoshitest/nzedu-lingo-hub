import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const teachers = [
  { name: 'Ms. Sarah Johnson', role: 'Giáo viên IELTS Speaking', country: '🇬🇧 Anh', exp: '8 năm', cert: 'IELTS 9.0, CELTA' },
  { name: 'Mr. David Brown', role: 'Giáo viên Academic Writing', country: '🇺🇸 Mỹ', exp: '10 năm', cert: 'MA TESOL' },
  { name: 'Cô Lê Hoàng Cường', role: 'Trưởng bộ môn IELTS', country: '🇻🇳 Việt Nam', exp: '12 năm', cert: 'IELTS 8.5, MA Linguistics' },
  { name: 'Cô Phạm Mai Dung', role: 'Giáo viên TOEIC', country: '🇻🇳 Việt Nam', exp: '7 năm', cert: 'TOEIC 990, TESOL' },
];

const TeachersSection = () => {
  return (
    <section className="container py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm mb-4">
          <span className="text-primary font-medium">Đội ngũ giảng viên</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Học cùng những người giỏi nhất</h2>
        <p className="text-muted-foreground text-lg">Giáo viên bản ngữ và Việt Nam được tuyển chọn khắt khe</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teachers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-elegant transition-all hover:-translate-y-1"
          >
            <div className="aspect-square gradient-card relative flex items-center justify-center">
              <div className="font-display text-6xl font-bold text-primary/30">
                {t.name.split(' ').slice(-2, -1)[0]?.[0]}{t.name.split(' ').slice(-1)[0]?.[0]}
              </div>
              <div className="absolute top-3 right-3 rounded-full bg-card px-2 py-1 text-xs font-medium shadow-sm">
                {t.country}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display font-bold mb-1">{t.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t.role}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.exp} kinh nghiệm</span>
                <div className="flex items-center gap-1 text-warning">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="font-medium">5.0</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-primary font-medium">
                {t.cert}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeachersSection;
