import ReactECharts from 'echarts-for-react';
import { THEME_ECHARTS_COLORS } from '../../constants/themes';
import { useTheme } from '../../hooks/useTheme';
import type { MoodTrendPoint } from '../../types';
import { displayDate } from '../../utils/dateRange';

interface Props {
  data: MoodTrendPoint[];
}

export function MoodTrendChart({ data }: Props) {
  const { themeName } = useTheme();
  const colors = THEME_ECHARTS_COLORS[themeName];

  const option = {
    color: colors,
    tooltip: { trigger: 'axis' },
    grid: { left: 28, right: 18, top: 30, bottom: 28 },
    xAxis: {
      type: 'category',
      data: data.map((item) => displayDate(item.date)),
      axisLine: { lineStyle: { color: 'var(--border)' } },
      axisLabel: { color: 'var(--muted)' },
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 10,
      splitLine: { lineStyle: { color: 'rgba(120,120,120,.16)' } },
      axisLabel: { color: 'var(--muted)' },
    },
    series: [
      {
        name: '情绪等级',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.18 },
        symbolSize: 9,
        data: data.map((item) => item.mood_level),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
}

