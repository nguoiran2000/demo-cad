import { useEffect, useRef, useState } from 'react'
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Building from "./components/Building";
import DwgToSvgViewer from './components/DwgToSvgViewer';
import FloorDetail from './components/FloorDetail';
import { Text, Billboard } from "@react-three/drei";

function App() {
  const [selectedFloor, setSelectedFloor] = useState(null);

  const [svgUrl, setSvgUrl] = useState(null);
  const workerRef = useRef(null);
  useEffect(() => {
      workerRef.current = new Worker(
        new URL("./tools/dwgWorker.ts", import.meta.url),
        { type: "module" }
      );
  
      workerRef.current.onmessage = (e) => {
        const { svgBytes, error } = e.data;
  
        if (error) {
          console.error(error);
          alert("DWG convert failed");
        } else {
          const blob = new Blob([svgBytes], {
              type: "image/svg+xml",
          });
          const url = URL.createObjectURL(blob);
          setSvgUrl(url);
          // setSvgContent(svg);
        }
      };
  
      return () => {
        workerRef.current?.terminate();
        workerRef.current = null;
      };
    }, []);

  const floors = 5;
  return (
    <>
    <DwgToSvgViewer setSvgUrl={setSvgUrl} workerRef={workerRef} />
    <div style={{display:'flex', gap:'16px'}}>
      <div style={{width: '30%'}}>
      <Canvas camera={{ position: [5, 6, 8], fov: 60 }} style={{width: '100%', height: '300px', background: '#163959'}}>
        {Array.from({ length: floors }).map((_, i) => (
          <Billboard position={[-7, i - 0.5, 3]}>
          <Text fontSize={0.5} color={((selectedFloor && selectedFloor.split('-')[1] == i)) ? "#681a2a" : "#007493"}>
            {i+1}F
          </Text>
        </Billboard>
        ))}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={5} />

        {/* <Grid args={[50, 50]} /> */}

        <Building id='a' floors={floors} onSelect={setSelectedFloor} selectedFloor={selectedFloor} x={-3} />
        <Building id='b' floors={floors} onSelect={setSelectedFloor} selectedFloor={selectedFloor} x={3} />

        {/* Drag / rotate building */}
        <OrbitControls enablePan enableRotate enableZoom />
      </Canvas>
      </div>
      <div style={{width: '70%'}}>
        <FloorDetail workerRef={workerRef} selectedFloor={selectedFloor} svgUrl={svgUrl} />
      </div>
    </div>
    </>
  );
}

export default App
