import * as THREE from "three";
import type { Cleanup } from "../page-lifecycle";

type Bubble = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
  baseX: number;
  radius: number;
  speed: number;
  phase: number;
};

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uAccent;
  uniform float uPhase;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vViewPosition);
    float facing = clamp(dot(normal, viewDirection), 0.0, 1.0);
    float fresnel = 1.0 - facing;
    float outerRim = pow(fresnel, 4.4);
    float innerRim = smoothstep(0.1, 0.9, fresnel) * (1.0 - outerRim);

    vec3 keyLight = normalize(vec3(-0.58, 0.72, 0.54));
    vec3 fillLight = normalize(vec3(0.74, -0.42, 0.38));
    float keyGlint = pow(max(dot(normal, keyLight), 0.0), 46.0);
    float keyHalo = pow(max(dot(normal, keyLight), 0.0), 12.0);
    float lowerHalo = pow(max(dot(normal, fillLight), 0.0), 18.0);
    float shadedArc = pow(max(dot(normal, -keyLight), 0.0), 9.0) * outerRim;

    float filmWave = 0.5 + 0.5 * sin(facing * 22.0 + uPhase);
    float filmMask = smoothstep(0.48, 0.9, fresnel) * (1.0 - outerRim);
    vec3 gold = vec3(0.96, 0.74, 0.12);
    vec3 coral = vec3(0.91, 0.31, 0.22);
    vec3 filmColor = mix(uAccent, gold, filmWave);
    filmColor = mix(filmColor, coral, (1.0 - filmWave) * 0.16);

    vec3 color = vec3(1.0);
    color = mix(color, uAccent, innerRim * 0.24);
    color = mix(color, filmColor, filmMask * 0.58);
    color = mix(color, uAccent, outerRim * 0.56);
    color = mix(color, gold, keyHalo * 0.3);
    color = mix(color, vec3(0.035, 0.34, 0.26), lowerHalo * 0.28);
    color = mix(color, vec3(0.035, 0.34, 0.26), shadedArc * 0.42);
    color += keyGlint * 0.84;

    float alpha = 0.006;
    alpha += innerRim * (0.055 + filmWave * 0.04);
    alpha += outerRim * 0.7;
    alpha += keyHalo * 0.15 + lowerHalo * 0.09;
    alpha += shadedArc * 0.12;
    alpha += keyGlint * 0.48;
    gl_FragColor = vec4(color, min(alpha, 0.78));
  }
`;

const fraction = (value: number) => value - Math.floor(value);
const hash = (value: number) => fraction(Math.sin(value * 91.345) * 47453.5453);

const accents = [
  new THREE.Color("#e94f37"),
  new THREE.Color("#e2b91f"),
  new THREE.Color("#b8e2d2"),
];

export const initializeHeroField = (root: HTMLElement): Cleanup => {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-hero-field]");
  const opening = root.querySelector<HTMLElement>(".opening");
  if (!canvas || !opening) return () => {};

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const noteCount = Math.max(1, Number(canvas.dataset.noteCount) || 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const clock = new THREE.Clock();
  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  const geometry = new THREE.SphereGeometry(1, 48, 32);
  const bubbles: Bubble[] = [];
  let renderer: THREE.WebGLRenderer;
  let frame = 0;
  let visible = true;
  let disposed = false;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    canvas.classList.add("is-webgl-fallback");
    return () => {};
  }

  renderer.setClearColor(0x086b52, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  camera.position.set(0, 0, 12);

  const makeMaterial = (index: number) => new THREE.ShaderMaterial({
    uniforms: {
      uAccent: { value: accents[index % accents.length] },
      uPhase: { value: hash(index + 4.2) * Math.PI * 2 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const total = matchMedia("(max-width: 760px)").matches ? 9 : 14;
  for (let index = 0; index < total; index += 1) {
    const anchor = index < noteCount;
    const radius = anchor
      ? 0.5 + hash(index + 2.8) * 0.4
      : 0.16 + hash(index + 8.4) * 0.32;
    const material = makeMaterial(index);
    const mesh = new THREE.Mesh(geometry, material);
    const depth = -2.4 + hash(index + 5.7) * 4.8;
    const baseX = -3.25 + hash(index + 1.7) * 6.5;
    mesh.position.set(baseX, -4.6 + hash(index + 9.1) * 9.2, depth);
    mesh.scale.setScalar(reducedMotion ? radius : radius * 0.12);
    scene.add(mesh);
    bubbles.push({
      mesh,
      baseX,
      radius,
      speed: 0.11 + hash(index + 3.5) * (anchor ? 0.12 : 0.24),
      phase: hash(index + 6.2) * Math.PI * 2,
    });
  }

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const render = () => {
    if (disposed) return;
    frame = requestAnimationFrame(render);
    if (!visible || document.hidden) return;

    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    const entrance = reducedMotion ? 1 : Math.min(1, elapsed / 1.25);
    const easedEntrance = 1 - Math.pow(1 - entrance, 3);

    pointer.lerp(pointerTarget, 0.045);
    camera.position.x += (pointer.x * 0.52 - camera.position.x) * 0.035;
    camera.position.y += (pointer.y * 0.34 - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);

    bubbles.forEach((bubble, index) => {
      const { mesh } = bubble;
      const depthFactor = 1 + (mesh.position.z + 2.4) * 0.035;
      mesh.position.y += bubble.speed * delta * depthFactor;
      mesh.position.x = bubble.baseX + Math.sin(elapsed * 0.42 + bubble.phase) * 0.16;
      mesh.rotation.y = elapsed * 0.1 + bubble.phase;
      mesh.rotation.x = Math.sin(elapsed * 0.18 + bubble.phase) * 0.16;
      mesh.scale.setScalar(bubble.radius * easedEntrance);
      mesh.material.uniforms.uPhase.value = bubble.phase + elapsed * (0.22 + index * 0.003);

      if (mesh.position.y - bubble.radius > 4.8) {
        mesh.position.y = -4.8 - bubble.radius;
        mesh.position.x = bubble.baseX;
      }
    });

    renderer.render(scene, camera);
  };

  const handlePointer = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerTarget.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };

  const resetPointer = () => pointerTarget.set(0, 0);
  opening.addEventListener("pointermove", handlePointer);
  opening.addEventListener("pointerleave", resetPointer);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) clock.getDelta();
  }, { threshold: 0.01 });
  visibilityObserver.observe(opening);

  resize();
  if (reducedMotion) renderer.render(scene, camera);
  else render();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    opening.removeEventListener("pointermove", handlePointer);
    opening.removeEventListener("pointerleave", resetPointer);
    bubbles.forEach(({ mesh }) => mesh.material.dispose());
    geometry.dispose();
    renderer.dispose();
  };
};
