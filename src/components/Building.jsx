import Floor from "./Floor";

export default function Building({ id, floors = 5, onSelect, x, selectedFloor }) {
  return (
    <group position={[x, floors / 2, 0]}>
      {Array.from({ length: floors }).map((_, i) => (
        <Floor
            buildingId={id}
            selectedFloor={selectedFloor}
          key={i}
          index={i}
          position={[0, i - 3, 0]}
          onClick={() => onSelect(`${id}-${i}`)}
        />
      ))}
    </group>
  );
}
