# Tischplatten-Konfigurator

## Projektbeschreibung

Der Tischplatten-Konfigurator ist eine moderne Webanwendung, mit der Kund:innen einer Tischlerei individuelle Tischplatten konfigurieren und den Preis direkt berechnen können. Das Projekt demonstriert die Trennung von HTML, CSS und JavaScript und eignet sich als Beispiel für praxisnahe JavaScript-Anwendungen.

---

## Features

- Auswahl von Plattentyp (vollmassiv, gedoppelt)
- Auswahl von Form, Farbe, Finish, Rissanteil und Zusatzoptionen
- Eingabe von Breite, Länge und Stärke
- Preisberechnung inkl. Zuschläge und Kleinteil-Zuschlag
- Responsive Design für Desktop und Mobilgeräte
- Vorschau von Form und Farbe (sofern Bilder vorhanden)
- Fehlerbehandlung und Benutzerführung
- Übersichtliche, tabellarische Preisanzeige

---

## Bedienung

1. **Plattentyp wählen** (Vollmassiv oder Gedoppelt)
2. **Form, Farbe, Finish, Rissanteil** und ggf. Zusatzoptionen auswählen
3. **Maße eingeben** (Breite, Länge, Stärke)
4. Auf **Preis berechnen** klicken
5. Der Preis und alle Zuschläge werden tabellarisch angezeigt
6. Mit **Zurücksetzen** das Formular leeren

---

## Technische Hinweise

- **HTML**: Struktur und Formularelemente (`index.html`)
- **CSS**: Alle Styles in `css/styles.css` (keine Inline-Styles, tabellarisches Layout)
- **JavaScript**: Logik in `js/tischplatten-konfigurator.js` (keine HTML-Event-Handler)
- **Bilder**: Vorschaubilder im Ordner `images/` (optional)

---

## Preisberechnung

- Grundpreis pro m² je nach Typ und Stärke (siehe JS-Code)
- Zuschläge für bestimmte Optionen (z.B. Äste/Risse verfüllt, Finish, Farbe)
- Kleinteil-Zuschlag (+5%) bei Flächen < 1 m²
- Alle Preisbestandteile werden tabellarisch und übersichtlich ausgegeben

---

## Projektstruktur

```
Übungen/tischplatten/
├── index.html              # Hauptdatei
├── css/
│   └── styles.css         # Alle Styles
├── js/
│   └── tischplatten-konfigurator.js    # JavaScript-Logik
├── images/                # Vorschaubilder (optional)
└── README.md              # Projektbeschreibung
```

---

## Hinweise für Lehrkräfte / Korrektur

- Die Anwendung ist vollständig ohne Backend lauffähig (nur im Browser öffnen).
- Die Preislogik ist im JS-Code dokumentiert und kann leicht angepasst werden.
- Die Preisanzeige ist tabellarisch und entspricht modernen UX-Standards.

---

**Stand:** Januar 2026