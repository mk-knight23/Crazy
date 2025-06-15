import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Cpu, 
  Activity, 
  Radio, 
  Shield, 
  Target, 
  Hexagon,
  Triangle,
  Circle,
  Square,
  ArrowUp,
  ArrowDown,
  Wifi,
  Battery,
  Eye
} from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  opacity: number;
}

const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: ['#00ff88', '#0088ff', '#ff0088', '#ffaa00'][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    setParticles(newParticles);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      newParticles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      // Draw connections
      newParticles.forEach((particle, i) => {
        newParticles.slice(i + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = '#00ff88';
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      width={1920}
      height={1080}
    />
  );
};

const HolographicPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`
    relative backdrop-blur-md bg-gradient-to-br from-cyan-900/20 to-purple-900/20 
    border border-cyan-400/30 rounded-xl p-6 
    shadow-2xl shadow-cyan-500/20
    hover:shadow-cyan-500/40 hover:border-cyan-400/60
    transition-all duration-500 ease-out
    transform hover:scale-105 hover:-translate-y-2
    ${className}
  `}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent 
                    rounded-xl animate-pulse" />
    {children}
  </div>
);

const DataVisualization: React.FC = () => {
  const [data, setData] = useState([65, 78, 90, 45, 88, 76, 92, 55]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(() => Math.random() * 100));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-between h-32 space-x-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-md relative overflow-hidden
                     transition-all duration-1000 ease-out min-w-[8px]"
          style={{ height: `${value}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

const QuantumOrb: React.FC<{ size?: string; color?: string }> = ({ 
  size = "w-16 h-16", 
  color = "from-cyan-400 to-purple-600" 
}) => (
  <div className={`${size} relative`}>
    <div className={`w-full h-full rounded-full bg-gradient-to-r ${color} 
                     animate-spin shadow-lg shadow-cyan-500/50`} 
         style={{ animationDuration: '3s' }}>
      <div className="absolute inset-2 rounded-full bg-black/50 backdrop-blur-sm" />
      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
    </div>
  </div>
);

const StatusIndicator: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  status: 'active' | 'warning' | 'critical' 
}> = ({ icon, label, value, status }) => {
  const statusColors = {
    active: 'text-green-400 border-green-400/50',
    warning: 'text-yellow-400 border-yellow-400/50', 
    critical: 'text-red-400 border-red-400/50'
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border ${statusColors[status]} 
                     bg-black/20 backdrop-blur-sm hover:bg-white/5 transition-all duration-300`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className={`text-lg font-bold ${statusColors[status].split(' ')[0]}`}>{value}</p>
      </div>
    </div>
  );
};

function App() {
  const [time, setTime] = useState(new Date());
  const [activePanel, setActivePanel] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 
                    text-white overflow-hidden relative">
      
      {/* Particle Field Background */}
      <div className="absolute inset-0 opacity-30">
        <ParticleField />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <QuantumOrb size="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 
                           bg-clip-text text-transparent">
                QUANTUM CONTROL CENTER
              </h1>
              <p className="text-cyan-300/70">Neural Interface v2.7.3</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-white/60">System Time</p>
              <p className="text-xl font-mono text-cyan-400">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="text-green-400" size={20} />
              <Battery className="text-green-400" size={20} />
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* System Status */}
            <HolographicPanel>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cyan-400">System Status</h3>
                <Shield className="text-green-400" size={24} />
              </div>
              <div className="space-y-3">
                <StatusIndicator 
                  icon={<Cpu size={20} />}
                  label="CPU Core"
                  value="78%"
                  status="active"
                />
                <StatusIndicator
                  icon={<Activity size={20} />}
                  label="Neural Link"
                  value="ACTIVE"
                  status="active"
                />
                <StatusIndicator
                  icon={<Radio size={20} />}
                  label="Quantum Field"
                  value="STABLE"
                  status="warning"
                />
              </div>
            </HolographicPanel>

            {/* Data Streams */}
            <HolographicPanel>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-purple-400">Data Streams</h3>
                <Target className="text-purple-400" size={24} />
              </div>
              <DataVisualization />
              <div className="mt-4 flex justify-between text-sm text-white/60">
                <span>Throughput</span>
                <span className="text-cyan-400">847.2 GB/s</span>
              </div>
            </HolographicPanel>
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            
            {/* Main Control */}
            <HolographicPanel className="text-center">
              <div className="flex justify-center mb-6">
                <QuantumOrb size="w-24 h-24" color="from-cyan-400 via-purple-500 to-pink-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 
                           bg-clip-text text-transparent">
                QUANTUM CORE
              </h3>
              <p className="text-white/70 mb-4">Primary Control Interface</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ArrowUp, label: 'Boost', color: 'text-green-400' },
                  { icon: ArrowDown, label: 'Dampen', color: 'text-red-400' },
                  { icon: Zap, label: 'Pulse', color: 'text-yellow-400' },
                  { icon: Eye, label: 'Scan', color: 'text-blue-400' }
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    onMouseEnter={() => setActivePanel(label)}
                    onMouseLeave={() => setActivePanel(null)}
                    className={`p-3 rounded-lg border border-white/20 backdrop-blur-sm
                               hover:border-cyan-400/60 hover:bg-white/5 transition-all duration-300
                               transform hover:scale-105 ${activePanel === label ? 'scale-105 bg-white/5' : ''}`}
                  >
                    <Icon className={`${color} mx-auto mb-1`} size={20} />
                    <span className="text-xs text-white/80">{label}</span>
                  </button>
                ))}
              </div>
            </HolographicPanel>

            {/* Geometric Patterns */}
            <HolographicPanel>
              <div className="flex items-center justify-center space-x-8">
                {[Hexagon, Triangle, Circle, Square].map((Icon, index) => (
                  <div key={index} className="relative">
                    <Icon 
                      className="text-cyan-400 hover:text-purple-400 transition-colors duration-500
                               transform hover:rotate-180 hover:scale-110 cursor-pointer"
                      size={32}
                      style={{ transitionDuration: '1s' }}
                    />
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 
                                  rounded-full blur-lg opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}
              </div>
            </HolographicPanel>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Network Topology */}
            <HolographicPanel>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-green-400">Network Topology</h3>
                <Radio className="text-green-400" size={24} />
              </div>
              <div className="relative h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 
                                animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/50" />
                  </div>
                </div>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-ping"
                    style={{
                      top: `${20 + Math.sin((i * Math.PI) / 3) * 30}%`,
                      left: `${50 + Math.cos((i * Math.PI) / 3) * 35}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-white/60">Nodes Active</span>
                <span className="text-green-400 font-mono">127</span>
              </div>
            </HolographicPanel>

            {/* Quantum Metrics */}
            <HolographicPanel>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-pink-400">Quantum Metrics</h3>
                <Hexagon className="text-pink-400" size={24} />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Coherence', value: '94.7%', color: 'bg-green-500' },
                  { label: 'Entanglement', value: '78.2%', color: 'bg-blue-500' },
                  { label: 'Superposition', value: '85.9%', color: 'bg-purple-500' }
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white/70">{label}</span>
                      <span className="text-sm text-white/90">{value}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${color} transition-all duration-1000`}
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </HolographicPanel>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <HolographicPanel className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/70">System Operational</span>
            </div>
            <div className="text-sm text-white/60">
              Uptime: <span className="text-cyan-400 font-mono">47d 12h 34m</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-white/60">
              Power Draw: <span className="text-yellow-400 font-mono">12.7 TW</span>
            </div>
            <div className="text-sm text-white/60">
              Efficiency: <span className="text-green-400 font-mono">99.8%</span>
            </div>
          </div>
        </HolographicPanel>
      </div>
    </div>
  );
}

export default App;
