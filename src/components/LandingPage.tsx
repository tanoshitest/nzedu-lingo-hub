import { GraduationCap, Sparkles, Users, BookOpen, TrendingUp, Globe, Mail, MapPin, Phone, Facebook, Youtube, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import type { Role } from '@/data/mockData';
import StatsBar from './landing/StatsBar';
import CoursesSection from './landing/CoursesSection';
import WhyUsSection from './landing/WhyUsSection';
import TeachersSection from './landing/TeachersSection';
import TestimonialsSection from './landing/TestimonialsSection';
import FaqSection from './landing/FaqSection';
import CtaSection from './landing/CtaSection';

interface LandingPageProps {
  onLogin: (role: Role) => void;
}

const features = [
  { icon: Users, title: 'Quản lý học viên', desc: 'Theo dõi tiến độ học tập của hơn 1,250 học viên' },
  { icon: BookOpen, title: 'Báo cáo lớp học', desc: 'Quy trình duyệt báo cáo minh bạch & hiệu quả' },
  { icon: TrendingUp, title: 'Phân tích dữ liệu', desc: 'Báo cáo doanh thu và đăng ký theo thời gian thực' },
  { icon: Globe, title: 'Đa vai trò', desc: 'Hỗ trợ Quản trị, Giáo vụ, Giáo viên & Học viên' },
];

const LandingPage = ({ onLogin }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero shadow-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">NZedu LMS</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="lg" className="gradient-hero shadow-elegant">
                Đăng nhập
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Chọn vai trò</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onLogin('Admin')} className="cursor-pointer">
                Đăng nhập Quản trị viên
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogin('Coordinator')} className="cursor-pointer">
                Đăng nhập Giáo vụ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogin('Teacher')} className="cursor-pointer">
                Đăng nhập Giáo viên
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogin('Student')} className="cursor-pointer">
                Đăng nhập Học viên
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-info/10 blur-3xl" />
        
        <div className="container relative py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Nền tảng quản lý trung tâm tiếng Anh #1</span>
              </div>
              
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Hệ sinh thái học tập{' '}
                <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                  toàn diện NZedu
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                Giải pháp quản lý trung tâm Anh ngữ hiện đại, kết nối Quản trị viên, Giáo vụ, Giáo viên và Học viên trên một nền tảng duy nhất.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="lg" className="gradient-hero shadow-elegant">
                      Bắt đầu ngay
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onLogin('Admin')}>Quản trị viên</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLogin('Coordinator')}>Giáo vụ</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLogin('Teacher')}>Giáo viên</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLogin('Student')}>Học viên</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="lg" variant="outline">Tìm hiểu thêm</Button>
              </div>

              <div className="flex gap-8 pt-6">
                <div>
                  <div className="font-display text-3xl font-bold text-primary">1,250+</div>
                  <div className="text-sm text-muted-foreground">Học viên</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">Lớp đang hoạt động</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Hài lòng</div>
                </div>
              </div>
            </motion.div>

            {/* Abstract illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Floating cards */}
                <div className="absolute inset-0 gradient-card rounded-3xl shadow-elegant" />
                
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-8 left-8 right-20 rounded-2xl bg-card p-5 shadow-elegant border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Tổng học viên</div>
                      <div className="font-display text-2xl font-bold">1,250</div>
                    </div>
                    <div className="text-success text-sm font-medium">+12%</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-1/2 right-4 left-24 rounded-2xl bg-card p-5 shadow-elegant border border-border"
                >
                  <div className="text-xs text-muted-foreground mb-2">Đăng ký theo tháng</div>
                  <div className="flex items-end gap-1.5 h-16">
                    {[40, 65, 50, 80, 70, 95, 85].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary to-info" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-8 left-12 right-32 rounded-2xl bg-card p-4 shadow-elegant border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-success/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Báo cáo đã duyệt</div>
                      <div className="font-semibold">128 báo cáo</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar />

      {/* Courses */}
      <CoursesSection />

      {/* Why us */}
      <WhyUsSection />

      {/* Teachers */}
      <TeachersSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Platform features for management */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm mb-4">
            <span className="text-primary font-medium">Nền tảng quản lý</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Mọi thứ bạn cần để vận hành</h2>
          <p className="text-muted-foreground text-lg">Một nền tảng duy nhất cho mọi vai trò trong trung tâm</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl gradient-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <CtaSection onLogin={onLogin} />

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero shadow-glow">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">NZedu LMS</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Hệ sinh thái học tập tiếng Anh toàn diện cho mọi lứa tuổi.
              </p>
              <div className="flex gap-3">
                <a href="#" className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Khóa học</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#courses" className="hover:text-primary">Luyện thi IELTS</a></li>
                <li><a href="#courses" className="hover:text-primary">Luyện thi TOEIC</a></li>
                <li><a href="#courses" className="hover:text-primary">Tiếng Anh giao tiếp</a></li>
                <li><a href="#courses" className="hover:text-primary">Tiếng Anh trẻ em</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Về NZedu</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-primary">Đội ngũ giáo viên</a></li>
                <li><a href="#" className="hover:text-primary">Tin tức & Blog</a></li>
                <li><a href="#faq" className="hover:text-primary">Câu hỏi thường gặp</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Liên hệ</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>123 Nguyễn Văn Linh, Q.7, TP.HCM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="tel:19006868" className="hover:text-primary">1900 6868</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="mailto:hello@nzedu.vn" className="hover:text-primary">hello@nzedu.vn</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
            © 2026 NZedu LMS. Hệ thống quản lý trung tâm Anh ngữ. Mọi quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
