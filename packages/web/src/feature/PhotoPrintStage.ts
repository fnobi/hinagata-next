import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import {
  makePrintTexture,
  makeShadowTexture,
  type PixelRect
} from "~/feature/print-texture";

const MAX_IMAGE_SIZE = 2048;
const DROP_DURATION = 320;
const SHADOW_PAD = 24;

type Print = {
  group: Group;
  paper: MeshStandardMaterial;
  shadow: MeshBasicMaterial;
  shadowMesh: Mesh;
  geometries: PlaneGeometry[];
  textures: CanvasTexture[];
  startedAt: number;
};

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** 紙が少したわんでいるように見せる */
const bendPlane = (geo: PlaneGeometry, w: number, h: number) => {
  const curl = Math.min(w, h) * 0.012 * (Math.random() < 0.5 ? 1 : -1);
  const twist = Math.min(w, h) * 0.008 * (Math.random() - 0.5) * 2;
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const nx = pos.getX(i) / (w / 2);
    const ny = pos.getY(i) / (h / 2);
    pos.setZ(i, curl * (nx * nx + ny * ny * 0.4) + twist * nx * ny);
  }
  geo.computeVertexNormals();
};

/**
 * 写真を背景に表示し、矩形指定した部分を「プリントした紙」として重ねる Three.js ステージ。
 * ワールド座標は(作業用に縮小した)画像ピクセル単位。
 */
export default class PhotoPrintStage {
  private renderer: WebGLRenderer;

  private scene = new Scene();

  private camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);

  private resizeObserver: ResizeObserver;

  private background: Mesh | null = null;

  private prints: Print[] = [];

  private source: HTMLCanvasElement | null = null;

  private rafId: number | null = null;

  public constructor(private container: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;";
    container.appendChild(this.renderer.domElement);

    this.camera.position.z = 100;
    this.scene.add(new AmbientLight(0xffffff, Math.PI * 0.7));
    const light = new DirectionalLight(0xffffff, Math.PI * 0.35);
    light.position.set(-0.5, 0.6, 1);
    this.scene.add(light);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  /** 縮小後の画像サイズ(= ワールドのサイズ) */
  public get size() {
    return this.source
      ? { width: this.source.width, height: this.source.height }
      : null;
  }

  public setImage(image: HTMLImageElement) {
    this.clear();
    const ratio = Math.min(
      1,
      MAX_IMAGE_SIZE / Math.max(image.naturalWidth, image.naturalHeight)
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * ratio);
    canvas.height = Math.round(image.naturalHeight * ratio);
    canvas
      .getContext("2d")
      ?.drawImage(image, 0, 0, canvas.width, canvas.height);
    this.source = canvas;

    if (this.background) {
      this.disposeMesh(this.background);
      this.scene.remove(this.background);
    }
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.minFilter = LinearFilter;
    tex.generateMipmaps = false;
    this.background = new Mesh(
      new PlaneGeometry(canvas.width, canvas.height),
      new MeshBasicMaterial({ map: tex })
    );
    this.scene.add(this.background);

    this.camera.left = -canvas.width / 2;
    this.camera.right = canvas.width / 2;
    this.camera.top = canvas.height / 2;
    this.camera.bottom = -canvas.height / 2;
    this.camera.updateProjectionMatrix();
    this.resize();
  }

  public addPrint(rawRect: PixelRect) {
    if (!this.source) {
      return;
    }
    const x = Math.max(0, rawRect.x);
    const y = Math.max(0, rawRect.y);
    const rect = {
      x,
      y,
      w: Math.min(this.source.width - x, rawRect.w - (x - rawRect.x)),
      h: Math.min(this.source.height - y, rawRect.h - (y - rawRect.y))
    };
    if (rect.w < 4 || rect.h < 4) {
      return;
    }

    const tex = makePrintTexture(this.source, rect);
    const mapTex = new CanvasTexture(tex.map);
    mapTex.colorSpace = SRGBColorSpace;
    mapTex.anisotropy = 4;
    const bumpTex = new CanvasTexture(tex.bump);
    const shadowTex = new CanvasTexture(
      makeShadowTexture(tex.width, tex.height, SHADOW_PAD)
    );
    shadowTex.colorSpace = SRGBColorSpace;

    const paperGeo = new PlaneGeometry(tex.width, tex.height, 16, 16);
    bendPlane(paperGeo, tex.width, tex.height);
    const paper = new MeshStandardMaterial({
      map: mapTex,
      bumpMap: bumpTex,
      bumpScale: 1.5,
      roughness: 0.85,
      metalness: 0,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const shadow = new MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const shadowGeo = new PlaneGeometry(
      tex.width + SHADOW_PAD * 2,
      tex.height + SHADOW_PAD * 2
    );

    const order = this.prints.length;
    const paperMesh = new Mesh(paperGeo, paper);
    paperMesh.renderOrder = order * 2 + 2;
    const shadowMesh = new Mesh(shadowGeo, shadow);
    shadowMesh.renderOrder = order * 2 + 1;

    const group = new Group();
    group.add(shadowMesh, paperMesh);
    // 選択範囲の中心に置く(白枠は左右対称にはみ出す)
    group.position.set(
      rect.x + rect.w / 2 - this.source.width / 2,
      this.source.height / 2 - (rect.y + rect.h / 2),
      1
    );
    group.rotation.z = ((Math.random() - 0.5) * 3 * Math.PI) / 180;
    this.scene.add(group);

    this.prints.push({
      group,
      paper,
      shadow,
      shadowMesh,
      geometries: [paperGeo, shadowGeo],
      textures: [mapTex, bumpTex, shadowTex],
      startedAt: performance.now()
    });
    this.startAnimation();
  }

  public undo() {
    const print = this.prints.pop();
    if (print) {
      this.disposePrint(print);
    }
    this.render();
  }

  public clear() {
    this.prints.forEach(p => this.disposePrint(p));
    this.prints = [];
    this.render();
  }

  public get printCount() {
    return this.prints.length;
  }

  public dispose() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.resizeObserver.disconnect();
    this.clear();
    if (this.background) {
      this.disposeMesh(this.background);
    }
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private disposeMesh(mesh: Mesh) {
    mesh.geometry.dispose();
    const mat = mesh.material as MeshBasicMaterial;
    mat.map?.dispose();
    mat.dispose();
  }

  private disposePrint(p: Print) {
    this.scene.remove(p.group);
    p.geometries.forEach(g => g.dispose());
    p.textures.forEach(t => t.dispose());
    p.paper.dispose();
    p.shadow.dispose();
  }

  private resize() {
    const { clientWidth, clientHeight } = this.container;
    if (clientWidth > 0 && clientHeight > 0) {
      this.renderer.setSize(clientWidth, clientHeight, false);
    }
    this.render();
  }

  private startAnimation() {
    if (this.rafId !== null) {
      return;
    }
    const tick = () => {
      const now = performance.now();
      let active = false;
      this.prints.forEach(p => {
        const t = Math.min(1, (now - p.startedAt) / DROP_DURATION);
        if (t < 1 || p.paper.opacity !== 1) {
          const e = easeOut(t);
          p.group.scale.setScalar(1 + 0.06 * (1 - e));
          p.paper.opacity = e;
          p.shadow.opacity = e;
          p.shadowMesh.position.set(
            4 * (1 + (1 - e) * 2),
            -6 * (1 + (1 - e) * 2),
            0
          );
          active = active || t < 1;
        }
      });
      this.render();
      this.rafId = active ? requestAnimationFrame(tick) : null;
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }
}
