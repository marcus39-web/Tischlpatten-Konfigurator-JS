/**
 * Tischplatten-Konfigurator JavaScript
 * Berechnet Preise für individuelle Tischplatten basierend auf Kundenkonfiguration
 */

// --- PREISBERECHNUNG: Grundpreise und Zuschläge ---
// Hier werden die Preise für die verschiedenen Typen und Stärken festgelegt
const PREISE = {
    // Grundpreise pro m² nach Typ und Stärke
    vollmassiv: {
        25: 300.00,
        30: 360.00,
        40: 420.00,
        50: 480.00,
        60: 560.00,
        70: 640.00,
        80: 720.00,
        90: 800.00,
        100: 880.00,
        110: 960.00,
        120: 1040.00
    },
    gedoppelt: {
        40: 315.00,
        50: 360.00,
        60: 420.00,
        70: 480.00,
        80: 540.00,
        90: 600.00,
        100: 660.00,
        110: 720.00,
        120: 780.00
    }
};

// Zuschläge für bestimmte Optionen (z.B. verfüllte Risse, Roh-Finish)
const ZUSCHLAEGE = {
    verfuellt: 47.60,       // Äste/Risse schwarz verfüllt
    roh: 71.40,             // Reine Balken Aussenseite
    // Beispiel-Zuschläge für Farben (pro m²)
    'farbe-hellgrau': 25.00,
    'farbe-dunkelgrau': 30.00,
    'farbe-weiss-geoelt': 20.00,
    // Beispiel-Zuschläge für Finish (pro m²)
    'finish-mattlack': 15.00,
    'finish-hart-oel': 10.00
};

// Zuschlag, wenn die Fläche kleiner als 1 m² ist
const KLEINTEIL_ZUSCHLAG = 0.05; // 5%
const MIN_FLAECHE_OHNE_ZUSCHLAG = 1.0; // 1 m²

// --- DOM-Elemente: Hier werden alle wichtigen Elemente aus dem HTML gespeichert ---
const DOM = {
    // Formularelemente
    form: null,
    typInputs: null,
    formSelect: null,
    breiteInput: null,
    laengeInput: null,
    staerkeSelect: null,
    rissanteilSelect: null,
    verfuelltCheckbox: null,
    farbeSelect: null,
    finishSelect: null,

    // Anzeige-Elemente
    flaecheAnzeige: null,
    grundpreisAnzeige: null,
    zuschlagAnzeige: null,
    zuschlagZeile: null,
    kleinteilZeile: null,
    gesamtPreis: null,
    fehlerMeldung: null,

    // Button-Elemente
    berechnenBtn: null,
    resetBtn: null,

    // Preview-Elemente
    formPreview: null,
    farbePreview: null
};

// Startfunktion: Wird ausgeführt, wenn die Seite geladen ist
function initKonfigurator() {
    // Alle wichtigen HTML-Elemente werden gesucht und gespeichert
    initDOMReferences();

    // Klick- und Eingabe-Events werden eingerichtet
    registerEventListeners();

    // Stärken-Auswahl wird an den Typ angepasst
    updateStaerkenVerfuegbarkeit();

    // Vorschau-Bilder werden geladen (falls vorhanden)
    updateFormPreview();
    updateFarbePreview();

    // Hinweis in der Konsole
    console.log('Tischplatten-Konfigurator initialisiert');
}

// Sucht alle wichtigen HTML-Elemente und speichert sie im DOM-Objekt
function initDOMReferences() {
    // Formularelemente
    DOM.form = document.querySelector('#konfiguratorForm');
    DOM.typInputs = document.querySelectorAll('input[name="typ"]');
    DOM.formSelect = document.querySelector('#form');
    DOM.breiteInput = document.querySelector('#breite');
    DOM.laengeInput = document.querySelector('#laenge');
    DOM.staerkeSelect = document.querySelector('#staerke');
    DOM.rissanteilSelect = document.querySelector('#rissanteil');
    DOM.verfuelltCheckbox = document.querySelector('#verfuellt');
    DOM.farbeSelect = document.querySelector('#farbe');
    DOM.finishSelect = document.querySelector('#finish');

    // Anzeige-Elemente
    DOM.flaecheAnzeige = document.querySelector('#flaecheAnzeige');
    DOM.grundpreisAnzeige = document.querySelector('#grundpreisAnzeige');
    DOM.zuschlagAnzeige = document.querySelector('#zuschlagAnzeige');
    DOM.zuschlagZeile = document.querySelector('#zuschlagZeile');
    DOM.kleinteilZeile = document.querySelector('#kleinteilZeile');
    DOM.gesamtPreis = document.querySelector('#gesamtPreis');
    DOM.fehlerMeldung = document.querySelector('#fehlerMeldung');

    // Button-Elemente
    DOM.berechnenBtn = document.querySelector('#berechnenBtn');
    DOM.resetBtn = document.querySelector('#resetBtn');

    // Preview-Elemente
    DOM.formPreview = document.querySelector('#formPreview');
    DOM.farbePreview = document.querySelector('#farbePreview');
}

// Richtet alle Event-Listener ein (z.B. für Klicks und Eingaben)
function registerEventListeners() {
    // Wenn auf "Preis berechnen" oder "Zurücksetzen" geklickt wird
    DOM.berechnenBtn.addEventListener('click', berechnePreis);
    DOM.resetBtn.addEventListener('click', resetKonfigurator);

    // Wenn der Typ geändert wird, werden die Stärken angepasst
    DOM.typInputs.forEach(input => {
        input.addEventListener('change', handleTypChange);
    });

    // Wenn die Form geändert wird, wird das Vorschaubild aktualisiert
    DOM.formSelect.addEventListener('change', updateFormPreview);

    // Wenn die Farbe geändert wird, wird das Vorschaubild aktualisiert
    DOM.farbeSelect.addEventListener('change', updateFarbePreview);

    // Automatische Berechnung entfernt – nur noch Button löst Berechnung aus
    // (Optional: Felder können weiterhin auf Fehler geprüft werden, aber keine Berechnung)
    const autoValidateElements = [
        DOM.breiteInput,
        DOM.laengeInput,
        DOM.staerkeSelect
    ];
    autoValidateElements.forEach(element => {
        if (element) {
            element.addEventListener('change', () => {
                const konfiguration = sammleKonfiguration();
                const validierung = validiereKonfiguration(konfiguration);
                if (!validierung.isValid) {
                    zeigeFehlermeldung(validierung.fehler);
                } else {
                    verbergeFehlermeldung();
                }
            });
        }
    });
}

// Wird aufgerufen, wenn der Typ geändert wird
function handleTypChange() {
    updateStaerkenVerfuegbarkeit();
    berechnePreis(); // Automatische Neuberechnung
}

// Passt die Auswahl der Stärken an den gewählten Typ an
function updateStaerkenVerfuegbarkeit() {
    const gewaehlterTyp = document.querySelector('input[name="typ"]:checked')?.value;
    const optionen = DOM.staerkeSelect.querySelectorAll('option');
    let gueltigeGefunden = false;
    optionen.forEach(option => {
        const staerkeWert = parseInt(option.value);
        if (!isNaN(staerkeWert)) {
            // Gedoppelt ist erst ab 40mm verfügbar
            const istVerfuegbar = gewaehlterTyp === 'gedoppelt' ? staerkeWert >= 40 : true;
            option.disabled = !istVerfuegbar;
            if (istVerfuegbar && !gueltigeGefunden) {
                gueltigeGefunden = true;
            }
            // Wenn aktuell gewählte Stärke nicht mehr verfügbar ist, zurücksetzen
            if (!istVerfuegbar && option.selected) {
                DOM.staerkeSelect.selectedIndex = 0;
            }
        }
    });
    // Hinweistext anzeigen, wenn keine Stärke ausgewählt ist (nur wenn Wert leer oder ungültig)
    const staerkeValue = DOM.staerkeSelect.value;
    if (!staerkeValue || isNaN(parseInt(staerkeValue))) {
        zeigeFehlermeldung('Bitte wählen Sie eine Stärke aus.');
    } else {
        verbergeFehlermeldung();
    }
}

// Hauptfunktion: Berechnet den Preis und zeigt ihn an
function berechnePreis() {
    try {
        // Eingaben auslesen und prüfen
        const konfiguration = sammleKonfiguration();
        const validierung = validiereKonfiguration(konfiguration);

        if (!validierung.isValid) {
            zeigeFehlermeldung(validierung.fehler);
            resetPreisanzeige();
            return;
        }

        // Preisdetails berechnen
        const preisberechnung = berechnePreisDetails(konfiguration);

        // Preis und Details anzeigen
        aktualisierePreisanzeige(preisberechnung);
        // Fehlermeldung ausblenden

    } catch (error) {
        // Fehlerbehandlung
        zeigeFehlermeldung('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
}

// Liest alle Werte aus dem Formular aus und gibt sie als Objekt zurück
function sammleKonfiguration() {
    // Eingaben bereinigen: führende Nullen entfernen
    let breite = DOM.breiteInput.value.replace(/^0+/, '');
    let laenge = DOM.laengeInput.value.replace(/^0+/, '');
    return {
        typ: document.querySelector('input[name="typ"]:checked')?.value,
        form: DOM.formSelect.value,
        breite: parseFloat(breite),
        laenge: parseFloat(laenge),
        staerke: parseInt(DOM.staerkeSelect.value),
        rissanteil: DOM.rissanteilSelect.value,
        verfuellt: DOM.verfuelltCheckbox.checked,
        farbe: DOM.farbeSelect.value,
        finish: DOM.finishSelect.value
    };
}

// Prüft, ob alle Eingaben gültig sind (z.B. Zahlen, Mindestgrößen)
function validiereKonfiguration(config) {
    const fehler = [];

    if (!config.typ) {
        fehler.push('Bitte wählen Sie einen Plattentyp aus.');
    }

    if (isNaN(config.breite) || config.breite <= 0) {
        fehler.push('Bitte geben Sie eine gültige Breite ein.');
    }

    if (isNaN(config.laenge) || config.laenge <= 0) {
        fehler.push('Bitte geben Sie eine gültige Länge ein.');
    }

    if (isNaN(config.staerke) || config.staerke <= 0) {
        fehler.push('Bitte wählen Sie eine Stärke aus.');
    }

    // Prüfung ob Stärke für gewählten Typ verfügbar ist
    if (config.typ && config.staerke && !PREISE[config.typ][config.staerke]) {
        fehler.push(`Stärke ${config.staerke}mm ist für ${config.typ} nicht verfügbar.`);
    }

    // Mindestgrößen prüfen
    if (!isNaN(config.breite) && config.breite < 30) {
        fehler.push('Mindestbreite beträgt 30 cm.');
    }

    if (!isNaN(config.laenge) && config.laenge < 30) {
        fehler.push('Mindestlänge beträgt 30 cm.');
    }

    return {
        isValid: fehler.length === 0,
        fehler: fehler
    };
}

// Berechnet alle Preisbestandteile (Fläche, Zuschläge, Gesamtpreis)
function berechnePreisDetails(config) {
    // Fläche in m² berechnen
    let flaecheQm;
    // Runde und ovale Platten als Ellipse berechnen
    if (config.form === 'rund' || config.form === 'oval') {
        // Ellipsenfläche: π * (Breite/2) * (Länge/2)
        flaecheQm = Math.PI * (config.breite / 2) * (config.laenge / 2) / 10000;
    } else {
        // Rechteckige Fläche
        flaecheQm = (config.breite * config.laenge) / 10000;
    }

    // Grundpreis pro m² ermitteln
    const grundpreisProQm = PREISE[config.typ][config.staerke];

    // Zuschläge berechnen
    let zuschlagProQm = 0;
    const zuschlagDetails = [];

    if (config.verfuellt) {
        zuschlagProQm += ZUSCHLAEGE.verfuellt;
        zuschlagDetails.push(`Äste/Risse verfüllt: +${ZUSCHLAEGE.verfuellt.toFixed(2)} €/m²`);
    }

    if (config.finish === 'roh') {
        zuschlagProQm += ZUSCHLAEGE.roh;
        zuschlagDetails.push(`Reine Balken Aussenseite: +${ZUSCHLAEGE.roh.toFixed(2)} €/m²`);
    }

    // Beispiel-Zuschläge für Farben
    if (config.farbe === 'hellgrau') {
        zuschlagProQm += ZUSCHLAEGE['farbe-hellgrau'];
        zuschlagDetails.push(`Farbe Hellgrau: +${ZUSCHLAEGE['farbe-hellgrau'].toFixed(2)} €/m²`);
    }
    if (config.farbe === 'dunkelgrau') {
        zuschlagProQm += ZUSCHLAEGE['farbe-dunkelgrau'];
        zuschlagDetails.push(`Farbe Dunkelgrau: +${ZUSCHLAEGE['farbe-dunkelgrau'].toFixed(2)} €/m²`);
    }
    if (config.farbe === 'weiss-geoelt') {
        zuschlagProQm += ZUSCHLAEGE['farbe-weiss-geoelt'];
        zuschlagDetails.push(`Farbe Weiß geölt: +${ZUSCHLAEGE['farbe-weiss-geoelt'].toFixed(2)} €/m²`);
    }

    // Beispiel-Zuschläge für Finish (Werte aus Select und Keys im Objekt abgleichen)
    if (config.finish === 'mattlack' || config.finish === 'Mattlack') {
        zuschlagProQm += ZUSCHLAEGE['finish-mattlack'];
        zuschlagDetails.push(`Finish Mattlack: +${ZUSCHLAEGE['finish-mattlack'].toFixed(2)} €/m²`);
    }
    if (config.finish === 'hart-oel' || config.finish === 'Hart-Öl') {
        zuschlagProQm += ZUSCHLAEGE['finish-hart-oel'];
        zuschlagDetails.push(`Finish Hart-Öl: +${ZUSCHLAEGE['finish-hart-oel'].toFixed(2)} €/m²`);
    }

    // Zwischensumme
    const zwischensumme = (grundpreisProQm + zuschlagProQm) * flaecheQm;

    // Kleinteil-Zuschlag (5% bei unter 1 m²)
    const hatKleinteilZuschlag = flaecheQm < MIN_FLAECHE_OHNE_ZUSCHLAG;
    const kleinteilFaktor = hatKleinteilZuschlag ? (1 + KLEINTEIL_ZUSCHLAG) : 1;

    // Gesamtpreis
    const gesamtpreis = zwischensumme * kleinteilFaktor;

    return {
        flaecheQm: flaecheQm,
        grundpreisProQm: grundpreisProQm,
        zuschlagProQm: zuschlagProQm,
        zuschlagDetails: zuschlagDetails,
        hatKleinteilZuschlag: hatKleinteilZuschlag,
        gesamtpreis: gesamtpreis
    };
}

// Zeigt die berechneten Preise und Zuschläge im HTML an
function aktualisierePreisanzeige(preisberechnung) {
    DOM.flaecheAnzeige.textContent = `${preisberechnung.flaecheQm.toFixed(2)} m²`;
    DOM.grundpreisAnzeige.textContent = `${preisberechnung.grundpreisProQm.toFixed(2)} €`;

    // Zuschläge-Überschrift und Positionen als Preiszeilen
    if (preisberechnung.zuschlagProQm > 0 && preisberechnung.zuschlagDetails.length > 0) {
        let zuschlagHtml = `<div class="preis-zeile zuschlag-header"><span>Zuschläge:</span><span></span></div>`;
        preisberechnung.zuschlagDetails.forEach(detail => {
            // Quadratmeter-Zeichen und Sonderzeichen im Regex korrekt escapen
            const match = detail.match(/^(.*?):\s*([+\-]?[0-9,.]+\s*€\/m²)$/);
            if (match) {
                zuschlagHtml += `<div class="preis-zeile"><span>${match[1]}:</span><span>${match[2]}</span></div>`;
            } else {
                zuschlagHtml += `<div class="preis-zeile"><span>${detail}</span></div>`;
            }
        });
        DOM.zuschlagAnzeige.innerHTML = zuschlagHtml;
        DOM.zuschlagZeile.style.display = 'flex';
        DOM.zuschlagAnzeige.title = preisberechnung.zuschlagDetails.join('\n');
    } else {
        DOM.zuschlagAnzeige.innerHTML = '— €';
        DOM.zuschlagZeile.style.display = 'none';
        DOM.zuschlagAnzeige.title = '';
    }

    // Kleinteil-Zuschlag anzeigen/verbergen
    if (preisberechnung.hatKleinteilZuschlag) {
        DOM.kleinteilZeile.style.display = 'flex';
    } else {
        DOM.kleinteilZeile.style.display = 'none';
    }

    // Gesamtpreis
    DOM.gesamtPreis.textContent = `${preisberechnung.gesamtpreis.toFixed(2)} €`;
}

// Setzt die Preisanzeige auf den Ausgangszustand zurück
function resetPreisanzeige() {
    DOM.flaecheAnzeige.textContent = '— m²';
    DOM.grundpreisAnzeige.textContent = '— €';
    DOM.zuschlagZeile.style.display = 'none';
    DOM.kleinteilZeile.style.display = 'none';
    DOM.gesamtPreis.textContent = '— €';
}

// Zeigt eine Fehlermeldung im HTML an
function zeigeFehlermeldung(fehler) {
    const meldungen = Array.isArray(fehler) ? fehler : [fehler];
    DOM.fehlerMeldung.innerHTML = meldungen.map(f => `• ${f}`).join('<br>');
    DOM.fehlerMeldung.style.display = 'block';
}

// Blendet die Fehlermeldung aus
function verbergeFehlermeldung() {
    DOM.fehlerMeldung.style.display = 'none';
}

// Setzt das gesamte Formular und die Anzeige zurück
function resetKonfigurator() {
    // Typ zurücksetzen
    const vollmassivRadio = document.querySelector('input[name="typ"][value="vollmassiv"]');
    if (vollmassivRadio) {
        vollmassivRadio.checked = true;
    }

    // Select-Felder zurücksetzen
    [DOM.formSelect, DOM.staerkeSelect, DOM.rissanteilSelect, DOM.farbeSelect, DOM.finishSelect].forEach(select => {
        if (select) {
            select.selectedIndex = 0;
        }
    });

    // Input-Felder leeren
    [DOM.breiteInput, DOM.laengeInput].forEach(input => {
        if (input) {
            input.value = '';
        }
    });

    // Checkbox zurücksetzen
    if (DOM.verfuelltCheckbox) {
        DOM.verfuelltCheckbox.checked = false;
    }

    // Anzeige zurücksetzen
    resetPreisanzeige();
    verbergeFehlermeldung();

    // Stärken-Verfügbarkeit aktualisieren
    updateStaerkenVerfuegbarkeit();

    // Preview zurücksetzen
    updateFormPreview();
    updateFarbePreview();
}

// Zeigt das passende Vorschaubild für die gewählte Form an
function updateFormPreview() {
    const gewaehlteForm = DOM.formSelect.value;

    if (gewaehlteForm) {
        // Bildname basierend auf ausgewählter Form
        const bildMap = {
            'gerade': 'gerade-kante.jpg',
            'facette': 'facettenkante.webp',
            'baumkante': 'mit-baumkante.jpg',
            'bohlen': 'durchgaengige-bohlen.jpg',
            'querfries': 'mit-querfriess.jpg',
            'rund': 'rund.jpg',
            'oval': 'oval.jpg'
        };

        const bildName = bildMap[gewaehlteForm];
        if (bildName) {
            DOM.formPreview.innerHTML = `<img src="images/${bildName}" alt="${DOM.formSelect.options[DOM.formSelect.selectedIndex].text}" class="preview-image">`;
        }
    } else {
        DOM.formPreview.innerHTML = '';
    }
}

// Zeigt das passende Vorschaubild für die gewählte Farbe an
function updateFarbePreview() {
    const gewaehlteFarbe = DOM.farbeSelect.value;

    if (gewaehlteFarbe) {
        // Bildname basierend auf ausgewählter Farbe
        const bildMap = {
            'natura': 'natura.jpg',
            'alte-eiche': 'alte-eiche.webp',
            'eiche-dunkel': 'eiche-dunkel.jpg',
            'hellgrau': 'hellgrau-geoelt.jpg',
            'dunkelgrau': 'dunkelgrau-geoelt.jpg',
            'weiss-geoelt': 'weiss-geoelt.webp',
            'weiss-gekaelkt': 'weiss-gekaelkt.jpg'
        };

        const bildName = bildMap[gewaehlteFarbe];
        if (bildName) {
            DOM.farbePreview.innerHTML = `<img src="images/${bildName}" alt="${DOM.farbeSelect.options[DOM.farbeSelect.selectedIndex].text}" class="preview-image">`;
        }
    } else {
        DOM.farbePreview.innerHTML = '';
    }
}

// Sorgt dafür, dass eine Funktion erst nach einer kurzen Pause ausgeführt wird (Performance)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Startet die Anwendung, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', initKonfigurator);