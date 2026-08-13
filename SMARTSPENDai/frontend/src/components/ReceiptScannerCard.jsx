import React, { useRef, useState } from 'react';
import { UploadCloud, Receipt, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ReceiptScannerCard({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input so the same file can be selected again if needed
    e.target.value = null;

    setIsScanning(true);
    setError('');

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await api.post('/insights/scan-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        if (onScanComplete) {
          onScanComplete(response.data.data);
        }
      } else {
        setError(response.data.message || 'Failed to scan receipt');
      }
    } catch (err) {
      console.error('Receipt Scan Error:', err);
      setError('An error occurred while scanning the receipt.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Receipt Scanner</h3>
        <Receipt className="w-5 h-5 text-gray-400" />
      </div>

      <p className="text-sm text-gray-400 mb-6 flex-1">
        Upload a receipt and let AI do the magic
      </p>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button 
        onClick={handleUploadClick}
        disabled={isScanning}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isScanning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <UploadCloud className="w-5 h-5" />
            Upload Receipt
          </>
        )}
      </button>
    </div>
  );
}
