// import React, { useRef, useEffect, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import RibbonCutting from './Components/RibbonCutting';

// const PanoViewer = ({ image, hotspots }) => {
//   const mountRef = useRef(null);
//   const [tooltip, setTooltip] = useState(null);
//   const [hoveredHotspot, setHoveredHotspot] = useState(null); 
//   const [activeComponent, setActiveComponent] = useState(null);
  
  
//   useEffect(() => {
//     setActiveComponent(null); // Set initial state only once
//   }, []);
  
  
//   useEffect(() => {
//     let scene, camera, renderer, controls, mesh;
//     let currentMount = mountRef.current;
//     if (!currentMount) return;
//     // Initialize scene, camera, and renderer
//     scene = new THREE.Scene();
//     camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0, 0, 0.1); 
//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     currentMount.appendChild(renderer.domElement);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();  
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     // Create panorama sphere
//     const geometry = new THREE.SphereGeometry(500, 60, 40);
//     geometry.scale(-1, 1, 1); // Invert for inside view
//     const texture = new THREE.TextureLoader().load(image);
//     const material = new THREE.MeshBasicMaterial({ map: texture });
//     mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);
//     // Add OrbitControls for navigation
//     controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableZoom = true; // Disable zooming for a true panorama feel
//     controls.enablePan = true;
//     controls.rotateSpeed = 0.3; // Adjust rotation speed as needed
//     controls.minPolarAngle = Math.PI / 2;
//     controls.maxPolarAngle = Math.PI / 2;
//     controls.update();
//     // Create a group to hold all hotspots for easier raycasting
//     const hotspotGroup = new THREE.Group();
//     scene.add(hotspotGroup);
//     // Add hotspots to the group
//     hotspots.forEach((hotspot) => {
//       const hotspotGeometry = new THREE.SphereGeometry(10, 16, 8); // Smaller sphere for hotspot
//       const hotspotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 }); // Red, semi-transparent
//       const hotspotMesh = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
//       // Convert spherical coordinates to Cartesian for positioning
//       const phi = THREE.MathUtils.degToRad(90 - hotspot.latitude);
//       const theta = THREE.MathUtils.degToRad(hotspot.longitude);
//       const radius = 500; // You could scale this based on the window siz
//       hotspotMesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
//       hotspotMesh.position.y = radius * Math.cos(phi);
//       hotspotMesh.position.z = radius * Math.sin(phi) * Math.sin(theta);
//       hotspotMesh.userData = hotspot; // Store hotspot data
//       hotspotGroup.add(hotspotMesh);
//     });
//     // Raycasting for hotspot interactions
//     const raycaster = new THREE.Raycaster();
//     const mouse = new THREE.Vector2();
//     const onMouseMove = (event) => {
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(hotspotGroup.children);
//       if (intersects.length > 0) {
//         setHoveredHotspot(intersects[0].object.userData);
//         document.body.style.cursor = 'pointer';
//         // const intersectedObject = intersects[0].object;
//         const intersectedPoint = intersects[0].point;
    
//         // Convert the world position of the hotspot to screen coordinates
//         const vector = new THREE.Vector3();
//         vector.copy(intersectedPoint);
//         vector.project(camera); // Project the point from world space to screen space
    
//         // Map the projected coordinates to the screen dimensions
//         const x = (vector.x + 1) / 2 * window.innerWidth;
//         const y = -(vector.y - 1) / 2 * window.innerHeight;
    
//         // Add an offset of 10px to the tooltip position
//         const offsetX = 10;
//         const offsetY = 10;
//         console.log('coord', x, y);
//         // Update the tooltip position dynamically when hovering over the hotspot
//         setHoveredHotspot((prevHoveredHotspot) => ({
//           ...prevHoveredHotspot,
//           position: {
//             x: x + offsetX,
//             y: y + offsetY,
            
//           }
//         }));
        
//       } else {
//         setHoveredHotspot(null);
//         // setTooltip(null); // Hide tooltip when not hovering over a hotspot
//         document.body.style.cursor = 'default';
//       }
//     };
    
//     const onMouseClick = (event) => {
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(hotspotGroup.children);
    
//       if (intersects.length > 0) {
//         const intersectedObject = intersects[0].object;
//         if (intersectedObject.userData) {
//           setTooltip(intersectedObject.userData);
    
//           const intersectedPoint = intersects[0].point;
//           console.log('Clicked at world coordinates:', intersectedPoint);
          
//           // Convert the world position of the hotspot to screen coordinates
//           const vector = new THREE.Vector3();
//           vector.copy(intersectedPoint);
//           vector.project(camera); // Project the point from world space to screen space
    
//           console.log('dssd',intersectedPoint);
//           // Map the projected coordinates to the screen dimensions
//           const x = (vector.x + 1) / 2 * window.innerWidth;
//           const y = -(vector.y - 1) / 2 * window.innerHeight;
    
//           // Add an offset of 10px to the tooltip position
//           const offsetX = 10;
//           const offsetY = 10;
    
//           // Update the tooltip position dynamically
//           setTooltip((prevTooltip) => ({
//             ...prevTooltip,
//             component: RibbonCutting,
//             position: {
//               x: x + offsetX,
//               y: y + offsetY,
//             }
//           }));

//           // Trigger additional event (example: console log)
//           console.log('Hotspot Clicked:', intersectedObject.userData.title); 
//         }
//         console.log('Tooltip data:', tooltip);
//       }
//       //  else {
//       //   setTooltip(null); // Hide tooltip if clicking outside hotspots
//       // }
//     };
  

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('click', onMouseClick);

//     // Animation loop
//     const animate = () => {
//       controls.update();
//       renderer.render(scene, camera);
//       requestAnimationFrame(animate);
//     };
//     animate();
//     // Handle resizing
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener('resize', handleResize);
//     // Cleanup on unmount
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       window.removeEventListener('click', onMouseClick);
//       window.removeEventListener('mousemove', onMouseMove); 
//       if (currentMount && currentMount.contains(renderer.domElement)) {
//         currentMount.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//       texture.dispose();
//       material.dispose();
//       geometry.dispose();
//     };
//   }, [image, hotspots]);

//   return (
//     <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
//       {activeComponent && (
//         <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px', pointerEvents: activeComponent ? 'none' : 'auto', }}>
//           {activeComponent}
//         </div>
//       )}
//       {tooltip && tooltip.position && (
//         <div
//           style={{
//             position: 'absolute',
//             top: `${tooltip.position.y}px`,
//             left: `${tooltip.position.x}px`,
//             // background: 'rgba(0, 0, 0, 0.7)',
//             color: 'white',
//             // padding: '10px',
//             // borderRadius: '25px',
//             zIndex: 1,
//           }}
//         >
//           {/* <h3>{tooltip.title}</h3> */}
//           {/* <p>{tooltip.description}</p> */}
//           {tooltip.component && React.createElement(tooltip.component)} 
//           {/* <div>{tooltip.component}</div> */}
//           {/* {tooltip.component && React.createElement(tooltip.component)} */}
//           {/* {tooltip.image && <img src={tooltip.image} alt={tooltip.title} style={{ maxWidth: "200px" }} />} */}
//         </div>
//       )}

      
//       {hoveredHotspot  && hoveredHotspot.position &&  (
//         <div 
//           style={{ 
//             position: 'absolute', 
//             top: `${hoveredHotspot.position.y}px`,
//             left: `${hoveredHotspot.position.x}px`,
//             pointerEvents: "none"
//           }} 
//         >
//           <div 
//             style={{ 
//               position: 'absolute', 
//               // Calculate and set position based on hotspot coordinates (requires more complex calculations) 
//               // ... 
//               backgroundColor: 'rgba(255, 255, 0, 0.5)', 
//               borderRadius: '5px', 
//               padding: '5px' 
//             }} 
//           >
//             {hoveredHotspot.title} 
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PanoViewer;

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import RibbonCutting from './Components/RibbonCutting';

const PanoViewer = ({ image, hotspots }) => {
  const mountRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [hoveredHotspot, setHoveredHotspot] = useState(null); 
  const [activeComponent, setActiveComponent] = useState(null);
  
  // Set initial state once
  useEffect(() => {
    setActiveComponent(null); 
  }, []);
  
  useEffect(() => {
    let scene, camera, renderer, controls, mesh;
    let currentMount = mountRef.current;
    if (!currentMount) return;

    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); 
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();  
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create panorama sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert for inside view
    const texture = new THREE.TextureLoader().load(image);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add OrbitControls for navigation
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; // Enable zooming
    controls.enablePan = true;
    controls.rotateSpeed = 0.3;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    // Create a group to hold all hotspots for easier raycasting
    const hotspotGroup = new THREE.Group();
    scene.add(hotspotGroup);

    // Add hotspots to the group
    hotspots.forEach((hotspot) => {
      const hotspotGeometry = new THREE.SphereGeometry(10, 16, 8); // Smaller sphere for hotspot
      const hotspotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 }); // Red, semi-transparent
      const hotspotMesh = new THREE.Mesh(hotspotGeometry, hotspotMaterial);

      // Convert spherical coordinates to Cartesian for positioning
      const phi = THREE.MathUtils.degToRad(90 - hotspot.latitude);
      const theta = THREE.MathUtils.degToRad(hotspot.longitude);
      const radius = 500; // Radius of the panorama
      hotspotMesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      hotspotMesh.position.y = radius * Math.cos(phi);
      hotspotMesh.position.z = radius * Math.sin(phi) * Math.sin(theta);
      hotspotMesh.userData = hotspot; // Store hotspot data
      hotspotGroup.add(hotspotMesh);
    });

    // Raycasting for hotspot interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotGroup.children);

      if (intersects.length > 0) {
        setHoveredHotspot(intersects[0].object.userData);
        document.body.style.cursor = 'pointer';

        const intersectedPoint = intersects[0].point;

        // Convert the world position of the hotspot to screen coordinates
        const vector = new THREE.Vector3();
        vector.copy(intersectedPoint);
        vector.project(camera);

        // Map the projected coordinates to the screen dimensions
        const x = (vector.x + 1) / 2 * window.innerWidth;
        const y = -(vector.y - 1) / 2 * window.innerHeight;

        // Add an offset of 10px to the tooltip position
        const offsetX = 10;
        const offsetY = 10;

        // Update the tooltip position dynamically
        setHoveredHotspot((prevHoveredHotspot) => ({
          ...prevHoveredHotspot,
          position: {
            x: x + offsetX,
            y: y + offsetY,
          }
        }));
      } else {
        setHoveredHotspot(null);
        document.body.style.cursor = 'default';
      }
    };

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotGroup.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData) {
          const intersectedPoint = intersects[0].point;

          // Convert the world position of the hotspot to screen coordinates
          const vector = new THREE.Vector3();
          vector.copy(intersectedPoint);
          vector.project(camera);

          const x = (vector.x + 1) / 2 * window.innerWidth;
          const y = -(vector.y - 1) / 2 * window.innerHeight;

          // Add an offset of 10px to the tooltip position
          const offsetX = 10;
          const offsetY = 10;

          // Update the tooltip state when clicking on a hotspot
          setTooltip({
            ...intersectedObject.userData,
            component: RibbonCutting,
            position: {
              x: x + offsetX,
              y: y + offsetY,
            }
          });
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('mousemove', onMouseMove); 
      if (currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      texture.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, [image, hotspots]); // Removed tooltip as a dependency here

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
      {activeComponent && (
        <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px', pointerEvents: activeComponent ? 'none' : 'auto' }}>
          {activeComponent}
        </div>
      )}
      {tooltip && tooltip.position && (
        <div
          style={{
            position: 'absolute',
            top: `${tooltip.position.y}px`,
            left: `${tooltip.position.x}px`,
            zIndex: 1,
          }}
        >
          {tooltip.component && React.createElement(tooltip.component)}
        </div>
      )}

      {hoveredHotspot && hoveredHotspot.position && (
        <div style={{ position: 'absolute', top: `${hoveredHotspot.position.y}px`, left: `${hoveredHotspot.position.x}px`, pointerEvents: 'none' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 0, 0.5)', borderRadius: '5px', padding: '5px' }}>
            {hoveredHotspot.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default PanoViewer;
