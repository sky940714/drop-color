import React, { useRef, useEffect } from 'react'
import { Stage, CameraControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

import { Model as BmwModel } from './Bmw'
import { Model as BikeModel } from './Yamaha_yzf-r3_2017'
import { Model as NewBikeModel } from './Motorcycle'

export const Experience = ({ vehicle, config, phase }) => {
  const cameraControlRef = useRef()

  useEffect(() => {
    if (!cameraControlRef.current) return

    if (phase === 'showroom') {
      // 1. 車庫模式：鏡頭拉遠，自動旋轉
      cameraControlRef.current.setLookAt(
        0, 2, 12, // 鏡頭位置 (遠處)
        0, 1, 0,  // 觀察目標 (中心)
        true      // 是否平滑過渡
      )
      cameraControlRef.current.rotate(Math.PI / 4, 0, true) // 稍微轉個角度
      
    } else if (phase === 'configurator') {
      // 2. 配置模式：閃電進場！(0.5秒內衝到面前)
      // setLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, enableTransition)
      
      // 先瞬間重置一下避免旋轉慣性
      cameraControlRef.current.reset(true)

      cameraControlRef.current.setLookAt(
        4, 1, 5,  // 鏡頭衝到這裡 (車子斜前方)
        0, 0, 0,  // 看向車子中心
        true      // 開啟過渡動畫
      )
    }
  }, [phase, vehicle]) // 當階段或車種改變時觸發

  return (
    <>
      {/* 這裡設定攝影棚燈光 */}
      <Stage environment="city" intensity={0.5} contactShadow={true}>
        {vehicle === 'bmw' && <BmwModel config={config} />}
        {vehicle === 'bike' && <BikeModel config={config} />}
        {vehicle === 'newBike' && <NewBikeModel config={config} />}
      </Stage>

      {/* 取代 OrbitControls，改用更強大的 CameraControls */}
      <CameraControls 
        ref={cameraControlRef} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2} 
        // 在車庫模式時稍微限制使用者不要亂動，配置模式時才給操作
        enabled={phase === 'configurator'}
        smoothTime={0.5} // 0.5秒的極速運鏡 (閃電感)
      />
    </>
  )
}