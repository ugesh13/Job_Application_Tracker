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
  { id: 'skills', name: 'Skills', category: 'DNA', tooltip: 'Your current technical & transferable capability vectors', angle: 0, radius: 3.5, speed: 0.16, orbitIndex: 0, heightOffset: 0.2 },
  { id: 'projects', name: 'Projects', category: 'Proof', tooltip: 'Verifiable proof of production engineering & system delivery', angle: 1.2, radius: 3.6, speed: 0.14, orbitIndex: 0, heightOffset: -0.3 },
  { id: 'experience', name: 'Experience', category: 'Depth', tooltip: 'Track record of technical maturity and feature ownership', angle: 2.5, radius: 3.5, speed: 0.15, orbitIndex: 0, heightOffset: 0.4 },
  { id: 'opportunities', name: 'Opportunities', category: 'Market', tooltip: 'High-alignment market roles actively seeking your evidence', angle: 0.8, radius: 4.4, speed: 0.11, orbitIndex: 1, heightOffset: 0.5 },
  { id: 'goals', name: 'Goals', category: 'Direction', tooltip: 'Target engineering trajectories and career milestones', angle: 2.2, radius: 4.5, speed: 0.10, orbitIndex: 1, heightOffset: -0.4 },
  { id: 'applications', name: 'Applications', category: 'Pipeline', tooltip: 'Live applications, interview stages, and recruiter feedback', angle: 3.8, radius: 4.4, speed: 0.12, orbitIndex: 1, heightOffset: 0.1 },
  { id: 'growth', name: 'Growth', category: 'Delta', tooltip: 'Simulated capability deltas unlocked by targeted upskilling', angle: 1.8, radius: 5.2, speed: 0.08, orbitIndex: 2, heightOffset: -0.5 },
  { id: 'insights', name: 'Insights', category: 'Co-Pilot', tooltip: 'Grounded algorithmic intelligence on what you should do next', angle: 4.5, radius: 5.1, speed: 0.09, orbitIndex: 2, heightOffset: 0.6 },
];

export default function CareerObject3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHoverNode, setActiveHoverNode] = useState<OrbitNodeData | null>(null);
  const [screenPositions, setScreenPositions] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});
  const [heroLabelOpacity, setHeroLabelOpacity] = useState(1);
  const activeHoverRef = useRef<OrbitNodeData | null>(null);

  useEffect(() => {
    activeHoverRef.current = activeHoverNode;
  }, [activeHoverNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.04);

    const getViewportWidth = () => window.innerWidth;
    const getViewportHeight = () => window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
      42,
      getViewportWidth() / getViewportHeight(),
      0.1,
      100
    );
    // Camera positioned with deeper field of view so the 3D crystal forms a graceful backdrop
    camera.position.set(0, 0.2, 8.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(getViewportWidth(), getViewportHeight());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0d2137, 2.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 2.2);
    fillLight.position.set(-6, -3, -3);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight(0x22d3ee, 4.5, 14);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // --- Ambient Starfield / Constellation Dust ---
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 32;
      starPositions[i + 1] = (Math.random() - 0.5) * 32;
      starPositions[i + 2] = (Math.random() - 0.5) * 24 - 4;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- Center 3D Career Crystal / Hyper-Object ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Core Polyhedron (Translucent Glass body)
    const glassGeo = new THREE.IcosahedronGeometry(1.35, 0);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x081e35,
      emissive: 0x072844,
      emissiveIntensity: 0.38,
      roughness: 0.12,
      metalness: 0.28,
      transmission: 0.88,
      transparent: true,
      opacity: 0.85,
      ior: 1.5,
      thickness: 1.3,
      reflectivity: 0.95,
      wireframe: false,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    rootGroup.add(glassMesh);

    // 2. Metallic Beveled Edges
    const edgesGeo = new THREE.EdgesGeometry(glassGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
      linewidth: 1.5,
    });
    const wireMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    rootGroup.add(wireMesh);

    // 3. Inner Pulsing Energy Core
    const innerGeo = new THREE.OctahedronGeometry(0.68, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.0,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerCore);

    // 4. Floating Concentric Orbit Rings
    const orbitRingGroup = new THREE.Group();
    rootGroup.add(orbitRingGroup);

    const orbitRadii = [2.8, 3.5, 4.2];
    const ringTilts = [
      { x: 0.35, y: 0.2, z: -0.15 },
      { x: -0.25, y: 0.4, z: 0.3 },
      { x: 0.15, y: -0.35, z: 0.2 },
    ];

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
        opacity: 0.4 - i * 0.08,
      });

      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = ringTilts[i].x;
      ring.rotation.y = ringTilts[i].y;
      ring.rotation.z = ringTilts[i].z;
      orbitRingGroup.add(ring);
    });

    // 5. 3D Glowing Orbit Beacons
    const nodeGroup = new THREE.Group();
    rootGroup.add(nodeGroup);

    const beaconGeo = new THREE.SphereGeometry(0.07, 16, 16);
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

    // --- Scroll Responsiveness Interpolation ---
    const targetScrollTransform = { x: 0, y: 0, z: 0, rotY: 0, scale: 1.0 };
    const currentScrollTransform = { x: 0, y: 0, z: 0, rotY: 0, scale: 1.0 };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetRotation.y = x * 0.5;
      targetRotation.x = -y * 0.4;

      targetCameraOffset.x = x * 0.45;
      targetCameraOffset.y = 0.6 + y * 0.3;
    };

    const handleMouseLeave = () => {
      targetRotation.x = 0;
      targetRotation.y = 0;
      targetCameraOffset.x = 0;
      targetCameraOffset.y = 0.6;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      // Fade hero labels as user scrolls down past the hero section
      const heroThreshold = Math.min(window.innerHeight * 0.65, 600);
      const labelAlpha = Math.max(0, 1 - (scrollY / heroThreshold));
      setHeroLabelOpacity(labelAlpha);

      // Responsive cinematic path across all sections:
      // Section 1 (Hero): Centered
      // Section 2 (Intro): Drifts subtly to the right
      // Section 3 (Pillars): Recedes into depth
      // Section 4 (Twin): Shifts to the left background
      // Section 5 (Time Machine): Rotates forward
      // Section 6+: Floats gently in cosmic background
      const angle = progress * Math.PI * 3;
      targetScrollTransform.x = Math.sin(angle) * 1.65;
      targetScrollTransform.y = -progress * 2.2 + Math.cos(angle * 0.7) * 0.45;
      targetScrollTransform.z = -progress * 2.8;
      targetScrollTransform.rotY = progress * Math.PI * 4;
      targetScrollTransform.scale = 1.0 - progress * 0.22;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial scroll setup
    handleScroll();

    // --- Resize Handler ---
    const handleResize = () => {
      const width = getViewportWidth();
      const height = getViewportHeight();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth damping / physics lerp
      const lerpFactor = 0.045;
      currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
      currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;

      currentCameraOffset.x += (targetCameraOffset.x - currentCameraOffset.x) * lerpFactor;
      currentCameraOffset.y += (targetCameraOffset.y - currentCameraOffset.y) * lerpFactor;

      // Scroll lerp
      const scrollLerp = 0.055;
      currentScrollTransform.x += (targetScrollTransform.x - currentScrollTransform.x) * scrollLerp;
      currentScrollTransform.y += (targetScrollTransform.y - currentScrollTransform.y) * scrollLerp;
      currentScrollTransform.z += (targetScrollTransform.z - currentScrollTransform.z) * scrollLerp;
      currentScrollTransform.rotY += (targetScrollTransform.rotY - currentScrollTransform.rotY) * scrollLerp;
      currentScrollTransform.scale += (targetScrollTransform.scale - currentScrollTransform.scale) * scrollLerp;

      camera.position.x = currentCameraOffset.x;
      camera.position.y = currentCameraOffset.y;
      camera.lookAt(0, 0, 0);

      // Starfield gentle cosmic drift
      starField.rotation.y = elapsedTime * 0.015;
      starField.rotation.x = elapsedTime * 0.008;

      // Celestial spin + scroll transformation + cursor reaction
      // Positioned at y = -0.35 in hero so it sits gracefully behind and below the headlines without obscuring letters
      rootGroup.position.x = currentScrollTransform.x;
      rootGroup.position.y = currentScrollTransform.y - 0.35 + Math.sin(elapsedTime * 0.9) * 0.08;
      rootGroup.position.z = currentScrollTransform.z;
      rootGroup.scale.setScalar(currentScrollTransform.scale);

      rootGroup.rotation.y = currentRotation.y + currentScrollTransform.rotY + elapsedTime * 0.08;
      rootGroup.rotation.x = currentRotation.x + Math.sin(elapsedTime * 0.5) * 0.04;

      // Inner core pulse
      const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.15;
      innerCore.scale.set(pulse, pulse, pulse);
      innerCore.rotation.x = -elapsedTime * 0.3;
      innerCore.rotation.y = elapsedTime * 0.45;

      // React to node hover
      if (activeHoverRef.current) {
        glassMat.emissiveIntensity = 0.75;
        coreLight.intensity = 6.0;
      } else {
        glassMat.emissiveIntensity = 0.38 + Math.sin(elapsedTime * 1.5) * 0.1;
        coreLight.intensity = 3.8 + Math.sin(elapsedTime * 2) * 0.8;
      }

      // Update orbital nodes position and project to screen coordinates
      const positions: Record<string, { x: number; y: number; visible: boolean }> = {};
      const winW = window.innerWidth;
      const winH = window.innerHeight;

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

        // Project 3D vector to screen coordinates
        mesh.getWorldPosition(tempVec);
        tempVec.project(camera);

        const screenX = ((tempVec.x + 1) / 2) * winW;
        const screenY = ((-tempVec.y + 1) / 2) * winH;
        const inFrontOfCamera = tempVec.z < 1.0;

        positions[node.id] = {
          x: screenX,
          y: screenY,
          visible: inFrontOfCamera && screenX >= 0 && screenX <= winW && screenY >= 0 && screenY <= winH,
        };
      });

      setScreenPositions(positions);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      glassGeo.dispose();
      glassMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      beaconGeo.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* 
        Fixed Full-Viewport 3D Canvas
        Strictly positioned in background (-z-10), behind all content, letters, and cards across all sections
      */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen h-screen">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
        />

        {/* Cinematic Atmospheric Ambient Radiance */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.1),transparent_70%)]" />
        <div className="pointer-events-none absolute top-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-cyan-500/08 blur-[160px]" />
        <div className="pointer-events-none absolute top-2/3 -right-32 h-[600px] w-[600px] rounded-full bg-blue-600/08 blur-[180px]" />
      </div>

      {/* Interactive 2D Screen Space Orbit Labels (Strictly placed at z-0, behind hero text and all page content) */}
      {heroLabelOpacity > 0.05 && (
        <div
          style={{ opacity: heroLabelOpacity }}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden w-screen h-screen transition-opacity duration-200"
        >
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
                        ? 'bg-cyan-500/30 text-white border border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110'
                        : 'bg-[#081220]/80 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:text-cyan-200'
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
      )}
    </>
  );
}
