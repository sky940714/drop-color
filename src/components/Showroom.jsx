import React from 'react'
import { motion } from 'framer-motion'

export const Showroom = ({ setVehicle, setPhase }) => {
  
  const cars = [
    { id: 'newBike', name: 'Original Moto', img: '🏍️' },
    { id: 'bmw', name: 'BMW M4', img: '🚗' },
    { id: 'bike', name: 'Yamaha R3', img: '🏍️' },
  ]

  const selectCar = (carId) => {
    setVehicle(carId)
    setPhase('configurator') // 觸發進場
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        
        // ▼▼▼ 修改重點：讀取你的 bg.png ▼▼▼
        // 說明：linear-gradient 是為了蓋一層 70% 的黑色遮罩，讓文字更清楚
        // 如果覺得太黑，可以把 0.7 改成 0.3
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/bg.png)',
        
        backgroundSize: 'cover',   // 讓圖片充滿螢幕
        backgroundPosition: 'center', // 圖片置中
        
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 10
      }}
    >
      <h1 style={{ color: 'white', fontSize: '4rem', marginBottom: '40px', fontFamily: 'Impact, sans-serif', letterSpacing: '5px' }}>
        DROP <span style={{color: '#0066cc'}}>COLOR</span>
      </h1>

      <div style={{ display: 'flex', gap: '30px' }}>
        {cars.map((car) => (
          <motion.button
            key={car.id}
            whileHover={{ scale: 1.1, borderColor: '#0066cc', boxShadow: '0 0 20px #0066cc' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectCar(car.id)}
            style={{
              width: '200px', height: '300px',
              background: 'linear-gradient(145deg, rgba(30,30,30,0.8), rgba(42,42,42,0.8))', // 卡片也改成半透明
              border: '2px solid #444', borderRadius: '15px',
              color: 'white', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transition: '0.3s',
              backdropFilter: 'blur(5px)' // 讓卡片背後有點模糊質感
            }}
          >
            <span style={{ fontSize: '80px', marginBottom: '20px' }}>{car.img}</span>
            <h3 style={{ fontSize: '24px', margin: 0 }}>{car.name}</h3>
            <p style={{ color: '#888', marginTop: '10px' }}>START CONFIG</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}