import { motion } from 'framer-motion';
import { Trophy, Mic, Briefcase, Baby, GraduationCap, Plane } from 'lucide-react';

const courses = [
  { icon: Trophy, name: 'IELTS', desc: 'Luyện thi IELTS từ 5.0 đến 8.0+', color: 'from-blue-500 to-cyan-500', level: 'Mọi trình độ' },
  { icon: Briefcase, name: 'TOEIC', desc: 'Đạt 750+ TOEIC trong 3 tháng', color: 'from-indigo-500 to-purple-500', level: 'Người đi làm' },
  { icon: Mic, name: 'Giao tiếp', desc: 'Phản xạ tự nhiên với giáo viên bản ngữ', color: 'from-pink-500 to-rose-500', level: 'Mọi lứa tuổi' },
  { icon: Baby, name: 'Tiếng Anh trẻ em', desc: 'Phương pháp Phonics & Cambridge', color: 'from-amber-500 to-orange-500', level: '5 - 12 tuổi' },
  { icon: GraduationCap, name: 'Tiếng Anh học thuật', desc: 'Nền tảng cho du học sinh', color: 'from-emerald-500 to-teal-500', level: 'Cấp 3 - Đại học' },
  { icon: Plane, name: 'Tiếng Anh du lịch', desc: 'Tự tin giao tiếp khi đi nước ngoài', color: 'from-sky-500 to-blue-500', level: 'Khóa ngắn hạn' },
];

const CoursesSection = () => {
  return (
    <section className="container py-20" id="courses">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm mb-4">
          <span className="text-primary font-medium">Khóa học</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Chương trình đào tạo đa dạng</h2>
        <p className="text-muted-foreground text-lg">Lộ trình học chuẩn quốc tế cho mọi độ tuổi và mục tiêu</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant transition-all hover:-translate-y-1"
          >
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${c.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-lg`}>
              <c.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-medium text-muted-foreground mb-1">{c.level}</div>
            <h3 className="font-display text-xl font-bold mb-2">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
