import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '@/components/Themed';
import { useUserProfile } from '@/context/UserProfileContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const { profile, updateProfile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const birthDateObj = new Date(profile.birthDate);
  const [hour, minute] = profile.birthTime.split(':').map(Number);
  const birthTimeObj = new Date(2000, 0, 1, hour, minute);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${min}`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        出生資料是所有命理推算的基礎。請盡可能準確填寫，以獲得最佳解讀。
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>姓名</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={profile.name}
          onChangeText={(name) => updateProfile({ name })}
          placeholder="你的名字"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>出生日期</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, styles.pickerButton, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>{profile.birthDate}</Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={birthDateObj}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) updateProfile({ birthDate: formatDate(date) });
            }}
          />
        )}

        <Text style={[styles.label, { color: colors.textSecondary }]}>出生時間</Text>
        <Pressable
          onPress={() => setShowTimePicker(true)}
          style={[styles.input, styles.pickerButton, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>{profile.birthTime}</Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={birthTimeObj}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour
            onChange={(_, date) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (date) updateProfile({ birthTime: formatTime(date) });
            }}
          />
        )}

        <Text style={[styles.label, { color: colors.textSecondary }]}>出生地點</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={profile.birthPlace}
          onChangeText={(birthPlace) => updateProfile({ birthPlace })}
          placeholder="城市名稱"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>性別</Text>
        <View style={styles.genderRow}>
          {(['male', 'female', 'other'] as const).map((g) => (
            <Pressable
              key={g}
              onPress={() => updateProfile({ gender: g })}
              style={[
                styles.genderButton,
                {
                  backgroundColor: profile.gender === g ? colors.primary : colors.backgroundSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: profile.gender === g ? '#fff' : colors.text,
                  fontWeight: profile.gender === g ? '700' : '400',
                }}
              >
                {g === 'male' ? '男' : g === 'female' ? '女' : '其他'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={[styles.note, { color: colors.textSecondary }]}>
        資料僅儲存於本機裝置，不會上傳至任何伺服器。
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  pickerButton: {
    justifyContent: 'center',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
