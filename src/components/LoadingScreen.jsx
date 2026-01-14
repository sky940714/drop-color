import React from 'react'
import { useProgress } from '@react-three/drei'

export const LoadingScreen = ({ started, onStarted }) => {
  const { progress } = useProgress()
  
  // 當讀取完成 (100%)，且使用者點擊開始後的邏輯可以寫在這裡
  // 但我們簡化流程：讀取完自動進入 Showroom
  
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'black', zIndex: 999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 1s ease-in-out',
      opacity: progress === 100 ? 0 : 1, // 讀取完淡出
      pointerEvents: progress === 100 ? 'none' : 'all',
    }}>
      <h1 style={{ 
        color: 'white', fontSize: '3rem', fontFamily: 'Impact', 
        animation: 'pulse 1.5s infinite' // 呼吸燈動畫
      }}>
        DROP COLOR
      </h1>
      <div style={{ width: '200px', height: '4px', background: '#333', marginTop: '20px', borderRadius: '2px' }}>
        <div style={{ 
          width: `${progress}%`, height: '100%', 
          background: '#0066cc', transition: 'width 0.2s' 
        }} />
      </div>
      <p style={{ color: '#666', marginTop: '10px', fontSize: '12px' }}>
        LOADING ASSETS... {Math.round(progress)}%
      </p>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.5; text-shadow: 0 0 10px #0066cc; }
          50% { opacity: 1; text-shadow: 0 0 30px #0066cc; }
          100% { opacity: 0.5; text-shadow: 0 0 10px #0066cc; }
        }
      `}</style>
    </div>
  )
}