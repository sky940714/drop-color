// src/components/Bmw.jsx

import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export function Model({ config, ...props }) {
  const { scene } = useGLTF('/2025_bmw_m4_competition.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)

  // 材質設定 (維持之前修正過的，確保有 iridescenceIOR)
  const CarPaintMaterial = (
    <meshPhysicalMaterial 
      color={config?.color || "#0066cc"} 
      metalness={config?.metalness ?? 0.4}
      roughness={config?.roughness ?? 0.2}
      clearcoat={config?.clearcoat ?? 1.0}
      clearcoatRoughness={config?.clearcoatRoughness ?? 0.1}
      iridescence={config?.iridescence ?? 0}
      iridescenceIOR={config?.iridescenceIOR ?? 1.5}
      iridescenceThicknessRange={config?.iridescenceThicknessRange ?? [100, 400]}
      envMapIntensity={0.5}
    />
  )

  return (
    <group {...props} dispose={null}>
      {/* ▼▼▼ 關鍵修改：將 scale={0.01} 改為 scale={1} ▼▼▼ */}
      {/* 如果存檔後發現車子變得超級巨大，再改回 0.01 或 0.1 */}
      <group scale={1}> 
        <primitive object={nodes._rootJoint} />
        {/* ... 下面的 meshes 維持不變 ... */}
        <group position={[0, 0.396, 0.068]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <mesh geometry={nodes.m4right_door_Mesh_3_car_interior_m4car_interior1_0.geometry} material={materials.m4car_interior1} />
          <mesh geometry={nodes.m4right_door_Mesh_3_car_interior_m4car_plast1_0.geometry} material={materials.m4car_plast1} />
          <mesh geometry={nodes.m4right_door_Mesh_3_car_interior_m4car_body1_0.geometry}>{CarPaintMaterial}</mesh>
          <mesh geometry={nodes.m4left_door_Mesh_2_car_body_m4car_body1_0.geometry}>{CarPaintMaterial}</mesh>
          <mesh geometry={nodes.m4left_door_Mesh_2_car_body_m4car_glass1_0.geometry} material={materials.m4car_glass1} />
          <mesh geometry={nodes.m4left_door_Mesh_2_car_body_m4car_plast1_0.geometry} material={materials.m4car_plast1} />
          <mesh geometry={nodes.m4left_door_Mesh_2_car_body_m4car_interior1_0.geometry} material={materials.m4car_interior1} />
          <mesh geometry={nodes.m4window_Mesh_4_car_glass_m4car_glass1_0.geometry} material={materials.m4car_glass1} />
          <mesh geometry={nodes.m4bodykit_Mesh_1_car_bodykit_m4car_bodykit1_0.geometry}>{CarPaintMaterial}</mesh>
          <mesh geometry={nodes.m4bodykit_Mesh_1_car_bodykit_m4car_body1_0.geometry}>{CarPaintMaterial}</mesh>
          <mesh geometry={nodes.m4bodykit_Mesh_1_car_bodykit_m4car_bodykit_plast1_0.geometry} material={materials.m4car_bodykit_plast1} />
          <mesh geometry={nodes.m4bodykit_Mesh_1_car_bodykit_m4car_plast1_0.geometry} material={materials.m4car_plast1} />
          <mesh geometry={nodes.m4bodykit_Mesh_1_car_bodykit_m4car_grill1_0.geometry} material={materials.m4car_grill1} />
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_body1_0.geometry}>{CarPaintMaterial}</mesh>
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_glass1_0.geometry} material={materials.m4car_glass1} />
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_hood1_0.geometry}>{CarPaintMaterial}</mesh>
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_plast1_0.geometry} material={materials.m4car_plast1} />
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_interior1_0.geometry} material={materials.m4car_interior1} />
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_spoiler1_0.geometry} material={materials.m4car_spoiler1} />
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_grill1_0.geometry} material={materials.m4car_grill1} />
          <mesh geometry={nodes.m4body_Mesh_0_car_body_m4car_emissive1_0.geometry} material={materials.m4car_emissive1} />
        </group>
        <group position={[0, -0.224, 2.477]}>
          <mesh geometry={nodes.brake_pad_front_metal_Capiler_0.geometry} material={materials.metal_Capiler} />
          <mesh geometry={nodes.brake_pad_front_red_caliper_0.geometry} material={materials.red_caliper} />
          <mesh geometry={nodes.brake_pad_front_phong11_0.geometry} material={materials.phong11} />
          <mesh geometry={nodes.brake_pad_front_phong23_0.geometry} material={materials.phong23} />
        </group>
      </group>
    </group>
  )
}
// ...