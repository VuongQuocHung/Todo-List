import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <Link className="home-logo" to="/" aria-label="Todo App - Trang chủ">
          <span className="home-logo-mark">✓</span>
          Todo App
        </Link>

        <nav className="home-nav" aria-label="Điều hướng chính">
          <a className="home-features-link" href="#features">Tính năng</a>
          <Link className="home-login-link" to="/login">Đăng nhập</Link>
          <Link className="home-register-link" to="/register">Đăng ký</Link>
        </nav>
      </header>

      <main id="top">
        <section className="home-hero">
          <div className="home-hero-content">
            <p className="home-eyebrow">ĐƠN GIẢN · NHANH CHÓNG · DỄ SỬ DỤNG</p>
            <h1>Quản lý công việc mỗi ngày dễ dàng hơn.</h1>
            <p className="home-hero-description">
              Ghi lại việc cần làm, theo dõi tiến độ và hoàn thành từng mục tiêu
              trong một không gian gọn gàng.
            </p>

            <div className="home-actions">
              <Link className="home-primary-button" to="/register">
                Bắt đầu miễn phí
              </Link>
              <a className="home-secondary-button" href="#features">
                Xem tính năng
              </a>
            </div>
          </div>

          <div className="home-preview" aria-label="Minh họa danh sách công việc">
            <div className="home-preview-header">
              <div>
                <span>Hôm nay</span>
                <strong>Việc cần làm</strong>
              </div>
              <span className="home-task-count">3 việc</span>
            </div>

            <div className="home-task home-task-completed">
              <span className="home-checkbox">✓</span>
              <span>Kiểm tra email buổi sáng</span>
            </div>
            <div className="home-task">
              <span className="home-checkbox"></span>
              <span>Hoàn thành báo cáo tuần</span>
            </div>
            <div className="home-task">
              <span className="home-checkbox"></span>
              <span>Lên kế hoạch cho ngày mai</span>
            </div>
          </div>
        </section>

        <section className="home-features" id="features">
          <div className="home-section-heading">
            <p>TÍNH NĂNG CHÍNH</p>
            <h2>Mọi thứ bạn cần để tập trung</h2>
          </div>

          <div className="home-feature-grid">
            <article className="home-feature-card">
              <span>01</span>
              <h3>Quản lý công việc</h3>
              <p>Tạo, chỉnh sửa, hoàn thành và xóa công việc trong vài thao tác.</p>
            </article>
            <article className="home-feature-card">
              <span>02</span>
              <h3>Theo dõi tiến độ</h3>
              <p>Nhận biết nhanh việc đang làm và những mục tiêu đã hoàn thành.</p>
            </article>
            <article className="home-feature-card">
              <span>03</span>
              <h3>Dữ liệu riêng tư</h3>
              <p>Mỗi tài khoản chỉ truy cập danh sách công việc của chính mình.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <span>Todo App</span>
        <span>Biến kế hoạch thành hành động.</span>
      </footer>
    </div>
  );
};

