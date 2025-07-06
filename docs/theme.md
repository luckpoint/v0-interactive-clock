## テーマ一覧

### 🌅 **ウォーム** (デフォルト)

- 暖かみのあるオレンジ・ローズ系
- 親しみやすく温かい印象

### ❄️ **クール**

- 爽やかなブルー・シアン系
- すっきりとした涼しげな印象

### 🌿 **ナチュラル**

- 自然なグリーン・エメラルド系
- 落ち着いた自然な印象

### 💜 **エレガント**

- 上品なパープル・バイオレット系
- 洗練された高級感のある印象

### 🌸 **キュート**

- 可愛らしいピンク・ローズ系
- 優しく愛らしい印象

## テーマ選択UI

### 最新の実装（2024年12月）

テーマ選択機能を大幅に改善しました：

#### 配置とレイアウト
- **位置**: 右上に固定配置（ヘルプボタンの右横）
- **ヘッダー**: 「🕐 Interactive Clock」を左寄せに変更
- **レスポンシブ**: モバイル・タブレット・デスクトップで最適化

#### UI/UXの改善
- **色のアイコン**: テーマ名を表示せず、色の丸いアイコンのみで選択
- **カスタムドロップダウン**: HTMLのselectタグではなく、独自実装のドロップダウンメニュー
- **視覚的フィードバック**: 現在選択中のテーマは太いボーダーで強調表示
- **ツールチップ**: ホバー時にテーマ名を表示

#### 技術的な改善
- **外部クリック**: ドロップダウン外をクリックすると自動的に閉じる
- **イベント伝播**: `e.stopPropagation()`で適切なイベント処理
- **z-index管理**: 適切なレイヤー順序でドロップダウンを表示
- **アクセシビリティ**: `aria-label`と`title`属性でスクリーンリーダー対応

#### 実装の詳細

```typescript
// カスタムドロップダウンの状態管理
const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)

// 外部クリックで自動的に閉じる
useEffect(() => {
  if (!isThemeDropdownOpen) return
  
  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.theme-dropdown')) {
      setIsThemeDropdownOpen(false)
    }
  }
  
  // 遅延を設けてボタンクリックとの競合を防ぐ
  const timeoutId = setTimeout(() => {
    document.addEventListener('click', handleOutsideClick)
  }, 100)
  
  return () => {
    clearTimeout(timeoutId)
    document.removeEventListener('click', handleOutsideClick)
  }
}, [isThemeDropdownOpen])
```

### 以前の実装との比較

| 項目 | 以前 | 現在 |
|------|------|------|
| 配置 | コントロールパネル内 | 右上に固定 |
| 表示 | テーマ名 + 色のアイコン | 色のアイコンのみ |
| UI | 通常のボタン | カスタムドロップダウン |
| 操作性 | 常に表示 | クリックで開閉 |
| 文言 | 「Select Theme」表示 | 文言なし |

この改善により、より直感的で美しいテーマ選択体験を提供できるようになりました。