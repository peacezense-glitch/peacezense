import { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useUserProfile } from '@/context/UserProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ChatMessage } from '@/types';
import { generateFortuneReply } from '@/lib/ai/fortuneChat';
import { useRouter } from 'expo-router';

const SUGGESTIONS = [
  '我今年事業運如何？',
  '我的感情運勢怎樣？',
  '適合投資理財嗎？',
  '我的性格特質是什麼？',
];

export default function ChatScreen() {
  const { profile } = useUserProfile();
  const { canAccess } = useSubscription();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: profile.name
        ? `${profile.name}，我是你的 PeaceZense 命理師。我已讀取你的八字命盤，可以為你解答事業、感情、財運、健康等問題。`
        : '你好，我是 PeaceZense 命理師。請先在「我的」設定出生資料，我才能結合你的命盤給出精準分析。',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const baziOptions = {
    longitude: profile.longitude,
    useTrueSolarTime: profile.useTrueSolarTime,
    birthPlace: profile.birthPlace,
  };

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      if (!canAccess('ai.chat')) {
        router.push('/subscribe' as never);
        return;
      }

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      try {
        const reply = await generateFortuneReply(
          text.trim(),
          profile.birthDate,
          profile.birthTime,
          profile.gender,
          profile.name,
          baziOptions,
        );
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: reply,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      }
    },
    [loading, profile, baziOptions, canAccess, router],
  );

  if (!canAccess('ai.chat')) {
    return (
      <View style={[styles.locked, { backgroundColor: colors.background }]}>
        <Text style={styles.lockIcon}>🔮</Text>
        <Text style={[styles.lockTitle, { color: colors.text }]}>AI 命理師</Text>
        <Text style={[styles.lockDesc, { color: colors.textSecondary }]}>
          升級會員，與智能命理師對話{'\n'}結合你的八字命盤深度解答
        </Text>
        <Pressable
          onPress={() => router.push('/subscribe' as never)}
          style={[styles.lockBtn, { backgroundColor: colors.secondary }]}
        >
          <Text style={styles.lockBtnText}>升級會員</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user'
                ? [styles.userBubble, { backgroundColor: colors.primary }]
                : [styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border }],
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                { color: item.role === 'user' ? '#fff' : colors.text },
              ]}
            >
              {item.content}
            </Text>
          </View>
        )}
        ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} style={{ margin: 12 }} /> : null}
      />

      <View style={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <Pressable
            key={s}
            onPress={() => send(s)}
            style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.chipText, { color: colors.accent }]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={input}
          onChangeText={setInput}
          placeholder="問問你的命理師..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
          onSubmitEditing={() => send(input)}
        />
        <Pressable
          onPress={() => send(input)}
          disabled={loading || !input.trim()}
          style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.4 }]}
        >
          <Text style={styles.sendText}>送出</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 16, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  chipText: { fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, gap: 8 },
  input: { flex: 1, fontSize: 16, maxHeight: 100, paddingVertical: 8 },
  sendBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: '700' },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  lockIcon: { fontSize: 48, marginBottom: 16 },
  lockTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  lockDesc: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  lockBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24 },
  lockBtnText: { color: '#1A1428', fontWeight: '700', fontSize: 16 },
});
