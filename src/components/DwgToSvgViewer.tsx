import React, { useEffect, useRef, useState } from "react";

export default function DwgToSvgViewer({setSvgUrl, workerRef}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File too large (max 50MB)");
      return;
    }

    setLoading(true);
    setSvgUrl(null);
    const buffer = await file.arrayBuffer();
     workerRef.current?.postMessage(
      { buffer },
      [buffer]
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".dwg"
        onChange={handleFileChange}
      />

      {loading && <p>Converting DWG → SVG…</p>}
    </div>
  );
}
