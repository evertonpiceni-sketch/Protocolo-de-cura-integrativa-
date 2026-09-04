const fs = require('fs');
const file = 'src/components/ArcanjoProtocolView.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `  Shield, Flame, Sparkles, CheckCircle2, Play, Square, Settings, ChevronRight, Activity, Beaker
} from 'lucide-react';`;
const replace1 = `  Shield, Flame, Sparkles, CheckCircle2, Play, Square, Settings, ChevronRight, Activity, Beaker, Flower2
} from 'lucide-react';`;

content = content.replace(target1, replace1);

const target2 = `                    <span>Dia {d}</span>
                    {isCompleted && <Sparkles size={12} className="text-emerald-400" />}`;
const replace2 = `                    {isCompleted ? <Flower2 size={16} className="text-emerald-400 animate-pulse" /> : <span>Dia {d}</span>}`;

content = content.replace(target2, replace2);
fs.writeFileSync(file, content);
