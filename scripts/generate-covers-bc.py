#!/usr/bin/env python3
"""
Kindle B+C Series — Cover Generator
Reuses A-series design language: dark bg, circle illustrations, minimalist typography.
Usage: PYTHONIOENCODING=utf-8 python scripts/generate-covers-bc.py
Output: output/kindle-series/saju-{id}-cover.jpg
"""

import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 2560
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'output', 'kindle-series')
FONTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'fonts')

# ─── Color palettes ───

PURPLE = {'bg': (20, 12, 38), 'bg_light': (30, 18, 55), 'accent': (124, 58, 237),
          'accent_light': (160, 100, 255), 'accent_pale': (200, 170, 255),
          'accent_muted': (90, 40, 170), 'text_color': (180, 160, 220),
          'title_color': (255, 255, 255), 'line_color': (60, 40, 90), 'rain_color': (25, 15, 45)}

ROSE = {'bg': (38, 14, 22), 'bg_light': (55, 20, 32), 'accent': (220, 60, 100),
        'accent_light': (255, 100, 140), 'accent_pale': (255, 180, 200),
        'accent_muted': (160, 40, 75), 'text_color': (220, 170, 185),
        'title_color': (255, 255, 255), 'line_color': (80, 35, 50), 'rain_color': (45, 18, 28)}

TEAL = {'bg': (10, 28, 30), 'bg_light': (16, 40, 44), 'accent': (40, 180, 170),
        'accent_light': (80, 220, 210), 'accent_pale': (160, 240, 235),
        'accent_muted': (30, 130, 120), 'text_color': (150, 210, 205),
        'title_color': (255, 255, 255), 'line_color': (30, 65, 68), 'rain_color': (14, 34, 36)}

AMBER = {'bg': (35, 22, 8), 'bg_light': (50, 32, 12), 'accent': (245, 158, 11),
         'accent_light': (255, 190, 60), 'accent_pale': (255, 220, 130),
         'accent_muted': (180, 115, 8), 'text_color': (220, 195, 150),
         'title_color': (255, 255, 255), 'line_color': (80, 55, 20), 'rain_color': (42, 28, 10)}

# Element palettes for C-series (reuse from A-series)
EL_GREEN = {'bg': (18, 38, 18), 'bg_light': (25, 50, 25), 'accent': (76, 140, 50),
            'accent_light': (110, 180, 70), 'accent_pale': (150, 210, 120),
            'accent_muted': (60, 100, 45), 'text_color': (150, 195, 130),
            'title_color': (255, 255, 255), 'line_color': (60, 90, 50), 'rain_color': (25, 50, 22)}
EL_RED = {'bg': (38, 16, 12), 'bg_light': (55, 22, 16), 'accent': (220, 90, 30),
          'accent_light': (255, 140, 50), 'accent_pale': (255, 200, 100),
          'accent_muted': (160, 60, 20), 'text_color': (220, 170, 140),
          'title_color': (255, 255, 255), 'line_color': (90, 40, 25), 'rain_color': (45, 20, 14)}
EL_GOLD = {'bg': (32, 25, 14), 'bg_light': (45, 35, 20), 'accent': (185, 145, 65),
           'accent_light': (215, 180, 95), 'accent_pale': (235, 210, 150),
           'accent_muted': (140, 110, 50), 'text_color': (200, 180, 140),
           'title_color': (255, 255, 255), 'line_color': (75, 58, 30), 'rain_color': (38, 30, 16)}
EL_SILVER = {'bg': (18, 18, 25), 'bg_light': (28, 28, 38), 'accent': (155, 165, 185),
             'accent_light': (195, 205, 220), 'accent_pale': (220, 225, 238),
             'accent_muted': (110, 115, 135), 'text_color': (175, 180, 200),
             'title_color': (255, 255, 255), 'line_color': (55, 58, 72), 'rain_color': (22, 22, 32)}
EL_BLUE = {'bg': (10, 16, 38), 'bg_light': (16, 24, 52), 'accent': (55, 115, 210),
           'accent_light': (90, 155, 245), 'accent_pale': (150, 200, 255),
           'accent_muted': (40, 80, 155), 'text_color': (140, 175, 230),
           'title_color': (255, 255, 255), 'line_color': (30, 45, 80), 'rain_color': (14, 22, 45)}

# ─── Book definitions ───

B_BOOKS = [
    {'id': 'love-codes', 'title_line1': 'Saju Love', 'title_line2': 'Codes',
     'subtitle': "Attachment Styles, Conflict Patterns\n& Compatibility Secrets",
     'series_label': 'L I F E   C O D E   S E R I E S', 'illust': 'heart', **ROSE},
    {'id': 'money-codes', 'title_line1': 'Saju Money', 'title_line2': 'Codes',
     'subtitle': "Career Strengths, Wealth Patterns\n& Financial Strategy",
     'series_label': 'L I F E   C O D E   S E R I E S', 'illust': 'coin', **AMBER},
    {'id': 'energy-codes', 'title_line1': 'Saju Energy', 'title_line2': 'Codes',
     'subtitle': "Body Signals, Burnout Patterns\n& Wellness Strategy",
     'series_label': 'L I F E   C O D E   S E R I E S', 'illust': 'pulse', **TEAL},
    {'id': 'year-codes', 'title_line1': 'Saju Year', 'title_line2': 'Codes',
     'subtitle': "How to Read the Energy\nof Any Year",
     'series_label': 'L I F E   C O D E   S E R I E S', 'illust': 'cycle', **PURPLE},
]

C_BOOKS = [
    {'id': 'match-codes-wood', 'title_line1': 'Saju Match', 'title_line2': 'Codes - Wood',
     'subtitle': "Your Complete Compatibility\nGuide for the Wood Element",
     'series_label': 'M A T C H   C O D E   S E R I E S', 'illust': 'match', **EL_GREEN},
    {'id': 'match-codes-fire', 'title_line1': 'Saju Match', 'title_line2': 'Codes - Fire',
     'subtitle': "Your Complete Compatibility\nGuide for the Fire Element",
     'series_label': 'M A T C H   C O D E   S E R I E S', 'illust': 'match', **EL_RED},
    {'id': 'match-codes-earth', 'title_line1': 'Saju Match', 'title_line2': 'Codes - Earth',
     'subtitle': "Your Complete Compatibility\nGuide for the Earth Element",
     'series_label': 'M A T C H   C O D E   S E R I E S', 'illust': 'match', **EL_GOLD},
    {'id': 'match-codes-metal', 'title_line1': 'Saju Match', 'title_line2': 'Codes - Metal',
     'subtitle': "Your Complete Compatibility\nGuide for the Metal Element",
     'series_label': 'M A T C H   C O D E   S E R I E S', 'illust': 'match', **EL_SILVER},
    {'id': 'match-codes-water', 'title_line1': 'Saju Match', 'title_line2': 'Codes - Water',
     'subtitle': "Your Complete Compatibility\nGuide for the Water Element",
     'series_label': 'M A T C H   C O D E   S E R I E S', 'illust': 'match', **EL_BLUE},
]


def load_font(name, size):
    path = os.path.join(FONTS_DIR, name)
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


# ─── Background ───

def draw_bg(draw, book):
    bg = book['bg']
    bgl = book['bg_light']
    cx, cy = W // 2, H // 3
    max_d = 1400.0
    for y in range(0, H, 2):
        dy = y - cy
        for x in range(0, W, 6):
            dx = x - cx
            d = math.sqrt(dx * dx + dy * dy)
            t = min(d / max_d, 1.0) ** 0.6
            r = int(bgl[0] + (bg[0] - bgl[0]) * t)
            g = int(bgl[1] + (bg[1] - bgl[1]) * t)
            b = int(bgl[2] + (bg[2] - bgl[2]) * t)
            draw.rectangle([x, y, x + 5, y + 1], fill=(r, g, b))


def draw_rain(draw, book):
    rc = book['rain_color']
    random.seed(42 + hash(book['id']))
    for _ in range(100):
        x = random.randint(80, W - 80)
        y0 = random.randint(250, H - 150)
        ln = random.randint(30, 140)
        c = tuple(min(255, ch + random.randint(8, 18)) for ch in rc)
        draw.line([(x, y0), (x, y0 + ln)], fill=c, width=1)


# ─── Illustrations ───

def draw_heart_illust(draw, book):
    """Two circle clusters forming a heart-like shape."""
    cx = W // 2
    random.seed(700)
    colors = [book['accent'], book['accent_light'], book['accent_pale'], book['accent_muted']]
    # Left lobe
    for _ in range(35):
        ox = random.randint(-220, -20)
        oy = random.randint(-180, 200)
        r = random.randint(12, 40)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
        draw.ellipse([cx + ox - r, 550 + oy - r, cx + ox + r, 550 + oy + r], fill=col)
    # Right lobe
    for _ in range(35):
        ox = random.randint(20, 220)
        oy = random.randint(-180, 200)
        r = random.randint(12, 40)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
        draw.ellipse([cx + ox - r, 550 + oy - r, cx + ox + r, 550 + oy + r], fill=col)
    # Bottom point
    for _ in range(15):
        ox = random.randint(-60, 60)
        oy = random.randint(200, 400)
        r = random.randint(8, 25)
        col = random.choice(colors)
        draw.ellipse([cx + ox - r, 550 + oy - r, cx + ox + r, 550 + oy + r], fill=col)


def draw_coin_illust(draw, book):
    """Stacked circles forming a rising column — coins/wealth."""
    cx = W // 2
    random.seed(701)
    colors = [book['accent'], book['accent_light'], book['accent_pale'], book['accent_muted']]
    # Rising stack
    for i in range(12):
        y = 950 - i * 55
        spread = max(20, 120 - i * 8)
        for _ in range(5):
            ox = random.randint(-spread, spread)
            oy = random.randint(-15, 15)
            r = random.randint(18, 35)
            col = random.choice(colors)
            col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
            draw.ellipse([cx + ox - r, y + oy - r, cx + ox + r, y + oy + r], fill=col)
    # Scattered sparkles
    for _ in range(20):
        ox = random.randint(-250, 250)
        oy = random.randint(350, 950)
        r = random.randint(4, 12)
        col = random.choice([book['accent_pale'], book['accent_light']])
        draw.ellipse([cx + ox - r, oy - r, cx + ox + r, oy + r], fill=col)


def draw_pulse_illust(draw, book):
    """Heartbeat-like pulse wave with circles — energy/vitality."""
    cx = W // 2
    base_y = 680
    random.seed(702)
    colors = [book['accent'], book['accent_light'], book['accent_pale'], book['accent_muted']]
    # Pulse wave
    pts = []
    for x in range(200, W - 200, 3):
        t = (x - 200) / (W - 400)
        # ECG-like shape
        if 0.35 < t < 0.40:
            y = base_y - 300
        elif 0.40 < t < 0.45:
            y = base_y + 150
        elif 0.45 < t < 0.50:
            y = base_y - 180
        elif 0.50 < t < 0.55:
            y = base_y
        else:
            y = base_y + int(15 * math.sin(t * 12))
        pts.append((x, y))
    if len(pts) > 1:
        draw.line(pts, fill=book['accent_light'], width=3)
    # Circles along the wave
    for _ in range(50):
        ox = random.randint(-350, 350)
        oy = random.randint(-250, 250)
        r = random.randint(8, 32)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
        draw.ellipse([cx + ox - r, base_y + oy - r, cx + ox + r, base_y + oy + r], fill=col)


def draw_cycle_illust(draw, book):
    """Circular orbit with dots — year/cycle/time."""
    cx, cy = W // 2, 680
    random.seed(703)
    colors = [book['accent'], book['accent_light'], book['accent_pale'], book['accent_muted']]
    # Orbital rings
    for radius in [120, 200, 290, 380]:
        draw.arc([cx - radius, cy - radius, cx + radius, cy + radius],
                 0, 360, fill=book['line_color'], width=2)
        n_dots = int(radius / 18)
        for i in range(n_dots):
            a = (2 * math.pi * i / n_dots) + random.uniform(-0.2, 0.2)
            x = cx + int(radius * math.cos(a))
            y = cy + int(radius * math.sin(a))
            r = random.randint(5, 18)
            col = random.choice(colors)
            col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
            draw.ellipse([x - r, y - r, x + r, y + r], fill=col)
    # Center circle
    draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], outline=book['accent_pale'], width=3)


def draw_match_illust(draw, book):
    """Two overlapping circle clusters — compatibility/pairing."""
    cx = W // 2
    random.seed(704 + hash(book['id']))
    colors = [book['accent'], book['accent_light'], book['accent_pale'], book['accent_muted']]
    # Left cluster
    for _ in range(30):
        ox = random.randint(-250, -20)
        oy = random.randint(-200, 200)
        r = random.randint(10, 35)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
        draw.ellipse([cx + ox - r, 680 + oy - r, cx + ox + r, 680 + oy + r], fill=col)
    # Right cluster
    for _ in range(30):
        ox = random.randint(20, 250)
        oy = random.randint(-200, 200)
        r = random.randint(10, 35)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
        draw.ellipse([cx + ox - r, 680 + oy - r, cx + ox + r, 680 + oy + r], fill=col)
    # Overlap zone — lighter, blended circles
    for _ in range(15):
        ox = random.randint(-50, 50)
        oy = random.randint(-120, 120)
        r = random.randint(12, 28)
        col = book['accent_pale']
        col = tuple(max(0, min(255, c + random.randint(-20, 20))) for c in col)
        draw.ellipse([cx + ox - r, 680 + oy - r, cx + ox + r, 680 + oy + r], fill=col)


ILLUST_BC = {
    'heart': draw_heart_illust,
    'coin': draw_coin_illust,
    'pulse': draw_pulse_illust,
    'cycle': draw_cycle_illust,
    'match': draw_match_illust,
}


# ─── Layout helpers ───

def text_centered(draw, y, text, font, color):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y), text, font=font, fill=color)
    return bbox[3] - bbox[1]


def deco_line(draw, y, color, margin=200):
    draw.line([(margin, y), (W // 2 - 18, y)], fill=color, width=1)
    draw.line([(W // 2 + 18, y), (W - margin, y)], fill=color, width=1)
    d = 5
    cx = W // 2
    draw.polygon([(cx, y - d), (cx + d, y), (cx, y + d), (cx - d, y)], fill=color)


# ─── Main cover generator ───

def generate_cover(book):
    img = Image.new('RGB', (W, H), book['bg'])
    draw = ImageDraw.Draw(img)

    f_series = load_font('NotoSansKR-Medium.ttf', 28)
    f_title1 = load_font('NotoSansKR-ExtraBold.ttf', 110)
    f_title2 = load_font('NotoSansKR-ExtraBold.ttf', 110)
    f_sub = load_font('NotoSansKR-Light.ttf', 32)
    f_written = load_font('NotoSansKR-Light.ttf', 22)
    f_author = load_font('NotoSansKR-Bold.ttf', 44)
    f_cred = load_font('NotoSansKR-Light.ttf', 22)
    f_brand = load_font('NotoSansKR-Medium.ttf', 28)

    draw_bg(draw, book)
    draw_rain(draw, book)

    # Top: Series header
    y_top = 95
    draw.line([(100, y_top + 16), (W - 100, y_top + 16)], fill=book['accent'], width=2)
    text_centered(draw, y_top - 4, book['series_label'], f_series, book['text_color'])
    deco_line(draw, y_top + 46, book['accent'], margin=350)

    # Illustration
    ILLUST_BC[book['illust']](draw, book)

    # Title — two lines
    y_title = 1100
    text_centered(draw, y_title, book['title_line1'], f_title1, book['title_color'])
    y_line2 = y_title + 120
    text_centered(draw, y_line2, book['title_line2'], f_title2, book['text_color'])

    # Subtitle
    y_sub = y_line2 + 150
    deco_line(draw, y_sub, book['accent'], margin=280)
    sub_lines = book['subtitle'].split('\n')
    y_st = y_sub + 28
    for line in sub_lines:
        h = text_centered(draw, y_st, line, f_sub, book['text_color'])
        y_st += h + 10
    y_sub_end = y_st + 15
    deco_line(draw, y_sub_end, book['accent'], margin=280)

    # Author
    y_auth = y_sub_end + 60
    text_centered(draw, y_auth, 'W R I T T E N   B Y', f_written, book['text_color'])
    text_centered(draw, y_auth + 45, 'Ksaju Kim', f_author, book['title_color'])
    text_centered(draw, y_auth + 105, 'Certified Korean Saju Counselor \u00b7 15+ Years',
                  f_cred, book['text_color'])

    # Bottom brand
    y_brand = H - 165
    deco_line(draw, y_brand, book['accent'], margin=350)
    text_centered(draw, y_brand + 28, 'S a j u M u s e', f_brand, book['text_color'])

    # Save
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = f"saju-{book['id']}-cover.jpg"
    out = os.path.join(OUTPUT_DIR, filename)
    img.save(out, 'JPEG', quality=95)
    kb = os.path.getsize(out) / 1024
    print(f"  >> {filename} ({kb:.0f} KB)")
    return out


def main():
    print('\nKindle B+C Series Cover Generator\n')
    print('── B Series (Life Code) ──')
    for book in B_BOOKS:
        print(f'  {book["title_line1"]} {book["title_line2"]}...')
        generate_cover(book)
    print('\n── C Series (Match Code) ──')
    for book in C_BOOKS:
        print(f'  {book["title_line1"]} {book["title_line2"]}...')
        generate_cover(book)
    print(f'\nDone — {len(B_BOOKS) + len(C_BOOKS)} covers generated.\n')


if __name__ == '__main__':
    main()
