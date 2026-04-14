"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Mic, 
  Settings, 
  Users, 
  Activity, 
  AlertCircle,
  Play,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  ChevronDown,
  Clock,
  MessageSquare,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

type NodeType = "Standard" | "Decision" | "Success" | "Emergency";

interface NodeData {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  script?: string;
  time?: string;
  branches?: string[];
}

interface EdgeData {
  from: string;
  to: string;
  label?: string;
  type?: "Teal" | "Amber" | "Red";
}

// --- Sub-components ---

const IvrNode = ({ node, isSelected, onClick }: { node: NodeData, isSelected: boolean, onClick: () => void }) => {
  const isDecision = node.type === "Decision";
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="cursor-pointer group select-none"
    >
       {isDecision ? (
         <g transform={`translate(${node.x - 40}, ${node.y - 40})`}>
            {/* Diamond Shape */}
            <path 
              d="M 40 0 L 80 40 L 40 80 L 0 40 Z" 
              className={cn(
                "fill-white stroke-[1.5] transition-all duration-300",
                isSelected ? "stroke-primary shadow-glow shadow-primary/20" : "stroke-amber-400 group-hover:stroke-primary"
              )}
            />
            <foreignObject x="0" y="20" width="80" height="40">
               <div className="w-full h-full flex items-center justify-center p-2 text-center">
                  <span className="text-[10px] font-black text-sky-900 leading-[1.1] uppercase">{node.label}</span>
               </div>
            </foreignObject>
         </g>
       ) : (
         <rect 
           x={node.x - 110} y={node.y - 36} width="220" height="72" rx="12" 
           className={cn(
             "fill-white stroke-[1.5] transition-all duration-300",
             node.type === "Success" ? "fill-emerald-50 stroke-emerald-500" :
             node.type === "Emergency" ? "fill-red-50 stroke-red-600 outline outline-2 outline-offset-2 outline-red-600/30" :
             isSelected ? "stroke-primary shadow-glow shadow-primary/20" : "stroke-sky-200 group-hover:stroke-primary"
           )}
         />
       )}
       
       {!isDecision && (
         <foreignObject x={node.x - 100} y={node.y - 25} width="200" height="50">
            <div className="w-full h-full flex flex-col justify-center">
               <span className={cn(
                 "text-xs font-black uppercase tracking-tight",
                 node.type === "Emergency" ? "text-red-700" : "text-sky-900"
               )}>{node.label}</span>
               <div className="flex items-center gap-2 mt-1 opacity-50">
                  <Clock size={10} />
                  <span className="text-[9px] font-bold">{node.time || "0:12"}</span>
               </div>
            </div>
         </foreignObject>
       )}
    </motion.g>
  );
};

const IvrEdge = ({ from, to, label, type = "Teal" }: EdgeData & { from: NodeData, to: NodeData }) => {
  const color = type === "Teal" ? "#2DD4BF" : type === "Amber" ? "#F59E0B" : "#EF4444";
  const isDashed = type === "Amber";
  
  // Minimal orthogonal path logic
  const midY = from.y + (to.y - from.y) / 2;
  const path = `M ${from.x} ${from.y + 36} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y - 36}`;

  return (
    <g className="group">
       <path 
         d={path} 
         fill="none" 
         stroke={color} 
         strokeWidth="1.5" 
         strokeDasharray={isDashed ? "4 4" : "none"}
         className="transition-all duration-500 group-hover:stroke-primary group-hover:stroke-[2]"
       />
       {/* Arrowhead */}
       <path 
         d={`M ${to.x - 4} ${to.y - 42} L ${to.x} ${to.y - 36} L ${to.x + 4} ${to.y - 42}`}
         fill="none" stroke={color} strokeWidth="1.5"
       />
       {label && (
         <foreignObject x={(from.x + to.x)/2 - 30} y={midY - 10} width="60" height="20">
            <div className="bg-white px-2 py-0.5 rounded border border-sky-100 text-[8px] font-black text-slate-400 uppercase text-center">{label}</div>
         </foreignObject>
       )}
    </g>
  );
};

// --- Page Component ---

export default function IvrFlowPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLangsExpanded, setIsLangsExpanded] = useState(false);

  const nodes: NodeData[] = [
    { id: "entry", label: "Entry: Phone Pickup", type: "Standard", x: 600, y: 80, script: "Welcome to Sehat Sathi. Namaste.", time: "0:04" },
    { id: "lang", label: "Lang Select", type: "Decision", x: 600, y: 220, script: "For Hindi press 1. For Marathi press 2...", branches: ["1-9", "0"] },
    { id: "service", label: "Service Type", type: "Decision", x: 600, y: 400, x_offset: 0 },
    
    // New Consultation Path
    { id: "complaint", label: "Chief Complaint", type: "Standard", x: 300, y: 550, script: "Tell us what is bothering you.", time: "0:14" },
    { id: "duration", label: "Duration", type: "Standard", x: 300, y: 680, script: "How many days?", time: "0:10" },
    { id: "severity", label: "Severity (1-5)", type: "Standard", x: 300, y: 810, script: "Press a key between 1 and 5.", time: "0:08" },
    { id: "callback", label: "Callback Sched", type: "Standard", x: 300, y: 940, script: "Doctor will call you shortly.", time: "0:12" },
    { id: "success_sms", label: "SMS Confirmation", type: "Success", x: 300, y: 1070, script: "Confirmation sent.", time: "0:02" },

    // Med Reminder Path
    { id: "remind", label: "Remind Patient", type: "Standard", x: 600, y: 550, script: "Did you take Metformin?", time: "0:08" },
    { id: "log", label: "Log Adherence", type: "Success", x: 600, y: 680, script: "Acknowledged.", time: "0:04" },

    // Test Results Path
    { id: "results", label: "Read Results", type: "Standard", x: 900, y: 550, script: "Your HbA1c is 7.2.", time: "0:25" },
    { id: "confirm_res", label: "Understood?", type: "Decision", x: 900, y: 680, script: "Press 1 if understood." },

    // Emergency Path
    { id: "emergency", label: "HUMAN AGENT", type: "Emergency", x: 1000, y: 220, script: "Emergency connect.", time: "Live" },
  ];

  const edges: EdgeData[] = [
    { from: "entry", to: "lang", type: "Teal" },
    { from: "lang", to: "service", label: "Confirmed", type: "Teal" },
    { from: "lang", to: "emergency", label: "Dial 0", type: "Red" },
    { from: "service", to: "complaint", label: "Consult", type: "Teal" },
    { from: "service", to: "remind", label: "Remind", type: "Teal" },
    { from: "service", to: "results", label: "Results", type: "Teal" },
    { from: "complaint", to: "duration", type: "Teal" },
    { from: "duration", to: "severity", type: "Teal" },
    { from: "severity", to: "callback", type: "Teal" },
    { from: "callback", to: "success_sms", type: "Teal" },
    { from: "remind", to: "log", label: "Press 1", type: "Teal" },
    { from: "results", to: "confirm_res", type: "Teal" },
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="h-screen bg-[#F8FBFC] font-inter flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[300px] border-r border-sky-100 bg-white flex flex-col shrink-0">
         <div className="p-8 border-b border-sky-50">
            <h1 className="text-xl font-black text-sky-900 leading-none mb-1">IVR Workflow</h1>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-1.5 py-0.5 rounded">Intake Automation</span>
         </div>
         
         <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Statistics</h4>
               {[
                 { l: "IVR Traffic", v: "18%", c: "bg-primary" },
                 { l: "Completion Rate", v: "84%", c: "bg-emerald-500" },
                 { l: "Emergency Triggers", v: "0.3%", c: "bg-red-500" },
                 { l: "Avg Duration", v: "4:12m", c: "bg-amber-500" },
               ].map(stat => (
                 <div key={stat.l} className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.l}</span>
                    <div className="flex justify-between items-end mt-1">
                       <span className="text-lg font-black text-sky-900">{stat.v}</span>
                       <div className={cn("w-1 h-8 rounded-full opacity-20", stat.c)} />
                    </div>
                 </div>
               ))}
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Language Stats</h4>
               <div className="space-y-3">
                  {["Hindi", "Marathi", "English"].map(l => (
                    <div key={l} className="space-y-1">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span>{l}</span>
                          <span>{l === "Hindi" ? "82%" : "12%"}</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: l === "Hindi" ? "82%" : "12%" }} className="h-full bg-primary" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </aside>

      {/* CANVAS AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
         {/* CANVAS HEADER */}
         <div className="h-20 bg-white/80 backdrop-blur-md border-b border-sky-100 flex items-center justify-between px-10 relative z-20">
            <div>
               <h2 className="text-lg font-black text-sky-900 leading-none">IVR Call Flow Blueprint</h2>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Standard Intake • Feature Phone Optimization</p>
            </div>
            <div className="flex gap-4">
               <button className="h-10 px-6 border-2 border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-sky-50 transition-all flex items-center gap-2">
                  <RotateCcw size={14} /> Reset View
               </button>
               <button className="h-10 px-6 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2">
                  <Play size={14} /> Test Simulation
               </button>
            </div>
         </div>

         {/* SVG CANVAS */}
         <div 
           className="flex-1 overflow-auto bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] bg-[size:32px_32px] bg-sky-50 relative p-20 cursor-grab active:cursor-grabbing"
           onClick={() => setSelectedNodeId(null)}
         >
            <svg width="1400" height="1200" className="relative z-10">
               <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                     <feGaussianBlur stdDeviation="4" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
               </defs>

               {/* Edges */}
               {edges.map((e, idx) => (
                 <IvrEdge 
                   key={idx} 
                   from={nodes.find(n => n.id === e.from)!} 
                   to={nodes.find(n => n.id === e.to)!} 
                   label={e.label} 
                   type={e.type} 
                 />
               ))}

               {/* Emergency Sticky Connectors */}
               {nodes.filter(n => n.id !== "emergency").map(n => (
                 <path 
                   key={`emer-${n.id}`}
                   d={`M ${n.x + 110} ${n.y} L 1000 ${n.y} L 1000 184`}
                   fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 4" opacity="0.1"
                 />
               ))}

               {/* Nodes */}
               {nodes.map(n => (
                 <IvrNode 
                   key={n.id} 
                   node={n} 
                   isSelected={selectedNodeId === n.id} 
                   onClick={() => setSelectedNodeId(n.id)} 
                 />
               ))}
            </svg>

            {/* NODE DETAIL OVERLAY (TOOLTIP STYLE) */}
            <AnimatePresence>
               {selectedNode && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95, x: 20 }}
                   animate={{ opacity: 1, scale: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.95, x: 20 }}
                   className="absolute bg-white border border-sky-100 shadow-2xl rounded-[32px] p-8 w-[360px] z-[100]"
                   style={{ 
                     left: selectedNode.x + 140, 
                     top: selectedNode.y - 120 
                   }}
                   onClick={(e) => e.stopPropagation()}
                 >
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Node Configuration</span>
                       <button onClick={() => setSelectedNodeId(null)} className="p-1.5 hover:bg-slate-50 rounded-lg"><Minus size={14} /></button>
                    </div>
                    <h3 className="text-xl font-black text-sky-900 tracking-tight mb-6">{selectedNode.label}</h3>
                    
                    <div className="space-y-6">
                       <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Voice Script (Multi-lingual)</label>
                          <textarea 
                            readOnly
                            value={selectedNode.script}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-600 leading-relaxed outline-none min-h-[100px]"
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                             <div className="flex items-center gap-2 mb-1">
                                <Clock size={12} className="text-primary" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Avg Time</span>
                             </div>
                             <span className="text-sm font-black text-sky-900">{selectedNode.time || "N/A"}</span>
                          </div>
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                             <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Efficiency</span>
                             </div>
                             <span className="text-sm font-black text-emerald-600">92%</span>
                          </div>
                       </div>

                       <button className="w-full h-12 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                          <Play size={16} fill="white" /> Play Audio Preview
                       </button>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .shadow-glow { filter: url(#glow); }
        circle, rect, path { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
}
