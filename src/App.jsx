import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

import { Model as BmwModel } from './Bmw'
import { Model as BikeModel } from './Yamaha_yzf-r3_2017'
import { Model as NewBikeModel } from './Motorcycle'

// 資料庫：移除預設的 roughness/clearcoat，改由按鈕控制，或保留作為預設值
const BRAND_DATA = {
  doya: [
    { name: '魔幻紫 (Magic Purple)', color: '#4b0082', metalness: 0.8, iridescence: 1 },
    { name: '極光綠 (Aurora Green)', color: '#006400', metalness: 0.9, iridescence: 0.5 },
    { name: '深海藍 (Deep Blue)', color: '#00008b', metalness: 0.7, iridescence: 0.8 },
  ],
  aika: [
    { name: '水泥灰 (Cement Grey)', color: '#5e5e5e', metalness: 0.1, iridescence: 0 },
    { name: '戰鬥綠 (Combat Green)', color: '#2f4f2f', metalness: 0.5, iridescence: 0 },
    { name: '法拉利紅 (Ferrari Red)', color: '#cc0000', metalness: 0.3, iridescence: 0 },
  ]
}

export default function App() {
  const [vehicle, setVehicle] = useState('newBike')
  const [mode, setMode] = useState('standard') 
  const [selectedBrand, setSelectedBrand] = useState('doya')

  const [config, setConfig] = useState({
    color: '#0066cc',
    metalness: 0.6,
    roughness: 0.2,      // 預設亮面
    clearcoat: 1.0,      // 預設有金油
    clearcoatRoughness: 0.1,
    iridescence: 0
  })

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  // ▼▼▼ 修改：套用顏色時，不一定要覆蓋光澤度，或者給一個預設值 ▼▼▼
  const applyPreset = (preset) => {
    setConfig(prev => ({
      ...prev, // 保留當下的光澤設定
      color: preset.color,
      metalness: preset.metalness,
      iridescence: preset.iridescence,
      // 如果你想讓特殊色有預設光澤，可以在這裡加，但目前為了流程自由度，我們先不鎖死
    }))
  }

  // ▼▼▼ 新增：金油層/光澤度 快速設定函式 ▼▼▼
  const setFinish = (type) => {
    switch (type) {
      case 'matte': // 消光
        setConfig(prev => ({ ...prev, roughness: 1.0, clearcoat: 0.0 }))
        break
      case 'semi':  // 半消光
        setConfig(prev => ({ ...prev, roughness: 0.5, clearcoat: 0.5 }))
        break
      case 'gloss': // 亮面
        setConfig(prev => ({ ...prev, roughness: 0.1, clearcoat: 1.0 }))
        break
    }
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#111' }}>
      
      <Canvas shadows camera={{ position: [4, 1, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.5} contactShadow={true}>
            {vehicle === 'bmw' && <BmwModel config={config} />}
            {vehicle === 'bike' && <BikeModel config={config} />}
            {vehicle === 'newBike' && <NewBikeModel config={config} />}
          </Stage>
        </Suspense>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* UI 面板 */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px', 
        background: 'rgba(30, 30, 30, 0.9)', color: 'white',
        padding: '20px', borderRadius: '12px', width: '300px',
        display: 'flex', flexDirection: 'column', gap: '15px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontFamily: 'sans-serif'
      }}>
        <h2 style={{margin: 0, fontSize: '20px', borderBottom:'1px solid #444', paddingBottom:'10px'}}>
          DROP COLOR <span style={{fontSize:'12px', color:'#888'}}>PRO</span>
        </h2>

        {/* 0. 車種選擇 */}
        <div>
            <label style={{fontSize: '12px', color: '#aaa'}}>0. 選擇車款</label>
            <select 
                value={vehicle} onChange={(e) => setVehicle(e.target.value)}
                style={{
                    width: '100%', padding: '10px', marginTop: '5px', 
                    background: '#444', color: '#fff', border: '1px solid #666', borderRadius: '6px'
                }}
            >
                <option value="newBike">🏍️ New Motorcycle</option>
                <option value="bmw">🚗 BMW M4</option>
                <option value="bike">🏍️ Yamaha R3</option>
            </select>
        </div>

        <hr style={{width:'100%', borderColor:'#444', opacity:0.3}} />

        {/* 模式切換 */}
        <div style={{display: 'flex', background: '#333', borderRadius: '8px', padding: '4px'}}>
          <button onClick={() => setMode('standard')} style={{flex: 1, padding: '8px', border: 'none', background: mode === 'standard' ? '#555' : 'transparent', color: 'white', borderRadius: '6px', cursor:'pointer'}}>
            一般色
          </button>
          <button onClick={() => setMode('special')} style={{flex: 1, padding: '8px', border: 'none', background: mode === 'special' ? '#555' : 'transparent', color: 'white', borderRadius: '6px', cursor:'pointer'}}>
            特殊色
          </button>
        </div>

        {/* ============ 1. 一般色流程 ============ */}
        {mode === 'standard' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {/* RGB */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>1. 基礎色 (RGB)</label>
              <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                <input type="color" value={config.color} onChange={(e) => updateConfig('color', e.target.value)} style={{width: '50px', height: '30px', border: 'none', cursor: 'pointer'}} />
                <span style={{lineHeight:'30px', fontSize:'14px'}}>{config.color}</span>
              </div>
            </div>

            {/* 珍珠粉 */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>2. 珍珠粉/金屬感</label>
              <input type="range" min="0" max="1" step="0.1" value={config.metalness} onChange={(e) => updateConfig('metalness', parseFloat(e.target.value))} style={{width: '100%', cursor: 'pointer'}} />
            </div>

            {/* ▼▼▼ 新增：特殊漆面 (變色龍) 開關 ▼▼▼ */}
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input 
                type="checkbox" 
                checked={config.iridescence > 0} 
                onChange={(e) => updateConfig('iridescence', e.target.checked ? 1 : 0)} 
                style={{width:'18px', height:'18px', cursor:'pointer'}}
              />
              <label style={{fontSize: '14px', cursor:'pointer'}}>3. 增加特殊漆面 (幻彩)</label>
            </div>
          </div>
        )}

        {/* ============ 2. 特殊色流程 ============ */}
        {mode === 'special' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {/* 品牌 */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>1. 選擇品牌</label>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px'}}>
                <option value="doya">杜雅特效漆 (Doya)</option>
                <option value="aika">艾卡塗料 (Aika)</option>
              </select>
            </div>

            {/* 色號 */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <label style={{fontSize: '12px', color: '#aaa'}}>2. 選擇色號</label>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                {BRAND_DATA[selectedBrand].map((preset, index) => (
                  <button key={index} onClick={() => applyPreset(preset)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', 
                    background: '#444', border: '1px solid #555', borderRadius: '4px', color: 'white', cursor: 'pointer'
                  }}>
                    <div style={{width: '16px', height: '16px', borderRadius: '50%', background: preset.color, border: '1px solid white'}} />
                    <span style={{fontSize: '12px'}}>{preset.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <hr style={{width:'100%', borderColor:'#444', opacity:0.3}} />

        {/* ============ 共用流程：金油層選擇 ============ */}
        {/* ▼▼▼ 修改：無論是一般色還是特殊色，最後都可以在這裡調整光澤 ▼▼▼ */}
        <div>
          <label style={{fontSize: '12px', color: '#aaa'}}>最後步驟：選擇金油層 (光澤度)</label>
          <div style={{display: 'flex', gap: '5px', marginTop: '8px'}}>
            <button onClick={() => setFinish('matte')} style={{flex:1, padding:'10px', background:'#333', border:'1px solid #555', color:'white', borderRadius:'4px', cursor:'pointer', fontSize:'12px'}}>
              消光<br/>(Matte)
            </button>
            <button onClick={() => setFinish('semi')} style={{flex:1, padding:'10px', background:'#333', border:'1px solid #555', color:'white', borderRadius:'4px', cursor:'pointer', fontSize:'12px'}}>
              半消光<br/>(Semi)
            </button>
            <button onClick={() => setFinish('gloss')} style={{flex:1, padding:'10px', background:'#0066cc', border:'none', color:'white', borderRadius:'4px', cursor:'pointer', fontSize:'12px', fontWeight:'bold'}}>
              亮面<br/>(Gloss)
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}