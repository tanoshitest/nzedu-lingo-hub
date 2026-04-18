import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'Học phí một khóa học tại NZedu là bao nhiêu?', a: 'Học phí dao động từ 3.500.000đ đến 12.000.000đ tùy theo khóa học và thời lượng. Vui lòng liên hệ tư vấn để nhận báo giá chi tiết và ưu đãi mới nhất.' },
  { q: 'Tôi có thể học thử trước khi đăng ký không?', a: 'Có. NZedu tặng 1 buổi học thử miễn phí và bài kiểm tra trình độ đầu vào để bạn lựa chọn lớp phù hợp nhất.' },
  { q: 'Trung tâm có chính sách hoàn tiền không?', a: 'Có. NZedu cam kết đầu ra bằng văn bản. Nếu không đạt mục tiêu, bạn được học lại miễn phí hoặc hoàn 100% học phí.' },
  { q: 'Lớp học có bao nhiêu học viên?', a: 'Mỗi lớp tối đa 12 học viên để đảm bảo giáo viên có thể quan tâm sát sao đến từng người.' },
  { q: 'Tôi có thể chuyển lớp hoặc bảo lưu khóa học không?', a: 'Có. Bạn được chuyển lớp 1 lần miễn phí và bảo lưu tối đa 6 tháng nếu có lý do chính đáng.' },
  { q: 'Có hỗ trợ học online không?', a: 'Có. Tất cả khóa học đều có lựa chọn online qua nền tảng Zoom + LMS riêng của NZedu, ghi hình lại bài giảng.' },
];

const FaqSection = () => {
  return (
    <section className="container py-20" id="faq">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm mb-4">
            <span className="text-primary font-medium">Câu hỏi thường gặp</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Bạn còn băn khoăn?</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Những câu hỏi phổ biến nhất từ phụ huynh và học viên trước khi đăng ký khóa học tại NZedu.
          </p>
          <p className="text-sm text-muted-foreground">
            Không tìm thấy câu trả lời? Gọi <span className="text-primary font-semibold">1900 6868</span> để được tư vấn miễn phí.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-semibold hover:text-primary">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
