const problems = [
  {
    id: 'FE-000',
    severity: 'Kritická',
    title: 'Model funguje jen jako obraz pro jednoho pozorovatele',
    kid: 'Kód umí vyrobit lokálně správně vypadající oblohu pro zvoleného diváka, ale to ještě není model reality sdílené více pozorovateli najednou.',
    why: 'Jakmile se správná obloha získá standardním převodem RA/Dec do lokálního směru a výšky, model jen promítá už hotový výsledek do FE scény. Tím neřeší jednotnou geometrii světa pro více současných pozorovatelů.',
    code: [
      'source/js/core/transforms.js:19 - compTransMatCelestToGlobe(...) převádí nebeský směr do lokálního globe rámce pozorovatele',
      'source/js/core/transforms.js:65 - localGlobeCoordToAngles(...) počítá lokální azimut a elevaci',
      'source/README.md:32 - README odkazuje na About text s fiktivním pozorovatelem'
    ],
    visual: 'Dva pozorovatelé, dva lokálně správné obrázky, ale žádná společná FE geometrie, která by je nesla najednou.',
    conclusion: 'Tohle není alternativní popis reality. Je to lokální vizualizační převod hotové oblohy pro jednoho diváka.'
  },
  {
    id: 'FE-001',
    severity: 'Kritická',
    title: 'Model používá hotové DE405 efemeridy',
    kid: 'Model tvrdí, že ukazuje funkční FE oblohu, ale přesné polohy bere z hotových astronomických tabulek.',
    why: 'Výchozí zdroj poloh je AstroPixels/JPL DE405. Přesnost oblohy tedy přichází z moderních astronomických tabulek, ne z ploché geometrie modelu.',
    code: [
      'source/js/core/app.js:252 - výchozí BodySource je astropixels',
      'source/js/core/ephemerisAstropixels.js:58 - funkce lookup(body, date) načítá tabulková RA/Dec data',
      'source/js/core/ephemerisAstropixels.js:123 - bodyGeocentric(name, date) vrací převzaté efemeridy'
    ],
    visual: 'Datový tok DE405 -> RA/Dec -> lokální obloha -> FE kresba.',
    conclusion: 'Správná poloha těles není důkaz FE modelu, protože byla převzata z jiného zdroje.'
  },
  {
    id: 'FE-002',
    severity: 'Kritická',
    title: 'Pozorovaná obloha se počítá přes globe transformaci',
    kid: 'Model říká “plochý svět”, ale pro pozorovanou výšku a směr těles používá standardní lokální oblohu z RA/Dec.',
    why: 'Azimut a elevace jsou hlavní pozorované hodnoty. Kód je získá z RA/Dec, zeměpisné šířky, délky a hvězdného času ještě před FE kreslením.',
    code: [
      'source/js/core/transforms.js:19 - compTransMatCelestToGlobe(...) převádí nebeský směr do lokálního globe rámce',
      'source/js/core/transforms.js:65 - localGlobeCoordToAngles(...) počítá azimut a elevaci',
      'source/js/core/app.js:558 - SunAnglesGlobe ukládá pozorovanou výšku a směr Slunce'
    ],
    visual: 'Postavička pozorovatele, nad ní lokální obloha, až potom disk.',
    conclusion: 'FE scéna není zdroj pozorování. Je to obraz po standardním výpočtu oblohy.'
  },
  {
    id: 'FE-003',
    severity: 'Kritická',
    title: 'Lat/long síť je natvrdo AE mapová projekce',
    kid: 'FE disk je mapová projekce. Projekce může být užitečný obrázek, ale není automaticky fyzický tvar světa.',
    why: 'Azimutální ekvidistantní projekce je způsob kreslení mapy. Směrem k jihu silně mění velikosti rovnoběžek a vzdálenosti.',
    code: [
      'source/js/core/canonical.js:1 - komentář potvrzuje hard-coded north-pole azimuthal-equidistant rámec',
      'source/js/core/canonical.js:8 - setActiveProjection() je prázdná funkce',
      'source/js/core/canonical.js:10 - canonicalLatLongToDisc(...) převádí lat/lon do AE disku'
    ],
    visual: 'Porovnání obvodu rovnoběžky na kouli a v FE disku.',
    conclusion: 'Model zaměňuje mapovou projekci za fyzickou geometrii světa.'
  },
  {
    id: 'FE-004',
    severity: 'Kritická',
    title: 'Výšky těles jsou ručně naladěné pásy',
    kid: 'Výška Slunce, Měsíce a planet nad dómem je odvozená z ručně zvoleného pásma, ne z nezávislé fyziky světla.',
    why: 'Výška Slunce, Měsíce a planet nad diskem je odvozena z deklinace a ručně vybraných konstant HEADROOM a SUN_RANGE.',
    code: [
      'source/js/core/app.js:533 - HEADROOM = 0.06',
      'source/js/core/app.js:534 - SUN_RANGE = 0.20',
      'source/js/core/app.js:542 - SunVaultHeight se počítá z deklinace a ručních konstant',
      'source/js/core/app.js:598 - MoonVaultHeight je odvozen od výšky Slunce',
      'source/js/core/app.js:863 - výška planet je odvozena přes eclipticBeta'
    ],
    visual: 'Posuvník deklinace, který hýbe tělesem nahoru a dolů bez fyzikální vzdálenosti.',
    conclusion: 'Tohle je ladění obrázku, ne nezávislý fyzikální mechanismus.'
  },
  {
    id: 'FE-005',
    severity: 'Kritická',
    title: 'Zatmění jsou přehraná z reálného katalogu',
    kid: 'Zatmění nejsou nalezená FE prediktorem. Jsou načtená z reálného katalogu a potom přehraná.',
    why: 'Ukázky zatmění se staví z AstroPixels/JPL DE405 katalogu. FE predikční větev je v kódu jen placeholder.',
    code: [
      'source/js/demos/eclipseRegistry.js:15 - import ASTROPIXELS_ECLIPSES načítá katalog skutečných zatmění',
      'source/js/demos/eclipseRegistry.js:74 - refineEclipseByMinSeparation(...) jen zpřesňuje čas okolo katalogové události',
      'source/js/demos/eclipseRegistry.js:131 - SOLAR_ECLIPSE_DEMOS se generují z katalogu',
      'source/js/demos/feEclipseTrack.js:10 - FE predikce je označená jako PLACEHOLDER'
    ],
    visual: 'Katalog zatmění vs prázdný FE prediktor.',
    conclusion: 'Přehrání známých zatmění není předpověď plochého modelu.'
  },
  {
    id: 'FE-006',
    severity: 'Vysoká',
    title: 'Stín zatmění používá zvolené FE poloměry',
    kid: 'Stín zatmění závisí na zvolených FE poloměrech Slunce a Měsíce a na katalogové magnitudě.',
    why: 'Poloměry Slunce a Měsíce jsou FE-scale konstanty a umbra se ještě filtruje podle katalogové magnitudy.',
    code: [
      'source/js/render/worldObjects.js:1144 - r_s = 0.030 nastavuje FE poloměr Slunce',
      'source/js/render/worldObjects.js:1145 - r_m = 0.025 nastavuje FE poloměr Měsíce',
      'source/js/render/worldObjects.js:1161 - používá se katalogová EclipseMagnitude',
      'source/js/render/worldObjects.js:1162 - umbra se kreslí jen při mag >= 0.99'
    ],
    visual: 'Dva kruhy se změnitelnou velikostí a dopadem stínu.',
    conclusion: 'Stín je konstrukce pro vizualizaci, ne ověření FE geometrie.'
  },
  {
    id: 'FE-007',
    severity: 'Vysoká',
    title: 'GeoC planety nemají retrográdní pohyb',
    kid: 'Skutečné planety mají retrográdní pohyb. Jedna z planetárních pipeline v modelu ho sama přiznává jako chybějící.',
    why: 'Komentář v kódu přiznává, že vnitřní planety nelibrují kolem Slunce a žádná planeta nemá retrográdní pohyb.',
    code: [
      'source/js/core/ephemerisGeo.js:11 - komentář přiznává, že Mercury/Venus nelibrují okolo Slunce',
      'source/js/core/ephemerisGeo.js:12 - komentář přiznává, že žádná planeta nemá retrográdní pohyb',
      'source/js/core/ephemerisGeo.js:96 - planetEquatorial(...) používá jednu Earth-focus Kepler elipsu'
    ],
    visual: 'Skutečná smyčka Marsu proti jednoduché dráze bez smyčky.',
    conclusion: 'Model nepokrývá jednu z nejznámějších vlastností planetární oblohy.'
  },
  {
    id: 'FE-008',
    severity: 'Vysoká',
    title: 'Mimo rozsah dat vrací falešnou polohu',
    kid: 'Když model nemá data, měl by chybu přiznat. Tady místo toho vrátí platně vypadající souřadnici RA=0, Dec=0.',
    why: 'AstroPixels data jsou jen pro roky 2019-2030. Mimo rozsah kód vrací RA=0, Dec=0, což vypadá jako platná poloha.',
    code: [
      'source/js/core/ephemerisAstropixels.js:64 - při chybějícím roce lookup(...) vrací null',
      'source/js/core/ephemerisAstropixels.js:108 - planetEquatorial(...) mění null na { ra: 0, dec: 0 }',
      'source/js/core/ephemerisAstropixels.js:113 - sunEquatorial(...) mění null na { ra: 0, dec: 0 }',
      'source/js/core/ephemerisAstropixels.js:123 - bodyGeocentric(...) také fallbackuje na { ra: 0, dec: 0 }'
    ],
    visual: 'Časová osa s bezpečným zeleným rozsahem a červenými roky mimo data.',
    conclusion: 'To je skutečná robustnostní chyba, která může vyrábět klamné výsledky.'
  },
  {
    id: 'FE-009',
    severity: 'Střední',
    title: 'První update počítá s nenastavenou hodnotou',
    kid: 'Výpočet poprvé použije hodnotu, která ještě není nastavená, takže vznikne NaN.',
    why: 'Optická výška se použije při výpočtu souřadnic Slunce a Měsíce dřív, než se nastaví.',
    code: [
      'source/js/core/app.js:559 - SunOpticalVaultCoord používá c.OpticalVaultHeightEffective',
      'source/js/core/app.js:615 - MoonOpticalVaultCoord používá c.OpticalVaultHeightEffective',
      'source/js/core/app.js:821 - OpticalVaultHeightEffective se nastavuje až později'
    ],
    visual: 'Pořadí kroků: použij hodnotu -> nastav hodnotu.',
    conclusion: 'Toto je obyčejná programátorská chyba v pořadí výpočtu.'
  },
  {
    id: 'FE-010',
    severity: 'Vysoká',
    title: 'Fáze Měsíce nejsou FE osvětlení',
    kid: 'Fáze Měsíce jsou převzaté z úhlové geometrie nebeských vektorů, ne z FE světelného modelu.',
    why: 'Fáze jsou počítané z geocentrických jednotkových vektorů Slunce a Měsíce. FE vzdálenosti a světelná dráha se nepoužijí.',
    code: [
      'source/js/core/app.js:774 - začíná část Moon phase',
      'source/js/core/app.js:784 - moonToGlobe je odvozen z MoonCelestCoord',
      'source/js/core/app.js:785 - moonToSun je odvozen ze SunCelestCoord a MoonCelestCoord',
      'source/js/core/app.js:787 - MoonPhase se počítá úhlem mezi vektory'
    ],
    visual: 'Úhel Slunce-Měsíc na obloze proti chybějící FE světelné geometrii.',
    conclusion: 'Měsíční fáze nejsou vysvětlené FE modelem.'
  },
  {
    id: 'FE-011',
    severity: 'Vysoká',
    title: 'Stránka sama říká, že jde o konceptuální model',
    kid: 'Live demo samo používá opatrný jazyk: konceptuální model, optický dóm a fiktivní pozorovatel.',
    why: 'Live stránka mluví o konceptuálním modelu, optickém dómu a fiktivním pozorovateli.',
    code: [
      'https://alanspaceaudits.github.io/conceptual_flat_earth_model/ - live demo původního modelu',
      'source/README.md:1 - projekt se jmenuje Conceptual Flat Earth Model',
      'source/README.md:3 - popisuje se jako interactive conceptual model',
      'source/README.md:32 - README odkazuje na About text s postojem k fiktivnímu pozorovateli'
    ],
    visual: 'Rozdíl mezi kreslicím modelem a modelem, který umí předpovídat.',
    conclusion: 'Konceptuální vizualizace není důkaz fyzické reality.'
  }
];

const flowSteps = [
  {
    title: '1. Hotová astronomická data',
    label: 'DE405, Meeus, VSOP87',
    detail: 'Model bere RA/Dec hodnoty ze standardních astronomických zdrojů. Přesnost proto nepřichází z ploché mapy, ale z převzatých efemerid.',
    code: 'source/js/core/app.js:252; source/js/core/ephemerisAstropixels.js:58; source/js/core/ephemerisAstropixels.js:123',
    why: 'Když je poloha tělesa už předem převzatá z přesných tabulek, FE geometrie ji nemusela vysvětlit ani předpovědět.',
    example: 'Výchozí nastavení používá BodySource = astropixels. To znamená, že Slunce a Měsíc jdou přes data od AstroPixels/JPL DE405.',
    related: ['FE-001', 'FE-005', 'FE-008'],
    icon: 'table'
  },
  {
    title: '2. Nebeské souřadnice',
    label: 'RA / Dec',
    detail: 'RA a Dec určují, kde je objekt na obloze. Jsou to hotové nebeské souřadnice, které už obsahují astronomickou práci i sférickou strukturu pozorování.',
    code: 'source/js/core/ephemeris.js:75; source/js/core/ephemerisCommon.js:41; source/js/core/ephemerisCommon.js:66',
    why: 'RA/Dec jsou standardní astronomické souřadnice. Jakmile je model má, už ví, kde těleso na nebi je, aniž by FE geometrie musela tuto část reality vysvětlit sama.',
    example: 'Model pak z RA/Dec odvodí subsolární bod, ground point, výšku nad obzorem i polohu v dómu.',
    related: ['FE-000', 'FE-001', 'FE-010'],
    icon: 'sky'
  },
  {
    title: '3. Lokální obloha',
    label: 'azimut / elevace',
    detail: 'Kód převede RA/Dec na směr, který vidí pozorovatel. Tady vznikne to, co člověk skutečně pozoruje: směr a výška nad obzorem pro jednoho konkrétního diváka.',
    code: 'source/js/core/transforms.js:19; source/js/core/transforms.js:65; source/js/core/app.js:558',
    why: 'Tohle je klíčový bod: pozorovaná obloha je vypočítaná předtím, než se začne řešit FE kresba. Tím vzniká správný lokální obrázek, ale ne jednotná FE realita pro více současných pozorovatelů.',
    example: 'SunAnglesGlobe a MoonAnglesGlobe už obsahují azimut/elevaci, které odpovídají pozorování.',
    related: ['FE-000', 'FE-002'],
    icon: 'observer'
  },
  {
    title: '4. FE kresba',
    label: 'disk a dóm',
    detail: 'Až nakonec se výsledek nakreslí na plochý disk a dóm. To je vizualizace hotového výsledku, ne zdroj přesné predikce.',
    code: 'source/js/core/canonical.js:10; source/js/core/feGeometry.js:69; source/js/core/app.js:542',
    why: 'Plochý disk je poslední obrazová vrstva. Umí vypadat působivě, ale sám nevysvětluje, odkud se vzala správná poloha ani jak by stejná FE geometrie nesla více pozorovatelů najednou.',
    example: 'Lat/long se převádí do hardcoded AE projekce a výšky těles se nastavují samostatnými pravidly.',
    related: ['FE-000', 'FE-003', 'FE-004', 'FE-006'],
    icon: 'disc'
  }
];

const LANGS = ['cs', 'en', 'de', 'es', 'ru'];
const LANG_FLAGS = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
  es: '🇪🇸',
  ru: '🇷🇺'
};

const severityText = {
  cs: { Kritická: 'Kritická', Vysoká: 'Vysoká', Střední: 'Střední' },
  en: { Kritická: 'Critical', Vysoká: 'High', Střední: 'Medium' },
  de: { Kritická: 'Kritisch', Vysoká: 'Hoch', Střední: 'Mittel' },
  es: { Kritická: 'Crítica', Vysoká: 'Alta', Střední: 'Media' },
  ru: { Kritická: 'Критично', Vysoká: 'Высоко', Střední: 'Средне' }
};

const THEMES = ['light', 'dark', 'contrast', 'paper', 'ocean', 'forest', 'ruby'];
const THEME_LABELS = {
  light: 'Light',
  dark: 'Dark',
  contrast: 'Contrast',
  paper: 'Paper',
  ocean: 'Ocean',
  forest: 'Forest',
  ruby: 'Ruby'
};

const uiText = {
  cs: {
    pageTitle: 'rozbor FE modelu',
    brandSubtitle: 'Detailní audit výpočtů, kódu a tvrzení konkrétního modelu',
    changeLanguage: 'Změnit jazyk',
    changeTheme: 'Změnit barevný profil',
    nav: ['Přehled', 'Tok dat', 'Problémy', 'Mapa není svět', 'Zatmění', 'Slovník'],
    sideTitle: 'Co se tu rozebírá',
    sideBody: 'Konkrétní projekt AlanSpaceAudits/conceptual_flat_earth_model: jeho demo, zdrojový kód, výpočetní logika, vědecko astronomická tvrzení.',
    introEyebrow: 'Rozbor konkrétního FE modelu',
    heroTitle: 'Programový a logický audit modelu conceptual_flat_earth_model',
    heroBody: 'Tato stránka je rozborem veřejného projektu <strong>Conceptual Flat Earth Model</strong>. Ukazuje, kde přesně model používá hotová astronomická data, kde je převádí do lokálně správné oblohy pro jednoho pozorovatele, kde je pak jen překresluje do FE scény, kde má ručně laděné konstanty a kde jeho tvrzení naráží na výpočetní nebo vědecký problém.',
    homeLink: 'superuserbase.com',
    liveDemo: 'Live demo původního modelu',
    sourceCode: 'Zdrojový kód na GitHubu',
    openProblems: 'Otevřít problémy',
    showFlow: 'Ukázat tok dat',
    summary: ['zaznamenaných problémů', 'kritických bodů', 'implementovaných FE predikcí zatmění'],
    summaryDetails: ['každý má důkaz v kódu', 'mění význam celého modelu', 'největší slib zůstal prázdný'],
    // TOHLE NENÍ DŮKAZ PLOCHÉ ZEMĚ. TOHLE JE DŮKAZ, ŽE BEZ VYPŮJČENÝCH DAT ZE STANDARDNÍ ASTRONOMIE TEN JEJICH ZÁZRAČNÝ "MODEL" NEFUNGUJE VŮBEC.
    explainTitle: 'Jednoduché vysvětlení hlavního problému',
    explainBody: 'Model vypadá přesvědčivě jen proto, že přesné polohy Slunce, Měsíce a planet vůbec nepočítá z ploché Země. Vezme už hotové astronomické souřadnice z běžných zdrojů standardní astronomie, převede je do lokální oblohy pro jednoho konkrétního pozorovatele a teprve potom je překreslí na plochý disk a dóm. Už v samotném začátku tedy stojí na cizím správném výsledku, ne na vlastní FE geometrii.<br><strong class="hard-claim">TOHLE NENÍ DŮKAZ PLOCHÉ ZEMĚ. TOHLE JE DŮKAZ, ŽE BEZ VYPŮJČENÝCH VÝSLEDKŮ STANDARDNÍ ASTRONOMIE TEN MODEL NEUMÍ VŮBEC NIC.</strong><br>Celý trik je v tom, že nejtěžší část práce už předem odvede běžná astronomie. Správná data, správná orientace i správně vypadající lokální obloha už přijdou hotové. FE vrstva pak nepřináší nové vysvětlení reality, ale jen přebalí cizí výsledek do jiné kresby a tváří se, že tím něco objevila.<br><strong class="hard-claim">POKUD JE TOHLE VYDÁVÁNO ZA DŮKAZ PLOCHÉ ZEMĚ, JE TO MANIPULACE S HOTOVÝMI DATY, NIKOLIV POCTIVÝ A PRAVDIVÝ MODEL REALITY.</strong><br>Jakmile ale po tom modelu chceme víc než lokálně působivý obrázek pro jednoho diváka, celé se to okamžitě rozpadá. Skutečný model reality musí nést jeden společný svět pro více současných pozorovatelů, ne separátní obrázek pro každého zvlášť. Tady žádná taková konzistentní FE geometrie neexistuje, a proto ten model selhává přesně ve chvíli, kdy má vysvětlovat realitu místo toho, aby jen dělal dojem.<br><strong class="hard-claim">TOHLE NENÍ ALTERNATIVNÍ KOSMOLOGIE ANI ALTERNATIVNÍ FYZIKA. TOHLE JE NEFUNKČNÍ PSEUDOMODEL, KTERÝ NEDOKÁŽE NÉST JEDNU KONZISTENTNÍ REALITU PRO VÍCE POZOROVATELŮ SOUČASNĚ.</strong><br><span class="block-justified">A právě proto už nestačí mluvit jen o omylu, slabině nebo nedodělaném modelu. Pokud někdo vezme cizí správná data, překreslí je do FE scény a prodává to jako potvrzení ploché Země, vytváří tím falešný dojem, že FE něco skutečně vysvětluje. Nejde o objev, nejde o alternativní vědu a nejde ani o poctivou slepou uličku. Jde o zavádějící konstrukci, která se opírá o cizí výsledky a vydává je za vlastní triumf.</span><br><strong class="hard-claim">VE VÝSLEDKU TEDY NEJDE O OBJEV ANI O FUNKČNÍ VYSVĚTLENÍ SVĚTA, ALE O PODVODNĚ PŮSOBÍCÍ PREZENTACI CIZÍCH VÝSLEDKŮ V FE PŘEVLEKU.</strong><br><span class="block-justified">Jde o jednoduchý, ale účinný postup: vezmete cizí, ověřené výsledky, překreslíte je do jiné scény, skryjete jejich vazbu na původní model a celé to vydáváte za vlastní důkaz. Přesně tímto způsobem FE projekty matou lidi a následně na tom vydělávají, prodávají hrníčky, kšiltovky, mapy a další věci či služby, přestože stojí na práci někoho jiného. Kdybyste někomu chtěli demonstrovat přesný význam slova PODVOD, udělali byste to právě tímto způsobem.</span> <strong class="hard-claim final-claim">PODVOD</strong><br><em class="explain-footnote block-justified">Celá tato „maškaráda“ je jen chabý pokus o zblbnutí lidí, kteří si nejsou schopni sami ověřit realitu. Tento „převratný“ conceptual_flat_earth_model je ve skutečnosti jen falešné lákadlo, na kterém různí šiřitelé podobného obsahu vydělávají, prodávají hrníčky, kšiltovky, mapy nebo aplikace, které v některých případech dokonce kompromitují vaše soukromá data (například polohu domácnosti, telefonní čísla či jména). Tito lidé jsou podvodníci, kteří si postavili byznys na klamání ostatních, a patří mezi ně například <strong class="person-name">Eric Dubay</strong>, <strong class="person-name">Mark Sargent</strong>, <strong class="person-name">David Weiss</strong>, <strong class="person-name">Nathan Thompson</strong>, <strong class="person-name">Austin Whitsitt</strong> nebo <strong class="person-name">Alan</strong>; dále mnoho dalších po celé zeměkouli a u nás v Česku pak například <strong class="person-name">Dominik Mrvík</strong>, který pouze přebírá zahraniční FE obsah, překládá ho do češtiny a následně na něm také profituje.</em>',
    flowEyebrow: 'Interaktivní rozbor',
    flowTitle: 'Odkud se opravdu bere správná obloha?',
    flowBody: 'Klikni na jednotlivé kroky. Každý blok popisuje, co se v kódu děje, proč je to důležité a které auditní body s tím souvisejí.',
    problemsEyebrow: 'Rozklikávací audit',
    problemsTitle: 'Všechny nalezené problémy',
    problemsBody: 'Použij filtr podle závažnosti nebo otevři kartu. Každá karta má jednoduché vysvětlení, technický důkaz, konkrétní důsledek a samostatné schéma problému.',
    filters: ['Vše', 'Kritické', 'Vysoké', 'Střední'],
    legend: ['Kritické: zásadně mění význam modelu', 'Vysoké: vážný výpočetní nebo logický problém', 'Střední: chyba implementace nebo robustnosti'],
    mapEyebrow: 'Ukázka projekce',
    mapTitle: 'Mapa není fyzický svět',
    mapBody: 'FE model používá severopolární azimutální mapu. Ta může být užitečný obrázek, ale směrem k jihu dramaticky mění velikosti rovnoběžek.',
    latLabel: 'Zeměpisná šířka',
    eclipseEyebrow: 'Zatmění',
    eclipseTitle: 'Predikce, nebo přehrání seznamu?',
    eclipseBody: 'Skutečný test modelu je předpověď. Tady jsou zatmění načtená z reálného katalogu AstroPixels/JPL DE405. FE predikční větev je v kódu jen placeholder.',
    modes: ['Katalog', 'FE prediktor'],
    glossaryEyebrow: 'Slovník',
    glossaryTitle: 'Slova, která se na stránce opakují',
    glossary: [
      ['RA / Dec', 'Souřadnice na obloze. Něco jako zeměpisná délka a šířka, ale pro hvězdy, Slunce a Měsíc.'],
      ['Efemeridy', 'Tabulky, které říkají, kde bude nebeské těleso v určitém čase.'],
      ['DE405', 'Přesný astronomický zdroj dat od JPL. Když ho model použije, bere hotové odpovědi z moderní astronomie.'],
      ['Projekce mapy', 'Způsob, jak nakreslit kulatý povrch na plochý papír. Každá projekce něco zkreslí.']
    ],
    flowCards: ['Co tento krok dělá', 'Proč je to problém', 'Konkrétní příklad', 'Důkaz v kódu'],
    problemCards: ['Jednoduché vysvětlení', 'Proč je to problém', 'Závěr', 'Důkaz v kódu', 'Vizualizace problému'],
    projection: { north: 'severně', south: 'jižně', selected: 'Vybraná rovnoběžka', globe: 'Koule', disk: 'AE disk', difference: 'Rozdíl', circumference: 'obvod vůči rovníku', compared: 'AE proti kouli', infinite: 'nekonečně' },
    eclipseCatalog: [
      ['Hotovo', 'Katalog zatmění', 'V kódu je seznam skutečných zatmění z AstroPixels/JPL DE405.'],
      ['Hotovo', 'Zpřesnění času', 'Model hledá minimum okolo známého času, ale nezačíná od nuly.'],
      ['Problém', 'Není to FE predikce', 'Použít cizí seznam není stejné jako předpovědět zatmění vlastním modelem.']
    ],
    eclipseFe: [
      ['Chybí', 'FE prediktor', 'Soubor feEclipseTrack.js výslovně říká, že jde o placeholder.'],
      ['Chybí', 'Vlastní geometrie stínu', 'Neexistuje nezávislé pravidlo, které by samo našlo datum a trasu zatmění.'],
      ['Závěr', 'Test selhal', 'Bez vlastního prediktoru zatmění nelze tvrdit, že model zatmění vysvětluje.']
    ]
  },
  en: {
    pageTitle: 'FE model audit',
    brandSubtitle: 'Detailed audit of calculations, code and claims in one specific model',
    changeLanguage: 'Change language',
    changeTheme: 'Change color profile',
    nav: ['Overview', 'Data flow', 'Problems', 'A map is not the world', 'Eclipses', 'Glossary'],
    sideTitle: 'What this page audits',
    sideBody: 'The specific project AlanSpaceAudits/conceptual_flat_earth_model: its demo, source code, computational logic, and scientific/astronomical claims.',
    introEyebrow: 'Audit of one specific FE model',
    heroTitle: 'Code and logic audit of conceptual_flat_earth_model',
    heroBody: 'This page audits the public project <strong>Conceptual Flat Earth Model</strong>. It shows exactly where the model uses ready-made astronomical data, where it turns them into a locally correct sky for one observer, where it only redraws that result into an FE scene, where it relies on hand-tuned constants, and where its claims hit computational or scientific problems.',
    homeLink: 'superuserbase.com',
    liveDemo: 'Original model live demo',
    sourceCode: 'Source code on GitHub',
    openProblems: 'Open problems',
    showFlow: 'Show data flow',
    summary: ['documented problems', 'critical points', 'implemented FE eclipse predictions'],
    summaryDetails: ['each one has code evidence', 'they change the whole model', 'the biggest promise stayed empty'],
    explainTitle: 'Simple explanation of the main problem',
    explainBody: 'The model looks convincing mainly because it does not predict the precise positions of the Sun, Moon and planets from a flat Earth. It takes ready-made astronomical coordinates from standard globe-based sources, turns them into a local sky for one specific observer, and only then draws them on a flat disk and dome. <strong class="hard-claim">That visualization can be interesting, but it does not prove that FE geometry works. It shows the opposite: there is not, and cannot be, a functional FE model here.</strong><br>What it actually does is much weaker than a real world-model: it borrows the difficult part from standard astronomy, solves the visible sky in a normal spherical framework, and only afterwards wraps that solved answer in FE artwork. The impressive part is therefore not an FE prediction. It is a presentation layer placed on top of imported results.<br><strong class="hard-claim">This is not an alternative description of reality. It is a conversion of ready-made spherical sky data into a different drawing, and it breaks down as soon as you ask it to represent one shared world for multiple observers at once.</strong><br>That is why the central claim fails: a model of reality must provide one coherent geometry that many observers can inhabit together. This one only generates locally persuasive scenes while leaning on a framework it claims to replace.<br>It is a weak attempt to confuse people who do not check the mechanism for themselves. The whole conceptual_flat_earth_model is therefore just a false lure for people who profit from it, such as <strong class="person-name">Dominik Mrvík</strong> in the Czech Republic and <strong class="person-name">Shane</strong> elsewhere.',
    flowEyebrow: 'Interactive audit',
    flowTitle: 'Where does the correct sky really come from?',
    flowBody: 'Click each step. Every block explains what the code does, why it matters, and which audit points connect to it.',
    problemsEyebrow: 'Expandable audit',
    problemsTitle: 'All documented problems',
    problemsBody: 'Use the severity filter or open a card. Each card contains a simple explanation, technical evidence, concrete consequence, and its own diagram.',
    filters: ['All', 'Critical', 'High', 'Medium'],
    legend: ['Critical: changes the meaning of the model', 'High: serious computational or logical issue', 'Medium: implementation or robustness issue'],
    mapEyebrow: 'Projection demo',
    mapTitle: 'A map is not the physical world',
    mapBody: 'The FE model uses a north-pole azimuthal map. That can be a useful drawing, but toward the south it drastically changes the size of parallels.',
    latLabel: 'Latitude',
    eclipseEyebrow: 'Eclipses',
    eclipseTitle: 'Prediction, or replaying a list?',
    eclipseBody: 'The real test of a model is prediction. Here the eclipses are loaded from a real AstroPixels/JPL DE405 catalogue. The FE prediction branch in the code is only a placeholder.',
    modes: ['Catalogue', 'FE predictor'],
    glossaryEyebrow: 'Glossary',
    glossaryTitle: 'Repeated terms on this page',
    glossary: [
      ['RA / Dec', 'Sky coordinates. Like longitude and latitude, but for stars, the Sun and the Moon.'],
      ['Ephemerides', 'Tables that say where a celestial body will be at a given time.'],
      ['DE405', 'A precise astronomical data source from JPL. When the model uses it, it imports answers from modern astronomy.'],
      ['Map projection', 'A method for drawing a curved surface on flat paper. Every projection distorts something.']
    ],
    flowCards: ['What this step does', 'Why this is a problem', 'Concrete example', 'Evidence in code'],
    problemCards: ['Simple explanation', 'Why this is a problem', 'Conclusion', 'Evidence in code', 'Problem visualization'],
    projection: { north: 'north', south: 'south', selected: 'Selected parallel', globe: 'Globe', disk: 'AE disk', difference: 'Difference', circumference: 'circumference vs equator', compared: 'AE versus globe', infinite: 'infinite' },
    eclipseCatalog: [
      ['Done', 'Eclipse catalogue', 'The code contains a list of real eclipses from AstroPixels/JPL DE405.'],
      ['Done', 'Time refinement', 'The model searches for a minimum near a known time, but it does not start from zero.'],
      ['Problem', 'This is not FE prediction', 'Using someone else’s list is not the same as predicting eclipses with your own model.']
    ],
    eclipseFe: [
      ['Missing', 'FE predictor', 'The file feEclipseTrack.js explicitly says it is a placeholder.'],
      ['Missing', 'Own shadow geometry', 'There is no independent rule that can find the date and path of an eclipse by itself.'],
      ['Conclusion', 'The test failed', 'Without its own eclipse predictor, the model cannot claim to explain eclipses.']
    ]
  }
};

uiText.de = {
  ...uiText.en,
  pageTitle: 'FE-Modell-Audit',
  brandSubtitle: 'Detaillierte Prüfung von Berechnungen, Code und Behauptungen eines konkreten Modells',
  changeLanguage: 'Sprache wechseln',
  changeTheme: 'Farbprofil wechseln',
  nav: ['Übersicht', 'Datenfluss', 'Probleme', 'Eine Karte ist nicht die Welt', 'Finsternisse', 'Glossar'],
  sideTitle: 'Was hier geprüft wird',
  sideBody: 'Das konkrete Projekt AlanSpaceAudits/conceptual_flat_earth_model: Demo, Quellcode, Rechenlogik und wissenschaftlich-astronomische Behauptungen.',
  introEyebrow: 'Audit eines konkreten FE-Modells',
  heroTitle: 'Code- und Logik-Audit von conceptual_flat_earth_model',
  heroBody: 'Diese Seite prüft das öffentliche Projekt <strong>Conceptual Flat Earth Model</strong>. Sie zeigt genau, wo das Modell fertige astronomische Daten nutzt, wo es sie in einen lokal richtigen Himmel für einen Beobachter umwandelt, wo es dieses Ergebnis nur in eine FE-Szene umzeichnet, wo handabgestimmte Konstanten stecken und wo seine Behauptungen auf rechnerische oder wissenschaftliche Probleme treffen.',
  homeLink: 'superuserbase.com',
  liveDemo: 'Live-Demo des Originalmodells',
  sourceCode: 'Quellcode auf GitHub',
  openProblems: 'Probleme öffnen',
  showFlow: 'Datenfluss zeigen',
  summary: ['dokumentierte Probleme', 'kritische Punkte', 'implementierte FE-Finsternisvorhersagen'],
  summaryDetails: ['jeder Punkt hat Codebelege', 'sie verändern das ganze Modell', 'das größte Versprechen blieb leer'],
  explainTitle: 'Einfache Erklärung des Hauptproblems',
  explainBody: 'Das Modell wirkt vor allem deshalb überzeugend, weil es die genauen Positionen von Sonne, Mond und Planeten nicht aus einer flachen Erde vorhersagt. Es nimmt fertige astronomische Koordinaten aus normalen, kugelbasierten Quellen, wandelt sie in einen lokalen Himmel für einen konkreten Beobachter um und zeichnet sie erst danach auf eine flache Scheibe und einen Dom. <strong class="hard-claim">Diese Visualisierung kann interessant sein, beweist aber nicht, dass FE-Geometrie funktioniert. Sie zeigt das Gegenteil: Hier gibt es kein funktionsfähiges FE-Modell und es kann keines geben.</strong><br><strong class="hard-claim">Das ist keine alternative Beschreibung der Realität. Es ist die Umwandlung fertiger sphärischer Himmelsdaten in eine andere Zeichnung, die zusammenbricht, sobald sie eine gemeinsame Welt für mehrere Beobachter zugleich darstellen soll.</strong><br>Es ist ein schwacher Versuch, Menschen zu verwirren, die den Mechanismus nicht selbst prüfen. Das gesamte conceptual_flat_earth_model ist deshalb nur ein falscher Köder für Menschen, die davon profitieren, wie in der Tschechischen Republik <strong class="person-name">Dominik Mrvík</strong> und anderswo zum Beispiel <strong class="person-name">Shane</strong>.',
  flowEyebrow: 'Interaktiver Audit',
  flowTitle: 'Woher kommt der richtige Himmel wirklich?',
  flowBody: 'Klicke auf die einzelnen Schritte. Jeder Block erklärt, was der Code tut, warum es wichtig ist und welche Auditpunkte damit zusammenhängen.',
  problemsEyebrow: 'Aufklappbarer Audit',
  problemsTitle: 'Alle dokumentierten Probleme',
  problemsBody: 'Nutze den Schweregradfilter oder öffne eine Karte. Jede Karte enthält eine einfache Erklärung, technischen Nachweis, konkrete Folge und ein eigenes Diagramm.',
  filters: ['Alle', 'Kritisch', 'Hoch', 'Mittel'],
  legend: ['Kritisch: verändert die Bedeutung des Modells', 'Hoch: ernstes Rechen- oder Logikproblem', 'Mittel: Implementierungs- oder Robustheitsfehler'],
  mapEyebrow: 'Projektionsdemo',
  mapTitle: 'Eine Karte ist nicht die physische Welt',
  mapBody: 'Das FE-Modell nutzt eine azimutale Nordpolkarte. Das kann eine nützliche Zeichnung sein, verändert nach Süden aber die Größe der Breitenkreise drastisch.',
  latLabel: 'Breitengrad',
  eclipseEyebrow: 'Finsternisse',
  eclipseTitle: 'Vorhersage oder Abspielen einer Liste?',
  eclipseBody: 'Der echte Test eines Modells ist Vorhersage. Hier werden Finsternisse aus einem realen AstroPixels/JPL-DE405-Katalog geladen. Der FE-Vorhersagezweig im Code ist nur ein Platzhalter.',
  modes: ['Katalog', 'FE-Prädiktor'],
  glossaryEyebrow: 'Glossar',
  glossaryTitle: 'Begriffe, die hier wiederkehren',
  glossary: [
    ['RA / Dec', 'Himmelskoordinaten. Wie Länge und Breite, aber für Sterne, Sonne und Mond.'],
    ['Ephemeriden', 'Tabellen, die sagen, wo ein Himmelskörper zu einer bestimmten Zeit steht.'],
    ['DE405', 'Eine präzise astronomische Datenquelle von JPL. Nutzt das Modell sie, importiert es Antworten aus moderner Astronomie.'],
    ['Kartenprojektion', 'Eine Methode, eine gekrümmte Oberfläche auf flaches Papier zu zeichnen. Jede Projektion verzerrt etwas.']
  ],
  flowCards: ['Was dieser Schritt tut', 'Warum das ein Problem ist', 'Konkretes Beispiel', 'Nachweis im Code'],
  problemCards: ['Einfache Erklärung', 'Warum das ein Problem ist', 'Fazit', 'Nachweis im Code', 'Problemvisualisierung'],
  projection: { north: 'nördlich', south: 'südlich', selected: 'Gewählter Breitenkreis', globe: 'Kugel', disk: 'AE-Scheibe', difference: 'Unterschied', circumference: 'Umfang zum Äquator', compared: 'AE gegenüber Kugel', infinite: 'unendlich' },
  eclipseCatalog: [
    ['Fertig', 'Finsterniskatalog', 'Im Code steht eine Liste realer Finsternisse aus AstroPixels/JPL DE405.'],
    ['Fertig', 'Zeitverfeinerung', 'Das Modell sucht ein Minimum um eine bekannte Zeit, beginnt aber nicht bei null.'],
    ['Problem', 'Das ist keine FE-Vorhersage', 'Eine fremde Liste zu verwenden ist nicht dasselbe wie Finsternisse mit dem eigenen Modell vorherzusagen.']
  ],
  eclipseFe: [
    ['Fehlt', 'FE-Prädiktor', 'Die Datei feEclipseTrack.js sagt ausdrücklich, dass es ein Platzhalter ist.'],
    ['Fehlt', 'Eigene Schattengeometrie', 'Es gibt keine unabhängige Regel, die Datum und Pfad einer Finsternis selbst findet.'],
    ['Fazit', 'Der Test ist gescheitert', 'Ohne eigenen Finsternisprädiktor kann das Modell nicht behaupten, Finsternisse zu erklären.']
  ]
};

uiText.es = {
  ...uiText.en,
  pageTitle: 'auditoría del modelo FE',
  brandSubtitle: 'Auditoría detallada de cálculos, código y afirmaciones de un modelo concreto',
  changeLanguage: 'Cambiar idioma',
  changeTheme: 'Cambiar perfil de color',
  nav: ['Resumen', 'Flujo de datos', 'Problemas', 'Un mapa no es el mundo', 'Eclipses', 'Glosario'],
  sideTitle: 'Qué se audita aquí',
  sideBody: 'El proyecto concreto AlanSpaceAudits/conceptual_flat_earth_model: su demo, código fuente, lógica de cálculo y afirmaciones científicas y astronómicas.',
  introEyebrow: 'Auditoría de un modelo FE concreto',
  heroTitle: 'Auditoría de código y lógica de conceptual_flat_earth_model',
  heroBody: 'Esta página audita el proyecto público <strong>Conceptual Flat Earth Model</strong>. Muestra exactamente dónde el modelo usa datos astronómicos ya preparados, dónde los convierte en un cielo local correcto para un observador, dónde solo redibuja ese resultado en una escena FE, dónde depende de constantes ajustadas a mano y dónde sus afirmaciones chocan con problemas computacionales o científicos.',
  homeLink: 'superuserbase.com',
  liveDemo: 'Demo original en vivo',
  sourceCode: 'Código fuente en GitHub',
  openProblems: 'Abrir problemas',
  showFlow: 'Mostrar flujo de datos',
  summary: ['problemas documentados', 'puntos críticos', 'predicciones FE de eclipses implementadas'],
  summaryDetails: ['cada uno tiene evidencia en código', 'cambian todo el modelo', 'la mayor promesa quedó vacía'],
  explainTitle: 'Explicación simple del problema principal',
  explainBody: 'El modelo parece convincente principalmente porque no predice las posiciones exactas del Sol, la Luna y los planetas desde una Tierra plana. Toma coordenadas astronómicas ya hechas de fuentes estándar basadas en el globo, las convierte en un cielo local para un observador concreto y solo después las dibuja sobre un disco plano y una cúpula. <strong class="hard-claim">Esa visualización puede ser interesante, pero no demuestra que la geometría FE funcione. Demuestra lo contrario: aquí no existe, ni puede existir, un modelo FE funcional.</strong><br><strong class="hard-claim">Esto no es una descripción alternativa de la realidad. Es una conversión de datos esféricos ya resueltos a otro dibujo, y se derrumba en cuanto se le exige representar un solo mundo compartido por varios observadores al mismo tiempo.</strong><br>Es un intento débil de confundir a personas que no comprueban el mecanismo por sí mismas. Todo conceptual_flat_earth_model es por tanto un falso señuelo para personas que se benefician de ello, como <strong class="person-name">Dominik Mrvík</strong> en la República Checa y, en otros lugares, por ejemplo <strong class="person-name">Shane</strong>.',
  flowEyebrow: 'Auditoría interactiva',
  flowTitle: '¿De dónde sale realmente el cielo correcto?',
  flowBody: 'Haz clic en cada paso. Cada bloque explica qué hace el código, por qué importa y qué puntos de auditoría se relacionan con él.',
  problemsEyebrow: 'Auditoría desplegable',
  problemsTitle: 'Todos los problemas documentados',
  problemsBody: 'Usa el filtro de gravedad o abre una tarjeta. Cada tarjeta contiene una explicación simple, evidencia técnica, consecuencia concreta y su propio diagrama.',
  filters: ['Todo', 'Críticos', 'Altos', 'Medios'],
  legend: ['Crítico: cambia el significado del modelo', 'Alto: problema serio de cálculo o lógica', 'Medio: problema de implementación o robustez'],
  mapEyebrow: 'Demo de proyección',
  mapTitle: 'Un mapa no es el mundo físico',
  mapBody: 'El modelo FE usa un mapa azimutal centrado en el polo norte. Puede ser un dibujo útil, pero hacia el sur cambia drásticamente el tamaño de los paralelos.',
  latLabel: 'Latitud',
  eclipseEyebrow: 'Eclipses',
  eclipseTitle: '¿Predicción o reproducción de una lista?',
  eclipseBody: 'La verdadera prueba de un modelo es la predicción. Aquí los eclipses se cargan desde un catálogo real AstroPixels/JPL DE405. La rama predictiva FE del código es solo un marcador de posición.',
  modes: ['Catálogo', 'Predictor FE'],
  glossaryEyebrow: 'Glosario',
  glossaryTitle: 'Términos repetidos en esta página',
  glossary: [
    ['RA / Dec', 'Coordenadas del cielo. Parecidas a longitud y latitud, pero para estrellas, el Sol y la Luna.'],
    ['Efemérides', 'Tablas que indican dónde estará un cuerpo celeste en un momento dado.'],
    ['DE405', 'Una fuente precisa de datos astronómicos de JPL. Si el modelo la usa, importa respuestas de la astronomía moderna.'],
    ['Proyección de mapa', 'Método para dibujar una superficie curva en papel plano. Toda proyección distorsiona algo.']
  ],
  flowCards: ['Qué hace este paso', 'Por qué es un problema', 'Ejemplo concreto', 'Evidencia en el código'],
  problemCards: ['Explicación simple', 'Por qué es un problema', 'Conclusión', 'Evidencia en el código', 'Visualización del problema'],
  projection: { north: 'norte', south: 'sur', selected: 'Paralelo elegido', globe: 'Globo', disk: 'Disco AE', difference: 'Diferencia', circumference: 'circunferencia frente al ecuador', compared: 'AE frente al globo', infinite: 'infinito' },
  eclipseCatalog: [
    ['Listo', 'Catálogo de eclipses', 'El código contiene una lista de eclipses reales de AstroPixels/JPL DE405.'],
    ['Listo', 'Ajuste de tiempo', 'El modelo busca un mínimo cerca de una hora conocida, pero no empieza desde cero.'],
    ['Problema', 'Esto no es predicción FE', 'Usar una lista ajena no equivale a predecir eclipses con un modelo propio.']
  ],
  eclipseFe: [
    ['Falta', 'Predictor FE', 'El archivo feEclipseTrack.js dice explícitamente que es un marcador de posición.'],
    ['Falta', 'Geometría propia de sombra', 'No existe una regla independiente que encuentre por sí sola fecha y ruta de un eclipse.'],
    ['Conclusión', 'La prueba falló', 'Sin un predictor propio de eclipses, el modelo no puede afirmar que explica eclipses.']
  ]
};

uiText.ru = {
  ...uiText.en,
  pageTitle: 'аудит FE-модели',
  brandSubtitle: 'Подробный аудит вычислений, кода и заявлений конкретной модели',
  changeLanguage: 'Сменить язык',
  changeTheme: 'Сменить цветовой профиль',
  nav: ['Обзор', 'Поток данных', 'Проблемы', 'Карта не является миром', 'Затмения', 'Словарь'],
  sideTitle: 'Что здесь разбирается',
  sideBody: 'Конкретный проект AlanSpaceAudits/conceptual_flat_earth_model: демо, исходный код, вычислительная логика и научно-астрономические заявления.',
  introEyebrow: 'Аудит конкретной FE-модели',
  heroTitle: 'Аудит кода и логики conceptual_flat_earth_model',
  heroBody: 'Эта страница разбирает публичный проект <strong>Conceptual Flat Earth Model</strong>. Она показывает, где именно модель использует готовые астрономические данные, где превращает их в локально правильное небо для одного наблюдателя, где лишь перерисовывает этот результат в FE-сцену, где опирается на вручную подобранные константы и где ее заявления сталкиваются с вычислительными или научными проблемами.',
  homeLink: 'superuserbase.com',
  liveDemo: 'Оригинальная live-демонстрация',
  sourceCode: 'Исходный код на GitHub',
  openProblems: 'Открыть проблемы',
  showFlow: 'Показать поток данных',
  summary: ['задокументированных проблем', 'критических пунктов', 'реализованных FE-прогнозов затмений'],
  summaryDetails: ['у каждого есть доказательство в коде', 'они меняют смысл всей модели', 'главное обещание осталось пустым'],
  explainTitle: 'Простое объяснение главной проблемы',
  explainBody: 'Модель выглядит убедительно главным образом потому, что не предсказывает точные положения Солнца, Луны и планет из плоской Земли. Она берет готовые астрономические координаты из стандартных источников сферической астрономии, превращает их в локальное небо для конкретного наблюдателя и только потом рисует их на плоском диске и куполе. <strong class="hard-claim">Такая визуализация может быть интересной, но она не доказывает, что FE-геометрия работает. Она показывает обратное: здесь нет и не может быть рабочей FE-модели.</strong><br><strong class="hard-claim">Это не альтернативное описание реальности. Это перевод уже готовых сферических данных о небе в другой рисунок, и он распадается, как только от него требуют представить один общий мир сразу для нескольких наблюдателей.</strong><br>Это слабая попытка запутать людей, которые не проверяют механизм самостоятельно. Весь conceptual_flat_earth_model поэтому является лишь ложной приманкой для людей, которые на этом зарабатывают, например <strong class="person-name">Dominik Mrvík</strong> в Чехии и <strong class="person-name">Shane</strong> в других местах.',
  flowEyebrow: 'Интерактивный аудит',
  flowTitle: 'Откуда на самом деле берется правильное небо?',
  flowBody: 'Нажимайте на шаги. Каждый блок объясняет, что делает код, почему это важно и какие пункты аудита с этим связаны.',
  problemsEyebrow: 'Раскрываемый аудит',
  problemsTitle: 'Все задокументированные проблемы',
  problemsBody: 'Используйте фильтр по серьезности или откройте карточку. В каждой карточке есть простое объяснение, техническое доказательство, конкретное следствие и схема.',
  filters: ['Все', 'Критичные', 'Высокие', 'Средние'],
  legend: ['Критично: меняет смысл модели', 'Высоко: серьезная вычислительная или логическая проблема', 'Средне: проблема реализации или надежности'],
  mapEyebrow: 'Демо проекции',
  mapTitle: 'Карта не является физическим миром',
  mapBody: 'FE-модель использует азимутальную карту с центром на северном полюсе. Это может быть полезный рисунок, но к югу она резко меняет размеры параллелей.',
  latLabel: 'Широта',
  eclipseEyebrow: 'Затмения',
  eclipseTitle: 'Прогноз или воспроизведение списка?',
  eclipseBody: 'Настоящий тест модели - прогноз. Здесь затмения загружаются из реального каталога AstroPixels/JPL DE405. FE-ветка прогнозирования в коде является только заглушкой.',
  modes: ['Каталог', 'FE-прогноз'],
  glossaryEyebrow: 'Словарь',
  glossaryTitle: 'Термины, которые повторяются на странице',
  glossary: [
    ['RA / Dec', 'Координаты на небе. Похожи на долготу и широту, но для звезд, Солнца и Луны.'],
    ['Эфемериды', 'Таблицы, показывающие, где будет небесное тело в определенное время.'],
    ['DE405', 'Точный астрономический источник данных JPL. Когда модель его использует, она импортирует ответы современной астрономии.'],
    ['Картографическая проекция', 'Способ нарисовать искривленную поверхность на плоской бумаге. Любая проекция что-то искажает.']
  ],
  flowCards: ['Что делает этот шаг', 'Почему это проблема', 'Конкретный пример', 'Доказательство в коде'],
  problemCards: ['Простое объяснение', 'Почему это проблема', 'Вывод', 'Доказательство в коде', 'Визуализация проблемы'],
  projection: { north: 'северной широты', south: 'южной широты', selected: 'Выбранная параллель', globe: 'Глобус', disk: 'AE-диск', difference: 'Разница', circumference: 'окружность относительно экватора', compared: 'AE против глобуса', infinite: 'бесконечно' },
  eclipseCatalog: [
    ['Готово', 'Каталог затмений', 'В коде есть список реальных затмений из AstroPixels/JPL DE405.'],
    ['Готово', 'Уточнение времени', 'Модель ищет минимум около известного времени, но не начинает с нуля.'],
    ['Проблема', 'Это не FE-прогноз', 'Использование чужого списка не равно прогнозу затмений собственной моделью.']
  ],
  eclipseFe: [
    ['Отсутствует', 'FE-прогноз', 'Файл feEclipseTrack.js прямо говорит, что это заглушка.'],
    ['Отсутствует', 'Собственная геометрия тени', 'Нет независимого правила, которое само находит дату и путь затмения.'],
    ['Вывод', 'Тест провален', 'Без собственного прогноза затмений модель не может утверждать, что объясняет затмения.']
  ]
};

const problemTranslations = {
  cs: problems,
  en: [
    ['The model only works as a picture for one observer', 'The code can produce a locally correct-looking sky for a chosen viewer, but that is not yet a model of reality shared by multiple observers at the same time.', 'Once the sky is obtained through the standard RA/Dec to local-sky transform, the FE scene only redraws an already computed result. It does not provide one coherent FE world that carries many observers together.', 'Two observers, two locally correct pictures, but no shared FE geometry carrying both at once.', 'This is not an alternative description of reality. It is a local visualization transform of an already solved sky.'],
    ['The model uses ready-made DE405 ephemerides', 'The model claims to show a working FE sky, but it takes precise positions from ready-made astronomical tables.', 'The default position source is AstroPixels/JPL DE405. Sky accuracy therefore comes from modern astronomical tables, not from the model’s flat geometry.', 'Data flow DE405 -> RA/Dec -> local sky -> FE drawing.', 'Correct body positions are not evidence for an FE model because they were imported from another source.'],
    ['The observed sky is computed through a globe transform', 'The model says “flat world”, but for observed altitude and direction it uses a standard local sky computed from RA/Dec.', 'Azimuth and elevation are the main observed values. The code obtains them from RA/Dec, latitude, longitude and sidereal time before FE drawing begins.', 'Observer, local sky above, disk only after that.', 'The FE scene is not the source of observations. It is an image after a standard sky calculation.'],
    ['The lat/long grid is hard-coded as an AE map projection', 'The FE disk is a map projection. A projection can be a useful picture, but it is not automatically the physical shape of the world.', 'An azimuthal equidistant projection is a way to draw a map. Toward the south it heavily changes parallel sizes and distances.', 'Comparison of a parallel circumference on a sphere and in the FE disk.', 'The model confuses a map projection with physical world geometry.'],
    ['Body heights are hand-tuned bands', 'The height of the Sun, Moon and planets above the dome is derived from a chosen band, not from independent light physics.', 'The heights are derived from declination and hand-picked constants HEADROOM and SUN_RANGE.', 'A declination slider moving a body up and down without physical distance.', 'This is image tuning, not an independent physical mechanism.'],
    ['Eclipses are replayed from a real catalogue', 'Eclipses are not found by an FE predictor. They are loaded from a real catalogue and replayed.', 'Eclipse demos are built from the AstroPixels/JPL DE405 catalogue. The FE prediction branch is only a placeholder.', 'Eclipse catalogue versus empty FE predictor.', 'Replaying known eclipses is not a flat-model prediction.'],
    ['The eclipse shadow uses chosen FE radii', 'The eclipse shadow depends on chosen FE Sun/Moon radii and catalogue magnitude.', 'Sun and Moon radii are FE-scale constants, and the umbra is filtered using catalogue magnitude.', 'Two circles with adjustable size and shadow impact.', 'The shadow is a visualization construction, not a verification of FE geometry.'],
    ['GeoC planets have no retrograde motion', 'Real planets show retrograde motion. One planetary pipeline in the model admits it is missing.', 'A code comment admits inner planets do not librate around the Sun and no planet has retrograde motion.', 'The real loop of Mars versus a simple path without a loop.', 'The model misses one of the best-known properties of the planetary sky.'],
    ['Outside the data range it returns a fake position', 'When the model has no data, it should admit the error. Instead it returns a valid-looking RA=0, Dec=0 coordinate.', 'AstroPixels data cover only 2019-2030. Outside that range, the code returns RA=0, Dec=0, which looks like a valid position.', 'Timeline with safe green range and red years outside the data.', 'This is a real robustness bug that can produce misleading results.'],
    ['The first update computes with an unset value', 'The first calculation uses a value that has not been set yet, producing NaN.', 'Optical height is used for Sun and Moon coordinates before it is assigned.', 'Step order: use value -> set value.', 'This is a plain programming error in calculation order.'],
    ['Moon phases are not FE illumination', 'Moon phases are taken from angular geometry of celestial vectors, not from an FE light model.', 'Phases are computed from geocentric unit vectors of the Sun and Moon. FE distances and light paths are not used.', 'Sun-Moon angle in the sky versus missing FE light geometry.', 'Moon phases are not explained by the FE model.'],
    ['The page itself says this is a conceptual model', 'The live demo uses cautious language: conceptual model, optical dome, and fictitious observer.', 'The live page speaks about a conceptual model, optical dome, and fictitious observer.', 'Difference between a drawing model and a model that can predict.', 'A conceptual visualization is not evidence for physical reality.']
  ],
  de: [
    ['Das Modell funktioniert nur als Bild für einen Beobachter', 'Der Code kann für einen gewählten Betrachter einen lokal richtig wirkenden Himmel erzeugen, aber das ist noch kein Modell einer Realität, die mehrere Beobachter gleichzeitig teilen.', 'Sobald der Himmel über die Standard-Transformation von RA/Dec in den lokalen Himmel gewonnen wird, zeichnet die FE-Szene nur ein bereits berechnetes Ergebnis nach. Sie liefert keine gemeinsame FE-Welt, die mehrere Beobachter zugleich trägt.', 'Zwei Beobachter, zwei lokal richtige Bilder, aber keine gemeinsame FE-Geometrie für beide zugleich.', 'Das ist keine alternative Beschreibung der Realität. Es ist nur eine lokale Visualisierung eines bereits gelösten Himmels.'],
    ['Das Modell verwendet fertige DE405-Ephemeriden', 'Das Modell behauptet, einen funktionierenden FE-Himmel zu zeigen, übernimmt genaue Positionen aber aus fertigen astronomischen Tabellen.', 'Die Standardquelle ist AstroPixels/JPL DE405. Die Himmelsgenauigkeit kommt also aus modernen astronomischen Tabellen, nicht aus flacher Modellgeometrie.', 'Datenfluss DE405 -> RA/Dec -> lokaler Himmel -> FE-Zeichnung.', 'Korrekte Körperpositionen sind kein Beweis für ein FE-Modell, weil sie aus einer anderen Quelle importiert wurden.'],
    ['Der beobachtete Himmel wird über eine Kugel-Transformation berechnet', 'Das Modell sagt “flache Welt”, nutzt für beobachtete Höhe und Richtung aber den Standardhimmel aus RA/Dec.', 'Azimut und Elevation sind die zentralen Beobachtungswerte. Der Code gewinnt sie aus RA/Dec, Breite, Länge und Sternzeit, bevor die FE-Zeichnung beginnt.', 'Beobachter, darüber lokaler Himmel, danach erst die Scheibe.', 'Die FE-Szene ist nicht die Quelle der Beobachtung. Sie ist ein Bild nach einer Standard-Himmelsrechnung.'],
    ['Das Lat/Long-Gitter ist hart als AE-Kartenprojektion codiert', 'Die FE-Scheibe ist eine Kartenprojektion. Eine Projektion kann nützlich sein, ist aber nicht automatisch die physische Form der Welt.', 'Die azimutal äquidistante Projektion ist eine Zeichenmethode. Richtung Süden verändert sie Breitenkreise und Distanzen stark.', 'Vergleich eines Breitenkreisumfangs auf Kugel und FE-Scheibe.', 'Das Modell verwechselt Kartenprojektion mit physischer Geometrie.'],
    ['Körperhöhen sind handabgestimmte Bänder', 'Die Höhe von Sonne, Mond und Planeten über dem Dom kommt aus einem gewählten Band, nicht aus unabhängiger Lichtphysik.', 'Die Höhen werden aus Deklination und den handgewählten Konstanten HEADROOM und SUN_RANGE abgeleitet.', 'Ein Deklinationsregler bewegt den Körper ohne physische Distanz hoch und runter.', 'Das ist Bildabstimmung, kein unabhängiger physikalischer Mechanismus.'],
    ['Finsternisse werden aus einem realen Katalog abgespielt', 'Finsternisse werden nicht von einem FE-Prädiktor gefunden. Sie werden aus einem realen Katalog geladen und abgespielt.', 'Die Demos entstehen aus dem AstroPixels/JPL-DE405-Katalog. Der FE-Vorhersagezweig ist nur ein Platzhalter.', 'Finsterniskatalog gegen leeren FE-Prädiktor.', 'Bekannte Finsternisse abzuspielen ist keine Vorhersage eines flachen Modells.'],
    ['Der Finsternisschatten nutzt gewählte FE-Radien', 'Der Schatten hängt von gewählten FE-Radien für Sonne und Mond sowie von Katalogmagnitude ab.', 'Sonnen- und Mondradien sind FE-Skalenkonstanten, und die Umbra wird zusätzlich nach Katalogmagnitude gefiltert.', 'Zwei Kreise mit veränderbarer Größe und Schattenwirkung.', 'Der Schatten ist eine Visualisierungskonstruktion, keine Prüfung der FE-Geometrie.'],
    ['GeoC-Planeten haben keine rückläufige Bewegung', 'Reale Planeten zeigen retrograde Bewegung. Eine Pipeline des Modells gibt selbst zu, dass sie fehlt.', 'Ein Codekommentar gibt zu, dass innere Planeten nicht um die Sonne libriren und keine Planeten retrograd laufen.', 'Reale Marsschleife gegen einfache Bahn ohne Schleife.', 'Das Modell verfehlt eine der bekanntesten Eigenschaften des Planetenhimmels.'],
    ['Außerhalb des Datenbereichs gibt es eine falsche Position zurück', 'Wenn Daten fehlen, sollte das Modell den Fehler melden. Stattdessen gibt es RA=0, Dec=0 zurück.', 'AstroPixels-Daten decken nur 2019-2030 ab. Außerhalb davon wirkt RA=0, Dec=0 wie eine gültige Position.', 'Zeitleiste mit sicherem grünem Bereich und roten Jahren außerhalb der Daten.', 'Das ist ein echter Robustheitsfehler, der irreführende Ergebnisse erzeugen kann.'],
    ['Das erste Update rechnet mit einem ungesetzten Wert', 'Die erste Berechnung nutzt einen Wert, der noch nicht gesetzt ist, und erzeugt NaN.', 'Die optische Höhe wird für Sonne und Mond verwendet, bevor sie gesetzt wird.', 'Reihenfolge: Wert benutzen -> Wert setzen.', 'Das ist ein gewöhnlicher Programmierfehler in der Rechenreihenfolge.'],
    ['Mondphasen sind keine FE-Beleuchtung', 'Mondphasen stammen aus Winkelgeometrie von Himmelsvektoren, nicht aus einem FE-Lichtmodell.', 'Die Phasen werden aus geozentrischen Einheitsvektoren von Sonne und Mond berechnet. FE-Distanzen und Lichtwege werden nicht benutzt.', 'Sonne-Mond-Winkel am Himmel gegen fehlende FE-Lichtgeometrie.', 'Mondphasen werden vom FE-Modell nicht erklärt.'],
    ['Die Seite selbst nennt es ein konzeptuelles Modell', 'Die Live-Demo nutzt vorsichtige Begriffe: konzeptuelles Modell, optischer Dom und fiktiver Beobachter.', 'Die Live-Seite spricht von konzeptuellem Modell, optischem Dom und fiktivem Beobachter.', 'Unterschied zwischen Zeichenmodell und vorhersagefähigem Modell.', 'Eine konzeptuelle Visualisierung ist kein Beweis physischer Realität.']
  ],
  es: [
    ['El modelo solo funciona como imagen para un observador', 'El código puede producir un cielo localmente correcto para un observador elegido, pero eso todavía no es un modelo de una realidad compartida por varios observadores al mismo tiempo.', 'Una vez que el cielo se obtiene mediante la transformación estándar de RA/Dec al cielo local, la escena FE solo redibuja un resultado ya calculado. No aporta un único mundo FE coherente que sostenga a varios observadores a la vez.', 'Dos observadores, dos imágenes localmente correctas, pero sin una geometría FE común que soporte ambas a la vez.', 'Esto no es una descripción alternativa de la realidad. Es solo una transformación visual local de un cielo ya resuelto.'],
    ['El modelo usa efemérides DE405 ya preparadas', 'El modelo afirma mostrar un cielo FE funcional, pero toma posiciones precisas de tablas astronómicas ya hechas.', 'La fuente por defecto es AstroPixels/JPL DE405. La precisión del cielo viene de tablas astronómicas modernas, no de la geometría plana del modelo.', 'Flujo DE405 -> RA/Dec -> cielo local -> dibujo FE.', 'Las posiciones correctas no son prueba de un modelo FE porque fueron importadas de otra fuente.'],
    ['El cielo observado se calcula con una transformación de globo', 'El modelo dice “mundo plano”, pero para altura y dirección observadas usa un cielo local estándar desde RA/Dec.', 'Azimut y elevación son los valores observados clave. El código los obtiene desde RA/Dec, latitud, longitud y tiempo sidéreo antes del dibujo FE.', 'Observador, cielo local encima y solo después el disco.', 'La escena FE no es la fuente de la observación. Es una imagen después de un cálculo estándar del cielo.'],
    ['La red lat/long es una proyección AE fija', 'El disco FE es una proyección de mapa. Una proyección puede ser útil, pero no es automáticamente la forma física del mundo.', 'La proyección azimutal equidistante es una forma de dibujar mapas. Hacia el sur altera mucho tamaños y distancias.', 'Comparación de un paralelo en esfera y en disco FE.', 'El modelo confunde una proyección de mapa con geometría física.'],
    ['Las alturas de los cuerpos son bandas ajustadas a mano', 'La altura del Sol, la Luna y los planetas sobre la cúpula viene de una banda elegida, no de física independiente de la luz.', 'Las alturas se derivan de declinación y de las constantes manuales HEADROOM y SUN_RANGE.', 'Un control de declinación mueve el cuerpo arriba y abajo sin distancia física.', 'Esto es ajuste visual, no un mecanismo físico independiente.'],
    ['Los eclipses se reproducen desde un catálogo real', 'Los eclipses no son encontrados por un predictor FE. Se cargan desde un catálogo real y se reproducen.', 'Las demos se construyen desde el catálogo AstroPixels/JPL DE405. La rama predictiva FE es solo un marcador de posición.', 'Catálogo de eclipses frente a predictor FE vacío.', 'Reproducir eclipses conocidos no es predicción de un modelo plano.'],
    ['La sombra del eclipse usa radios FE elegidos', 'La sombra depende de radios FE elegidos para Sol y Luna y de la magnitud de catálogo.', 'Los radios son constantes de escala FE y la umbra se filtra por magnitud de catálogo.', 'Dos círculos con tamaño ajustable y efecto de sombra.', 'La sombra es una construcción visual, no verificación de la geometría FE.'],
    ['Los planetas GeoC no tienen movimiento retrógrado', 'Los planetas reales muestran movimiento retrógrado. Una pipeline del modelo admite que falta.', 'Un comentario del código admite que los planetas internos no libran alrededor del Sol y que ningún planeta tiene retrogradación.', 'Bucle real de Marte frente a trayectoria simple sin bucle.', 'El modelo no cubre una de las propiedades más conocidas del cielo planetario.'],
    ['Fuera del rango de datos devuelve una posición falsa', 'Cuando no hay datos, el modelo debería admitir el error. En vez de eso devuelve RA=0, Dec=0.', 'Los datos AstroPixels solo cubren 2019-2030. Fuera de ese rango RA=0, Dec=0 parece una posición válida.', 'Línea temporal con rango verde seguro y años rojos fuera de datos.', 'Es un fallo real de robustez que puede generar resultados engañosos.'],
    ['La primera actualización calcula con un valor no definido', 'El primer cálculo usa un valor todavía no configurado y produce NaN.', 'La altura óptica se usa para Sol y Luna antes de asignarse.', 'Orden: usar valor -> configurar valor.', 'Es un error normal de programación en el orden de cálculo.'],
    ['Las fases lunares no son iluminación FE', 'Las fases se toman de geometría angular de vectores celestes, no de un modelo de luz FE.', 'Se calculan desde vectores unitarios geocéntricos del Sol y la Luna. No se usan distancias ni caminos de luz FE.', 'Ángulo Sol-Luna en el cielo frente a geometría de luz FE ausente.', 'Las fases lunares no están explicadas por el modelo FE.'],
    ['La propia página dice que es un modelo conceptual', 'La demo usa lenguaje prudente: modelo conceptual, cúpula óptica y observador ficticio.', 'La página habla de modelo conceptual, cúpula óptica y observador ficticio.', 'Diferencia entre un modelo de dibujo y uno capaz de predecir.', 'Una visualización conceptual no es prueba de realidad física.']
  ],
  ru: [
    ['Модель работает только как картинка для одного наблюдателя', 'Код может сделать локально правильное небо для выбранного зрителя, но это еще не модель реальности, общей для нескольких наблюдателей одновременно.', 'Как только небо получено через стандартное преобразование RA/Dec в локальное небо, FE-сцена лишь перерисовывает уже вычисленный результат. Она не дает единого FE-мира, который одновременно несет нескольких наблюдателей.', 'Два наблюдателя, две локально правильные картинки, но нет общей FE-геометрии, которая держала бы их вместе.', 'Это не альтернативное описание реальности. Это лишь локальная визуализация уже решенного неба.'],
    ['Модель использует готовые эфемериды DE405', 'Модель заявляет, что показывает рабочее FE-небо, но точные положения берет из готовых астрономических таблиц.', 'Источник по умолчанию - AstroPixels/JPL DE405. Точность неба приходит из современных астрономических таблиц, а не из плоской геометрии модели.', 'Поток данных DE405 -> RA/Dec -> локальное небо -> FE-рисунок.', 'Правильные положения тел не являются доказательством FE-модели, потому что они импортированы из другого источника.'],
    ['Наблюдаемое небо считается через преобразование глобуса', 'Модель говорит “плоский мир”, но для наблюдаемой высоты и направления использует стандартное локальное небо из RA/Dec.', 'Азимут и высота - главные наблюдаемые значения. Код получает их из RA/Dec, широты, долготы и звездного времени до FE-рисования.', 'Наблюдатель, локальное небо над ним, и только потом диск.', 'FE-сцена не является источником наблюдений. Это картинка после стандартного расчета неба.'],
    ['Сетка lat/long жестко задана как AE-проекция', 'FE-диск является картографической проекцией. Проекция может быть полезной картинкой, но не является физической формой мира.', 'Азимутальная равнопромежуточная проекция - способ рисовать карту. К югу она сильно меняет размеры параллелей и расстояния.', 'Сравнение окружности параллели на сфере и на FE-диске.', 'Модель путает картографическую проекцию с физической геометрией мира.'],
    ['Высоты тел являются вручную настроенными полосами', 'Высота Солнца, Луны и планет над куполом берется из выбранной полосы, а не из независимой физики света.', 'Высоты выводятся из склонения и вручную выбранных констант HEADROOM и SUN_RANGE.', 'Ползунок склонения двигает тело вверх-вниз без физического расстояния.', 'Это настройка картинки, а не независимый физический механизм.'],
    ['Затмения воспроизводятся из реального каталога', 'Затмения не находятся FE-прогнозом. Они загружаются из реального каталога и воспроизводятся.', 'Демо затмений строятся из каталога AstroPixels/JPL DE405. FE-ветка прогнозирования - только заглушка.', 'Каталог затмений против пустого FE-прогноза.', 'Воспроизведение известных затмений не является прогнозом плоской модели.'],
    ['Тень затмения использует выбранные FE-радиусы', 'Тень зависит от выбранных FE-радиусов Солнца и Луны и от каталожной величины.', 'Радиусы Солнца и Луны являются FE-константами масштаба, а умбра фильтруется по каталожной величине.', 'Два круга с изменяемым размером и тенью.', 'Тень - визуальная конструкция, а не проверка FE-геометрии.'],
    ['У планет GeoC нет ретроградного движения', 'Настоящие планеты имеют ретроградное движение. Одна pipeline модели сама признает, что оно отсутствует.', 'Комментарий в коде признает, что внутренние планеты не либрируют вокруг Солнца и ни одна планета не имеет ретроградного движения.', 'Реальная петля Марса против простой траектории без петли.', 'Модель не покрывает одно из самых известных свойств планетного неба.'],
    ['Вне диапазона данных возвращается ложная позиция', 'Когда данных нет, модель должна признать ошибку. Вместо этого она возвращает RA=0, Dec=0.', 'Данные AstroPixels покрывают только 2019-2030. Вне диапазона RA=0, Dec=0 выглядит как допустимая позиция.', 'Временная шкала с зеленым безопасным диапазоном и красными годами вне данных.', 'Это реальная ошибка надежности, которая может создавать вводящие в заблуждение результаты.'],
    ['Первое обновление считает с незаданным значением', 'Первый расчет использует значение, которое еще не установлено, и получает NaN.', 'Оптическая высота используется для координат Солнца и Луны до того, как она задана.', 'Порядок: использовать значение -> задать значение.', 'Это обычная ошибка программирования в порядке вычислений.'],
    ['Фазы Луны не являются FE-освещением', 'Фазы берутся из угловой геометрии небесных векторов, а не из FE-модели света.', 'Фазы считаются из геоцентрических единичных векторов Солнца и Луны. FE-расстояния и пути света не используются.', 'Угол Солнце-Луна на небе против отсутствующей FE-геометрии света.', 'Фазы Луны не объясняются FE-моделью.'],
    ['Сама страница говорит, что это концептуальная модель', 'Live-демо использует осторожные слова: концептуальная модель, оптический купол и фиктивный наблюдатель.', 'Live-страница говорит о концептуальной модели, оптическом куполе и фиктивном наблюдателе.', 'Разница между рисующей моделью и моделью, которая умеет прогнозировать.', 'Концептуальная визуализация не является доказательством физической реальности.']
  ]
};

const flowTranslations = {
  cs: flowSteps,
  en: [
    ['1. Ready-made astronomical data', 'DE405, Meeus, VSOP87', 'The model takes RA/Dec values from standard astronomical sources. Accuracy therefore comes from imported ephemerides, not from a flat map.', 'If a body position is already imported from precise tables, FE geometry did not have to explain or predict it.', 'The default setting uses BodySource = astropixels. That means the Sun and Moon go through AstroPixels/JPL DE405 data.'],
    ['2. Celestial coordinates', 'RA / Dec', 'RA and Dec say where an object is in the sky. They are ready-made celestial coordinates that already contain the astronomical work and the spherical observation structure.', 'Once the model has RA/Dec, it already knows where the body is in the sky without FE geometry having to explain that part by itself.', 'The model then derives the subsolar point, ground point, altitude above the horizon and dome position from RA/Dec.'],
    ['3. Local sky', 'azimuth / elevation', 'The code converts RA/Dec into the direction seen by an observer. This is where the observed direction and height above the horizon are produced for one specific viewer.', 'This is the key point: the observed sky is computed before FE drawing is involved. That creates a locally correct picture, not one shared FE world for many simultaneous observers.', 'SunAnglesGlobe and MoonAnglesGlobe already contain azimuth/elevation matching observation.'],
    ['4. FE drawing', 'disk and dome', 'Only at the end is the result drawn on a flat disk and dome. That is visualization of an already computed answer, not the source of precise prediction.', 'The flat disk is the final drawing layer. It can look impressive, but it does not explain where the correct position came from or how one FE geometry would carry multiple observers at once.', 'Lat/long is converted into a hard-coded AE projection and body heights are set by separate rules.']
  ],
  de: [
    ['1. Fertige astronomische Daten', 'DE405, Meeus, VSOP87', 'Das Modell nimmt RA/Dec-Werte aus Standardquellen. Die Genauigkeit kommt daher aus importierten Ephemeriden, nicht aus einer flachen Karte.', 'Wenn die Position schon aus präzisen Tabellen importiert ist, musste FE-Geometrie sie nicht erklären oder vorhersagen.', 'Die Standardeinstellung nutzt BodySource = astropixels. Sonne und Mond laufen also über AstroPixels/JPL-DE405-Daten.'],
    ['2. Himmelskoordinaten', 'RA / Dec', 'RA und Dec bestimmen, wo ein Objekt am Himmel steht. Das sind fertige Himmelskoordinaten mit bereits enthaltener astronomischer Arbeit und sphärischer Beobachtungsstruktur.', 'Sobald das Modell RA/Dec hat, weiß es bereits, wo der Körper steht, ohne dass FE-Geometrie diesen Teil selbst erklären müsste.', 'Daraus leitet das Modell Subsolarpunkt, Bodenpunkt, Horizonthöhe und Domposition ab.'],
    ['3. Lokaler Himmel', 'Azimut / Elevation', 'Der Code wandelt RA/Dec in die Richtung um, die ein Beobachter sieht. Hier entstehen Richtung und Höhe über dem Horizont für einen konkreten Betrachter.', 'Das ist der Kernpunkt: Der beobachtete Himmel wird berechnet, bevor FE-Zeichnung eine Rolle spielt. Das erzeugt ein lokal richtiges Bild, aber keine gemeinsame FE-Welt für mehrere Beobachter gleichzeitig.', 'SunAnglesGlobe und MoonAnglesGlobe enthalten bereits beobachtungsnahe Azimut/Elevation.'],
    ['4. FE-Zeichnung', 'Scheibe und Dom', 'Erst am Ende wird das Ergebnis auf Scheibe und Dom gezeichnet. Das ist Visualisierung einer bereits berechneten Antwort, nicht Quelle der Vorhersage.', 'Die flache Scheibe ist die letzte Bildebene. Sie kann eindrucksvoll aussehen, erklärt aber nicht, woher die richtige Position kam oder wie eine FE-Geometrie mehrere Beobachter zugleich tragen sollte.', 'Lat/long wird in eine feste AE-Projektion umgerechnet und Körperhöhen werden separat geregelt.']
  ],
  es: [
    ['1. Datos astronómicos ya preparados', 'DE405, Meeus, VSOP87', 'El modelo toma valores RA/Dec de fuentes astronómicas estándar. La precisión viene de efemérides importadas, no de un mapa plano.', 'Si la posición ya viene de tablas precisas, la geometría FE no tuvo que explicarla ni predecirla.', 'La configuración por defecto usa BodySource = astropixels. El Sol y la Luna pasan por datos AstroPixels/JPL DE405.'],
    ['2. Coordenadas celestes', 'RA / Dec', 'RA y Dec indican dónde está un objeto en el cielo. Son coordenadas ya preparadas que contienen trabajo astronómico y la estructura esférica de observación.', 'Cuando el modelo ya tiene RA/Dec, ya sabe dónde está el cuerpo sin que la geometría FE tenga que explicar por sí sola esa parte.', 'Luego deriva punto subsolar, punto en tierra, altura sobre el horizonte y posición en la cúpula.'],
    ['3. Cielo local', 'azimut / elevación', 'El código convierte RA/Dec en la dirección que ve un observador. Aquí nacen la dirección y la altura observadas para un espectador concreto.', 'Este es el punto clave: el cielo observado se calcula antes del dibujo FE. Eso crea una imagen localmente correcta, no un mundo FE compartido por varios observadores al mismo tiempo.', 'SunAnglesGlobe y MoonAnglesGlobe ya contienen azimut/elevación compatibles con la observación.'],
    ['4. Dibujo FE', 'disco y cúpula', 'Solo al final el resultado se dibuja sobre disco y cúpula. Eso es visualización de una respuesta ya calculada, no el origen de la predicción precisa.', 'El disco plano es la capa visual final. Puede impresionar, pero no explica de dónde salió la posición correcta ni cómo una geometría FE única sostendría a varios observadores a la vez.', 'Lat/long se convierte en una proyección AE fija y las alturas se fijan con reglas separadas.']
  ],
  ru: [
    ['1. Готовые астрономические данные', 'DE405, Meeus, VSOP87', 'Модель берет RA/Dec из стандартных астрономических источников. Точность приходит из импортированных эфемерид, а не из плоской карты.', 'Если положение уже импортировано из точных таблиц, FE-геометрия не объясняла и не предсказывала его.', 'Настройка по умолчанию использует BodySource = astropixels. Солнце и Луна идут через данные AstroPixels/JPL DE405.'],
    ['2. Небесные координаты', 'RA / Dec', 'RA и Dec задают, где объект находится на небе. Это готовые небесные координаты, уже содержащие астрономическую работу и сферическую структуру наблюдения.', 'Получив RA/Dec, модель уже знает, где тело находится на небе, без того чтобы FE-геометрия сама объясняла эту часть.', 'Затем из RA/Dec выводятся субсолнечная точка, ground point, высота над горизонтом и позиция в куполе.'],
    ['3. Локальное небо', 'азимут / высота', 'Код преобразует RA/Dec в направление, которое видит наблюдатель. Здесь появляются наблюдаемое направление и высота для одного конкретного зрителя.', 'Ключевой момент: наблюдаемое небо вычисляется до FE-рисования. Это создает локально правильную картинку, а не общий FE-мир для нескольких одновременных наблюдателей.', 'SunAnglesGlobe и MoonAnglesGlobe уже содержат азимут/высоту, соответствующие наблюдению.'],
    ['4. FE-рисунок', 'диск и купол', 'Только в конце результат рисуется на плоском диске и куполе. Это визуализация уже вычисленного ответа, а не источник точного прогноза.', 'Плоский диск - последняя визуальная оболочка. Он может выглядеть эффектно, но не объясняет, откуда взялась правильная позиция и как одна FE-геометрия должна одновременно нести нескольких наблюдателей.', 'Lat/long переводится в жестко заданную AE-проекцию, а высоты тел задаются отдельными правилами.']
  ]
};

let currentLang = getInitialLang();
let currentTheme = getInitialTheme();
let currentFilter = 'all';
let activeFlowIndex = 0;
let currentEclipseMode = 'catalog';

function getInitialLang() {
  const saved = localStorage.getItem('feAuditLang');
  if (LANGS.includes(saved)) return saved;
  const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
  return LANGS.includes(browserLang) ? browserLang : 'en';
}

function getInitialTheme() {
  const saved = localStorage.getItem('feAuditTheme');
  if (THEMES.includes(saved)) return saved;
  return 'dark';
}

function applyTheme() {
  document.body.classList.remove(...THEMES.map(theme => `theme-${theme}`));
  if (currentTheme !== 'light') {
    document.body.classList.add(`theme-${currentTheme}`);
  }

  const themeButton = document.getElementById('themeCycle');
  if (themeButton) {
    const t = getUi();
    themeButton.textContent = THEME_LABELS[currentTheme];
    themeButton.setAttribute('aria-label', `${t.changeTheme}: ${THEME_LABELS[currentTheme]}`);
    themeButton.title = `${t.changeTheme}: ${THEME_LABELS[currentTheme]}`;
  }
}

function setTheme(theme) {
  currentTheme = THEMES.includes(theme) ? theme : 'light';
  localStorage.setItem('feAuditTheme', currentTheme);
  applyTheme();
}

function getUi() {
  return uiText[currentLang] || uiText.en;
}

function getProblems() {
  const translations = problemTranslations[currentLang] || problemTranslations.en;
  if (currentLang === 'cs') return problems;
  return problems.map((problem, index) => {
    const item = translations[index];
    return {
      ...problem,
      title: item[0],
      kid: item[1],
      why: item[2],
      code: getCodeForProblem(index),
      visual: item[3],
      conclusion: item[4]
    };
  });
}

const codeText = {
  en: [
    ['the transform is built in the observer-local globe frame', 'local azimuth/elevation are computed before FE drawing', 'README points to About text about a fictitious observer'],
    ['default BodySource is astropixels', 'lookup(body, date) loads tabulated RA/Dec data', 'bodyGeocentric(name, date) returns imported ephemerides'],
    ['compTransMatCelestToGlobe(...) converts a celestial direction into the local globe frame', 'localGlobeCoordToAngles(...) computes azimuth and elevation', 'SunAnglesGlobe stores the observed altitude and direction of the Sun'],
    ['comment confirms a hard-coded north-pole azimuthal-equidistant frame', 'setActiveProjection() is an empty function', 'canonicalLatLongToDisc(...) converts lat/lon into the AE disk'],
    ['HEADROOM = 0.06', 'SUN_RANGE = 0.20', 'SunVaultHeight is computed from declination and manual constants', 'MoonVaultHeight is derived from the Sun height', 'planet height is derived through eclipticBeta'],
    ['import ASTROPIXELS_ECLIPSES loads a catalogue of real eclipses', 'refineEclipseByMinSeparation(...) only refines time around a catalogue event', 'SOLAR_ECLIPSE_DEMOS are generated from the catalogue', 'FE prediction is marked as PLACEHOLDER'],
    ['r_s = 0.030 sets the FE Sun radius', 'r_m = 0.025 sets the FE Moon radius', 'catalogue EclipseMagnitude is used', 'umbra is drawn only when mag >= 0.99'],
    ['comment admits Mercury/Venus do not librate around the Sun', 'comment admits no planet has retrograde motion', 'planetEquatorial(...) uses one Earth-focus Kepler ellipse'],
    ['when the year is missing, lookup(...) returns null', 'planetEquatorial(...) converts null into { ra: 0, dec: 0 }', 'sunEquatorial(...) converts null into { ra: 0, dec: 0 }', 'bodyGeocentric(...) also falls back to { ra: 0, dec: 0 }'],
    ['SunOpticalVaultCoord uses c.OpticalVaultHeightEffective', 'MoonOpticalVaultCoord uses c.OpticalVaultHeightEffective', 'OpticalVaultHeightEffective is assigned only later'],
    ['Moon phase section starts here', 'moonToGlobe is derived from MoonCelestCoord', 'moonToSun is derived from SunCelestCoord and MoonCelestCoord', 'MoonPhase is computed from the angle between vectors'],
    ['original model live demo', 'project is named Conceptual Flat Earth Model', 'README describes it as an interactive conceptual model', 'README points to About text about a fictitious observer']
  ]
};

codeText.de = [
  ['die Transformation wird im beobachterlokalen Kugelrahmen aufgebaut', 'lokaler Azimut und Elevation werden vor der FE-Zeichnung berechnet', 'README verweist auf About-Text zum fiktiven Beobachter'],
  ['Standardwert für BodySource ist astropixels', 'lookup(body, date) lädt tabellierte RA/Dec-Daten', 'bodyGeocentric(name, date) gibt importierte Ephemeriden zurück'],
  ['compTransMatCelestToGlobe(...) wandelt eine Himmelsrichtung in den lokalen Kugelrahmen um', 'localGlobeCoordToAngles(...) berechnet Azimut und Elevation', 'SunAnglesGlobe speichert beobachtete Höhe und Richtung der Sonne'],
  ['Kommentar bestätigt einen fest codierten nordpolaren azimutal-äquidistanten Rahmen', 'setActiveProjection() ist eine leere Funktion', 'canonicalLatLongToDisc(...) wandelt lat/lon in die AE-Scheibe um'],
  ['HEADROOM = 0.06', 'SUN_RANGE = 0.20', 'SunVaultHeight wird aus Deklination und manuellen Konstanten berechnet', 'MoonVaultHeight wird aus der Sonnenhöhe abgeleitet', 'Planetenhöhe wird über eclipticBeta abgeleitet'],
  ['import ASTROPIXELS_ECLIPSES lädt einen Katalog realer Finsternisse', 'refineEclipseByMinSeparation(...) verfeinert nur die Zeit um ein Katalogereignis', 'SOLAR_ECLIPSE_DEMOS werden aus dem Katalog erzeugt', 'FE-Vorhersage ist als PLACEHOLDER markiert'],
  ['r_s = 0.030 setzt den FE-Sonnenradius', 'r_m = 0.025 setzt den FE-Mondradius', 'Katalogwert EclipseMagnitude wird benutzt', 'Umbra wird nur bei mag >= 0.99 gezeichnet'],
  ['Kommentar gibt zu, dass Mercury/Venus nicht um die Sonne libriren', 'Kommentar gibt zu, dass kein Planet retrograde Bewegung hat', 'planetEquatorial(...) nutzt eine einzelne Keplerellipse mit Erdfokus'],
  ['bei fehlendem Jahr gibt lookup(...) null zurück', 'planetEquatorial(...) wandelt null in { ra: 0, dec: 0 } um', 'sunEquatorial(...) wandelt null in { ra: 0, dec: 0 } um', 'bodyGeocentric(...) fällt ebenfalls auf { ra: 0, dec: 0 } zurück'],
  ['SunOpticalVaultCoord nutzt c.OpticalVaultHeightEffective', 'MoonOpticalVaultCoord nutzt c.OpticalVaultHeightEffective', 'OpticalVaultHeightEffective wird erst später gesetzt'],
  ['Moon-phase-Abschnitt beginnt hier', 'moonToGlobe wird aus MoonCelestCoord abgeleitet', 'moonToSun wird aus SunCelestCoord und MoonCelestCoord abgeleitet', 'MoonPhase wird aus dem Winkel zwischen Vektoren berechnet'],
  ['Live-Demo des Originalmodells', 'Projekt heißt Conceptual Flat Earth Model', 'README beschreibt es als interaktives konzeptuelles Modell', 'README verweist auf About-Text zum fiktiven Beobachter']
];

codeText.es = [
  ['la transformación se construye en el marco de globo local del observador', 'el azimut y la elevación locales se calculan antes del dibujo FE', 'README apunta a texto About sobre un observador ficticio'],
  ['BodySource por defecto es astropixels', 'lookup(body, date) carga datos RA/Dec tabulados', 'bodyGeocentric(name, date) devuelve efemérides importadas'],
  ['compTransMatCelestToGlobe(...) convierte una dirección celeste al marco local de globo', 'localGlobeCoordToAngles(...) calcula azimut y elevación', 'SunAnglesGlobe guarda la altura y dirección observadas del Sol'],
  ['el comentario confirma un marco azimutal equidistante de polo norte fijado en el código', 'setActiveProjection() es una función vacía', 'canonicalLatLongToDisc(...) convierte lat/lon al disco AE'],
  ['HEADROOM = 0.06', 'SUN_RANGE = 0.20', 'SunVaultHeight se calcula desde declinación y constantes manuales', 'MoonVaultHeight se deriva de la altura del Sol', 'la altura de planetas se deriva mediante eclipticBeta'],
  ['import ASTROPIXELS_ECLIPSES carga un catálogo de eclipses reales', 'refineEclipseByMinSeparation(...) solo ajusta la hora alrededor de un evento de catálogo', 'SOLAR_ECLIPSE_DEMOS se generan desde el catálogo', 'la predicción FE está marcada como PLACEHOLDER'],
  ['r_s = 0.030 fija el radio FE del Sol', 'r_m = 0.025 fija el radio FE de la Luna', 'se usa EclipseMagnitude del catálogo', 'la umbra se dibuja solo con mag >= 0.99'],
  ['el comentario admite que Mercury/Venus no libran alrededor del Sol', 'el comentario admite que ningún planeta tiene movimiento retrógrado', 'planetEquatorial(...) usa una sola elipse de Kepler enfocada en la Tierra'],
  ['cuando falta el año, lookup(...) devuelve null', 'planetEquatorial(...) convierte null en { ra: 0, dec: 0 }', 'sunEquatorial(...) convierte null en { ra: 0, dec: 0 }', 'bodyGeocentric(...) también cae a { ra: 0, dec: 0 }'],
  ['SunOpticalVaultCoord usa c.OpticalVaultHeightEffective', 'MoonOpticalVaultCoord usa c.OpticalVaultHeightEffective', 'OpticalVaultHeightEffective se asigna solo más tarde'],
  ['aquí empieza la sección Moon phase', 'moonToGlobe se deriva de MoonCelestCoord', 'moonToSun se deriva de SunCelestCoord y MoonCelestCoord', 'MoonPhase se calcula por el ángulo entre vectores'],
  ['demo original en vivo', 'el proyecto se llama Conceptual Flat Earth Model', 'README lo describe como modelo conceptual interactivo', 'README apunta a texto About sobre un observador ficticio']
];

codeText.ru = [
  ['преобразование строится в локальной глобусной рамке наблюдателя', 'локальные азимут и высота считаются до FE-рисования', 'README ссылается на About-текст о фиктивном наблюдателе'],
  ['BodySource по умолчанию равен astropixels', 'lookup(body, date) загружает табличные данные RA/Dec', 'bodyGeocentric(name, date) возвращает импортированные эфемериды'],
  ['compTransMatCelestToGlobe(...) переводит небесное направление в локальную рамку глобуса', 'localGlobeCoordToAngles(...) вычисляет азимут и высоту', 'SunAnglesGlobe сохраняет наблюдаемую высоту и направление Солнца'],
  ['комментарий подтверждает жестко заданную азимутальную равнопромежуточную рамку северного полюса', 'setActiveProjection() является пустой функцией', 'canonicalLatLongToDisc(...) переводит lat/lon в AE-диск'],
  ['HEADROOM = 0.06', 'SUN_RANGE = 0.20', 'SunVaultHeight считается из склонения и ручных констант', 'MoonVaultHeight выводится из высоты Солнца', 'высота планет выводится через eclipticBeta'],
  ['import ASTROPIXELS_ECLIPSES загружает каталог реальных затмений', 'refineEclipseByMinSeparation(...) только уточняет время вокруг события из каталога', 'SOLAR_ECLIPSE_DEMOS создаются из каталога', 'FE-прогноз помечен как PLACEHOLDER'],
  ['r_s = 0.030 задает FE-радиус Солнца', 'r_m = 0.025 задает FE-радиус Луны', 'используется каталожное EclipseMagnitude', 'умбра рисуется только при mag >= 0.99'],
  ['комментарий признает, что Mercury/Venus не либрируют вокруг Солнца', 'комментарий признает, что ни у одной планеты нет ретроградного движения', 'planetEquatorial(...) использует одну кеплерову эллипсу с фокусом на Земле'],
  ['если год отсутствует, lookup(...) возвращает null', 'planetEquatorial(...) превращает null в { ra: 0, dec: 0 }', 'sunEquatorial(...) превращает null в { ra: 0, dec: 0 }', 'bodyGeocentric(...) тоже откатывается к { ra: 0, dec: 0 }'],
  ['SunOpticalVaultCoord использует c.OpticalVaultHeightEffective', 'MoonOpticalVaultCoord использует c.OpticalVaultHeightEffective', 'OpticalVaultHeightEffective задается только позже'],
  ['здесь начинается раздел Moon phase', 'moonToGlobe выводится из MoonCelestCoord', 'moonToSun выводится из SunCelestCoord и MoonCelestCoord', 'MoonPhase считается по углу между векторами'],
  ['оригинальная live-демонстрация', 'проект называется Conceptual Flat Earth Model', 'README описывает его как интерактивную концептуальную модель', 'README ссылается на About-текст о фиктивном наблюдателе']
];

function getCodeForProblem(index) {
  const descriptions = codeText[currentLang]?.[index];
  if (!descriptions) return problems[index].code;
  return problems[index].code.map((entry, entryIndex) => {
    const [location] = entry.split(' - ');
    return `${location} - ${descriptions[entryIndex]}`;
  });
}

function getFlowSteps() {
  const translations = flowTranslations[currentLang] || flowTranslations.en;
  if (currentLang === 'cs') return flowSteps;
  return flowSteps.map((step, index) => {
    const item = translations[index];
    return {
      ...step,
      title: item[0],
      label: item[1],
      detail: item[2],
      why: item[3],
      example: item[4]
    };
  });
}

function setText(selector, value, html = false) {
  const node = document.querySelector(selector);
  if (!node) return;
  if (html) {
    node.innerHTML = value;
  } else {
    node.textContent = value;
  }
}

function applyStaticText() {
  const t = getUi();
  const translatedProblems = getProblems();
  const criticalCount = translatedProblems.filter(problem => problem.severity === 'Kritická').length;
  document.documentElement.lang = currentLang;
  document.title = t.pageTitle;
  setText('.brand-block h1', t.pageTitle);
  setText('.brand-block p', t.brandSubtitle);
  setText('.side-note strong', t.sideTitle);
  setText('.side-note span', t.sideBody);

  document.querySelectorAll('.nav-list a').forEach((link, index) => {
    link.textContent = t.nav[index];
  });

  setText('.intro-copy .eyebrow', t.introEyebrow);
  setText('.intro-copy h2', t.heroTitle);
  setText('.intro-copy > p:not(.eyebrow)', t.heroBody, true);
  setText('.home-corner', t.homeLink);
  setText('.source-links a:nth-child(1)', t.liveDemo);
  setText('.source-links a:nth-child(2)', t.sourceCode);
  setText('.intro-actions .primary-action', t.openProblems);
  setText('.intro-actions .secondary-action', t.showFlow);
  document.querySelectorAll('.summary-row').forEach((row, index) => {
    const title = row.querySelector('.summary-copy strong');
    const detail = row.querySelector('.summary-copy small');
    const number = row.querySelector('.summary-number');
    if (number) {
      if (index === 0) number.textContent = String(translatedProblems.length);
      if (index === 1) number.textContent = String(criticalCount);
      if (index === 2) number.textContent = '0';
    }
    if (title) title.textContent = t.summary[index];
    if (detail) detail.textContent = t.summaryDetails[index];
  });

  setText('.explain-strip h2', t.explainTitle);
  setText('.explain-strip p', t.explainBody, true);

  setText('#tok-dat .eyebrow', t.flowEyebrow);
  setText('#tok-dat h2', t.flowTitle);
  setText('#tok-dat .section-heading > p:not(.eyebrow)', t.flowBody);

  setText('#problemy .eyebrow', t.problemsEyebrow);
  setText('#problemy h2', t.problemsTitle);
  setText('#problemy .section-heading > p:not(.eyebrow)', t.problemsBody);
  document.querySelectorAll('.filter-btn').forEach((button, index) => {
    button.textContent = t.filters[index];
  });
  document.querySelectorAll('.severity-legend span').forEach((item, index) => {
    const dot = item.querySelector('.dot');
    item.textContent = t.legend[index];
    if (dot) item.prepend(dot);
  });

  setText('#mapa .eyebrow', t.mapEyebrow);
  setText('#mapa h2', t.mapTitle);
  setText('#mapa p:not(.eyebrow)', t.mapBody);
  setText('label[for="latRange"]', t.latLabel);

  setText('#zatmeni .eyebrow', t.eclipseEyebrow);
  setText('#zatmeni h2', t.eclipseTitle);
  setText('#zatmeni p:not(.eyebrow)', t.eclipseBody);
  document.querySelectorAll('.mode-btn').forEach((button, index) => {
    button.textContent = t.modes[index];
  });

  setText('#slovnik .eyebrow', t.glossaryEyebrow);
  setText('#slovnik h2', t.glossaryTitle);
  document.querySelectorAll('.glossary-grid article').forEach((article, index) => {
    const entry = t.glossary[index];
    article.querySelector('h3').textContent = entry[0];
    article.querySelector('p').textContent = entry[1];
  });

  const langButton = document.getElementById('langCycle');
  if (langButton) {
    langButton.textContent = LANG_FLAGS[currentLang];
    langButton.setAttribute('aria-label', t.changeLanguage);
    langButton.title = t.changeLanguage;
  }

  applyTheme();
}

function setLanguage(lang) {
  currentLang = LANGS.includes(lang) ? lang : 'en';
  localStorage.setItem('feAuditLang', currentLang);
  applyStaticText();
  renderFlow(activeFlowIndex);
  renderProblems(currentFilter);
  updateProjection();
  renderEclipse(currentEclipseMode);
}

function svgIcon(type) {
  const common = 'viewBox="0 0 120 78" role="img" aria-hidden="true"';
  if (type === 'table') {
    return `<svg ${common}><rect x="14" y="10" width="92" height="58" rx="6" fill="#eef7ff" stroke="#2667ff" stroke-width="3"/><path d="M14 28h92M14 46h92M44 10v58M76 10v58" stroke="#2667ff" stroke-width="2"/><circle cx="94" cy="20" r="5" fill="#c93636"/></svg>`;
  }
  if (type === 'sky') {
    return `<svg ${common}><path d="M18 62a42 42 0 0 1 84 0" fill="#eef7ff" stroke="#2667ff" stroke-width="3"/><circle cx="61" cy="28" r="9" fill="#f4c542"/><path d="M36 49l50-24" stroke="#c93636" stroke-width="3"/><text x="22" y="22" fill="#18212f" font-size="13" font-weight="800">RA/Dec</text></svg>`;
  }
  if (type === 'observer') {
    return `<svg ${common}><path d="M17 65h86" stroke="#18212f" stroke-width="3"/><circle cx="60" cy="43" r="8" fill="#2667ff"/><path d="M60 51v15M44 66c8-10 24-10 32 0" stroke="#2667ff" stroke-width="4" fill="none"/><path d="M60 43l30-25" stroke="#c93636" stroke-width="3"/><path d="M27 65a33 33 0 0 1 66 0" stroke="#008f8c" stroke-width="3" fill="none"/></svg>`;
  }
  return `<svg ${common}><circle cx="60" cy="39" r="32" fill="#fff8df" stroke="#c57a00" stroke-width="3"/><path d="M60 7v64M28 39h64" stroke="#c57a00" stroke-width="2"/><circle cx="60" cy="39" r="4" fill="#c93636"/><path d="M28 39c10-18 54-18 64 0" fill="none" stroke="#2667ff" stroke-width="3"/></svg>`;
}

function renderFlow(activeIndex = activeFlowIndex) {
  activeFlowIndex = activeIndex;
  const steps = getFlowSteps();
  const labels = getUi().flowCards;
  const diagram = document.getElementById('flowDiagram');
  const detail = document.getElementById('flowDetail');
  diagram.innerHTML = steps.map((step, index) => `
    <button class="flow-step ${index === activeIndex ? 'active' : ''}" type="button" data-flow="${index}">
      <div class="flow-icon">${svgIcon(step.icon)}</div>
      <div class="flow-copy">
        <strong>${step.title}</strong>
        <span>${step.label}</span>
      </div>
    </button>
  `).join('');

  const active = steps[activeIndex];
  detail.innerHTML = `
    <h3>${active.title}</h3>
    <div class="flow-detail-grid">
      <div class="flow-detail-card">
        <strong>${labels[0]}</strong>
        <p>${active.detail}</p>
      </div>
      <div class="flow-detail-card">
        <strong>${labels[1]}</strong>
        <p>${active.why}</p>
      </div>
      <div class="flow-detail-card">
        <strong>${labels[2]}</strong>
        <p>${active.example}</p>
      </div>
      <div class="flow-detail-card">
        <strong>${labels[3]}</strong>
        <p><code>${active.code}</code></p>
        <div class="related-list">${active.related.map(id => `<span>${id}</span>`).join('')}</div>
      </div>
    </div>
  `;

  diagram.querySelectorAll('.flow-step').forEach(button => {
    button.addEventListener('click', () => renderFlow(Number(button.dataset.flow)));
  });
}

function renderProblems(filter = currentFilter) {
  currentFilter = filter;
  const labels = getUi().problemCards;
  const severityLabels = severityText[currentLang] || severityText.en;
  const translatedProblems = getProblems();
  const grid = document.getElementById('problemGrid');
  const visible = filter === 'all' ? translatedProblems : translatedProblems.filter(problem => problem.severity === filter);
  grid.innerHTML = visible.map(problem => `
    <article class="problem-card" data-severity="${problem.severity}">
      <button class="problem-head" type="button" aria-expanded="false">
        <span class="problem-id">${problem.id}</span>
        <span>
          <strong>${problem.title}</strong>
          <small style="display:block;color:var(--muted);margin-top:3px">${problem.kid}</small>
        </span>
        <span class="severity ${problem.severity}">${severityLabels[problem.severity]}</span>
      </button>
      <div class="problem-body">
        <div class="body-stack">
          <div class="plain-box">
            <h3>${labels[0]}</h3>
            <p>${problem.kid}</p>
          </div>
          <div class="meaning-box">
            <h3>${labels[1]}</h3>
            <p>${problem.why}</p>
          </div>
          <div class="meaning-box">
            <h3>${labels[2]}</h3>
            <p>${problem.conclusion}</p>
          </div>
        </div>
        <div class="body-stack">
          <div class="code-box">
            <h3>${labels[3]}</h3>
            <ul>${problem.code.map(item => `<li><code>${item}</code></li>`).join('')}</ul>
          </div>
          <div class="visual-box">
            <h3>${labels[4]}</h3>
            <p>${problem.visual}</p>
            ${smallVisual(problem.id)}
          </div>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.problem-head').forEach(head => {
    head.addEventListener('click', () => {
      const card = head.closest('.problem-card');
      const isOpen = card.classList.toggle('open');
      head.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

const visualText = {
  cs: {
    readyData: 'hotová data',
    coords: 'souřadnice',
    drawing: 'kresba',
    accuracyLeft: 'Přesnost vzniká vlevo, ne vpravo.',
    localSky: 'lokální obloha',
    azEl: 'azimut/elevace',
    alreadyComputed: 'už vypočtené',
    beforeFe: 'před FE scénou',
    globeSouth: 'koule: jih malý',
    diskSouth: 'AE disk: jih obrovský',
    tunedBand: 'výška je naladěný pás',
    catalog: 'Katalog',
    fePredictor: 'FE prediktor',
    missing: 'chybí',
    shadowNumbers: 'stín závisí na zvolených číslech',
    realLoop: 'realita: retrográdní smyčka',
    noLoop: 'GeoC: bez smyčky',
    fakePosition: 'mimo rozsah vrací falešnou pozici',
    useValue: 'použij hodnotu',
    setValue: 'nastav hodnotu',
    wrongOrder: 'špatné pořadí -> NaN',
    skyAngle: 'úhel na obloze',
    noLight: 'FE světelná geometrie zde není',
    liveSays: 'Live demo říká',
    twoObservers: '2 pozorovatelé',
    noSharedWorld: 'bez společného FE světa',
    notProof1: 'není to',
    notProof2: 'fyzikální',
    notProof3: 'důkaz'
  },
  en: {
    readyData: 'ready data',
    coords: 'coordinates',
    drawing: 'drawing',
    accuracyLeft: 'Accuracy is created on the left, not the right.',
    localSky: 'local sky',
    azEl: 'azimuth/elevation',
    alreadyComputed: 'already computed',
    beforeFe: 'before FE scene',
    globeSouth: 'globe: south small',
    diskSouth: 'AE disk: south huge',
    tunedBand: 'height is a tuned band',
    catalog: 'Catalogue',
    fePredictor: 'FE predictor',
    missing: 'missing',
    shadowNumbers: 'shadow depends on chosen numbers',
    realLoop: 'reality: retrograde loop',
    noLoop: 'GeoC: no loop',
    fakePosition: 'outside range returns fake position',
    useValue: 'use value',
    setValue: 'set value',
    wrongOrder: 'wrong order -> NaN',
    skyAngle: 'angle in the sky',
    noLight: 'FE light geometry is absent',
    liveSays: 'Live demo says',
    twoObservers: '2 observers',
    noSharedWorld: 'no shared FE world',
    notProof1: 'not a',
    notProof2: 'physical',
    notProof3: 'proof'
  }
};

visualText.de = {
  ...visualText.en,
  readyData: 'fertige Daten',
  coords: 'Koordinaten',
  drawing: 'Zeichnung',
  accuracyLeft: 'Genauigkeit entsteht links, nicht rechts.',
  localSky: 'lokaler Himmel',
  azEl: 'Azimut/Elevation',
  alreadyComputed: 'schon berechnet',
  beforeFe: 'vor der FE-Szene',
  globeSouth: 'Kugel: Süden klein',
  diskSouth: 'AE-Scheibe: Süden riesig',
  tunedBand: 'Höhe ist ein abgestimmtes Band',
  catalog: 'Katalog',
  fePredictor: 'FE-Prädiktor',
  missing: 'fehlt',
  shadowNumbers: 'Schatten hängt an gewählten Zahlen',
  realLoop: 'Realität: retrograde Schleife',
  noLoop: 'GeoC: keine Schleife',
  fakePosition: 'außerhalb der Daten: falsche Position',
  useValue: 'Wert nutzen',
  setValue: 'Wert setzen',
  wrongOrder: 'falsche Reihenfolge -> NaN',
  skyAngle: 'Winkel am Himmel',
  noLight: 'FE-Lichtgeometrie fehlt',
  liveSays: 'Live-Demo sagt',
  twoObservers: '2 Beobachter',
  noSharedWorld: 'keine gemeinsame FE-Welt',
  notProof1: 'kein',
  notProof2: 'physischer',
  notProof3: 'Beweis'
};

visualText.es = {
  ...visualText.en,
  readyData: 'datos hechos',
  coords: 'coordenadas',
  drawing: 'dibujo',
  accuracyLeft: 'La precisión nace a la izquierda, no a la derecha.',
  localSky: 'cielo local',
  azEl: 'azimut/elevación',
  alreadyComputed: 'ya calculado',
  beforeFe: 'antes de la escena FE',
  globeSouth: 'globo: sur pequeño',
  diskSouth: 'disco AE: sur enorme',
  tunedBand: 'la altura es una banda ajustada',
  catalog: 'Catálogo',
  fePredictor: 'Predictor FE',
  missing: 'falta',
  shadowNumbers: 'la sombra depende de números elegidos',
  realLoop: 'realidad: bucle retrógrado',
  noLoop: 'GeoC: sin bucle',
  fakePosition: 'fuera de rango devuelve posición falsa',
  useValue: 'usar valor',
  setValue: 'fijar valor',
  wrongOrder: 'orden incorrecto -> NaN',
  skyAngle: 'ángulo en el cielo',
  noLight: 'falta geometría de luz FE',
  liveSays: 'La demo dice',
  twoObservers: '2 observadores',
  noSharedWorld: 'sin mundo FE compartido',
  notProof1: 'no es',
  notProof2: 'prueba',
  notProof3: 'física'
};

visualText.ru = {
  ...visualText.en,
  readyData: 'готовые данные',
  coords: 'координаты',
  drawing: 'рисунок',
  accuracyLeft: 'Точность создается слева, не справа.',
  localSky: 'локальное небо',
  azEl: 'азимут/высота',
  alreadyComputed: 'уже посчитано',
  beforeFe: 'до FE-сцены',
  globeSouth: 'глобус: юг мал',
  diskSouth: 'AE-диск: юг огромен',
  tunedBand: 'высота - настроенная полоса',
  catalog: 'Каталог',
  fePredictor: 'FE-прогноз',
  missing: 'нет',
  shadowNumbers: 'тень зависит от выбранных чисел',
  realLoop: 'реальность: ретроградная петля',
  noLoop: 'GeoC: без петли',
  fakePosition: 'вне диапазона: ложная позиция',
  useValue: 'использовать',
  setValue: 'задать',
  wrongOrder: 'неверный порядок -> NaN',
  skyAngle: 'угол на небе',
  noLight: 'FE-геометрия света отсутствует',
  liveSays: 'Live demo говорит',
  twoObservers: '2 наблюдателя',
  noSharedWorld: 'нет общего FE-мира',
  notProof1: 'не',
  notProof2: 'физическое',
  notProof3: 'доказательство'
};

function smallVisual(id) {
  const v = visualText[currentLang] || visualText.en;
  if (id === 'FE-000') {
    return `<svg viewBox="0 0 360 140"><circle cx="88" cy="74" r="34" fill="#eef7ff" stroke="#2667ff" stroke-width="3"/><circle cx="88" cy="74" r="4" fill="#18212f"/><path d="M88 74L112 46" stroke="#c93636" stroke-width="3"/><circle cx="272" cy="74" r="34" fill="#eef7ff" stroke="#2667ff" stroke-width="3"/><circle cx="272" cy="74" r="4" fill="#18212f"/><path d="M272 74L296 46" stroke="#c93636" stroke-width="3"/><text class="panel-label" x="42" y="126" font-size="10.5" font-weight="900">${v.twoObservers}</text><path class="panel-muted-stroke" d="M134 74h92" stroke="#18212f" stroke-width="3" stroke-dasharray="7 5"/><text class="panel-label" x="142" y="48" font-size="10.5" font-weight="900">${v.noSharedWorld}</text></svg>`;
  }
  if (id === 'FE-001') {
    return `<svg viewBox="0 0 360 130"><rect x="10" y="18" width="86" height="64" rx="6" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><text x="25" y="45" font-size="13" font-weight="900">DE405</text><text x="21" y="65" font-size="10">${v.readyData}</text><path class="panel-muted-stroke" d="M103 50h44" stroke="#18212f" stroke-width="3"/><path class="panel-muted-stroke" d="M139 42l12 8-12 8" fill="none" stroke="#18212f" stroke-width="3"/><rect x="154" y="18" width="86" height="64" rx="6" fill="#fff8df" stroke="#c57a00" stroke-width="2"/><text x="176" y="45" font-size="13" font-weight="900">RA/Dec</text><text x="166" y="65" font-size="10">${v.coords}</text><path class="panel-muted-stroke" d="M247 50h44" stroke="#18212f" stroke-width="3"/><path class="panel-muted-stroke" d="M283 42l12 8-12 8" fill="none" stroke="#18212f" stroke-width="3"/><circle cx="321" cy="50" r="30" fill="#f8fbfa" stroke="#008f8c" stroke-width="2"/><text x="310" y="47" font-size="13" font-weight="900">FE</text><text x="302" y="63" font-size="10">${v.drawing}</text><text x="17" y="113" font-size="10.5" fill="#c93636" font-weight="900">${v.accuracyLeft}</text></svg>`;
  }
  if (id === 'FE-002') {
    return `<svg viewBox="0 0 360 135"><circle cx="86" cy="74" r="48" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><path d="M38 74a48 48 0 0 0 96 0" fill="none" stroke="#2667ff" stroke-width="2"/><circle cx="86" cy="74" r="5" fill="#18212f"/><path d="M86 74L128 34" stroke="#c93636" stroke-width="4"/><text class="panel-label" x="42" y="126" font-size="11" font-weight="900">${v.localSky}</text><path class="panel-muted-stroke" d="M150 74h54" stroke="#18212f" stroke-width="3"/><path class="panel-muted-stroke" d="M196 66l12 8-12 8" fill="none" stroke="#18212f" stroke-width="3"/><rect x="221" y="25" width="112" height="82" rx="8" fill="#fff8df" stroke="#c57a00" stroke-width="2"/><text x="230" y="55" font-size="11" font-weight="900">${v.azEl}</text><text x="238" y="77" font-size="10">${v.alreadyComputed}</text><text x="231" y="96" font-size="10">${v.beforeFe}</text></svg>`;
  }
  if (id === 'FE-003') {
    return `<svg viewBox="0 0 360 135"><circle cx="82" cy="62" r="46" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><ellipse cx="82" cy="62" rx="23" ry="8" fill="none" stroke="#c93636" stroke-width="4"/><text class="panel-label" x="36" y="123" font-size="10.5" font-weight="900">${v.globeSouth}</text><path class="panel-muted-stroke" d="M145 62h50" stroke="#18212f" stroke-width="3"/><path class="panel-muted-stroke" d="M187 54l12 8-12 8" fill="none" stroke="#18212f" stroke-width="3"/><circle cx="278" cy="62" r="46" fill="#fff8df" stroke="#c57a00" stroke-width="2"/><circle cx="278" cy="62" r="41" fill="none" stroke="#c93636" stroke-width="4"/><text class="panel-label" x="220" y="123" font-size="10.5" font-weight="900">${v.diskSouth}</text></svg>`;
  }
  if (id === 'FE-004') {
    return `<svg viewBox="0 0 360 140"><path d="M45 110a135 80 0 0 1 270 0" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><line class="panel-muted-stroke" x1="45" y1="110" x2="315" y2="110" stroke="#18212f" stroke-width="3"/><path d="M80 95C135 52 226 52 280 95" fill="none" stroke="#c57a00" stroke-width="5"/><circle cx="180" cy="55" r="12" fill="#f4c542" stroke="#c57a00" stroke-width="2"/><text class="panel-label" x="82" y="28" font-size="12" font-weight="900">HEADROOM + SUN_RANGE</text><path d="M180 67v32" stroke="#c93636" stroke-width="3" stroke-dasharray="5 4"/><text class="panel-label" x="96" y="128" font-size="10.5">${v.tunedBand}</text></svg>`;
  }
  if (id === 'FE-005') {
    return `<svg viewBox="0 0 360 135"><rect x="15" y="16" width="118" height="86" rx="6" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><text x="30" y="40" font-size="12" font-weight="900">${v.catalog}</text><path d="M35 58h76M35 75h76M35 92h50" stroke="#2667ff" stroke-width="3"/><path class="panel-muted-stroke" d="M146 60h54" stroke="#18212f" stroke-width="3"/><path class="panel-muted-stroke" d="M192 52l12 8-12 8" fill="none" stroke="#18212f" stroke-width="3"/><rect x="218" y="16" width="118" height="86" rx="6" fill="#ffe7e7" stroke="#c93636" stroke-width="2"/><text x="232" y="42" font-size="11" font-weight="900">${v.fePredictor}</text><text x="250" y="77" font-size="24" font-weight="900" fill="#c93636">${v.missing}</text></svg>`;
  }
  if (id === 'FE-006') {
    return `<svg viewBox="0 0 360 135"><circle cx="70" cy="45" r="28" fill="#f4c542" stroke="#c57a00" stroke-width="3"/><circle cx="155" cy="57" r="20" fill="#d6dbe5" stroke="#5e6b7e" stroke-width="3"/><path d="M88 55L292 120M88 35L292 120" fill="none" stroke="#c93636" stroke-width="2"/><line class="panel-muted-stroke" x1="40" y1="120" x2="320" y2="120" stroke="#18212f" stroke-width="3"/><text class="panel-label" x="28" y="17" font-size="12" font-weight="900">r_s=0.030</text><text class="panel-label" x="132" y="28" font-size="12" font-weight="900">r_m=0.025</text><text class="panel-label" x="154" y="103" font-size="9.5" font-weight="900">${v.shadowNumbers}</text></svg>`;
  }
  if (id === 'FE-007') {
    return `<svg viewBox="0 0 360 135"><path d="M30 88C70 35 112 110 150 62C184 20 222 42 201 72C184 98 148 90 166 56" fill="none" stroke="#2667ff" stroke-width="4"/><text class="panel-label" x="28" y="118" font-size="10.5" font-weight="900">${v.realLoop}</text><path d="M220 88C252 60 284 46 330 38" fill="none" stroke="#c93636" stroke-width="4"/><text class="panel-label" x="220" y="118" font-size="10.5" font-weight="900">${v.noLoop}</text><circle cx="166" cy="56" r="6" fill="#f4c542"/><circle cx="292" cy="47" r="6" fill="#f4c542"/></svg>`;
  }
  if (id === 'FE-008') {
    return `<svg viewBox="0 0 360 130"><line class="panel-muted-stroke" x1="24" y1="68" x2="330" y2="68" stroke="#18212f" stroke-width="4"/><rect x="112" y="48" width="138" height="40" fill="#dff4e7" stroke="#2f8d58" stroke-width="2"/><text x="126" y="73" font-size="13" font-weight="900">2019-2030 data</text><circle cx="72" cy="68" r="20" fill="#ffe7e7" stroke="#c93636" stroke-width="3"/><text x="61" y="73" font-size="12" font-weight="900">0,0</text><circle cx="292" cy="68" r="20" fill="#ffe7e7" stroke="#c93636" stroke-width="3"/><text x="281" y="73" font-size="12" font-weight="900">0,0</text><text class="panel-label" x="30" y="112" font-size="10.5" font-weight="900">${v.fakePosition}</text></svg>`;
  }
  if (id === 'FE-009') {
    return `<svg viewBox="0 0 360 130"><rect x="18" y="25" width="118" height="50" rx="6" fill="#ffe7e7" stroke="#c93636" stroke-width="2"/><text x="38" y="55" font-size="11.5" font-weight="900">${v.useValue}</text><path class="panel-muted-stroke" d="M146 50h42" stroke="#18212f" stroke-width="3"/><path class="panel-muted-stroke" d="M180 42l12 8-12 8" fill="none" stroke="#18212f" stroke-width="3"/><rect x="204" y="25" width="138" height="50" rx="6" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><text x="224" y="55" font-size="11.5" font-weight="900">${v.setValue}</text><text x="84" y="105" font-size="15" font-weight="900" fill="#c93636">${v.wrongOrder}</text></svg>`;
  }
  if (id === 'FE-010') {
    return `<svg viewBox="0 0 360 135"><circle cx="70" cy="68" r="26" fill="#f4c542" stroke="#c57a00" stroke-width="3"/><circle cx="242" cy="68" r="22" fill="#d6dbe5" stroke="#5e6b7e" stroke-width="3"/><path d="M70 68L160 42L242 68" fill="none" stroke="#2667ff" stroke-width="4"/><text class="panel-label" x="126" y="35" font-size="11" font-weight="900">${v.skyAngle}</text><path d="M58 112h230" stroke="#c93636" stroke-width="3" stroke-dasharray="6 5"/><text class="panel-label" x="65" y="128" font-size="10.5" font-weight="900">${v.noLight}</text></svg>`;
  }
  if (id === 'FE-011') {
    return `<svg viewBox="0 0 360 135"><rect x="18" y="18" width="150" height="90" rx="8" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><text x="34" y="45" font-size="12" font-weight="900">${v.liveSays}</text><text x="38" y="66" font-size="12">conceptual model</text><text x="38" y="84" font-size="12">fictitious observer</text><path class="panel-muted-stroke" d="M182 62h45" stroke="#18212f" stroke-width="3"/><path class="panel-muted-stroke" d="M219 54l12 8-12 8" fill="none" stroke="#18212f" stroke-width="3"/><rect x="246" y="18" width="96" height="90" rx="8" fill="#fff8df" stroke="#c57a00" stroke-width="2"/><text x="260" y="51" font-size="12" font-weight="900">${v.notProof1}</text><text x="256" y="72" font-size="12" font-weight="900">${v.notProof2}</text><text x="257" y="93" font-size="12" font-weight="900">${v.notProof3}</text></svg>`;
  }
  return `<svg viewBox="0 0 360 120"><rect x="20" y="25" width="320" height="70" rx="8" fill="#eef7ff" stroke="#2667ff" stroke-width="2"/><text x="42" y="65" font-size="14" font-weight="900">Schéma bude doplněno</text></svg>`;
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderProblems(filter);
}

function updateProjection() {
  const t = getUi().projection;
  const input = document.getElementById('latRange');
  const lat = Number(input.value);
  const absLat = Math.abs(lat);
  const globeRatio = Math.max(0, Math.cos(absLat * Math.PI / 180));
  const aeRatio = (90 - lat) / 90;
  const error = globeRatio > 0.0001 ? aeRatio / globeRatio : Infinity;
  const label = lat > 0 ? `${lat}° ${t.north}` : `${Math.abs(lat)}° ${t.south}`;

  document.getElementById('latReadout').textContent = `${t.selected}: ${label}`;
  document.getElementById('projectionVisual').innerHTML = `
    <svg viewBox="0 0 500 230" aria-hidden="true">
      <text x="70" y="25" font-size="15" font-weight="900" fill="#18212f">${t.globe}</text>
      <circle cx="115" cy="118" r="78" fill="#eef7ff" stroke="#2667ff" stroke-width="3"/>
      <ellipse cx="115" cy="118" rx="${Math.max(5, 78 * globeRatio)}" ry="${Math.max(2, 18 * globeRatio)}" fill="none" stroke="#c93636" stroke-width="5"/>
      <line x1="37" y1="118" x2="193" y2="118" stroke="#2667ff" stroke-width="2" opacity=".45"/>
      <text x="318" y="25" font-size="15" font-weight="900" fill="#18212f">${t.disk}</text>
      <circle cx="365" cy="118" r="78" fill="#fff8df" stroke="#c57a00" stroke-width="3"/>
      <circle cx="365" cy="118" r="${Math.max(5, Math.min(78, 39 * aeRatio))}" fill="none" stroke="#c93636" stroke-width="5"/>
      <circle cx="365" cy="118" r="39" fill="none" stroke="#18212f" stroke-width="2" opacity=".25"/>
    </svg>
  `;
  const errorText = Number.isFinite(error) ? `${error.toFixed(1)}x` : t.infinite;
  document.getElementById('projectionStats').innerHTML = `
    <div class="stat-pill"><span>${t.globe}</span><strong>${globeRatio.toFixed(2)}x</strong><small>${t.circumference}</small></div>
    <div class="stat-pill"><span>${t.disk}</span><strong>${aeRatio.toFixed(2)}x</strong><small>${t.circumference}</small></div>
    <div class="stat-pill"><span>${t.difference}</span><strong>${errorText}</strong><small>${t.compared}</small></div>
  `;
}

function renderEclipse(mode = 'catalog') {
  currentEclipseMode = mode;
  const rows = mode === 'catalog' ? getUi().eclipseCatalog : getUi().eclipseFe;
  document.querySelectorAll('.mode-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
  const demo = document.getElementById('eclipseDemo');
  demo.innerHTML = `
    <div class="eclipse-stage">
      ${rows.map((row, index) => `
        <div class="eclipse-row">
          <span class="status-tag ${mode === 'catalog' && index < 2 ? 'status-ok' : 'status-bad'}">${row[0]}</span>
          <div><strong>${row[1]}</strong><p>${row[2]}</p></div>
        </div>
      `).join('')}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  setTheme(currentTheme);

  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });

  document.getElementById('latRange').addEventListener('input', updateProjection);

  document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => renderEclipse(button.dataset.mode));
  });

  document.getElementById('langCycle').addEventListener('click', () => {
    const nextIndex = (LANGS.indexOf(currentLang) + 1) % LANGS.length;
    setLanguage(LANGS[nextIndex]);
  });

  document.getElementById('themeCycle').addEventListener('click', () => {
    const nextIndex = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  });
});
