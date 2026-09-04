const fs = require('fs');
const file = 'src/components/ArchangelMichaelPrayerModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `  Shield, Flame, Volume2, VolumeX, Play, Pause, RotateCcw,
  CheckCircle2, X, Sparkles, Copy, Check, Calendar, Sun, Moon
} from 'lucide-react';`;
const replace1 = `  Shield, Flame, Volume2, VolumeX, Play, Pause, RotateCcw,
  CheckCircle2, X, Sparkles, Copy, Check, Calendar, Sun, Moon, Flower2
} from 'lucide-react';`;

content = content.replace(target1, replace1);

const target2 = `                <div
                  key={day}
                  className={\`h-6 rounded-md flex items-center justify-center text-[10px] font-mono transition \${
                    isDone
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }\`}
                  title={\`Dia \${day} \${isDone ? '(Concluído)' : '(Pendente)'}\`}
                >
                  {day}
                </div>`;
const replace2 = `                <div
                  key={day}
                  className={\`h-6 rounded-md flex items-center justify-center text-[10px] font-mono transition \${
                    isDone
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-400'
                  }\`}
                  title={\`Dia \${day} \${isDone ? '(Concluído)' : '(Pendente)'}\`}
                >
                  {isDone ? <Flower2 size={12} className="text-white drop-shadow-sm animate-pulse" /> : <Flower2 size={12} className="opacity-30" />}
                </div>`;
                
content = content.replace(target2, replace2);
fs.writeFileSync(file, content);
