export const BRAND_DATA = {
  doya: [
    { name: '魔幻紫 (Magic Purple)', color: '#4b0082', metalness: 0.8, iridescence: 1 },
    { name: '極光綠 (Aurora Green)', color: '#006400', metalness: 0.9, iridescence: 0.5 },
    { name: '深海藍 (Deep Blue)', color: '#00008b', metalness: 0.7, iridescence: 0.8 },
    // ▼▼▼ 貼在這裡 ▼▼▼
    { 
      name: '杜雅 A-01 (Doya A-01)', 
      color: '#4b0082', 
      metalness: 1.0, 
      roughness: 0.15, 
      iridescence: 1.0, 
      iridescenceIOR: 2.3, 
      iridescenceThicknessRange: [160, 480] 
    },
    {
      name: '杜雅 A-02 (Doya A-02)',
      color: '#420000',      
      metalness: 1.0,         
      roughness: 0.1,         // 保持光滑
      iridescence: 1.0,
      iridescenceIOR: 2.2,    
      iridescenceThicknessRange: [300, 420] 
    },
  ],
  
  aika: [
    { name: '水泥灰 (Cement Grey)', color: '#5e5e5e', metalness: 0.1, iridescence: 0 },
    { name: '戰鬥綠 (Combat Green)', color: '#2f4f2f', metalness: 0.5, iridescence: 0 },
    { name: '法拉利紅 (Ferrari Red)', color: '#cc0000', metalness: 0.3, iridescence: 0 },
  ]
}