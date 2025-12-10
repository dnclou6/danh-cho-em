import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/+esm';

const dynamicData = window.dataBirthdayV2LoveLoom?.data || {};
const countdownData = {
  backgroundText: (dynamicData.title || '').toUpperCase(),
  messages: (dynamicData.messages || []).map((msg) => msg.toUpperCase()),
  finalText: dynamicData.finalText,
  music: dynamicData.backgroundMusic
};
const defaultMusicFallback = [];
// Dùng ảnh trong thư mục album cho slideshow
const albumImagePool = [
  'album/att.5TOYryWA27PwW8FBVUD_D8JRyAjaB5QCPPQeII5K-so.JPG',
  'album/att.5Zb07iSQciNRlZaBpqEd4VLbObUae5wze-7-WcKXlUA.JPG',
  'album/att.6q6DFQD8Tvu6NyZafgGDWy8nUblxePkPTe0Nhro-om0.JPG',
  'album/att.CNMNQU9rt09iqENUz0h41784bNg2CUboPb8Le-zmNek.JPG',
  'album/att.Ctot0QCtMRatSEUGOLxIUlIHwPQchURqoJ5xBnCXrS0.JPG'
];
// Dùng tất cả ảnh trong thư mục img cho phần cuối (falling images)
const localImagePool = [
  'img/att.SRNUMR_NaSJw0NIN5pmpwQtYZzlmMT_MsJameMGCE04.JPG',
  'img/att.dXGzARDhOBUfkrUj0s56XI_zizWoBtgD7WlHgSkLMv4.JPG',
  'img/att.Ndl1n2L2M36aQIn_iCvs6oUqolDOI1o9gY7mKqhMT38.JPG',
  'img/att.QTp2CZVGomMX_fbwUc9pxvFtMZSA8i2R6SQJ9U5ZPpI.JPG',
  'img/att.5TOYryWA27PwW8FBVUD_D8JRyAjaB5QCPPQeII5K-so.JPG',
  'img/att.ump5_UZ_9_kJA5Yma-z2aCucEGR6_Bk-bhyTaErMhFU.JPG',
  'img/att.yVJnRTuJEYMcFeF4HIqn0Ivs0BaeTBGmsCL1pUGuQaw.JPG',
  'img/att.cyi0aHiFXGEeKwaAd-uSombAom-hajm3Arr4QzZ0VX8.JPG',
  'img/att.VIocDinrkHQz9hGIWnHgQxDK9Slp_vR9qFreRYhdlOg.JPG',
  'img/att.vtjOWyw5b3i-dEx68M9eRgYIE8u-lzeLkNYcnDf_1xs.JPG',
  'img/att.sch2bOWWPCjoWa5lCP6a_0-YZzLIIvbP3UlBcxaf5eQ.JPG',
  'img/att.CNMNQU9rt09iqENUz0h41784bNg2CUboPb8Le-zmNek.JPG',
  'img/att.xQCvCwM7WvYCoWfYRA-QKMAkEtkw3xY-0N_k5bl_JCQ.JPG',
  'img/att.H1YSyKkdpsAIftBZC4X1b6eSqKjayE--6t3_45QHhB8.JPG',
  'img/att.Ctot0QCtMRatSEUGOLxIUlIHwPQchURqoJ5xBnCXrS0.JPG',
  'img/att.6q6DFQD8Tvu6NyZafgGDWy8nUblxePkPTe0Nhro-om0.JPG',
  'img/att.ZtulgvnSWFb_jFsOdhTUXCYhv7VOoRkyeGuJNZF1gjI.JPG',
  'img/att.HDd9nd8h-tbgTQkNYSke5SvFhOB6CFLGQD4tnWjXvl4.JPG',
  'img/att.KT146s72npCKOqKEvA5p8df5mhj9c0--VP1E3cVinfA.JPG',
  'img/att.e50-U4oYFiP0DtjVQwnQpzXydrjq7VaNtuam6-y51zI.JPG',
  'img/att.5Zb07iSQciNRlZaBpqEd4VLbObUae5wze-7-WcKXlUA.JPG',
  'img/att.gEVsOt9Jm0wOFgZd9tNCERdZAs00kwaBd8-_ol2f_OM.JPG',
  'img/att.jnVPhSZLNms1vW5GlIv3y41nGFnviciD4sA3ZPo64jQ.JPG',
  'img/att.fUFsscfi4F0SaDbxNkB1KXqn2fjMyH1ML-TIceuxTtc.JPG',
  'img/att.XjyauUv8TArcZxqOO2WQQARhXPrPuWgPRWCJ8V9UTF4.JPG',
  'img/att.VtmfoD98MIrMkCgwpaT3qCMvYOffkOABqSgxnIXNaX0.JPG',
  'img/att.cYrxu-bAGFpS9ikNmh1VZiisq7vro-GTpjrCAYHkPW4.JPG',
  'img/att.rfXQpiuNBYVpGLD34QsO87Mml_-M0uT6sgi4kb3b1Ss.JPG'
];
let backgroundAudio = null;

function getSafeAreaInset(side) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style[side] = `env(safe-area-inset-${side})`;
  div.style.visibility = 'hidden';
  document.body.appendChild(div);
  const computedStyle = getComputedStyle(div);
  const inset = parseInt(computedStyle[side]) || 0;
  document.body.removeChild(div);
  return inset;
}

function createMatrixBackground({ text }) {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  // ===== BẮT ĐẦU SỬA LỖI =====

  // 1. Đưa animationFrameId ra ngoài cùng để nó có một phạm vi duy nhất và bền bỉ.
  let animationFrameId = null;

  // Khai báo các biến trạng thái ở đây để dùng chung
  let fullWidth;
  let fullHeight;
  let top;
  let left;
  let stars = [];
  const STAR_COUNT_BASE = 120; // tăng số lượng sao
  const charSize = 5; // nhỏ để chữ ghép mịn

  // 2. Tách riêng logic thiết lập trạng thái để có thể gọi lại một cách an toàn
  const setupAnimationState = () => {
    // Lấy kích thước mới
    const dpr = window.devicePixelRatio || 1;
    top = getSafeAreaInset('top');
    const bottom = getSafeAreaInset('bottom');
    left = getSafeAreaInset('left');
    const right = getSafeAreaInset('right');
    fullWidth = window.innerWidth + left + right;
    fullHeight = window.innerHeight + top + bottom;

    // Cập nhật canvas
    canvas.width = fullWidth * dpr;
    canvas.height = fullHeight * dpr;
    canvas.style.width = `${fullWidth}px`;
    canvas.style.height = `${fullHeight}px`;
    canvas.style.marginTop = `calc(-1 * ${top}px)`;
    canvas.style.marginLeft = `calc(-1 * ${left}px)`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Sinh ngẫu nhiên các vị trí sao (chấm sáng) tĩnh, sẽ nhấp nháy
    const starCount = Math.floor(STAR_COUNT_BASE * (fullWidth * fullHeight) / (1280 * 720));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * fullWidth + left,
      y: Math.random() * fullHeight + top,
      vx: (Math.random() - 0.5) * 0.5, // trôi nhanh hơn nữa
      vy: (Math.random() - 0.5) * 0.5,
      baseAlpha: 0.3 + Math.random() * 0.4,
      size: 1 + Math.random() * 1.4,
      speed: 0.02 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, fullWidth, fullHeight);
    ctx.fillStyle = '#d7e7ff';

    const time = performance.now() * 0.001;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      // cập nhật vị trí trôi nhẹ
      s.x += s.vx;
      s.y += s.vy;
      // vòng lại khi ra ngoài viền
      if (s.x < 0) s.x += fullWidth;
      if (s.x > fullWidth) s.x -= fullWidth;
      if (s.y < 0) s.y += fullHeight;
      if (s.y > fullHeight) s.y -= fullHeight;

      const alpha = s.baseAlpha + Math.sin(time * s.speed + s.phase) * 0.25;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  // 3. Tạo một hàm animate duy nhất, không định nghĩa lại trong các listener
  const animate = () => {
    draw();
    // Lặp lại chính nó một cách an toàn
    animationFrameId = setTimeout(() => requestAnimationFrame(animate), 25);
  };

  // 4. Tạo một trình xử lý sự kiện resize mạnh mẽ
  const handleResize = () => {
    // LUÔN DỪNG animation cũ trước khi làm bất cứ điều gì. Đây là chìa khóa.
    if (animationFrameId) {
      clearTimeout(animationFrameId);
      animationFrameId = null;
    }

    // Tính toán lại tất cả trạng thái
    setupAnimationState();

    // Bắt đầu lại vòng lặp animation mới và sạch sẽ
    animate();
  };

  // Khởi tạo lần đầu
  setupAnimationState();
  animate();

  // Gắn listener vào sự kiện resize
  window.addEventListener('layout:resize', handleResize);

  // ===== KẾT THÚC SỬA LỖI =====
}

function createDotsAnimation({ messages, images, onComplete }) {
  const container = document.getElementById('dots-canvas-container');
  const isMobile = window.innerHeight > window.innerWidth && 'ontouchstart' in window;
  let isStarted = false;
  let scene;
  let camera;
  let renderer;
  let points;
  let flyingPoints;
  let blurPoints;
  let currentTextIndex = -1;
  let currentImageIndex = -1;
  let currentState = 'countdown';
  let isFadingOut = false;
  let dotParticles = [];
  let flyingDotParticles = []; // Sẽ dùng cho hiệu ứng click
  let quality = 'medium';
  let animationFrameId;
  let lastTime = performance.now();
  let timeoutId;
  let isExploded = false;
  let explosionProgress = 0;
  let glowUniforms;
  let blurMaterial;
  let flashElement;

  // NÂNG CẤP TƯƠNG TÁC: Biến lưu vị trí chuột
  const mouse = new THREE.Vector3(9999, 9999, 0);
  const REPULSION_RADIUS = 80;
  const REPULSION_STRENGTH = 1.5;

  const countdownSteps = ['3', '2', '1'];

  const qualitySettings = {
    low: { dotGapMultiplier: 1.5, effectIntensity: 0.7, blurEnabled: false, maxFlyingDots: 180 },
    medium: { dotGapMultiplier: 1.2, effectIntensity: 0.85, blurEnabled: true, maxFlyingDots: 387 },
    high: { dotGapMultiplier: 1, effectIntensity: 1, blurEnabled: true, maxFlyingDots: 850 }
  };

  // NÂNG CẤP TƯƠNG TÁC: Hàm cập nhật vị trí chuột trong không gian 3D
  function updateMousePosition(event) {
    // Chuyển tọa độ màn hình (pixel) thành tọa độ chuẩn hóa của Three.js (-1 đến +1)
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Chiếu tọa độ này lên mặt phẳng z=0 nơi các hạt đang tồn tại
    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    mouse.copy(pos);
  }

  // NÂNG CẤP TƯƠNG TÁC: Hàm xử lý sự kiện click
  function onMouseClick(event) {
    updateMousePosition(event); // Lấy vị trí click chính xác
    const PARTICLE_COUNT = 35;
    const SPREAD = 5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      flyingDotParticles.push({
        x: mouse.x,
        y: mouse.y,
        vz: (Math.random() - 0.5) * SPREAD * 2,
        vx: (Math.random() - 0.5) * SPREAD,
        vy: (Math.random() - 0.5) * SPREAD,
        opacity: 1,
        glowIntensity: 3 + Math.random() * 3,
        lifetime: 60 + Math.random() * 30 // Tồn tại trong ~1-1.5 giây
      });
    }
  }

  function createFlashElement() {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.width = '10px'; // Kích thước ban đầu của lõi
    el.style.height = '10px';
    el.style.backgroundColor = 'white';
    el.style.borderRadius = '50%';
    el.style.transform = 'translate(-50%, -50%) scale(1)';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '100';
    // Thêm hiệu ứng glow bằng box-shadow
    el.style.boxShadow = '0 0 20px 10px white';
    // Transition sẽ được điều khiển bằng JS để linh hoạt hơn
    container.appendChild(el);
    return el;
  }

  function startFinalTransition() {
    currentState = 'imploding';
    window.removeEventListener('mousemove', updateMousePosition, false);
    window.removeEventListener('click', onMouseClick, false);
    // Làm lõi năng lượng xuất hiện và bắt đầu rung động
    flashElement.style.opacity = '1';
  }

  function triggerSupernova() {
    // Tắt hiệu ứng glow của lõi
    flashElement.style.boxShadow = 'none';
    // Biến lõi thành vòng sáng (shockwave)
    flashElement.style.backgroundColor = 'transparent';
    flashElement.style.border = '4px solid white';

    // Kích hoạt vụ nổ
    flashElement.style.transition = 'transform 0.5s ease-out, opacity 0.6s ease-out';
    flashElement.style.transform = 'translate(-50%, -50%) scale(300)'; // Vòng sáng lan tỏa
    flashElement.style.opacity = '0';

    // Chuyển cảnh "tàng hình" ngay khi vụ nổ bắt đầu
    setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      onComplete();
    }, 50); // Chuyển cảnh gần như tức thì

    setTimeout(() => container.removeChild(flashElement), 1000); // Dọn dẹp
  }

  function init() {
    determineQuality();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 260;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const dotTexture = createDotTexture(6);

    glowUniforms = {
      pointTexture: { value: dotTexture },
      uTime: { value: 0 }
    };

    const vertexShader = `
                        attribute float alpha;
                        attribute float glow;
                        varying float vAlpha;
                        varying float vGlow;
                        void main() {
                            vAlpha = alpha;
                            vGlow = glow;
                            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                            gl_PointSize = ${(6).toFixed(1)} * (300.0 / -mvPosition.z) * (1.0 + glow * 0.3);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `;

    const fragmentShader = `
                        varying float vAlpha;
                        varying float vGlow;
                        uniform sampler2D pointTexture;
                        uniform float uTime;
                        void main() {
                            vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                            float pulse = 0.5 + 0.5 * sin(uTime * 5.0);
                            float glow = smoothstep(0.5, 1.0, vAlpha) * (1.0 + pulse * 0.5 + vGlow * 2.0);
                            vec3 baseColor = mix(
                                vec3(0.7, 0.8, 1.0),
                                vec3(0.4, 0.6, 1.5),
                                smoothstep(1.0, 3.0, glow)
                            );
                            float alpha = vAlpha * texColor.a * (1.0 + glow * 2.0);
                            gl_FragColor = vec4(baseColor * (1.0 + glow * 0.8), alpha);
                        }
                    `;

    const material = new THREE.ShaderMaterial({
      uniforms: glowUniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    points = new THREE.Points(new THREE.BufferGeometry(), material);
    scene.add(points);

    flyingPoints = new THREE.Points(new THREE.BufferGeometry(), material.clone()); // Dùng material riêng cho hạt bay
    scene.add(flyingPoints);

    if (qualitySettings[quality].blurEnabled) {
      const blurTexture = createDotTexture(15);
      blurMaterial = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: blurTexture }, uTime: { value: 0 } },
        vertexShader: vertexShader.replace(/gl_PointSize = ([^;]+);/, `gl_PointSize = ${(15).toFixed(1)} * (300.0 / -mvPosition.z) * (1.0 + glow * 0.3);`),
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      blurPoints = new THREE.Points(new THREE.BufferGeometry(), blurMaterial);
      blurPoints.renderOrder = -1;
      scene.add(blurPoints);
    }
    flashElement = createFlashElement();
    window.addEventListener('layout:resize', onWindowResize, false);

    // NÂNG CẤP TƯƠNG TÁC: Gắn các sự kiện chuột
    window.addEventListener('mousemove', updateMousePosition, false);
    window.addEventListener('click', onMouseClick, false);

    // nextStep();
  }
  function start() {
    if (isStarted) return;
    isStarted = true;
    nextStep();
  }

  function createDotTexture(size) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 4 * size;
    const context = canvas.getContext('2d');
    const radius = 2 * size;
    const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);

    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // Tâm trong hơn, bớt gắt
    gradient.addColorStop(0.35, 'rgba(200, 230, 255, 0.6)'); // Mờ dần ra nhanh hơn
    gradient.addColorStop(1, 'rgba(150, 200, 255, 0)'); // Mất hẳn ở viền

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(radius, radius, radius, 0, 2 * Math.PI);
    context.fill();
    return new THREE.CanvasTexture(canvas);
  }

  function determineQuality() {
    const storedQuality = localStorage.getItem('dotsQualityPreference');
    if (storedQuality && qualitySettings[storedQuality]) {
      quality = storedQuality;
      return;
    }
    if (navigator.deviceMemory || navigator.hardwareConcurrency) {
      const mem = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      if (mem <= 2 || cores <= 2) quality = 'low';
      else if (mem >= 8 && cores >= 6) quality = 'high';
      else quality = 'medium';
    }
  }

  function textToPoints(text) {
    // ===== BẮT ĐẦU PHẦN SỬA ĐỔI =====

    // 1. Tăng số điểm tối đa để chữ liền mạch hơn.
    const TARGET_POINT_COUNT = 8000;

    // ===== KẾT THÚC PHẦN SỬA ĐỔI =====

    const isSmallScreen = window.innerHeight <= 768 && !/Mac/.test(navigator.userAgent);
    const canvasWidth = isSmallScreen ? window.innerWidth : 800;
    const canvasHeight = isSmallScreen ? window.innerHeight : 350;
    const maxWidth = canvasWidth * 0.5;
    const maxHeight = canvasHeight * 0.5;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    const calculateOptimalLayout = () => {
      const wrapTextAtSize = (currentFontSize) => {
        ctx.font = `bold ${currentFontSize}px 'Noto Sans', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans Arabic', 'Noto Sans Devanagari', 'Noto Sans Hebrew', 'Noto Sans Thai', sans-serif`;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + ' ' + word;
          if (ctx.measureText(testLine).width > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        const finalLines = [];
        for (const line of lines) {
          if (ctx.measureText(line).width > maxWidth) {
            let tempLine = '';
            for (const char of line) {
              if (ctx.measureText(tempLine + char).width > maxWidth) {
                finalLines.push(tempLine);
                tempLine = char;
              } else {
                tempLine += char;
              }
            }
            finalLines.push(tempLine);
          } else {
            finalLines.push(line);
          }
        }
        return finalLines;
      };
      for (let fontSize = 120; fontSize >= 10; fontSize -= 2) {
        const lineHeight = fontSize * 1.2;
        const lines = wrapTextAtSize(fontSize);
        if (lines.length * lineHeight <= maxHeight) {
          return { lines, fontSize, lineHeight };
        }
      }
      const finalLines = wrapTextAtSize(10);
      return { lines: finalLines, fontSize: 10, lineHeight: 12 };
    };

    const { lines, fontSize, lineHeight } = calculateOptimalLayout();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = `bold ${fontSize}px 'Noto Sans', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans Arabic', 'Noto Sans Devanagari', 'Noto Sans Hebrew', 'Noto Sans Thai', sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const startY = canvasHeight / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, i) => {
      // --- BẮT ĐẦU SỬA LỖI LÀM DÀY CHỮ (PHIÊN BẢN 2) ---

      const x = canvasWidth / 2;
      const y = startY + i * lineHeight;

      // 1. Xác định một độ lệch rất nhỏ để "tô đậm"
      // Giá trị này có thể là 0.5, 0.75, hoặc 1.0 tùy vào độ dày mong muốn
      const offset = 0.75;

      // 2. Vẽ chữ 4 lần ở các vị trí lệch (trên, dưới, trái, phải)
      // Lớp này sẽ tạo ra phần "nền" dày hơn cho chữ
      ctx.fillText(line, x - offset, y);
      ctx.fillText(line, x + offset, y);
      ctx.fillText(line, x, y - offset);
      ctx.fillText(line, x, y + offset);

      // 3. Vẽ chữ lần cuối cùng ở vị trí chính giữa
      // Lớp này đảm bảo chữ vẫn giữ được độ sắc nét ở trung tâm
      ctx.fillText(line, x, y);

      // --- KẾT THÚC SỬA LỖI LÀM DÀY CHỮ ---
    });

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    let newPoints = [];

    // ===== BẮT ĐẦU PHẦN SỬA ĐỔI =====

    // 2. Giảm khoảng cách quét để điểm dày và liền mạch hơn.
    const gap = 3;

    // ===== KẾT THÚC PHẦN SỬA ĐỔI =====

    for (let h = 0; h < canvasHeight; h += gap) {
      for (let w = 0; w < canvasWidth; w += gap) {
        if (imageData[(h * canvasWidth + w) * 4 + 3] > 128) {
          newPoints.push({
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            tx: w - canvasWidth / 2,
            ty: -(h - canvasHeight / 2),
            vx: 0, vy: 0, vz: 0,
            exploded: false,
            opacity: 1,
            glowIntensity: 0
          });
        }
      }
    }

    if (newPoints.length > TARGET_POINT_COUNT) {
      for (let i = newPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPoints[i], newPoints[j]] = [newPoints[j], newPoints[i]];
      }
      newPoints = newPoints.slice(0, TARGET_POINT_COUNT);
    }

    return newPoints;
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    // Ghép các từ lại với nhau thành từng dòng
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Xử lý các dòng vẫn còn quá dài (do một từ đơn lẻ quá dài)
    const finalLines = [];
    lines.forEach((line) => {
      if (ctx.measureText(line).width > maxWidth) {
        let tempLine = '';
        for (const char of line) {
          if (ctx.measureText(tempLine + char).width > maxWidth) {
            finalLines.push(tempLine);
            tempLine = char;
          } else {
            tempLine += char;
          }
        }
        finalLines.push(tempLine);
      } else {
        finalLines.push(line);
      }
    });

    return finalLines;
  }

  function transitionToText(newText) {
    const newPointsData = textToPoints(newText);
    const oldPointsData = dotParticles;

    dotParticles = newPointsData;

    const targetLength = dotParticles.length;
    const currentLength = oldPointsData.length;

    for (let i = 0; i < targetLength; i++) {
      const oldPoint = oldPointsData[i % currentLength];
      if (oldPoint) {
        dotParticles[i].x = oldPoint.x;
        dotParticles[i].y = oldPoint.y;
      }
    }
    updateGeometry();
  }

  // Biến để lưu ảnh hiện tại đang hiển thị
  let currentImage = null;
  let imageOpacity = 0;
  let imageScale = 1.1; // Bắt đầu zoom in một chút
  let imageCanvas = null;
  let imageCtx = null;
  let dotsOpacity = 1.0; // Opacity của dots để làm mờ khi hiển thị ảnh

  // Tạo canvas overlay để hiển thị ảnh
  function initImageCanvas() {
    if (!imageCanvas) {
      imageCanvas = document.createElement('canvas');
      imageCanvas.style.position = 'absolute';
      imageCanvas.style.top = '0';
      imageCanvas.style.left = '0';
      imageCanvas.style.width = '100%';
      imageCanvas.style.height = '100%';
      imageCanvas.style.pointerEvents = 'none';
      imageCanvas.style.zIndex = '1000';
      container.appendChild(imageCanvas);
      imageCtx = imageCanvas.getContext('2d');
    }
    imageCanvas.width = window.innerWidth;
    imageCanvas.height = window.innerHeight;
  }

  function transitionToImage(imageSrc) {
    if (!imageCanvas) initImageCanvas();
    imageOpacity = 0; // Reset opacity để fade in
    imageScale = 1.1; // Bắt đầu zoom in một chút để tạo hiệu ứng
    currentImage = new Image();
    currentImage.src = imageSrc;
    // Làm mờ dots khi bắt đầu hiển thị ảnh
    dotsOpacity = 0.1;
  }

  function updateGeometry() {
    const numParticles = dotParticles.length;
    if (numParticles === 0) return;

    const positions = new Float32Array(numParticles * 3);
    const alphas = new Float32Array(numParticles);
    const glows = new Float32Array(numParticles);

    dotParticles.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.vz || 0; // Thêm vz
      alphas[i] = p.opacity;
      glows[i] = p.glowIntensity;
    });

    points.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    points.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    points.geometry.setAttribute('glow', new THREE.BufferAttribute(glows, 1));
    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.alpha.needsUpdate = true;
    points.geometry.attributes.glow.needsUpdate = true;

    if (blurPoints) {
      blurPoints.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      blurPoints.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas.map((a) => a * 0.5), 1));
      blurPoints.geometry.setAttribute('glow', new THREE.BufferAttribute(glows.map((g) => g * 2.5), 1));
      blurPoints.geometry.attributes.position.needsUpdate = true;
      blurPoints.geometry.attributes.alpha.needsUpdate = true;
      blurPoints.geometry.attributes.glow.needsUpdate = true;
    }
  }

  function updateFlyingDotsGeometry() {
    const numParticles = flyingDotParticles.length;
    if (numParticles === 0) {
      flyingPoints.visible = false;
      return;
    }
    flyingPoints.visible = true;

    const positions = new Float32Array(numParticles * 3);
    const alphas = new Float32Array(numParticles);
    const glows = new Float32Array(numParticles);

    flyingDotParticles.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.vz || 0;
      alphas[i] = p.opacity;
      glows[i] = p.glowIntensity;
    });

    flyingPoints.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    flyingPoints.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    flyingPoints.geometry.setAttribute('glow', new THREE.BufferAttribute(glows, 1));
    flyingPoints.geometry.attributes.position.needsUpdate = true;
    flyingPoints.geometry.attributes.alpha.needsUpdate = true;
    flyingPoints.geometry.attributes.glow.needsUpdate = true;
  }

  function nextStep() {
    clearTimeout(timeoutId);
    currentTextIndex++;

    if (currentState === 'countdown') {
      if (currentTextIndex < countdownSteps.length) {
        transitionToText(countdownSteps[currentTextIndex]);
        timeoutId = setTimeout(nextStep, 2500); // giữ lâu hơn để dễ đọc
      } else {
        // Sau countdown, bắt đầu fade out dots
        isFadingOut = true;
        dotsOpacity = 1.0; // Bắt đầu từ opacity 1.0
        // Sau khi fade out xong (khoảng 600ms), chuyển sang hiển thị ảnh
        timeoutId = setTimeout(() => {
          if (images && images.length > 0) {
            currentState = 'images';
            currentImageIndex = -1;
            currentTextIndex = -1;
            dotsOpacity = 0; // Ẩn hoàn toàn dots
            isFadingOut = false;
            // Ẩn hoàn toàn dots ngay lập tức
            if (points) {
              points.visible = false;
              if (points.material) points.material.opacity = 0;
            }
            if (flyingPoints) {
              flyingPoints.visible = false;
              if (flyingPoints.material) flyingPoints.material.opacity = 0;
            }
            if (blurPoints) {
              blurPoints.visible = false;
              if (blurPoints.material) blurPoints.material.opacity = 0;
            }
            nextStep();
          } else {
            // Nếu không có ảnh, chuyển sang messages
            currentState = 'message';
            currentTextIndex = -1;
            dotsOpacity = 1.0; // Giữ dots sáng khi chuyển sang messages
            isFadingOut = false;
            nextStep();
          }
        }, 600); // Delay 600ms để fade out
      }
    } else if (currentState === 'images') {
      currentImageIndex++;
      if (currentImageIndex < images.length) {
        transitionToImage(images[currentImageIndex]);
        timeoutId = setTimeout(nextStep, 2000); // Hiển thị mỗi ảnh 2 giây (nhanh hơn)
      } else {
        // Sau khi hiển thị hết ảnh, chuyển sang messages
        currentState = 'message';
        currentTextIndex = -1;
        dotsOpacity = 0; // Bắt đầu từ 0 để fade in
        isFadingOut = false; // Tắt fade out
        // Hiển thị lại points
        if (points) points.visible = true;
        if (flyingPoints) flyingPoints.visible = true;
        if (blurPoints) blurPoints.visible = true;
        nextStep();
      }
    } else if (currentState === 'message') {
      if (currentTextIndex < messages.length) {
        transitionToText(messages[currentTextIndex]);
        timeoutId = setTimeout(nextStep, 6000); // tăng thời gian dừng giữa các thông điệp
      } else {
        // Sau khi hết messages, chuyển sang final
        startFinalTransition();
      }
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (imageCanvas) {
      imageCanvas.width = window.innerWidth;
      imageCanvas.height = window.innerHeight;
    }
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const time = performance.now();

    // --- SỬA LỖI XOÁY VÔ HẠN KHI CHUYỂN TAB (BẢN CUỐI) ---
    let elapsedTime = time - lastTime;

    // GIỚI HẠN thời gian tối đa một cách chặt chẽ hơn.
    // 34ms tương đương với khoảng 2 khung hình (16.67 * 2).
    // Điều này đảm bảo rằng bước di chuyển lớn nhất cũng không thể "nhảy" qua tâm.
    if (elapsedTime > 34) {
      elapsedTime = 34;
    }

    const delta = elapsedTime / 16.67;
    lastTime = time;
    // --- KẾT THÚC SỬA LỖI ---

    glowUniforms.uTime.value = time * 0.001;
    if (blurMaterial) blurMaterial.uniforms.uTime.value = time * 0.001;

    // --- BẮT ĐẦU PHẦN SỬA ---
    if (currentState === 'imploding') {
      // Hiệu ứng lõi năng lượng rung động (giữ nguyên)
      const pulse = 1 + Math.sin(time * 0.02) * 0.2;
      flashElement.style.transform = `translate(-50%, -50%) scale(${pulse})`;

      // Logic hội tụ xoáy ốc (ĐÃ TĂNG TỐC)
      const attraction = 0.95 * delta;
      const spiral = 1.05 * delta;

      dotParticles.forEach((p) => {
        const dx = -p.x;
        const dy = -p.y;
        const distance = Math.hypot(dx, dy);

        // Tăng ngưỡng "hấp thụ" để các hạt biến mất nhanh hơn khi vào gần tâm
        if (distance > 10) { // <-- TĂNG NGƯỠNG TỪ 1 LÊN 10
          const ax = (dx / distance) * attraction;
          const ay = (dy / distance) * attraction;
          const sx = (-dy / distance) * spiral;
          const sy = (dx / distance) * spiral;

          p.x += ax + sx;
          p.y += ay + sy;
        } else {
          p.opacity = 0; // Hấp thụ hạt
        }
      });

      // Lọc bỏ các hạt đã bị "hấp thụ" (giữ nguyên)
      dotParticles = dotParticles.filter((p) => p.opacity > 0);

      // Khi gần hết hạt, kích hoạt vụ nổ (giữ nguyên)
      if (dotParticles.length < 20) {
        currentState = 'finished';
        triggerSupernova();
      }
    } else {
      // Logic di chuyển bình thường (code cũ của bạn)
      const lerpFactor = 0.05 * delta;
      dotParticles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        let forceX = 0;
        let forceY = 0;
        if (distance < REPULSION_RADIUS) {
          const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
          forceX = (dx / distance) * force * REPULSION_STRENGTH;
          forceY = (dy / distance) * force * REPULSION_STRENGTH;
        }
        p.vx = (p.vx || 0) * 0.95 + forceX;
        p.vy = (p.vy || 0) * 0.95 + forceY;

        p.x += (p.tx - p.x) * lerpFactor + p.vx;
        p.y += (p.ty - p.y) * lerpFactor + p.vy;
        p.glowIntensity *= Math.pow(0.95, delta);
      });
    }
    // --- KẾT THÚC PHẦN SỬA ---

    // Cập nhật các hạt bay từ vụ nổ click (phần này giữ nguyên)
    flyingDotParticles.forEach((p) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z = (p.z || 0) + p.vz * delta;
      p.lifetime--;
      p.opacity = Math.max(0, p.lifetime / 90);
      p.glowIntensity *= 0.97;
    });
    flyingDotParticles = flyingDotParticles.filter((p) => p.lifetime > 0);

    // Điều chỉnh opacity của dots
    if (isFadingOut) {
      // Fade out dots sau khi countdown kết thúc
      if (dotsOpacity > 0) {
        dotsOpacity = Math.max(0, dotsOpacity - 0.08); // Fade out nhanh hơn
      }
      if (points.material) points.material.opacity = dotsOpacity;
      if (flyingPoints.material) flyingPoints.material.opacity = dotsOpacity;
      if (blurPoints && blurPoints.material) blurPoints.material.opacity = dotsOpacity;
    } else if (currentState === 'images') {
      // Giữ dots ẩn hoàn toàn khi ở state images
      dotsOpacity = 0;
      if (points) {
        points.visible = false; // Ẩn hoàn toàn points object
        if (points.material) points.material.opacity = 0;
      }
      if (flyingPoints) {
        flyingPoints.visible = false;
        if (flyingPoints.material) flyingPoints.material.opacity = 0;
      }
      if (blurPoints) {
        blurPoints.visible = false;
        if (blurPoints.material) blurPoints.material.opacity = 0;
      }
    } else {
      // Fade in dots cho các state khác (như message)
      if (points) points.visible = true; // Hiển thị lại points
      if (flyingPoints) flyingPoints.visible = true;
      if (blurPoints) blurPoints.visible = true;
      if (dotsOpacity < 1.0) {
        dotsOpacity = Math.min(1.0, dotsOpacity + 0.05);
      }
      if (points.material) points.material.opacity = dotsOpacity;
      if (flyingPoints.material) flyingPoints.material.opacity = dotsOpacity;
      if (blurPoints && blurPoints.material) blurPoints.material.opacity = dotsOpacity;
    }

    updateGeometry();
    updateFlyingDotsGeometry();
    renderer.render(scene, camera);

    // Vẽ ảnh nếu đang ở state images
    if (currentState === 'images' && imageCanvas && imageCtx) {
      if (currentImage && currentImage.complete) {
        // Fade in ảnh và zoom effect
        if (imageOpacity < 1) {
          imageOpacity = Math.min(1, imageOpacity + 0.05); // Fade in nhanh hơn
        }
        // Zoom out từ 1.1 về 1.0 để tạo hiệu ứng mượt
        if (imageScale > 1.0) {
          imageScale = Math.max(1.0, imageScale - 0.01);
        }
        
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        imageCtx.globalAlpha = imageOpacity;
        imageCtx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Nền tối hơn để ảnh nổi bật
        imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
        
        // Tính toán kích thước ảnh để fit màn hình với zoom effect
        const maxWidth = imageCanvas.width * 0.9;
        const maxHeight = imageCanvas.height * 0.9;
        let imgWidth = currentImage.width;
        let imgHeight = currentImage.height;
        const aspect = imgWidth / imgHeight;
        
        if (imgWidth > maxWidth) {
          imgWidth = maxWidth;
          imgHeight = imgWidth / aspect;
        }
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * aspect;
        }
        
        // Áp dụng zoom effect
        const scaledWidth = imgWidth * imageScale;
        const scaledHeight = imgHeight * imageScale;
        const x = (imageCanvas.width - scaledWidth) / 2;
        const y = (imageCanvas.height - scaledHeight) / 2;
        
        imageCtx.drawImage(currentImage, x, y, scaledWidth, scaledHeight);
        imageCtx.globalAlpha = 1;
      }
    } else if (currentState !== 'images' && imageCanvas) {
      // Fade out và ẩn canvas khi không ở state images
      if (imageOpacity > 0) {
        imageOpacity = Math.max(0, imageOpacity - 0.05);
        imageScale = Math.min(1.1, imageScale + 0.01); // Zoom in khi fade out
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        if (currentImage && currentImage.complete) {
          imageCtx.globalAlpha = imageOpacity;
          imageCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
          
          const maxWidth = imageCanvas.width * 0.9;
          const maxHeight = imageCanvas.height * 0.9;
          let imgWidth = currentImage.width;
          let imgHeight = currentImage.height;
          const aspect = imgWidth / imgHeight;
          
          if (imgWidth > maxWidth) {
            imgWidth = maxWidth;
            imgHeight = imgWidth / aspect;
          }
          if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = imgHeight * aspect;
          }
          
          const scaledWidth = imgWidth * imageScale;
          const scaledHeight = imgHeight * imageScale;
          const x = (imageCanvas.width - scaledWidth) / 2;
          const y = (imageCanvas.height - scaledHeight) / 2;
          
          imageCtx.drawImage(currentImage, x, y, scaledWidth, scaledHeight);
        }
        imageCtx.globalAlpha = 1;
      } else {
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        imageScale = 1.1; // Reset scale
      }
    }
  }

  init();
  animate();
  return { start };
}

 function createFallingWords({ images }) {
  const canvas = document.getElementById('falling-words-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Dùng ảnh mẫu nếu chưa có dữ liệu
  const fallbackImages = localImagePool;
  const imagePool = images && images.length ? images : fallbackImages;

  // Preload images
  const loadedImages = [];
  imagePool.forEach((src) => {
    const img = new Image();
    img.src = src;
    loadedImages.push(img);
  });

  let sprites = [];
  let usedImageIndices = []; // Mảng theo dõi các index ảnh đã được sử dụng
  const maxSprites = Math.min(14, imagePool.length); // số lượng item rơi, không vượt quá số ảnh có sẵn

  // Tạo overlay phóng to ảnh
  let zoomOverlay = document.getElementById('image-zoom-overlay');
  if (!zoomOverlay) {
    zoomOverlay = document.createElement('div');
    zoomOverlay.id = 'image-zoom-overlay';
    zoomOverlay.className = 'image-zoom-overlay';
    const zoomImg = document.createElement('img');
    zoomOverlay.appendChild(zoomImg);
    document.body.appendChild(zoomOverlay);
    
    // Click ra ngoài để đóng overlay
    zoomOverlay.addEventListener('click', (e) => {
      if (e.target === zoomOverlay) {
        zoomOverlay.classList.remove('active');
      }
    });
    
    // Phím ESC để đóng overlay
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && zoomOverlay.classList.contains('active')) {
        zoomOverlay.classList.remove('active');
      }
    });
  }
  const zoomImg = zoomOverlay.querySelector('img');

  // --- HỆ THỐNG VẬT LÝ VÀ TƯƠNG TÁC ---
  const mouse = { x: 0, y: 0, isDown: false, prevX: 0, prevY: 0, startX: 0, startY: 0 };
  let draggedSprite = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let particles = [];
  const FRICTION = 0.85; // Tăng ma sát để chữ bớt "trôi"
  const SPARKLE_VELOCITY_THRESHOLD = 4; // Ngưỡng vận tốc để tạo vệt sao

  // Định nghĩa "Từ Trường" của trái tim để đẩy ảnh ra
  let heartZone = { x: 0, y: 0, width: 0, height: 0, repulsion: 1.8 };
  
  // Hàm tính toán điểm trên đường cong trái tim
  const getHeartPoint = (t, scale) => {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const heartX = width / 2 + x * scale;
    const heartY = height / 2 - y * scale - height * 0.1; // Đưa lên cao hơn để chữ ở dưới
    return { x: heartX, y: heartY };
  };
  
  // Hàm kiểm tra xem một điểm có nằm bên trong hình trái tim không
  const isPointInsideHeart = (px, py, scale) => {
    const heartCenterX = width / 2;
    const heartCenterY = height / 2 - height * 0.1;
    
    // Chuyển tọa độ về hệ tọa độ trái tim (gốc ở tâm)
    const dx = (px - heartCenterX) / scale;
    const dy = (py - heartCenterY) / scale;
    
    // Tính góc của điểm
    const angle = Math.atan2(dy, dx);
    const t = angle;
    
    // Tính điểm trên đường cong trái tim tại góc này
    const heartX = 16 * Math.pow(Math.sin(t), 3);
    const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const heartR = Math.hypot(heartX, heartY);
    const pointR = Math.hypot(dx, dy);
    
    // Nếu khoảng cách từ tâm đến điểm nhỏ hơn khoảng cách đến đường cong thì nằm trong
    return pointR <= heartR * 0.98; // 0.98 để đảm bảo không sát viền
  };
  
  // Hàm tạo điểm ngẫu nhiên bên trong hình trái tim
  const generatePointInsideHeart = (scale) => {
    const heartCenterX = width / 2;
    const heartCenterY = height / 2 - height * 0.1;
    let attempts = 0;
    while (attempts < 100) {
      // Tạo điểm ngẫu nhiên trong vùng hình chữ nhật bao quanh trái tim
      const maxRadius = scale * 20; // Bán kính tối đa của trái tim
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * maxRadius;
      
      const px = heartCenterX + Math.cos(angle) * radius;
      const py = heartCenterY + Math.sin(angle) * radius;
      
      if (isPointInsideHeart(px, py, scale)) {
        return { x: px, y: py };
      }
      attempts++;
    }
    // Nếu không tìm được, trả về điểm gần tâm
    return { x: heartCenterX, y: heartCenterY };
  };
  
  function updateHeartZone() {
    const heartSize = Math.min(width, height) / 9;
    heartZone.width = heartSize * 2.5;
    heartZone.height = heartSize * 2.5;
    heartZone.x = width / 2 - heartZone.width / 2;
    heartZone.y = height / 2 - heartZone.height / 2;
  }
  updateHeartZone();

  // Hàm kiểm tra chồng chéo
  const isOverlapping = (rect1, spriteList) => {
    for (const p of spriteList) {
      if (p === draggedSprite) continue; // Bỏ qua item đang được kéo
      const rect2 = p.rect;
      if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      ) {
        return true;
      }
    }
    return false;
  };

  const isOverHeartZone = (rect) => {
    return (
      rect.x < heartZone.x + heartZone.width &&
      rect.x + rect.width > heartZone.x &&
      rect.y < heartZone.y + heartZone.height &&
      rect.y + rect.height > heartZone.y
    );
  };

  function resetSprite(sprite) {
    // Chọn ảnh chưa được sử dụng
    const availableIndices = loadedImages
      .map((_, index) => index)
      .filter(index => !usedImageIndices.includes(index));
    
    // Nếu không còn ảnh nào chưa dùng, không spawn
    if (availableIndices.length === 0) {
      return false;
    }
    
    // Chọn ngẫu nhiên một ảnh chưa được dùng
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const imgIndex = availableIndices[randomIndex];
    
    const img = loadedImages[imgIndex];
    const baseSize = Math.min(width, height) * 0.18; // tăng kích thước ảnh rơi
    const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
    const displayWidth = aspect >= 1 ? baseSize : baseSize * aspect;
    const displayHeight = aspect >= 1 ? baseSize / aspect : baseSize;

    sprite.image = img;
    sprite.imgIndex = imgIndex; // Lưu index để có thể xóa khỏi usedImageIndices khi sprite bị xóa
    sprite.speedY = 0.25 + Math.random() * 0.35;
    sprite.opacity = 0.8 + Math.random() * 0.2;
    sprite.vx = (Math.random() - 0.5) * 0.6;
    sprite.vy = 0;
    sprite.width = displayWidth;
    sprite.height = displayHeight;
    let isSafe = false;
    let tries = 0;
    while (!isSafe && tries < 20) {
      sprite.x = Math.random() * (width - displayWidth);
      sprite.y = -60 - Math.random() * 120;
      sprite.rect = { x: sprite.x, y: sprite.y, width: displayWidth, height: displayHeight };
      if (!isOverlapping(sprite.rect, sprites) && !isOverHeartZone(sprite.rect)) {
        isSafe = true;
      }
      tries++;
    }
    
    // Chỉ đánh dấu ảnh đã được dùng khi sprite được tạo thành công
    if (isSafe) {
      usedImageIndices.push(imgIndex);
    }
    
    return isSafe;
  }

  function triggerStardustBurst(x, y) {
    const count = 16; // lượng hạt vừa phải
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * (4 + Math.random() * 4),
        vy: (Math.random() - 0.5) * (4 + Math.random() * 4),
        life: 50 + Math.random() * 30,
        opacity: 0.9 + Math.random() * 0.1
      });
    }
  }

  function createSparkles(x, y, count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 40 + Math.random() * 20,
        opacity: 0.8 + Math.random() * 0.2
      });
    }
  }

  // Logic vẽ và cập nhật animation (giữ nguyên, vì logic tương tác tim đã có sẵn)
  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    // Chỉ spawn nếu còn ảnh chưa được dùng
    const availableIndices = loadedImages
      .map((_, index) => index)
      .filter(index => !usedImageIndices.includes(index));
    
    if (sprites.length < maxSprites && availableIndices.length > 0 && Math.random() > 0.95) {
      const newSprite = {};
      if (resetSprite(newSprite)) {
        sprites.push(newSprite);
      }
    }

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (p.life / 60)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    sprites.forEach((sprite, index) => {
      if (sprite !== draggedSprite) {
        // Tương tác đẩy lùi với trái tim
        const spriteCenterX = sprite.x + sprite.rect.width / 2;
        const spriteCenterY = sprite.y + sprite.rect.height / 2;

        // Kiểm tra xem ảnh có nằm trong vùng "từ trường" của trái tim không
        if (
          sprite.rect.x < heartZone.x + heartZone.width &&
          sprite.rect.x + sprite.rect.width > heartZone.x &&
          sprite.rect.y < heartZone.y + heartZone.height &&
          sprite.rect.y + sprite.rect.height > heartZone.y
        ) {
          const heartCenterX = heartZone.x + heartZone.width / 2;
          const heartCenterY = heartZone.y + heartZone.height / 2;

          const dx = spriteCenterX - heartCenterX;
          const dy = spriteCenterY - heartCenterY;
          const distance = Math.hypot(dx, dy);

          if (distance > 1) { // Tránh chia cho 0
            const repelX = dx / distance;
            const repelY = dy / distance;
            const force = (1 - distance / (heartZone.width / 1.8)) * heartZone.repulsion;
            if (force > 0) { // Chỉ áp dụng lực đẩy ra
              sprite.vx += repelX * force;
              sprite.vy += repelY * force;
            }
          }
        }

        // Áp dụng ma sát và trọng lực/vận tốc rơi
        sprite.vx *= FRICTION;
        sprite.vy *= FRICTION;
        sprite.x += sprite.vx;
        sprite.y += sprite.vy + sprite.speedY;
      }

      // Cập nhật rect
      sprite.rect.x = sprite.x;
      sprite.rect.y = sprite.y;
      sprite.rect.width = sprite.width;
      sprite.rect.height = sprite.height;

      ctx.save();
      const currentOpacity = sprite === draggedSprite ? 1 : sprite.opacity;
      ctx.globalAlpha = currentOpacity;
      ctx.shadowColor = sprite === draggedSprite ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.55)';
      ctx.shadowBlur = sprite === draggedSprite ? 18 : 10;
      if (sprite.image?.complete) {
        ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
      }
      ctx.restore();

      const velocityMag = Math.hypot(sprite.vx, sprite.vy);
      if (velocityMag > SPARKLE_VELOCITY_THRESHOLD) {
        createSparkles(sprite.x + sprite.rect.width / 2, sprite.y + sprite.rect.height / 2, 2);
      }

      if (sprite.y > height + 80) {
        // Xóa index khỏi usedImageIndices khi sprite bị xóa
        if (sprite.imgIndex !== undefined) {
          const idx = usedImageIndices.indexOf(sprite.imgIndex);
          if (idx > -1) {
            usedImageIndices.splice(idx, 1);
          }
        }
        sprites.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  };

  // --- BỘ LẮNG NGHE SỰ KIỆN TƯƠNG TÁC ---
  const handleStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouse.isDown = true;
    mouse.x = clientX;
    mouse.y = clientY;
    mouse.startX = clientX;
    mouse.startY = clientY;
    mouse.clickTimestamp = performance.now();

    for (let i = sprites.length - 1; i >= 0; i--) {
      const p = sprites[i];
      // Tăng vùng click cho dễ tương tác
      if (
        mouse.x > p.rect.x - 5 &&
        mouse.x < p.rect.x + p.rect.width + 5 &&
        mouse.y > p.rect.y - 5 &&
        mouse.y < p.rect.y + p.rect.height + 5
      ) {
        draggedSprite = p;
        draggedSprite.vx = 0;
        draggedSprite.vy = 0;
        dragOffsetX = mouse.x - p.x;
        dragOffsetY = mouse.y - p.y;
        break;
      }
    }
  };

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('touchstart', handleStart, { passive: false });

  const handleMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouse.x = clientX;
    mouse.y = clientY;
    if (draggedSprite) {
      draggedSprite.x = mouse.x - dragOffsetX;
      draggedSprite.y = mouse.y - dragOffsetY;
      draggedSprite.vx = (mouse.x - mouse.prevX) * 0.8;
      draggedSprite.vy = (mouse.y - mouse.prevY) * 0.8;
    }
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
  };

  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('touchmove', handleMove, { passive: false });

  const releaseDrag = (e) => {
    if (e && e.type === 'touchmove') return; // Tránh xử lý khi đang drag
    const timeElapsed = performance.now() - mouse.clickTimestamp;
    // Nếu click nhanh (dưới 200ms) và không có drag nhiều thì phóng to ảnh
    const dragDistance = Math.hypot(mouse.x - mouse.startX, mouse.y - mouse.startY);
    if (mouse.isDown && timeElapsed < 200 && draggedSprite && dragDistance < 10) {
      // Mở overlay phóng to ảnh
      if (draggedSprite.image && draggedSprite.image.complete) {
        zoomImg.src = draggedSprite.image.src;
        zoomOverlay.classList.add('active');
        // Tạo hiệu ứng burst khi phóng to
        triggerStardustBurst(
          draggedSprite.x + draggedSprite.rect.width / 2,
          draggedSprite.y + draggedSprite.rect.height / 2
        );
      }
    }

    mouse.isDown = false;
    draggedSprite = null;
  };
  canvas.addEventListener('mouseup', releaseDrag);
  canvas.addEventListener('mouseout', releaseDrag);
  canvas.addEventListener('touchend', releaseDrag);
  canvas.addEventListener('touchcancel', releaseDrag);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    updateHeartZone(); // Cập nhật vùng "Từ Trường"
    sprites = []; // Xóa hết item cũ để bắt đầu lại cho đẹp
    usedImageIndices = []; // Reset danh sách ảnh đã dùng
  });

  animate();
}

// Giữ nguyên hàm createHeartFinish
function createHeartFinish({ text }) {
  const canvas = document.getElementById('heart-canvas');
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Load ảnh trái tim từ folder anh-ket-thuc
  const heartImage = new Image();
  heartImage.src = '/anh-ket-thuc/tha-tim.png';
  let heartImageLoaded = false;
  heartImage.onload = () => {
    heartImageLoaded = true;
  };

  // Mảng chứa các hạt hào quang
  const particles = [];

  // Hàm tính toán điểm trên đường cong trái tim
  const getHeartPoint = (t, scale) => {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const heartX = width / 2 + x * scale;
    const heartY = height / 2 - y * scale - height * 0.1; // Đưa lên cao hơn để chữ ở dưới
    return { x: heartX, y: heartY };
  };

  // Hàm ngắt dòng (giữ nguyên)
  const wrapText = (ctxWrap, textWrap, maxWidth) => {
    if (!textWrap) return [];
    const lines = [];
    const words = textWrap.split(' ');
    let currentLine = '';
    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (ctxWrap.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);
    return lines;
  };

  const animate = (time) => {
    ctx.clearRect(0, 0, width, height);

    // NÂNG CẤP 5: Nền vũ trụ sâu thẳm
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.5);
    gradient.addColorStop(0, 'rgba(40, 8, 70, 0.2)'); // Tâm sáng nhẹ
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Mờ dần ra ngoài
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // --- HIỆU ỨNG TRÁI TIM ---
    // NÂNG CẤP 1: Trái tim nhỏ hơn
    const baseScale = Math.min(width, height) / 40;
    // NÂNG CẤP 2: Nhịp thở phức hợp (thêm 1 sin nhanh hơn)
    const pulse = 1 + Math.sin(time * 0.0008) * 0.04 + Math.sin(time * 0.002) * 0.02;
    const currentScale = baseScale * pulse;

    // Vẽ ảnh trái tim từ folder anh-ket-thuc
    if (heartImageLoaded && heartImage.complete && heartImage.naturalWidth && heartImage.naturalHeight) {
      const heartCenterX = width / 2;
      const heartCenterY = height / 2 - height * 0.1;
      
      // Tính kích thước ảnh dựa trên scale, giữ nguyên tỷ lệ khung hình
      const baseImageSize = currentScale * 35; // Kích thước cơ sở
      const aspectRatio = heartImage.naturalWidth / heartImage.naturalHeight;
      
      let imageWidth, imageHeight;
      if (aspectRatio >= 1) {
        // Ảnh ngang hoặc vuông
        imageWidth = baseImageSize;
        imageHeight = baseImageSize / aspectRatio;
      } else {
        // Ảnh dọc
        imageWidth = baseImageSize * aspectRatio;
        imageHeight = baseImageSize;
      }
      
      const imageX = heartCenterX - imageWidth / 2;
      const imageY = heartCenterY - imageHeight / 2;
      
      // Vẽ ảnh không có viền
      ctx.save();
      ctx.globalAlpha = 0.9 + Math.sin(time * 0.002) * 0.1; // Hiệu ứng nhấp nháy nhẹ
      ctx.drawImage(heartImage, imageX, imageY, imageWidth, imageHeight);
      ctx.restore();
    }

    // --- HIỆU ỨNG HÀO QUANG QUỸ ĐẠO ---
    // NÂNG CẤP 3: Hạt hào quang xoay quanh quỹ đạo
    if (particles.length < 150) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        orbitRadius: currentScale * 17 + Math.random() * 10,
        speed: 0.005 + Math.random() * 0.005,
        life: 150 + Math.random() * 100,
        hue: 300 + Math.random() * 60
      });
    }

    particles.forEach((p, i) => {
      p.angle += p.speed;
      p.life--;
      p.orbitRadius *= 1.002; // Từ từ bay ra xa

      if (p.life <= 0) particles.splice(i, 1);

      const heartCenterX = width / 2;
      const heartCenterY = height / 2 - height * 0.1; // Khớp với vị trí trái tim mới
      const particleX = heartCenterX + Math.cos(p.angle) * p.orbitRadius;
      const particleY = heartCenterY + Math.sin(p.angle) * p.orbitRadius;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${p.life / 250})`;
      ctx.arc(particleX, particleY, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- HIỆU ỨNG CHỮ ---
    // Đặt text ở bên dưới trái tim
    const maxTextWidth = baseScale * 16;
    const fontSize = Math.min(width, height) * 0.04 * pulse;
    ctx.font = `bold ${fontSize}px 'Noto Sans', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans Arabic', 'Noto Sans Devanagari', 'Noto Sans Hebrew', 'Noto Sans Thai', sans-serif`;
    const lines = wrapText(ctx, text, maxTextWidth);
    const lineHeight = fontSize * 1.2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(255, 105, 180, 0.9)';
    ctx.shadowBlur = 20; // Tăng shadow cho nổi bật

    // Vị trí text ở bên dưới trái tim (trái tim ở height/2 - height*0.1, text ở height/2 + height*0.15)
    const textY = height / 2 + height * 0.15;
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, textY + (i - (lines.length - 1) / 2) * lineHeight);
    });

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
  };

  const onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    particles.length = 0; // Xóa hạt cũ khi resize
  };

  window.addEventListener('layout:resize', onResize);
  requestAnimationFrame(animate);
}

 function setupBackgroundMusic(urls) {
   const sources = [
     ...(Array.isArray(urls) ? urls.filter(Boolean) : [urls].filter(Boolean)),
     ...defaultMusicFallback
   ];
   if (!sources.length) return;

   let currentIndex = 0;
   const audio = new Audio();
   audio.loop = true;
   audio.preload = 'auto';
   audio.crossOrigin = 'anonymous';
   audio.autoplay = true;
   audio.playsInline = true;
   audio.muted = true; // cố gắng autoplay không tiếng, sau đó bỏ mute khi đã phát
  audio.volume = 1;
   backgroundAudio = audio;
   let awaitingUserGesture = false;
   let autoplayAttempts = 0;
   const MAX_AUTOPLAY_RETRY = 6;
  let forceRetryCount = 0;
  const MAX_FORCE_RETRY = 8;

   const tryPlay = () => {
     if (currentIndex >= sources.length) return;
     audio.src = sources[currentIndex];
     audio.play()
       .then(() => {
         awaitingUserGesture = false;
         if (audio.muted) {
           audio.muted = false;
           audio.play().catch(() => {});
         }
       })
       .catch((err) => {
         if (err && err.name === 'NotAllowedError') {
           awaitingUserGesture = true;
          scheduleAutoplayRetry();
          return; // đừng chuyển nguồn nếu chỉ bị chặn autoplay
         }
         currentIndex += 1;
         tryPlay();
       });
   };

   const scheduleAutoplayRetry = () => {
    if (autoplayAttempts >= MAX_AUTOPLAY_RETRY) return;
    const delay = 700 * (1 + autoplayAttempts);
    autoplayAttempts += 1;
    setTimeout(() => {
      tryPlay();
    }, delay);
  };

   audio.addEventListener('error', () => {
     currentIndex += 1;
     tryPlay();
   });

   ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((ev) =>
    document.addEventListener(
      ev,
      () => {
        if (awaitingUserGesture) {
          awaitingUserGesture = false;
          tryPlay();
          return;
        }
        tryPlay();
      },
      { once: true }
    )
  );

   window.addEventListener('load', () => {
    tryPlay();
  }, { once: true });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && awaitingUserGesture) {
      tryPlay();
    }
  });

   tryPlay();

  // Cưỡng chế retry nhiều lần đầu tải trang để tăng khả năng autoplay
  const forceRetry = () => {
    if (forceRetryCount >= MAX_FORCE_RETRY) return;
    forceRetryCount += 1;
    audio.play()
      .then(() => {
        if (audio.muted) {
          audio.muted = false;
          audio.play().catch(() => {});
        }
      })
      .catch(() => {});
    setTimeout(forceRetry, 1200);
  };
  setTimeout(forceRetry, 800);
 }

document.addEventListener('DOMContentLoaded', () => {
  // Bật nền động chấm tinh tế
  createMatrixBackground({ text: '•' });

  // 1. Khởi tạo animation và nhận về đối tượng điều khiển (có chứa hàm start)
  const dotsAnimationController = createDotsAnimation({
    messages: countdownData.messages,
    images: albumImagePool, // Dùng ảnh từ folder album cho slideshow
    onComplete: () => {
      document.getElementById('dots-canvas-container').style.display = 'none';
      createHeartFinish({ text: countdownData.finalText });
      createFallingWords({ images: localImagePool }); // Dùng ảnh từ folder img cho phần cuối
    }
  });

  // Phát nhạc nền (nếu có)
  setupBackgroundMusic(countdownData.music);

  // 2. Truyền đối tượng điều khiển này vào layout manager
  initializeLayoutManager(dotsAnimationController);
});

// =======================================================================
// ---- KIỂM TRA HƯỚNG MÀN HÌNH ĐỂ HIỂN THỊ CẢNH BÁO ----
// =======================================================================

function initializeLayoutManager(animationToStart) {
  const debounceCustom = (func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleLayoutChange = () => {
    const isMobilePortrait = window.innerHeight > window.innerWidth && 'ontouchstart' in window;

    if (isMobilePortrait) {
      document.body.classList.add('portrait-mode');
    } else {
      document.body.classList.remove('portrait-mode');

      // <<< THÊM LOGIC GỌI START() TẠI ĐÂY >>>
      // Khi màn hình đã đúng, ra lệnh cho animation bắt đầu
      if (animationToStart && typeof animationToStart.start === 'function') {
        animationToStart.start();
      }

      // Thông báo cho tất cả layer cập nhật kích thước
      window.dispatchEvent(new Event('layout:resize'));
    }
  };

  const debouncedLayoutHandler = debounceCustom(handleLayoutChange, 250);

  // Lắng nghe sự kiện gốc của trình duyệt
  window.addEventListener('resize', debouncedLayoutHandler);
  window.addEventListener('orientationchange', debouncedLayoutHandler);

  // Chạy lần đầu
  handleLayoutChange();
}

