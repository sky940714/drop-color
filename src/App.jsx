import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

// ▼▼▼ 修改 1：引入兩台車，並取別名 (Alias) ▼▼▼
import { Model as BmwModel } from './Bmw'
import { Model as BikeModel } from './Yamaha_yzf-r3_2017' // 請確認這跟你的檔名一樣

// === 這是特殊烤漆的資料庫 (模擬後端資料) ===
const BRAND_DATA = {
  doya: [
    { name: '魔幻紫 (Magic Purple)', color: '#4b0082', metalness: 0.8, roughness: 0.2, clearcoat: 1, iridescence: 1 },
    { name: '極光綠 (Aurora Green)', color: '#006400', metalness: 0.9, roughness: 0.1, clearcoat: 1, iridescence: 0.5 },
    { name: '深海藍 (Deep Blue)', color: '#00008b', metalness: 0.7, roughness: 0.2, clearcoat: 1, iridescence: 0.8 },
  ],
  aika: [
    { name: '水泥灰 (Cement Grey)', color: '#5e5e5e', metalness: 0.1, roughness: 0.1, clearcoat: 1, iridescence: 0 },
    { name: '消光戰鬥綠 (Matte Green)', color: '#2f4f2f', metalness: 0.5, roughness: 0.9, clearcoat: 0, iridescence: 0 },
    { name: '法拉利紅 (Ferrari Red)', color: '#cc0000', metalness: 0.3, roughness: 0.1, clearcoat: 1, iridescence: 0 },
  ]
}

export default function App() {
  // ▼▼▼ 修改 2：新增車種選擇狀態 (預設 'bmw') ▼▼▼
  const [vehicle, setVehicle] = useState('bmw')

  // 1. 模式切換: 'standard' (一般) 或 'special' (特殊)
  const [mode, setMode] = useState('standard') 
  
  // 2. 特殊烤漆品牌選擇
  const [selectedBrand, setSelectedBrand] = useState('doya')

  // 3. 核心設定檔 (所有材質參數都在這裡)
  const [config, setConfig] = useState({
    color: '#0066cc',
    metalness: 0.6,      // 金屬感 (珍珠粉)
    roughness: 0.2,      // 0=亮面, 1=消光
    clearcoat: 1.0,      // 金油層強度
    clearcoatRoughness: 0.1, // 金油層清晰度
    iridescence: 0       // 變色龍特效 (0=關, 1=開)
  })

  // 通用的數值更新函式
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  // 套用特殊烤漆預設值
  const applyPreset = (preset) => {
    setConfig({
      color: preset.color,
      metalness: preset.metalness,
      roughness: preset.roughness,
      clearcoat: preset.clearcoat,
      clearcoatRoughness: 0.1,
      iridescence: preset.iridescence
    })
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#111' }}>
      
      {/* 3D 畫布 */}
      <Canvas shadows camera={{ position: [4, 1, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.5} contactShadow={true}>
            
            {/* ▼▼▼ 修改 3：根據選擇渲染不同的車 ▼▼▼ */}
            {vehicle === 'bmw' && <BmwModel config={config} />}
            {vehicle === 'bike' && <BikeModel config={config} />}
            
          </Stage>
        </Suspense>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* UI 控制面板 */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px', 
        background: 'rgba(30, 30, 30, 0.9)', 
        color: 'white',
        padding: '20px', borderRadius: '12px', width: '300px',
        display: 'flex', flexDirection: 'column', gap: '15px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        fontFamily: 'sans-serif'
      }}>
        <h2 style={{margin: 0, fontSize: '20px', borderBottom:'1px solid #444', paddingBottom:'10px'}}>
          DROP COLOR <span style={{fontSize:'12px', color:'#888'}}>PRO</span>
        </h2>

        {/* ▼▼▼ 修改 4：新增車種選擇下拉選單 ▼▼▼ */}
        <div>
            <label style={{fontSize: '12px', color: '#aaa'}}>選擇車款 (Vehicle)</label>
            <select 
                value={vehicle} 
                onChange={(e) => setVehicle(e.target.value)}
                style={{
                    width: '100%', padding: '10px', marginTop: '5px', 
                    background: '#444', color: '#fff', border: '1px solid #666', 
                    borderRadius: '6px', fontSize: '14px', fontWeight: 'bold'
                }}
            >
                <option value="bmw">🚗 BMW M4 Competition</option>
                <option value="bike">🏍️ Yamaha R3 (2017)</option>
            </select>
        </div>

        <hr style={{width:'100%', borderColor:'#444', opacity:0.3}} />

        {/* 模式切換 Tab */}
        <div style={{display: 'flex', background: '#333', borderRadius: '8px', padding: '4px'}}>
          <button 
            onClick={() => setMode('standard')}
            style={{flex: 1, padding: '8px', border: 'none', background: mode === 'standard' ? '#555' : 'transparent', color: 'white', borderRadius: '6px', cursor:'pointer'}}
          >
            一般烤漆
          </button>
          <button 
            onClick={() => setMode('special')}
            style={{flex: 1, padding: '8px', border: 'none', background: mode === 'special' ? '#555' : 'transparent', color: 'white', borderRadius: '6px', cursor:'pointer'}}
          >
            特殊烤漆
          </button>
        </div>

        {/* ============ 一般烤漆面板 ============ */}
        {mode === 'standard' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            
            {/* 1. RGB 選色 */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>基礎色 (Base Color)</label>
              <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                <input 
                  type="color" 
                  value={config.color} 
                  onChange={(e) => updateConfig('color', e.target.value)}
                  style={{width: '50px', height: '30px', border: 'none', cursor: 'pointer'}}
                />
                <span style={{lineHeight:'30px', fontSize:'14px'}}>{config.color}</span>
              </div>
            </div>

            {/* 2. 珍珠粉/金屬感 (Metalness) */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>珍珠粉/金屬感 ({Math.round(config.metalness * 100)}%)</label>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={config.metalness} 
                onChange={(e) => updateConfig('metalness', parseFloat(e.target.value))}
                style={{width: '100%', cursor: 'pointer'}} 
              />
            </div>

            {/* 3. 粗糙度 (Roughness) - 決定消光 */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>粗糙度/消光 ({Math.round(config.roughness * 100)}%)</label>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={config.roughness} 
                onChange={(e) => updateConfig('roughness', parseFloat(e.target.value))}
                style={{width: '100%', cursor: 'pointer'}} 
              />
            </div>

            {/* 4. 金油層 (Clearcoat) */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>金油層厚度 ({Math.round(config.clearcoat * 100)}%)</label>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={config.clearcoat} 
                onChange={(e) => updateConfig('clearcoat', parseFloat(e.target.value))}
                style={{width: '100%', cursor: 'pointer'}} 
              />
            </div>
          </div>
        )}

        {/* ============ 特殊烤漆面板 ============ */}
        {mode === 'special' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            
            {/* 品牌選擇 */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>選擇品牌</label>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px'}}
              >
                <option value="doya">杜雅特效漆 (Doya)</option>
                <option value="aika">艾卡塗料 (Aika)</option>
              </select>
            </div>

            {/* 色號列表 */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <label style={{fontSize: '12px', color: '#aaa'}}>選擇色號</label>
              {BRAND_DATA[selectedBrand].map((preset, index) => (
                <button 
                  key={index}
                  onClick={() => applyPreset(preset)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px', background: '#333', border: '1px solid #444', 
                    borderRadius: '6px', color: 'white', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', 
                    background: preset.color, border: '1px solid white'
                  }} />
                  <span style={{fontSize: '14px'}}>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}