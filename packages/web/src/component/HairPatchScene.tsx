import styled from "@emotion/styled";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import * as THREE from "three";
import { percent } from "~/common/css-util";
import MockActionButton from "~/component/MockActionButton";

type Rect = { x: number; y: number; w: number; h: number };

const MIN_PATCH_SIZE = 12;

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// 写真の該当範囲を「髪っぽい質感」で再描画するシェーダー。
// - 縦方向の筋(ストランド)ノイズで明暗と画像サンプリング位置を揺らす
// - 筋ごとのツヤ(スペキュラ帯)を足す
// - 縁は筋に沿ってほつれさせ、毛先のように透過させる
const FRAGMENT_SHADER = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPhoto;
uniform vec4 uRectUv; // u0, v0, u1, v1
uniform vec2 uSize;   // パッチのピクセルサイズ
uniform float uSeed;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21) + uSeed);
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 px = vUv * uSize;

  // 髪の流れ: ゆるく波打ちながら縦に流れる
  float wave = sin(px.y * 0.015 + uSeed * 6.0) * 8.0
             + sin(px.y * 0.043 + uSeed * 3.0) * 3.0;
  float x = px.x + wave;

  // 太い束 + 細い毛。x方向は高周波、y方向は低周波にして縦筋にする
  float clump  = vnoise(vec2(x * 0.10, px.y * 0.004));
  float strand = vnoise(vec2(x * 0.65, px.y * 0.012));
  float fine   = vnoise(vec2(x * 2.40, px.y * 0.030));
  float hair = clump * 0.35 + strand * 0.4 + fine * 0.25;

  // 筋に合わせて画像のサンプリング位置を横にずらす
  vec2 uvOffset = vec2((hair - 0.5) * 7.0 / uSize.x, 0.0);
  vec2 uv = clamp(vUv + uvOffset, 0.0, 1.0);
  vec2 photoUv = mix(uRectUv.xy, uRectUv.zw, uv);
  vec3 col = texture2D(uPhoto, photoUv).rgb;

  // 筋ごとの陰影
  col *= 0.62 + hair * 0.78;

  // ツヤ: 縦方向にゆるい帯 × 筋ごとの反射
  float band = smoothstep(0.55, 1.0, sin(vUv.y * 6.2832 * 1.5 + clump * 3.0) * 0.5 + 0.5);
  float glint = pow(strand, 6.0) * band;
  col += vec3(1.0, 0.96, 0.9) * glint * 0.45;

  // 縁のほつれ: 辺からの距離に筋ノイズで揺らぎを加えて透過
  float edge = min(min(px.x, uSize.x - px.x), min(px.y, uSize.y - px.y));
  float fray = 4.0 + fine * 16.0 + strand * 10.0;
  float alpha = smoothstep(0.0, fray, edge);
  // 上下の縁は毛先が伸びるように、より強くほつれさせる
  float vEdge = min(px.y, uSize.y - px.y);
  alpha *= smoothstep(0.0, 6.0 + fine * 28.0, vEdge) * 0.5 + 0.5;
  alpha *= smoothstep(0.0, 2.0, edge);

  // 縁の内側を少し暗くして厚みを出す
  col *= 0.75 + 0.25 * smoothstep(0.0, 14.0, edge);

  gl_FragColor = vec4(col, alpha);
}
`;

const Root = styled.div({
  position: "fixed",
  left: 0,
  top: 0,
  width: percent(100),
  height: percent(100),
  backgroundColor: "#222",
  overflow: "hidden",
  touchAction: "none"
});

const Toolbar = styled.div({
  position: "absolute",
  left: 0,
  top: 0,
  zIndex: 1,
  display: "flex",
  gap: 16,
  padding: "8px 12px",
  color: "#fff",
  fontSize: 14,
  background: "rgba(0,0,0,0.5)"
});

const Hint = styled.div({
  position: "absolute",
  left: 0,
  top: 0,
  width: percent(100),
  height: percent(100),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#aaa",
  pointerEvents: "none"
});

const SelectionBox = styled.div({
  position: "absolute",
  border: "1px dashed #fff",
  background: "rgba(255,255,255,0.15)",
  pointerEvents: "none"
});

const normalizeRect = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): Rect => ({
  x: Math.min(a.x, b.x),
  y: Math.min(a.y, b.y),
  w: Math.abs(a.x - b.x),
  h: Math.abs(a.y - b.y)
});

// 画像をコンテナに contain で収めたときの矩形
const fitRect = (
  img: { w: number; h: number },
  box: { w: number; h: number }
) => {
  const scale = Math.min(box.w / img.w, box.h / img.h);
  const w = img.w * scale;
  const h = img.h * scale;
  return { x: (box.w - w) / 2, y: (box.h - h) / 2, w, h };
};

const clampRectTo = (r: Rect, bounds: Rect): Rect => {
  const x0 = Math.max(r.x, bounds.x);
  const y0 = Math.max(r.y, bounds.y);
  const x1 = Math.min(r.x + r.w, bounds.x + bounds.w);
  const y1 = Math.min(r.y + r.h, bounds.y + bounds.h);
  return { x: x0, y: y0, w: Math.max(0, x1 - x0), h: Math.max(0, y1 - y0) };
};

type Engine = {
  setPhoto: (url: string) => Promise<void>;
  clearPatches: () => void;
  addPatch: (rect: Rect) => void;
  photoRect: () => Rect | null;
  dispose: () => void;
};

const createEngine = (container: HTMLElement): Engine => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x222222);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";

  const scene = new THREE.Scene();
  // ピクセル座標(左上原点・y下向き)をそのまま使う正射影カメラ
  const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
  const photoGroup = new THREE.Group();
  const patchGroup = new THREE.Group();
  scene.add(photoGroup, patchGroup);

  let size = { w: 1, h: 1 };
  let texture: THREE.Texture | null = null;
  let imageSize: { w: number; h: number } | null = null;
  let layout: Rect | null = null;
  let patchSeed = 0;
  let frame = 0;

  const render = () => {
    frame = 0;
    renderer.render(scene, camera);
  };
  const requestRender = () => {
    if (!frame) {
      frame = requestAnimationFrame(render);
    }
  };

  const disposeObject = (obj: THREE.Object3D) => {
    obj.traverse(o => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });
  };

  const clearPatches = () => {
    patchGroup.children.slice().forEach(c => {
      patchGroup.remove(c);
      disposeObject(c);
    });
    requestRender();
  };

  const updateLayout = () => {
    if (!imageSize) {
      return;
    }
    const next = fitRect(imageSize, size);
    // リサイズで写真の位置が変わるとパッチがずれるため、パッチは作り直さず破棄する
    if (
      layout &&
      (layout.x !== next.x ||
        layout.y !== next.y ||
        layout.w !== next.w ||
        layout.h !== next.h)
    ) {
      clearPatches();
    }
    layout = next;
    photoGroup.children.slice().forEach(c => {
      photoGroup.remove(c);
      disposeObject(c);
    });
    if (!texture) {
      return;
    }
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(next.w, next.h),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    mesh.position.set(next.x + next.w / 2, next.y + next.h / 2, 0);
    // y下向きのカメラなので、プレーンを上下反転させて表示する
    mesh.scale.y = -1;
    mesh.material.side = THREE.DoubleSide;
    photoGroup.add(mesh);
  };

  const resize = () => {
    size = {
      w: Math.max(1, container.clientWidth),
      h: Math.max(1, container.clientHeight)
    };
    renderer.setSize(size.w, size.h);
    camera.left = 0;
    camera.right = size.w;
    camera.top = 0;
    camera.bottom = size.h;
    camera.updateProjectionMatrix();
    updateLayout();
    requestRender();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  return {
    async setPhoto(url) {
      const tex = await new THREE.TextureLoader().loadAsync(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      texture?.dispose();
      texture = tex;
      const image = tex.image as { width: number; height: number };
      imageSize = { w: image.width, h: image.height };
      layout = null;
      clearPatches();
      updateLayout();
      requestRender();
    },
    clearPatches,
    photoRect: () => layout,
    addPatch(rect) {
      if (!texture || !layout) {
        return;
      }
      const u0 = (rect.x - layout.x) / layout.w;
      const u1 = (rect.x + rect.w - layout.x) / layout.w;
      // テクスチャの v は下から上
      const v0 = 1 - (rect.y + rect.h - layout.y) / layout.h;
      const v1 = 1 - (rect.y - layout.y) / layout.h;
      patchSeed += 1;
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          uPhoto: { value: texture },
          uRectUv: { value: new THREE.Vector4(u0, v0, u1, v1) },
          uSize: { value: new THREE.Vector2(rect.w, rect.h) },
          uSeed: { value: (patchSeed * 0.37) % 1 }
        }
      });
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(rect.w, rect.h),
        material
      );
      mesh.position.set(rect.x + rect.w / 2, rect.y + rect.h / 2, 1);
      // 上と同じ理由で上下反転 (vUv.y を画面上向きに揃える)
      mesh.scale.y = -1;
      patchGroup.add(mesh);
      requestRender();
    },
    dispose() {
      observer.disconnect();
      if (frame) {
        cancelAnimationFrame(frame);
      }
      clearPatches();
      photoGroup.children.forEach(disposeObject);
      texture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
};

const HairPatchScene = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [selection, setSelection] = useState<Rect | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }
    const engine = createEngine(root);
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const onFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    const engine = engineRef.current;
    if (!file || !engine) {
      return;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    await engine.setPhoto(url);
    setHasPhoto(true);
  }, []);

  const toLocal = (e: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  };

  const clampedSelection = (end: { x: number; y: number }) => {
    const start = dragStartRef.current;
    const photo = engineRef.current?.photoRect();
    if (!start || !photo) {
      return null;
    }
    return clampRectTo(normalizeRect(start, end), photo);
  };

  return (
    <Root
      ref={rootRef}
      onPointerDown={e => {
        if (!hasPhoto) {
          return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        dragStartRef.current = toLocal(e);
        setSelection(null);
      }}
      onPointerMove={e => {
        if (!dragStartRef.current) {
          return;
        }
        setSelection(clampedSelection(toLocal(e)));
      }}
      onPointerUp={e => {
        const rect = clampedSelection(toLocal(e));
        dragStartRef.current = null;
        setSelection(null);
        if (rect && rect.w >= MIN_PATCH_SIZE && rect.h >= MIN_PATCH_SIZE) {
          engineRef.current?.addPatch(rect);
        }
      }}
      onPointerCancel={() => {
        dragStartRef.current = null;
        setSelection(null);
      }}
    >
      <Toolbar onPointerDown={e => e.stopPropagation()}>
        <MockActionButton
          action={{
            type: "input-file",
            onChange: files => void onFiles(files)
          }}
        >
          写真を選択
        </MockActionButton>
        <MockActionButton
          action={
            hasPhoto
              ? {
                  type: "button",
                  onClick: () => engineRef.current?.clearPatches()
                }
              : null
          }
        >
          リセット
        </MockActionButton>
      </Toolbar>
      {!hasPhoto && <Hint>写真をアップロードしてください</Hint>}
      {selection && (
        <SelectionBox
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.w,
            height: selection.h
          }}
        />
      )}
    </Root>
  );
};

export default HairPatchScene;
