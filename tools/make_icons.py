"""Export platform icon containers from the one original master. No network assets."""
from pathlib import Path
from PIL import Image
import hashlib

root = Path(__file__).resolve().parents[1]
source = Image.open(root / 'assets/icon-source.png').convert('RGBA')
icons = root / 'assets/icons'
icons.mkdir(parents=True, exist_ok=True)
square = source.resize((1024, 1024), Image.Resampling.NEAREST)
square.save(icons / 'icon.png')
square.save(icons / 'icon.ico', sizes=[(n,n) for n in [16,24,32,48,64,128,256]])
square.save(icons / 'icon.icns')
square.resize((32,32),Image.Resampling.NEAREST).save(icons / 'favicon.png')
for density, size in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)]:
    out = root / 'android/app/src/main/res' / ('mipmap-' + density)
    out.mkdir(parents=True, exist_ok=True)
    square.resize((size,size),Image.Resampling.NEAREST).save(out / 'ic_launcher.png')
print('One master exported as PNG, Windows ICO, macOS ICNS and Android launcher densities.')
print('Master SHA-256:', hashlib.sha256((root/'assets/icon-source.png').read_bytes()).hexdigest())
