
import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Link2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [url, setUrl] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) {
      toast.error('No QR code to download');
      return;
    }

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Create download link
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      URL.revokeObjectURL(svgUrl);
      toast.success('QR code downloaded successfully!');
    };
    img.src = svgUrl;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QR Code Generator
          </CardTitle>
          <CardDescription className="text-gray-600">
            Paste any URL to generate a QR code instantly
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url-input" className="text-sm font-medium text-gray-700">
              Enter URL
            </Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={handleInputChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {url && (
            <div className="space-y-4">
              <div 
                ref={qrRef}
                className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-gray-200 transition-all duration-300 hover:border-blue-300"
              >
                <QRCode
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={url}
                  viewBox={`0 0 256 256`}
                  fgColor={isValidUrl(url) ? "#1f2937" : "#ef4444"}
                />
              </div>

              {!isValidUrl(url) && (
                <p className="text-sm text-red-500 text-center">
                  Please enter a valid URL starting with http:// or https://
                </p>
              )}

              <Button
                onClick={downloadQR}
                disabled={!isValidUrl(url)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}

          {!url && (
            <div className="text-center p-8 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                <Link2 className="w-8 h-8" />
              </div>
              <p className="text-sm">Enter a URL above to generate your QR code</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
