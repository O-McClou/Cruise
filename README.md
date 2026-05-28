# ⚓ CruiseLog – Cruise Tracker App

Your personal cruise journey tracker. Log every port you’ve visited, every ship you’ve sailed on, plan voyages and earn badges – works completely offline, no account needed.

-----

## 🚀 In 3 Schritten zum iPhone-Homescreen

### Schritt 1 – GitHub Repository erstellen

1. Gehe zu [github.com](https://github.com) und melde dich an (oder registriere dich kostenlos)
1. Klicke oben rechts auf **„+”** → **„New repository”**
1. Repository-Name: `cruiselog` (oder beliebig)
1. Stelle sicher: **Public** ist ausgewählt
1. Klicke **„Create repository”**

-----

### Schritt 2 – Dateien hochladen

1. Klicke im neuen Repository auf **„uploading an existing file”**
1. Lade diese 3 Dateien hoch:
- `index.html`
- `manifest.json`
- `sw.js`
1. Klicke **„Commit changes”**

-----

### Schritt 3 – GitHub Pages aktivieren

1. Gehe zu **Settings** (im Repository oben)
1. Scrolle runter zu **„Pages”** (linke Sidebar)
1. Unter **„Branch”**: wähle `main` → Ordner `/root` → **Save**
1. Warte ca. 1–2 Minuten
1. Deine App-URL erscheint oben, z.B.:
   
   ```
   https://DEIN-USERNAME.github.io/cruiselog/
   ```

-----

### 📱 Zum iPhone-Homescreen hinzufügen

1. Öffne die App-URL (z.B. `https://USERNAME.github.io/cruiselog/`) in **Safari** auf deinem iPhone

> ⚠️ Muss Safari sein – Chrome/Firefox unterstützen „Add to Home Screen” auf iOS nicht
1. Tippe unten auf das **Teilen-Symbol** (Quadrat mit Pfeil nach oben)
1. Scrolle und tippe auf **„Zum Home-Bildschirm”**
1. Namen bestätigen → **„Hinzufügen”**
1. Die App erscheint jetzt als Icon auf deinem Homescreen ✅

-----

## ✨ Features

|Feature               |Details                                                                                                       |
|----------------------|--------------------------------------------------------------------------------------------------------------|
|**⚓ 115 Häfen**       |Karibik, Mittelmeer, Nordeuropa, Nordamerika, Asien, Pazifik, Südamerika                                      |
|**🚢 58 Schiffe**      |AIDA, MSC, Royal Caribbean, NCL, Celebrity, Princess, Costa, TUI, Hapag-Lloyd, Cunard, Holland America, Disney|
|**🏅 30 Badges**       |Meilensteine für Häfen, Länder, Regionen, Schiffe, Reedereien                                                 |
|**🗓️ Reiseplaner**     |Kreuzfahrten planen und dokumentieren                                                                         |
|**⭐ Rankings**        |Community-Bewertungen für Schiffe, Häfen & Reedereien                                                         |
|**📴 Offline**         |Funktioniert komplett ohne Internet-Verbindung                                                                |
|**💾 Lokaler Speicher**|Alle Daten bleiben auf deinem Gerät                                                                           |
|**📤 Export/Import**   |Daten als JSON sichern und wiederherstellen                                                                   |

-----

## 🗂️ Dateiübersicht

```
cruiselog/
├── index.html      ← Komplette App (HTML + CSS + JS)
├── manifest.json   ← PWA-Konfiguration (App-Name, Icon, etc.)
├── sw.js           ← Service Worker (Offline + Icon-Generator)
└── README.md       ← Diese Anleitung
```

-----

## 🔧 Technische Details

- **PWA** (Progressive Web App) – kein App Store nötig
- **Vanilla JS** – keine Frameworks, keine externen Abhängigkeiten
- **LocalStorage** – Daten werden lokal gespeichert
- **Service Worker** – generiert App-Icon automatisch, ermöglicht Offline-Nutzung
- **iOS optimiert** – Safe Area Insets, apple-mobile-web-app-capable, smooth scrolling
- **Responsive** – für iPhone optimiert, funktioniert auch auf Android

-----

## ❓ Häufige Fragen

**Q: Sind meine Daten sicher?**  
A: Alle Daten werden ausschließlich lokal auf deinem Gerät gespeichert (localStorage). Nichts wird an Server übertragen.

**Q: Funktioniert die App ohne Internet?**  
A: Ja! Nach dem ersten Laden funktioniert die App komplett offline dank Service Worker.

**Q: Kann ich meine Daten sichern?**  
A: Ja, unter Profil → „Export Data” kannst du alle Daten als JSON-Datei herunterladen und mit „Import Data” wiederherstellen.

**Q: Das Icon sieht beim ersten Laden noch nicht richtig aus?**  
A: Das Icon wird beim ersten App-Start per Canvas generiert. Beim nächsten Start sieht es perfekt aus.

**Q: Kann ich die App auch auf Android nutzen?**  
A: Ja! In Chrome auf Android: Menü → „App installieren” oder „Zum Startbildschirm hinzufügen”.

-----

## 🛠️ Anpassungen

### App-Name ändern

In `manifest.json`: `"name"` und `"short_name"` ändern.  
In `index.html`: `<title>`, `apple-mobile-web-app-title` und die Texte `.hdr-name` / `.in-title` anpassen.

### Neue Häfen hinzufügen

Im `<script>`-Bereich in `index.html` das `PORTS`-Array erweitern:

```javascript
{id:'neuhafen', name:'Mein Hafen', country:'Deutschland', region:'northern_europe', flag:'🇩🇪'},
```

### Neue Schiffe hinzufügen

```javascript
{id:'meinschiff', name:'Mein Schiff', line:'AIDA', year:2025, gt:90000},
```

-----

*Made with ❤️ by cruisers, for cruisers · CruiseLog v1.0*