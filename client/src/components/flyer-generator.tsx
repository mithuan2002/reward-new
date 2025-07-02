import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: number;
  name: string;
  description: string;
  rewardValue: string;
  endDate: string;
  uniqueUrl: string;
}

interface FlyerGeneratorProps {
  campaign: Campaign;
}

export default function FlyerGenerator({ campaign }: FlyerGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'fun'>('modern');
  const { toast } = useToast();

  const generateFlyerSVG = (template: string) => {
    const baseUrl = window.location.origin;
    const campaignUrl = `${baseUrl}/c/${campaign.uniqueUrl}`;
    
    const templates = {
      modern: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        accentColor: '#ffd700',
        emoji: '✨'
      },
      classic: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        textColor: '#ffffff',
        accentColor: '#fff',
        emoji: '🎯'
      },
      fun: {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        textColor: '#ffffff',
        accentColor: '#ffff00',
        emoji: '🎉'
      }
    };

    const style = templates[template as keyof typeof templates];
    
    return `
      <svg width="400" height="700" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            ${style.background.includes('gradient') 
              ? style.background.match(/#[a-fA-F0-9]{6}/g)?.map((color, i) => 
                  `<stop offset="${i * 50}%" style="stop-color:${color};stop-opacity:1" />`
                ).join('') || ''
              : `<stop offset="0%" style="stop-color:${style.background};stop-opacity:1" />`
            }
          </linearGradient>
        </defs>
        
        <rect width="400" height="700" fill="url(#bg)" rx="20"/>
        
        <!-- Header -->
        <text x="200" y="80" text-anchor="middle" fill="${style.textColor}" font-family="Arial, sans-serif" font-size="28" font-weight="bold">
          ${style.emoji} ${campaign.name}
        </text>
        
        <!-- Description -->
        <foreignObject x="40" y="120" width="320" height="120">
          <div xmlns="http://www.w3.org/1999/xhtml" style="
            color: ${style.textColor}; 
            font-family: Arial, sans-serif; 
            font-size: 16px; 
            text-align: center; 
            line-height: 1.5;
            padding: 10px;
          ">
            ${campaign.description}
          </div>
        </foreignObject>
        
        <!-- Reward Box -->
        <rect x="60" y="280" width="280" height="80" fill="${style.accentColor}" rx="15" opacity="0.9"/>
        <text x="200" y="315" text-anchor="middle" fill="#000000" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
          🎁 WIN: ${campaign.rewardValue}
        </text>
        <text x="200" y="340" text-anchor="middle" fill="#000000" font-family="Arial, sans-serif" font-size="14">
          Valid until: ${new Date(campaign.endDate).toLocaleDateString()}
        </text>
        
        <!-- Call to Action -->
        <rect x="60" y="420" width="280" height="60" fill="${style.textColor}" rx="30"/>
        <text x="200" y="460" text-anchor="middle" fill="#000000" font-family="Arial, sans-serif" font-size="20" font-weight="bold">
          📸 JOIN NOW!
        </text>
        
        <!-- URL -->
        <text x="200" y="520" text-anchor="middle" fill="${style.textColor}" font-family="Arial, sans-serif" font-size="12">
          ${campaignUrl}
        </text>
        
        <!-- QR Code -->
        <image x="150" y="530" width="100" height="100" href="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(campaignUrl)}&bgcolor=ffffff&color=000000" />
        <text x="200" y="650" text-anchor="middle" fill="${style.textColor}" font-family="Arial, sans-serif" font-size="11">
          📱 Scan QR Code to Join
        </text>
      </svg>
    `;
  };

  const downloadFlyer = () => {
    const svgContent = generateFlyerSVG(selectedTemplate);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.name.replace(/\s+/g, '-').toLowerCase()}-flyer.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Flyer downloaded!",
      description: "Your campaign flyer has been saved as an SVG file."
    });
  };

  const copyShareText = () => {
    const baseUrl = window.location.origin;
    const campaignUrl = `${baseUrl}/c/${campaign.uniqueUrl}`;
    const shareText = `🎉 Join the ${campaign.name}! 

${campaign.description}

🎁 Win: ${campaign.rewardValue}
⏰ Valid until: ${new Date(campaign.endDate).toLocaleDateString()}

📸 Participate now: ${campaignUrl}

#Contest #Win #PhotoContest`;

    navigator.clipboard.writeText(shareText);
    toast({
      title: "Share text copied!",
      description: "Paste this in your social media posts."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Create Shareable Flyer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Choose Template:</label>
            <div className="flex gap-2">
              {(['modern', 'classic', 'fun'] as const).map((template) => (
                <Button
                  key={template}
                  variant={selectedTemplate === template ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTemplate(template)}
                  className="capitalize"
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-center">
              <div 
                className="w-48 h-80 border rounded-lg shadow-md overflow-hidden"
                dangerouslySetInnerHTML={{ 
                  __html: generateFlyerSVG(selectedTemplate)
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={downloadFlyer} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Flyer
            </Button>
            <Button onClick={copyShareText} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Share Text
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            💡 <strong>How to use:</strong> Download the flyer image with QR code and share it on social media, 
            or copy the share text to post with your own images. The QR code lets people scan and join instantly!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}