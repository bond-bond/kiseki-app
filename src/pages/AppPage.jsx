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
  const [filter, setFilter]         = useState('all')
  const [newItem, setNewItem]       = useState({ title: '', targetAge: '', category: 'other', memo: '' })
  const [celebrated, setCelebrated] = useState(null)
  const [setupDone, setSetupDone]   = useState(() => !!localStorage.getItem('kiseki_birthYear'))

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

  function addItem() {
    if (!newItem.title.trim()) return
    const item = {
      id: Date.now(),
      title: newItem.title.trim(),
      targetAge: newItem.targetAge,
      category: newItem.category,
      memo: newItem.memo,
      done: false,
      createdAt: new Date().toISOString(),
    }
    setItems(prev => [item, ...prev])
    setNewItem({ title: '', targetAge: '', category: 'other', memo: '' })
    setShowForm(false)
  }

  function toggleDone(id) {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      if (!item.done) setCelebrated(id)
      return { ...item, done: !item.done }
    }))
    setTimeout(() => setCelebrated(null), 2000)
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

      {/* 追加フォーム */}
      {showForm && (
        <div className="ap-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="ap-modal" onClick={e => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h2>やりたいことを追加</h2>
              <button className="ap-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
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
              onClick={addItem}
              disabled={!newItem.title.trim()}
            >
              追加する
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
