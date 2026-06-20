"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ThreeSceneProps {
  imageUrl: string;
  color?: string;
}

/**
 * Three.js scene rendered imperatively (no JSX types needed).
 * Shows a rounded-box product with image texture, auto-rotation, orbit controls.
 */
export default function ThreeScene({ imageUrl, color }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mesh: THREE.Mesh;
    frameId: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 8;
    controls.rotateSpeed = 0.8;
    controls.target.set(0, 0, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dir1 = new THREE.DirectionalLight(0xffffff, 1);
    dir1.position.set(5, 5, 5);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dir2.position.set(-3, 3, -3);
    scene.add(dir2);

    const point = new THREE.PointLight(0xffffff, 0.3);
    point.position.set(0, -3, 0);
    scene.add(point);

    // Environment map (simple fallback)
    const envTexture = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, "#334");
      grad.addColorStop(1, "#111");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      const tex = new THREE.CanvasTexture(canvas);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      return tex;
    })();
    scene.environment = envTexture;

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;

    // Product geometry — RoundedBox shape using Three.js primitives
    const geometry = new THREE.BoxGeometry(2.2, 3.6, 0.3);
    // Round the edges by beveling (simplified: use a slightly larger box with rounded edges)
    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.3,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Frame (slightly larger, transparent)
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: color || "#1a1a1a",
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.26, 3.66, 0.36),
      frameMat
    );
    scene.add(frame);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      mesh,
      frameId: 0,
    };

    // Animation loop
    let running = true;
    const animate = () => {
      if (!running) return;
      mesh.rotation.y += 0.005;
      frame.rotation.y = mesh.rotation.y;
      controls.update();
      renderer.render(scene, camera);
      sceneRef.current!.frameId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(sceneRef.current?.frameId ?? 0);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      frameMat.dispose();
      texture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [imageUrl, color]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: 300 }}
    />
  );
}
