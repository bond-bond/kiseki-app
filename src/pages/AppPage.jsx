import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AppPage.css'

const CATEGORIES = [
  { id: 'travel',   label: '旅行・体験', emoji: '✈️' },
  { id: 'health',   label: '健康・体',   emoji: '💪' },
  { id: 'learn',    label: '学ぶ・挑戦', emoji: '📚' },
  { id: 'people',   label: '人・繋がり', emoji: '🤝' },
  { id: 'create',   label: '創る・作る', emoji: '🎨' },
  { id: 'money',    label: 'お金・仕事', emoji: '💰' },
  { id: 'other',    label: 'その他',     emoji: '⭐' },
]

const PRESET_STEPS = {
  '海外に一人旅をする': ['パスポートを取得・更新する', '行き先を1か国決める', '航空券・宿を予約する', '旅行保険に加入する', '出発！帰国後に記録をつける'],
  '富士山に登る': ['体力づくりを3か月続ける', '登山グッズ（靴・レインウェア）を揃える', '低山でトレーニング登山する', '富士山の登山シーズン（7〜9月）を確認する', '登山ルートを予約・出発する'],
  '温泉地を10か所制覇する': ['行きたい温泉地リストを10か所作る', '最初の1か所を予約・訪問する', '訪問記録をつけはじめる', '5か所達成', '10か所制覇'],
  '沖縄の海でシュノーケリング': ['沖縄行きの時期を決める（7〜9月がベスト）', '航空券・宿を予約する', 'シュノーケルセットを準備する', '現地でツアーに申込む', '沖縄の海に飛び込む'],
  '全国47都道府県を制覇する': ['現在行ったことがある都道府県を数える', '未訪問の近場から計画を立てる', '25都道府県達成', '残り10県を計画する', '47都道府県完全制覇'],
  'フルマラソンを完走する': ['毎日30分ウォーキングを1か月続ける', '5kmを走れるようになる', '10kmレースに出場する', 'ハーフマラソンを完走する', 'フルマラソンにエントリーして完走'],
  '体脂肪率15%以下を達成する': ['現在の体脂肪率を測定・記録する', '食事記録を2週間つける', '筋トレを週3回習慣にする', '有酸素運動を週2回追加する', '体脂肪率15%以下を達成する'],
  '筋トレを1年続ける': ['ジムを探して入会する', '1か月継続する', '3か月継続する', '半年（180日）継続する', '1年（365日）達成'],
  '禁酒を3か月続ける': ['飲酒ゼロの日を週2日作る', '1か月間禁酒を達成する', '2か月継続する', '3か月完全禁酒達成'],
  'ギターを弾けるようになる': ['ギターを購入する', 'コードC・G・Amを覚える', '好きな曲のコードを練習する', '1曲を最初から最後まで弾く', '人前で演奏する'],
  '英語で日常会話ができるようになる': ['英語学習アプリを毎日15分始める', '英単語1000語を覚える', 'オンライン英会話を週1回始める', '外国人と10分会話できるようになる', '日常会話がスラスラできるようになる'],
  '料理を1品マスターする': ['作りたい料理を1つ決める', 'レシピを調べて材料を買う', '3回作って慣れる', '自分流にアレンジしてみる', '誰かに食べさせて「おいしい」をもらう'],
  'プログラミングで何か作る': ['作りたいものを1つ決める', '学習教材を1つ選ぶ', '基礎文法を2週間で学ぶ', '小さなアプリを作り始める', 'デプロイして公開する'],
  '友達を100人作る': ['今の友達リストを数える', '知人に声をかけて飲み会を1回企画する', '新しいコミュニティに1つ参加する', '50人突破', '100人達成'],
  '行きつけのバーを作る': ['近所のバーを3軒試してみる', 'マスターと会話できる店を見つける', '週1で同じ店に通う', '顔と名前を覚えてもらう', '「いつもの」が通じるようになる'],
  '10年ぶりの友人に連絡する': ['連絡先（SNS・電話番号）を探す', '近況報告のメッセージを送る', '返信が来たら会う約束をする', '実際に再会する'],
  'noteに記事を100本書く': ['noteアカウントを作る', '最初の1本を書いて公開する', '10本達成', '50本達成', '100本達成'],
  '写真集を自費出版する': ['テーマを決める', '写真を100枚撮りためる', '自費出版サービスを比較・選ぶ', '編集・レイアウトする', '注文して完成'],
  'アプリを1本リリースする': ['作るアプリのアイデアを決める', '技術スタックを選ぶ', 'MVP（最小版）を2週間で作る', 'ユーザーにフィードバックをもらう', 'ストアに申請してリリース'],
  '副業で月1万円稼ぐ': ['副業の種類を決める', 'プラットフォームに登録する', '最初の案件・販売を始める', '初売上を達成する', '月1万円を継続的に稼ぐ'],
  '資産1000万円を達成する': ['現在の総資産を把握する', '毎月の貯蓄目標額を決める', '投資を始める（インデックス投信など）', '500万達成', '1000万達成'],
  'ペットを飼う': ['飼いたいペットを決める', '生活環境・費用を調べる', 'ペットショップ・譲渡会に行く', '迎え入れる準備をする', '家族の一員として迎え入れる'],
  '引っ越して新しい街に住む': ['住みたいエリア・条件を絞る', 'SUUMOなどで物件を探す', '気になる物件を3件内見する', '契約する', '引っ越して新生活スタート'],
  '毎日日記をつける': ['日記帳またはアプリを選ぶ', '1週間続ける', '1か月継続する', '3か月継続する', '習慣として完全定着する'],
}

const PRESETS = [
  { category: 'travel',  title: '海外に一人旅をする',        targetAge: '' },
  { category: 'travel',  title: '富士山に登る',              targetAge: '50' },
  { category: 'travel',  title: '温泉地を10か所制覇する',    targetAge: '' },
  { category: 'travel',  title: '沖縄の海でシュノーケリング',targetAge: '' },
  { category: 'travel',  title: '全国47都道府県を制覇する',  targetAge: '' },
  { category: 'health',  title: 'フルマラソンを完走する',    targetAge: '50' },
  { category: 'health',  title: '体脂肪率15%以下を達成する', targetAge: '' },
  { category: 'health',  title: '筋トレを1年続ける',         targetAge: '' },
  { category: 'health',  title: '禁酒を3か月続ける',         targetAge: '' },
  { category: 'learn',   title: 'ギターを弾けるようになる',  targetAge: '' },
  { category: 'learn',   title: '英語で日常会話ができるようになる', targetAge: '' },
  { category: 'learn',   title: '料理を1品マスターする',     targetAge: '' },
  { category: 'learn',   title: 'プログラミングで何か作る',  targetAge: '' },
  { category: 'people',  title: '友達を100人作る',           targetAge: '' },
  { category: 'people',  title: '行きつけのバーを作る',      targetAge: '' },
  { category: 'people',  title: '10年ぶりの友人に連絡する',  targetAge: '' },
  { category: 'create',  title: 'noteに記事を100本書く',     targetAge: '' },
  { category: 'create',  title: '写真集を自費出版する',      targetAge: '' },
  { category: 'create',  title: 'アプリを1本リリースする',   targetAge: '' },
  { category: 'money',   title: '副業で月1万円稼ぐ',         targetAge: '' },
  { category: 'money',   title: '資産1000万円を達成する',    targetAge: '' },
  { category: 'other',   title: 'ペットを飼う',              targetAge: '' },
  { category: 'other',   title: '引っ越して新しい街に住む',  targetAge: '' },
  { category: 'other',   title: '毎日日記をつける',          targetAge: '' },
]

const DECADES = ['10代', '20代', '30代', '40代', '50代', '60代', '70代以降', '死ぬまでに']

function calcRemaining(birthYear) {
  const now = new Date()
  const age = now.getFullYear() - birthYear
  const lifespan = 80
  const remainingYears = Math.max(0, lifespan - age)
  const remainingDays = Math.round(remainingYears * 365.25)
  const usedPct = Math.min(100, Math.round((age / lifespan) * 100))
  return { age, remainingYears, remainingDays, usedPct }
}

function getDecade(targetAge) {
  if (!targetAge) return '死ぬまでに'
  const age = parseInt(targetAge)
  if (age < 20) return '10代'
  if (age < 30) return '20代'
  if (age < 40) return '30代'
  if (age < 50) return '40代'
  if (age < 60) return '50代'
  if (age < 70) return '60代'
  return '70代以降'
}

export default function AppPage() {
  const navigate = useNavigate()
  const [birthYear, setBirthYear]   = useState(() => localStorage.getItem('kiseki_birthYear') || '')
  const [items, setItems]           = useState(() => JSON.parse(localStorage.getItem('kiseki_items') || '[]'))
  const [showForm, setShowForm]     = useState(false)
  const [formMode, setFormMode]     = useState('preset')
  const [filterCat, setFilterCat]   = useState('all')
  const [filter, setFilter]         = useState('all')
  const [newItem, setNewItem]       = useState({ title: '', targetAge: '', category: 'other', memo: '' })
  const [celebrated, setCelebrated] = useState(null)
  const [setupDone, setSetupDone]   = useState(() => !!localStorage.getItem('kiseki_birthYear'))
  const [openSteps, setOpenSteps]   = useState(new Set())

  const stats = birthYear ? calcRemaining(parseInt(birthYear)) : null

  useEffect(() => {
    localStorage.setItem('kiseki_items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (birthYear) localStorage.setItem('kiseki_birthYear', birthYear)
  }, [birthYear])

  function saveBirthYear() {
    if (!birthYear) return
    setSetupDone(true)
  }

  function addItem(overrides = {}) {
    const data = { ...newItem, ...overrides }
    if (!data.title.trim()) return
    const stepTexts = PRESET_STEPS[data.title.trim()] || []
    const item = {
      id: Date.now(),
      title: data.title.trim(),
      targetAge: data.targetAge,
      category: data.category,
      memo: data.memo || '',
      done: false,
      createdAt: new Date().toISOString(),
      steps: stepTexts.map(text => ({ text, done: false })),
    }
    setItems(prev => [item, ...prev])
    setNewItem({ title: '', targetAge: '', category: 'other', memo: '' })
    setShowForm(false)
    if (item.steps.length > 0) {
      setOpenSteps(prev => new Set([...prev, item.id]))
    }
  }

  function addPreset(preset) {
    addItem({ title: preset.title, targetAge: preset.targetAge, category: preset.category })
  }

  function toggleDone(id) {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      if (!item.done) setCelebrated(id)
      return { ...item, done: !item.done }
    }))
    setTimeout(() => setCelebrated(null), 2000)
  }

  function toggleStep(itemId, stepIndex) {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item
      const steps = item.steps.map((s, i) => i === stepIndex ? { ...s, done: !s.done } : s)
      return { ...item, steps }
    }))
  }

  function toggleStepsOpen(id) {
    setOpenSteps(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const filtered = filter === 'all' ? items
    : filter === 'done' ? items.filter(i => i.done)
    : items.filter(i => !i.done)

  const groupedByDecade = DECADES.reduce((acc, d) => {
    acc[d] = filtered.filter(i => getDecade(i.targetAge) === d)
    return acc
  }, {})

  if (!setupDone) {
    return (
      <div className="ap-setup">
        <div className="ap-setup-card">
          <div className="ap-logo" onClick={() => navigate('/')}>KISEKI</div>
          <h1>生まれた年を教えてください</h1>
          <p>残りの時間を計算して、あなただけのタイムラインを作ります。</p>
          <select
            className="ap-select"
            value={birthYear}
            onChange={e => setBirthYear(e.target.value)}
          >
            <option value="">年を選ぶ</option>
            {Array.from({ length: 80 }, (_, i) => 2010 - i).map(y => (
              <option key={y} value={y}>{y}年生まれ</option>
            ))}
          </select>
          <button className="ap-btn-primary" onClick={saveBirthYear} disabled={!birthYear}>
            タイムラインを見る →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ap-wrap">

      {/* ヘッダー */}
      <header className="ap-header">
        <div className="ap-logo" onClick={() => navigate('/')}>KISEKI</div>
        <button className="ap-btn-add" onClick={() => setShowForm(true)}>+ 追加</button>
      </header>

      {/* タイムラインバー */}
      {stats && (
        <div className="ap-timeline">
          <div className="ap-tl-info">
            <span className="ap-tl-age">{stats.age}歳</span>
            <span className="ap-tl-days"><strong>{stats.remainingDays.toLocaleString()}</strong> 日残ってる</span>
            <span className="ap-tl-years">（約{stats.remainingYears}年）</span>
          </div>
          <div className="ap-tl-bar">
            <div className="ap-tl-used" style={{ width: stats.usedPct + '%' }} />
            <div className="ap-tl-rest" style={{ width: (100 - stats.usedPct) + '%' }} />
          </div>
          <div className="ap-tl-labels">
            <span>0歳</span>
            <span>人生80年として計算</span>
            <span>80歳</span>
          </div>
        </div>
      )}

      {/* サマリー */}
      <div className="ap-summary">
        <div className="ap-sum-item">
          <span className="ap-sum-num">{items.length}</span>
          <span className="ap-sum-label">リスト</span>
        </div>
        <div className="ap-sum-item">
          <span className="ap-sum-num ap-sum-done">{items.filter(i => i.done).length}</span>
          <span className="ap-sum-label">達成</span>
        </div>
        <div className="ap-sum-item">
          <span className="ap-sum-num">{items.filter(i => !i.done).length}</span>
          <span className="ap-sum-label">挑戦中</span>
        </div>
      </div>

      {/* フィルター */}
      <div className="ap-filter">
        {[['all', 'すべて'], ['active', '未達成'], ['done', '達成済み']].map(([key, label]) => (
          <button
            key={key}
            className={'ap-filter-btn' + (filter === key ? ' active' : '')}
            onClick={() => setFilter(key)}
          >{label}</button>
        ))}
      </div>

      {/* バケットリスト（年代別） */}
      <div className="ap-list">
        {items.length === 0 ? (
          <div className="ap-empty">
            <p>まだ何もない。それでいい。</p>
            <p>「やりたいこと」がなくても大丈夫。<br />思いついたことを、ひとつだけ追加してみよう。</p>
            <button className="ap-btn-primary ap-btn-start" onClick={() => setShowForm(true)}>
              最初の1つを追加する
            </button>
          </div>
        ) : (
          DECADES.map(decade => {
            const decadeItems = groupedByDecade[decade]
            if (decadeItems.length === 0) return null
            return (
              <div key={decade} className="ap-decade">
                <div className="ap-decade-label">{decade}</div>
                {decadeItems.map(item => {
                  const cat = CATEGORIES.find(c => c.id === item.category)
                  const steps = item.steps || []
                  const doneCnt = steps.filter(s => s.done).length
                  const isOpen = openSteps.has(item.id)
                  return (
                    <div key={item.id} className={'ap-item' + (item.done ? ' ap-item-done' : '') + (celebrated === item.id ? ' ap-item-celebrate' : '')}>
                      <button className="ap-check" onClick={() => toggleDone(item.id)}>
                        {item.done ? '✅' : '⭕'}
                      </button>
                      <div className="ap-item-body">
                        <div className="ap-item-title">{item.title}</div>
                        <div className="ap-item-meta">
                          <span className="ap-item-cat">{cat ? cat.emoji + ' ' + cat.label : ''}</span>
                          {item.targetAge && <span className="ap-item-age">{item.targetAge}歳まで</span>}
                        </div>
                        {item.memo && <div className="ap-item-memo">{item.memo}</div>}

                        {/* ロードマップ */}
                        {steps.length > 0 && (
                          <button className="ap-steps-bar" onClick={() => toggleStepsOpen(item.id)}>
                            <span className="ap-steps-label">📋 ロードマップ</span>
                            <div className="ap-steps-mini-track">
                              <div className="ap-steps-mini-fill" style={{ width: (doneCnt / steps.length * 100) + '%' }} />
                            </div>
                            <span className="ap-steps-count">{doneCnt}/{steps.length}</span>
                            <span className="ap-steps-toggle">{isOpen ? '▲' : '▼'}</span>
                          </button>
                        )}
                        {isOpen && steps.length > 0 && (
                          <div className="ap-steps-list">
                            {steps.map((step, si) => (
                              <button
                                key={si}
                                className={'ap-step' + (step.done ? ' ap-step-done' : '')}
                                onClick={() => toggleStep(item.id, si)}
                              >
                                <span className="ap-step-check">{step.done ? '✅' : '○'}</span>
                                <span className="ap-step-text">{step.text}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="ap-delete" onClick={() => deleteItem(item.id)}>×</button>
                    </div>
                  )
                })}
              </div>
            )
          })
        )}
      </div>

      {/* 追加モーダル */}
      {showForm && (
        <div className="ap-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="ap-modal" onClick={e => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h2>やりたいことを追加</h2>
              <button className="ap-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="ap-mode-tabs">
              <button
                className={'ap-mode-tab' + (formMode === 'preset' ? ' active' : '')}
                onClick={() => setFormMode('preset')}
              >リストから選ぶ</button>
              <button
                className={'ap-mode-tab' + (formMode === 'custom' ? ' active' : '')}
                onClick={() => setFormMode('custom')}
              >自分で入力する</button>
            </div>

            {formMode === 'preset' ? (
              <div className="ap-preset-wrap">
                <div className="ap-preset-cats">
                  <button
                    className={'ap-preset-cat' + (filterCat === 'all' ? ' active' : '')}
                    onClick={() => setFilterCat('all')}
                  >すべて</button>
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      className={'ap-preset-cat' + (filterCat === c.id ? ' active' : '')}
                      onClick={() => setFilterCat(c.id)}
                    >{c.emoji}</button>
                  ))}
                </div>
                <div className="ap-preset-list">
                  {PRESETS.filter(p => filterCat === 'all' || p.category === filterCat).map((p, i) => {
                    const cat = CATEGORIES.find(c => c.id === p.category)
                    const already = items.some(it => it.title === p.title)
                    const hasSteps = !!PRESET_STEPS[p.title]
                    return (
                      <button
                        key={i}
                        className={'ap-preset-item' + (already ? ' ap-preset-added' : '')}
                        onClick={() => !already && addPreset(p)}
                        disabled={already}
                      >
                        <span className="ap-preset-emoji">{cat ? cat.emoji : '⭐'}</span>
                        <div className="ap-preset-body">
                          <span className="ap-preset-title">{p.title}</span>
                          {hasSteps && !already && (
                            <span className="ap-preset-steps-hint">📋 ロードマップ付き</span>
                          )}
                        </div>
                        <span className="ap-preset-check">{already ? '✅' : '+'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="ap-custom-wrap">
                <input
                  className="ap-input"
                  placeholder="例：屋久島に行く、友達を100人作る..."
                  value={newItem.title}
                  onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                  autoFocus
                />
                <div className="ap-form-row">
                  <div className="ap-form-col">
                    <label className="ap-form-label">目標年齢（任意）</label>
                    <select
                      className="ap-select"
                      value={newItem.targetAge}
                      onChange={e => setNewItem(p => ({ ...p, targetAge: e.target.value }))}
                    >
                      <option value="">いつかやる</option>
                      {Array.from({ length: 61 }, (_, i) => i + 20).map(age => (
                        <option key={age} value={age}>{age}歳まで</option>
                      ))}
                    </select>
                  </div>
                  <div className="ap-form-col">
                    <label className="ap-form-label">カテゴリ</label>
                    <select
                      className="ap-select"
                      value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  className="ap-textarea"
                  placeholder="メモ（任意）"
                  value={newItem.memo}
                  onChange={e => setNewItem(p => ({ ...p, memo: e.target.value }))}
                  rows={2}
                />
                <button
                  className="ap-btn-primary"
                  onClick={() => addItem()}
                  disabled={!newItem.title.trim()}
                >
                  追加する
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
