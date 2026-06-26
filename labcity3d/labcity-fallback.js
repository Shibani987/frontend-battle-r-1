(function () {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const buildings = [];
  const sparks = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let tick = 0;

  document.body.appendChild(canvas);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    buildings.length = 0;
    sparks.length = 0;
    const cols = 12;
    const rows = 7;
    const cellW = width / cols;
    const baseY = height * 0.82;

    for (let z = 0; z < rows; z += 1) {
      for (let x = 0; x < cols; x += 1) {
        if ((x + z) % 3 === 0 && z < 2) continue;
        const depth = z / rows;
        const bw = cellW * (0.62 + Math.random() * 0.45);
        const bh = height * (0.12 + Math.random() * 0.7) * (0.58 + depth);
        const px = x * cellW + (z % 2) * cellW * 0.45 - cellW * 0.2;
        const py = baseY - z * height * 0.095;
        buildings.push({ x: px, y: py, w: bw, h: bh, d: depth });
      }
    }

    for (let i = 0; i < 110; i += 1) {
      sparks.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.75,
        s: Math.random() * 1.6 + 0.4,
        a: Math.random() * Math.PI * 2
      });
    }
  }

  function drawBuilding(b) {
    const sway = Math.sin(tick * 0.012 + b.x * 0.01) * 2;
    const x = b.x + sway;
    const y = b.y;
    const w = b.w;
    const h = b.h;
    const side = w * 0.22;

    ctx.fillStyle = `rgba(0, ${18 + b.d * 36}, ${12 + b.d * 26}, ${0.94 - b.d * 0.24})`;
    ctx.fillRect(x, y - h, w, h);

    ctx.fillStyle = `rgba(0, 0, 0, ${0.82 - b.d * 0.16})`;
    ctx.beginPath();
    ctx.moveTo(x + w, y - h);
    ctx.lineTo(x + w + side, y - h + side * 0.7);
    ctx.lineTo(x + w + side, y + side * 0.7);
    ctx.lineTo(x + w, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `rgba(28, 28, 28, ${0.9 - b.d * 0.22})`;
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + side, y - h - side * 0.45);
    ctx.lineTo(x + w + side, y - h + side * 0.25);
    ctx.lineTo(x + w, y - h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = `rgba(255,255,255,${0.055 - b.d * 0.018})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y - h, w, h);
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + w, y);
    ctx.moveTo(x + w, y - h);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function draw() {
    tick += 1;
    ctx.fillStyle = "#0ac878";
    ctx.fillRect(0, 0, width, height);

    const fog = ctx.createLinearGradient(0, 0, 0, height);
    fog.addColorStop(0, "rgba(10, 200, 120, .95)");
    fog.addColorStop(0.45, "rgba(0, 66, 44, .38)");
    fog.addColorStop(1, "rgba(0, 0, 0, .86)");
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(0,28,18,.32)";
    ctx.lineWidth = 1;
    for (let i = -8; i < 22; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * width * 0.08, height);
      ctx.lineTo(width * 0.5 + i * 18, height * 0.42);
      ctx.stroke();
    }
    for (let j = 0; j < 10; j += 1) {
      const y = height * (0.5 + j * 0.06);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + j * 16);
      ctx.stroke();
    }

    buildings.sort((a, b) => a.d - b.d).forEach(drawBuilding);

    sparks.forEach((spark) => {
      spark.a += 0.025;
      ctx.fillStyle = `rgba(200, 255, 90, ${0.25 + Math.sin(spark.a) * 0.22})`;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y + Math.sin(spark.a) * 6, spark.s, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
})();
