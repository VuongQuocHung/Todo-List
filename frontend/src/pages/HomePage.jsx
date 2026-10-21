import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const FEATURES = [
  { no: '01', title: 'Quản lý công việc', desc: 'Tạo, chỉnh sửa, hoàn thành và xóa công việc trong vài thao tác.' },
  { no: '02', title: 'Theo dõi tiến độ', desc: 'Nhận biết nhanh việc đang làm và những mục tiêu đã hoàn thành.' },
  { no: '03', title: 'Dữ liệu riêng tư', desc: 'Mỗi tài khoản chỉ truy cập danh sách công việc của chính mình.' },
];

const PREVIEW_TASKS = [
  { title: 'Kiểm tra email buổi sáng', completed: true },
  { title: 'Hoàn thành báo cáo tuần', completed: false },
  { title: 'Lên kế hoạch cho ngày mai', completed: false },
];

export const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <main id="top">
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-8 md:py-20">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[1.8px] text-primary-container">
              ĐƠN GIẢN · NHANH CHÓNG · DỄ SỬ DỤNG
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-on-surface md:text-6xl">
              Quản lý công việc mỗi ngày dễ dàng hơn.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant">
              Ghi lại việc cần làm, theo dõi tiến độ và hoàn thành từng mục tiêu
              trong một không gian gọn gàng.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-12 items-center rounded-lg bg-primary-container px-5 font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary"
                to="/register"
              >
                Bắt đầu miễn phí
              </Link>
              <a
                className="inline-flex h-12 items-center rounded-lg bg-surface-container-lowest px-5 font-semibold text-on-surface shadow-sm ring-1 ring-outline-variant/60 transition-colors hover:bg-surface-container-low"
                href="#features"
              >
                Xem tính năng
              </a>
            </div>
          </div>

          <div
            className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_24px_70px_rgba(30,64,175,0.13)]"
            aria-label="Minh họa danh sách công việc"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant">Hôm nay</span>
                <strong className="text-xl font-semibold">Việc cần làm</strong>
              </div>
              <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-xs font-semibold text-on-primary-fixed-variant">
                3 việc
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {PREVIEW_TASKS.map((task) => (
                <div
                  key={task.title}
                  className={`flex items-center gap-3 rounded-lg bg-surface-container-low px-3 py-3 ${
                    task.completed ? 'text-on-surface-variant line-through' : ''
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                      task.completed ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-high'
                    }`}
                  >
                    {task.completed && <Check size={14} />}
                  </span>
                  <span>{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest px-4 py-20" id="features">
          <div className="mx-auto max-w-5xl md:px-4">
            <p className="mb-4 text-xs font-bold tracking-[1.8px] text-primary-container">TÍNH NĂNG CHÍNH</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Mọi thứ bạn cần để tập trung</h2>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <article key={feature.no} className="rounded-xl bg-surface p-6">
                  <span className="text-xs font-bold text-primary-container">{feature.no}</span>
                  <h3 className="mb-2 mt-8 text-lg font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-on-surface-variant">{feature.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-low">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1 px-4 py-6 text-xs text-on-surface-variant sm:flex-row md:px-8">
          <span>© 2025 Todo App</span>
          <span>Biến kế hoạch thành hành động.</span>
        </div>
      </footer>
    </div>
  );
};
