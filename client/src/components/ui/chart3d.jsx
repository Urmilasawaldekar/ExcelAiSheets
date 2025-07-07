import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Chart3D = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !xAxis || !yAxis) return;

    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // Create bars for bar chart in 3D
    const maxVal = Math.max(...data.map(item => item[yAxis]));
    const barWidth = 1;
    const gap = 0.5;

    data.forEach((item, index) => {
      const heightVal = (item[yAxis] / maxVal) * 20;
      const geometry = new THREE.BoxGeometry(barWidth, heightVal, barWidth);
      const material = new THREE.MeshLambertMaterial({ color: 0x007bff });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = index * (barWidth + gap);
      bar.position.y = heightVal / 2;
      scene.add(bar);
    });

    // Controls (optional): Could add orbit controls for interaction

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, [data, xAxis, yAxis]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '400px', userSelect: 'text' }}
    />
  );
};

export default Chart3D;
