import { useState } from 'react';
import { StyleSheet, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Themed';
import PremiumGate from '@/components/PremiumGate';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import {
  DATE_EVENT_TYPES,
  findAuspiciousDates,
  getDateSelectionSummary,
  AuspiciousDate,
} from '@/lib/bazi/dateSelection';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

import { RATING_COLORS } from '@/constants/Theme';

export default function BaziDateScreen() {
  const { profile } = useUserProfile();
  const { canAccess } = useSubscription();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [eventId, setEventId] = useState('wedding');
  const [results, setResults] = useState<AuspiciousDate[] | null>(null);
  const [searching, setSearching] = useState(false);

  const baziOptions = {
    longitude: profile.longitude,
    useTrueSolarTime: profile.useTrueSolarTime,
    birthPlace: profile.birthPlace,
  };

  const isPremium = canAccess('bazi.dateSelection');
  const searchDays = isPremium ? 90 : 30;
  const resultLimit = isPremium ? 15 : 5;

  const handleSearch = () => {
    setSearching(true);
    const today = new Date();
    const start = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const dates = findAuspiciousDates(
      profile.birthDate,
      profile.birthTime,
      profile.gender,
      eventId,
      start,
      searchDays,
      baziOptions,
      resultLimit,
    );
    setResults(dates);
    setSearching(false);
  };

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        八字擇日 · 依命盤喜忌挑選良辰吉日
      </Text>

      <InfoCard title="選擇事件類型">
        <View style={styles.eventGrid}>
          {DATE_EVENT_TYPES.map((event) => {
            const locked = !isPremium && event.id !== 'wedding' && event.id !== 'moving';
            return (
              <Pressable
                key={event.id}
                onPress={() => !locked && setEventId(event.id)}
                style={[
                  styles.eventChip,
                  {
                    backgroundColor: eventId === event.id ? colors.primary : colors.backgroundSecondary,
                    borderColor: eventId === event.id ? colors.primary : colors.border,
                    opacity: locked ? 0.45 : 1,
                  },
                ]}
              >
                <Text style={{ color: eventId === event.id ? '#fff' : colors.text, fontSize: 13, fontWeight: '600' }}>
                  {event.name}{locked ? ' 🔒' : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.eventDesc, { color: colors.textSecondary }]}>
          {DATE_EVENT_TYPES.find((e) => e.id === eventId)?.description}
        </Text>
      </InfoCard>

      <Pressable
        onPress={handleSearch}
        disabled={searching}
        style={[styles.searchBtn, { backgroundColor: colors.primary, opacity: searching ? 0.7 : 1 }]}
      >
        <Text style={styles.searchBtnText}>
          {searching ? '推算中...' : `開始擇日（未來 ${searchDays} 天）`}
        </Text>
      </Pressable>

      {!isPremium && (
        <Text style={[styles.freeNote, { color: colors.accent }]}>
          免費版：結婚、搬家擇日，顯示前 5 名吉日。升級解鎖全部 8 種事件與 90 天搜尋。
        </Text>
      )}

      {results && results.length === 0 && (
        <InfoCard title="結果">
          <Text style={{ color: colors.textSecondary }}>此範圍內未找到吉日，請擴大搜尋範圍或調整事件類型。</Text>
        </InfoCard>
      )}

      {results && results.length > 0 && (
        <>
          <InfoCard title="擇日摘要">
            <Text style={[styles.summary, { color: colors.text }]}>
              {getDateSelectionSummary(eventId, results[0])}
            </Text>
          </InfoCard>

          {results.map((item, index) => (
            <InfoCard key={item.date} title={`#${index + 1}  ${item.date}  ${item.ganZhi}日`}>
              <View style={styles.ratingRow}>
                <Text style={[styles.rating, { color: RATING_COLORS[item.rating] }]}>
                  {item.rating}
                </Text>
                <Text style={[styles.score, { color: colors.textSecondary }]}>
                  {item.score} 分
                </Text>
              </View>
              <InfoRow label="農曆" value={item.lunarDate} />
              {item.reasons.map((r) => (
                <Text key={r} style={[styles.reason, { color: colors.textSecondary }]}>· {r}</Text>
              ))}
            </InfoCard>
          ))}
        </>
      )}

      <PremiumGate feature="bazi.dateSelection">
        <InfoCard title="進階擇日（會員）">
          <InfoRow label="搜尋範圍" value="90 天" />
          <InfoRow label="事件類型" value="全部 8 種" />
          <InfoRow label="結果數量" value="前 15 名吉日" />
          <InfoRow label="分析" value="結合大運流年交叉驗證" />
        </InfoCard>
      </PremiumGate>
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  eventGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  eventChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  eventDesc: { fontSize: 13, marginTop: 12, lineHeight: 20 },
  searchBtn: { padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  freeNote: { fontSize: 12, textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  summary: { fontSize: 15, lineHeight: 24 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  rating: { fontSize: 20, fontWeight: '800' },
  score: { fontSize: 14 },
  reason: { fontSize: 13, lineHeight: 20, marginTop: 4 },
});
