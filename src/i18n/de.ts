import { Content } from "./content-types";

export const de: Content = {
	map: {
		attribution: {
			mapbox: {
				href: "https://www.mapbox.com/about/maps/",
				label: "© Mapbox",
			},
			openStreetMap: {
				href: "https://www.openstreetmap.org/copyright",
				label: "© OpenStreetMap",
			},
			improve: {
				href: "https://www.mapbox.com/map-feedback",
				label: "**Diese Karte verbessern**",
			},
			feedback: {
				href: "https://citylabberlin.typeform.com/to/kCdnCgvC#product_id=GdK",
				label: "Feedback",
			},
			imprint: {
				href: "https://www.technologiestiftung-berlin.de/de/impressum/",
				label: "Impressum",
			},
			privacy: {
				href: "https://www.technologiestiftung-berlin.de/de/datenschutz/",
				label: "Datenschutz",
			},
		},
	},
	locationSearch: {
		placeholder: "Suche nach einer Adresse",
	},
	legend: {
		title: "Legende",
		greenTrees: "Versorgte Bäume",
		yellowTrees: "Mässig versorgte Bäume",
		orangeTrees: "Giessbedürftige Bäume",
		grayTrees: "nicht dem Filter entsprechend",
	},
	navbar: {
		map: "Karte",
		profile: {
			sidebarLabel: "Profil",
			title: "Dein Profil",
			overview: {
				subtitle: "Deine Übersicht",
				irrigations: "Giessungen",
				liter: "Liter",
				adoptedTrees: "Adoptierte Bäume",
			},
			adoptedTrees: {
				subtitle: "Adoptierte Bäume",
				irrigationTimes: "Mal",
				irrigationAmount: "Liter",
				showAll: "Alle anzeigen",
				showLess: "Weniger anzeigen",
				noAdoptedTreesMessage:
					"Wenn Du einen Baum regelmässig giesst, kannst Du ihn adoptieren. Deine adoptierten Bäume erscheinen hier in Deiner Profilübersicht.",
			},
			settings: {
				subtitle: "Profildetails",
				username: "Benutzername",
				yourUsername: "Dein Benutzername",
				editUsername: "Neuer Benutzername",
				placeholderUser: "Dein Benutzername",
				email: "E-Mail",
				yourEmail: "Deine E-Mail Adresse",
				editEmail: "Neue E-Mail Adresse",
				placeholderMail: "xyz@ts.berlin",
				updateEmailEmailSentTitle: "E-Mail gesendet!",
				updateEmailEmailSentMessage:
					"Wir haben an Deine neue E–Mail Adresse einen Bestätigungslink zum Ändern Deiner Email gesendet. Checke Dein Postfach!",
				password: "Passwort",
				changePassword: "Passwort ändern",
				newPassword: "Neues Passwort",
				passwordChangeConfirmationTitle:
					"Dein Passwort wurde erfolgreich geändert!",
				passwordChangeConfirmationMessage:
					'Klicke auf "OK" um zu Deinem Profil zu gelangen.',
				passwordChangeWithoutRecoveryLinkTitle:
					"Es ist ein Fehler aufgetreten.",
				passwordChangeWithoutRecoveryLinkMessage:
					"Hinweis: Diese Seite kann nur aufgerufen werden, wenn zuvor der Passwort-Zurücksetzen Link in der E-Mail angeklickt wurde.",
				passwordChangeWithoutRecoveryLinkLinkLabel: "Zurück zur Startseite",
				pleaseWait: "Einen Moment Geduld bitte...",
				deleteAccount: "Account löschen",
				confirmDelete: "Löschen",
				approve: "Fertig",
				checkInput: "Bitte überprüfe Deine Eingabe",
				usernameShould: "Dein Benutzername muss: ",
				usernameLength: "mindestens 3-50 Zeichen lang sein",
				onlyNumberAndLetters: "und nur aus Buchstaben oder Zahlen bestehen",
				usernameTaken: "Dieser Benutzername ist bereits vergeben",
				backToLogin: "zurück zum Login",
				register: "Registrieren",
				confirmEmailTitle: "Account bestätigen",
				confirmEmail: (email: string) =>
					`Überprüfe Dein E-Mail-Postfach für ${email} auf eine E-Mail zur Bestätigung Deines Accounts.`,
				existingAccount: "Du hast schon einen Account?",
				logIn: "Melde Dich an",
				passwordShould: "Dein Passwort muss enthalten:",
				passwordLength: "mindestens 8 Zeichen",
				passwordUpperAndLowerCase: "Klein- und Grossbuchstaben",
				passwordSpecialChar: "mindestens ein Sonderzeichen",
				passwordNumber: "mindestens eine Zahl",
				logInShort: "Anmelden",
				missingAccount: "Du hast noch keinen Account?",
				registerNow: "Registriere Dich",
				forgotYourPassword: "Passwort vergessen?",
				ohNoforgotYourPassword: "Oh nein. Du hast Dein",
				passwordForgotten: "Passwort vergessen",
				resetPasswordEmailSentTitle: "E-Mail gesendet!",
				resetPasswordEmailSentMessage:
					"Wir haben Dir eine E-Mail zum Ändern Deines Passworts gesendet. Checke Dein Postfach!",
				clickHere: "Hier klicken",
				resetPassword: "Passwort zurücksetzen",
				invalidCredentials: "Falsches Passwort oder E-Mail Adresse",
				deleteAccountConfirm: "Willst Du Deinen Account wirklich löschen?",
				cancel: "Abbrechen",
				save: "Speichern",
				confirm: "OK",
			},
			logOut: "Ausloggen",
			showPassword: "Zeigen",
			hidePassword: "Verbergen",
		},
		info: "Info",
	},
	notFound: {
		title: "404 - Seite wurde nicht gefunden",
	},
	info: {
		infoTitel: "Info",
		about: {
			head: {
				question: "Über das Projekt",
				answer: `Die Folgen des Klimawandels, insbesondere die trockenen und heissen Sommer, belasten das Zürcher Ökosystem. Unsere Stadtbäume vertrocknen und tragen langfristige Schäden davon: In den letzten Jahren mussten immer mehr Bäume gefällt werden und ihre Lebensdauer sinkt. Inzwischen wird die Bevölkerung regelmässig zur Unterstützung aufgerufen, allerdings weitgehend unkoordiniert. Dies möchten wir ändern und mit diesem Projekt eine koordinierte Bürger*innenbeteiligung bei der Bewässerung städtischen Grüns ermöglichen.`,

				aboutUsTitle: "Über uns",
				aboutUsAnswer: `„Güss dis Quartier” ist eine Zürcher Adaption der Open-Source-Plattform [Giess den Kiez](https://github.com/technologiestiftung/giessdenkiez-de).`,
				press:
					"Presseanfragen können über die Kontaktdaten im Impressum gestellt werden.",
				communityTitle: "Community",
				communityAnswer:
					"Du möchtest ein Problem melden oder Feedback geben? Nutze den Issue-Tracker des Projekts.",
				slackButton: "GitHub Issues öffnen",
				feedback: `Du hast **Feedback** zu *Güss dis Quartier*?

[Teile Dein Feedback auf GitHub](https://github.com/aiviemarketing/guess-dis-quartier/issues)`,
			},
			qa: [
				{
					question: "Nützliche Links",
					answer: `[Lieblingsbauminiative (Berlin)](https://www.lieblingsbaum-initiative.de/)

[Stadtbaumkampagne (SenMVKU Berlin)](https://www.berlin.de/senuvk/umwelt/stadtgruen/stadtbaeume/kampagne/start.shtml)

[Bewässerungsempfehlung für Stadtbäume (Pflanzenschutzamt Berlin)](https://www.berlin.de/pflanzenschutzamt/stadtgruen/beratung/bewaesserungsempfehlung-fuer-stadtbaeume/)

[Giessen bei Trockenheit (Baumpflegeportal)](https://www.baumpflegeportal.de/baumpflege/trockenheit-duerre-wann-baeume-giessen/)

[Stadtbäume - Bedeutung und Herausforderungen in Zeiten des Klimawandels (HCU Hamburg)](https://www.hcu-hamburg.de/fileadmin/documents/REAP/files/Bildungsmaterial_Stadtbaeume_im_Klimawandel_2017.pdf)

[Funktionen von Stadtbäumen (Bund Naturschutz e.V.)](https://www.bund-naturschutz.de/natur-und-landschaft/stadt-als-lebensraum/stadtbaeume/funktionen-von-stadtbaeumen.html)`,
				},
				{
					question: "Datenquellen",
					answer: `Die Karte zeigt die 81'127 aktuell importierten Zürcher Strassen- und Anlagenbäume. Zusätzlich wird abgebildet, wie viel Niederschlag in den letzten 30 Tagen bei jedem Baum gefallen ist und ob diese in der Zeit bereits gegossen wurden. Aus verschiedenen Gründen sind leider noch nicht alle Zürcher Stadtbäume aufgeführt. Wir arbeiten aber daran, die Datenlage zu verbessern und eine möglichst vollständige Darstellung des Zürcher Baumbestandes zu erreichen. Die aktuellen Datenquellen sind:

[Stadt Zürich Open Data / Baumkataster](https://data.stadt-zuerich.ch/dataset/geo_baumkataster)

[Direkter GeoJSON-Download (WGS84)](https://www.stadt-zuerich.ch/geodaten/download/Baumkataster?format=10009)

Regendaten von [Deutscher Wetterdienst](https://www.dwd.de/)

Pumpen aus [Open Street Map](https://www.openstreetmap.de)`,
				},
			],
		},
		faq: {
			title: "F.A.Q.",
			description:
				"Basierend auf dem regen Austausch unserer Community auf Slack & euren Rückmeldungen per Email und Telefon, haben wir ein kleines FAQ angelegt. Hier werden die am häuftigsten gestellten Fragen beantwortet.",
			qa: [
				{
					question: "Wie kann ich mitmachen?",
					answer: `
Informieren:

Neugierig, welcher Baum vor Deiner Tür steht? Unsere interaktive Karte visualisiert über 80'000 Strassen- und Anlagenbäume Zürichs. Wenn Du mehr über einen Baum erfahren willst, navigiere und zoome Dich zum gewünschten Standort und klicke auf den farbigen Punkt. Nun werden Dir im Menüband links zahlreiche Informationen zum ausgewählten Baum angezeigt.

Bäume bewässern und adoptieren:

Du möchtest aktiv werden oder bist bereits aktiv am Giessen? Auf Güss dis Quartier kannst Du eintragen, ob und mit wie viel Wasser Du einen Baum gegossen hast. Bäume können auch adoptiert werden. Die adoptierten Bäume erscheinen im eigenen Nutzerprofil und können schneller wiedergefunden werden. So können andere Nachbarn in der Umgebung sehen, welche Bäume ihre Aufmerksamkeit benötigen. Um Bäume zu bewässern und zu adoptieren, lege dazu zunächst ein Profil mit einer gültigen Email-Adresse an und logge Dich im Anschluss ein. Nun kannst Du Deine Giess-Aktionen entsprechend dokumentieren und sehen, ob und wie oft Bäume in Deinem Kiez bereits von anderen Nutzer:innen gegossen wurden.

Vernetzen:

Über unseren öffentlichen [GitHub Issues](https://github.com/aiviemarketing/guess-dis-quartier/issues) kannst Du Dich mit anderen Giesser:innen austauschen und defekte Pumpen in Deinem Kiez melden.`,
				},
				{
					question:
						"Was kann ich tun, wenn Bäume nicht richtig eingetragen sind?",
					answer:
						"Wir beziehen den Baum-Datensatz mit allen Attributen wie bspw. Adresse, Baumart und Pflanzjahr je Baum aus dem Geoportal der Stadt Berlin, dem FIS-Broker. Das im Geoportal bereitgestellte Baumkataster basiert wiederum auf den bezirklich aggregierten Daten der Strassen- und Grünflächenämter. Es kann daher immer wieder vorkommen, dass Daten von Bäumen veraltet sind oder Eigenschaften der tagesaktuellen Realität abweichen. Leider können wir selbst keine Änderungen im Baumkataster vornehmen. Etwaige Abweichungen können nur direkt bei der zuständigen bezirklichen Behörde gemeldet werden. Einmal im Jahr veröffentlichen die Grünflächenämter aber ein aktualisiertes Baumkataster, das wir nach Veröffentlichung mit Güss dis Quartier verknüpfen.",
				},
				{
					question: "Warum sollte ich aktiv werden und Bäume giessen?",
					answer: `Die langanhaltenden Dürre- und Hitzeperioden der letzten zwei Jahre haben dem Stadtgrün Berlins immens zugesetzt. Wenngleich nicht nur auf Trockenschäden zurückzuführen, mussten allein im Zeitraum zwischen 2018 und 2019 über 7.000 Bäume gefällt werden.
Die Strassen- und Grünflächenämter giessen regelmässig mehrere tausend Bäume, kommen allerdings mit dem Giessen während Zürcher Hitze-Sommern nicht hinterher. Da die Grünflächenämter bezirklich organisiert sind, arbeitet jeder Bezirk etwas anders, sodass eine ganzheitliche und bedarfsgerechte Koordination durchaus mit Hürden verbunden ist. Durch die Plattform möchten wir auch Bürger:innen die Möglichkeit geben, Bäumen gezielt auf Grundlage ihrer aktuellen Wasserversorgung zu helfen und sich zu informieren. Ziel ist es, möglichst viele Bäume durch nachbarschaftliches Engagement zu retten.`,
				},
				{
					question: "Wie giesse ich richtig?",
					answer: `
Je nach Alter, Standort und Baumart benötigen Bäume unterschiedlich viel Wasser. Insbesondere Jungbäume (0-10 Jahre) sind in Zeiten von Trockenheit, Strahlung und Hitze auf eine regelmässige Wässerung angewiesen. Die Grünstadt Zürich versorgen Jungbäume in der Regel bis zu einem Alter von 5 Jahren, wodurch besondern Junbäume im Alter zwischen 5 und 10 Jahren unsere Aufmerksamkeit benötigen.

Vor jeder Giessung solltet ihr euch den Baum zunächst anschauen und überlegen ob der Baum wirklich Wasser benötigt. Wichtige Indikatoren für bedarfsgerechtes giessen sind bspw. das Alter (jung/alt), der Stammunfang (dünn/dick), der Standort (sonnig/schattig) oder die Beschaffenheit frischer Triebe (kahl/grün) eines Baumes. Bevor ihr mit dem giessen loslegt, empfehlen wir den ausgetrockneten Boden vor dem Giessen aufzulockern, sodass das Wasser in den Boden eindringen kann und nicht oberirdisch abläuft oder sich falsch anstaut. Angelehnt an das Zürcher [Handbuch Gute Pflege](https://www.berlin.de/sen/uvk/natur-und-gruen/stadtgruen/pflegen-und-unterhalten/handbuch-gute-pflege), solltet ihr lieber selten, dafür mit grösseren Menge an Wasser zu giessen. Das Handbuch empfiehlt für frisch gepflanzte Bäume bis zu 200l pro Giessung. So sorgt ihr dafür, dass die Bodenfeuchte auch in der Tiefe erhöht wird.
Auch zu empfehlen sind sogenannte Giesssäcke aus denen das Wasser nur sehr langsam austritt, kaum oberflächlich abläuft und somit kontinuierlich in den Boden sickert.
					`,
				},
				{
					question: "Wie gehe ich mit der Wasserknappheit um?",
					answer: `In Zeiten von Trockenheit und Wasserknappheit ist es besonders wichtig, sparsam mit Wasser umzugehen. Wenn Du Deinen Baum giessen möchtest, dann frage dich zunächst immer, welcher Baum den grössten Bedarf hat. Giesse lieber seltener, dafür aber mit grösseren Mengen Wasser. So wird der Baum dazu angeregt, tiefere Wurzeln zu bilden und ist besser gegen Trockenheit gewappnet. Um eine Übersicht über aktuelle Bodenfeuchte in Berlin zu bekommen, lohnt sich ein Blick in die [Bewässerungsempfehlung für Stadtbäume](https://www.berlin.de/pflanzenschutzamt/stadtgruen/beratung/bewaesserungsempfehlung-fuer-stadtbaeume/) des Pflanzenschutzamt Berlins. Versuche das Wasser der öffentlichen Strassenpumpen, statt Trinkwasser aus der Hausleitung zu nutzen. Langfristig lohnt es sich, Regenwasser aufzufangen und in Regentonnen zu speichern. Nachbarschatsinitiativen wie [Wassertanke](https://wassertanke.org/) helfen Euch bei deratigen Nachbarschaftsprojekten.`,
				},
				{
					question:
						"An wen kann ich mich wenden, wenn Pumpen kaputt oder beschädigt sind?",
					answer: `Für die Infrastruktur der Strassen, zu denen auch die öffentlichen Schwengelpumpen zählen, sind die jeweiligen Strassen- und Grünflächenämter der Bezirke verantwortlich. Sollten Pumpen kaputt oder beschädigt sein, kann dort Reparaturbedarf gemeldet werden. Die Standorte der Pumpen in der Karte laden wir wöchentlich aus der Datenbank von Open Street Map. Wenn Ihr helfen wollt, die Daten zu verbessern, indem ihr zum Beispiel eine defekte Pumpe meldet, könnt ihr das in unserem [GitHub Issues #pumpen-melden](https://app.slack.com/client/T012K4SDYBY/C019SJQDPL7) tun. Die OSM-Community hat dann die Möglichkeit eure Informationen in die Datenbank einzutragen.`,
				},
				{
					question: "Wie wird mit technischen Problemen umgegangen?",
					answer: `Bei der Beteiligungsplattform „Güss dis Quartier” handelt es sich um einen Prototypen und demnach um eine Beta-Version einer Web-App. Wir sind uns einigen technischen Hürden bewusst, sind aber auf eure Mithilfe angewiesen. Euer technisches Feedback und eure Fragen nehmen wir gerne in unserem [GitHub Issues](https://github.com/aiviemarketing/guess-dis-quartier/issues) oder per Mail entgegen. Wer sich in der „Tech-Welt” zu Hause fühlt, ist herzlich zur Mitarbeit in unserem [Open Source GitHub Repository](https://github.com/aiviemarketing/guess-dis-quartier) eingeladen und kann seine Issues oder Code Fixes direkt in das Repository kommentieren.`,
				},
				{
					question: "Warum lädt die Website nicht oder nur sehr langsam?",
					answer: `Wenn die Seite zum ersten Mal geöffnet wird, lädt der Browser über 900.000 Datenpunkte – das kann eine Weile dauern! Unabhängig davon, kann es zu leicht unterschiedlichen Darstellungen bei der Verwendung unterschiedlicher Browser kommen. Für die beste „Experience” empfehlen wir die Nutzung von Chrome oder Firefox Desktop. Die häufigsten Probleme lassen sich erfahrungsgemäss beseitigen, wenn der Browser nicht veraltet, respektive die neueste Version installiert ist und eine stabile Internetverbindung (LAN oder WLAN) besteht. Die Nutzung über das Smartphone (Mobilfunknetz) kann zu Performance-Problemen (Seite lädt langsam) führen. Sollten wiederholt Probleme auftreten, könnt ihr diese in unserem [GitHub Issues](https://github.com/aiviemarketing/guess-dis-quartier/issues), per Mail oder via GitHub Issue unter Angabe des benutzten Geräts, des Betriebssystems, des Browsers und Version des Browsers melden.`,
				},
				{
					question:
						"Was tun, wenn ich fälschlicherweise eine Giessung eingetragen habe?",
					answer:
						"Um eine Giessung rückgängig zu machen, weil bspw. stattdessen der Nachbarbaum oder zu einem anderen Tag gegossen wurde, klicke zunächst auf den Baum. Scrolle in der Seitenleiste des Baumes runter bis zur Ansicht der vergangenen Giessungen, klicke auf das Papierkorb-Symbol neben dem Eintrag, den Du löschen möchtest und klicke auf „Löschen”, um zu bestätigen. Es können nur Giessungen gelöscht werden, die Du selbst vorgenommen hast. Trage nach der Löschung die Giessung mit den richtigen Angaben (Anzahl an Litern und Zeitpunkt) ein.",
				},
				{
					question: "Ist das Prinzip auf andere Städte übertragbar?",
					answer: `Die „Güss dis Quartier” Plattform ist ein Open Source Software Projekt und läuft unter einer MIT Lizenz. Dementsprechend kann die Idee, aber auch der Quellcode für die Umsetzung in anderen Städten kostenlos genutzt und weiterentwickelt werden. Wenn Du Dich dafür interessierst, schau gerne in unserem [Open Source GitHub Repository](https://github.com/aiviemarketing/guess-dis-quartier) vorbei oder kontaktiere uns via Mail. Wir unterstützen Deine Stadt auch gerne bei der technischen Umsetzung mit [DeineStadtgiesst](https://deinestadt.giessdenkiez.de/).`,
				},
				{
					question: "Ich habe immer noch eine Frage!",
					answer: `Das FAQ konnte Dir nicht weiterhelfen oder Du hast eine komplexere Anfrage? Dann [eröffne ein GitHub Issue](https://github.com/aiviemarketing/guess-dis-quartier/issues).`,
				},
				{
					question: "Warum werden nicht alle Bäume Berlins angezeigt?",
					answer:
						"Güss dis Quartier baut auf dem Baumkataster auf. Das Baumkataster ist ein Verzeichnis der Stadt, in dem (Stadt-/Strassen- oder Park-)Bäume verwaltet werden und das durch die Strassen- und Grünflächenämter bereitgestellt wird. Das Strassen- und Grünflächenamt ist aber nicht für alle Bäume Berlins zuständig. Die Bäume im Plänterwald beispielsweise unterliegen dem Forstamt. Diese Bäume tauchen daher bei Güss dis Quartier nicht auf.",
				},
			],
		},
		share: {
			title:
				"Teile Güss dis Quartier mit Deinem Umfeld und hilf uns die Giess-Community zu vergrössern:",
			content:
				"Auf Güss dis Quartier kannst Du Dich über den Zürcher Baumbestand erkundigen, durstige Bäume finden, und eintragen, wann Du diese gegossen hast!",
			openSource:
				"Güss dis Quartier ist ein [Open Source Projekt](https://github.com/aiviemarketing/guess-dis-quartier)!",
		},
		credits: {
			sponsoredAndOperatedBy: "Gesponsert und betrieben von",
			upstreamAttribution:
				"Basierend auf Gieß den Kiez von Technologiestiftung Berlin und CityLAB Berlin.",
		},
	},
	treeDetail: {
		title: "Bauminformationen",
		adoptIt: "Diesen Baum adoptieren",
		alsoAdoptedByOtherUsers: "Auch von anderen User:innen adoptiert",
		onlyAdoptedByOtherUsers: "Von anderen User:innen adoptiert",
		adoptLoading: "Baum wird adoptiert...",
		unadoptLoading: "Adoption wird aufgehoben...",
		isAdopted: "Du hast diesen Baum adoptiert",
		adoptHintTitle: "Baum adoptieren",
		adoptHint:
			"Wenn Du regelmässig den gleichen Baum giesst, kannst Du diesen adoptieren. So findest Du ihn schnell in Deiner Profilübersicht wieder.",
		adoptErrorMessage:
			"Fehler beim Adoptieren des Baumes. Bitte versuche es erneut.",
		adoptLoginFirst: "Logge Dich ein um diesen Baum zu adoptieren",
		ageTitle: "Standalter",
		age: (age: number) => `${age === 1 ? "Jahr" : "Jahre"}`,
		ageUnknown: "Unbekannt",
		treeTypeUnknown: "Baumart unbekannt",
		managedBy:
			"Dieser Baum wird bereits vom Bezirksamt versorgt und muss nicht gegossen werden.",
		waterNeed: {
			title: "Wasserbedarf",
			hintWinter:
				"Ausserhalb der Vegetationszeit (März-Oktober) benötigen die Bäume kein Wasser, sie sind quasi im Winterschlaf.",
			hint: "Je nach Baumalter unterscheidet sich der Bedarf an Wasser.",
			needXLiters: (liters: string) => `Braucht ca. ${liters} Liter pro Monat`,
			needsOnlyOnDryDays: "Braucht nur an trockenen Tagen Wasser",
			waterManaged: "Versorgt, nur in trockenen Phasen bedürftig",
			winterSleep: "Die Bäume sind derzeit im Winterschlaf",
			managedByGroundwater: "Grundwasser",
			unknownTitle: "Wasserbedarf **unbekannt**",
			unknown:
				"Das Alter dieses Baumes ist unbekannt und daher auch sein Wasserbedarf. Vielleicht helfen Dir die weiteren Informationen für eine eigenständige Einschätzung.",
			unknownShort: "Unbekannt",
			seniorTitle: "Braucht nur in trockenen Phasen Wasser",
			seniorExplanation:
				"Ältere Bäume können sich in der Regel über das Grundwasser selbst versorgen, aber bei zunehmender Hitze freuen auch sie sich über zusätzliches Wasser.",
			liters: "Liter",
			watered: "gegossen",
			covered: "versorgt",
			rained: "Regen",
			stillMissing: "fehlen noch",
			dataOfLastXDays: "* Daten der letzen 30 Tage",
			manager: "vom Bezirksamt",
			alreadyWateredByManager: "Bereits vom **Bezirksamt versorgt**",
			alreadyWateredByGroundwater: "Über das **Grundwasser versorgt**",
			winterNeedsNoWater: "Benötigt aktuell kein Wasser",
			stillWaterXLiters: (liters: string) => `
Noch

**${liters} Liter**

giessen`,
			shouldBeWatered: "Sollte gegossen werden",
			sufficientlyWatered: "Momentan ausreichend bewässert",
			readMore: "Mehr anzeigen",
			ageAndWaterHintTitle: "Wasserbedarf und Standalter",
			ageAndWaterHint: `
Insbesondere junge Bäume brauchen in den ersten Jahren Wasser. Lieber seltener, aber dafür viel.

**Unter 5 Jahren**: Wir sind frische Jungbäume und unser Durst wird vom bezirklichen Grünflächenamt gestillt.

**5-10 Jahre**: In dem Alter werden wir nicht mehr in allen Bezirken von der Verwaltung bewässert und sind noch keine „Selbstversorger“. Wir freuen uns gerade in trockenen Zeiten über Wasser - lieber seltener, aber viel auf einmal (ca. 100-200l pro Monat).

**Ältere Bäume (10+ Jahre)**: Wir können uns über das Grundwasser selbst versorgen.
`,
			ageAndWaterHintWinter: `
Wenn die Bäume im Herbst zunehmend ihre Blätter verlieren, reduzieren sich auch ihre photosynthetische Prozesse und sie benötigen weniger Energie – und deswegen auch weniger Wasser.
Mit dem offiziellen Ende der Vegetationsperiode neigt sich deshalb auch die Giesssaison dem diesjährigen Ende zu. Ab März geht es dann wieder los, und zwar volle Kanne!

**Wasserbedarf während der Vegetationsperiode (März-Oktober)**:

`,
			ageAndWaterHintSpecialDistrict: (
				babyAgeLimit: number,
				district: string,
			) => `
Insbesondere junge Bäume brauchen in den ersten Jahren Wasser. Lieber seltener, aber dafür viel.

Der Bezirk ${district} hat uns zusätzliche Informationen zur individuellen Giessstrategie zur Verfügung gestellt.

**Unter ${babyAgeLimit} Jahren**: Wir sind frische Jungbäume und unser Durst wird vom bezirklichen Grünflächenamt gestillt.

**Ältere Bäume (${babyAgeLimit}+ Jahre)**: Wir können uns über das Grundwasser selbst versorgen.
`,
			close: "Weniger anzeigen",
			lastXDaysYLitersWater: (days: number, liters: string) =>
				`Die letzten ${days} Tage wurden **${liters} Liter gegossen**.`,
			lastXDaysYLitersRain: (days: number, liters: string) =>
				`In den letzten ${days} Tagen sind **${liters} Liter Regen** gefallen.`,
			iWatered: "Ich habe gegossen",
			loginToWater: {
				login: "Logge Dich ein",
				toWater: "um eine Giessung einzutragen",
			},
			submitWatering: "Giessung eintragen",
			wateredHowMuch: "Gegossene Liter",
			wateredHowMuchPlaceholder: "Menge in L",
			wateredWhen: "Wann?",
			waterSave: "Speichern",
			waterCancel: "Abbrechen",
			wateringSuccessful: "Deine Giessung wurde eingetragen!",
		},
		lastWaterings: {
			deletedAccount: "Deaktivierter Account",
			title: "Letzte Giessungen",
			last30Days: "Letzte 30 Tage",
			nothingLast30Days: "Keine Giessungen in den letzten 30 Tagen",
			before: "Vorherige",
			nothingBefore: "Keine vorherigen Giessungen",
		},
		problem: {
			title: "Problem melden",
			description:
				"Du hast einen Baumschaden entdeckt, oder die Baumscheibe wird fehlgenutzt? Teile es dem Ordnungsamt mit:",
			link: "Zum offiziellen Formular",
		},
		treeTypeInfos: [
			{
				id: "LINDE",
				title: "Linde (Tilia)",
				description:
					"Die Linde gehört im Zürcher Baumkataster zu den häufigeren Gattungen. Mit einem Anteil von 5,2 % prägt sie den Baumbestand. Im Baumkataster sind 27 verschiedene Lindenarten erfasst. Bevorzugt gepflanzt wird die Winter-Linde (Tilia cordata), die als mittelgrosser Baum auch in schmaleren Strassen noch Raum findet. Die grosskronige Kaiserlinde (Tilia intermedia) ist dagegen den weiträumigen Alleen vorbehalten.",
			},
			{
				id: "AHORN",
				title: "Ahorn (Acer)",
				description:
					"Die Gattung der Ahorne umfasst 14,8 % des Gesamtbestandes. Für den Standort „Strasse” ist vor allem der Spitzahorn (Acer platanoides) geeignet. Die frühe Blüte und die bunte Herbstfärbung machen den Ahorn zu einer besonders beliebten Baumgattung.",
			},
			{
				id: "EICHE",
				title: "Eiche (Quercus)",
				description:
					"Der Anteil der Eichen beträgt 4,0 % des Gesamtbestandes. Die Stiel-Eiche (Quercus robur) ist die am häufigsten erfasste Eichenart im Zürcher Baumkataster. Als Lichtbaum ist die Eiche nicht für enge Strassen geeignet. Auch die Sumpf-Eiche (Quercus palustris) ist im Baumkataster erfasst und zeichnet sich durch ihre besonders schöne Herbstfärbung aus.",
			},
			{
				id: "PLATANE",
				title: "Platane (Platanus)",
				description:
					"Ein idealer Alleebaum für breite Strassen ist die Platane (Platanus acerifolia), die neben einer Höhe von 20 bis 30 m auch einen stattlichen Kronendurchmesser von 15 bis 20 m erreichen kann. Am Gesamtbestand haben die Platanen einen Anteil von 4,0 %.",
			},
			{
				id: "KASTANIE",
				title: "Kastanie (Aesculus)",
				description:
					"Die Kastanie (Aesculus) hat einen Anteil von 3,7 % am Gesamtbestand und belegt damit den elften Platz unter den im Zürcher Baumkataster erfassten Gattungen. Rosskastanien haben fünf- und mehrgliedrige Blätter, die an die Finger einer Hand erinnern; Esskastanien haben einzelne Blätter, die überdies deutlich gezackt sind.",
			},
			{
				id: "ROSSKASTANIE",
				title: "Rosskastanie (Aesculus hippocastanum)",
				description:
					"Die Rosskastanie (Aesculus hippocastanum) hat einen Anteil von 2,3 % am Gesamtbestand und ist damit die zehnthäufigste Art im Zürcher Baumkataster. Rosskastanien haben fünf- und mehrgliedrige Blätter, die an die Finger einer Hand erinnern; Esskastanien haben einzelne Blätter, die überdies deutlich gezackt sind.",
			},
			{
				id: "ESCHE",
				title: "Esche (Fraxinus)",
				description:
					"Die Esche (Fraxinus) hat einen Anteil von 4,2 % am Gesamtbestand und belegt damit den achten Platz unter den im Zürcher Baumkataster erfassten Gattungen. Mit einer Wuchshöhe von bis zu 40 m zählt sie zu den höchsten Laubbäumen Europas.",
			},
			{
				id: "BIRKE",
				title: "Birke (Betula)",
				description:
					"Die Birke (Betula) hat einen Anteil von 4,4 % am Gesamtbestand. Obwohl die Birke als Pionierbaum sehr anspruchslos und wachsend auf jedem Boden ist, eignet sie sich als Strassenbaum weniger, da die Baumscheiben oft zu wenig Raum für die Flachwurzler bieten.",
			},
			{
				id: "ROBINIE",
				title: "Robinie (Robinia)",
				description:
					"Die Robinie (Robinia) hat einen Anteil von 1,8 % am Gesamtbestand. Die Robinie stellt nur geringe Anforderungen an den Boden und kann dank der Knöllchenbakterien an ihren Wurzeln Luftstickstoff binden und damit den Boden aufdüngen.",
			},
			{
				id: "HASEL",
				title: "Hasel Baum (Corylus)",
				description:
					"Der Hasel Baum (Corylus) hat einen Anteil von 0,5 % am Gesamtbestand und belegt damit den 32. Platz unter den im Zürcher Baumkataster erfassten Gattungen. Die Haselnuss wächst als Strauch oder kleiner Baum bis zu 6 m hoch.",
			},
			{
				id: "HAINBUCHE",
				title: "Hainbuche (Carpinus)",
				description:
					"Der Anteil der Hainbuchen (Carpinus) beträgt 5,5 % des Gesamtbestandes. Der Baum erreicht eine Höhe von bis zu 25 m. Die Krone ist erst leicht kegelförmig und später weit ausladend.",
			},
			{
				id: "PAPPEL",
				title: "Pappel (Populus)",
				description:
					"Die Pappel (Populus) hat einen Anteil von 3,0 % am Zürcher Gesamtbestand. Sie haben eiförmige bis dreieckige, teils herzförmige Laubblätter.",
			},
			{
				id: "ULME",
				title: "Ulme (Ulmus)",
				description:
					"Der Anteil der Ulmen (Ulmus) beträgt 1,6 % des Gesamtbestandes. Es gibt bei uns drei der weltweit 45 Arten dieses sommergrünen Laubbaumes: die Bergulme, die Feldulme und die Flatter-Ulme. Sie kommt mit einer Höhe von bis zu 600 Metern vor und kann 250 Jahre alt werden.",
			},
		],
		treeTypeInfoTitle: "Baumsteckbrief",
	},
	filter: {
		title: "Filter",
		publicPumps: "Öffentliche Pumpen",
		myAdoptedTrees: "Meine adoptierten Bäume",
		allAdoptedTrees: "Adoptierte Bäume",
		lastWateredTrees: "Zuletzt gegossene Bäume",
		treeAge: "Baumalter",
		show: "Anzeigen",
		reset: "Zurücksetzen",
		treeAgeTitle: "Alterspanne der Bäume",
		years: "Jahre",
	},
	common: {
		defaultErrorMessage:
			"Ups, da ist etwas schief gelaufen. Bitte versuche es erneut.",
	},
	contact: {
		dialogTitle: (contactName: string) =>
			`**Sende eine E-Mail an *${contactName}***`,
		dialogDetail: (contactName: string, userMail: string) =>
			`Die E-Mail an *${contactName}* enthält automatisch Deine E-Mail-Adresse (*${userMail}*) sowie Deine Textnachricht:`,
		dialogPlaceholder: "Beschreibe kurz, warum Du Dich vernetzen möchtest...",
		dialogCancel: "Abbrechen",
		dialogSubmit: "Senden",
		dialogAlreadyContactedError: (contactName: string) =>
			`Du hast *${contactName}* bereits eine Kontaktanfrage gesendet.`,
		dialogAlreadyContactedExplanation:
			"Du hast dieser Person bereits eine Kontaktanfrage gesendet. Eine erneute Anfrage ist nicht möglich.",
		genericErrorTitle: "Kontaktanfrage nicht möglich",
		genericError: `Ups, da ist etwas schief gelaufen. Bitte versuche es erneut.`,
		dialogSuccess: (contactName: string) =>
			`Die Kontaktanfrage an *${contactName}* wurde versendet.`,
		dailyLimitError: "Tageslimit für Kontaktanfragen erreicht.",
		dailyLimitExplanation:
			"Du hast das Tageslimit von 3 Kontaktanfragen erreicht. Bitte versuche es morgen erneut.",
		containsUrlHint:
			" Bitte beachte, dass Deine Nachricht keine Links enthalten darf.",
		messageTooLongError: "Die Nachricht darf max. 200 Zeichen lang sein.",
		messageRestrictionsHint: (maxLength: number, message: string) =>
			`Noch ${Math.max(0, maxLength - message.length)} Zeichen übrig.`,
		loginFirst: "Einloggen für Kontaktanfrage",
		loginFirstReason:
			"Du kannst Personen nur eine Kontaktanfrage stellen, wenn Du eingeloggt bist.",
		loginFirstAction: "Logge Dich ein",
		confirm: "Alles klar!",
	},
	pumps: {
		title: "Öffentliche Strassenpumpe",
		status: "Status",
		lastCheck: "Letzter Check",
		update: "Status in OpenStreetMap aktualisieren",
		working: "Funktionsfähig",
		defect: "Defekt",
		unknown: "Unbekannt",
	},
	splash: {
		headline:
			"Die Zürcher Stadtbäume leiden unter Trockenheit und Du kannst ihnen helfen!",
		subheadlineWinter: `Derzeit sind die Bäume quasi im Winterschlaf und benötigen kein zusätzliches Wasser.
**Ab März startet die Giesssaison dann wieder, und zwar volle Kanne!**`,
		subheadline:
			"Erkundige Dich über den Wasserbedarf der Bäume in Deiner Nachbarschaft, adoptiere den Baum vor Deiner Haustür und werde Teil der aktiven Giess-Community in Zürich!",
		actionTitle: "Los geht's",
		actionTitleWinter: "Erkunden!",
		discoverTitle: "Entdecken",
		discoverContent:
			"Die Karte visualisiert über 80'000 Stadtbäume (Stand 2026) und zeigt Informationen zu Art, Alter und Wasserbedarf an. Nutze die Filter- und Suchfunktionen, um schnell einen Überblick zu erhalten.",
		waterTitle: "Giessen",
		waterContent:
			"Schnapp Dir eine Giesskanne und werde Teil der Giess-Community! Bereits über tausend Aktive haben sich für die Bäume Berlins zusammengeschlossen und tragen ihre Giessungen regelmässig ein.",
		adoptTitle: "Adoptieren",
		adoptContent:
			"Durch das Adoptieren eines Baumes - oder auch mehrerer - lässt Du Deine Nachbarschaft wissen, dass für diese Bäume gesorgt wird. So gelingt ein koordiniertes Engagement.",
		networkTitle: "Vernetzen",
		networkContent:
			"Tritt unserer WhatsApp Community bei, um Dich mit der Giess-Community zu vernetzen, Fragen auszutauschen und die Bewässerung in Deinem Quartier abzustimmen.",
		questionHeadline: "Güss dis Quartier auch in Deiner Stadt?",
		questionSubheadline:
			"Städte wie Berlin (auf dessen Plattform wir basieren), Leipzig und Co. haben sich bereits erfolgreich der Giess-Welle angeschlossen! Ist Deine Stadt die nächste?",
		discoverMoreTitle: "Erfahre mehr!",
		letsGo: "Los geht's",
	},
	loading: {
		mapLoading: "Wir laden gerade 81'127 Bäume aus dem Zürcher Baumbestand.",
		treeLoading: "Lade Bauminformationen...",
	},
	stats: {
		title: "Statistiken Zürich",
		subtitle: "Güss dis Quartier in Zahlen",
		streetTrees: "Stadtbäume",
		publicPumps: "Öffentliche Pumpen",
		activeUsers: "Aktive Giesser:innen",

		backToFront: "zurück",
		wateringsStat: {
			title: "Giessungen",
			unit: "mal",
			legend: "Anzahl der Giessungen",
			hint: (currentYear) => `wurde im Jahr ${currentYear} gegossen.`,
			backContent: `Die Giessaktivität variiert in den zwölf Zürcher Bezirken je nach ehrenamtlichem Engagement. In einigen Bezirken haben sich engagierte Anwohner:innen bereits zu Giessgruppen organisiert ([GitHub Issues](https://github.com/aiviemarketing/guess-dis-quartier/issues)).

Zudem ist der Bedarf der bezirklichen [Strassen- und Grünflächenamt (SGA)](https://www.berlin.de/ba-friedrichshain-kreuzberg/politik-und-verwaltung/aemter/strassen-und-gruenflaechenamt/) unterschiedlich. Um bestmöglich zu helfen, sollte man das zuständige SGA zuvor kontaktieren - und schon kann es losgehen.`,
		},
		wateringBehaviorStat: {
			title: "Giessverhalten",
			unit: "Liter",
			legend: `∑ Gegossene Liter pro Monat
`,
			watered: "gegossen",
			rain: "Regen",
			hint: () => `wurden insgesamt schon seit 2020 gegossen.`,
			backContent: `Über stolze 2 Millionen Liter wurden bereits ehrenamtlich gegossen!


“Je mehr desto besser” gilt jedoch nicht immer angesichts immer grösserer Wasserknappheit. Und das weiss die Zürcher Giess-Community natürlich, und ist daher hauptsächlich dann aktiv wenn die Bäume tatsächlich durstig sind: während der  Vegetationsperiode (April-Oktober) in besonders heissen trockenen Jahren.

Datenquelle: [Wetterdaten (DWD)](https://opendata.dwd.de/)`,
		},
		wateringAmountStat: {
			title: "Giessvolumen",
			unit: "Liter",
			legend: "Ø Liter pro Jahr",
			hint: (currentYear) =>
				`werden ${currentYear} durchschnittlich pro Giessung eingetragen.`,
			backContent: `“Je mehr desto besser” gilt hier eingeschränkt: viel auf einmal, aber nicht zu oft. Und auch das weiss die aktive Community bereits.

Eine Giessung sollte eher mehr als weniger Liter auf einmal beinhalten, damit sich das Wurzelwerk der durstigen Jungbäume nach unten ausbilden kann.

Aber Achtung! Jungbäume können auch überwässert werden. Mehr Informationen zur [Bewässerungsempfehlung für Stadtbäume](https://www.berlin.de/pflanzenschutzamt/stadtgruen/beratung/bewaesserungsempfehlung-fuer-stadtbaeume/).`,
		},
		treeSpeciesStat: {
			title: "Baumarten",
			unit: "Baumarten",
			hint: () => `stehen in Zürich.`,
			other: "Andere",
			legend: "Anteile Zürcher Baumbestand",
			backContent: `Zürich ist vielfältig - inklusive der Bäume!

Diese Übersicht zeigt die zwanzig häufigsten Arten, jeweils zusammengefasst nach der übergreifenden Gattung.

Die [Güss dis Quartier Karte](https://guess-dis-quartier.ch/map) zeigt 81'127 Zürcher Stadtbäume mit Infos zu Art, Alter und Wasserbedarf. Nutze die Filter und Suche, um mehr über die Bäume in Deiner Nachbarschaft zu erfahren.

Datenquelle: [Zürcher Baumkataster](https://data.stadt-zuerich.ch/dataset/geo_baumkataster)`,
		},
		adoptionStat: {
			title: "Baumadoptionen",
			unit: "Bäume",
			hint: () => `sind adoptiert.`,
			legend: "der adoptierten Bäume sind besonders durstig.",
			backContent: `Einen Baum auf Güss dis Quartier zu adoptieren zeigt, dass sich regelmässig um diesen gesorgt wird und erleichtert somit die nachbarschaftliche Koordination. Über tausende Bäume können sich also bereits glücklich schätzen.

Durstig sind vor allem Jungbäume (unter 10 Jahren). Diese werden in der Regel mind. bis zum fünften Jahr vom Grünflächenamt gegossen. “Besonders durstig” sind somit die **5 - 10 Jahre** alten Bäume.`,
		},
		gdKSalesPitch: `Erfahre mehr über *Güss dis Quartier*.

[Zum Projekt auf GitHub](https://github.com/aiviemarketing/guess-dis-quartier)`,
	},
};
