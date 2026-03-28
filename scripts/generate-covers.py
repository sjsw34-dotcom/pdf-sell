#!/usr/bin/env python3
"""
Kindle Element Identity Series — Cover Generator v2
Matches the original Wood cover's proportions and feel.
Usage: PYTHONIOENCODING=utf-8 python scripts/generate-covers.py
Output: output/kindle-series/{element}-people-cover.jpg
"""

import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

# ─── Config ───

W, H = 1600, 2560
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'output', 'kindle-series')
FONTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'fonts')

BOOKS = [
    {
        'id': 'wood',
        'title': 'Wood',
        'subtitle': "The Grower's Guide to\nLife, Love & Career",
        'bg': (18, 38, 18),
        'bg_light': (25, 50, 25),
        'accent': (76, 140, 50),
        'accent_light': (110, 180, 70),
        'accent_pale': (150, 210, 120),
        'accent_muted': (60, 100, 45),
        'text_color': (150, 195, 130),
        'title_color': (255, 255, 255),
        'line_color': (60, 90, 50),
        'rain_color': (25, 50, 22),
    },
    {
        'id': 'fire',
        'title': 'Fire',
        'subtitle': "The Spark's Guide to\nLife, Love & Career",
        'bg': (38, 16, 12),
        'bg_light': (55, 22, 16),
        'accent': (220, 90, 30),
        'accent_light': (255, 140, 50),
        'accent_pale': (255, 200, 100),
        'accent_muted': (160, 60, 20),
        'text_color': (220, 170, 140),
        'title_color': (255, 255, 255),
        'line_color': (90, 40, 25),
        'rain_color': (45, 20, 14),
    },
    {
        'id': 'earth',
        'title': 'Earth',
        'subtitle': "The Builder's Guide to\nLife, Love & Career",
        'bg': (32, 25, 14),
        'bg_light': (45, 35, 20),
        'accent': (185, 145, 65),
        'accent_light': (215, 180, 95),
        'accent_pale': (235, 210, 150),
        'accent_muted': (140, 110, 50),
        'text_color': (200, 180, 140),
        'title_color': (255, 255, 255),
        'line_color': (75, 58, 30),
        'rain_color': (38, 30, 16),
    },
    {
        'id': 'metal',
        'title': 'Metal',
        'subtitle': "The Refiner's Guide to\nLife, Love & Career",
        'bg': (18, 18, 25),
        'bg_light': (28, 28, 38),
        'accent': (155, 165, 185),
        'accent_light': (195, 205, 220),
        'accent_pale': (220, 225, 238),
        'accent_muted': (110, 115, 135),
        'text_color': (175, 180, 200),
        'title_color': (255, 255, 255),
        'line_color': (55, 58, 72),
        'rain_color': (22, 22, 32),
    },
    {
        'id': 'water',
        'title': 'Water',
        'subtitle': "The Seeker's Guide to\nLife, Love & Career",
        'bg': (10, 16, 38),
        'bg_light': (16, 24, 52),
        'accent': (55, 115, 210),
        'accent_light': (90, 155, 245),
        'accent_pale': (150, 200, 255),
        'accent_muted': (40, 80, 155),
        'text_color': (140, 175, 230),
        'title_color': (255, 255, 255),
        'line_color': (30, 45, 80),
        'rain_color': (14, 22, 45),
    },
]


def load_font(name, size):
    path = os.path.join(FONTS_DIR, name)
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


# ─── Background ───

def draw_bg(draw, book):
    """Subtle radial gradient — lighter in the upper center."""
    bg = book['bg']
    bgl = book['bg_light']
    cx, cy = W // 2, H // 3
    max_d = 1400.0

    # Paint in horizontal strips for speed
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
    """Subtle vertical rain dashes."""
    rc = book['rain_color']
    random.seed(42 + hash(book['id']))
    for _ in range(100):
        x = random.randint(80, W - 80)
        y0 = random.randint(250, H - 150)
        ln = random.randint(30, 140)
        c = tuple(min(255, ch + random.randint(8, 18)) for ch in rc)
        draw.line([(x, y0), (x, y0 + ln)], fill=c, width=1)


# ─── Illustrations (tall, 40%+ of cover height) ───

def draw_wood_illust(draw, book):
    """Tall tree — thin trunk, branches angling right, circles cascading right."""
    cx = W // 2 + 20
    trunk_bot = 1100
    trunk_top = 340

    # Trunk
    draw.line([(cx, trunk_bot), (cx, trunk_top)], fill=book['accent'], width=4)

    # Branches — angled lines going right/left from trunk
    branches = [
        (trunk_top + 60,  35, 260),
        (trunk_top + 130, 20, 300),
        (trunk_top + 200, 10, 280),
        (trunk_top + 280, -5, 240),
        (trunk_top + 350, 15, 200),
        (trunk_top + 450, -10, 180),
        (trunk_top + 140, -30, 200),
        (trunk_top + 250, -25, 160),
    ]
    for (by, angle_deg, length) in branches:
        rad = math.radians(angle_deg - 90)
        ex = cx + int(length * math.cos(rad))
        ey = by + int(length * math.sin(rad))
        draw.line([(cx, by), (ex, ey)], fill=book['accent'], width=2)

    # Roots
    for dx, dy in [(-50, 35), (-25, 28), (0, 20), (25, 30), (50, 38)]:
        draw.line([(cx, trunk_bot), (cx + dx, trunk_bot + dy)], fill=book['accent'], width=2)

    # Circle leaves — cascading down-right, matching original
    random.seed(111)
    colors = [book['accent'], book['accent_light'], book['accent_pale'],
              book['accent_muted'], book['accent'], book['accent_light']]

    for _ in range(70):
        # Bias rightward and spread vertically
        ox = random.randint(-100, 250)
        oy = random.randint(-50, 680)
        # More circles on the right
        if ox < 0 and random.random() > 0.35:
            ox = -ox
        r = random.randint(12, 42)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
        draw.ellipse([cx + ox - r, trunk_top + oy - r, cx + ox + r, trunk_top + oy + r], fill=col)


def draw_fire_illust(draw, book):
    """Tall flame — rising column of circles, narrow at top, wide at base."""
    cx = W // 2
    base_y = 1100
    top_y = 300

    random.seed(222)
    colors = [book['accent'], book['accent_light'], book['accent_pale'],
              (255, 80, 25), (255, 160, 40), book['accent_muted']]

    height = base_y - top_y
    # Main flame body — circles from base to top
    for _ in range(80):
        progress = random.random()  # 0=base, 1=top
        # Wider at bottom, narrower at top
        max_spread = int(160 * (1 - progress * 0.7))
        ox = random.randint(-max_spread, max_spread)
        # Slight rightward lean at top (like wind)
        ox += int(progress * 40)
        y = base_y - int(progress * height)
        # Smaller circles higher up
        r = int(random.randint(10, 45) * (1 - progress * 0.55))
        r = max(4, r)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-20, 20))) for c in col)
        draw.ellipse([cx + ox - r, y - r, cx + ox + r, y + r], fill=col)

    # Sparks — tiny dots scattered above
    for _ in range(25):
        ox = random.randint(-200, 200)
        y = top_y + random.randint(-80, 100)
        r = random.randint(3, 9)
        col = random.choice([book['accent_pale'], book['accent_light'], (255, 220, 120)])
        draw.ellipse([cx + ox - r, y - r, cx + ox + r, y + r], fill=col)

    # Base glow — larger dim circles at bottom
    for _ in range(10):
        ox = random.randint(-80, 80)
        y = base_y + random.randint(-30, 30)
        r = random.randint(25, 50)
        col = tuple(max(0, c - 50) for c in book['accent'])
        draw.ellipse([cx + ox - r, y - r, cx + ox + r, y + r], fill=col)


def draw_earth_illust(draw, book):
    """Layered mountains with circles along ridges — tall composition."""
    cx = W // 2
    base_y = 1100

    # Mountain layers — back to front
    layers = [
        {'peak_x': cx - 60, 'peak_y': 340, 'width': 650, 'darken': 0},
        {'peak_x': cx + 120, 'peak_y': 420, 'width': 550, 'darken': 12},
        {'peak_x': cx + 10, 'peak_y': 520, 'width': 700, 'darken': 25},
        {'peak_x': cx - 100, 'peak_y': 650, 'width': 500, 'darken': 35},
    ]

    for layer in layers:
        px, py = layer['peak_x'], layer['peak_y']
        w = layer['width']
        d = layer['darken']
        col = tuple(max(0, c - d) for c in book['accent'])

        # Mountain polygon with slight sub-peaks
        points = [
            (px - w, base_y),
            (px - w // 3, py + 80),
            (px - w // 6, py + 30),
            (px, py),
            (px + w // 5, py + 50),
            (px + w // 3, py + 70),
            (px + w, base_y),
        ]
        draw.polygon(points, fill=col)

    # Ridge lines (thin, lighter)
    for layer in layers[:2]:
        px, py = layer['peak_x'], layer['peak_y']
        w = layer['width']
        draw.line([(px - w // 3, py + 80), (px, py), (px + w // 3, py + 70)],
                  fill=book['accent_light'], width=1)

    # Floating circles along the peaks
    random.seed(333)
    colors = [book['accent_light'], book['accent_pale'], book['accent'],
              book['accent_muted']]
    for _ in range(50):
        ox = random.randint(-280, 280)
        oy = random.randint(300, 900)
        r = random.randint(8, 30)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-15, 15))) for c in col)
        x, y = cx + ox, oy
        draw.ellipse([x - r, y - r, x + r, y + r], fill=col)

    # Ground line
    draw.line([(cx - 350, base_y), (cx + 350, base_y)], fill=book['accent'], width=2)


def draw_metal_illust(draw, book):
    """Central diamond/gem with concentric rings and orbiting dots — tall."""
    cx = W // 2
    cy = 680

    # Large diamond
    dh, dw = 340, 200
    pts = [(cx, cy - dh), (cx + dw, cy), (cx, cy + dh // 2 + 40), (cx - dw, cy)]
    draw.polygon(pts, outline=book['accent'], width=3)

    # Inner facet lines
    for p in pts:
        for q in pts:
            if p != q:
                draw.line([p, q], fill=book['line_color'], width=1)
    # Center vertical
    draw.line([(cx, cy - dh), (cx, cy + dh // 2 + 40)], fill=book['line_color'], width=1)

    # Concentric circle rings
    for radius in [230, 300, 380, 460]:
        draw.arc([cx - radius, cy - radius, cx + radius, cy + radius],
                 0, 360, fill=book['line_color'], width=1)

    # Dots along rings
    random.seed(444)
    for radius in [230, 300, 380, 460]:
        n_dots = int(radius / 20)
        for _ in range(n_dots):
            a = random.uniform(0, 2 * math.pi)
            x = cx + int(radius * math.cos(a))
            y = cy + int(radius * math.sin(a))
            r = random.randint(3, 14)
            col = random.choice([book['accent'], book['accent_light'], book['accent_pale']])
            draw.ellipse([x - r, y - r, x + r, y + r], fill=col)

    # Scattered floating circles (star-like)
    for _ in range(20):
        a = random.uniform(0, 2 * math.pi)
        dist = random.randint(100, 500)
        x = cx + int(dist * math.cos(a))
        y = cy + int(dist * math.sin(a) * 0.9)
        r = random.randint(4, 18)
        col = random.choice([book['accent_light'], book['accent_pale'], book['accent_muted']])
        draw.ellipse([x - r, y - r, x + r, y + r], fill=col)


def draw_water_illust(draw, book):
    """Flowing wave lines with circles — tall, spanning most of the upper area."""
    cx = W // 2
    base_y = 500  # center of wave composition
    spread = 400  # vertical spread

    random.seed(555)

    # Wave lines — sinusoidal curves spread vertically
    wave_configs = [
        {'y_off': -280, 'amp': 55, 'freq': 1.5, 'width': 3},
        {'y_off': -180, 'amp': 65, 'freq': 2.0, 'width': 2},
        {'y_off': -80, 'amp': 50, 'freq': 1.3, 'width': 3},
        {'y_off': 20, 'amp': 70, 'freq': 1.8, 'width': 2},
        {'y_off': 120, 'amp': 45, 'freq': 2.3, 'width': 3},
        {'y_off': 220, 'amp': 60, 'freq': 1.6, 'width': 2},
        {'y_off': 320, 'amp': 40, 'freq': 2.5, 'width': 2},
    ]

    colors_wave = [book['accent'], book['accent_light'], book['accent_muted'],
                   book['accent'], book['accent_light']]

    for i, wc in enumerate(wave_configs):
        pts = []
        for x in range(150, W - 150, 3):
            t = (x - 150) / (W - 300)
            phase = i * 0.7
            y = base_y + wc['y_off'] + int(wc['amp'] * math.sin(t * math.pi * wc['freq'] * 2 + phase))
            pts.append((x, y))
        if len(pts) > 1:
            draw.line(pts, fill=colors_wave[i % len(colors_wave)], width=wc['width'])

    # Circles — scattered across the wave field
    colors = [book['accent'], book['accent_light'], book['accent_pale'],
              book['accent_muted'], (70, 140, 240)]
    for _ in range(60):
        ox = random.randint(-350, 350)
        oy = random.randint(-350, 400)
        r = random.randint(8, 35)
        col = random.choice(colors)
        col = tuple(max(0, min(255, c + random.randint(-20, 20))) for c in col)
        x = cx + ox
        y = base_y + oy
        draw.ellipse([x - r, y - r, x + r, y + r], fill=col)

    # Central moon/portal circle — outline only
    mr = 55
    draw.ellipse([cx - mr, base_y - mr, cx + mr, base_y + mr],
                 outline=book['accent_pale'], width=2)


ILLUST_FN = {
    'wood': draw_wood_illust,
    'fire': draw_fire_illust,
    'earth': draw_earth_illust,
    'metal': draw_metal_illust,
    'water': draw_water_illust,
}


# ─── Layout helpers ───

def text_centered(draw, y, text, font, color):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y), text, font=font, fill=color)
    return bbox[3] - bbox[1]


def deco_line(draw, y, color, margin=200):
    """Thin line with center diamond."""
    draw.line([(margin, y), (W // 2 - 18, y)], fill=color, width=1)
    draw.line([(W // 2 + 18, y), (W - margin, y)], fill=color, width=1)
    d = 5
    cx = W // 2
    draw.polygon([(cx, y - d), (cx + d, y), (cx, y + d), (cx - d, y)], fill=color)


# ─── Main cover generator ───

def generate_cover(book):
    img = Image.new('RGB', (W, H), book['bg'])
    draw = ImageDraw.Draw(img)

    # Fonts
    f_series = load_font('NotoSansKR-Medium.ttf', 28)
    f_title = load_font('NotoSansKR-ExtraBold.ttf', 160)
    f_people = load_font('NotoSansKR-Light.ttf', 80)
    f_sub = load_font('NotoSansKR-Light.ttf', 34)
    f_written = load_font('NotoSansKR-Light.ttf', 22)
    f_author = load_font('NotoSansKR-Bold.ttf', 44)
    f_cred = load_font('NotoSansKR-Light.ttf', 22)
    f_brand = load_font('NotoSansKR-Medium.ttf', 28)

    # ── Background ──
    draw_bg(draw, book)
    draw_rain(draw, book)

    # ── Top: Series header ──
    y_top = 95
    # Horizontal accent line
    draw.line([(100, y_top + 16), (W - 100, y_top + 16)], fill=book['accent'], width=2)
    text_centered(draw, y_top - 4, 'E L E M E N T   I D E N T I T Y   S E R I E S',
                  f_series, book['text_color'])
    deco_line(draw, y_top + 46, book['accent'], margin=350)

    # ── Illustration (occupies ~y=250 to y=1100) ──
    ILLUST_FN[book['id']](draw, book)

    # ── Title — tight below illustration ──
    y_title = 1140
    text_centered(draw, y_title, book['title'], f_title, book['title_color'])
    y_people = y_title + 155
    text_centered(draw, y_people, 'People', f_people, book['text_color'])

    # ── Subtitle with decorative lines ──
    y_sub = y_people + 110
    deco_line(draw, y_sub, book['accent'], margin=280)

    sub_lines = book['subtitle'].split('\n')
    y_st = y_sub + 28
    for line in sub_lines:
        h = text_centered(draw, y_st, line, f_sub, book['text_color'])
        y_st += h + 10

    y_sub_end = y_st + 15
    deco_line(draw, y_sub_end, book['accent'], margin=280)

    # ── Author ──
    y_auth = y_sub_end + 70
    text_centered(draw, y_auth, 'W R I T T E N   B Y', f_written, book['text_color'])
    text_centered(draw, y_auth + 45, 'Ksaju Kim', f_author, book['title_color'])
    text_centered(draw, y_auth + 105, 'Certified Korean Saju Counselor \u00b7 15+ Years',
                  f_cred, book['text_color'])

    # ── Bottom brand ──
    y_brand = H - 165
    deco_line(draw, y_brand, book['accent'], margin=350)
    text_centered(draw, y_brand + 28, 'S a j u M u s e', f_brand, book['text_color'])

    # ── Save ──
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out = os.path.join(OUTPUT_DIR, f"{book['id']}-people-cover.jpg")
    img.save(out, 'JPEG', quality=95)
    kb = os.path.getsize(out) / 1024
    print(f"  >> {book['id']}-people-cover.jpg ({kb:.0f} KB)")
    return out


def main():
    print('\nKindle Cover Generator v2\n')
    for book in BOOKS:
        print(f'  {book["title"]} People...')
        generate_cover(book)
    print('\nDone - 5 covers generated.\n')


if __name__ == '__main__':
    main()
