import { useState } from "react";


export default function Floor({ index, position, onClick, selectedFloor, buildingId }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[5, 0.05, 5]} />
      <meshStandardMaterial
        color={hovered || (selectedFloor === `${buildingId}-${index}`) ? "#681a2a" : "#007493"}
      />
    </mesh>
  );
}
