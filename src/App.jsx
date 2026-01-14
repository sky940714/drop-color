import React, { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { Interface } from './components/Interface'
import { Showroom } from './components/Showroom'
import { LoadingScreen } from './components/LoadingScreen'
import { BRAND_DATA } from './data/brands' // 如果你已經分開了 data

export default function App() {
  // === 核心狀態 ===
  // phase: 'loading' -> 'showroom' -> 'configurator'
  const [phase, setPhase] = useState('showroom') 
  const [vehicle, setVehicle] = useState('newBike')
  
  // 閃光特效狀態
  const [flash, setFlash] = useState(false)

  // 當從 showroom 切換到 configurator 時，觸發閃光
  useEffect(() => {
    if (phase === 'configurator') {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 300) // 閃光持續 0.3 秒
      return () => clearTimeout(timer)
    }
  }, [phase])

  // ... 這裡保留原本的 Config 狀態與函式 (updateConfig, setFinish 等) ...
  // (為了版面整潔，我省略了 config, mode 等狀態的定義，請把上次的邏輯貼回來)
  const [mode, setMode] = useState('standard') 
  const [selectedBrand, setSelectedBrand] = useState('doya')
  const [useMetalness, setUseMetalness] = useState(false) 
  const [finishMode, setFinishMode] = useState('gloss')
  const [config, setConfig] = useState({
    color: '#0066cc',
    metalness: 0,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    iridescence: 0
  })
  
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }
  const toggleMetalness = (checked) => {
    setUseMetalness(checked)
    if (checked) { updateConfig('metalness', 0.6) } 
    else { updateConfig('metalness', 0) }
  }
  const applyPreset = (preset) => {
    setConfig(prev => ({ ...prev, color: preset.color, metalness: preset.metalness, iridescence: preset.iridescence }))
  }
  const setFinish = (type) => {
    setFinishMode(type)
    switch (type) {
      case 'matte': setConfig(prev => ({ ...prev, roughness: 0.5, clearcoat: 0.5 })); break
      case 'semi': setConfig(prev => ({ ...prev, roughness: 0.3, clearcoat: 0.8 })); break
      case 'gloss': setConfig(prev => ({ ...prev, roughness: 0.1, clearcoat: 1.0 })); break
    }
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#111', overflow: 'hidden' }}>
      
      {/* 1. 讀取畫面 (最上層) */}
      <LoadingScreen />

      {/* 2. 閃光特效層 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'white', zIndex: 50, pointerEvents: 'none',
        opacity: flash ? 1 : 0, transition: 'opacity 0.3s ease-out'
      }} />

      {/* 3. 車庫大廳 (選單) */}
      {phase === 'showroom' && (
        <Showroom setVehicle={setVehicle} setPhase={setPhase} />
      )}

      {/* 4. 3D 場景 */}
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 45 }}>
        {/* 把 phase 傳進去，讓 Experience 控制運鏡 */}
        <Experience vehicle={vehicle} config={config} phase={phase} />
      </Canvas>

      {/* 5. 配置 UI (只有進入配置模式才顯示) */}
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
          {/* 加一個返回按鈕 */}
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