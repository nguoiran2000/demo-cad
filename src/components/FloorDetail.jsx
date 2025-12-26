import React, { useEffect } from "react";

export default function FloorDetail({selectedFloor, svgUrl, workerRef }) {
  useEffect(() => {
    if (selectedFloor !== null)
    fetch(`/floor${selectedFloor.split('-')[1]}.dwg`).then(async response => {
      const buffer = await response.arrayBuffer();
      
      workerRef.current?.postMessage(
        { buffer },
        [buffer]
      );
    })
  }, [
    selectedFloor,
  ])

  return (
    <div style={{height: 'calc(100vh-100px)'}}>
    {/* <h3>Main Information Floor {selectedFloor+1}</h3> */}
    {svgUrl ? <img style={{
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 75px)'
    }} src={svgUrl} alt="CAD SVG" /> : 'loading...'}
    </div>
  );
}
