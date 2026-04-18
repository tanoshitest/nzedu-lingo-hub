import { motion } from 'framer-motion';

const stats = [
  { value: '1,250+', label: 'Học viên đang học' },
  { value: '45', label: 'Lớp hoạt động' },
  { value: '30+', label: 'Giáo viên chuyên môn' },
  { value: '8', label: 'Năm kinh nghiệm' },
  { value: '98%', label: 'Học viên hài lòng' },
];

const StatsBar = () => {
  return (
    <section className="border-y border-border bg-card">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
