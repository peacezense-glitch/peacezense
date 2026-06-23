import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G, Path } from 'react-native-svg';
import { NatalChart as NatalChartData } from '@/types';
import { SIGN_COLORS } from '@/lib/astrology/signs';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const SIZE = 340;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 155;
const R_INNER = 115;
const R_PLANET = 95;

interface NatalChartProps {
  chart: NatalChartData;
}

function lonToXY(lon: number, ascLon: number, radius: number): { x: number; y: number } {
  const relative = ((lon - ascLon + 360) % 360);
  const angleRad = Math.PI - (relative * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(angleRad),
    y: CY - radius * Math.sin(angleRad),
  };
}

function arcPath(startLon: number, endLon: number, ascLon: number, r1: number, r2: number): string {
  const s1 = lonToXY(startLon, ascLon, r1);
  const e1 = lonToXY(endLon, ascLon, r1);
  const s2 = lonToXY(endLon, ascLon, r2);
  const e2 = lonToXY(startLon, ascLon, r2);
  const span = ((endLon - startLon + 360) % 360);
  const large = span > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r1} ${r1} 0 ${large} 0 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${r2} ${r2} 0 ${large} 1 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ');
}

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function NatalChartWheel({ chart }: NatalChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const ascLon = chart.ascendant.longitude;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Zodiac segments */}
        {Array.from({ length: 12 }, (_, i) => {
          const startLon = i * 30;
          const endLon = (i + 1) * 30;
          return (
            <Path
              key={i}
              d={arcPath(startLon, endLon, ascLon, R_INNER, R_OUTER)}
              fill={SIGN_COLORS[i] + '30'}
              stroke={colors.border}
              strokeWidth={0.5}
            />
          );
        })}

        {/* Outer circle */}
        <Circle cx={CX} cy={CY} r={R_OUTER} stroke={colors.primary} strokeWidth={2} fill="none" />
        <Circle cx={CX} cy={CY} r={R_INNER} stroke={colors.border} strokeWidth={1} fill="none" />

        {/* House lines */}
        {chart.houses.map((house) => {
          const pos = lonToXY(house.cuspLongitude, ascLon, R_OUTER);
          return (
            <Line
              key={house.number}
              x1={CX}
              y1={CY}
              x2={pos.x}
              y2={pos.y}
              stroke={colors.border}
              strokeWidth={0.8}
              opacity={0.5}
            />
          );
        })}

        {/* ASC / DSC / MC / IC axes */}
        {[
          { lon: chart.ascendant.longitude, label: 'ASC', color: colors.secondary },
          { lon: (chart.ascendant.longitude + 180) % 360, label: 'DSC', color: colors.border },
          { lon: chart.midheaven.longitude, label: 'MC', color: colors.accent },
          { lon: (chart.midheaven.longitude + 180) % 360, label: 'IC', color: colors.border },
        ].map(({ lon, label, color }) => {
          const pos = lonToXY(lon, ascLon, R_OUTER);
          const inner = lonToXY(lon, ascLon, R_INNER - 10);
          return (
            <G key={label}>
              <Line x1={inner.x} y1={inner.y} x2={pos.x} y2={pos.y} stroke={color} strokeWidth={label === 'ASC' || label === 'MC' ? 2 : 1} />
              <SvgText x={pos.x} y={pos.y - 6} fill={color} fontSize={10} fontWeight="bold" textAnchor="middle">
                {label}
              </SvgText>
            </G>
          );
        })}

        {/* Zodiac symbols */}
        {SIGN_SYMBOLS.map((sym, i) => {
          const midLon = i * 30 + 15;
          const pos = lonToXY(midLon, ascLon, (R_OUTER + R_INNER) / 2);
          return (
            <SvgText key={sym} x={pos.x} y={pos.y + 5} fill={SIGN_COLORS[i]} fontSize={16} textAnchor="middle">
              {sym}
            </SvgText>
          );
        })}

        {/* Planets */}
        {chart.planets.map((planet, i) => {
          const offset = (i - chart.planets.length / 2) * 3;
          const pos = lonToXY(planet.longitude + offset, ascLon, R_PLANET);
          return (
            <G key={planet.id}>
              <Circle cx={pos.x} cy={pos.y} r={10} fill={colors.primary} opacity={0.85} />
              <SvgText x={pos.x} y={pos.y + 4} fill="#fff" fontSize={11} textAnchor="middle">
                {planet.symbol}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
});
