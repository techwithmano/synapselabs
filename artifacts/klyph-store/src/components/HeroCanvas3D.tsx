'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 400;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // Camera: FOV 45, positioned at [0, 0, 7]
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // Renderer: Transparent background, antialiasing enabled, pixel ratio capped at Math.min(devicePixelRatio, 2)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Pure transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // 2. Procedural Ring Architecture
    const ringGroup = new THREE.Group();

    // Outer Shell: TorusGeometry(2.1, 0.42, 64, 128)
    const outerGeometry = new THREE.TorusGeometry(2.1, 0.42, 64, 128);
    const outerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xF6F5F0,
      roughness: 0.28,
      metalness: 0.04,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    });
    const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
    ringGroup.add(outerMesh);

    // Inner Sensor Core: CylinderGeometry(1.68, 1.68, 0.72, 64, 1, true)
    const innerGeometry = new THREE.CylinderGeometry(1.68, 1.68, 0.72, 64, 1, true);
    // Align cylinder axis with torus inner aperture (Z-axis)
    innerGeometry.rotateX(Math.PI / 2);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.88,
      roughness: 0.32,
      side: THREE.DoubleSide,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    ringGroup.add(innerMesh);

    // Hairline Cobalt Optical Slit: TorusGeometry(2.105, 0.035, 32, 128)
    const slitGeometry = new THREE.TorusGeometry(2.105, 0.035, 32, 128);
    const slitMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563EB,
    });
    const slitMesh = new THREE.Mesh(slitGeometry, slitMaterial);
    ringGroup.add(slitMesh);

    // Initial architectural tilt
    ringGroup.rotation.x = 0.4;
    ringGroup.rotation.z = 0.15;
    scene.add(ringGroup);

    // 3. Lighting Rig
    // Soft ambient light: #FFFFFF, intensity 1.4
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.4);
    scene.add(ambientLight);

    // Key directional light top-left: #FFFFFF, intensity 2.2 at [-4, 6, 5]
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    keyLight.position.set(-4, 6, 5);
    scene.add(keyLight);

    // Subtle cobalt rim light back-right: #2563EB, intensity 1.8 at [5, -2, -4]
    const rimLight = new THREE.DirectionalLight(0x2563EB, 1.8);
    rimLight.position.set(5, -2, -4);
    scene.add(rimLight);

    // 4. Mouse Tracking & Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;
      // Normalized coordinates (-1 to 1)
      const nx = (event.clientX / innerWidth) * 2 - 1;
      const ny = -(event.clientY / innerHeight) * 2 + 1;
      targetMouseX = nx * 0.45;
      targetMouseY = ny * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle container / window resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 5. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth continuous idle rotation: group.rotation.y += 0.004
      currentRotationY += 0.004;

      // Smooth lerp toward mouse target (factor 0.05)
      const desiredX = 0.4 - targetMouseY;
      const desiredY = currentRotationY + targetMouseX;

      ringGroup.rotation.x += (desiredX - ringGroup.rotation.x) * 0.05;
      ringGroup.rotation.y += (desiredY - ringGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Clean Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      // Dispose geometries
      outerGeometry.dispose();
      innerGeometry.dispose();
      slitGeometry.dispose();

      // Dispose materials
      outerMaterial.dispose();
      innerMaterial.dispose();
      slitMaterial.dispose();

      // Dispose renderer
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-canvas-3d"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
      }}
      aria-label="Interactive 3D model of Synapse Core Ring"
    />
  );
}
