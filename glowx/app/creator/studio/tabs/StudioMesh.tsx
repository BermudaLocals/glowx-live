'use client'
import { MeshGenerator } from '@/components/three/MeshGenerator'

export function StudioMesh() {
  return (
    <MeshGenerator
      onAttach={(config) => {
        console.log('Mesh attached to post draft:', config)
        // In production: save config to draft post state / call API
      }}
    />
  )
}
