
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Square, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<string>('');

  const startScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log('QR Code scanned:', decodedText);
        setLastScannedResult(decodedText);
        onScanSuccess(decodedText);
        toast.success('QR code scanned successfully!');
        scanner.clear();
        setIsScanning(false);
      },
      (error) => {
        // Only log errors that aren't just "no QR code found" messages
        if (!error.includes('No MultiFormat Readers')) {
          console.warn('QR scan error:', error);
        }
      }
    );

    scannerRef.current = scanner;
    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <Card className="w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-2">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          QR Code Scanner
        </CardTitle>
        <CardDescription className="text-gray-600">
          Scan QR codes using your device camera
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          {!isScanning ? (
            <Button
              onClick={startScanner}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera Scanner
            </Button>
          ) : (
            <Button
              onClick={stopScanner}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Scanner
            </Button>
          )}
        </div>

        <div 
          id="qr-reader" 
          className={`${isScanning ? 'block' : 'hidden'} rounded-lg overflow-hidden border-2 border-dashed border-gray-200`}
        />

        {lastScannedResult && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Last Scanned Result:</span>
            </div>
            <p className="text-sm text-green-700 break-all">{lastScannedResult}</p>
          </div>
        )}

        {!isScanning && !lastScannedResult && (
          <div className="text-center p-8 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-sm">Click the button above to start scanning QR codes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;
