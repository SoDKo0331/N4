"use client";
import React, { useState } from 'react';
import { ChevronDown, TrendingUp, TrendingDown, Target, Shield, BookOpen, CheckCircle2, AlertTriangle, Eye, CheckSquare, Square } from 'lucide-react';

const TradingChecklistFlowchart = () => {
  const [checkedSteps, setCheckedSteps] = useState<Record<string | number, boolean>>({});
  
  // Define step dependencies
  const stepDependencies = {
    'structure': ['htf'],
    'entry-zone': ['htf', 'structure'],
    'entry': ['htf', 'structure', 'entry-zone'],
    'risk': ['htf', 'structure', 'entry-zone', 'entry'],
    'analysis': ['htf', 'structure', 'entry-zone', 'entry', 'risk'],
    'improvement': ['htf', 'structure', 'entry-zone', 'entry', 'risk', 'analysis']
  };
  
  const toggleCheck = (stepId: string | number) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const checkAllDependencies = () => {
    const allSteps = ['htf', 'structure', 'entry-zone', 'entry', 'risk', 'analysis', 'improvement'];
    const newCheckedSteps: Record<string | number, boolean> = {};
    
    allSteps.forEach(step => {
      newCheckedSteps[step] = true;
    });
    
    setCheckedSteps(newCheckedSteps);
  };

  const uncheckAll = () => {
    setCheckedSteps({});
  };

  const isStepEnabled = (stepId: string) => {
    const dependencies = stepDependencies[stepId as keyof typeof stepDependencies];
    if (!dependencies) return true; // No dependencies means always enabled
    
    return dependencies.every(dep => checkedSteps[dep]);
  };

  interface FlowStepProps {
    id: string | number;
    title: string;
    subtitle?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
    bgColor?: string;
    borderColor?: string;
    dependencies?: string[];
  }

  const FlowStep: React.FC<FlowStepProps> = ({
    id,
    title,
    subtitle,
    icon: Icon,
    children,
    bgColor = "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor = "border-blue-200",
    dependencies = []
  }) => {
    const isEnabled = isStepEnabled(id.toString());
    const isChecked = checkedSteps[id];
    
    return (
      <div className={`relative ${isEnabled ? bgColor : 'bg-gray-100'} ${isEnabled ? borderColor : 'border-gray-300'} border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${isEnabled ? 'transform hover:scale-105' : 'opacity-60'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${isEnabled ? 'bg-white' : 'bg-gray-200'} rounded-lg shadow-md`}>
              <Icon className={`w-6 h-6 ${isEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isEnabled ? 'text-gray-800' : 'text-gray-500'}`}>{title}</h3>
              {subtitle && <p className={`text-sm ${isEnabled ? 'text-gray-600' : 'text-gray-400'}`}>{subtitle}</p>}
              {dependencies.length > 0 && !isEnabled && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Эхлээд: {dependencies.map(dep => {
                    const depNames: Record<string, string> = {
                      'htf': 'Том зураг',
                      'structure': 'Зах зээлийн бүтэц',
                      'entry-zone': 'Оролтын бүс',
                      'entry': 'Оролт хийх',
                      'risk': 'Эрсдэлийн менежмент',
                      'analysis': 'Дүгнэлт'
                    };
                    return depNames[dep] || dep;
                  }).join(', ')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => isEnabled && toggleCheck(id)}
            disabled={!isEnabled}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isChecked 
                ? 'bg-green-500 border-green-500 text-white' 
                : isEnabled 
                  ? 'border-gray-300 hover:border-green-400 cursor-pointer' 
                  : 'border-gray-200 cursor-not-allowed'
            }`}
          >
            {isChecked && <CheckCircle2 className="w-5 h-5" />}
          </button>
        </div>
        <div className={`text-sm ${isEnabled ? 'text-gray-700' : 'text-gray-500'} space-y-2`}>
          {children}
        </div>
      </div>
    );
  };

  const Arrow = () => (
    <div className="flex justify-center my-4">
      <ChevronDown className="w-8 h-8 text-blue-500 animate-bounce" />
    </div>
  );

  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;
  const totalSteps = 7;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📋 Арилжааны Checklist
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          SMC + ICT + Trend + CHoCH Стратеги
        </p>
        
        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={checkAllDependencies}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <CheckSquare className="w-4 h-4" />
            Бүгдийг тэмдэглэх
          </button>
          <button
            onClick={uncheckAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            <Square className="w-4 h-4" />
            Бүгдийг цэвэрлэх
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {completedSteps}/{totalSteps} алхам гүйцэтгэсэн ({Math.round(progress)}%)
        </p>
      </div>

      {/* Flow Steps */}
      <div className="space-y-6">
        
        {/* Step 1: HTF Analysis */}
        <FlowStep 
          id="htf"
          title="1. Том зураг (HTF Analysis)" 
          subtitle="Daily/4H"
          icon={TrendingUp}
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
          borderColor="border-purple-200"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>🔍 Чиг хандлага:</strong>
              <ul className="ml-4 mt-1">
                <li>• Өсөлттэй эсвэл уналттай?</li>
                <li>• Order Block & Supply/Demand Zone</li>
              </ul>
            </div>
            <div>
              <strong>💧 Ликвидити:</strong>
              <ul className="ml-4 mt-1">
                <li>• Өндөр/бага үнийн түвшнүүд</li>
                <li>• Хуримтлагдсан ликвидити хаана?</li>
              </ul>
            </div>
          </div>
        </FlowStep>

        <Arrow />

        {/* Step 2: Market Structure */}
        <FlowStep 
          id="structure"
          title="2. Зах зээлийн бүтэц (MTF)" 
          subtitle="15m/5m"
          icon={Eye}
          bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
          borderColor="border-orange-200"
          dependencies={['htf']}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>📊 BOS vs CHoCH:</strong>
              <ul className="ml-4 mt-1">
                <li>• Break of Structure (үргэлжлэл)</li>
                <li>• Change of Character (эргэлт)</li>
              </ul>
            </div>
            <div>
              <strong>✅ Баталгаа:</strong>
              <ul className="ml-4 mt-1">
                <li>• Үндсэн чиглэлтэй тохирч байна уу?</li>
                <li>• Зөрчилдөхгүй байгаа эсэх</li>
              </ul>
            </div>
          </div>
        </FlowStep>

        <Arrow />

        {/* Step 3: Entry Zone */}
        <FlowStep 
          id="entry-zone"
          title="3. Оролтын бүс хайх" 
          subtitle=""
          icon={Target}
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
          borderColor="border-green-200"
          dependencies={['htf', 'structure']}
        >
          <div className="space-y-2">
            <div><strong>🎯 CHoCH/BOS дараах Order Block</strong></div>
            <div><strong>📈 Fair Value Gap (FVG) шалгах</strong></div>
            <div><strong>🎣 Ликвидити сорилт (Stop Hunt)</strong></div>
          </div>
        </FlowStep>

        <Arrow />

        {/* Step 4: Entry Execution */}
        <FlowStep 
          id="entry"
          title="4. Оролт хийх" 
          icon={TrendingDown}
          bgColor="bg-gradient-to-br from-cyan-50 to-cyan-100"
          borderColor="border-cyan-200"
          dependencies={['htf', 'structure', 'entry-zone']}
        >
          <div className="space-y-3">
            <div>
              <strong>⏰ Timing:</strong>
              <p className="ml-4">Үнэ OB/FVG рүү буцах + Session timing (Лондон/Нью-Йорк)</p>
            </div>
            <div>
              <strong>✅ Баталгаа:</strong>
              <ul className="ml-4">
                <li>• Pin bar эсвэл rejection</li>
                <li>• Зах зээлийн бүтэц нийцэж байна уу?</li>
              </ul>
            </div>
          </div>
        </FlowStep>

        <Arrow />

        {/* Step 5: Risk Management */}
        <FlowStep 
          id="risk"
          title="5. Эрсдэлийн менежмент" 
          icon={Shield}
          bgColor="bg-gradient-to-br from-red-50 to-red-100"
          borderColor="border-red-200"
          dependencies={['htf', 'structure', 'entry-zone', 'entry']}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>🛑 Stop Loss:</strong>
              <p className="ml-4">OB-ийн цаана байрлуулах</p>
            </div>
            <div>
              <strong>🎯 Take Profit:</strong>
              <p className="ml-4">Дараагийн ликвидити бүс</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <strong className="text-red-600">⚠️ Risk per trade ≤ 1–2% данснаас үлдэгдлээс</strong>
          </div>
        </FlowStep>

        <Arrow />

        {/* Step 6: Post-Trade Analysis */}
        <FlowStep 
          id="analysis"
          title="6. Арилжааны дараах дүгнэлт" 
          icon={BookOpen}
          bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
          borderColor="border-indigo-200"
          dependencies={['htf', 'structure', 'entry-zone', 'entry', 'risk']}
        >
          <div className="space-y-2">
            <div><strong>📸 Screenshot хийж Journal-дoo хадгал</strong></div>
            <div><strong>📝 Амжилт/бүтэлгүйтлийн шалтгаан тэмдэглэх</strong></div>
            <div><strong>🔄 Дараагийн боломжид сайжруулах зүйлс</strong></div>
          </div>
        </FlowStep>

        <Arrow />

        {/* Step 7: Continuous Improvement */}
        <FlowStep 
          id="improvement"
          title="7. Тогтмол сайжруулалт" 
          icon={TrendingUp}
          bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
          borderColor="border-yellow-200"
          dependencies={['htf', 'structure', 'entry-zone', 'entry', 'risk', 'analysis']}
        >
          <div className="p-4 bg-white rounded-lg border">
            <p className="text-center font-semibold text-gray-800">
              💡 2–3 сарын дараа өөрийн хамгийн ашигтай сетапыг тодорхойлох боломжтой болно
            </p>
          </div>
        </FlowStep>

      </div>

      {/* Summary Card */}
      <div className="mt-10 p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-center">🎯 Flowchart хураангуй</h3>
        <div className="text-center text-sm opacity-90">
          <p className="mb-2">
            <strong>HTF чиглэл</strong> ⬇ <strong>Ликвидити</strong> ⬇ <strong>CHoCH/BOS</strong> ⬇ <strong>OB/FVG</strong>
          </p>
          <p>
            ⬇ <strong>Ликвидити сорилт → Оролт</strong> ⬇ <strong>SL & TP</strong> ⬇ <strong>Journal + Review</strong>
          </p>
        </div>
      </div>

      {/* Completion Message */}
      {completedSteps === totalSteps && (
        <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-center">
          <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Баяр хүргэе!</h3>
          <p className="text-green-700">Та бүх алхмуудыг амжилттай гүйцэтгэлээ. Арилжааны амжилт хүсье! 📈</p>
        </div>
      )}

      {/* Dependency Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-800 mb-2">📌 Хамаарлын мэдээлэл:</h4>
        <p className="text-sm text-blue-700">
          Алхам бүр өмнөх алхмуудыг гүйцэтгэсэн байхыг шаарддаг. Хэрэв алхам идэвхгүй байвал өмнөх шаардлагатай алхмуудыг эхлээд гүйцэтгэнэ үү.
        </p>
      </div>
    </div>
  );
};

export default TradingChecklistFlowchart;