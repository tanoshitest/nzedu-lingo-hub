import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Role } from '@/data/mockData';

interface CtaSectionProps {
  onLogin: (role: Role) => void;
}

const CtaSection = ({ onLogin }: CtaSectionProps) => {
  return (
    <section className="container py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 shadow-elegant"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              Sẵn sàng chinh phục tiếng Anh cùng NZedu?
            </h2>
            <p className="text-primary-foreground/90 text-lg">
              Đăng ký nhận tư vấn lộ trình học miễn phí và 1 buổi học thử với giáo viên bản ngữ ngay hôm nay.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" variant="secondary" className="w-full md:w-auto shadow-lg">
                  Đăng ký học thử miễn phí
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onLogin('Student')}>Vào với vai trò Học viên</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLogin('Teacher')}>Vào với vai trò Giáo viên</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLogin('Coordinator')}>Vào với vai trò Giáo vụ</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLogin('Admin')}>Vào với vai trò Quản trị</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="tel:19006868" className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground font-medium">
              <Phone className="h-4 w-4" />
              Hoặc gọi 1900 6868
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
