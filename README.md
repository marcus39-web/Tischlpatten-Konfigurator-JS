tischplatten/
# Tischplatten-Konfigurator

## Projektbeschreibung

Der Tischplatten-Konfigurator ist eine interaktive Webanwendung, mit der Kund:innen einer (fiktiven) Tischlerei individuelle Tischplatten konfigurieren und den Preis berechnen können. Die Anwendung ist ein Beispielprojekt für JavaScript-Grundlagen und demonstriert die Trennung von HTML, CSS und JavaScript.

---

## Features

- Auswahl von Plattentyp (vollmassiv, gedoppelt)
- Auswahl von Form, Farbe, Finish, Rissanteil und Zusatzoptionen
- Eingabe von Breite, Länge und Stärke
- Automatische Preisberechnung inkl. Zuschläge und Kleinteil-Zuschlag
- Responsive Design (funktioniert auf Desktop und Mobilgeräten)
- Vorschau von Form und Farbe (wenn Bilder vorhanden)
- Fehlerbehandlung und Benutzerführung

---

## Bedienung

1. **Plattentyp wählen** (Vollmassiv oder Gedoppelt)
2. **Form, Farbe, Finish, Rissanteil** und ggf. Zusatzoptionen auswählen
3. **Maße eingeben** (Breite, Länge, Stärke)
4. Auf **Preis berechnen** klicken
5. Der Preis und alle Zuschläge werden angezeigt
6. Mit **Zurücksetzen** das Formular leeren

---

## Technische Hinweise

- **HTML**: Struktur und Formularelemente
- **CSS**: Alle Styles in `css/styles.css` (keine Inline-Styles)
- **JavaScript**: Logik in `js/konfigurator.js` (keine HTML-Event-Handler)
- **Bilder**: Vorschau-Bilder im Ordner `images/` (optional)

---

## Preisberechnung (Beispiel)

- Grundpreis pro m² je nach Typ und Stärke (siehe JS-Code)
- Zuschläge für bestimmte Optionen (z.B. Äste/Risse verfüllt, Roh-Finish)
- Kleinteil-Zuschlag (+5%) bei Flächen < 1 m²

---

## Projektstruktur

```
Übungen/tischplatten/
├── index.html              # Hauptdatei (verwenden!)
├── css/
│   └── styles.css         # Alle Styles
├── js/
│   └── konfigurator.js    # JavaScript-Logik
├── images/                # Vorschaubilder (optional)
└── README.md              # Diese Projektbeschreibung
```

---

## Hinweise für Lehrkräfte / Korrektur

- Die Anwendung ist vollständig ohne Backend lauffähig (nur im Browser öffnen).
- Die Preislogik ist im JS-Code dokumentiert und kann leicht angepasst werden.

---

**Stand:** Januar 2026