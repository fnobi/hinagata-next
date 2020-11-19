const RECT_SIZE = 100;

const initSamplePlayer = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");

  let angle = 0;
  const update = (delta: number) => {
    angle += delta * 0.1;
  };

  const render = () => {
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle / 180) * Math.PI);
    ctx.fillRect(-RECT_SIZE / 2, -RECT_SIZE / 2, RECT_SIZE, RECT_SIZE);
    ctx.restore();
  };

  let timer = -1;
  let prevTime = Date.now();
  const loop = () => {
    timer = window.requestAnimationFrame(loop);
    const now = Date.now();
    update(now - prevTime);
    render();
    prevTime = now;
  };
  timer = window.requestAnimationFrame(loop);

  const resize = (size: { x: number; y: number }) => {
    const { x, y } = size;
    // eslint-disable-next-line no-param-reassign
    [canvas.width, canvas.height] = [x, y];
    render();
  };

  const dispose = () => {
    window.cancelAnimationFrame(timer);
  };

  return { dispose, resize };
};

export default initSamplePlayer;
