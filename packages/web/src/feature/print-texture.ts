export type PixelRect = { x: number; y: number; w: number; h: number };

export type PrintTexture = {
  map: HTMLCanvasElement;
  bump: HTMLCanvasElement;
  /** ワールド上(元画像ピクセル単位)でのプリント全体のサイズ。白枠を含む */
  width: number;
  height: number;
  /** 白枠の太さ(元画像ピクセル単位) */
  border: number;
};

const MAX_TEXTURE_SIZE = 1024;
const MAX_SCALE = 2;
const PAPER_COLOR: [number, number, number] = [244, 238, 224];

export const getBorderWidth = (rect: PixelRect) =>
  Math.max(6, Math.round(Math.min(rect.w, rect.h) * 0.06));

const makeCanvas = (w: number, h: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2d context is not available");
  }
  return { canvas, ctx };
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** 古い印画紙っぽい色調(褪色・暖色寄り・粒子)にする */
const agePhotoPixels = (data: ImageData) => {
  const { data: px } = data;
  for (let i = 0; i < px.length; i += 4) {
    const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
    // 彩度を少し落とす
    let r = lum + (px[i] - lum) * 0.78;
    let g = lum + (px[i + 1] - lum) * 0.78;
    let b = lum + (px[i + 2] - lum) * 0.78;
    // 黒を持ち上げ、白を落とす(褪色)
    r = 20 + r * 0.86;
    g = 20 + g * 0.86;
    b = 20 + b * 0.86;
    // 暖色寄り
    r *= 1.04;
    b *= 0.9;
    // 粒子
    const n = (Math.random() - 0.5) * 20;
    px[i] = r + n;
    px[i + 1] = g + n;
    px[i + 2] = b + n;
  }
};

const fillPaper = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 12;
    img.data[i] = PAPER_COLOR[0] + n;
    img.data[i + 1] = PAPER_COLOR[1] + n;
    img.data[i + 2] = PAPER_COLOR[2] + n;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // 繊維
  const count = Math.floor((w * h) / 600);
  for (let i = 0; i < count; i += 1) {
    const x = rand(0, w);
    const y = rand(0, h);
    const a = rand(0, Math.PI * 2);
    const l = rand(3, 12);
    ctx.strokeStyle =
      Math.random() < 0.5
        ? `rgba(255,255,255,${rand(0.05, 0.2)})`
        : `rgba(120,95,60,${rand(0.03, 0.1)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
};

const drawEdgeWear = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const size = Math.min(w, h) * 0.07;
  const edges: [number, number, number, number][] = [
    [0, 0, size, 0],
    [w, 0, w - size, 0],
    [0, 0, 0, size],
    [0, h, 0, h - size]
  ];
  edges.forEach(([x0, y0, x1, y1]) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, "rgba(150,115,60,0.22)");
    g.addColorStop(1, "rgba(150,115,60,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
};

const drawDust = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const specks = Math.floor((w * h) / 9000);
  for (let i = 0; i < specks; i += 1) {
    ctx.fillStyle =
      Math.random() < 0.5
        ? `rgba(255,255,255,${rand(0.2, 0.6)})`
        : `rgba(60,40,20,${rand(0.1, 0.3)})`;
    const r = rand(0.5, 1.6);
    ctx.beginPath();
    ctx.arc(rand(0, w), rand(0, h), r, 0, Math.PI * 2);
    ctx.fill();
  }
  const scratches = Math.floor(rand(1, 4));
  for (let i = 0; i < scratches; i += 1) {
    const x = rand(0, w);
    const y = rand(0, h);
    ctx.strokeStyle = `rgba(255,255,255,${rand(0.15, 0.35)})`;
    ctx.lineWidth = rand(0.6, 1.2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + rand(-20, 20),
      y + rand(10, 40),
      x + rand(-30, 30),
      y + rand(30, 90)
    );
    ctx.stroke();
  }
};

const makeBumpCanvas = (w: number, h: number) => {
  const bw = Math.ceil(w / 2);
  const bh = Math.ceil(h / 2);
  const { canvas, ctx } = makeCanvas(bw, bh);
  const img = ctx.createImageData(bw, bh);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 70;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const fibers = Math.floor((bw * bh) / 400);
  for (let i = 0; i < fibers; i += 1) {
    const x = rand(0, bw);
    const y = rand(0, bh);
    const a = rand(0, Math.PI * 2);
    const l = rand(4, 16);
    ctx.strokeStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "0,0,0"},0.18)`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
  return canvas;
};

/**
 * source の rect 部分を「白枠つきの古い印画紙プリント」に仕立てたテクスチャを作る。
 * 写真部分は元画像の rect と位置が揃い、白枠は外側にはみ出す。
 */
export const makePrintTexture = (
  source: CanvasImageSource,
  rect: PixelRect
): PrintTexture => {
  const border = getBorderWidth(rect);
  const width = rect.w + border * 2;
  const height = rect.h + border * 2;
  const scale = Math.min(MAX_SCALE, MAX_TEXTURE_SIZE / Math.max(width, height));

  const { canvas, ctx } = makeCanvas(width * scale, height * scale);
  const cw = canvas.width;
  const ch = canvas.height;
  fillPaper(ctx, cw, ch);

  const bx = Math.round(border * scale);
  const pw = cw - bx * 2;
  const ph = ch - bx * 2;

  const photo = makeCanvas(pw, ph);
  photo.ctx.drawImage(source, rect.x, rect.y, rect.w, rect.h, 0, 0, pw, ph);
  const photoData = photo.ctx.getImageData(0, 0, pw, ph);
  agePhotoPixels(photoData);
  ctx.putImageData(photoData, bx, bx);

  // 写真と白枠の境目のにじみ
  ctx.strokeStyle = "rgba(80,60,30,0.25)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx - 0.5, bx - 0.5, pw + 1, ph + 1);

  // 周辺減光
  const vignette = ctx.createRadialGradient(
    cw / 2,
    ch / 2,
    Math.min(pw, ph) * 0.35,
    cw / 2,
    ch / 2,
    Math.hypot(pw, ph) * 0.55
  );
  vignette.addColorStop(0, "rgba(60,35,10,0)");
  vignette.addColorStop(1, "rgba(60,35,10,0.3)");
  ctx.fillStyle = vignette;
  ctx.fillRect(bx, bx, pw, ph);

  // 光沢
  const gloss = ctx.createLinearGradient(bx, bx, bx + pw, bx + ph);
  gloss.addColorStop(0, "rgba(255,255,255,0.16)");
  gloss.addColorStop(0.4, "rgba(255,255,255,0)");
  gloss.addColorStop(0.7, "rgba(255,255,255,0.06)");
  gloss.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gloss;
  ctx.fillRect(bx, bx, pw, ph);

  drawEdgeWear(ctx, cw, ch);
  drawDust(ctx, cw, ch);

  return { map: canvas, bump: makeBumpCanvas(cw, ch), width, height, border };
};

/** プリントの下に敷く、ぼかした影のテクスチャ */
export const makeShadowTexture = (
  width: number,
  height: number,
  pad: number
) => {
  const { canvas, ctx } = makeCanvas(width + pad * 2, height + pad * 2);
  const off = canvas.width + 100;
  ctx.shadowColor = "rgba(30,20,10,0.65)";
  ctx.shadowBlur = pad * 0.7;
  ctx.shadowOffsetX = off;
  ctx.fillStyle = "#000";
  ctx.fillRect(pad - off, pad, width, height);
  return canvas;
};
