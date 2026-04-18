'use client'
import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

// ── Mesh presets ─────────────────────────────────────────────
const PRESETS = {
  'GlowX Gold':    { color: '#C9A84C', metalness: 0.9, roughness: 0.1, emissive: '#8B6914', emissiveIntensity: 0.3 },
  'Holographic':   { color: '#8080FF', metalness: 0.7, roughness: 0.2, emissive: '#4040CC', emissiveIntensity: 0.5 },
  'Chrome':        { color: '#CCCCCC', metalness: 1.0, roughness: 0.0, emissive: '#111111', emissiveIntensity: 0.1 },
  'Obsidian':      { color: '#222233', metalness: 0.8, roughness: 0.3, emissive: '#110011', emissiveIntensity: 0.2 },
  'Rose Gold':     { color: '#E8A0A0', metalness: 0.85, roughness: 0.15, emissive: '#8B4040', emissiveIntensity: 0.2 },
}

type MeshConfig = {
  shape: string
  color: string
  metalness: number
  roughness: number
  emissive: string
  emissiveIntensity: number
  wireframe: boolean
  autoRotate: boolean
  rotSpeed: number
  floatAnim: boolean
  bloom: boolean
  chromAberr: boolean
}

function MeshObject({ config }: { config: MeshConfig }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    if (config.autoRotate) meshRef.current.rotation.y += config.rotSpeed * 0.008
    if (config.floatAnim)  meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.12
  })

  const geometry = () => {
    switch (config.shape) {
      case 'Sphere':       return <sphereGeometry args={[1.2, 64, 64]} />
      case 'Torus':        return <torusGeometry args={[1, 0.35, 32, 100]} />
      case 'Torus Knot':   return <torusKnotGeometry args={[0.8, 0.25, 200, 32, 2, 3]} />
      case 'Icosahedron':  return <icosahedronGeometry args={[1.2, 2]} />
      case 'Octahedron':   return <octahedronGeometry args={[1.2, 2]} />
      case 'Dodecahedron': return <dodecahedronGeometry args={[1.1, 0]} />
      default:             return <torusKnotGeometry args={[0.8, 0.25, 200, 32, 2, 3]} />
    }
  }

  return (
    <mesh ref={meshRef} castShadow>
      {geometry()}
      <meshStandardMaterial
        color={config.color}
        metalness={config.metalness}
        roughness={config.roughness}
        emissive={config.emissive}
        emissiveIntensity={config.emissiveIntensity}
        wireframe={config.wireframe}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

function PostFX({ config }: { config: MeshConfig }) {
  return (
    <EffectComposer>
      {config.bloom && <Bloom luminanceThreshold={0.3} intensity={0.8} radius={0.4} />}
      {config.chromAberr && <ChromaticAberration offset={[0.002, 0.002] as any} />}
    </EffectComposer>
  )
}

// ── Control row helpers ───────────────────────────────────────
function SliderRow({ label, min, max, step = 0.05, value, onChange }: {
  label: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text)' }}>{label}</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.65rem', color: 'var(--gold)' }}>
          {value.toFixed(2)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)} style={{ width: '100%' }} />
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{
        width: 36, height: 18, borderRadius: 9, cursor: 'pointer',
        background: value ? 'var(--gold3)' : 'var(--dark3)',
        border: '1px solid rgba(201,168,76,0.2)', position: 'relative', transition: '0.3s',
      }}>
        <div style={{
          position: 'absolute', width: 12, height: 12, borderRadius: '50%', top: 2,
          left: value ? 20 : 2, transition: '0.3s',
          background: value ? 'var(--gold2)' : 'var(--text)',
        }} />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export function MeshGenerator({ onAttach }: { onAttach?: (config: MeshConfig) => void }) {
  const [config, setConfig] = useState<MeshConfig>({
    shape: 'Torus Knot', color: '#C9A84C', metalness: 0.9, roughness: 0.1,
    emissive: '#8B6914', emissiveIntensity: 0.3, wireframe: false,
    autoRotate: true, rotSpeed: 0.5, floatAnim: true,
    bloom: true, chromAberr: false,
  })

  const set = (k: keyof MeshConfig, v: any) => setConfig(c => ({ ...c, [k]: v }))

  const applyPreset = (name: string) => {
    const p = PRESETS[name as keyof typeof PRESETS]
    if (p) setConfig(c => ({ ...c, ...p }))
  }

  const randomize = () => {
    const colors = ['#C9A84C', '#4C8AC9', '#4CC98A', '#C94C4C', '#C98A4C', '#8A4CC9', '#E8A0A0']
    const shapes = ['Sphere', 'Torus', 'Torus Knot', 'Icosahedron', 'Octahedron', 'Dodecahedron']
    setConfig(c => ({
      ...c,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      metalness: Math.random(),
      roughness: Math.random() * 0.5,
    }))
  }

  const controlStyle: React.CSSProperties = {
    background: 'var(--dark)', borderRight: '1px solid rgba(201,168,76,0.1)',
    padding: 24, overflowY: 'auto', width: 300, flexShrink: 0,
  }
  const groupLabelStyle: React.CSSProperties = {
    fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '3px',
    color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12,
    paddingBottom: 8, borderBottom: '1px solid rgba(201,168,76,0.15)',
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
      {/* Controls */}
      <div style={controlStyle}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', marginBottom: 4 }}>
          3D Mesh Generator
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.52rem', color: 'var(--text)', marginBottom: 24 }}>
          GlowX Studio
        </div>

        {/* Geometry */}
        <div style={{ marginBottom: 24 }}>
          <div style={groupLabelStyle}>Geometry</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text)', marginBottom: 6 }}>Shape</div>
          <select value={config.shape} onChange={e => set('shape', e.target.value)}
            style={{ background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--white2)', padding: '6px 10px', fontSize: '0.7rem', width: '100%', marginBottom: 12, outline: 'none' }}>
            {['Sphere', 'Torus', 'Torus Knot', 'Icosahedron', 'Octahedron', 'Dodecahedron'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Toggle label="Wireframe" value={config.wireframe} onChange={v => set('wireframe', v)} />
        </div>

        {/* Material */}
        <div style={{ marginBottom: 24 }}>
          <div style={groupLabelStyle}>Material</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text)', marginBottom: 6 }}>Preset</div>
          <select onChange={e => applyPreset(e.target.value)}
            style={{ background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--white2)', padding: '6px 10px', fontSize: '0.7rem', width: '100%', marginBottom: 12, outline: 'none' }}>
            {Object.keys(PRESETS).map(p => <option key={p}>{p}</option>)}
          </select>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text)' }}>Color</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.65rem', color: 'var(--gold)' }}>{config.color}</span>
          </div>
          <input type="color" value={config.color} onChange={e => set('color', e.target.value)}
            style={{ width: '100%', height: 32, background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.2)', cursor: 'pointer', marginBottom: 8 }} />
          <SliderRow label="Metalness" min={0} max={1} value={config.metalness} onChange={v => set('metalness', v)} />
          <SliderRow label="Roughness" min={0} max={1} value={config.roughness} onChange={v => set('roughness', v)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text)' }}>Emissive</span>
          </div>
          <input type="color" value={config.emissive} onChange={e => set('emissive', e.target.value)}
            style={{ width: '100%', height: 28, background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.2)', cursor: 'pointer', marginBottom: 8 }} />
          <SliderRow label="Emissive Intensity" min={0} max={2} value={config.emissiveIntensity} onChange={v => set('emissiveIntensity', v)} />
        </div>

        {/* Animation */}
        <div style={{ marginBottom: 24 }}>
          <div style={groupLabelStyle}>Animation</div>
          <Toggle label="Auto Rotate"   value={config.autoRotate} onChange={v => set('autoRotate', v)} />
          <SliderRow label="Rotation Speed" min={0.05} max={3} value={config.rotSpeed} onChange={v => set('rotSpeed', v)} />
          <Toggle label="Float" value={config.floatAnim} onChange={v => set('floatAnim', v)} />
        </div>

        {/* Post FX */}
        <div style={{ marginBottom: 24 }}>
          <div style={groupLabelStyle}>Post FX</div>
          <Toggle label="Bloom"               value={config.bloom}      onChange={v => set('bloom', v)} />
          <Toggle label="Chromatic Aberration" value={config.chromAberr} onChange={v => set('chromAberr', v)} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={randomize}
            style={{ padding: '10px 16px', fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: 'var(--gold)', transition: '0.3s' }}>
            ⚄ Randomize
          </button>
          <button className="btn-gold" style={{ padding: '10px 16px', fontSize: '0.56rem' }}
            onClick={() => onAttach?.(config)}>
            Attach to Post
          </button>
          <button style={{ padding: '10px 16px', fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(201,168,76,0.2)', background: 'transparent', color: 'var(--text)' }}
            onClick={() => alert('GLB export requires server-side three.js renderer. Coming in v2.')}>
            Export GLB
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative', background: '#050505' }}>
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          fontFamily: "'DM Mono',monospace", fontSize: '0.54rem',
          color: 'rgba(201,168,76,0.4)', letterSpacing: '2px',
        }}>
          GLOWX 3D · WEBGL
        </div>
        <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} shadows style={{ background: '#050505' }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#E8C97A" />
          <pointLight position={[-5, -3, -5]} intensity={0.5} color="#4C8AC9" />
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <MeshObject config={config} />
            <PostFX config={config} />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={true} minDistance={2} maxDistance={8} />
        </Canvas>
      </div>
    </div>
  )
}
