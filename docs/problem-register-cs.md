# Registr problemu: Conceptual Flat Earth Model

Tento dokument je pracovni podklad pro ceskou informacni webovou stranku, ktera bude vysvetlovat, proc zkoumany FE model neni funkcni nezavisly model sveta. Cilem webu je vysvetlit problemy srozumitelne i diteti okolo 9 let, ale zaroven zachovat technickou presnost a odkazy na konkretni kod.

## Cil budouciho webu

Ukazat, ze model nevypocitava oblohu z ploche Zeme. Ve skutecnosti bere hotove astronomicke hodnoty ze standardnich geocentrickych/sferickych zdroju, prepocita je pres beznou lokalni oblohu pozorovatele a potom je nakresli na plochy disk s rucne nastavenymi vyskovymi pravidly.

Web ma byt:

- cesky,
- velmi informativni,
- interaktivni,
- rozdeleny na rozklikavaci problemy,
- doplneny obrazky, animacemi a jednoduse vysvetlenymi priklady,
- dostatecne presny, aby obstal i pri technicke kontrole kodu.

## Struktura kazdeho problemu na webu

Kazdy problem bude mit stejnou kartu/podstranku:

- Nazev problemu.
- Strucna veta pro dite: "Co se tu deje?"
- Proc je to spatne.
- Co to znamena pro tvrzeni modelu.
- Dulezity dukaz v kodu.
- Jednoduchy priklad.
- Interaktivni vizualizace.
- Technicka poznamka pro dospele.
- Zaver: "Proc to nepodporuje plochou Zemi."

## Problem FE-001: Model pouziva realne DE405 efemeridy jako vychozi zdroj

Severity: Kriticka

Jednoduse pro dite:
Model se tvari, ze sam vi, kde je Slunce a Mesic. Ve skutecnosti se podiva do uz hotove tabulky, kterou spocitali astronomove pro skutecnou oblohu.

Proc je to spatne:
Pokud model pouziva hotove presne polohy Slunce, Mesice a planet z JPL/DE405, pak jejich spravne zobrazeni neni uspech ploche Zeme. Je to jen prekresleni mainstream astronomickych dat do jineho obrazku.

Dukaz v kodu:

- `source/js/core/app.js`: vychozi `BodySource` je `astropixels`.
- `source/js/core/ephemerisAstropixels.js`: nacita AstroPixels/JPL DE405 RA/Dec tabulky.
- `source/js/data/astropixels.js`: obsahuje predpocitana data.

Co vizualizovat:

- Vlevo "skutecna astronomicka tabulka".
- Uprostred sipka "RA/Dec".
- Vpravo FE dome, kam se jen prekresli hotova poloha.
- Prepinac: "Bez tabulky" ukaze, ze model nema vlastni presnou FE predikci.

Zaver:
Toto je nejvetsi problem. Model nevysvetluje, proc jsou telesa tam, kde jsou. Jen prebere spravne polohy odjinud.

## Problem FE-002: Pozorovana obloha se pocita pres sferickou lokalni geometrii

Severity: Kriticka

Jednoduse pro dite:
Model rika "plochy svet", ale kdyz chce zjistit, kde vidis Slunce na obloze, pouzije vypocet jako pro kulatou Zemi.

Proc je to spatne:
Azimut a vyska nad obzorem jsou presne ty hodnoty, ktere pozorovatel realne vidi. Pokud se tyto hodnoty ziskaji standardnim prevodem z RA/Dec, zemepisne sirky, delky a hvezdneho casu, pak FE cast jen kresli vysledek.

Dukaz v kodu:

- `source/js/core/transforms.js`: `compTransMatCelestToGlobe(...)`
- `source/js/core/transforms.js`: `localGlobeCoordToAngles(...)`
- `source/js/core/app.js`: `SunAnglesGlobe`, `MoonAnglesGlobe`, `anglesGlobe`

Co vizualizovat:

- Interaktivni postavicka na Zemi.
- Slider zemepisne sirky.
- Ukazat, ze vyska Slunce se pocita z oblohy nad pozorovatelem jeste pred kreslenim FE disku.

Zaver:
Kdyz je hlavni pozorovany vysledek vypocitan "globe" transformaci, neni to dukaz FE modelu.

## Problem FE-003: Lat/long sit je natvrdo severopolarní AE projekce

Severity: Kriticka

Jednoduse pro dite:
Model vezme kulatou mapu a roztahne ji jako papir kolem severniho polu. Jenze na jihu se vzdalenosti silene nafouknou.

Proc je to spatne:
Azimutalni ekvidistantni projekce neni fyzicka mapa sveta. Je to mapova projekce. Vzdalenosti a obvody rovnobezek mimo specialni smery nesedi s realitou.

Dukaz v kodu:

- `source/js/core/canonical.js`: `canonicalLatLongToDisc(...)`
- `source/js/core/canonical.js`: `setActiveProjection() {}` je prazdna funkce.

Priklad:

- Na kouli ma rovnobezka 60 stupnu severne polovicni obvod rovniku.
- V tomto FE disku ma 60 stupnu severne jen tretinovy obvod rovniku.
- Na jihu je chyba jeste horsi.

Co vizualizovat:

- Dve mapy vedle sebe: koule vs FE disk.
- Krouzek kolem 60 N, rovnik, 80 S.
- Pocitadlo "kolikrat je obvod spatne".

Zaver:
Model stoji na mapove projekci, ne na fyzicke geometrii Zeme.

## Problem FE-004: Vysky Slunce, Mesice a planet jsou rucne naladene pasy

Severity: Kriticka

Jednoduse pro dite:
Slunce neni umistene podle skutecne vzdalenosti nebo svetla. Kod mu jen rekne: "kdyz je vic na sever, dej ho vys; kdyz je na jih, dej ho niz."

Proc je to spatne:
Fyzikalni model by mel mit pravidlo, ktere vysvetli polohu teles v prostoru. Tady je vyska nad FE diskem pocitana z deklinace a rucne zvolenych konstant.

Dukaz v kodu:

- `source/js/core/app.js`: `HEADROOM = 0.06`
- `source/js/core/app.js`: `SUN_RANGE = 0.20`
- `source/js/core/app.js`: `s.SunVaultHeight = ...`
- `source/js/core/app.js`: Mesic je "slaved to the sun's ecliptic".
- `source/js/core/app.js`: planety jsou take "slaved to the sun's ecliptic".

Co vizualizovat:

- Slider deklinace Slunce.
- Vedle toho rucne rostouci/sestupujici vyska na dome.
- Tlacitko "vypni rucni pravidlo" ukaze, ze se vizualni shoda rozpadne.

Zaver:
Tohle je hardcoded specialita. Nejde o nezavisle vysvetleni, ale o ladeni obrazku.

## Problem FE-005: Zatmeni nejsou FE predikovana

Severity: Kriticka

Jednoduse pro dite:
Model nerika sam, kdy bude zatmeni. Ma seznam skutecnych zatmeni a pak je jen prehraje.

Proc je to spatne:
Predikce zatmeni je jeden z nejdulezitejsich testu astronomickeho modelu. Pokud jsou zatmeni prevzata z realneho katalogu, model je nevypocital.

Dukaz v kodu:

- `source/js/demos/eclipseRegistry.js`: nacita `ASTROPIXELS_ECLIPSES`.
- `source/js/data/astropixelsEclipses.js`: katalog skutecnych zatmeni.
- `source/js/demos/feEclipseTrack.js`: FE predikce je jen placeholder.

Co vizualizovat:

- Kalendar skutecnych zatmeni.
- Sipka "model si vezme hotovy datum".
- Varovani: "Toto neni predikce, toto je prehrani seznamu."

Zaver:
Zatmeni jsou importovana, ne vysvetlena FE geometrii.

## Problem FE-006: Stin zatmeni pouziva svevolne FE polomery a katalogovou magnitudu

Severity: Vysoka

Jednoduse pro dite:
Aby stin vypadal dobre, kod si vybere velikost Slunce a Mesice v modelu. Neni to skutecna velikost.

Proc je to spatne:
Stin je kreslen z FE-scale polomeru, ktere jsou zvolene tak, aby byl efekt videt. Navic rozhodnuti, jestli kreslit umbru, se opira o katalogovou magnitudu skutecneho zatmeni.

Dukaz v kodu:

- `source/js/render/worldObjects.js`: `r_s = 0.030`
- `source/js/render/worldObjects.js`: `r_m = 0.025`
- `source/js/render/worldObjects.js`: umbra se kresli pri `EclipseMagnitude >= 0.99`

Co vizualizovat:

- Dva kruhy Slunce/Mesic s nastavitelnym polomerem.
- Ukazat, ze zmena par cisel zmeni, jestli stin vubec dopadne na zem.

Zaver:
Zatmenovy stin je vizualni konstrukce, ne potvrzeni FE modelu.

## Problem FE-007: "Geocentric" planetarni pipeline sama priznava, ze je nepresna

Severity: Vysoka

Jednoduse pro dite:
Jedna cast modelu rika: "Planety se tu nechovaji jako na skutecne obloze."

Proc je to spatne:
Planety maji retrogradni pohyb a vnitrni planety se drzi blizko Slunce. Kodova komentarova hlavicka priznava, ze v GeoC pipeline to nefunguje.

Dukaz v kodu:

- `source/js/core/ephemerisGeo.js`: komentar rika, ze Mercury/Venus nelibruji okolo Slunce.
- `source/js/core/ephemerisGeo.js`: komentar rika, ze zadna planeta nema retrogradni pohyb.

Co vizualizovat:

- Animace Marsu se skutecnou retrogradni smyckou.
- Vedle toho GeoC verze bez smycky.

Zaver:
Tato cast neni schopna popsat realnou planetarni oblohu.

## Problem FE-008: Mimo rozsah DE405 dat se vraci falesna poloha RA=0, Dec=0

Severity: Vysoka

Jednoduse pro dite:
Kdyz model nema data, nemel by si vymyslet. Ale tady vrati polohu, jako by neco opravdu spocital.

Proc je to spatne:
Roky mimo rozsah 2019-2030 vrati `{ ra: 0, dec: 0 }`. To je platna nebeska poloha, ale neni skutecne spocitana.

Dukaz v kodu:

- `source/js/core/ephemerisAstropixels.js`: `return r || { ra: 0, dec: 0 }`

Overeny priklad:

- Slunce pro 2018 vrati RA 0, Dec 0.
- Slunce pro 2031 vrati RA 0, Dec 0.

Co vizualizovat:

- Casova osa 2019-2030 zelene.
- Mimo ni cervene: "data chybi, ale model predstira bod na obloze".

Zaver:
Tohle je skutecna chyba robustnosti a muze vytvaret klamne vysledky.

## Problem FE-009: Prvni `update()` vytvari NaN opticke souradnice

Severity: Stredni az vysoka

Jednoduse pro dite:
Model nejdriv pocita s cislem, ktere jeste nenastavil. Proto poprve dostane "neni cislo".

Proc je to spatne:
Poradi vypoctu je chybne. Opticka vyska se pouzije drive, nez se nastavi `OpticalVaultHeightEffective`.

Dukaz v kodu:

- `source/js/core/app.js`: Slunce pouziva `c.OpticalVaultHeightEffective` pri vypoctu `SunOpticalVaultCoord`.
- `source/js/core/app.js`: `c.OpticalVaultHeightEffective` se nastavuje az pozdeji.

Overeny priklad:

- Prvni `model.update()` da `SunOpticalVaultCoord = [NaN, NaN, NaN]`.
- Druhy `model.update()` uz da normalni cisla.

Co vizualizovat:

- Jednoduchy diagram poradi kroku: "pouzij hodnotu" pred "nastav hodnotu".

Zaver:
Tohle neni filozoficky spor, ale normalni programatorska chyba.

## Problem FE-010: Mesicni faze nejsou FE osvetleni

Severity: Vysoka

Jednoduse pro dite:
Model neresi, jak svetlo leti v plochem svete. Jen vezme uhel mezi Sluncem a Mesicem na obloze.

Proc je to spatne:
Faze Mesice jsou pocitane z geocentrickych jednotkovych vektoru. Nepouzivaji FE vzdalenosti, velikosti ani realnou drahu svetla v modelu.

Dukaz v kodu:

- `source/js/core/app.js`: cast "Moon phase"
- `moonToSun` a `moonToGlobe` jsou odvozene z nebeskych vektoru.

Co vizualizovat:

- Trojuhelnik Slunce-Zeme-Mesic jako u standardni astronomie.
- Vedle toho prazdne misto: "FE svetelna geometrie zde neni."

Zaver:
Faze Mesice nejsou nezavisle vysvetleny FE modelem.

## Problem FE-011: Live stranka sama priznava, ze jde o konceptualni model a fiktivniho pozorovatele

Severity: Vysoka

Jednoduse pro dite:
Autori sami rikaji, ze je to myslenkovy obrazek a ze pouziva fiktivniho pozorovatele.

Proc je to dulezite:
To oslabuje tvrzeni, ze jde o fyzicky funkcni model sveta. Konceptualni vizualizace muze byt zajimava, ale neni dukaz.

Dukaz:

- Live stranka: `https://alanspaceaudits.github.io/conceptual_flat_earth_model/`
- Text mluvi o "conceptual model", "observer's optical vault" a "fictitious observer".

Co vizualizovat:

- Citace z live stranky.
- Vysvetleni rozdilu mezi "model pro kresleni" a "model pro predikci sveta".

Zaver:
Samotny projekt se opatrne popisuje jako konceptualni, ne jako plne fyzikalni model.

## Navrh hlavni navigace webu

1. Uvod: "Proc model vypada presvedcive?"
2. Kapitola: "Kde se berou polohy Slunce a Mesice?"
3. Kapitola: "Proc mapa neni svet?"
4. Kapitola: "Rucne nastavene vysky na dome"
5. Kapitola: "Zatmeni: predikce, nebo seznam?"
6. Kapitola: "Planety a retrogradni pohyb"
7. Kapitola: "Chyby v kodu a fallbacky"
8. Kapitola: "Shrnuti pro deti"
9. Technicka priloha: odkazy na soubory a radky kodu

## Interaktivni prvky, ktere chceme postavit

- Rozklikavaci karty problemu podle severity.
- Mini animace datoveho toku: DE405 -> RA/Dec -> lokalni obloha -> FE kresba.
- Porovnavac mapove projekce: koule vs AE disk.
- Kalkulacka obvodu rovnobezek.
- Slider deklinace a rucni vysky Slunce.
- Zatmenovy kalendar: skutecny katalog vs chybejici FE prediktor.
- Debug panel: co se stane mimo rozsah dat 2019-2030.
- Animace prvniho `update()` s NaN hodnotou.
- Detsky rezim vysvetleni: kratke vety, obrazky, prirovnani.
- Technicky rezim vysvetleni: kod, soubory, formule.

## Hlavni claim webu

Tento FE model je presvedcivy hlavne proto, ze si bere presne astronomicke vysledky z jinych modelu a kresli je na plochou scenu. Neprokazuje, ze plocha Zeme funguje. Ukazuje, ze hotove sfericke/geocentricke vysledky lze vizualne prekreslit na disk.

