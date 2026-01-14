// 1. 這裡補上 Suspense
import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { Interface } from './components/Interface'
import { Showroom } from './components/Showroom'
import { LoadingScreen } from './components/LoadingScreen'

export default function App() {
  // === 核心狀態 ===
  const [phase, setPhase] = useState('showroom')
  const [vehicle, setVehicle] = useState('newBike')
  const [flash, setFlash] = useState(false)

  // === 配色與材質狀態 ===
  const [mode, setMode] = useState('standard')
  const [selectedBrand, setSelectedBrand] = useState('doya')
  const [useMetalness, setUseMetalness] = useState(false)
  const [finishMode, setFinishMode] = useState('gloss')
  
  // 核心材質參數
  const [config, setConfig] = useState({
    color: '#0066cc',
    metalness: 0,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    iridescence: 0,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [100, 400]
  })

  // === 轉場特效邏輯 ===
  useEffect(() => {
    if (phase === 'configurator') {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 300)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // === 工具函式 ===
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleMetalness = (checked) => {
    setUseMetalness(checked)
    updateConfig('metalness', checked ? 0.6 : 0)
  }

  const applyPreset = (preset) => {
    setConfig(prev => ({
      ...prev,
      color: preset.color,
      metalness: preset.metalness,
      iridescence: preset.iridescence,
      roughness: preset.roughness ?? prev.roughness,
      iridescenceIOR: preset.iridescenceIOR ?? prev.iridescenceIOR,
      iridescenceThicknessRange: preset.iridescenceThicknessRange ?? prev.iridescenceThicknessRange
    }))
  }

  const setFinish = (type) => {
    setFinishMode(type)
    const settings = {
      matte: { roughness: 0.5, clearcoat: 0.5 },
      semi: { roughness: 0.3, clearcoat: 0.8 },
      gloss: { roughness: 0.1, clearcoat: 1.0 }
    }
    if (settings[type]) {
      setConfig(prev => ({ ...prev, ...settings[type] }))
    }
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#111', overflow: 'hidden' }}>
      
      {/* 1. 讀取畫面 */}
      <LoadingScreen />

      {/* 2. 轉場白光特效 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'white', zIndex: 50, pointerEvents: 'none',
        opacity: flash ? 1 : 0, transition: 'opacity 0.3s ease-out'
      }} />

      {/* 3. 選單大廳 */}
      {phase === 'showroom' && (
        <Showroom setVehicle={setVehicle} setPhase={setPhase} />
      )}

      {/* 4. 3D 場景 */}
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 45, near: 0.01, far: 200 }}>
        {/* ▼▼▼ 重點：加上 Suspense，不然讀取圖片時會報錯 ▼▼▼ */}
        <Suspense fallback={null}>
           <Experience vehicle={vehicle} config={config} phase={phase} />
        </Suspense>
      </Canvas>

      {/* 5. 配色介面 */}
      {phase === 'configurator' && (
        <>
          <Interface 
            vehicle={vehicle} setVehicle={setVehicle}
            mode={mode} setMode={setMode}
            config={config} updateConfig={updateConfig}
            selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
            useMetalness={useMetalness} toggleMetalness={toggleMetalness}
            finishMode={finishMode} setFinish={setFinish}
            applyPreset={applyPreset}
          />
          
          <button 
            onClick={() => setPhase('showroom')}
            style={{
              position: 'absolute', top: '20px', left: '20px',
              padding: '10px 20px', background: 'transparent', border: '1px solid #444',
              color: 'white', borderRadius: '4px', cursor: 'pointer', zIndex: 20
            }}
          >
            ← BACK TO SHOWROOM
          </button>
        </>
      )}
      
    </div>
  )
}