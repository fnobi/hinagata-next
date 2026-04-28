import type { PromptCategory } from "~/features/schema/PromptItem";

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "style",
    label: "アートスタイル",
    items: [
      {
        id: "anime",
        label: "アニメ調",
        value: "anime style, anime art",
        description: "日本のアニメ風のイラストスタイル"
      },
      {
        id: "oil-painting",
        label: "油絵",
        value: "oil painting, painterly",
        description: "厚みのある絵の具で描いたような質感"
      },
      {
        id: "watercolor",
        label: "水彩画",
        value: "watercolor painting, soft washes",
        description: "透明感のある水彩タッチ"
      },
      {
        id: "photorealistic",
        label: "フォトリアル",
        value: "photorealistic, hyperrealistic, photographic",
        description: "写真と見分けがつかないほどリアルな表現"
      },
      {
        id: "pencil-sketch",
        label: "鉛筆スケッチ",
        value: "pencil sketch, hand-drawn, graphite drawing",
        description: "鉛筆で描いたようなスケッチ風スタイル"
      },
      {
        id: "pixel-art",
        label: "ピクセルアート",
        value: "pixel art, 8-bit style",
        description: "レトロゲーム風のドット絵スタイル"
      },
      {
        id: "manga",
        label: "マンガ",
        value: "manga style, black and white manga",
        description: "日本のマンガ特有のモノクロ線画スタイル"
      },
      {
        id: "digital-art",
        label: "デジタルアート",
        value: "digital art, digital painting",
        description: "デジタルツールで描かれたイラスト全般"
      },
      {
        id: "3d-cg",
        label: "3D CG",
        value: "3D rendering, CGI, octane render",
        description: "3Dソフトウェアでレンダリングした質感"
      },
      {
        id: "cyberpunk",
        label: "サイバーパンク",
        value: "cyberpunk style, futuristic dystopia",
        description: "近未来のテクノロジーと退廃的な都市が融合したスタイル"
      },
      {
        id: "steampunk",
        label: "スチームパンク",
        value: "steampunk style, Victorian era machinery",
        description: "蒸気機関と歯車が特徴のレトロフューチャーなスタイル"
      },
      {
        id: "fantasy-art",
        label: "ファンタジー",
        value: "fantasy art, epic fantasy illustration",
        description: "剣と魔法の世界観を持つファンタジースタイル"
      },
      {
        id: "minimalist",
        label: "ミニマリスト",
        value: "minimalist, clean lines, simple design",
        description: "無駄を省いたシンプルで洗練されたデザイン"
      },
      {
        id: "concept-art",
        label: "コンセプトアート",
        value: "concept art, detailed illustration",
        description: "ゲームや映画制作で使われる設定画風スタイル"
      },
      {
        id: "impressionist",
        label: "印象派",
        value: "impressionist painting, impressionism style",
        description: "光と色彩の微妙な変化を捉えた印象派絵画スタイル"
      }
    ]
  },
  {
    id: "composition",
    label: "構図",
    items: [
      {
        id: "portrait",
        label: "ポートレート",
        value: "portrait, face focus",
        description: "顔や表情を主役にした人物撮影の定番構図"
      },
      {
        id: "full-body",
        label: "全身",
        value: "full body shot, full figure",
        description: "頭のてっぺんから足先まで全身を収めた構図"
      },
      {
        id: "bust-shot",
        label: "バストアップ",
        value: "bust shot, upper body",
        description: "胸から上を映したハーフポートレート"
      },
      {
        id: "wide-shot",
        label: "ワイドショット",
        value: "wide shot, establishing shot, landscape",
        description: "被写体と周囲の環境を広く映し出す構図"
      },
      {
        id: "birds-eye",
        label: "鳥瞰図",
        value: "bird's eye view, top down view, aerial view",
        description: "真上から見下ろしたような俯瞰アングル"
      },
      {
        id: "low-angle",
        label: "ローアングル",
        value: "low angle shot, worm's eye view",
        description: "下から見上げた迫力ある構図"
      },
      {
        id: "dutch-angle",
        label: "ダッチアングル",
        value: "dutch angle, tilted composition",
        description: "カメラを斜めに傾けた緊張感や不安定さを演出する構図"
      },
      {
        id: "symmetrical",
        label: "対称構図",
        value: "symmetrical composition, centered",
        description: "左右対称の安定感と美しさを持つ構図"
      },
      {
        id: "dynamic",
        label: "ダイナミック",
        value: "dynamic pose, action shot, motion",
        description: "躍動感と動きを表現した構図"
      },
      {
        id: "close-up",
        label: "クローズアップ",
        value: "close-up, macro shot, extreme detail",
        description: "特定の部分を大きく拡大した構図"
      },
      {
        id: "rule-of-thirds",
        label: "三分割法",
        value: "rule of thirds composition",
        description: "画面を3×3に分割し交点に被写体を置くバランスの良い構図"
      }
    ]
  },
  {
    id: "lighting",
    label: "ライティング",
    items: [
      {
        id: "natural-light",
        label: "自然光",
        value: "natural lighting, soft natural light",
        description: "太陽や空からの柔らかな自然の光"
      },
      {
        id: "golden-hour",
        label: "ゴールデンアワー",
        value: "golden hour, warm sunset light, magic hour",
        description: "日の出・日没直後の暖かくドラマチックな光"
      },
      {
        id: "dramatic",
        label: "ドラマティック",
        value: "dramatic lighting, chiaroscuro, high contrast light",
        description: "明暗の強いコントラストで迫力を演出する光"
      },
      {
        id: "rim-light",
        label: "リムライト",
        value: "rim lighting, backlit, silhouette lighting",
        description: "被写体の輪郭を際立たせる逆光や縁取りの光"
      },
      {
        id: "studio-light",
        label: "スタジオライト",
        value: "studio lighting, professional lighting setup",
        description: "撮影スタジオで使われる均一でプロフェッショナルな照明"
      },
      {
        id: "neon",
        label: "ネオン",
        value: "neon lights, neon glow, colorful artificial lighting",
        description: "ネオンサインのような鮮やかな人工的な光"
      },
      {
        id: "moonlight",
        label: "月明かり",
        value: "moonlight, night lighting, cool blue light",
        description: "夜の静寂を演出する青白い月の光"
      },
      {
        id: "soft-light",
        label: "ソフトライト",
        value: "soft diffused light, overcast lighting",
        description: "影が薄く柔らかい拡散した光"
      },
      {
        id: "volumetric",
        label: "体積光",
        value: "volumetric lighting, god rays, light beams",
        description: "霧や埃に光が当たり光線が見える幻想的な表現"
      },
      {
        id: "candlelight",
        label: "キャンドル・炎",
        value: "candlelight, firelight, warm flickering light",
        description: "ろうそくや炎の暖かみのある揺らめく光"
      }
    ]
  },
  {
    id: "mood",
    label: "雰囲気・ムード",
    items: [
      {
        id: "bright-cheerful",
        label: "明るい・楽しい",
        value: "bright, cheerful, vibrant, joyful",
        description: "ポジティブで元気のある明るい雰囲気"
      },
      {
        id: "dark-moody",
        label: "暗い・シリアス",
        value: "dark, moody, somber, gritty",
        description: "重厚で緊張感のある暗い雰囲気"
      },
      {
        id: "mysterious",
        label: "神秘的",
        value: "mysterious, ethereal, otherworldly",
        description: "謎めいた不思議で幻想的な雰囲気"
      },
      {
        id: "romantic",
        label: "ロマンティック",
        value: "romantic, soft, dreamy, tender",
        description: "甘く柔らかいロマンチックな雰囲気"
      },
      {
        id: "fresh",
        label: "爽やか・清涼",
        value: "fresh, clean, airy, refreshing",
        description: "清潔感があり清々しい爽やかな雰囲気"
      },
      {
        id: "nostalgic",
        label: "懐かしい",
        value: "nostalgic, vintage feel, retro atmosphere",
        description: "過去を思い起こさせる懐かしく温かみのある雰囲気"
      },
      {
        id: "tense",
        label: "緊張・スリリング",
        value: "tense, dramatic, suspenseful, thrilling",
        description: "ハラハラするような緊張感と興奮を持つ雰囲気"
      },
      {
        id: "peaceful",
        label: "平和・穏やか",
        value: "peaceful, serene, calm, tranquil",
        description: "穏やかで心が落ち着く静かな雰囲気"
      },
      {
        id: "surreal",
        label: "幻想的・シュール",
        value: "surreal, dreamlike, fantastical",
        description: "現実離れした非現実的で夢のような雰囲気"
      },
      {
        id: "epic",
        label: "壮大・力強い",
        value: "epic, powerful, grand, majestic",
        description: "スケールの大きな迫力と力強さを持つ雰囲気"
      },
      {
        id: "melancholic",
        label: "切ない・憂鬱",
        value: "melancholic, bittersweet, wistful",
        description: "悲しくも美しい切なさや憂いを帯びた雰囲気"
      }
    ]
  },
  {
    id: "background",
    label: "背景・舞台",
    items: [
      {
        id: "simple-bg",
        label: "シンプル背景",
        value: "simple background, plain background, white background",
        description: "被写体を引き立てるシンプルな単色背景"
      },
      {
        id: "outdoor",
        label: "アウトドア・自然",
        value: "outdoor, nature background, scenic",
        description: "自然の中での開放的な屋外シーン"
      },
      {
        id: "cityscape",
        label: "都市・街",
        value: "cityscape, urban background, city streets",
        description: "ビルや街並みが広がる都市的な背景"
      },
      {
        id: "interior",
        label: "室内",
        value: "interior, indoor setting, cozy room",
        description: "部屋や建物の内部を舞台にした室内シーン"
      },
      {
        id: "space",
        label: "宇宙",
        value: "outer space, cosmic background, galaxy, nebula",
        description: "星々や銀河が広がるスケールの大きな宇宙背景"
      },
      {
        id: "forest",
        label: "森・林",
        value: "forest, woodland, lush vegetation",
        description: "木々が生い茂る緑豊かな森の背景"
      },
      {
        id: "ocean",
        label: "海・水辺",
        value: "ocean, seascape, coastal, waterside",
        description: "海や水辺の開放的で清涼感のある背景"
      },
      {
        id: "sky",
        label: "空・雲",
        value: "dramatic sky, cloudy sky, blue sky",
        description: "雲や色彩豊かな空を背景にした構図"
      },
      {
        id: "bokeh-bg",
        label: "ぼかし背景",
        value: "blurred background, bokeh, depth of field",
        description: "背景をぼかして被写体を際立たせる表現"
      },
      {
        id: "ruins",
        label: "廃墟・遺跡",
        value: "ruins, ancient ruins, post-apocalyptic",
        description: "崩れた建物や古代遺跡の退廃的な背景"
      }
    ]
  },
  {
    id: "quality",
    label: "品質・仕上がり",
    items: [
      {
        id: "masterpiece",
        label: "最高品質",
        value: "masterpiece, best quality",
        description: "最も高い品質を指定するプロンプト（推奨）"
      },
      {
        id: "ultra-detailed",
        label: "超精細",
        value: "ultra detailed, intricate details, highly detailed",
        description: "細部まで精密に描き込まれた超高精細な表現"
      },
      {
        id: "4k",
        label: "4K / 8K",
        value: "4K resolution, 8K resolution, ultra high resolution",
        description: "高解像度を指定するプロンプト"
      },
      {
        id: "cinematic",
        label: "シネマティック",
        value: "cinematic, film grain, movie quality",
        description: "映画のような迫力と質感を持つ仕上がり"
      },
      {
        id: "vivid",
        label: "鮮やか・彩度高",
        value: "vivid colors, saturated, vibrant palette",
        description: "色彩豊かで鮮やかな発色"
      },
      {
        id: "sharp",
        label: "シャープ・くっきり",
        value: "sharp focus, crisp, clear",
        description: "輪郭がはっきりとしたシャープな仕上がり"
      },
      {
        id: "beautiful",
        label: "美麗",
        value: "beautiful, stunning, gorgeous",
        description: "視覚的な美しさを強調する定番フレーズ"
      },
      {
        id: "award-winning",
        label: "受賞作品レベル",
        value: "award-winning, trending on artstation",
        description: "コンテスト受賞・注目作品レベルの品質を指定"
      }
    ]
  },
  {
    id: "camera",
    label: "カメラ・レンズ",
    items: [
      {
        id: "shallow-dof",
        label: "浅い被写界深度",
        value: "shallow depth of field, bokeh",
        description: "ピントの合う範囲が狭く背景がぼける一眼レフ的表現"
      },
      {
        id: "wide-angle",
        label: "広角レンズ",
        value: "wide angle lens, 16mm lens",
        description: "広い視野角で空間の広がりを表現"
      },
      {
        id: "telephoto",
        label: "望遠レンズ",
        value: "telephoto lens, 200mm lens, compressed perspective",
        description: "遠くのものを大きく捉える圧縮効果のある望遠表現"
      },
      {
        id: "fisheye",
        label: "魚眼レンズ",
        value: "fisheye lens, ultra wide angle, distorted",
        description: "180度以上の超広角で周囲がゆがんで見える特殊レンズ"
      },
      {
        id: "macro",
        label: "マクロ",
        value: "macro photography, extreme close-up, micro detail",
        description: "小さな被写体を原寸大以上に拡大するマクロ撮影"
      },
      {
        id: "long-exposure",
        label: "長時間露光",
        value: "long exposure, light trails, motion blur",
        description: "シャッタースピードを遅くして光跡や動きを表現"
      },
      {
        id: "tilt-shift",
        label: "チルトシフト",
        value: "tilt-shift lens, miniature effect",
        description: "ピントの傾きを調節して風景をミニチュア模型に見せる表現"
      },
      {
        id: "35mm",
        label: "35mm フィルム",
        value: "35mm film photography, analog photography",
        description: "フィルムカメラ特有の粒子感と色味を持つ質感"
      }
    ]
  }
];

export default PROMPT_CATEGORIES;
