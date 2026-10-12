# Read-only audit of the generated PNGs. Run from the project root.
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
public static class ArtPixels {
    static double Linear(byte c) { double v = c / 255.0; return v <= .04045 ? v / 12.92 : Math.Pow((v + .055) / 1.055, 2.4); }
    static double Luminance(Color c) { return .2126 * Linear(c.R) + .7152 * Linear(c.G) + .0722 * Linear(c.B); }
    public static string Inspect(string path, bool background) {
        using (var image = new Bitmap(path)) {
            int left=image.Width, top=image.Height, right=-1, bottom=-1, transparent=0;
            double minTop=100, minAll=100, ink=Luminance(Color.FromArgb(18,32,46));
            for(int y=0; y<image.Height; y++) for(int x=0; x<image.Width; x++) {
                var c=image.GetPixel(x,y);
                if(c.A==0) transparent++;
                if(c.A>=128) { left=Math.Min(left,x); top=Math.Min(top,y); right=Math.Max(right,x); bottom=Math.Max(bottom,y); }
                if(background) {
                    double ratio=(Luminance(c)+.05)/(ink+.05);
                    minAll=Math.Min(minAll,ratio);
                    if(y<image.Height*.4) minTop=Math.Min(minTop,ratio);
                }
            }
            return String.Format("{0}x{1}; transparent={2:P1}; bounds={3},{4}-{5},{6}{7}", image.Width,image.Height,transparent/(double)(image.Width*image.Height),left,top,right,bottom,background?String.Format("; contrast top40={0:F2}:1 whole={1:F2}:1",minTop,minAll):"");
        }
    }
}
'@
$assetRoot = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets'
$files = @(Get-Item (Join-Path $assetRoot 'character-base.png'))
foreach ($folder in @('outfits','backgrounds','conditions','reminders')) {
    $files += Get-ChildItem (Join-Path $assetRoot $folder) -Filter '*.png'
}
foreach ($file in $files) {
    $relative = $file.FullName.Substring($assetRoot.Length + 1)
    Write-Output "$relative : $([ArtPixels]::Inspect($file.FullName, $relative.StartsWith('backgrounds')))"
}
Write-Output "Production assets: $($files.Count); total bytes: $(($files | Measure-Object Length -Sum).Sum)"
