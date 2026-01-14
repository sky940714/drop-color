import React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// === 1. 定義「全圖卡」元件 (Full Art Card) ===
const TiltCard = ({ car, onClick }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // 物理彈性參數
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 })

  // 旋轉角度
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [20, -20]) 
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-20, 20])
  
  // 閃光特效位置
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ scale: 1, opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: '280px',
        height: '420px',
        perspective: 1000,
        cursor: 'pointer',
        margin: '20px'
      }}
    >
      <motion.div
        style={{
          width: '100%', height: '100%',
          rotateX, rotateY,
          transformStyle: "preserve-3d",
          borderRadius: '24px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        
        {/* === 1. 滿版背景圖片層 === */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 1,
        }}>
           <img 
             src={car.img} 
             alt={car.name} 
             style={{ 
               width: '100%', 
               height: '100%', 
               objectFit: 'cover', 
               
               // ▼▼▼ 修復重點 1：這裡加上了讀取 pos 的邏輯 ▼▼▼
               objectPosition: car.pos || 'center', 

               transform: 'scale(1.1)', 
               transition: 'transform 0.5s ease', 
             }} 
           />
        </div>

        {/* === 2. 底部漸層遮罩 === */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        {/* === 3. 文字資訊層 === */}
        <div style={{ 
          position: 'absolute', bottom: '30px', left: 0, width: '100%',
          transform: "translateZ(40px)",
          textAlign: 'center', 
          zIndex: 3,
          padding: '0 20px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            fontSize: '32px', margin: '0 0 5px 0', color: 'white', 
            textTransform: 'uppercase', fontFamily: 'Impact, sans-serif', 
            letterSpacing: '1px', lineHeight: '1',
            textShadow: '0 4px 10px rgba(0,0,0,0.8)'
          }}>
            {car.name}
          </h3>
          
          <div style={{ width: '40px', height: '3px', background: '#0066cc', margin: '10px auto', borderRadius: '2px' }} />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '5px' }}>
            <span style={{ 
              fontSize: '12px', color: '#fff', background: 'rgba(255,255,255,0.1)', 
              padding: '4px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              TRACK EDITION
            </span>
            <span style={{ 
              fontSize: '12px', color: '#00ccff', background: 'rgba(0,204,255,0.1)', 
              padding: '4px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(0,204,255,0.3)', fontWeight: 'bold'
            }}>
              SSR
            </span>
          </div>
        </div>

        {/* === 4. 閃光特效層 === */}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(125deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 55%, rgba(255,255,255,0) 70%)',
            backgroundSize: '200% 200%',
            backgroundPositionX: shineX,
            backgroundPositionY: shineY,
            mixBlendMode: 'overlay',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        />

        <div style={{
          position: 'absolute', inset: 0, 
          borderRadius: '24px', 
          border: '1px solid rgba(255,255,255,0.15)', 
          zIndex: 5, pointerEvents: 'none'
        }} />
        
      </motion.div>
    </motion.div>
  )
}

// === 主頁面 Showroom ===
export const Showroom = ({ setVehicle, setPhase }) => {
  const cars = [
    // 試著調整第一個數字來改變左右位置 (例如 80% 向右移, 20% 向左移)
    { 
      id: 'newBike', 
      name: 'Original Moto', 
      img: '/bike-new.png', 
      pos: '60% center' // 置中
    }, 
    { 
      id: 'bmw', 
      name: 'BMW M4', 
      img: '/bmw-m4.png', 
      pos: '20% center' // 靠右一點
    },
    { 
      id: 'bike', 
      name: 'Yamaha R3', 
      img: '/yamaha-r3.png', 
      pos: '60% center' // 靠左一點
    },
  ]

  // ▼▼▼ 修復重點 2：補回了選車的函式 ▼▼▼
  const selectCar = (carId) => {
    setVehicle(carId)
    setPhase('configurator')
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 10
      }}
    >
      <h1 style={{ 
        color: 'white', fontSize: '4rem', marginBottom: '20px', 
        fontFamily: 'Impact, sans-serif', letterSpacing: '4px', 
        textShadow: '0 0 40px rgba(0,102,204,0.8)',
        zIndex: 20
      }}>
        GARAGE <span style={{color: '#0066cc'}}>COLLECTION</span>
      </h1>

      <p style={{ color: '#aaa', marginBottom: '40px', letterSpacing: '2px', fontSize: '14px' }}>
        SELECT YOUR MACHINE
      </p>

      <div style={{ 
        display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center',
        maxWidth: '1200px', width: '100%', padding: '0 20px'
      }}>
        {cars.map((car) => (
          <TiltCard key={car.id} car={car} onClick={() => selectCar(car.id)} />
        ))}
      </div>
    </motion.div>
  )
}