#!/usr/bin/env python3
"""
生成简单的像素风格占位符图片用于 Cocos Creator 开发
"""

import struct
import zlib
import os

def create_png(width, height, pixels):
    """创建 PNG 图片"""
    def png_chunk(chunk_type, data):
        chunk = chunk_type + data
        return struct.pack('>I', len(data)) + chunk + struct.pack('>I', zlib.crc32(chunk) & 0xffffffff)
    
    signature = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            raw_data += bytes(pixels[y * width + x])
    
    compressed = zlib.compress(raw_data, 9)
    
    return signature + png_chunk(b'IHDR', ihdr) + png_chunk(b'IDAT', compressed) + png_chunk(b'IEND', b'')

def create_simple_solid(width, height, color):
    """创建纯色图片"""
    pixels = [(color[0], color[1], color[2], 255) for _ in range(width * height)]
    return create_png(width, height, pixels)

def create_gradient(width, height, color1, color2):
    """创建渐变图片"""
    pixels = []
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        for x in range(width):
            pixels.append((r, g, b, 255))
    return create_png(width, height, pixels)

def save_png(filepath, png_data):
    """保存 PNG 文件"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'wb') as f:
        f.write(png_data)
    print(f"Created: {filepath}")

def main():
    base_path = 'assets/Resources/Sprites'
    
    # 创建元素图标
    for element in ['fire', 'wood', 'water', 'light', 'dark']:
        icon = create_simple_solid(36, 36, {
            'fire': (255, 100, 50),
            'wood': (100, 200, 100),
            'water': (100, 150, 255),
            'light': (255, 255, 150),
            'dark': (150, 100, 200),
        }[element])
        save_png(f'{base_path}/Elements/{element}_icon.png', icon)
    
    # 创建定位图标
    for role in ['assassin', 'mage', 'warrior', 'tank', 'support']:
        icon = create_simple_solid(36, 36, {
            'assassin': (200, 50, 50),
            'mage': (100, 100, 255),
            'warrior': (255, 150, 50),
            'tank': (150, 150, 150),
            'support': (50, 200, 150),
        }[role])
        save_png(f'{base_path}/Roles/{role}_icon.png', icon)
    
    # 创建卡牌边框
    for rarity, color in [('normal', (220, 220, 220)), ('rare', (100, 150, 255)), ('epic', (180, 100, 255)), ('legend', (255, 200, 50))]:
        frame = create_simple_solid(150, 200, color)
        save_png(f'{base_path}/UI/card_frame_{rarity}.png', frame)
    
    # 创建卡背
    card_back = create_gradient(150, 200, (50, 50, 100), (80, 80, 150))
    save_png(f'{base_path}/card_back.png', card_back)
    
    # 创建按钮背景
    button = create_simple_solid(200, 60, (100, 150, 255))
    save_png(f'{base_path}/UI/button_normal.png', button)
    
    # 创建小尺寸背景（后续可以在 Cocos Creator 中缩放）
    bg = create_gradient(640, 360, (20, 20, 40), (40, 20, 60))
    save_png(f'{base_path}/Backgrounds/main_menu_bg.png', bg)
    
    battle_bg = create_gradient(640, 360, (20, 40, 60), (40, 60, 80))
    save_png(f'{base_path}/Backgrounds/battle_bg.png', battle_bg)
    
    # 创建示例卡牌图片
    for element, color in [('fire', (255, 150, 100)), ('wood', (150, 255, 150)), ('water', (150, 200, 255)), ('light', (255, 255, 200)), ('dark', (150, 100, 200))]:
        img = create_simple_solid(100, 100, color)
        save_png(f'{base_path}/Cards/sample_{element}.png', img)
    
    print("\nAll placeholder sprites created!")

if __name__ == '__main__':
    main()
