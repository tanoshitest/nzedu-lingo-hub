import { motion } from 'framer-motion';
import { Award, Clock, Headphones, ShieldCheck } from 'lucide-react';

const reasons = [
  { icon: Award, title: 'Giáo viên chuẩn quốc tế', desc: 'Đội ngũ giáo viên bản ngữ và Việt Nam có chứng chỉ IELTS 8.0+, TESOL, CELTA.' },
  { icon: Clock, title: 'Lịch học linh hoạt', desc: 'Hơn 200 ca học mỗi tuần, sáng - chiều - tối, online & offline tùy chọn.' },
  { icon: Headphones, title: 'Hỗ trợ 1-1', desc: 'Mỗi học viên có giáo vụ riêng theo dõi tiến độ, nhắc lịch và tư vấn lộ trình.' },
  { icon: ShieldCheck, title: 'Cam kết đầu ra', desc: 'Hoàn 100% học phí nếu không đạt mục tiêu cam kết sau khóa học.' },
];

const WhyUsSection = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 gradient-subtle" />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm mb-4">
            <span className="text-primary font-medium">Vì sao chọn NZedu</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Học một lần, lợi ích trọn đời</h2>
          <p className="text-muted-foreground text-lg">4 lý do hơn 1,250 học viên đã tin chọn NZedu</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant transition-all"
            >
              <div className="h-14 w-14 rounded-2xl gradient-hero flex items-center justify-center mb-4 shadow-glow">
                <r.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
