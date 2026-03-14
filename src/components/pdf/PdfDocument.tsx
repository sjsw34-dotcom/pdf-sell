import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { TierCode } from '@/lib/types/tier';
import type { SajuData } from '@/lib/types/saju';
import { getThemeStyles } from './styles/themes';
import { CoverPage } from './CoverPage';
import { IntroPage } from './IntroPage';
import { SajuChart } from './SajuChart';
import { YongsinChart } from './YongsinChart';
import { YinyangChart } from './YinyangChart';
import { ChapterPage } from './ChapterPage';
import { PartHeader } from './PartHeader';
import { ShinsalTable } from './ShinsalTable';
import { DaeunTimeline } from './DaeunTimeline';
import { NyununCard } from './NyununCard';
import { WolunCard } from './WolunCard';
import { CalloutBox } from './CalloutBox';
import { EndingPage } from './EndingPage';

// ═══════════════════════════════════════════════════════════════
// 더미 텍스트 — Claude API 연동 전 테스트용
// ═══════════════════════════════════════════════════════════════

const D: Record<string, string> = {
  // ─── Basic ───
  overview: `Your Four Pillars reveal a deeply introspective nature shaped by the interplay of Metal and Earth energies. As a Day Master born under the sign of Eul-Wood (乙), you carry the essence of a flexible vine — adaptable, resilient, and quietly persistent. While your outward demeanor may appear gentle and yielding, beneath the surface lies a tenacious spirit that finds creative ways to grow even in the harshest conditions.

The dominance of Indirect Officer (偏官) energy across three of your four pillars suggests a life shaped by external pressures and challenges. Rather than breaking under these forces, you have developed an extraordinary ability to transform adversity into fuel for personal growth.

Your elemental balance shows a notable absence of Water energy, which represents wisdom and adaptability in the traditional Five Elements system. This void is significant — it indicates that your Key Balancer (用神) element is Wood, supported by Water as your Lucky Support (喜神). Actively inviting these energies into your life through career choices, relationships, and daily habits will be essential for maintaining equilibrium.

The presence of Decline (衰) and Extinction (絶) life stages across your pillars might sound concerning at first glance, but in the language of Saju, these stages represent powerful phases of transformation and rebirth. You are someone who operates best when you strip away the unnecessary and rebuild from a foundation of clarity and purpose.`,

  personality: `Your Day Pillar of Eul-Mok (乙) seated on Yu-Metal (酉) creates a fascinating tension between your inner nature and your outer circumstances. The tender vine growing upon hard metal — this is your fundamental life metaphor. You possess an almost paradoxical combination of gentleness and steel-like determination.

In social settings, you tend to observe before you engage. Your Creative Expression (食神) energy in the Hour Pillar gives you a natural gift for communication and artistic endeavors, though you may not always recognize this talent in yourself.

The concentration of Indirect Wealth (偏財) energy — appearing three times in your chart — points to an unconventional relationship with material resources. You are not drawn to traditional paths of wealth accumulation. Instead, financial opportunities come through unexpected channels, creative ventures, or helping others solve problems.

Your Very Gentle Energy (極身弱) classification indicates a person whose strength lies in flexibility, intuition, and the ability to navigate complex situations with grace. Like water finding its way through rock, your power is in persistence and adaptability rather than brute strength.`,

  fortune: `Looking at the broader arc of your destiny through the lens of the Five Elements, the coming decade holds particular significance. With Wood as your Key Balancer, periods when Wood energy is strong in the cosmic cycle will be your most auspicious times for major decisions.

Your current Major Luck Cycle brings a shift toward more supportive energies. The presence of your Parallel (比肩) and Rob Wealth (劫財) energies in the approaching cycles suggests a period where collaboration and partnership will be more fruitful than solo endeavors.

The Metal energy that dominates your natal chart — while classified as your Challenge Element (忌神) — has also gifted you with precision, attention to detail, and an innate sense of justice. The key is not to eliminate this energy but to balance it.

Your chart carries a strong scholarly influence, with multiple indicators pointing toward success in fields requiring deep analysis, research, or creative problem-solving.`,

  // ─── Part 1: 사주상세분석 ───
  part1_ch1: `The architecture of your Four Pillars tells a story of quiet transformation. Your Hour Pillar — governed by the Ding-Fire (丁) Heavenly Stem — acts as a beacon of Creative Expression (食神), illuminating your inner world with artistic sensitivity and an instinct for turning abstract ideas into tangible form. This fire is subtle, like candlelight rather than wildfire, and it reveals itself in moments of genuine connection with others.

Your Day Pillar, the seat of your core identity, places Eul-Wood (乙) upon the sharp surface of Yu-Metal (酉). This combination is rare and significant. In classical Saju interpretation, it speaks of a person who must learn to thrive in environments that seem inhospitable. The vine does not fight the metal — it wraps around it, finding every crevice and gap to continue its upward climb.

The Month and Year Pillars both carry Shin-Metal (辛) as their Heavenly Stems, creating a powerful echo of Indirect Officer (偏官) energy. This doubled pressure from Metal is the defining characteristic of your chart. It suggests that authority figures, institutional structures, and external expectations have played — and will continue to play — a significant role in shaping your life path.`,

  part1_ch2: `The Hidden Stems within your Earthly Branches reveal layers of complexity beneath the surface. In your Hour Pillar's Chou-Earth (丑), three hidden energies coexist: Gui-Water (癸) as your Indirect Seal, Shin-Metal (辛) as another layer of Indirect Officer, and Gi-Earth (己) as Indirect Wealth. This triple-layered foundation suggests that your early environment was rich with intellectual stimulation but also carried an undertone of material concern.

Your Day Pillar's Yu-Metal (酉) holds Geng-Metal (庚) as the Direct Officer and Shin-Metal (辛) as the Indirect Officer in its hidden stems. The absence of a middle hidden stem in Yu is notable — it speaks of directness and clarity in your relationships, even if the path to that clarity is winding.

The Napeum Five Elements — Ganhasoo (간하수), Cheonjungsu (천중수), Byeoksangto (벽상토), and Nobangto (노방토) — paint a landscape of water flowing beneath the earth, striking against walls of clay. This imagery reinforces the theme of hidden depth: your most powerful resources are not immediately visible to others, and even to yourself.`,

  // ─── Part 2: 황금기 ───
  part2_ch1: `Every destiny chart contains what Saju masters call the "Golden Period" — a window of time when the cosmic energies align most favorably with your natal configuration. For your chart, with Wood as the Key Balancer and Water as the Lucky Support, your golden periods correlate strongly with years and decades where these elements are ascendant.

The Major Luck Cycle beginning at age 39 — governed by Eul-Wood (乙) and Sa-Fire (巳) — represents your first significant Golden Period. During this decade, your Day Master finally encounters its own element in the heavenly stem, creating a moment of profound self-recognition and empowerment. The Parallel (比肩) energy of this cycle means you will find kindred spirits, allies who genuinely understand your vision.

The years between ages 49 and 58, under the influence of Byeong-Fire (丙) and O-Fire (午), bring a different kind of golden energy. Here, your Creative Expression energy reaches its zenith. This is the decade for your masterwork — the project, relationship, or personal transformation that defines your legacy.`,

  part2_ch2: `Seasonal timing within each year also matters enormously for your chart. Spring months — February through April — consistently activate your Wood energy, making them ideal for launching new initiatives, signing important agreements, or making relationship decisions. The Earthly Branches of Yin (寅), Myo (卯), and Jin (辰) all support your Day Master.

Conversely, autumn months — particularly September and October when Metal energy peaks — require more caution. These are not bad months, but they demand awareness. The Metal pressure that already dominates your chart intensifies during these periods, which can manifest as increased stress, decision fatigue, or interpersonal friction.

The daily cycle also carries significance. Your birth time places you in the Chou (丑) hour, which means the hours between 1:00 AM and 3:00 AM are when your intuitive powers are at their peak. Many people with this configuration report that their best ideas, clearest insights, and most important revelations come in the quiet hours of early morning.`,

  // ─── Part 3: 연애운 ───
  part3_ch1: `Your romantic destiny is written in the complex interplay between your Day Pillar and the Wealth stars scattered throughout your chart. As an Eul-Wood (乙) Day Master, your natural romantic partner archetype is Earth energy — someone who provides stability, grounding, and a sense of home. The Indirect Wealth (偏財) stars appearing three times in your chart suggest that your love life will rarely follow conventional patterns.

You are drawn to partners who are unconventional in some way — perhaps they come from a different cultural background, work in an unusual field, or have a life philosophy that challenges your assumptions. The triple Indirect Wealth pattern also suggests that you may experience multiple significant romantic connections throughout your life, each one teaching you something essential about yourself.

The Indirect Officer (偏官) energy in your chart adds intensity to your romantic experiences. In love, you tend to be attracted to people who challenge you intellectually and emotionally. Comfortable relationships may feel stagnant to you; you crave a partner who keeps you growing. This is not a flaw — it is the natural expression of your chart's dominant energy.`,

  part3_ch2: `The ideal timing for romantic milestones in your chart follows a specific pattern. The years when Water energy enters through the Annual Fortune — particularly Gui-Water (癸) and Im-Water (壬) years — bring emotional depth and vulnerability that opens the door to genuine intimacy. These are the years when lasting bonds are most likely to form.

Your Spirit Stars add fascinating nuance to your love profile. The presence of Charm & Attraction (桃花殺) in the Day Pillar position suggests a magnetic quality in one-on-one settings. You may not be the loudest person in a crowded room, but in intimate conversation, you possess a compelling presence that draws people into your orbit.

The absence of strong Seal (印) energy in your chart — both Direct and Indirect Seal are minimal — means that you may need to consciously develop emotional self-sufficiency before entering your most important relationship. Partners should complement your energy, not complete it.`,

  // ─── Part 4: 재물운 ───
  part4_ch1: `Your relationship with wealth is defined by the unusual concentration of Indirect Wealth (偏財) energy in your chart. Three out of four Earthly Branches carry this star, creating a powerful but unpredictable financial pattern. Traditional nine-to-five employment and steady salary growth are unlikely to be your primary path to prosperity. Instead, your wealth comes through irregular channels.

The Indirect Wealth pattern favors entrepreneurship, freelance work, commission-based income, investment returns, and windfalls. You have an intuitive sense for opportunities that others overlook. However, this same energy can lead to financial volatility if not managed carefully. The key lesson of triple Indirect Wealth is diversification — never concentrate all resources in a single venture.

Your Key Balancer being Wood suggests that growth-oriented industries are your most fertile ground for wealth creation. Fields related to education, publishing, environmental work, health and wellness, or any sector that involves nurturing growth align with your natal energies. The years when Wood is strong in the cosmic cycle are your best windows for investment and expansion.`,

  part4_ch2: `The Direct Wealth (正財) energy is notably absent from your Heavenly Stems, appearing only in hidden positions within your Earthly Branches. This hidden placement is actually advantageous — it suggests that your most stable income sources will develop gradually and may not be immediately apparent. Think of it as compound interest: slow to start, powerful over time.

Financial caution is warranted during periods when Earth energy is excessive — particularly during years governed by Gi-Earth (己) or Mu-Earth (戊) stems combined with Earth branches. During these periods, the temptation to overextend or take speculative risks increases. Your challenge is to resist the impulse for quick gains and maintain the long-term perspective that your chart ultimately rewards.

Your most financially prosperous decades align with your Golden Periods: ages 39-48 and 49-58. The first brings collaborative wealth — business partnerships, joint ventures, and shared prosperity. The second brings creative wealth — income generated through your unique talents, intellectual property, or artistic output.`,

  // ─── Part 5: 직업운 ───
  part5_ch1: `The career landscape of your Four Pillars points toward vocations that combine intellectual depth with creative expression. The Indirect Officer (偏官) dominance in your chart is strongly associated with careers in specialized fields — research, consulting, analysis, psychology, medicine, law, or technology. You are not a generalist; your professional power comes from mastering a specific domain.

Your Creative Expression (食神) star in the Hour Pillar — the pillar that governs your later career and legacy — suggests that your most fulfilling professional chapter may come later in life. Many people with this configuration spend their twenties and thirties building expertise, only to discover their true calling in their forties or fifties. Patience with your own career trajectory is essential.

The Scholar Star (學堂貴人) and Career & Knowledge (官貴學館) spirit stars in your chart reinforce the academic and intellectual orientation of your professional destiny. Higher education, certifications, and continuous learning are not just nice-to-haves — they are integral to your career advancement.`,

  part5_ch2: `Leadership in your chart takes an unconventional form. You are not a commanding, hierarchical leader. Instead, your influence operates through expertise, mentorship, and quiet authority. People follow you because of what you know and the depth of your insight, not because of your title or position. This style of leadership becomes increasingly effective as you age and your knowledge base deepens.

Remote work, independent consulting, and portfolio careers align particularly well with your chart's energies. The Multiple Indirect Wealth pattern suggests that income from multiple sources will always feel more natural to you than depending on a single employer. The flexibility to choose your projects and set your own pace is not a luxury for your chart — it is a necessity for optimal performance.

Workplace environments heavy in Metal energy — such as finance, military, or rigid corporate hierarchies — may produce results but at a high personal cost. Seek environments that value creativity, independent thinking, and depth over speed. Your ideal workplace feels more like a research lab or artist's studio than a trading floor.`,

  // ─── Part 6: 건강 ───
  part6_ch1: `Your constitutional health profile, as revealed by the Five Elements distribution, shows a significant imbalance that requires conscious attention. The total absence of Water energy (水 = 0) in your chart is the most critical finding. In traditional East Asian medicine, Water governs the kidneys, bladder, reproductive system, and the foundational vital energy (精氣) of the body.

This Water deficiency manifests as a tendency toward kidney fatigue, lower back discomfort, frequent urination, and difficulty maintaining consistent energy levels throughout the day. You may notice that your energy peaks and valleys are more extreme than those of people around you. Hydration is not just a general health recommendation for you — it is a therapeutic necessity.

The excess of Metal energy (金 = 3) can affect the lungs and respiratory system. Metal governs the skin as well, so skin sensitivity, allergies, or respiratory concerns may be recurring themes. Breathing exercises, air purification, and regular exposure to clean outdoor environments are more than wellness trends for your chart — they are constitutional medicine.`,

  part6_ch2: `Seasonal health patterns in your chart follow a predictable rhythm. Autumn and early winter — when Metal and Water dynamics are shifting — tend to be your most vulnerable periods. Strengthening your immune system in late summer (August-September) provides the best preventive strategy.

Your chart responds exceptionally well to Wood-element therapies: forest bathing, herbal medicine (particularly liver-supportive herbs), green foods, and morning stretching routines. The simple act of spending 30 minutes among trees can measurably shift your elemental balance toward greater health.

Stress management is particularly important given your Very Gentle Energy (極身弱) classification. You process stress internally, which means that what appears as calm on the outside may be quietly depleting your resources. Journaling, meditation, or any practice that externalizes your inner processing will significantly improve your long-term health trajectory.`,

  // ─── Part 7: 귀인/신살 ───
  part7_ch1: `The Spirit Stars (神殺) in your chart create a rich tapestry of hidden influences that operate beneath the surface of daily life. Your chart contains several powerful protective stars alongside challenging ones, creating a dynamic tension that keeps your life interesting and your growth continuous.

The Fortune & Blessings (福星貴人) star appears twice — in both the Hour and Month Pillars. This double blessing suggests a fundamental cosmic protection that shields you from the worst outcomes even in difficult periods. People with double Fortune Stars often report experiencing near-misses: situations that could have been catastrophic but somehow resolved at the last moment.

Your Reputation & Honor (名譽殺) star appears three times across your pillars, which is exceptionally rare. This triple configuration suggests that your reputation — how others perceive and speak about you — is a central theme of your life journey. You are someone whose name carries weight, and protecting your professional and personal reputation should be treated as a strategic priority.`,

  part7_ch2: `Among the cautionary stars, the Unexpected Disruption (白虎殺) in your Hour Pillar warrants attention. This star is associated with sudden changes, accidents, or health events that come without warning. Its placement in the Hour Pillar — which governs your later years — suggests that maintaining physical health and safety awareness becomes increasingly important as you age.

The Precision & Tension (懸針殺) star appears in both your Month and Year Pillars. This star is actually double-edged: it gives you extraordinary analytical ability and attention to detail, but it can also manifest as anxiety, overthinking, or difficulty relaxing. Learning to consciously "switch off" your analytical mind is an important life skill for your chart.

Your Inner Wisdom (華蓋殺) and Monthly Caution (月殺) stars suggest a natural inclination toward solitude and introspection. You recharge in quiet environments and may find that your most productive creative work happens when you are alone. This is not antisocial behavior — it is the natural rhythm of your chart's spiritual energy.`,

  // ─── Part 8: 대운/개운 ───
  part8_ch1: `Your Major Luck Cycles (大運) paint a sweeping narrative across nine decades of potential life experience. The early cycles — ages 9 through 28 — are dominated by Seal energy (印星), which explains why your formative years were likely oriented around education, learning, and the influence of mentors or parental figures.

The cycle from age 9 to 18, governed by Im-Water (壬) and Yin-Wood (寅), represents your intellectual awakening. The Rob Wealth (劫財) energy of this period suggests competition — siblings, classmates, or peers who pushed you to develop your abilities. The Traveling Horse (驛馬殺) star in this cycle indicates that travel or relocation may have played a role in your early development.

The current cycle you are entering brings a dramatic shift toward self-expression. The approach of Byeong-Fire (丙) and O-Fire (午) in the age 49-58 cycle will be transformative. Fire energy feeds Wood — your Day Master — creating a period of unprecedented creative output and personal fulfillment. This is the decade to pursue your most ambitious goals without hesitation.`,

  part8_ch2: `Destiny modification (改運) in Saju philosophy is not about changing your fundamental nature but about consciously aligning your daily choices with your chart's optimal energies. For your chart, the most impactful modifications center on increasing Wood and Water energy while moderating Metal influence.

Practical destiny modifications for your chart include: wearing green and blue tones (Wood and Water colors) on important days; choosing east-facing workspaces and living arrangements; incorporating wooden furniture and water features in your environment; timing major decisions during spring months; and building relationships with people whose Day Masters are Water or Wood.

Dietary modifications can also shift your elemental balance. Foods that support your Wood energy include leafy greens, sprouts, and sour-flavored items. Water energy is supported by seaweed, dark-colored foods, and adequate hydration. Reducing excessively spicy foods (Metal energy) during autumn months can help maintain balance during your chart's most vulnerable seasonal period.`,

  // ─── Part 9: 년운 분석 ───
  part9_intro: `The Annual Fortune forecast examines the cosmic weather patterns for each year from 2025 through 2035. Each year brings a unique combination of Heavenly Stem and Earthly Branch energies that interact with your natal chart in specific ways. Understanding these annual patterns allows you to align major life decisions with the most supportive cosmic timing.

The years ahead show a fascinating progression from individual challenge toward collective support. The early years (2025-2028) test your ability to maintain independence while navigating external pressures. The middle years (2029-2031) bring opportunities for consolidation and strategic positioning. The later years (2032-2035) open doors to leadership, mentorship, and the manifestation of long-term visions.

Pay particular attention to years where your Key Balancer (Wood) or Lucky Support (Water) elements appear in the Heavenly Stem — these are your power years for making bold moves. Conversely, years dominated by Metal or Earth stems require patience and defensive strategy rather than aggressive expansion.`,

  part9_ch1: `The year 2025 arrives under the banner of Eul-Wood (乙) and Sa-Fire (巳), bringing your Parallel (比肩) energy to the forefront. This is a year of self-discovery and identity consolidation. The Wood energy of the Heavenly Stem directly strengthens your Day Master, creating a rare moment of elemental support. Use this year to establish foundations that will carry you through the more challenging years ahead.

The year 2026, governed by Byeong-Fire (丙) and O-Fire (午), activates your Creative Expression (食神) energy. This is a year for artistic projects, communication ventures, and sharing your ideas with a wider audience. The double Fire energy may feel intense, but remember: Fire feeds Wood. Your creative output during this year has the potential to generate lasting impact.

The year 2027 brings Ding-Fire (丁) and Mi-Earth (未), shifting toward a more reflective energy. The Indirect Wealth (偏財) in the Earthly Branch suggests unexpected financial opportunities, while the Creative Expression of the Stem encourages you to monetize your creative talents. This is an excellent year for launching a side business or investment portfolio.`,

  part9_ch2: `The years 2028 through 2031 form a critical transition period. Earth and Metal energies dominate these years, creating conditions that challenge your Day Master. These are not years for reckless expansion but for strategic patience. Build your knowledge base, strengthen your network, and prepare for the more favorable energies that follow.

The years 2032 and beyond mark the beginning of a new era in your destiny. The return of Water and Wood energies in the Heavenly Stems creates conditions that haven't existed since your early childhood. This time, however, you approach these supportive energies with decades of wisdom and experience. The combination of youthful elemental support and mature perspective is extraordinarily powerful.

Year 2035, with its double Wood energy (Eul-Wood stem, Myo-Wood branch), represents the apex of this favorable period. If there is a single year in the next decade where you should make your most ambitious move — whether that's a career change, a major relationship decision, or a creative masterwork — this is it. The cosmos will not offer this level of Wood support again for another sixty years.`,

  // ─── Part 10: 월운 분석 ───
  part10_intro: `The Monthly Fortune provides granular guidance for navigating each month within the current and upcoming year. While Annual Fortune reveals the overarching theme, Monthly Fortune identifies specific windows of opportunity and periods requiring caution. For a chart as elementally specific as yours, monthly timing can make the difference between breakthrough and setback.

Each month carries its own Heavenly Stem and Earthly Branch, creating a unique energetic signature that interacts with both your natal chart and the current year's energy. Months where Wood or Water appear in the Heavenly Stem tend to be your most productive and emotionally balanced periods. Metal-heavy months require extra self-care and strategic patience.

The monthly patterns also reveal optimal timing for specific activities: career moves, financial decisions, health initiatives, and relationship milestones each have their ideal monthly windows. Use this section as a practical planning tool — a cosmic calendar for aligning your actions with the most supportive available energy.`,

  part10_ch1: `The first quarter of the year (January through March) shows a progression from Earth-heavy energy to Wood-dominant energy. January, governed by Gi-Earth (己) and Chou-Earth (丑), is a month for planning and reflection rather than action. Your Indirect Wealth energy is doubled during this month, which can create restless financial thinking — resist the urge to make impulsive investment decisions.

February brings a dramatic shift as Geng-Metal (庚) and Yin-Wood (寅) energies create a tension between pressure and growth. The Rob Wealth (劫財) energy in the Branch suggests competition — be aware of colleagues or rivals who may be positioning against you. However, the Heavenly Blessing (天德貴人) and Monthly Blessing (月德貴人) spirit stars provide protective energy.

March marks the entry of Shin-Metal (辛) and Myo-Wood (卯) — your Day Master's own Branch. This is one of the most powerful months in your annual cycle. The Self-Made Success (建祿) star activates, giving you enhanced confidence and decisiveness. New projects launched in March have an especially high probability of success.`,

  part10_ch2: `The second quarter (April through June) brings a fascinating progression of energies. April's Im-Water (壬) and Jin-Earth (辰) combination activates your Direct Seal (正印) energy — this is an excellent month for learning, studying, and absorbing new information. The Warrior Spirit (羊刃殺) star adds intensity to your focus.

May shifts toward Gui-Water (癸) and Sa-Fire (巳), creating a month where intuition and logic work in unusually harmonious concert. The Golden Carriage (金輿) and Career & Knowledge (官貴學館) stars suggest professional recognition or advancement. If you have been preparing for a promotion or career transition, May is your optimal launch window.

June brings the warmth of Gap-Wood (甲) and O-Fire (午), activating your Rob Wealth and Creative Expression energies simultaneously. This is a month of intense creative output and social engagement. The Academic Excellence (文昌貴人) and Grand Destiny (太極貴人) stars create conditions favorable for public speaking, publishing, or any activity that puts your ideas before an audience.`,

  // ─── Premium 전용: 올해 운세 ───
  this_year_forecast: `The year 2026 — governed by Byeong-Fire (丙) in the Heavenly Stem and O-Fire (午) in the Earthly Branch — carries extraordinary significance for your chart, Valued Guest. As an Eul-Wood (乙) Day Master, Fire is the element that your Wood feeds, making this a year of Creative Expression (食神) energy at its peak.

This is a year where your natural talents demand to be expressed. Projects you have been quietly developing, ideas you have been nurturing in private, relationships you have been carefully tending — 2026 is the year they step into the light. The double Fire energy creates a combustion of creative output that feels almost effortless.

Your monthly fortune reveals a clear rhythm: the first quarter (January-March) is for strategic planning and planting seeds. The second quarter (April-June) brings the year's most powerful momentum — May and June in particular carry Academic Excellence and Grand Destiny stars that favor public visibility. The third quarter requires careful energy management as Metal energy intensifies. The fourth quarter closes with a burst of renewal energy, setting the stage for 2027.

Key action items for 2026: Launch your most important creative project between March and June. Schedule critical presentations, negotiations, or relationship conversations during Wood-friendly months. Monitor your health during September-October when Metal pressure peaks. End the year with a clear vision document for the next phase of your journey.`,

  // ─── Premium 전용: 년도별 개별 분석 ───
  year_2025: `The year 2025 arrives under the banner of Eul-Wood (乙) and Sa-Fire (巳), bringing your Self & Independence (Parallel / 比肩) energy to the forefront. This is a year of identity consolidation — a rare window where your Day Master receives direct elemental support from the cosmic weather. You feel more "yourself" than you have in years, and this clarity of self becomes the foundation for everything that follows.

The Sa-Fire (巳) in the Earthly Branch activates your Bold Innovation (Hurting Officer / 傷官) energy, suggesting that 2025 is also a year where convention feels suffocating. You may feel compelled to break from routines, challenge assumptions, or pursue unconventional paths. The Travel & Change (驛馬殺) star reinforces this restless energy — relocation, travel, or a major environmental shift is likely.

Q1: Focus on self-assessment and clearing old obligations. Q2: Your most creative and socially active period. Q3: Financial opportunities emerge — evaluate carefully. Q4: Consolidate gains and prepare for the Fire-dominant 2026.`,

  year_2026: `The year 2026, governed by Byeong-Fire (丙) and O-Fire (午), is one of the most significant years in this decade for your chart. Fire feeds your Wood Day Master, creating conditions of natural warmth, confidence, and magnetic attraction. Your Creative Expression (食神) energy reaches its annual peak, making this the ideal year for artistic projects, public speaking, and sharing your vision with a wider audience.

The Hidden Friction (六害殺) and Yearly Caution (年殺) stars add a layer of complexity — not everything will come easily. Relationships may require extra attention, and misunderstandings could arise in professional settings. The key is to lead with your Creative Expression energy rather than pushing against obstacles with force.

The Academic Excellence (文昌貴人), Grand Destiny (太極貴人), and Pillar of Support (天廚貴人) spirit stars create a powerful support network. Mentors, sponsors, and unexpected allies appear when you need them most. Say yes to invitations. Accept help graciously.

Q1: Building momentum, financial planning. Q2: Peak creative output and visibility. Q3: Relationship management and health focus. Q4: Harvest and strategic positioning for 2027.`,

  year_2027: `The year 2027 brings Ding-Fire (丁) and Mi-Earth (未), shifting from the blazing Fire of 2026 to a more reflective, internalized heat. Your Creative Expression energy (食神) continues but takes a quieter form — think journaling rather than speaking, depth rather than breadth.

The Indirect Wealth (偏財) energy from the Earthly Branch suggests unexpected financial opportunities. These may come through side ventures, creative monetization, or opportunities that don't follow traditional career paths. The Inner Wisdom (華蓋殺) star deepens your introspective tendencies — trust the insights that come during periods of solitude.

Q1: Financial opportunity assessment. Q2: Creative projects deepen. Q3: Career crossroads — choose depth over breadth. Q4: Spiritual growth and relationship deepening.`,

  year_2028: `The year 2028 marks a significant shift as Mu-Earth (戊) and Shin-Metal (申) enter the stage. Earth and Metal energies dominate, creating conditions that challenge your Wood Day Master directly. This is a year for strategic patience rather than aggressive expansion.

The Direct Officer (正官) energy brings structure, responsibility, and external expectations. Career advancement is possible, but it comes with increased accountability. The Guardian Angel Star (天乙貴人) and Magnetic Charm (紅艶殺) provide protection and social magnetism even in challenging conditions.

Q1: Accept new responsibilities carefully. Q2: Relationship tensions may surface — address them proactively. Q3: Health vigilance, especially respiratory. Q4: Financial consolidation.`,

  year_2029: `The year 2029, governed by Gi-Earth (己) and Yu-Metal (酉), intensifies the Metal pressure on your chart. Yu-Metal is your Day Pillar's Earthly Branch — when the annual fortune mirrors your natal position, it creates a moment of profound self-reflection. You are forced to confront aspects of yourself you normally avoid.

The Charm & Attraction (桃花殺) star makes this a romantically significant year — new connections form easily, but discernment is essential. The Leadership (將星殺) star suggests that others increasingly look to you for guidance, whether you seek this role or not.

Q1: Self-reflection and identity work. Q2: Romantic encounters intensify. Q3: Professional leadership emerges. Q4: Integration of lessons learned.`,

  year_2030: `The year 2030 brings Geng-Metal (庚) and Sul-Earth (戌), the most Metal-heavy year in this decade. Your Direct Officer (正官) energy peaks — this is the year of maximum external structure, authority, and professional formality. If promotions, titles, or institutional recognition are coming, this is when they arrive.

The Heavenly Blessing (天德貴人) and Monthly Blessing (月德貴人) stars appear together — a rare and powerful protective combination. Even in the most challenging Metal year, these noble stars ensure that outcomes skew positive.

Q1: Institutional opportunities emerge. Q2: Formal recognition or advancement. Q3: Manage Metal excess — flexibility and rest. Q4: Prepare for the softening energies of 2031.`,

  year_2031: `The year 2031, governed by Shin-Metal (辛) and Hae-Water (亥), begins the transition from Metal dominance toward Water support. Water is your Lucky Support (喜神) element — its arrival in the Earthly Branch brings emotional relief, intuitive clarity, and a sense of flow returning to your life.

The Direct Seal (正印) energy nourishes your Day Master directly. This is a year for learning, mentorship (both giving and receiving), and deepening your knowledge base. The Travel & Change (驛馬殺) star returns — relocation or significant travel is possible.

Q1: Emotional recalibration. Q2: Learning and skill development. Q3: Travel and expansion. Q4: New vision crystallizes.`,

  year_2032: `The year 2032 marks a turning point as Im-Water (壬) and Ja-Water (子) bring double Water energy — your Lucky Support element in both Stem and Branch. After years of Metal pressure, this feels like rain after drought. Your intuition sharpens, emotional intelligence deepens, and relationships feel more authentic.

The Direct Seal (正印) energy is amplified. Academic pursuits, certifications, publishing, and teaching are all strongly favored. The Guardian Angel Star (天乙貴人) and Grand Destiny (太極貴人) suggest cosmic-level support for significant life moves.

Q1: Emotional healing and relationship renewal. Q2: Academic or publishing breakthroughs. Q3: Financial opportunities through wisdom-based work. Q4: Legacy planning begins.`,

  year_2033: `The year 2033 brings Gui-Water (癸) and Chou-Earth (丑), continuing the Water-supported period but with Earth's stabilizing influence. The Indirect Seal (偏印) energy activates your unconventional wisdom — insights come from unexpected sources, and your problem-solving abilities reach new heights.

The Fortune & Blessings (福星貴人) star appears, reinforcing material comfort and spiritual well-being. However, the Unexpected Disruption (白虎殺) star urges caution with physical safety and health.

Q1: Unconventional ideas bear fruit. Q2: Financial stability deepens. Q3: Health awareness — preventive measures. Q4: Integration of Water-period lessons.`,

  year_2034: `The year 2034, governed by Gap-Wood (甲) and Yin-Wood (寅), brings your Key Balancer element into the cosmic spotlight. Wood in both Stem and Branch is the strongest possible support your chart can receive — this is your power year of the decade.

The Competition & Drive (Rob Wealth / 劫財) energy suggests both collaboration and competition. Partners and rivals appear in equal measure — choose wisely. The Peak Power (帝旺) Twelve Life Stage means your energy is at its absolute maximum.

Q1: Strategic planning for maximum-impact moves. Q2: Launch your most ambitious project. Q3: Manage competition — stay focused on your vision. Q4: Harvest and celebration.`,

  year_2035: `The year 2035, with Eul-Wood (乙) and Myo-Wood (卯), represents the apex of this favorable period. Your Day Master's own element appears in the Heavenly Stem, while the Earthly Branch carries Wood's most potent form. The Self & Independence (比肩) and Full Strength (建祿) combination creates a moment of unprecedented personal empowerment.

The Charm & Attraction (桃花殺) and Spiritual Insight (天門星) stars suggest that this is also a year of deep romantic connection and spiritual awakening. If there is a single year in this decade to make your most ambitious move — career, relationship, or creative masterwork — this is it.

Q1: Vision consolidation. Q2: Bold action — the cosmos supports your boldest move. Q3: Relationship deepening. Q4: This chapter closes with profound gratitude and the seeds of a new decade.`,

  // ─── Love 티어 ───

  // Ch.1~3 인트로 챕터
  love_ch1: `Your Four Pillars form the cosmic blueprint of your romantic soul. As an Eul-Wood (乙) Day Master, you are the soft vine — endlessly adaptable, quietly persistent, and capable of wrapping your warmth around even the most guarded heart. In love, you don't conquer; you persuade. Your gentle persistence is your greatest romantic superpower.

The Indirect Officer (偏官) energy that dominates your chart brings an irresistible edge to your romantic presence. You are drawn to intensity in relationships — surface-level connections leave you cold. You need a partner who can match your emotional depth, challenge your perspectives, and keep you growing. Comfortable predictability is the enemy of your heart.

Your Very Gentle Energy (極身弱) classification means you love with your entire being. When you fall, you fall completely. This vulnerability is both your greatest gift and your greatest risk. The right partner will treasure this openness; the wrong one may exploit it. Learning to distinguish between the two is the central lesson of your romantic journey.`,

  love_ch2: `Your Day Master Eul-Wood (乙) seated on Yu-Metal (酉) creates the "Vine on Metal" archetype — one of the most romantically complex configurations in Saju. Metal represents your Indirect Officer, and in romantic terms, this means your ideal partner carries an aura of authority, structure, and decisive energy that complements your flowing nature.

You are most attracted to people who seem slightly out of reach. The chase energizes you, and you instinctively know that the best relationships require ongoing effort and growth. Partners who are too available, too predictable, or too agreeable will eventually bore you — not because you are difficult, but because your chart demands dynamic energy exchange.

In first encounters, you lead with warmth rather than flash. Your Creative Expression (食神) energy gives you a natural gift for making others feel seen and understood. People often say they felt instantly comfortable around you, as if they had known you for years. This quality is magnetic — it draws potential partners toward you without you trying.`,

  love_ch3: `The Five Elements tell a vivid story about your love language. With Wood as your core and Metal as your dominant environmental energy, you experience love as a creative tension — the vine that grows stronger by navigating obstacles. Your love language is quality time combined with deep conversation; you need both physical presence and intellectual connection.

Your Ten Gods distribution reveals a romantic pattern: the triple Indirect Wealth (偏財) suggests that you attract unconventional romantic situations. You may find love in unexpected places — a chance encounter while traveling, a deep friendship that slowly evolves, or a connection that defies the expectations of family or society.

The absence of Water energy in your chart is significant in romantic terms. Water represents emotional flow, intuition, and the ability to surrender to feelings. Without it, you may sometimes struggle to express your deepest emotions verbally, even when you feel them intensely. Your partner will need to learn to read your actions and presence as expressions of love, not just your words.`,

  // Love 전용 CalloutBox 텍스트
  love_callout_dna: `If we could describe your romantic DNA in a single phrase, it would be: "The Quiet Storm." You love softly but with devastating depth. When you commit, every cell in your being commits. Your love doesn't announce itself — it simply becomes undeniable.`,

  love_callout_first: `Your secret first-impression weapon? You make people feel genuinely heard. In a world of distracted half-listeners, your full attention is intoxicating. The Creative Expression (食神) in your Hour Pillar means your presence itself is a form of attraction.`,

  love_callout_match: `Your cosmic match blueprint: Someone with strong Water or Wood energy in their Day Pillar. They ground your intensity without dampening your fire. They are decisive where you are flexible, vocal where you are subtle — together, you create a love that is both gentle and unshakable.`,

  love_callout_timing: `Your love calendar has a golden window: Spring months (March-May) and years with strong Wood energy are when your romantic magnetism peaks. Plan first dates, proposals, or relationship conversations during these periods for maximum cosmic support.`,

  love_callout_adult: `Your intimate connection style is defined by presence over performance. You need to feel emotionally safe before physical vulnerability feels natural. Once trust is established, your depth of connection is extraordinary — partners describe it as "being truly known for the first time."`,

  love_callout_luck: `Your love luck amplifiers: Wear soft pink or sage green on dates. Choose venues near water — riverside restaurants, lakeside walks, rainy-day cafes. Your romantic energy activates most powerfully in the eastern direction, during evening hours, and in settings where nature is visible.`,

  // Part 1: 연애 DNA + 첫인상
  love_p1: `Your romantic DNA is encoded in the interplay between your Day Master and the stars that surround it. The Eul-Wood vine doesn't choose where it grows — it adapts to whatever surface it encounters and transforms it into a garden. In love, you do the same: you don't seek a perfect partner, you create a perfect relationship through patience, creativity, and gentle persistence.

The Charm & Attraction (桃花殺) star in your Day Pillar position amplifies your one-on-one magnetism. This isn't the loud, room-commanding charisma of some charts — it's the quiet kind that works best in intimate settings. Coffee shops over nightclubs. Deep conversation over small talk. Eye contact over grand gestures.

Your first impression in romantic contexts tends to be understated but memorable. People don't fall for you instantly — they fall for you gradually, and then all at once. Something about your presence lingers in their mind hours after you've left. This slow-burn attraction pattern is actually your greatest advantage: the connections that form around you tend to be built on genuine understanding rather than surface chemistry.`,

  // Part 2: 연애 강점 + 스타일
  love_p2: `Your greatest romantic strength is emotional intelligence paired with genuine curiosity about your partner's inner world. The Creative Expression (食神) energy gives you an almost psychic ability to sense what your partner needs — sometimes before they know it themselves. You notice the subtle shift in mood, the hesitation behind a smile, the words left unsaid.

Your dating style is best described as "intentional slow-burn." You prefer depth over frequency in early dating stages. One meaningful three-hour dinner conversation means more to you than five casual coffee dates. You instinctively filter for emotional depth and intellectual compatibility.

In committed relationships, you are the partner who remembers the small things: the song that was playing during your first kiss, the way they take their coffee, the childhood story they told you at 2 AM. This attention to emotional detail is your love language in action — you love by paying attention, and for the right partner, this level of attentiveness is intoxicating.`,

  // Part 3: 운명의 짝
  love_p3: `Your cosmic compatibility profile points toward partners whose charts contain strong Water (水) or Wood (木) energy in their Day Pillar. These elements naturally support your Eul-Wood Day Master, creating a relationship dynamic where both partners strengthen each other's core energy.

The ideal partner for your chart carries Direct Officer (正官) or Direct Seal (正印) energy. The Officer type brings structure, reliability, and decisive action to complement your flexibility. The Seal type brings nurturing, wisdom, and emotional security that allows your creative nature to flourish without anxiety.

Partners to approach with caution: those with excessive Earth (土) energy in their Day Pillar may feel draining over time, as Earth absorbs Wood's nutrients. Similarly, strong Metal (金) charts, while initially exciting due to the tension they create, can become overwhelming if not balanced by other supportive elements. The attraction will be intense but the long-term dynamic requires conscious effort.

Your dealbreaker constellation: partners who cannot tolerate emotional depth. Your triple Indirect Wealth (偏財) pattern means you need a partner who embraces unpredictability and doesn't demand that love follow a script. The right person will find your complexity fascinating; the wrong one will find it exhausting.`,

  // Part 4: 연애운 좋은 시기
  love_p4: `Your romantic timing follows a cosmic rhythm that, once understood, becomes a powerful tool for manifesting love. The Annual Fortune data reveals specific windows where romantic energy peaks — and other periods where patience serves you better than pursuit.

The year 2026, governed by Byeong-Fire (丙) and O-Fire (午), is a standout year for romantic energy. Fire feeds your Wood Day Master, creating conditions of natural warmth, confidence, and magnetic attraction. If you are single during this year, the chances of meeting a significant romantic partner are elevated. If coupled, this is a year for deepening commitment — proposals, moving in together, or having important relationship conversations.

Spring months are consistently your strongest romantic season. The Wood energy of March, April, and May activates your Day Master, making you feel more confident, expressive, and open to connection. Plan first dates, reunions, or romantic getaways during these months.

The best locations for romantic encounters align with your elemental needs: venues near water (restaurants by rivers, lakeside parks, seaside walks) activate the Water energy your chart craves. Eastern-facing spaces, green environments, and places with natural wood elements (not plastic, not metal) create the energetic backdrop most conducive to genuine romantic connection.`,

  // Part 5: Adult Only
  love_p5: `Your intimate connection style is deeply influenced by the Eul-Wood (乙) archetype: you approach physical closeness as an extension of emotional closeness, not as a separate category of experience. For you, the line between emotional intimacy and physical intimacy is beautifully blurred — one flows naturally into the other.

The Creative Expression (食神) energy in your Hour Pillar — which governs your most private self — suggests a natural sensuality that expresses itself through attentiveness to your partner's responses. You are instinctively responsive, adjusting your energy to match and complement your partner's. This makes you an extraordinarily intuitive intimate partner.

Trust is the prerequisite for your deepest physical expression. The Very Gentle Energy (極身弱) classification means you need to feel genuinely safe before you can fully surrender to physical vulnerability. This is not shyness — it is wisdom. When that safety is established, the depth of your connection becomes extraordinary.

Your physical connection deepens significantly over time. Unlike charts that peak in initial passion, your intimate energy builds with familiarity. The hundredth time is more powerful than the first, because your body of shared understanding creates a feedback loop of ever-increasing closeness.`,

  // Part 6: 행운 아이템 + 전략
  love_p6: `Your romantic luck can be consciously amplified by aligning your daily choices with your chart's elemental needs. These are not superstitions — they are practical applications of the cosmic energies that govern your romantic magnetism.

Lucky colors for romance: soft sage green (Wood energy), powder blue and deep navy (Water energy), and blush pink (the gentle Fire that feeds your Wood). Wear these colors on dates, during important relationship conversations, or when you want to feel romantically confident. Avoid all-black or all-white outfits on dates — they carry Metal energy that suppresses your romantic warmth.

Lucky numbers: 3 and 8 (Wood numbers), 1 and 6 (Water numbers). Use these when choosing table numbers at restaurants, scheduling dates (the 3rd, 8th, 13th, 18th of each month), or even selecting apartment floors if you are planning to live together.

Lucky venues: botanical gardens, riverside walks, bookstores with cafe sections, art galleries, forest trails, tea houses, and restaurants with abundant natural light and plants. Your romantic energy activates in spaces where nature is present, even in urban settings.

Strategic tips for your chart: Lead with questions, not statements. Your Creative Expression energy makes you a natural conversationalist, but your greatest romantic tool is genuine curiosity about your partner. Ask the unexpected question. Remember the answer. Follow up next time. This pattern of deep attention is more seductive than any technique.`,
};

// ═══════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════

interface PdfDocumentProps {
  tier: TierCode;
  sajuData: SajuData;
  texts: Record<string, string>;
  coverImage: string | null;
  theme: ThemeCode;
  clientName: string;
  birthInfo: string;
}

export function PdfDocument({
  tier,
  sajuData,
  texts,
  coverImage,
  theme,
  clientName,
  birthInfo,
}: PdfDocumentProps) {
  const t = getThemeStyles(theme);
  const g = (key: string): string => {
    const val = texts?.[key] || D[key];
    return typeof val === 'string' && val.length > 0 ? val : ' ';
  };

  // 티어별 콘텐츠를 단일 배열로 구성 — null/undefined 절대 반환 안 함
  const tierContent = renderTierContent(tier, theme, g, sajuData, clientName);

  return (
    <Document
      title={`${clientName || 'Guest'} — Saju Reading`}
      author="SajuMuse"
      subject="Four Pillars Destiny Analysis"
    >
      <CoverPage
        theme={theme}
        tier={tier}
        name={clientName || 'Guest'}
        birthDate={birthInfo || ''}
        coverImageBase64={coverImage}
      />

      <IntroPage theme={theme} tier={tier} name={clientName || 'Guest'} />

      <Page size="A4" style={t.page}>
        <SajuChart theme={theme} pillar={sajuData.pillar} />
      </Page>

      <Page size="A4" style={t.page}>
        <YongsinChart theme={theme} yongsin={sajuData.yongsin} />
        <View style={t.divider} />
        <YinyangChart theme={theme} yinyang={sajuData.yinyang} />
      </Page>

      {tierContent}

      <EndingPage theme={theme} name={clientName || 'Guest'} />
    </Document>
  );
}

// 티어별 콘텐츠 — 항상 Fragment 반환, 내부에 null 없음
function renderTierContent(
  tier: TierCode,
  theme: ThemeCode,
  g: (k: string) => string,
  data: SajuData,
  clientName: string,
): React.ReactNode {
  switch (tier) {
    case 'basic': return renderBasic(theme, g);
    case 'love': return renderLove(theme, g, data, clientName);
    case 'full': return renderFull(theme, g, data);
    case 'premium': return renderPremium(theme, g, data);
    default: return renderBasic(theme, g);
  }
}

// ═══════════════════════════════════════════════════════════════
// Basic 티어
// ═══════════════════════════════════════════════════════════════

function renderBasic(theme: ThemeCode, g: (k: string) => string) {
  return (
    <>
      <ChapterPage theme={theme} chapterNumber={1} title="Your Destiny Overview" content={g('overview')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Personality & Core Strengths" content={g('personality')} />
      <ChapterPage theme={theme} chapterNumber={3} title="Fortune & Life Direction" content={g('fortune')} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Full 티어 — Part 1~8
// ═══════════════════════════════════════════════════════════════

function renderFull(theme: ThemeCode, g: (k: string) => string, data: SajuData) {
  const t = getThemeStyles(theme);
  return (
    <>
      {/* Part 1: 사주 상세 분석 */}
      <PartHeader theme={theme} partNumber={1} title="Your Destiny Chart" subtitle="The Four Pillars in Depth" />
      <ChapterPage theme={theme} chapterNumber={1} title="Pillar-by-Pillar Analysis" content={g('part1_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Hidden Stems & Napeum" content={g('part1_ch2')} />

      {/* Part 2: 황금기 */}
      <PartHeader theme={theme} partNumber={2} title="My Life's Golden Period" subtitle="When the Stars Align" />
      <ChapterPage theme={theme} chapterNumber={1} title="Your Peak Decades" content={g('part2_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Seasonal & Daily Timing" content={g('part2_ch2')} />

      {/* Part 3: 연애운 */}
      <PartHeader theme={theme} partNumber={3} title="Love & Marriage Fortune" subtitle="Romance in the Stars" />
      <ChapterPage theme={theme} chapterNumber={1} title="Your Romantic Archetype" content={g('part3_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Timing & Compatibility" content={g('part3_ch2')} />

      {/* Part 4: 재물운 */}
      <PartHeader theme={theme} partNumber={4} title="Wealth & Prosperity" subtitle="Your Financial Destiny" />
      <ChapterPage theme={theme} chapterNumber={1} title="Wealth Pattern Analysis" content={g('part4_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Prosperous Periods & Strategy" content={g('part4_ch2')} />

      {/* Part 5: 직업운 */}
      <PartHeader theme={theme} partNumber={5} title="Career & Success Destiny" subtitle="Your Professional Path" />
      <ChapterPage theme={theme} chapterNumber={1} title="Ideal Career Fields" content={g('part5_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Leadership & Work Style" content={g('part5_ch2')} />

      {/* Part 6: 건강 */}
      <PartHeader theme={theme} partNumber={6} title="Health & Constitution" subtitle="Your Body's Blueprint" />
      <ChapterPage theme={theme} chapterNumber={1} title="Constitutional Health Profile" content={g('part6_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Seasonal Health & Remedies" content={g('part6_ch2')} />

      {/* Part 7: 귀인/신살 */}
      <PartHeader theme={theme} partNumber={7} title="Spirit Stars & Hidden Influences" subtitle="Destined Protectors & Challenges" />
      {data.shinsal && (
        <Page size="A4" style={t.page}>
          <ShinsalTable theme={theme} shinsal={data.shinsal} />
        </Page>
      )}
      <ChapterPage theme={theme} chapterNumber={1} title="Your Protective Stars" content={g('part7_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Cautionary Stars & Guidance" content={g('part7_ch2')} />

      {/* Part 8: 대운/개운 */}
      <PartHeader theme={theme} partNumber={8} title="Major Luck Cycles" subtitle="The Decades of Your Destiny" />
      {data.daeun && (
        <Page size="A4" style={t.page}>
          <DaeunTimeline theme={theme} daeun={data.daeun} />
        </Page>
      )}
      <ChapterPage theme={theme} chapterNumber={1} title="Decade-by-Decade Overview" content={g('part8_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Destiny Modification Methods" content={g('part8_ch2')} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Premium 티어 — Part 1~10 (Full 확장 + 올해 운세 + 10년 운세)
//
// ✦ Core personality & natural talents        (Part 1-2)
// ✦ Career path and best timing for success   (Part 5)
// ✦ Love life & relationship patterns          (Part 3)
// ✦ Wealth potential & financial fortune       (Part 4)
// ✦ Health tendencies to watch                 (Part 6)
// ✦ Spirit Stars & Hidden Influences           (Part 7)
// ✦ Major Luck Cycles & Destiny Modification   (Part 8)
// ✦ This year's fortune forecast               (Part 9)  ← Premium 전용
// ✦ Full 10-Year Fortune Cycle & yearly breakdown (Part 10) ← Premium 전용
// ✦ 60+ page personalized PDF report
// ═══════════════════════════════════════════════════════════════

function renderPremium(theme: ThemeCode, g: (k: string) => string, data: SajuData) {
  const t = getThemeStyles(theme);

  // 년운 데이터에서 년도 목록 추출
  const years = data.nyunun?.entries.map((e) => e.year).sort((a, b) => a - b) ?? [];

  return (
    <>
      {/* Part 1~8: Full 내용 전체 */}
      {renderFull(theme, g, data)}

      {/* ════════ Part 9: This Year's Fortune ════════ */}
      <PartHeader
        theme={theme}
        partNumber={9}
        title="This Year's Fortune"
        subtitle="Your Cosmic Weather for 2026"
      />

      {/* 올해 운세 상세 분석 */}
      <ChapterPage
        theme={theme}
        title="2026 — Your Year in Focus"
        content={g('this_year_forecast')}
      />

      {/* 올해 월운 차트 */}
      {data.wolun && (
        <Page size="A4" style={t.page}>
          <WolunCard theme={theme} wolun={data.wolun} />
        </Page>
      )}

      {/* 올해 월별 상세: 상반기/하반기 */}
      <ChapterPage
        theme={theme}
        chapterNumber={1}
        title="January – June: First Half Guide"
        content={g('part10_ch1')}
      />
      <ChapterPage
        theme={theme}
        chapterNumber={2}
        title="July – December: Second Half Guide"
        content={g('part10_ch2')}
      />

      {/* 내년 월운 차트 (있는 경우) */}
      {data.wolun2 && (
        <Page size="A4" style={t.page}>
          <WolunCard theme={theme} wolun={data.wolun2} />
        </Page>
      )}

      {/* ════════ Part 10: 10-Year Fortune Cycle ════════ */}
      <PartHeader
        theme={theme}
        partNumber={10}
        title="10-Year Fortune Cycle"
        subtitle={years.length > 0 ? `Year-by-Year Breakdown (${years[0]}–${years[years.length - 1]})` : 'Year-by-Year Breakdown'}
      />

      {/* 10년 개요 */}
      <ChapterPage
        theme={theme}
        title="Decade Overview"
        content={g('part9_intro')}
      />

      {/* 년운 차트 */}
      {data.nyunun && (
        <Page size="A4" style={t.page}>
          <NyununCard theme={theme} nyunun={data.nyunun} />
        </Page>
      )}

      {/* 년도별 개별 분석 — 각 년도 1페이지 */}
      {years
        .filter((year) => g(`year_${year}`) !== '')
        .map((year) => (
          <ChapterPage
            key={year}
            theme={theme}
            title={`${year} — Annual Fortune`}
            content={g(`year_${year}`)}
          />
        ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Love 티어 — Ch.1~3 + Part 1~6
// ═══════════════════════════════════════════════════════════════

function renderLove(
  theme: ThemeCode,
  g: (k: string) => string,
  data: SajuData,
  name: string,
) {
  const t = getThemeStyles(theme);
  return (
    <>
      {/* Ch.1~3: 사주 기본 + 일간 성향 + 오행 연애 해석 */}
      <ChapterPage theme={theme} chapterNumber={1} title="Your Four Pillars & Love" content={g('love_ch1')} />
      <ChapterPage theme={theme} chapterNumber={2} title="Your Day Master in Romance" content={g('love_ch2')} />
      <ChapterPage theme={theme} chapterNumber={3} title="Elements & Your Love Language" content={g('love_ch3')} />

      {/* Part 1: 연애 DNA + 첫인상 */}
      <PartHeader theme={theme} partNumber={1} title="Your Romance DNA" subtitle="First Impressions & Attraction Style" />
      <Page size="A4" style={t.page}>
        <CalloutBox
          theme={theme}
          variant="question"
          label={`${name}'s Romance DNA in One Phrase`}
          text={g('love_callout_dna')}
        />
      </Page>
      <ChapterPage theme={theme} title="Your Romantic Blueprint" content={g('love_p1')} />
      <Page size="A4" style={t.page}>
        <CalloutBox
          theme={theme}
          variant="highlight"
          label="Your Secret First-Impression Weapon"
          text={g('love_callout_first')}
        />
      </Page>

      {/* Part 2: 연애 강점 + 스타일 */}
      <PartHeader theme={theme} partNumber={2} title="Your Love Strengths" subtitle="What Makes You Irresistible" />
      <ChapterPage theme={theme} title="Strengths & Dating Style" content={g('love_p2')} />

      {/* Part 3: 운명의 짝 */}
      <PartHeader theme={theme} partNumber={3} title="Your Destined Match" subtitle="Who Your Stars Are Calling" />
      <Page size="A4" style={t.page}>
        <CalloutBox
          theme={theme}
          variant="question"
          label="Your Cosmic Match Blueprint"
          text={g('love_callout_match')}
        />
      </Page>
      <ChapterPage theme={theme} title="Compatibility & Dealbreakers" content={g('love_p3')} />

      {/* Part 4: 연애운 좋은 시기 + 장소 */}
      <PartHeader theme={theme} partNumber={4} title="Best Timing for Love" subtitle="When & Where Cupid Strikes" />
      <Page size="A4" style={t.page}>
        <CalloutBox
          theme={theme}
          variant="default"
          label="Your Love Calendar"
          text={g('love_callout_timing')}
        />
      </Page>
      {data.nyunun && (
        <Page size="A4" style={t.page}>
          <NyununCard theme={theme} nyunun={data.nyunun} />
        </Page>
      )}
      <ChapterPage theme={theme} title="Romantic Timing & Lucky Places" content={g('love_p4')} />

      {/* Part 5: Adult Only */}
      <PartHeader theme={theme} partNumber={5} title="Deep Connection" subtitle="Intimacy & Emotional Bond" />
      <Page size="A4" style={t.page}>
        <CalloutBox
          theme={theme}
          variant="highlight"
          label="Your Intimate Connection Style"
          text={g('love_callout_adult')}
        />
      </Page>
      <ChapterPage theme={theme} title="Physical & Emotional Intimacy" content={g('love_p5')} />

      {/* Part 6: 행운 아이템 + 전략 */}
      <PartHeader theme={theme} partNumber={6} title="Lucky Charms & Strategy" subtitle="Amplify Your Romantic Energy" />
      <Page size="A4" style={t.page}>
        <CalloutBox
          theme={theme}
          variant="default"
          label="Your Love Luck Amplifiers"
          text={g('love_callout_luck')}
        />
      </Page>
      <ChapterPage theme={theme} title="Colors, Numbers & Strategic Tips" content={g('love_p6')} />
    </>
  );
}
