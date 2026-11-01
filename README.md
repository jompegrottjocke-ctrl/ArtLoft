# ArtLoft

Ett konstquiz för Windows 11 med ett lugnt, museiinspirerat gränssnitt. Varje runda innehåller 20 slumpade målningar, fem unika titlar per fråga, direkt återkoppling och resultat. Klicka på Nästa efter återkopplingen oavsett om svaret var rätt eller fel.

## Kör och bygg på Windows 11

Installera Node.js 24 LTS. Öppna PowerShell i projektmappen:

```powershell
npm ci
npm test
npm start
```

Skapa en Windows-installation:

```powershell
npm run dist:win
```

Installationsfilen skapas i `dist`. Bygget är inte kodsignerat; Windows kan visa SmartScreen. En signerad offentlig release kräver eget kodsigneringscertifikat.

## Konstsamlingen

Appen hämtar upp till 1 000 målningar från Art Institute of Chicagos öppna API och filtrerar på public domain, tillgänglig bild och konstnär. Det faktiska antalet visas i appen. Metadata cachelagras lokalt efter första hämtningen. Bilder hämtas via museets IIIF-server och kräver internet även senare. Titlar visas enligt museets katalog. Konstnär, årtal och credit line visas efter varje svar. Mona Lisa ingår inte i detta museums samling; appen utlovar inte det verket.

Nätverk: `api.artic.edu` och `www.artic.edu` över HTTPS. Inga konton eller API-nycklar behövs. API-dokumentation: https://api.artic.edu/docs/

## Validering

`npm test` testar svarsalternativ, slumpning och filtrering. Windows-installation och visuell körning behöver verifieras på Windows; en Linux-kontroll av JavaScript är inte ett Windows-test.
