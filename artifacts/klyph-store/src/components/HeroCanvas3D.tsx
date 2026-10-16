'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function HeroCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference or missing WebGL
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
      );
    } catch {}

    if (prefersReducedMotion || !hasWebGL) {
      setUseFallback(true);
      return;
    }

    let width = container.clientWidth || 540;
    let height = container.clientHeight || 420;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.4);

    // 2. High-Fidelity WebGL Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // 3. Realistic Studio Lighting Environment (PMREMGenerator + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    // 4. Studio Directional & Rim Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-4.5, 6.0, 5.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.6);
    fillLight.position.set(4.5, 3.2, 4.0);
    scene.add(fillLight);

    const cobaltRimLight = new THREE.DirectionalLight(0x2563eb, 3.2);
    cobaltRimLight.position.set(5.0, -2.5, -4.0);
    scene.add(cobaltRimLight);

    const topSoftLight = new THREE.DirectionalLight(0xffffff, 1.8);
    topSoftLight.position.set(0, 8, 1);
    scene.add(topSoftLight);

    // 5. Procedural Soft Contact Shadow under Ring
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
      gradient.addColorStop(0.35, 'rgba(15, 23, 42, 0.12)');
      gradient.addColorStop(0.7, 'rgba(15, 23, 42, 0.03)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.55;
    scene.add(shadowMesh);

    // 6. Master Ring Assembly (CAD Lathe Geometry Architecture)
    const ringMasterGroup = new THREE.Group();

    // Dimensions: outer radius 2.22, inner radius 1.96, height 0.92
    const rOuter = 2.22;
    const rInner = 1.96;
    const halfH = 0.46;

    // --- A. Outer Monolithic Zirconia Ceramic Shell ---
    // Ergonomic cambered crown with distinct 45-degree chamfered shoulders
    const ceramicPoints: THREE.Vector2[] = [
      new THREE.Vector2(2.08, -halfH),
      new THREE.Vector2(rOuter - 0.055, -halfH),
      new THREE.Vector2(rOuter, -halfH + 0.06), // bottom chamfer
      new THREE.Vector2(rOuter + 0.035, -0.22),
      new THREE.Vector2(rOuter + 0.048, 0.0), // subtle convex crown apex
      new THREE.Vector2(rOuter + 0.035, 0.22),
      new THREE.Vector2(rOuter, halfH - 0.06), // top chamfer
      new THREE.Vector2(rOuter - 0.055, halfH),
      new THREE.Vector2(2.08, halfH),
    ];

    const ceramicGeo = new THREE.LatheGeometry(ceramicPoints, 128);
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xf7f7f5, // warm high-key porcelain ceramic
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.92,
      ior: 1.54,
    });
    const ceramicMesh = new THREE.Mesh(ceramicGeo, ceramicMat);
    ringMasterGroup.add(ceramicMesh);

    // --- B. Inner Grade 5 Brushed Titanium Core & Chamfered Rims ---
    const titaniumPoints: THREE.Vector2[] = [
      new THREE.Vector2(2.09, -halfH),
      new THREE.Vector2(rInner + 0.04, -halfH),
      new THREE.Vector2(rInner, -halfH + 0.045), // inner bevel
      new THREE.Vector2(rInner - 0.015, 0.0),   // inner finger contour
      new THREE.Vector2(rInner, halfH - 0.045),
      new THREE.Vector2(rInner + 0.04, halfH),
      new THREE.Vector2(2.09, halfH),
    ];

    const titaniumGeo = new THREE.LatheGeometry(titaniumPoints, 128);
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // satin aerospace titanium
      metalness: 0.95,
      roughness: 0.22,
    });
    const titaniumMesh = new THREE.Mesh(titaniumGeo, titaniumMat);
    ringMasterGroup.add(titaniumMesh);

    // --- C. Hairline Cobalt Optical Slit ---
    // Equatorial groove pulsing around the outer ceramic crown
    const slitPoints: THREE.Vector2[] = [
      new THREE.Vector2(rOuter + 0.047, -0.016),
      new THREE.Vector2(rOuter + 0.052, -0.016),
      new THREE.Vector2(rOuter + 0.052, 0.016),
      new THREE.Vector2(rOuter + 0.047, 0.016),
    ];
    const slitGeo = new THREE.LatheGeometry(slitPoints, 128);
    const slitMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.3,
    });
    const slitMesh = new THREE.Mesh(slitGeo, slitMat);
    ringMasterGroup.add(slitMesh);

    // --- D. Biometric PPG Optical Sensor Cluster (Inner Finger Telemetry) ---
    // 3 medical-grade optical sensor nodes protruding gently into the inner rim
    const sensorBaseGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.04, 32);
    sensorBaseGeo.rotateZ(Math.PI / 2);
    const sensorBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.6,
      roughness: 0.3,
    });

    const sensorDomeGeo = new THREE.SphereGeometry(0.065, 24, 16);
    const sensorDomeMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.55,
      clearcoat: 1.0,
    });

    const ledCoreGeo = new THREE.SphereGeometry(0.024, 16, 12);
    const greenLedMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const cobaltLedMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    const sensorAngles = [-0.32, 0, 0.32]; // 3 distinct sensor nodes
    sensorAngles.forEach((angle, idx) => {
      const sensorNode = new THREE.Group();
      sensorNode.rotation.y = angle;

      // Base ring mount
      const base = new THREE.Mesh(sensorBaseGeo, sensorBaseMat);
      base.position.set(rInner + 0.01, 0, 0);
      sensorNode.add(base);

      // Optical resin dome
      const dome = new THREE.Mesh(sensorDomeGeo, sensorDomeMat);
      dome.position.set(rInner + 0.02, 0, 0);
      dome.scale.set(0.65, 1.25, 1.25);
      sensorNode.add(dome);

      // Embedded LED emitter (central is green PPG, flanking are telemetry cobalt/IR)
      const led = new THREE.Mesh(ledCoreGeo, idx === 1 ? greenLedMat : cobaltLedMat);
      led.position.set(rInner + 0.025, 0, 0);
      sensorNode.add(led);

      ringMasterGroup.add(sensorNode);
    });

    // Initial 3/4 Isometric Perspective Angle
    ringMasterGroup.rotation.x = 0.52;
    ringMasterGroup.rotation.z = 0.22;
    scene.add(ringMasterGroup);

    // 7. Interactive Free Drag & Touch Controls (360-degree rotation)
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let targetRotationX = 0.52;
    let targetRotationY = 0.3;

    // Mouse Move Parallax
    let parallaxTargetX = 0;
    let parallaxTargetY = 0;

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      prevPointerX = event.clientX;
      prevPointerY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grabbing';
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth && innerHeight) {
        parallaxTargetX = ((event.clientX / innerWidth) * 2 - 1) * 0.25;
        parallaxTargetY = (-((event.clientY / innerHeight) * 2 - 1)) * 0.2;
      }

      if (!isDragging) return;

      const deltaX = event.clientX - prevPointerX;
      const deltaY = event.clientY - prevPointerY;
      prevPointerX = event.clientX;
      prevPointerY = event.clientY;

      velocityX = deltaX * 0.008;
      velocityY = deltaY * 0.008;

      targetRotationY += velocityX;
      targetRotationX += velocityY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    // 8. Responsive Container Resize Handler
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

    // 9. Fluid Animation Loop (60/120 FPS)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating levitation bob (sinusoidal)
      const bobOffset = Math.sin(elapsedTime * 1.5) * 0.08;
      ringMasterGroup.position.y = bobOffset;
      shadowMesh.scale.setScalar(1 - bobOffset * 0.35);

      if (!isDragging) {
        // Continuous slow idle auto-rotation
        targetRotationY += 0.0035;

        // Apply friction to momentum velocity
        velocityX *= 0.94;
        velocityY *= 0.94;
        targetRotationY += velocityX;
        targetRotationX += velocityY;
      }

      // Smooth damping toward target orientation + cursor parallax
      const currentDestX = targetRotationX + parallaxTargetY;
      const currentDestY = targetRotationY + parallaxTargetX;

      ringMasterGroup.rotation.x += (currentDestX - ringMasterGroup.rotation.x) * 0.08;
      ringMasterGroup.rotation.y += (currentDestY - ringMasterGroup.rotation.y) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean Lifecycle Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      // Geometries
      ceramicGeo.dispose();
      titaniumGeo.dispose();
      slitGeo.dispose();
      sensorBaseGeo.dispose();
      sensorDomeGeo.dispose();
      ledCoreGeo.dispose();
      shadowGeo.dispose();

      // Materials & Textures
      ceramicMat.dispose();
      titaniumMat.dispose();
      slitMat.dispose();
      sensorBaseMat.dispose();
      sensorDomeMat.dispose();
      greenLedMat.dispose();
      cobaltLedMat.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();

      // Environment & Renderer
      envTexture.dispose();
      pmremGenerator.dispose();
      roomEnv.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (useFallback) {
    return (
      <div
        className="hero-canvas-3d hero-canvas-fallback"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Synapse Core Ring — flagship sintered ceramic biometric ring"
      >
        <img
          src="/images/synapse/synapse-core-ring.webp"
          alt="Synapse Core Ring"
          style={{
            maxWidth: '85%',
            maxHeight: '85%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 30px rgba(15, 23, 42, 0.12))',
          }}
        />
      </div>
    );
  }

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
        touchAction: 'pan-y',
      }}
      aria-label="Interactive 3D model of Synapse Core Ring — drag to rotate in 360 degrees"
    />
  );
}

