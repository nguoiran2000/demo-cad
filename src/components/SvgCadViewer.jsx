import React, { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrthographicCamera, MapControls, Html } from "@react-three/drei"
import * as THREE from "three"

/* ---------------- SVG TEXTURE ---------------- */

function SvgPlane({ url, onReady, onAddMarker }) {
  const meshRef = useRef()
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.needsUpdate = true

        setTexture(tex)

        const img = tex.image
        meshRef.current.scale.set(img.width, img.height, 1)

        onReady({
          width: img.width,
          height: img.height,
        })
      },
      undefined,
      (err) => {
        console.error("Failed to load SVG texture", err)
      }
    )
  }, [url, onReady])

  return (
    <mesh ref={meshRef} onPointerDown={(e) => {
        if (e.button !== 2) return
        e.stopPropagation()
        onAddMarker(e.point.clone())
      }}>
      <planeGeometry args={[1, 1]} />
      {texture && (
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
        />
      )}
    </mesh>
  )
}
/* ---------------- BLINKING MARKER ---------------- */

function BlinkingMarker({ position }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    ref.current.material.opacity =
      0.3 + Math.abs(Math.sin(clock.elapsedTime * 4)) * 0.7
  })

  return (
    <mesh ref={ref} position={position}>
      <circleGeometry args={[10, 32]} />
      <meshBasicMaterial color="red" transparent />
    </mesh>
  )
}

/* ---------------- MARKER ---------------- */

function Marker({ position, info }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[8, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <Html distanceFactor={1}>
        <div
          style={{
            background: info === 'error' ? 'red' : "#111",
            color: "#fff",
            padding: "4px 6px",
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          {info}
        </div>
      </Html>
    </group>
  )
}

/* ---------------- SCENE ---------------- */

function Scene() {
  const cameraRef = useRef()
  const controlsRef = useRef()
  const [svgSize, setSvgSize] = useState(null)
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    if (!svgSize || !cameraRef.current) return

    const cam = cameraRef.current
    const maxDim = Math.max(svgSize.width, svgSize.height)

    cam.zoom = 800 / maxDim
    cam.updateProjectionMatrix()
    controlsRef.current?.update()
  }, [svgSize])

  const handleAddMarker = (point) => {
    const info = window.prompt("Enter marker info:")
    if (!info) return

    setMarkers((prev) => [
      ...prev,
      {
        position: point,
        info,
      },
    ])
  }

  return (
    <>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 1000]}
      />

      <MapControls
        ref={controlsRef}
        enableRotate={false}
        enableZoom
        enablePan
      />

      <SvgPlane
        url="/floorplan.svg"
        onReady={setSvgSize}
        onAddMarker={handleAddMarker}
      />

      {markers.map((m, i) => (
        <Marker key={i} position={m.position} info={m.info} />
      ))}
    </>
  )
}


/* ---------------- ROOT ---------------- */

export default function SvgTextureViewer() {
  return (
    <Canvas
      style={{
        width: "100%",
        height: "calc(100vh - 100px)",
        background: "#f4f4f4",
      }}
    >
      <Scene />
    </Canvas>
  )
}
