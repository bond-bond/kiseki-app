import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="lp-wrap">

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-logo">KISEKI</div>
          <p className="lp-tagline">軌跡を、奇跡に。</p>
          <h1>夢がなくていい。<br /><span>残りの時間で、何をする？</span></h1>
          <p className="lp-sub">インスタで憧れて終わりにしない。<br />あなたの「やりたいこと」を見つけて、実現するまで一緒に動こう。</p>
          <div className="lp-cta-group">
            <button className="lp-btn-primary" onClick={() => navigate('/app')}>
              無料で始める
            </button>
          </div>
          <p className="lp-note">登録不要・1分でスタート</p>
        </div>

        {/* 残り時間プレビュー */}
        <div className="lp-preview">
          <div className="lp-preview-label">あなたの人生タイムライン</div>
          <div className="lp-timeline-demo">
            <div className="lp-tl-bar">
              <div className="lp-tl-used" style={{width: '44%'}}>
                <span>44歳</span>
              </div>
              <div className="lp-tl-remaining">
                <span>残り約56年</span>
              </div>
            </div>
          </div>
          <div className="lp-countdown-demo">
            <div className="lp-cd-item">
              <span className="lp-cd-num">20,440</span>
              <span className="lp-cd-label">残り日数</span>
            </div>
            <div className="lp-cd-item">
              <span className="lp-cd-num">3</span>
              <span className="lp-cd-label">達成済み</span>
            </div>
            <div className="lp-cd-item">
              <span className="lp-cd-num">12</span>
              <span className="lp-cd-label">挑戦中</span>
            </div>
          </div>
        </div>
      </section>

      {/* 共感セクション */}
      <section className="lp-section lp-empathy">
        <div className="lp-inner">
          <div className="lp-label">こんな人に</div>
          <h2>「やりたいこと」が思いつかなくても大丈夫</h2>
          <div className="lp-cards">
            <div className="lp-card">😶 夢や目標を持ったことがない</div>
            <div className="lp-card">📱 インスタで「いいな」と思っても行動できない</div>
            <div className="lp-card">⏰ 気づいたら40代。このままでいいのか不安</div>
            <div className="lp-card">🗺️ 何から始めればいいかわからない</div>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section className="lp-section lp-features">
        <div className="lp-inner">
          <div className="lp-label">できること</div>
          <h2>残り時間を「見える化」して、動き出す</h2>
          <div className="lp-feature-grid">
            <div className="lp-feature">
              <div className="lp-feature-icon">⏳</div>
              <h3>残り時間タイムライン</h3>
              <p>生年月日を入力するだけで、人生のタイムラインと残り日数が表示される。「まだある」か「もうない」か、数字で実感する。</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">🎯</div>
              <h3>年代別バケットリスト</h3>
              <p>40代でやること・50代でやること・死ぬまでにやること。時間軸に沿って目標を配置できる。</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">🤖</div>
              <h3>AIロードマップ生成 <span className="lp-premium-badge">Premium</span></h3>
              <p>「友達を100人作りたい」→ Step1〜Step5の具体的な行動計画をAIが自動生成。何から始めればいいか迷わない。</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">💡</div>
              <h3>AIやりたいこと提案 <span className="lp-premium-badge">Premium</span></h3>
              <p>「何をしたいかわからない」人のために、年齢・性格から「あなたに合ったバケットリスト」をAIが提案する。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section className="lp-section lp-pricing" id="pricing">
        <div className="lp-inner">
          <div className="lp-label">料金</div>
          <h2>まず無料で、動き出そう</h2>
          <div className="lp-price-grid">
            <div className="lp-price-card">
              <div className="lp-price-name">無料版</div>
              <div className="lp-price-amount">¥0</div>
              <ul className="lp-price-list">
                <li>✅ 人生タイムライン表示</li>
                <li>✅ バケットリスト管理（無制限）</li>
                <li>✅ 年代別・カテゴリ管理</li>
                <li>✅ 完了チェック・達成記録</li>
              </ul>
              <button className="lp-btn-primary" onClick={() => navigate('/app')}>
                無料で始める
              </button>
            </div>
            <div className="lp-price-card lp-price-card-premium">
              <div className="lp-price-badge">おすすめ</div>
              <div className="lp-price-name">Premium</div>
              <div className="lp-price-amount">¥480<span>/月</span></div>
              <ul className="lp-price-list">
                <li>✅ 無料版のすべて</li>
                <li>✨ AIバケットリスト提案</li>
                <li>✨ AIロードマップ自動生成</li>
                <li>✨ 同じ目標の人と繋がる（近日公開）</li>
              </ul>
              <button className="lp-btn-gold" onClick={() => navigate('/app')}>
                Premiumを試す
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-section lp-final">
        <div className="lp-inner lp-center">
          <h2>今日が、軌跡の始まり。</h2>
          <p>夢がなくていい。まず、残り時間を見てみよう。</p>
          <button className="lp-btn-primary lp-btn-lg" onClick={() => navigate('/app')}>
            無料で始める
          </button>
        </div>
      </section>

      <footer className="lp-footer">
        <p>KISEKI — 軌跡を、奇跡に。</p>
      </footer>
    </div>
  )
}
