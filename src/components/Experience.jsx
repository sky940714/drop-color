// src/components/Experience.jsx

import React, { useRef, useEffect } from 'react'
import { CameraControls, Environment, ContactShadows } from '@react-three/drei' // 引入 Environment 和 ContactShadows

import { Model as BmwModel } from './Bmw'
import { Model as BikeModel } from './Yamaha_yzf-r3_2017'
import { Model as NewBikeModel } from './Motorcycle'

export const Experience = ({ vehicle, config, phase }) => {
  const cameraControlRef = useRef()

  useEffect(() => {
    if (!cameraControlRef.current) return

    if (phase === 'showroom') {
      // 1. 車庫模式
      cameraControlRef.current.setLookAt(
        0, 2, 12, 
        0, 1, 0,  
        true      
      )
      // 稍微重置角度，避免繼承怪異的旋轉
      cameraControlRef.current.rotate(Math.PI / 4, 0, true) 
      
    } else if (phase === 'configurator') {
      // 2. 配置模式
      cameraControlRef.current.reset(true)
      cameraControlRef.current.setLookAt(
        4, 1, 5,  
        0, 0, 0,  
        true      
      )
    }
  }, [phase, vehicle]) 

  return (
    <>
      {/* ▼▼▼ 1. 移除 <Stage>，改用手動環境設定 ▼▼▼ */}
      
      {/* 環境光與貼圖 */}
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      
      {/* 地板陰影 (讓車子看起來有落地感) */}
      <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={10} blur={2} far={1} />

      {/* ▼▼▼ 2. 直接渲染車輛 (不包在 Stage 裡) ▼▼▼ */}
      <group position={[0, 0, 0]}>
        {vehicle === 'bmw' && <BmwModel config={config} />}
        {vehicle === 'bike' && <BikeModel config={config} />}
        {vehicle === 'newBike' && <NewBikeModel config={config} />}
      </group>

      {/* 鏡頭控制器 */}
      <CameraControls 
        ref={cameraControlRef} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2} 
        enabled={phase === 'configurator'}
        smoothTime={0.5}
      />
    </>
  )
}