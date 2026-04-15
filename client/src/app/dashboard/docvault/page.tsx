'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Search, Plus, Loader2, Brain } from 'lucide-react';
import Tesseract from 'tesseract.js';

type DocumentType = {
  id: string;
  name: string;
  type: string;
  url: string;
  date: string;
  ocrText?: string;
};

export default function DocVaultPage() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [ocrScanningStatus, setOcrScanningStatus] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileUrl = URL.createObjectURL(file);
      const newDoc: DocumentType = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.type,
        url: fileUrl,
        date: new Date().toLocaleDateString(),
      };
      
      setDocuments(prev => [newDoc, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePerformOCR = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc || !doc.type.startsWith('image/')) return;
    
    setOcrScanningStatus('Scanning document...');
    
    Tesseract.recognize(
      doc.url,
      'eng',
      { logger: m => {
          if(m.status === 'recognizing text'){
            setOcrScanningStatus(`Scanning: ${Math.round(m.progress * 100)}%`);
          }
        } 
      }
    ).then(({ data: { text } }) => {
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, ocrText: text } : d));
      setOcrScanningStatus('');
    }).catch(err => {
      console.error("OCR Error:", err);
      setOcrScanningStatus('OCR Failed');
      setTimeout(() => setOcrScanningStatus(''), 2000);
    });
  };

  const selectedDocument = documents.find(d => d.id === selectedDoc);

  return (
    <div className="p-6 pt-24 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">DocVault (DigiLocker Integration)</h1>
          <p className="text-slate-600 text-sm mt-1">Securely store and read your medical documents with AI</p>
        </div>
        
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,.pdf" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-[#00C896] hover:bg-[#00C896]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Upload Document
          </button>
        </div>
      </div>

      {ocrScanningStatus && (
        <div className="bg-[#00C896]/10 border border-[#00C896]/20 p-3 rounded-lg text-[#00C896] text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {ocrScanningStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 min-h-[400px]">
            <h3 className="font-semibold text-slate-800 mb-4">Your Documents</h3>
            {documents.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedDoc === doc.id ? 'bg-[#00C896]/10 border-[#00C896] text-slate-900' : 'bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 ${selectedDoc === doc.id ? 'text-[#00C896]' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        <p className="text-xs opacity-50">{doc.date}</p>
                      </div>
                      {doc.ocrText && (
                         <span className="text-[10px] bg-[#00C896]/20 text-[#00C896] px-2 py-0.5 rounded-full">OCR</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDocument ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-hidden flex flex-col h-full min-h-[500px]">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-semibold text-slate-800">Document Viewer</h3>
                <button 
                  className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors text-slate-700"
                  onClick={() => window.open(selectedDocument.url, '_blank')}
                >
                  Open in New Tab
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg flex items-center justify-center p-2 relative overflow-hidden min-h-[300px] border border-slate-100">
                  {selectedDocument.type.startsWith('image/') ? (
                    <img 
                      src={selectedDocument.url} 
                      alt="Document preview" 
                      className="max-w-full max-h-full object-contain mx-auto"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <FileText className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>Preview not available</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-4 custom-scrollbar overflow-y-auto min-h-[300px] border border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#00C896]" />
                    Extracted Text (OCR)
                  </h4>
                  {selectedDocument.ocrText ? (
                    <div className="text-slate-800 text-sm whitespace-pre-wrap font-mono text-xs">
                      {selectedDocument.ocrText}
                    </div>
                  ) : selectedDocument.type.startsWith('image/') ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                      <p className="text-slate-500 text-sm italic">
                        Extract text from this image to analyze its contents.
                      </p>
                      <button 
                        onClick={() => handlePerformOCR(selectedDocument.id)}
                        disabled={!!ocrScanningStatus}
                        className="flex items-center gap-2 bg-[#0A2540] hover:bg-[#0A2540]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <Brain className="w-4 h-4" />
                        {ocrScanningStatus ? 'Scanning...' : 'Perform Text Extraction'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-sm italic py-10 text-center">
                      OCR relies on image files to extract text. PDF or Document format extraction coming soon.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-4 h-full min-h-[400px] flex items-center justify-center text-slate-400">
              <p>Select a document to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
