import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';

interface OrbitNodeData {
  id: string;
  name: string;
  category: string;
  tooltip: string;
  angle: number;
  radius: number;
  speed: number;
  orbitIndex: number;
  heightOffset: number;
}

const ORBIT_NODES: OrbitNodeData[] = [
  { id: 'skills', name: 'Skills', category: 'DNA', tooltip: 'Your current technical & transferable capability vectors', angle: 0, radius: 2.7, speed: 0.18, orbitIndex: 0, heightOffset: 0.2 },
  { id: 'projects', name: 'Projects', category: 'Proof', tooltip: 'Verifiable proof of production engineering & system delivery', angle: 1.2, radius: 2.8, speed: 0.16, orbitIndex: 0, heightOffset: -0.3 },
  { id: 'experience', name: 'Experience', category: 'Depth', tooltip: 'Track record of technical maturity and feature ownership', angle: 2.5, radius: 2.7, speed: 0.17, orbitIndex: 0, heightOffset: 0.4 },
  { id: 'opportunities', name: 'Opportunities', category: 'Market', tooltip: 'High-alignment market roles actively seeking your evidence', angle: 0.8, radius: 3.4, speed: 0.12, orbitIndex: 1, heightOffset: 0.5 },
  { id: 'goals', name: 'Goals', category: 'Direction', tooltip: 'Target engineering trajectories and career milestones', angle: 2.2, radius: 3.5, speed: 0.11, orbitIndex: 1, heightOffset: -0.4 },
  { id: 'applications', name: 'Applications', category: 'Pipeline', tooltip: 'Live applications, interview stages, and recruiter feedback', angle: 3.8, radius: 3.4, speed: 0.13, orbitIndex: 1, heightOffset: 0.1 },
  { id: 'growth', name: 'Growth', category: 'Delta', tooltip: 'Simulated capability deltas unlocked by targeted upskilling', angle: 1.8, radius: 4.1, speed: 0.09, orbitIndex: 2, heightOffset: -0.5 },
  { id: 'insights', name: 'Insights', category: 'Co-Pilot', tooltip: 'Grounded algorithmic intelligence on what you should do next', angle: 4.5, radius: 4.0, speed: 0.10, orbitIndex: 2, heightOffset: 0.6 },
];

export default function CareerObject3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHoverNode, setActiveHoverNode] = useState<OrbitNodeData | null>(null);
  const [screenPositions, setScreenPositions] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});
  const activeHoverRef = useRef<OrbitNodeData | null>(null);

  useEffect(() => {
    activeHoverRef.current = activeHoverNode;
  }, [activeHoverNode]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let isVisible = true;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.08);

    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.8, 7.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0d2137, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight(0x22d3ee, 4.0, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // --- Center 3D Career Crystal / Hyper-Object ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Core Polyhedron (Translucent Glass body)
    const glassGeo = new THREE.IcosahedronGeometry(1.28, 0);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x081e35,
      emissive: 0x072844,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.25,
      transmission: 0.85,
      transparent: true,
      opacity: 0.82,
      ior: 1.5,
      thickness: 1.2,
      reflectivity: 0.9,
      wireframe: false,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    rootGroup.add(glassMesh);

    // 2. Metallic Beveled Edges
    const edgesGeo = new THREE.EdgesGeometry(glassGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      linewidth: 1.5,
    });
    const wireMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    rootGroup.add(wireMesh);

    // 3. Inner Pulsing Energy Core
    const innerGeo = new THREE.OctahedronGeometry(0.65, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerCore);

    // 4. Floating Concentric Orbit Rings
    const orbitRingGroup = new THREE.Group();
    rootGroup.add(orbitRingGroup);

    const orbitRadii = [2.7, 3.4, 4.0];
    const ringTilts = [
      { x: 0.35, y: 0.2, z: -0.15 },
      { x: -0.25, y: 0.4, z: 0.3 },
      { x: 0.15, y: -0.35, z: 0.2 },
    ];

    const ringMeshes: THREE.Line[] = [];
    orbitRadii.forEach((radius, i) => {
      const ringGeo = new THREE.BufferGeometry();
      const segments = 128;
      const points: THREE.Vector3[] = [];
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);

      const ringMat = new THREE.LineBasicMaterial({
        color: i === 0 ? 0x0e7490 : i === 1 ? 0x0369a1 : 0x1e3a8a,
        transparent: true,
        opacity: 0.35 - i * 0.08,
      });

      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = ringTilts[i].x;
      ring.rotation.y = ringTilts[i].y;
      ring.rotation.z = ringTilts[i].z;
      orbitRingGroup.add(ring);
      ringMeshes.push(ring);
    });

    // 5. 3D Glowing Orbit Beacons
    const nodeGroup = new THREE.Group();
    rootGroup.add(nodeGroup);

    const beaconGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const beaconMeshes = ORBIT_NODES.map((node) => {
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
      });
      const mesh = new THREE.Mesh(beaconGeo, beaconMat);
      nodeGroup.add(mesh);
      return { node, mesh };
    });

    // --- Cursor & Physics Interpolation (Damping) ---
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };
    const targetCameraOffset = { x: 0, y: 0 };
    const currentCameraOffset = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Smooth subtle tilt
      targetRotation.y = x * 0.45;
      targetRotation.x = -y * 0.35;

      // Parallax camera offset
      targetCameraOffset.x = x * 0.35;
      targetCameraOffset.y = 0.8 + y * 0.25;
    };

    const handleMouseLeave = () => {
      targetRotation.x = 0;
      targetRotation.y = 0;
      targetCameraOffset.x = 0;
      targetCameraOffset.y = 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- Intersection Observer (Pause when off-screen) ---
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // --- Animation Loop ---
    let clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth damping / physical inertia (lerp)
      const lerpFactor = 0.045;
      currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
      currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;

      currentCameraOffset.x += (targetCameraOffset.x - currentCameraOffset.x) * lerpFactor;
      currentCameraOffset.y += (targetCameraOffset.y - currentCameraOffset.y) * lerpFactor;

      camera.position.x = currentCameraOffset.x;
      camera.position.y = currentCameraOffset.y;
      camera.lookAt(0, 0, 0);

      // Idle celestial spin + cursor reaction
      rootGroup.rotation.y = currentRotation.y + elapsedTime * 0.08;
      rootGroup.rotation.x = currentRotation.x + Math.sin(elapsedTime * 0.5) * 0.04;
      rootGroup.position.y = Math.sin(elapsedTime * 0.9) * 0.09; // Breathing float

      // Inner core pulse
      const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.15;
      innerCore.scale.set(pulse, pulse, pulse);
      innerCore.rotation.x = -elapsedTime * 0.3;
      innerCore.rotation.y = elapsedTime * 0.45;

      // React to node hover
      if (activeHoverRef.current) {
        glassMat.emissiveIntensity = 0.7;
        coreLight.intensity = 5.5;
      } else {
        glassMat.emissiveIntensity = 0.35 + Math.sin(elapsedTime * 1.5) * 0.1;
        coreLight.intensity = 3.5 + Math.sin(elapsedTime * 2) * 0.8;
      }

      // Update orbital nodes position and project to 2D screen coordinates
      const positions: Record<string, { x: number; y: number; visible: boolean }> = {};
      const rect = container.getBoundingClientRect();

      beaconMeshes.forEach(({ node, mesh }, index) => {
        const currentAngle = node.angle + elapsedTime * node.speed;
        const tilt = ringTilts[node.orbitIndex];

        // Position in ring plane
        const localX = Math.cos(currentAngle) * node.radius;
        const localZ = Math.sin(currentAngle) * node.radius;
        const localY = node.heightOffset + Math.sin(currentAngle * 2 + index) * 0.15;

        // Apply tilt rotation
        const euler = new THREE.Euler(tilt.x, tilt.y, tilt.z, 'XYZ');
        tempVec.set(localX, localY, localZ).applyEuler(euler);

        mesh.position.copy(tempVec);

        // Hover scale highlight
        const isHovered = activeHoverRef.current?.id === node.id;
        mesh.scale.setScalar(isHovered ? 2.4 : 1.0);
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(isHovered ? 0xffffff : 0x38bdf8);

        // Project 3D vector into 2D screen coordinates for DOM labels
        tempVec.project(camera);
        const screenX = ((tempVec.x + 1) / 2) * rect.width;
        const screenY = ((-tempVec.y + 1) / 2) * rect.height;
        const inFrontOfCamera = tempVec.z < 1.0;

        positions[node.id] = {
          x: screenX,
          y: screenY,
          visible: inFrontOfCamera && screenX >= 0 && screenX <= rect.width && screenY >= 0 && screenY <= rect.height,
        };
      });

      setScreenPositions(positions);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      // Dispose Three.js resources
      glassGeo.dispose();
      glassMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      beaconGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[520px] sm:h-[620px] lg:h-[720px] w-full items-center justify-center overflow-hidden"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Atmospheric Radial Ambient Lights */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.12),transparent_65%)]" />
      <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Interactive 2D Screen Space Node Labels with Contextual Tooltips */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {ORBIT_NODES.map((node) => {
          const pos = screenPositions[node.id];
          if (!pos || !pos.visible) return null;

          const isHovered = activeHoverNode?.id === node.id;

          return (
            <div
              key={node.id}
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0px) translate(-50%, -50%)`,
              }}
              className="pointer-events-auto absolute transition-transform duration-75"
            >
              <div
                onMouseEnter={() => setActiveHoverNode(node)}
                onMouseLeave={() => setActiveHoverNode(null)}
                className="group relative cursor-pointer"
              >
                {/* Node Pill */}
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-md transition-all duration-200 ${
                    isHovered
                      ? 'bg-cyan-500/25 text-white border border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110'
                      : 'bg-[#081220]/75 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:text-cyan-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isHovered ? 'bg-white shadow-[0_0_8px_#ffffff]' : 'bg-cyan-400'
                    }`}
                  />
                  <span>{node.name}</span>
                </div>

                {/* Hover Contextual Tooltip */}
                {isHovered && (
                  <div className="absolute left-1/2 bottom-full mb-2.5 w-52 -translate-x-1/2 rounded-xl bg-[#06101e]/95 p-3 text-left shadow-[0_12px_35px_rgba(0,0,0,0.8)] border border-cyan-500/30 backdrop-blur-xl transition-all duration-200 z-30 pointer-events-none">
                    <div className="flex items-center justify-between text-[10px] font-mono-ui uppercase tracking-wider text-cyan-400">
                      <span>{node.category} Vector</span>
                      <Sparkles size={11} />
                    </div>
                    <div className="mt-1 font-bold text-[13px] text-slate-100">{node.name}</div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{node.tooltip}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Bottom Ambient Pill Indicator */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#07111e]/60 px-4 py-1.5 text-[11px] text-slate-400 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>Interactive 3D Career Object · Move cursor to orbit</span>
      </div>
    </div>
  );
}
