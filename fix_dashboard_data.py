import re

with open('src/components/DashboardCura.tsx', 'r') as f:
    content = f.read()

# Make it accept progress
if 'progress' not in content:
    content = content.replace(
        "export default function DashboardCura({ onClose }: { onClose: () => void }) {",
        "import { DayProgress } from '../types';\n\nexport default function DashboardCura({ onClose, progress }: { onClose: () => void, progress: DayProgress[] }) {"
    )
    
    # Process the real progress data
    data_processing = """
  const realData = useMemo(() => {
    // Generate 21 days array
    const data: DayData[] = [];
    for (let i = 1; i <= 21; i++) {
      const dayProg = progress.find(d => d.dayNumber === i);
      const humorVal = dayProg ? (dayProg.mood || 0) * 2 : 0; // Convert 1-5 scale to 1-10
      const consistenciaVal = dayProg?.completed ? 100 : 0;
      
      data.push({
        dia: `Dia ${i}`,
        dayNum: i,
        humor: humorVal,
        consistencia: consistenciaVal,
        praticaFeita: !!dayProg?.completed,
        nota: dayProg?.journalText || (dayProg?.completed ? 'Prática finalizada' : 'Pendente')
      });
    }
    
    // Calculate cumulative consistency
    let completedCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].praticaFeita) completedCount++;
      data[i].consistencia = Math.round((completedCount / (i + 1)) * 100);
    }
    
    return data;
  }, [progress]);

  const filteredData = useMemo(() => {
    if (rangeFilter === '7') return realData.slice(14, 21);
    if (rangeFilter === '14') return realData.slice(7, 21);
    return realData;
  }, [rangeFilter, realData]);
"""
    
    content = re.sub(
        r"const filteredData = useMemo\(\(\) => \{[\s\S]*?\}, \[rangeFilter\]\);",
        data_processing,
        content
    )
    
    with open('src/components/DashboardCura.tsx', 'w') as f:
        f.write(content)
