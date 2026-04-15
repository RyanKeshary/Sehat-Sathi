import React, { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import BottomNav from '../components/organisms/BottomNav';
import Button from '../components/atoms/Button';
import LanguageSwitcher from '../components/molecules/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight, ChevronLeft, Mic, User, Circle, AlertCircle, CheckCircle2 } from 'lucide-react';

const initialState = {
  step: 1,
  bodyPart: '',
  symptoms: [],
  additionalNotes: '',
  isRecording: false,
  result: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP': return { ...state, step: action.payload };
    case 'SET_BODY_PART': return { ...state, bodyPart: action.payload, step: 3 };
    case 'TOGGLE_SYMPTOM':
      const symptoms = state.symptoms.includes(action.payload)
        ? state.symptoms.filter(s => s !== action.payload)
        : [...state.symptoms, action.payload];
      return { ...state, symptoms };
    case 'SET_RESULT': return { ...state, result: action.payload, step: 5 };
    case 'SET_RECORDING': return { ...state, isRecording: action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

const SymptomCheckerPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNext = () => dispatch({ type: 'SET_STEP', payload: state.step + 1 });
  const handleBack = () => dispatch({ type: 'SET_STEP', payload: state.step - 1 });

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="text-center space-y-8 py-4">
            <div className="flex flex-col items-center gap-4">
               <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-primary shadow-inner">
                 <User size={40} />
               </div>
               <h2 className="text-3xl font-display font-bold text-[#1A2332]">
                 Health Analysis
               </h2>
               <p className="text-[#8A9BB0] max-w-sm">
                 Choose your language to start the AI-powered symptom analysis.
               </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-[#D4DCE8] shadow-sm">
              <LanguageSwitcher />
            </div>

            <div className="pt-4">
              <Button onClick={handleNext} size="lg" className="w-full md:w-auto px-16 group">
                Start Now <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-[#1A2332] mb-2">
                Where is the problem?
              </h2>
              <p className="text-[#8A9BB0] text-sm font-medium">Select the affected part of your body</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {['Head', 'Chest', 'Abdomen', 'Limbs', 'Skin', 'Fever/General'].map((part) => (
                <button
                  key={part}
                  onClick={() => dispatch({ type: 'SET_BODY_PART', payload: part })}
                  className="p-8 bg-white border-2 border-[#D4DCE8] rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-primary hover:bg-primary-light transition-all shadow-sm active:scale-95 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-white group-hover:shadow-md transition-all">
                    <Circle size={24} />
                  </div>
                  <span className="font-bold text-[#4A5A72] text-sm">{part}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-[#1A2332] mb-2">
                What are you feeling?
              </h2>
              <p className="text-[#8A9BB0] text-sm font-medium">Symptoms for your <span className="text-primary font-bold">{state.bodyPart}</span></p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {['Pain', 'Swelling', 'Redness', 'Itching', 'Numbness', 'Fever', 'Cough', 'Bleeding'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => dispatch({ type: 'TOGGLE_SYMPTOM', payload: sym })}
                  className={`px-8 py-4 rounded-2xl border-2 transition-all font-bold text-sm shadow-sm active:scale-95 ${
                    state.symptoms.includes(sym)
                      ? 'bg-primary text-white border-primary shadow-primary/20 shadow-md'
                      : 'bg-white text-[#4A5A72] border-[#D4DCE8] hover:border-primary'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-8 border-t border-[#D4DCE8]">
              <Button variant="ghost" onClick={handleBack} leftIcon={<ChevronLeft size={18} />}>Back</Button>
              <Button 
                onClick={handleNext} 
                isDisabled={state.symptoms.length === 0}
                rightIcon={<ChevronRight size={18} />}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-[#1A2332] mb-2">
                Tell us more
              </h2>
              <p className="text-[#8A9BB0] text-sm font-medium">Describe your condition in your own words</p>
            </div>

            <div 
              className={`p-10 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center gap-4 transition-all cursor-pointer ${
                state.isRecording ? 'bg-red-50 border-red-200' : 'bg-white border-[#D4DCE8] hover:border-primary hover:bg-primary-light/30'
              }`}
              onClick={() => dispatch({ type: 'SET_RECORDING', payload: !state.isRecording })}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                state.isRecording ? 'bg-danger animate-pulse scale-110' : 'bg-primary-light text-primary'
              }`}>
                <Mic size={32} fill={state.isRecording ? 'white' : 'none'} className={state.isRecording ? 'text-white' : ''} />
              </div>
              <p className={`text-sm font-bold uppercase tracking-wider ${state.isRecording ? 'text-danger' : 'text-primary'}`}>
                {state.isRecording ? 'Recording... Tap to stop' : 'Tap to Record Voice'}
              </p>
            </div>

            <div className="relative">
              <textarea
                className="w-full p-6 bg-white border-2 border-[#D4DCE8] rounded-3xl outline-none focus:border-primary focus:ring-4 focus:ring-primary-light min-h-[150px] text-[#1A2332] placeholder-[#8A9BB0] transition-all"
                placeholder="e.g. My head has been aching for 2 days, mostly on the left side..."
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" onClick={handleBack} leftIcon={<ChevronLeft size={18} />}>Back</Button>
              <Button 
                size="lg"
                onClick={() => dispatch({ type: 'SET_RESULT', payload: { 
                  urgency: 'medium', 
                  title: 'Moderate Concern', 
                  advice: 'We recommend booking a tele-consultation with a General Physician for further evaluation.' 
                }})}
              >
                Analyze Symptoms
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 text-center py-6">
            <div className="inline-flex p-5 bg-orange-100 rounded-full text-orange-600 mb-2 shadow-inner">
              <AlertCircle size={56} />
            </div>
            
            <div>
              <h2 className="text-3xl font-display font-bold text-[#1A2332]">
                {state.result.title}
              </h2>
              <p className="text-[#8A9BB0] mt-2 font-medium">Health Assistant Analysis Complete</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-primary-light rounded-[2.5rem] text-left shadow-xl shadow-primary-light/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-tighter text-xs">
                   <CheckCircle2 size={16} /> Recommended Action
                </div>
                <p className="text-[#4A5A72] text-lg leading-relaxed font-medium">
                  {state.result.advice}
                </p>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-light/20 rounded-full blur-2xl" />
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button size="lg" className="w-full py-5" onClick={() => navigate('/consultation')}>
                Book Doctor Consult Now
              </Button>
              <Button variant="ghost" className="font-bold text-[#8A9BB0]" onClick={() => dispatch({ type: 'RESET' })}>
                Start a New Analysis
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        {/* Progress Bar */}
        {state.step < 5 && (
          <div className="flex justify-between items-center mb-16 px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-500 shadow-sm ${
                  state.step >= i ? 'bg-primary text-white scale-110 shadow-primary/30' : 'bg-[#D4DCE8] text-[#8A9BB0]'
                }`}>
                  {i}
                </div>
                {i < 4 && (
                  <div className={`absolute left-1/2 top-5 w-full h-[3px] -z-0 transition-all duration-700 ${
                    state.step > i ? 'bg-primary' : 'bg-[#D4DCE8]'
                  }`} />
                )}
                <span className={`absolute -bottom-8 text-[10px] font-bold uppercase tracking-wider hidden md:block ${
                   state.step >= i ? 'text-primary' : 'text-[#8A9BB0]'
                }`}>
                  {i === 1 ? 'Start' : i === 2 ? 'Body' : i === 3 ? 'Symptoms' : 'Details'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-white shadow-2xl min-h-[500px] flex flex-col justify-center transition-all duration-500">
          {renderStep()}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default SymptomCheckerPage;
