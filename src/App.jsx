import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

import { Model as BmwModel } from './Bmw'
import { Model as BikeModel } from './Yamaha_yzf-r3_2017'
import { Model as NewBikeModel } from './Motorcycle'

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

  // 控制金屬感開關
  const [useMetalness, setUseMetalness] = useState(false) 
  
  // ▼▼▼ 修改 1：新增這個狀態來記住現在是哪種光澤 (預設 gloss) ▼▼▼
  const [finishMode, setFinishMode] = useState('gloss')

  const [config, setConfig] = useState({
    color: '#0066cc',
    metalness: 0,
    roughness: 0.1,      // 對應 gloss 的預設值
    clearcoat: 1.0,      // 對應 gloss 的預設值
    clearcoatRoughness: 0.1,
    iridescence: 0
  })

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleMetalness = (checked) => {
    setUseMetalness(checked)
    if (checked) {
      updateConfig('metalness', 0.6) 
    } else {
      updateConfig('metalness', 0)   
    }
  }

  const applyPreset = (preset) => {
    setConfig(prev => ({
      ...prev,
      color: preset.color,
      metalness: preset.metalness,
      iridescence: preset.iridescence,
    }))
  }

  // ▼▼▼ 修改 2：重新定義光澤數值，並更新 finishMode 狀態 ▼▼▼
  const setFinish = (type) => {
    setFinishMode(type) // 這一行讓按鈕知道誰被選中了
    
    switch (type) {
      case 'matte': // 消光 (改成你原本喜歡的半消光數值)
        setConfig(prev => ({ ...prev, roughness: 0.5, clearcoat: 0.5 }))
        break
      case 'semi':  // 半消光 (新調配：介於中間，像絲綢質感)
        setConfig(prev => ({ ...prev, roughness: 0.3, clearcoat: 0.8 }))
        break
      case 'gloss': // 亮面 (維持不變)
        setConfig(prev => ({ ...prev, roughness: 0.1, clearcoat: 1.0 }))
        break
      default:
        break;
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

        <div style={{display: 'flex', background: '#333', borderRadius: '8px', padding: '4px'}}>
          <button 
            onClick={() => setMode('standard')} 
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor:'pointer',
              background: mode === 'standard' ? '#555' : 'transparent', // 按鈕變色邏輯
              color: 'white'
            }}
          >
            一般色
          </button>
          <button 
            onClick={() => setMode('special')} 
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor:'pointer',
              background: mode === 'special' ? '#555' : 'transparent', // 按鈕變色邏輯
              color: 'white'
            }}
          >
            特殊色
          </button>
        </div>

        {/* ============ 1. 一般色流程 ============ */}
        {mode === 'standard' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            
            {/* 1. 基礎色 RGB */}
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>1. 基礎色 (RGB)</label>
              <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                <input type="color" value={config.color} onChange={(e) => updateConfig('color', e.target.value)} style={{width: '50px', height: '30px', border: 'none', cursor: 'pointer'}} />
                <span style={{lineHeight:'30px', fontSize:'14px'}}>{config.color}</span>
              </div>
            </div>

            {/* 2. 金屬感選配 */}
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
                <input 
                  type="checkbox" 
                  checked={useMetalness} 
                  onChange={(e) => toggleMetalness(e.target.checked)} 
                  style={{width:'18px', height:'18px', cursor:'pointer'}}
                />
                <label style={{fontSize: '14px', cursor:'pointer'}}>2. 選配：珍珠粉/金屬感</label>
              </div>

              {useMetalness && (
                <div style={{paddingLeft: '28px'}}>
                  <label style={{fontSize: '10px', color: '#888'}}>顆粒強度 ({Math.round(config.metalness * 100)}%)</label>
                  <input 
                    type="range" min="0.1" max="1" step="0.1" 
                    value={config.metalness || 0.1} 
                    onChange={(e) => updateConfig('metalness', parseFloat(e.target.value))} 
                    style={{width: '100%', cursor: 'pointer'}} 
                  />
                </div>
              )}
            </div>

            {/* 3. 特殊漆面 (變色龍) */}
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input 
                type="checkbox" 
                checked={config.iridescence > 0} 
                onChange={(e) => updateConfig('iridescence', e.target.checked ? 1 : 0)} 
                style={{width:'18px', height:'18px', cursor:'pointer'}}
              />
              <label style={{fontSize: '14px', cursor:'pointer'}}>3. 選配：特殊漆面 (幻彩)</label>
            </div>
          </div>
        )}

        {/* ============ 2. 特殊色流程 ============ */}
        {mode === 'special' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div>
              <label style={{fontSize: '12px', color: '#aaa'}}>1. 選擇品牌</label>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px'}}>
                <option value="doya">杜雅特效漆 (Doya)</option>
                <option value="aika">艾卡塗料 (Aika)</option>
              </select>
            </div>
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
        {/* ▼▼▼ 修改 3：按鈕樣式現在會檢查 finishMode，選中的才會變藍色 ▼▼▼ */}
        <div>
          <label style={{fontSize: '12px', color: '#aaa'}}>最後步驟：選擇金油層 (光澤度)</label>
          <div style={{display: 'flex', gap: '5px', marginTop: '8px'}}>
            
            <button 
              onClick={() => setFinish('matte')} 
              style={{
                flex:1, padding:'10px', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'12px',
                background: finishMode === 'matte' ? '#0066cc' : '#333', // 判斷變色
                color: 'white', fontWeight: finishMode === 'matte' ? 'bold' : 'normal',
                border: finishMode === 'matte' ? 'none' : '1px solid #555'
              }}
            >
              消光<br/>(Matte)
            </button>

            <button 
              onClick={() => setFinish('semi')} 
              style={{
                flex:1, padding:'10px', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'12px',
                background: finishMode === 'semi' ? '#0066cc' : '#333', // 判斷變色
                color: 'white', fontWeight: finishMode === 'semi' ? 'bold' : 'normal',
                border: finishMode === 'semi' ? 'none' : '1px solid #555'
              }}
            >
              半消光<br/>(Satin)
            </button>

            <button 
              onClick={() => setFinish('gloss')} 
              style={{
                flex:1, padding:'10px', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'12px',
                background: finishMode === 'gloss' ? '#0066cc' : '#333', // 判斷變色
                color: 'white', fontWeight: finishMode === 'gloss' ? 'bold' : 'normal',
                border: finishMode === 'gloss' ? 'none' : '1px solid #555'
              }}
            >
              亮面<br/>(Gloss)
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}