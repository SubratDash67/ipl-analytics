// File Path: frontend/src/components/phase/PhasePerformanceCards.jsx
import React from 'react';
import { Zap, Target, Clock } from 'lucide-react';

const PhasePerformanceCards = ({ phases, phaseData }) => {
  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'powerplay': return Zap;
      case 'middle_overs': return Target;
      case 'death_overs': return Clock;
      default: return Zap;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {phases.map(phase => {
        const Icon = getPhaseIcon(phase.key);
        const data = phaseData[phase.key]?.stats || {};
        
        return (
          <div key={phase.key} className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center mb-4">
              <Icon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.runs_scored || 0}</div>
                <div className="text-sm text-gray-600">Runs</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {data.strike_rate ? `${data.strike_rate}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Strike Rate</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhasePerformanceCards;
