import { HumanDesignProfile } from '@/types';

const TYPES = [
  { type: '生產者', description: '擁有持續的薦骨能量，透過回應來做決定', strategy: '等待回應', authority: '薦骨權威' },
  { type: '投射者', description: '天生的引導者，擅長看見並管理他人能量', strategy: '等待邀請', authority: '情緒權威' },
  { type: '顯示者', description: '具備啟動能量的能力，是行動的發起者', strategy: '告知', authority: '情緒權威' },
  { type: '反映者', description: '獨特的月亮週期決策者，反映環境健康度', strategy: '等待月亮週期', authority: '月亮權威' },
  { type: '顯示生產者', description: '結合顯示者與生產者特質，多工處理能力強', strategy: '等待回應後告知', authority: '薦骨權威' },
];

const PROFILES = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
const CENTERS = ['頭', 'Ajna', '喉嚨', 'G中心', '心臟', '薦骨', '情緒', '脾', '根部'];

export function calculateHumanDesign(birthDate: string, birthTime: string): HumanDesignProfile {
  const date = new Date(`${birthDate}T${birthTime}`);
  const seed = date.getTime();
  const typeIndex = Math.abs(seed) % TYPES.length;
  const profileIndex = Math.abs(Math.floor(seed / 1000)) % PROFILES.length;

  const definedCount = 3 + (Math.abs(seed) % 4);
  const shuffled = [...CENTERS].sort(() => ((seed % 3) - 1));
  const definedCenters = shuffled.slice(0, definedCount);
  const undefinedCenters = shuffled.slice(definedCount);

  const typeInfo = TYPES[typeIndex];
  return {
    type: typeInfo.type,
    typeDescription: typeInfo.description,
    strategy: typeInfo.strategy,
    authority: typeInfo.authority,
    profile: PROFILES[profileIndex],
    definedCenters,
    undefinedCenters,
  };
}

export function getHumanDesignGuidance(profile: HumanDesignProfile): string {
  return `作為${profile.type}，你的策略是「${profile.strategy}」，內在權威為「${profile.authority}」。${profile.typeDescription}。活出你的設計，而非頭腦的期待。`;
}
