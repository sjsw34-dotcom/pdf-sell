"""
PDF용 NotoSansKR 폰트 서브셋 생성 스크립트.
src/ 디렉토리의 모든 .ts/.tsx 파일에서 한글/한자를 추출하고,
추가로 납음오행 30종 + Claude 출력에 등장할 수 있는 사주 용어를 포함.

Usage:
  python scripts/build-font-subset.py
"""

import os
import re
import subprocess
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS_DIR = os.path.join(PROJECT_ROOT, "public", "fonts")
SRC_DIR = os.path.join(PROJECT_ROOT, "src")

# ─── 납음오행 30종 (동적 데이터, 코드에 없을 수 있음) ───
NAPEUM_VALUES = [
    "해중금", "노중화", "대림목", "노방토", "검봉금", "산두화",
    "간하수", "성두토", "백랍금", "양류목", "장류수", "사중금",
    "산하화", "평지목", "벽상토", "금박금", "복등화", "천하수",
    "대역토", "차천금", "상자목", "대계수", "사중토", "천상화",
    "석류목", "대해수", "송백목", "벽력화", "천중수", "옥상토",
]

# ─── Claude 출력에 등장하는 사주 한자 (시스템 프롬프트에서 지시) ───
EXTRA_HANJA = (
    "甲乙丙丁戊己庚辛壬癸"  # 천간
    "子丑寅卯辰巳午未申酉戌亥"  # 지지
    "比肩劫財食神傷官偏正印"  # 십신
    "用喜忌仇閑"  # 용신
    "長生沐浴冠帶建祿帝旺衰病死墓絶胎養"  # 십이운성
    "陰陽五行木火土金水"  # 음양오행
    "四柱原局表天干地支十星運納音"  # 테이블 헤더
    "時日月年"  # 주
    "神殺空亡貴人德文昌福極廚學堂曲"  # 신살 관련
    "館輿暗祿協譽門桃花驛馬華蓋紅艶將羊刃反安怪強"
    "白虎懸針望劫才災遠進落定淫着孤蘭"
    "大海中路傍劍鋒山頭澗下城壁蠟柳流沙平石榴松柏霹靂泉屋上覆燈河溪釵釧桑柘箔"  # 납음 한자
    "명리학"  # 사주명리학 (한자 아니지만 Claude 출력에 포함됨)
)

# ─── 추가 한글: Claude가 생성하는 분석문에 나올 수 있는 사주 용어 ───
EXTRA_KOREAN = (
    "사주팔자명리학운명분석서"
    "음양조화오행분포도"
    "용신분석희기구한"
    "천간지지십성운납음오행"
    "시일월년주"
    "비견겁재식신상관편정인"
    "장생목욕관대건록제왕쇠병사묘절태양"
    "대년월일운"
    "신살공망귀인덕문창복극천주학당곡"
    "관귀학관금여암협명예살문성"
    "도화역마화개홍염장양인반안괴강"
    "백호현침망겁재천지년월육해원진낙정비음착고란"
    "남여나이세"
    "간하수중벽상토노방검봉산두"
    "성두백랍양류장류사중금산하평지"
    "금박복등천하대역차천상자대계사중토천상석류대해송백벽력천중옥상"
    "극신약실령세봉법거법"
    "지장간여중본기"
    "강약"
    "격국"
    "일간나"
)


def extract_cjk_from_files(src_dir: str) -> set[str]:
    """src/ 내 모든 .ts/.tsx 파일에서 한글(AC00-D7AF) + 한자(4E00-9FFF, 3400-4DBF) 추출."""
    chars: set[str] = set()
    # CJK: Hangul Syllables + CJK Unified Ideographs + CJK Ext A
    cjk_pattern = re.compile(r"[\uAC00-\uD7AF\u4E00-\u9FFF\u3400-\u4DBF]")

    for root, _dirs, files in os.walk(src_dir):
        for fname in files:
            if not fname.endswith((".ts", ".tsx")):
                continue
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, encoding="utf-8") as f:
                    text = f.read()
                chars.update(cjk_pattern.findall(text))
            except Exception:
                pass
    return chars


def build_charset() -> str:
    """서브셋에 포함할 전체 문자 집합 반환."""
    chars: set[str] = set()

    # 1) 소스 코드에서 자동 추출
    chars.update(extract_cjk_from_files(SRC_DIR))

    # 2) 납음오행 30종
    for val in NAPEUM_VALUES:
        chars.update(val)

    # 3) 추가 한자
    chars.update(EXTRA_HANJA)

    # 4) 추가 한글
    chars.update(EXTRA_KOREAN)

    # 5) ASCII 기본 (space ~ tilde)
    for i in range(0x20, 0x7F):
        chars.add(chr(i))

    # 6) 일반 라틴 확장 + 특수문자
    extras = "—–·•…''""©®™°±×÷€£¥₩§¶†‡←→↑↓♠♥♦♣★☆○●◆◇▲△▼▽■□▪▫"
    chars.update(extras)

    # 7) 숫자, 한글 자모 (ㄱ-ㅎ, ㅏ-ㅣ)
    for i in range(0x3131, 0x3164):  # ㄱ ~ ㅣ
        chars.add(chr(i))

    # 8) Full Hangul Syllables (한글 본문 텍스트용 — 한국어 PDF 지원)
    for i in range(0xAC00, 0xD7B0):  # 11,172자
        chars.add(chr(i))

    return "".join(sorted(chars))


def run_subset(src_font: str, dst_font: str, charset: str) -> None:
    """pyftsubset으로 서브셋 생성."""
    import tempfile

    # 문자를 유니코드 코드포인트 목록으로 변환 → 파일에 저장 (명령행 길이 초과 방지)
    unicodes = ",".join(f"U+{ord(c):04X}" for c in charset)

    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False, encoding="utf-8") as f:
        f.write(unicodes)
        unicodes_file = f.name

    try:
        cmd = [
            sys.executable, "-m", "fontTools.subset",
            src_font,
            f"--output-file={dst_font}",
            f"--unicodes-file={unicodes_file}",
            "--layout-features=*",
            "--flavor=",  # TTF 유지 (react-pdf 호환)
            "--no-hinting",
            "--desubroutinize",
        ]

        print(f"  Subsetting: {os.path.basename(src_font)} → {os.path.basename(dst_font)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  ERROR: {result.stderr}")
            sys.exit(1)

        src_size = os.path.getsize(src_font)
        dst_size = os.path.getsize(dst_font)
        print(f"  {src_size:,} bytes → {dst_size:,} bytes ({dst_size/src_size*100:.1f}%)")
    finally:
        os.unlink(unicodes_file)


def main() -> None:
    charset = build_charset()
    hangul_count = sum(1 for c in charset if "\uAC00" <= c <= "\uD7AF")
    hanja_count = sum(1 for c in charset if "\u4E00" <= c <= "\u9FFF" or "\u3400" <= c <= "\u4DBF")
    print(f"Character set: {len(charset)} total ({hangul_count} hangul, {hanja_count} hanja)")

    pairs = [
        ("NotoSansKR-Regular.ttf", "NotoSansKR-Regular-subset.ttf"),
        ("NotoSansKR-Bold.ttf", "NotoSansKR-Bold-subset.ttf"),
    ]

    for src_name, dst_name in pairs:
        src_path = os.path.join(FONTS_DIR, src_name)
        dst_path = os.path.join(FONTS_DIR, dst_name)
        if not os.path.exists(src_path):
            print(f"  SKIP: {src_name} not found")
            continue
        run_subset(src_path, dst_path, charset)

    print("\nDone! Subset fonts updated.")


if __name__ == "__main__":
    main()
