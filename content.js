(function () {
  const projects = [
    {
      id: "leefstijlgerichte-kansen-orthopedie",
      title: "Leefstijlgerichte kansen in de orthopedie",
      label: "NOV-project",
      summary:
        "Een project over teachable moments, patiëntperspectief en praktische handvatten om leefstijl zorgvuldig bespreekbaar te maken.",
      image: "assets/knee-anatomy-model-editorial.jpg",
      imageAlt: "Anatomisch kniemodel in een rustige spreekkamer",
      url: "projecten/leefstijlgerichte-kansen-orthopedie.html",
      featured: true,
    },
    {
      id: "transmuraal-tilburg-cohort",
      title: "Transmuraal Tilburg Cohort",
      label: "Transmurale zorg",
      summary:
        "Een digitaal transmuraal zorgpad voor artrose en obesitas, met aandacht voor ziekenhuiszorg, regio, leefstijl en evaluatie.",
      image: "assets/project-transmuraal-tilburg-cohort-editorial.jpg",
      imageAlt: "Multidisciplinair overleg over digitaal zorgpad, artrose en leefstijl",
      url: "projecten/transmuraal-tilburg-cohort.html",
      featured: true,
    },
    {
      id: "we-walk",
      title: "We Walk",
      label: "Digitale innovatie",
      summary:
        "Een project met Tilburg University over augmented reality, motivatie en bewegen voor patiënten met leefstijlgerelateerde artrose en ziekenhuismedewerkers.",
      image: "assets/project-we-walk-editorial.jpg",
      imageAlt: "Smartphone met AR-wandelroute op een rustige campus",
      url: "projecten/we-walk.html",
      featured: true,
    },
    {
      id: "3d-planning-voet-enkel",
      title: "3D-planning bij voet- en enkelchirurgie",
      label: "3D-planning",
      summary:
        "Van CT-gebaseerde planning naar patiënt-specifieke hulpmiddelen bij complexe voet- en enkelchirurgie.",
      image: "assets/article-3d-planning-lab.jpg",
      imageAlt: "3D-geprint voetmodel en planning in een ziekenhuislab",
      url: "projecten/3d-planning-voet-enkel.html",
      featured: true,
    },
  ];

  const articles = [
    {
      id: "footprint-quick-scan-medewerkers",
      title: "FOOTprint Quick Scan op 30 juni",
      label: "Preventie",
      summary: "Een laagdrempelige voetscreening voor ETZ-medewerkers door drs. Matthijs van Dam en schoentechnicus Joep van Buchrnhornen. De 35 beschikbare plekken zijn inmiddels gevuld.",
      image: "assets/article-footprint-quick-scan-editorial.jpg",
      imageAlt: "Voetscreening met werkschoenen, inlegzolen en voetmodel",
      url: "artikelen/footprint-quick-scan-medewerkers.html",
      date: "2026-06-30",
      audience: ["medewerkers"],
      topics: ["voet-en-enkel", "preventie"],
      archive: true,
    },
    {
      id: "patientpanel-leefstijl-orthopedie",
      title: "Online patiëntpanel over leefstijl en orthopedie",
      label: "Onderzoek",
      summary:
        "Voor maandag 29 juni 2026 zoeken we patiënten die online willen meedenken over duidelijke en respectvolle leefstijlinformatie.",
      image: "assets/knee-anatomy-model-editorial.jpg",
      imageAlt: "Anatomisch kniemodel in een rustige spreekkamer",
      url: "artikelen/patientpanel-leefstijl-orthopedie.html",
      date: "2026-06-29",
      audience: ["patienten"],
      topics: ["leefstijl", "onderzoek"],
      project: "leefstijlgerichte-kansen-orthopedie",
      archive: true,
    },
    {
      id: "heracleum-hulpfonds-subsidie-transmuraal-tilburg-cohort",
      title: "Heracleum Hulpfonds kent subsidie toe aan Transmuraal Tilburg Cohort",
      label: "Onderzoek",
      summary: "Over de subsidie voor de onderzoeksopzet en dataverzameling binnen het digitale zorgpad.",
      image: "assets/project-heracleum-logo.jpg",
      imageAlt: "Logo van het Heracleum Hulpfonds",
      imageContain: true,
      url: "artikelen/heracleum-hulpfonds-subsidie-transmuraal-tilburg-cohort.html",
      date: "2025-12-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek", "digitale-zorg"],
      project: "transmuraal-tilburg-cohort",
      archive: true,
    },
    {
      id: "we-walk-ar-campusroute-tilburg",
      title: "We Walk prototype: wandelen door een AR-route op de campus",
      label: "Digitale zorg",
      summary: "Over een door een Digital Sciences-student ontwikkeld AR-prototype voor een mogelijke campusroute.",
      image: "assets/project-we-walk-editorial.jpg",
      imageAlt: "Smartphone met AR-wandelroute op een rustige campus",
      url: "artikelen/we-walk-ar-campusroute-tilburg.html",
      date: "2025-10-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["leefstijl", "onderzoek", "digitale-zorg"],
      project: "we-walk",
      archive: true,
    },
    {
      id: "digitaal-zorgpad-artrose-obesitas",
      title: "Leefstijlcoalitie-voucher voor digitale artrosezorg in Tilburg",
      label: "Digitale zorg",
      summary: "Over de implementatievoucher voor een digitale en persoonlijke aanpak rond artrose en obesitas.",
      image: "assets/article-digital-care-pathway-editorial.jpg",
      imageAlt: "Tablet met digitaal zorgpad en knie-anatomiemodel in een spreekkamer",
      url: "artikelen/digitaal-zorgpad-artrose-obesitas.html",
      date: "2025-08-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek", "digitale-zorg"],
      project: "transmuraal-tilburg-cohort",
      archive: true,
    },
    {
      id: "vaillant-fonds-digitaal-zorgpad",
      title: "Vaillant Fonds ondersteunt verdere ontwikkeling digitaal zorgpad",
      label: "Digitale zorg",
      summary: "Over de bijdrage voor de verdere ontwikkeling van het digitale zorgpad binnen het Transmuraal Tilburg Cohort.",
      image: "assets/article-digital-care-pathway-editorial.jpg",
      imageAlt: "Tablet met digitaal zorgpad en knie-anatomiemodel in een spreekkamer",
      url: "artikelen/vaillant-fonds-digitaal-zorgpad.html",
      date: "2025-07-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek", "digitale-zorg"],
      project: "transmuraal-tilburg-cohort",
      archive: true,
    },
    {
      id: "revisie-artrodese-niet-vastgegroeid-patienten",
      title: "Niet vastgegroeide artrodese: wat betekent revisie-artrodese?",
      label: "Voet en enkel",
      summary:
        "Uitleg over pseudoartrose, een niet-vastgegroeide artrodese en hoe 3D-planning mogelijk kan helpen bij complexe revisiechirurgie van voet en enkel.",
      image: "assets/article-3d-planning-lab.jpg",
      imageAlt: "3D-geprint voetmodel en planning in een ziekenhuislab",
      url: "artikelen/revisie-artrodese-niet-vastgegroeid-patienten.html",
      date: "2025-06-01",
      audience: ["patienten"],
      topics: ["voet-en-enkel", "onderzoek"],
      project: "3d-planning-voet-enkel",
      archive: false,
    },
    {
      id: "patient-specifieke-instrumentatie-voet-enkel-professionals",
      title: "Patiënt-specifieke instrumentatie bij complexe voet- en enkelchirurgie",
      label: "Voet en enkel",
      summary:
        "Professionele duiding van 3D-planning, custom drill guides en schroefpositionering bij revisie-artrodese in gecompromitteerd bot.",
      image: "assets/article-3d-planning-lab.jpg",
      imageAlt: "3D-geprint voetmodel en planning in een ziekenhuislab",
      url: "artikelen/patient-specifieke-instrumentatie-voet-enkel-professionals.html",
      date: "2025-06-01",
      audience: ["zorgprofessionals"],
      topics: ["voet-en-enkel", "onderzoek"],
      project: "3d-planning-voet-enkel",
      archive: false,
    },
    {
      id: "aios-foot-education-munich",
      title: "AIOS-onderwijs voet en enkel in München",
      label: "Onderwijs",
      summary:
        "Persoonlijke terugblik op hands-on onderwijs voor orthopedie-aios over voet- en enkelchirurgie, techniek en klinisch redeneren.",
      image: "assets/article-aios-foot-education-munich.jpg",
      imageAlt: "Hands-on voet- en enkelonderwijs met anatomisch model in een skills lab",
      url: "artikelen/aios-foot-education-munich.html",
      date: "2025-09-19",
      audience: ["zorgprofessionals"],
      topics: ["voet-en-enkel", "onderwijs"],
      archive: false,
    },
    {
      id: "probleemgeorienteerd-denken-orthopedie-boekbijdrage",
      title: "Probleemgeoriënteerd denken in de orthopedie: bijdragen over voet en enkel",
      label: "Onderwijs",
      summary:
        "Korte toelichting op mijn bijdragen aan het leerboek over enkel- en voetanatomie en klinisch redeneren bij enkelklachten.",
      image: "assets/article-probleemgeorienteerd-denken-orthopedie-cover.jpg",
      imageAlt: "Cover van het leerboek Probleemgeoriënteerd denken in de orthopedie",
      url: "artikelen/probleemgeorienteerd-denken-orthopedie-boekbijdrage.html",
      date: "2026-06-12",
      audience: ["zorgprofessionals"],
      topics: ["voet-en-enkel", "onderwijs"],
      archive: false,
    },
    {
      id: "leefstijlzorg-tweede-lijn-professionals",
      title: "Leefstijlzorg in de tweede lijn: zorgvuldig signaleren en verbinden",
      label: "Leefstijl",
      summary: "Een genuanceerde beschouwing over signaleren, afbakenen en verwijzen binnen passende leefstijlzorg.",
      image: "assets/knee-anatomy-model-editorial.jpg",
      imageAlt: "Anatomisch kniemodel in een rustige spreekkamer",
      url: "artikelen/leefstijlzorg-tweede-lijn-professionals.html",
      date: "2025-05-01",
      audience: ["zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek"],
      archive: false,
    },
    {
      id: "mobility-clinic-tilburg-patienten",
      title: "Mobility Clinic Tilburg: knie-kraakbeenletsel",
      label: "Knie en kraakbeen",
      summary:
        "Patiëntgerichte uitleg over Mobility Clinic Tilburg, kraakbeenletsel van de knie en wanneer kraakbeenceltransplantatie kan worden besproken.",
      image: "assets/article-mobility-knee-cartilage-mvd.jpg",
      imageAlt: "Medische illustratie van kraakbeendefecten in de knie",
      url: "artikelen/mobility-clinic-tilburg-patienten.html",
      date: "2025-04-01",
      audience: ["patienten"],
      topics: ["knie-kraakbeen"],
      archive: false,
    },
    {
      id: "mobility-clinic-tilburg-professionals",
      title: "Mobility Clinic Tilburg: knie-kraakbeenletsel en transplantatie",
      label: "Knie en kraakbeen",
      summary:
        "Professionele achtergrond over Mobility Clinic Tilburg, knie-kraakbeenletsel, kraakbeenceltransplantatie en gespecialiseerde knie-kraakbeenzorg.",
      image: "assets/article-mobility-knee-cartilage-mvd.jpg",
      imageAlt: "Medische illustratie van kraakbeendefecten in de knie",
      url: "artikelen/mobility-clinic-tilburg-professionals.html",
      date: "2025-04-01",
      audience: ["zorgprofessionals"],
      topics: ["knie-kraakbeen"],
      archive: false,
    },
    {
      id: "artrosezorg-transitie-professionals",
      title: "Artrosezorg in transitie: wat vraagt dit van professionals?",
      label: "Artrose",
      summary:
        "Professionele duiding van het NTvG-artikel over educatie, oefentherapie, leefstijl, netwerkzorg en digitale monitoring.",
      image: "assets/knee-anatomy-model-editorial.jpg",
      imageAlt: "Anatomisch kniemodel in een rustige spreekkamer",
      url: "artikelen/artrosezorg-transitie-professionals.html",
      date: "2026-01-01",
      audience: ["zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek"],
      archive: false,
    },
    {
      id: "artrosezorg-transitie-patienten",
      title: "Artrosezorg in transitie: wat betekent dit voor patiënten?",
      label: "Artrose",
      summary:
        "Patiëntgerichte uitleg bij het NTvG-artikel over artrosezorg, bewegen, leefstijl en regionale samenwerking.",
      image: "assets/knee-anatomy-model-editorial.jpg",
      imageAlt: "Anatomisch kniemodel in een rustige spreekkamer",
      url: "artikelen/artrosezorg-transitie-patienten.html",
      date: "2026-03-12",
      audience: ["patienten"],
      topics: ["artrose", "leefstijl"],
      archive: false,
    },
  ];

  const painRegions = [
    {
      id: "grote-teen-mtp1",
      label: "Grote teen en teengewricht",
      shortDescription: "Pijn rond het grote-teengewricht of bij het afwikkelen.",
      relatedConditionIds: ["hallux-rigidus", "hallux-valgus", "jicht-podagra", "sesamoidklachten", "voorvoetcorrectie"],
      views: {
        top: { shape: "M300 115 C390 80 455 140 460 280 C465 425 402 535 302 520 C245 410 230 205 300 115 Z" },
        front: { shape: "M630 780 C700 720 790 720 845 790 C860 885 795 940 705 920 C630 900 585 840 630 780 Z" },
        sole: { shape: "M275 80 C390 35 465 110 455 250 C450 370 390 475 280 450 C220 335 215 165 275 80 Z" },
        medial: { shape: "M1260 655 C1415 600 1550 675 1580 795 C1450 880 1265 860 1145 770 C1145 715 1190 675 1260 655 Z" },
      },
    },
    {
      id: "kleine-tenen",
      label: "Kleine tenen",
      shortDescription: "Pijn, drukplekken of standsproblemen rond de kleine tenen.",
      relatedConditionIds: ["hamerteen-klauwteen", "morton-neuroom", "mtp-plantaire-plaatklachten", "tailors-bunion", "voorvoetcorrectie"],
      views: {
        top: { shape: "M455 110 C690 80 800 230 760 420 C650 395 530 350 455 290 Z" },
        front: { shape: "M735 770 C815 710 990 705 1060 770 C1070 845 995 895 860 895 C770 885 715 840 735 770 Z" },
        sole: { shape: "M450 110 C665 85 790 215 780 405 C665 420 520 365 450 280 Z" },
        lateral: { shape: "M1260 610 C1445 565 1585 640 1600 750 C1500 815 1305 800 1165 725 C1165 675 1200 635 1260 610 Z" },
      },
    },
    {
      id: "voorvoet-bovenzijde",
      label: "Bovenkant voorvoet",
      shortDescription: "Pijn bovenop de voorvoet of rond de middenvoetsbeentjes.",
      relatedConditionIds: ["metatarsalgie", "mtp-plantaire-plaatklachten", "voorvoetcorrectie"],
      views: {
        top: { shape: "M275 430 C410 350 690 380 770 540 C760 680 650 780 485 760 C340 750 260 630 275 430 Z" },
        front: { shape: "M595 555 C725 500 1015 500 1195 610 C1170 735 1010 815 805 795 C670 780 570 700 595 555 Z" },
        medial: { shape: "M880 480 C1090 430 1345 485 1495 620 C1320 700 1045 700 820 635 C790 575 810 510 880 480 Z" },
        lateral: { shape: "M825 460 C1055 410 1360 475 1505 620 C1335 700 1035 695 725 635 C690 565 720 495 825 460 Z" },
      },
    },
    {
      id: "middenvoet-bovenzijde",
      label: "Bovenkant middenvoet",
      shortDescription: "Pijn bovenop de middenvoet, soms bij belasting of na eerder letsel.",
      relatedConditionIds: ["tarsal-boss", "ganglion-middenvoet", "artrose-na-breuk", "stressreactie-stressfractuur", "lisfranc-middenvoetletsel", "revisie-artrodese", "holvoet-cavovarus"],
      views: {
        top: { shape: "M315 720 C455 645 665 670 745 810 C760 1050 640 1195 480 1185 C340 1175 275 1000 315 720 Z" },
        front: { shape: "M625 350 C740 290 990 290 1110 360 C1175 470 1125 595 950 625 C775 655 610 575 565 460 C565 410 585 375 625 350 Z" },
        medial: { shape: "M520 455 C725 390 990 430 1125 580 C1010 690 665 710 410 640 C380 555 420 490 520 455 Z" },
        lateral: { shape: "M465 430 C700 370 1010 420 1180 570 C1030 680 650 710 365 640 C345 545 380 470 465 430 Z" },
      },
    },
    {
      id: "wreef",
      label: "Wreef",
      shortDescription: "Pijn of druk op de wreef, bijvoorbeeld bij schoenen of hoge voetboog.",
      relatedConditionIds: ["tarsal-boss", "ganglion-middenvoet", "holvoet-cavovarus", "artrose-na-breuk"],
      views: {
        top: { shape: "M360 565 C465 515 645 525 720 650 C710 825 610 955 470 930 C350 905 305 720 360 565 Z" },
        front: { shape: "M630 300 C760 240 980 250 1105 340 C1160 470 1085 585 915 600 C745 615 600 535 565 430 C565 365 590 325 630 300 Z" },
        medial: { shape: "M600 420 C815 360 1085 430 1250 595 C1040 690 690 670 485 570 C480 500 520 450 600 420 Z" },
        lateral: { shape: "M575 405 C810 360 1080 425 1260 585 C1060 690 680 670 455 565 C450 485 495 430 575 405 Z" },
      },
    },
    {
      id: "voorvoet-onderzijde",
      label: "Onder de bal van de voet",
      shortDescription: "Pijn onder de bal van de voet of bij druk onder de voorvoet.",
      relatedConditionIds: ["metatarsalgie", "morton-neuroom", "mtp-plantaire-plaatklachten", "sesamoidklachten", "hallux-rigidus", "voorvoetcorrectie"],
      views: {
        sole: { shape: "M260 250 C410 95 720 160 775 420 C720 600 620 710 470 700 C330 690 240 535 260 250 Z" },
        medial: { shape: "M1030 650 C1210 600 1465 650 1580 790 C1435 875 1195 855 1010 765 C990 715 1000 675 1030 650 Z" },
        lateral: { shape: "M990 625 C1195 565 1475 625 1600 755 C1435 845 1175 830 965 735 C945 685 955 650 990 625 Z" },
      },
    },
    {
      id: "middenvoet-onderzijde",
      label: "Onder de middenvoet",
      shortDescription: "Pijn onder de middenvoet of aan de overgang naar de voetboog.",
      relatedConditionIds: ["peesplaatklachten-hielspoor", "platvoet-volwassen", "holvoet-cavovarus", "stressreactie-stressfractuur", "lisfranc-middenvoetletsel", "artrose-na-breuk"],
      views: {
        sole: { shape: "M320 610 C470 520 690 570 745 735 C710 930 590 1045 430 1000 C305 965 250 760 320 610 Z" },
        medial: { shape: "M500 690 C705 640 990 645 1145 720 C1015 790 690 800 440 750 C410 720 445 700 500 690 Z" },
        lateral: { shape: "M690 675 C900 625 1200 635 1375 720 C1225 790 900 800 650 750 C620 715 640 690 690 675 Z" },
      },
    },
    {
      id: "hiel-onderzijde",
      label: "Onder de hiel",
      shortDescription: "Pijn onder de hiel, vaak merkbaar bij staan of de eerste stappen.",
      relatedConditionIds: ["peesplaatklachten-hielspoor", "hielpijn", "vetkussen-hielklachten", "platvoet-volwassen"],
      views: {
        sole: { shape: "M340 1085 C460 1000 655 1000 750 1115 C805 1320 680 1485 515 1480 C360 1475 260 1300 340 1085 Z" },
        medial: { shape: "M130 720 C250 655 425 655 560 720 C470 835 260 845 115 775 C85 750 95 735 130 720 Z" },
        lateral: { shape: "M115 720 C250 655 440 655 575 720 C470 840 255 850 105 775 C75 750 85 735 115 720 Z" },
      },
    },
    {
      id: "binnenzijde-voetboog",
      label: "Binnenkant voetboog",
      shortDescription: "Pijn langs de binnenboog of bij een doorzakkende voetstand.",
      relatedConditionIds: ["tibialis-posterior-peesklachten", "peesplaatklachten-hielspoor", "platvoet-volwassen"],
      views: {
        medial: { shape: "M350 700 C565 650 980 655 1210 720 C1055 805 650 815 360 765 C325 742 325 720 350 700 Z" },
        sole: { shape: "M250 610 C360 560 430 620 460 780 C475 1020 420 1180 315 1215 C235 1050 210 760 250 610 Z" },
      },
    },
    {
      id: "binnenzijde-enkel",
      label: "Binnenkant enkel",
      shortDescription: "Pijn rond de binnenenkel of de pezen aan de binnenzijde.",
      relatedConditionIds: ["ganglion-enkel", "tibialis-posterior-peesklachten", "platvoet-volwassen", "enkelartrose", "kraakbeenletsel-enkel", "corpus-liberum-enkel", "artrose-na-breuk"],
      views: {
        medial: { shape: "M245 350 C330 215 560 220 655 385 C610 515 385 570 250 500 C205 455 210 395 245 350 Z" },
        heel: { shape: "M540 410 C630 345 760 365 810 455 C765 565 620 585 530 505 C500 470 505 435 540 410 Z" },
      },
    },
    {
      id: "buitenzijde-voet",
      label: "Buitenkant voet",
      shortDescription: "Pijn of druk aan de buitenrand van de voet.",
      relatedConditionIds: ["peroneuspeesklachten", "sinus-tarsi-klachten", "tailors-bunion", "holvoet-cavovarus", "artrose-na-breuk"],
      views: {
        front: { shape: "M970 690 C1065 670 1140 725 1150 805 C1115 875 1035 890 965 840 C930 770 940 715 970 690 Z" },
        lateral: { shape: "M1190 545 C1355 555 1495 630 1545 735 C1430 805 1260 800 1130 735 C1115 650 1135 585 1190 545 Z" },
        sole: { shape: "M720 410 C815 430 855 545 815 645 C730 695 650 655 625 550 C645 470 680 425 720 410 Z" },
      },
    },
    {
      id: "buitenzijde-enkel",
      label: "Buitenkant enkel",
      shortDescription: "Pijn aan de buitenzijde van de enkel, soms na verzwikken.",
      relatedConditionIds: ["enkelverzwikking", "chronische-enkelinstabiliteit", "ganglion-enkel", "peroneuspeesklachten", "sinus-tarsi-klachten", "kraakbeenletsel-enkel", "corpus-liberum-enkel", "anterieur-enkel-impingement", "enkelartrose", "artrose-na-breuk"],
      views: {
        lateral: { shape: "M245 350 C330 215 560 220 655 385 C610 515 385 570 250 500 C205 455 210 395 245 350 Z" },
        heel: { shape: "M970 405 C1025 370 1100 390 1130 455 C1100 525 1015 540 955 495 C930 455 935 425 970 405 Z" },
      },
    },
    {
      id: "voorzijde-enkel",
      label: "Voorkant enkel",
      shortDescription: "Pijn of inklemmingsgevoel aan de voorzijde van de enkel, bijvoorbeeld bij buigen of belasten.",
      relatedConditionIds: ["anterieur-enkel-impingement", "kraakbeenletsel-enkel", "corpus-liberum-enkel", "enkelartrose"],
      views: {
        top: { shape: "M300 1185 C430 1125 620 1135 730 1215 C710 1365 595 1440 455 1415 C330 1390 270 1295 300 1185 Z" },
        front: { shape: "M645 170 C755 105 970 100 1080 170 C1105 285 1035 365 865 370 C700 370 615 285 645 170 Z" },
        medial: { shape: "M455 340 C610 285 780 330 875 445 C830 535 635 560 470 500 C420 445 420 385 455 340 Z" },
        lateral: { shape: "M455 335 C620 280 800 330 900 450 C850 545 645 565 470 500 C420 445 420 385 455 335 Z" },
      },
    },
    {
      id: "achterzijde-enkel",
      label: "Achterkant enkel",
      shortDescription: "Pijn achter in de enkel, soms bij afzetten, sporten of diepe buiging.",
      relatedConditionIds: ["posterieur-enkel-impingement", "os-trigonum", "achillespeesklachten"],
      views: {
        heel: { shape: "M705 545 C780 495 905 495 965 550 C985 650 935 730 835 750 C735 740 685 650 705 545 Z" },
        medial: { shape: "M125 520 C250 455 445 480 560 585 C485 690 265 700 120 620 C90 585 95 550 125 520 Z" },
        lateral: { shape: "M110 520 C245 455 455 480 575 585 C495 695 260 705 110 620 C80 585 85 550 110 520 Z" },
      },
    },
    {
      id: "hiel-achterzijde",
      label: "Achterkant hiel",
      shortDescription: "Pijn achter op de hiel of bij de aanhechting van de achillespees.",
      relatedConditionIds: ["achillespeesklachten", "posterieur-enkel-impingement", "haglund-retrocalcaneaire-klachten", "hielpijn", "os-trigonum"],
      views: {
        heel: { shape: "M650 710 C670 620 990 610 1035 720 C1030 850 945 910 835 900 C720 895 635 835 650 710 Z" },
        medial: { shape: "M120 650 C260 575 470 590 590 700 C485 790 260 815 125 755 C95 715 95 675 120 650 Z" },
        lateral: { shape: "M105 650 C250 575 475 590 600 700 C490 790 255 815 110 755 C80 715 80 675 105 650 Z" },
      },
    },
    {
      id: "achillespees",
      label: "Achillespees",
      shortDescription: "Pijn in de achillespees of bij belasting achter de enkel.",
      relatedConditionIds: ["achillespeesklachten", "posterieur-enkel-impingement", "haglund-retrocalcaneaire-klachten", "os-trigonum"],
      views: {
        heel: { shape: "M675 0 C770 0 925 0 1010 0 C980 210 990 430 960 620 C910 690 760 690 705 620 C675 430 700 210 675 0 Z" },
        medial: { shape: "M245 0 C320 0 475 0 560 20 C525 205 525 360 555 485 C470 535 340 525 270 480 C300 330 285 170 245 0 Z" },
        lateral: { shape: "M235 0 C315 0 475 0 560 20 C525 200 525 360 555 485 C465 535 330 525 260 480 C290 330 275 170 235 0 Z" },
      },
    },
    {
      id: "onduidelijke-meerdere-plekken",
      label: "Meerdere of onduidelijke plekken",
      shortDescription: "Klachten die niet duidelijk op één plek zitten of op meerdere plekken spelen.",
      relatedConditionIds: ["algemene-voet-enkelinformatie", "corpus-liberum-enkel"],
      views: {
        top: { shape: "M270 470 C420 350 705 380 790 640 C785 990 655 1250 485 1240 C315 1230 240 930 270 470 Z" },
        front: { shape: "M610 135 C750 35 1010 35 1135 145 C1205 310 1235 515 1295 720 C1230 905 980 950 710 925 C560 870 520 705 555 500 C585 360 570 220 610 135 Z" },
        sole: { shape: "M250 360 C405 180 750 250 820 580 C780 1050 680 1485 515 1480 C335 1470 220 1030 250 360 Z" },
        medial: { shape: "M360 360 C620 240 1280 430 1510 650 C1260 820 520 835 180 720 C95 540 160 410 360 360 Z" },
        lateral: { shape: "M350 360 C630 240 1290 430 1510 650 C1260 820 520 835 180 720 C95 540 150 410 350 360 Z" },
        heel: { shape: "M610 50 C750 15 925 15 1050 55 C1045 235 1080 430 1160 550 C1135 735 1040 880 865 908 C700 920 585 785 555 600 C625 445 620 235 610 50 Z" },
      },
    },
  ];

  const footPainConditions = [
    {
      id: "algemene-voet-enkelinformatie",
      title: "Algemene voet- en enkelinformatie",
      excerpt: "Bij klachten op meerdere plekken is een visuele gids vaak te beperkt. Algemene informatie kan helpen om onderwerpen te herkennen, maar persoonlijke beoordeling loopt via de officiële zorgkanalen.",
      url: "behandelingen.html",
      painRegionIds: ["onduidelijke-meerdere-plekken"],
      tags: ["Algemeen", "Voet en enkel"],
    },
    {
      id: "hallux-valgus",
      title: "Hallux valgus",
      excerpt: "Scheefstand van de grote teen met pijn of schoenproblemen. Beoordeling hangt af van stand, druk, huid en eerdere maatregelen.",
      url: "behandelingen/hallux-valgus.html",
      painRegionIds: ["grote-teen-mtp1"],
      tags: ["Voorvoet", "Grote teen"],
    },
    {
      id: "hallux-rigidus",
      title: "Hallux rigidus",
      excerpt: "Artrose van het grote-teengewricht kan pijn geven bij afwikkelen. Mogelijke opties worden altijd gekoppeld aan onderzoek en beeldvorming.",
      url: "behandelingen/hallux-rigidus.html",
      painRegionIds: ["grote-teen-mtp1", "voorvoet-onderzijde"],
      tags: ["Voorvoet", "Artrose"],
    },
    {
      id: "jicht-podagra",
      title: "Jicht / podagra",
      excerpt: "Aanvallen van pijn, roodheid en zwelling rond de grote teen kunnen onder meer bij jicht passen. Dit vraagt beoordeling in de juiste context.",
      url: "behandelingen/jicht-podagra.html",
      painRegionIds: ["grote-teen-mtp1"],
      tags: ["Grote teen", "Ontsteking"],
    },
    {
      id: "hamerteen-klauwteen",
      title: "Hamerteen en klauwteen",
      excerpt: "Teenstandafwijkingen kunnen drukplekken, eelt of schoenproblemen geven. De aanpak is afhankelijk van soepelheid, huid en belasting.",
      url: "behandelingen/hamerteen-klauwteen.html",
      painRegionIds: ["kleine-tenen"],
      tags: ["Tenen", "Drukklachten"],
    },
    {
      id: "metatarsalgie",
      title: "Metatarsalgie",
      excerpt: "Pijn onder de bal van de voet kan samenhangen met drukverdeling, stand, schoenen of belasting. De oorzaak verschilt per persoon.",
      url: "behandelingen/metatarsalgie.html",
      painRegionIds: ["voorvoet-onderzijde", "voorvoet-bovenzijde"],
      tags: ["Voorvoet", "Drukklachten"],
    },
    {
      id: "morton-neuroom",
      title: "Morton neuroom",
      excerpt: "Een Morton neuroom kan pijn, tintelingen of uitstralende klachten richting tenen geven. Dit blijft een mogelijk leesonderwerp, geen diagnose.",
      url: "behandelingen/morton-neuroom.html",
      painRegionIds: ["voorvoet-onderzijde", "kleine-tenen"],
      tags: ["Voorvoet", "Tenen"],
    },
    {
      id: "mtp-plantaire-plaatklachten",
      title: "MTP- en plantaire plaatklachten",
      excerpt: "Pijn rond de basis van de tenen kan passen bij irritatie of instabiliteit rond het MTP-gewricht, maar vraagt altijd context.",
      url: "behandelingen/mtp-plantaire-plaatklachten.html",
      painRegionIds: ["kleine-tenen", "voorvoet-onderzijde", "voorvoet-bovenzijde"],
      tags: ["Voorvoet", "Tenen"],
    },
    {
      id: "tailors-bunion",
      title: "Tailor's bunion",
      excerpt: "Pijn of druk aan de buitenzijde van de voorvoet kan onder meer samenhangen met belasting rond het vijfde middenvoetsbeentje.",
      url: "behandelingen/tailors-bunion.html",
      painRegionIds: ["kleine-tenen", "buitenzijde-voet"],
      tags: ["Voorvoet", "Buitenzijde"],
    },
    {
      id: "sesamoidklachten",
      title: "Sesamoidklachten",
      excerpt: "Pijn onder het grote-teengewricht kan verschillende oorzaken hebben. Drukverdeling, afwikkeling en belasting zijn dan relevante aandachtspunten.",
      url: "behandelingen/sesamoidklachten.html",
      painRegionIds: ["grote-teen-mtp1", "voorvoet-onderzijde"],
      tags: ["Voorvoet", "Grote teen"],
    },
    {
      id: "voorvoetcorrectie",
      title: "Voorvoetcorrectie",
      excerpt: "Bij pijnlijke standsafwijkingen kan correctie van teenstand of middenvoetsbeentjes worden besproken na zorgvuldige indicatiestelling.",
      url: "behandelingen/voorvoetcorrectie.html",
      painRegionIds: ["grote-teen-mtp1", "kleine-tenen", "voorvoet-onderzijde", "voorvoet-bovenzijde"],
      tags: ["Behandeling", "Voorvoet"],
    },
    {
      id: "enkelverzwikking",
      title: "Enkelverzwikking",
      excerpt: "Na een verzwikking kunnen pijn, zwelling of onzekerheid blijven bestaan. Aanhoudende klachten kunnen reden zijn voor beoordeling.",
      url: "behandelingen/enkelverzwikking.html",
      painRegionIds: ["buitenzijde-enkel"],
      tags: ["Enkel", "Sport"],
    },
    {
      id: "chronische-enkelinstabiliteit",
      title: "Chronische enkelinstabiliteit",
      excerpt: "Blijvend doorzwikken kan passen bij bandletsel. Oefentherapie is vaak belangrijk; operatie is niet standaard en vraagt selectie.",
      url: "behandelingen/chronische-enkelinstabiliteit.html",
      painRegionIds: ["buitenzijde-enkel"],
      tags: ["Enkel", "Instabiliteit"],
    },
    {
      id: "anterieur-enkel-impingement",
      title: "Anterieur enkelimpingement",
      excerpt: "Pijn of inklemmingsgevoel aan de voorzijde van de enkel kan meerdere oorzaken hebben. Beweging, belasting en voorgeschiedenis geven richting.",
      url: "behandelingen/anterieur-enkel-impingement.html",
      painRegionIds: ["voorzijde-enkel", "buitenzijde-enkel"],
      tags: ["Enkel", "Inklemming"],
    },
    {
      id: "posterieur-enkel-impingement",
      title: "Posterieur enkelimpingement",
      excerpt: "Pijn achter in de enkel bij sport of diepe buiging kan passen bij achterste inklemmingsklachten, maar deze gids stelt geen diagnose.",
      url: "behandelingen/posterieur-enkel-impingement.html",
      painRegionIds: ["achterzijde-enkel", "hiel-achterzijde", "achillespees"],
      tags: ["Enkel", "Achterzijde"],
    },
    {
      id: "ganglion-enkel",
      title: "Ganglion rond de enkel",
      excerpt: "Een lokale zwelling rond de enkel kan soms passen bij een ganglion. De betekenis hangt af van plek, drukklachten en omliggende structuren.",
      url: "behandelingen/ganglion-enkel.html",
      painRegionIds: ["binnenzijde-enkel", "buitenzijde-enkel"],
      tags: ["Enkel", "Zwelling"],
    },
    {
      id: "peroneuspeesklachten",
      title: "Peroneuspeesklachten",
      excerpt: "Klachten aan de buitenzijde van voet of enkel kunnen soms met pezen rond de buitenenkel samenhangen. De context van belasting en enkelstand blijft belangrijk.",
      url: "behandelingen/peroneuspeesklachten.html",
      painRegionIds: ["buitenzijde-enkel", "buitenzijde-voet"],
      tags: ["Enkel", "Pezen"],
    },
    {
      id: "sinus-tarsi-klachten",
      title: "Sinus tarsi-klachten",
      excerpt: "Pijn aan de buitenzijde van de achtervoet kan meerdere verklaringen hebben. Eerder verzwikken, voetstand en belastbaarheid kunnen meewegen.",
      url: "behandelingen/sinus-tarsi-klachten.html",
      painRegionIds: ["buitenzijde-enkel", "buitenzijde-voet"],
      tags: ["Achtervoet", "Buitenzijde"],
    },
    {
      id: "os-trigonum",
      title: "Os trigonum",
      excerpt: "Pijn achter in de enkel kan bij sport of diepe buiging passen bij achterste enkelinklemming, maar dit vraagt beoordeling in de juiste context.",
      url: "behandelingen/os-trigonum.html",
      painRegionIds: ["achterzijde-enkel", "hiel-achterzijde", "achillespees"],
      tags: ["Enkel", "Achterzijde"],
    },
    {
      id: "enkelartrose",
      title: "Artrose van de enkel",
      excerpt: "Artrose van de enkel kan pijn en stijfheid geven. Behandeling hangt af van ernst, stand, functie en eerdere behandeling.",
      url: "behandelingen/enkelartrose.html",
      painRegionIds: ["voorzijde-enkel", "binnenzijde-enkel", "buitenzijde-enkel"],
      tags: ["Enkel", "Artrose"],
    },
    {
      id: "kraakbeenletsel-enkel",
      title: "Kraakbeenletsel van de enkel",
      excerpt: "Kraakbeen-botletsel kan pijn, zwelling of blokkeren geven. De betekenis verschilt per grootte, plek en belasting.",
      url: "behandelingen/kraakbeenletsel-enkel.html",
      painRegionIds: ["voorzijde-enkel", "buitenzijde-enkel", "binnenzijde-enkel"],
      tags: ["Enkel", "Kraakbeen"],
    },
    {
      id: "corpus-liberum-enkel",
      title: "Corpus liberum in de enkel",
      excerpt: "Een los fragment in het enkelgewricht kan soms mechanische klachten geven, zoals blokkeren of een slotgevoel. Dit vraagt beoordeling met onderzoek en zo nodig beeldvorming.",
      url: "behandelingen/corpus-liberum-enkel.html",
      painRegionIds: ["voorzijde-enkel", "binnenzijde-enkel", "buitenzijde-enkel", "onduidelijke-meerdere-plekken"],
      tags: ["Enkel", "Mechanische klachten"],
    },
    {
      id: "platvoet-volwassen",
      title: "Platvoet bij volwassenen",
      excerpt: "Een verzakkende voetstand kan pijn aan de binnenzijde van voet of enkel geven. Analyse van stand, pezen en belastbaarheid is belangrijk.",
      url: "behandelingen/platvoet-volwassen.html",
      painRegionIds: ["binnenzijde-voetboog", "binnenzijde-enkel", "middenvoet-onderzijde", "hiel-onderzijde"],
      tags: ["Achtervoet", "Voetstand"],
    },
    {
      id: "tibialis-posterior-peesklachten",
      title: "Tibialis posterior-peesklachten",
      excerpt: "Pijn aan de binnenzijde van voet of enkel kan soms met de binnenste peesstructuren en voetstand samenhangen. Dit vraagt zorgvuldige beoordeling.",
      url: "behandelingen/tibialis-posterior-peesklachten.html",
      painRegionIds: ["binnenzijde-voetboog", "binnenzijde-enkel"],
      tags: ["Achtervoet", "Pezen"],
    },
    {
      id: "holvoet-cavovarus",
      title: "Holvoet en cavovarus",
      excerpt: "Een hoge voetboog of naar buiten kantelende hiel kan drukplekken, buitenzijdepijn en enkelinstabiliteit geven.",
      url: "behandelingen/holvoet-cavovarus.html",
      painRegionIds: ["buitenzijde-voet", "wreef", "middenvoet-bovenzijde", "middenvoet-onderzijde"],
      tags: ["Achtervoet", "Voetstand"],
    },
    {
      id: "achillespeesklachten",
      title: "Achillespeesklachten",
      excerpt: "Pijn in of rond de achillespees kan verschillende oorzaken hebben. Belasting, locatie en duur van klachten sturen de beoordeling.",
      url: "behandelingen/achillespeesklachten.html",
      painRegionIds: ["achterzijde-enkel", "achillespees", "hiel-achterzijde"],
      tags: ["Achillespees", "Sport"],
    },
    {
      id: "hielpijn",
      title: "Hielpijn",
      excerpt: "Hielpijn is een klachtregio, geen diagnose. De plek, startpijn, schoendruk en belasting geven richting, maar vervangen geen consult.",
      url: "behandelingen/hielpijn.html",
      painRegionIds: ["hiel-onderzijde", "hiel-achterzijde"],
      tags: ["Hiel", "Achtervoet"],
    },
    {
      id: "peesplaatklachten-hielspoor",
      title: "Peesplaatklachten en hielspoor",
      excerpt: "Startpijn onder de hiel kan passen bij peesplaatklachten. Een hielspoor op een foto verklaart klachten niet automatisch.",
      url: "behandelingen/peesplaatklachten-hielspoor.html",
      painRegionIds: ["hiel-onderzijde", "middenvoet-onderzijde", "binnenzijde-voetboog"],
      tags: ["Hiel", "Peesplaat"],
    },
    {
      id: "vetkussen-hielklachten",
      title: "Vetkussen onder de hiel",
      excerpt: "Centrale drukpijn onder de hiel kan met het hielkussen, demping, harde ondergrond of drukverdeling samenhangen.",
      url: "behandelingen/vetkussen-hielklachten.html",
      painRegionIds: ["hiel-onderzijde"],
      tags: ["Hiel", "Belasting"],
    },
    {
      id: "haglund-retrocalcaneaire-klachten",
      title: "Haglund- en slijmbeursklachten",
      excerpt: "Pijn achter op de hiel kan samenhangen met schoendruk, slijmbeurs, Achillesaanhechting of een Haglund-context.",
      url: "behandelingen/haglund-retrocalcaneaire-klachten.html",
      painRegionIds: ["hiel-achterzijde", "achillespees"],
      tags: ["Hiel", "Achterzijde"],
    },
    {
      id: "tarsal-boss",
      title: "Tarsal boss",
      excerpt: "Een harde knobbel bovenop de wreef kan door botaanwas, schoendruk, middenvoetartrose of eerder letsel klachten geven.",
      url: "behandelingen/tarsal-boss.html",
      painRegionIds: ["wreef", "middenvoet-bovenzijde"],
      tags: ["Middenvoet", "Wreef"],
    },
    {
      id: "ganglion-middenvoet",
      title: "Ganglion middenvoet",
      excerpt: "Een weke of wisselende zwelling op de wreef kan passen bij een ganglion, maar een botknobbel of gewrichtsprobleem kan erop lijken.",
      url: "behandelingen/ganglion-middenvoet.html",
      painRegionIds: ["wreef", "middenvoet-bovenzijde"],
      tags: ["Middenvoet", "Zwelling"],
    },
    {
      id: "stressreactie-stressfractuur",
      title: "Stressreactie of stressfractuur",
      excerpt: "Lokale voet- of middenvoetpijn die bij belasting toeneemt kan passen bij botstress, maar pezen, gewrichten of letsel kunnen erop lijken.",
      url: "behandelingen/stressreactie-stressfractuur.html",
      painRegionIds: ["middenvoet-bovenzijde", "middenvoet-onderzijde"],
      tags: ["Middenvoet", "Belasting"],
    },
    {
      id: "lisfranc-middenvoetletsel",
      title: "Lisfranc- en middenvoetletsel",
      excerpt: "Middenvoetpijn na een verdraaiing, val of ongeval kan soms om zorgvuldige beoordeling van Lisfranc-letsel vragen.",
      url: "behandelingen/lisfranc-middenvoetletsel.html",
      painRegionIds: ["middenvoet-bovenzijde", "middenvoet-onderzijde"],
      tags: ["Middenvoet", "Letsel"],
    },
    {
      id: "artrose-na-breuk",
      title: "Artrose na een breuk",
      excerpt: "Na een voet- of enkelbreuk kan later pijn, stijfheid of posttraumatische artrose ontstaan. Stand en gewrichtsschade tellen mee.",
      url: "behandelingen/artrose-na-breuk.html",
      painRegionIds: ["middenvoet-bovenzijde", "wreef", "middenvoet-onderzijde", "binnenzijde-enkel", "buitenzijde-enkel", "buitenzijde-voet"],
      tags: ["Voet en enkel", "Eerder letsel"],
    },
    {
      id: "revisie-artrodese",
      title: "Revisie na artrodese",
      excerpt: "Pijn na een vastzetoperatie kan meerdere oorzaken hebben. Beoordeling kijkt naar botgenezing, stand, implantaten en omliggende gewrichten.",
      url: "behandelingen/revisie-artrodese.html",
      painRegionIds: ["middenvoet-bovenzijde"],
      tags: ["Voet en enkel", "Complexe zorg"],
    },
  ];

  const footPainTopicMeta = {
    "algemene-voet-enkelinformatie": {
      kind: "general",
      primaryLabel: "Algemene informatie",
    },
    "hallux-valgus": {
      kind: "condition",
      primaryLabel: "Aandoening",
      relatedTreatmentIds: ["voorvoetcorrectie"],
    },
    "hallux-rigidus": {
      kind: "condition",
      primaryLabel: "Aandoening",
      relatedTreatmentIds: ["mtp-1-artrodese"],
    },
    "jicht-podagra": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "hamerteen-klauwteen": {
      kind: "condition",
      primaryLabel: "Aandoening",
      relatedTreatmentIds: ["voorvoetcorrectie"],
    },
    metatarsalgie: {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
    },
    "morton-neuroom": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "mtp-plantaire-plaatklachten": {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
      relatedTreatmentIds: ["voorvoetcorrectie"],
    },
    "tailors-bunion": {
      kind: "condition",
      primaryLabel: "Aandoening",
      relatedTreatmentIds: ["voorvoetcorrectie"],
    },
    sesamoidklachten: {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
    },
    voorvoetcorrectie: {
      kind: "treatment",
      primaryLabel: "Behandeling",
      showInPainGuide: false,
      relatedTopicIds: ["hallux-valgus", "hamerteen-klauwteen", "tailors-bunion", "mtp-plantaire-plaatklachten"],
    },
    enkelverzwikking: {
      kind: "injury",
      primaryLabel: "Letsel",
    },
    "chronische-enkelinstabiliteit": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "anterieur-enkel-impingement": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "posterieur-enkel-impingement": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "ganglion-enkel": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    peroneuspeesklachten: {
      kind: "symptom",
      primaryLabel: "Peesklacht",
    },
    "sinus-tarsi-klachten": {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
    },
    "os-trigonum": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    enkelartrose: {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "kraakbeenletsel-enkel": {
      kind: "injury",
      primaryLabel: "Letsel",
    },
    "corpus-liberum-enkel": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "platvoet-volwassen": {
      kind: "condition",
      primaryLabel: "Standafwijking",
    },
    "tibialis-posterior-peesklachten": {
      kind: "symptom",
      primaryLabel: "Peesklacht",
    },
    "holvoet-cavovarus": {
      kind: "condition",
      primaryLabel: "Standafwijking",
    },
    achillespeesklachten: {
      kind: "symptom",
      primaryLabel: "Peesklacht",
    },
    hielpijn: {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
    },
    "peesplaatklachten-hielspoor": {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
    },
    "vetkussen-hielklachten": {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
    },
    "haglund-retrocalcaneaire-klachten": {
      kind: "symptom",
      primaryLabel: "Klachtbeeld",
    },
    "tarsal-boss": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "ganglion-middenvoet": {
      kind: "condition",
      primaryLabel: "Aandoening",
    },
    "stressreactie-stressfractuur": {
      kind: "injury",
      primaryLabel: "Letsel",
    },
    "lisfranc-middenvoetletsel": {
      kind: "injury",
      primaryLabel: "Letsel",
    },
    "artrose-na-breuk": {
      kind: "condition",
      primaryLabel: "Restklachten na letsel",
      relatedTreatmentIds: ["revisie-artrodese"],
    },
    "revisie-artrodese": {
      kind: "treatment",
      primaryLabel: "Behandelroute",
      showInPainGuide: false,
      relatedTopicIds: ["artrose-na-breuk"],
    },
  };

  const applyFootPainTopicMeta = (topic) => {
    const meta = footPainTopicMeta[topic.id] || {};
    Object.assign(topic, {
      kind: "condition",
      primaryLabel: "Aandoening",
      showInPainGuide: true,
      relatedTopicIds: [],
      relatedTreatmentIds: [],
      ...meta,
    });
    return topic;
  };

  footPainConditions.forEach(applyFootPainTopicMeta);

  const footPainTreatmentTopics = [
    {
      id: "mtp-1-artrodese",
      title: "MTP-1 artrodese",
      excerpt:
        "Verdieping over vastzetten van het grote-teengewricht. Dit is een behandelonderwerp en geen uitkomst van de pijnwijzer.",
      url: "behandelingen/mtp-1-artrodese.html",
      painRegionIds: ["grote-teen-mtp1"],
      tags: ["Behandeling", "Grote teen"],
      kind: "treatment",
      primaryLabel: "Behandeling",
      showInPainGuide: false,
      relatedTopicIds: ["hallux-rigidus"],
      relatedTreatmentIds: [],
    },
  ];

  const footPainTopics = [...footPainConditions, ...footPainTreatmentTopics];

  const footPainReviewExclusions = [
    {
      id: "niet-tonen-nagelproblemen",
      label: "Nagelproblemen",
      reason: "Bewust buiten deze orthopedische MVP; kan later naar aparte algemene uitleg of niet opnemen.",
      painRegionIds: ["grote-teen-mtp1", "kleine-tenen"],
    },
    {
      id: "niet-tonen-tarsaal-tunnel",
      label: "Tarsaal tunnelsyndroom",
      reason: "Voor nu bewust niet als kaart opnemen; neurologische differentiaaldiagnose kan de gids te breed maken.",
      painRegionIds: ["binnenzijde-enkel", "binnenzijde-voetboog"],
    },
    {
      id: "niet-tonen-voorste-enkelpees-slijmbeurs",
      label: "Pees- of slijmbeursklachten voorzijde enkel",
      reason: "Voor nu bewust niet als aparte kaart; voorzijde enkel blijft gekoppeld aan impingement, kraakbeen, corpus liberum en artrose.",
      painRegionIds: ["voorzijde-enkel"],
    },
  ];

  const sortByDateDesc = (items) =>
    [...items].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  const archiveArticles = sortByDateDesc(articles).filter((article) => article.archive !== false);

  const filterLabels = {
    patienten: "Patiënten",
    medewerkers: "Medewerkers",
    zorgprofessionals: "Zorgprofessionals",
    "voet-en-enkel": "Voet en enkel",
    artrose: "Artrose",
    leefstijl: "Leefstijl",
    onderzoek: "Onderzoek",
    "digitale-zorg": "Digitale zorg",
    "knie-kraakbeen": "Knie en kraakbeen",
    onderwijs: "Onderwijs",
    preventie: "Preventie",
  };

  const preferredFilterOrder = {
    audience: ["patienten", "zorgprofessionals", "medewerkers"],
    topic: ["voet-en-enkel", "knie-kraakbeen", "artrose", "leefstijl", "onderzoek", "digitale-zorg", "onderwijs", "preventie"],
  };

  const labelForFilter = (value) =>
    filterLabels[value] ||
    value
      .split("-")
      .filter(Boolean)
      .map((part, index) => (index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
      .join(" ");

  const sortedFilterValues = (values, groupName) => {
    const preferred = preferredFilterOrder[groupName] || [];
    return [...values].sort((a, b) => {
      const aIndex = preferred.indexOf(a);
      const bIndex = preferred.indexOf(b);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      return labelForFilter(a).localeCompare(labelForFilter(b), "nl");
    });
  };

  const renderArticleFilters = (sourceArticles = articles) => {
    const filters = {
      audience: new Set(),
      topic: new Set(),
    };
    sourceArticles.forEach((article) => {
      article.audience.forEach((audience) => filters.audience.add(audience));
      article.topics.forEach((topic) => filters.topic.add(topic));
    });
    document.querySelectorAll("[data-filter-options]").forEach((container) => {
      const groupName = container.getAttribute("data-filter-options");
      const values = sortedFilterValues(filters[groupName] || [], groupName);
      const allLabel = groupName === "audience" ? "Alle doelgroepen" : "Alles";
      container.innerHTML = [
        `<button class="filter-button is-active" type="button" data-filter="" aria-pressed="true">${allLabel}</button>`,
        ...values.map(
          (value) =>
            `<button class="filter-button" type="button" data-filter="${value}" aria-pressed="false">${labelForFilter(value)}</button>`
        ),
      ].join("");
    });
  };

  const prefixForCurrentPage = () => {
    const path = window.location.pathname;
    return path.includes("/artikelen/") || path.includes("/projecten/") ? "../" : "";
  };

  const resolvePath = (url) => {
    if (/^(https?:|mailto:|tel:|#)/.test(url)) return url;
    return `${prefixForCurrentPage()}${url}`;
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const footPainViewLabels = {
    top: "Bovenkant",
    front: "Voorkant",
    sole: "Onderkant",
    medial: "Binnenkant",
    lateral: "Buitenkant",
    heel: "Hiel/enkel",
  };

  const footPainViewOrder = ["top", "front", "sole", "medial", "lateral", "heel"];

  const footPainViews = {
    top: {
      image: "assets/foot-guide-dorsal.jpg",
      alt: "Bovenaanzicht van een voet",
      viewBox: "0 0 1024 1536",
      aspect: "1024 / 1536",
      maxWidth: "420px",
    },
    front: {
      image: "assets/foot-guide-front.png",
      alt: "Voorkant van voet, tenen en enkel",
      viewBox: "0 0 1672 941",
      aspect: "1672 / 941",
      maxWidth: "620px",
    },
    sole: {
      image: "assets/foot-guide-plantar.jpg",
      alt: "Onderzijde van een voet",
      viewBox: "0 0 1024 1536",
      aspect: "1024 / 1536",
      maxWidth: "420px",
    },
    medial: {
      image: "assets/foot-guide-medial.jpg",
      alt: "Binnenzijde van voet en enkel",
      viewBox: "0 0 1672 940",
      aspect: "1672 / 940",
      maxWidth: "620px",
    },
    lateral: {
      image: "assets/foot-guide-lateral.jpg",
      alt: "Buitenzijde van voet en enkel",
      viewBox: "0 0 1672 941",
      aspect: "1672 / 941",
      maxWidth: "620px",
    },
    heel: {
      image: "assets/foot-guide-heel.jpg",
      alt: "Achteraanzicht van hiel, enkel en achillespees",
      viewBox: "0 0 1672 941",
      aspect: "1672 / 941",
      maxWidth: "620px",
    },
  };

  const regionViews = (region) => Object.keys(region.views || {}).filter((view) => footPainViews[view]);
  const regionHasView = (region, view) => Boolean(region?.views?.[view]?.shape);
  const shapeForView = (region, view) => region?.views?.[view]?.shape || "";
  const primaryViewForRegion = (region) => regionViews(region)[0] || "top";
  const viewLabelList = (views) => views.map((view) => footPainViewLabels[view]).filter(Boolean).join(", ");

  // Lower priority renders earlier/behind; higher priority stays easier to reach on overlap.
  const footPainRegionPriority = {
    "onduidelijke-meerdere-plekken": 0,
    "middenvoet-bovenzijde": 10,
    "middenvoet-onderzijde": 10,
    "voorvoet-bovenzijde": 20,
    "voorvoet-onderzijde": 20,
    wreef: 25,
    "binnenzijde-voetboog": 30,
    "buitenzijde-voet": 30,
    "hiel-onderzijde": 35,
    "hiel-achterzijde": 38,
    "grote-teen-mtp1": 45,
    "kleine-tenen": 45,
    achillespees: 50,
    "binnenzijde-enkel": 55,
    "buitenzijde-enkel": 55,
    "voorzijde-enkel": 60,
    "achterzijde-enkel": 60,
  };

  const regionPriority = (region) => footPainRegionPriority[region.id] ?? 25;
  const compareRegionsForView = (a, b) => {
    const priorityDifference = regionPriority(a) - regionPriority(b);
    if (priorityDifference) return priorityDifference;
    return painRegions.indexOf(a) - painRegions.indexOf(b);
  };

  const uniqueList = (items) => [...new Set(items.filter(Boolean))];
  const isTreatmentTopic = (topic) => topic?.kind === "treatment" || topic?.showInPainGuide === false;
  const isVisibleInPainGuide = (topic) => Boolean(topic) && !isTreatmentTopic(topic);

  const conditionCard = (condition) => `
      <article class="article-card foot-guide-card" data-foot-card-regions="${(condition.painRegionIds || []).join(" ")}" data-foot-topic-kind="${escapeHtml(condition.kind || "condition")}">
        <div class="article-card-body">
          <p class="article-label">${escapeHtml(condition.primaryLabel || condition.tags?.[0] || "Voet en enkel")}</p>
          <h3>${escapeHtml(condition.title)}</h3>
          <p>${escapeHtml(condition.excerpt)}</p>
          <a class="article-link" href="${resolvePath(condition.url)}">Lees algemene uitleg</a>
        </div>
      </article>
    `;

  const mappingConditionLink = (condition) => `
    <a href="${resolvePath(condition.url)}">${escapeHtml(condition.title)}</a>
  `;

  const mappingExcludedTopic = (topic) => `
    <span class="foot-guide-review-exclusion">
      <strong>${escapeHtml(topic.label)}</strong>
      <span>${escapeHtml(topic.reason)}</span>
    </span>
  `;

  const renderFootPainGuide = () => {
    document.querySelectorAll("[data-foot-pain-guide]").forEach((container) => {
      const regionById = new Map(painRegions.map((region) => [region.id, region]));
      const topicById = new Map(footPainTopics.map((topic) => [topic.id, topic]));
      const debugRegions = new URLSearchParams(window.location.search).get("debugRegions") === "1";
      let activeView = container.getAttribute("data-initial-view") || "top";
      let selectedRegionId = "";
      let hoveredRegionIds = new Set();

      const conditionsForRegion = (region) =>
        region.relatedConditionIds.map((id) => topicById.get(id)).filter(isVisibleInPainGuide);
      const treatmentTopicsForRegion = (region) => {
        const topicIds = new Set();
        conditionsForRegion(region).forEach((topic) => {
          (topic.relatedTreatmentIds || []).forEach((id) => topicIds.add(id));
        });
        return Array.from(topicIds).map((id) => topicById.get(id)).filter(isTreatmentTopic);
      };
      const excludedTopicsForRegion = (region) =>
        footPainReviewExclusions.filter((topic) => topic.painRegionIds.includes(region.id));

      container.innerHTML = `
        <div class="foot-guide-shell${debugRegions ? " is-debugging-regions" : ""}">
          <div class="foot-guide-toolbar" aria-label="Weergave voetillustratie">
            <div class="filter-bar">
              ${footPainViewOrder
                .map(
                  (view) =>
                    `<button class="filter-button" type="button" data-foot-view="${view}" aria-pressed="false">${footPainViewLabels[view]}</button>`
                )
                .join("")}
            </div>
            <button class="article-link foot-guide-reset" type="button" data-foot-reset hidden>Wis keuze</button>
          </div>
          <div class="foot-guide-panel">
            <div class="foot-guide-visual-column">
              <div class="foot-guide-canvas-scroll" data-foot-canvas-scroll>
                <div class="foot-guide-canvas" data-foot-canvas>
                  <div class="foot-guide-base" data-foot-base></div>
                  <svg class="foot-guide-overlay" aria-label="Kies ongeveer waar de voet- of enkelpijn zit" data-foot-overlay></svg>
                </div>
              </div>
              <p class="foot-guide-note">Wijs een plek in de tekening aan om algemene leesinformatie te vinden.</p>
              <p class="foot-guide-safety-note">Deze pijnwijzer geeft geen uitslag, stelt geen diagnose en beoordeelt geen spoed. Deze informatie vervangt geen medisch consult. Bij een ongeval, plots veel pijn, niet kunnen steunen, standsverandering, open wond, koorts, of een voet die blauw, koud of gevoelloos wordt: neem contact op met uw huisarts of huisartsenpost. Bel 112 bij levensbedreigende spoed.</p>
              <p class="foot-guide-view-status" data-foot-view-status hidden></p>
              ${debugRegions ? '<p class="foot-guide-debug-note">Debugmodus actief: outlines, regio-id’s en consolemeldingen helpen bij calibratie.</p>' : ""}
              <div class="foot-guide-view-previews" data-foot-view-previews hidden></div>
            </div>
            <div class="foot-guide-results" aria-live="polite" data-foot-results></div>
          </div>
          <div class="foot-guide-alternative" aria-labelledby="foot-region-alternative-title">
            <div>
              <h3 id="foot-region-alternative-title">Zelfde keuze als lijst</h3>
              <label for="foot-pain-region-select">Kies een pijnlocatie</label>
              <select id="foot-pain-region-select" data-foot-select>
                <option value="">Geen selectie</option>
                ${painRegions
                  .map(
                    (region) =>
                      `<option value="${region.id}">${escapeHtml(region.label)} (${escapeHtml(viewLabelList(regionViews(region)))})</option>`
                  )
                  .join("")}
              </select>
            </div>
            <details class="foot-guide-region-list-details">
              <summary>Bekijk alle pijnlocaties als lijst</summary>
              <div class="foot-guide-region-list" data-foot-region-list></div>
            </details>
          </div>
          <details class="foot-guide-review-map">
            <summary>Medische mapping voor review</summary>
            <div class="foot-guide-review-map-inner">
              <p>Conceptkoppelingen per pijnzone. Alles in deze tabel betekent: tonen als mogelijk leesonderwerp, niet als diagnose.</p>
              <div class="foot-guide-review-table-wrap">
                <table class="foot-guide-review-table">
                  <thead>
                    <tr>
                      <th scope="col">Pijnzone</th>
                      <th scope="col">Aanzichten</th>
                      <th scope="col">Wel tonen</th>
                      <th scope="col">Behandelpagina's pas later</th>
                      <th scope="col">Niet tonen in MVP</th>
                      <th scope="col">Reviewstatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${painRegions
                      .map((region) => {
                        const conditions = conditionsForRegion(region);
                        const treatments = treatmentTopicsForRegion(region);
                        const exclusions = excludedTopicsForRegion(region);
                        return `
                          <tr>
                            <th scope="row">${escapeHtml(region.label)}</th>
                            <td>${escapeHtml(viewLabelList(regionViews(region)))}</td>
                            <td>${
                              conditions.length
                                ? conditions.map((condition) => mappingConditionLink(condition)).join(", ")
                                : "Nog geen gekoppelde onderwerpen"
                            }</td>
                            <td>${
                              treatments.length
                                ? treatments.map((treatment) => mappingConditionLink(treatment)).join(", ")
                                : '<span class="foot-guide-review-muted">Geen directe behandelpagina tonen</span>'
                            }</td>
                            <td>${
                              exclusions.length
                                ? exclusions.map((topic) => mappingExcludedTopic(topic)).join("")
                                : '<span class="foot-guide-review-muted">Geen bewuste uitsluitingen vastgelegd</span>'
                            }</td>
                            <td><span class="foot-guide-review-status">Medische review nodig</span></td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        </div>
      `;

      const base = container.querySelector("[data-foot-base]");
      const overlay = container.querySelector("[data-foot-overlay]");
      const results = container.querySelector("[data-foot-results]");
      const select = container.querySelector("[data-foot-select]");
      const regionList = container.querySelector("[data-foot-region-list]");
      const resetButton = container.querySelector("[data-foot-reset]");
      const viewPreviews = container.querySelector("[data-foot-view-previews]");
      const viewStatus = container.querySelector("[data-foot-view-status]");
      const viewButtons = Array.from(container.querySelectorAll("[data-foot-view]"));

      const restoreFocus = (target) => {
        if (!target) return;
        window.setTimeout(() => {
          let element = null;
          if (target.type === "view") {
            element = container.querySelector(`[data-foot-view="${target.id}"]`);
          } else if (target.type === "region") {
            element =
              container.querySelector(`[data-foot-region="${target.id}"]`) ||
              container.querySelector(`[data-foot-region-option="${target.id}"]`);
          } else if (target.type === "region-option") {
            element = container.querySelector(`[data-foot-region-option="${target.id}"]`);
          } else if (target.type === "select") {
            element = select;
          } else if (target.type === "reset") {
            element = select || container.querySelector("[data-foot-view]");
          }
          element?.focus({ preventScroll: true });
        }, 0);
      };

      const activeRegionIds = () => {
        const ids = new Set(hoveredRegionIds);
        if (selectedRegionId) ids.add(selectedRegionId);
        return ids;
      };

      const syncHighlights = () => {
        const activeIds = activeRegionIds();
        container.querySelectorAll("[data-foot-region]").forEach((path) => {
          const id = path.getAttribute("data-foot-region") || "";
          const isSelected = id === selectedRegionId;
          const isHovered = hoveredRegionIds.has(id);
          path.classList.toggle("is-selected", isSelected);
          path.classList.toggle("is-highlighted", isHovered && !isSelected);
          path.setAttribute("aria-pressed", String(isSelected));
        });
        container.querySelectorAll("[data-foot-region-option]").forEach((button) => {
          const id = button.getAttribute("data-foot-region-option") || "";
          const isSelected = id === selectedRegionId;
          const isHovered = hoveredRegionIds.has(id);
          button.classList.toggle("is-active", isSelected);
          button.classList.toggle("is-highlighted", isHovered && !isSelected);
          button.setAttribute("aria-pressed", String(isSelected));
        });
        container.querySelectorAll("[data-foot-card-regions]").forEach((card) => {
          const ids = (card.getAttribute("data-foot-card-regions") || "").split(/\s+/).filter(Boolean);
          const isRelated = ids.some((id) => activeIds.has(id));
          card.classList.toggle("is-region-related", isRelated);
        });
        viewButtons.forEach((button) => {
          const view = button.getAttribute("data-foot-view") || "";
          const matchingIds = Array.from(activeIds).filter((id) => regionHasView(regionById.get(id), view));
          const label = footPainViewLabels[view] || view;
          button.classList.toggle("has-related-region", matchingIds.length > 0);
          button.setAttribute("data-related-region-count", String(matchingIds.length));
          button.setAttribute(
            "aria-label",
            matchingIds.length ? `${label}, geselecteerde regio zichtbaar` : label
          );
        });
        if (viewStatus) {
          const selectedRegion = selectedRegionId ? regionById.get(selectedRegionId) : null;
          if (!selectedRegion) {
            viewStatus.hidden = true;
            viewStatus.textContent = "";
          } else if (regionHasView(selectedRegion, activeView)) {
            const otherViews = regionViews(selectedRegion).filter((view) => view !== activeView);
            viewStatus.hidden = otherViews.length === 0;
            viewStatus.textContent = otherViews.length
              ? `Ook zichtbaar in: ${viewLabelList(otherViews)}.`
              : "";
          } else {
            viewStatus.hidden = false;
            viewStatus.textContent = "Deze regio is niet zichtbaar in dit aanzicht.";
          }
        }
        renderViewPreviews(activeIds);
      };

      const renderViewPreviews = (activeIds) => {
        if (!viewPreviews) return;
        const ids = Array.from(activeIds).filter((id) => regionById.has(id));
        if (!ids.length) {
          viewPreviews.hidden = true;
          viewPreviews.innerHTML = "";
          return;
        }
        const previewViews = footPainViewOrder.filter((view) =>
          ids.some((id) => regionHasView(regionById.get(id), view))
        );
        viewPreviews.hidden = previewViews.length <= 1;
        viewPreviews.innerHTML = previewViews
          .map((view) => {
            const viewMeta = footPainViews[view];
            const paths = ids
              .map((id) => {
                const region = regionById.get(id);
                const shape = shapeForView(region, view);
                if (!shape) return "";
                return `<path d="${shape}"></path>`;
              })
              .join("");
            return `
              <button class="foot-guide-view-preview${view === activeView ? " is-active" : ""}" type="button" data-foot-preview-view="${view}" aria-label="Toon ${escapeHtml(footPainViewLabels[view])}">
                <span>${escapeHtml(footPainViewLabels[view])}</span>
                <span class="foot-guide-view-preview-frame" style="--foot-guide-preview-aspect: ${viewMeta.aspect}">
                  <img src="${resolvePath(viewMeta.image)}" alt="" loading="lazy">
                  <svg viewBox="${viewMeta.viewBox}" aria-hidden="true">${paths}</svg>
                </span>
              </button>
            `;
          })
          .join("");
        viewPreviews.querySelectorAll("[data-foot-preview-view]").forEach((button) => {
          button.addEventListener("click", () => {
            activeView = button.getAttribute("data-foot-preview-view") || activeView;
            renderAll({ type: "view", id: activeView });
          });
        });
      };

      const setHoveredRegionIds = (ids) => {
        hoveredRegionIds = new Set(ids.filter((id) => regionById.has(id)));
        syncHighlights();
      };

      const bindRegionHover = (element, ids) => {
        element.addEventListener("mouseenter", () => setHoveredRegionIds(ids));
        element.addEventListener("mouseleave", () => setHoveredRegionIds([]));
        element.addEventListener("focus", () => setHoveredRegionIds(ids));
        element.addEventListener("blur", () => setHoveredRegionIds([]));
        element.addEventListener("focusin", () => setHoveredRegionIds(ids));
        element.addEventListener("focusout", () => setHoveredRegionIds([]));
      };

      const availabilityMarkup = (region) => {
        const views = regionViews(region);
        if (views.length <= 1) return "";
        const currentMissing = !regionHasView(region, activeView);
        const alternateViews = views.filter((view) => view !== activeView);
        const buttons = alternateViews
          .map(
            (view) =>
              `<button class="foot-guide-view-jump" type="button" data-foot-availability-view="${view}">${escapeHtml(footPainViewLabels[view])}</button>`
          )
          .join("");
        return `<div class="foot-guide-view-availability${currentMissing ? " is-current-missing" : ""}">${
          currentMissing ? "Deze regio is niet zichtbaar in dit aanzicht." : "Ook zichtbaar in:"
        } <span>${buttons}</span></div>`;
      };

      const renderResults = () => {
        if (!results) return;
        const selectedRegion = selectedRegionId ? regionById.get(selectedRegionId) : null;
        const defaultIds = [
          "hallux-rigidus",
          "metatarsalgie",
          "morton-neuroom",
          "peesplaatklachten-hielspoor",
          "enkelverzwikking",
          "hielpijn",
        ];
        const conditions = selectedRegion
          ? conditionsForRegion(selectedRegion)
          : defaultIds.map((id) => topicById.get(id)).filter(isVisibleInPainGuide);

        const heading = selectedRegion ? selectedRegion.label : "Waar zit de pijn?";
        const intro = selectedRegion
          ? `Algemene leesinformatie over deze pijnplek. ${selectedRegion.shortDescription}`
          : "Wijs ongeveer aan waar u klachten herkent. De informatie hieronder blijft algemeen en is geen beoordeling van uw klacht.";
        const selectedAvailability = selectedRegion ? availabilityMarkup(selectedRegion) : "";

        results.innerHTML = `
          <p class="section-kicker">Voet- en enkelpijnwijzer</p>
          <h2>${escapeHtml(heading)}</h2>
          <p>${escapeHtml(intro)}</p>
          ${selectedAvailability}
          ${
            conditions.length
              ? `<p class="foot-guide-card-context">Deze onderwerpen zijn bedoeld om verder te lezen. Behandelopties worden pas op de detailpagina's besproken.</p><div class="article-grid foot-guide-card-grid">${conditions.map(conditionCard).join("")}</div>`
              : `<p class="foot-guide-fallback">Deze plek is nog niet gekoppeld aan specifieke pagina's. <a href="${resolvePath("behandelingen.html")}">Bekijk algemene informatie over voet- en enkelklachten.</a></p>`
          }
        `;
        results.querySelectorAll("[data-foot-card-regions]").forEach((card) => {
          const ids = (card.getAttribute("data-foot-card-regions") || "").split(/\s+/).filter(Boolean);
          bindRegionHover(card, ids);
        });
        results.querySelectorAll("[data-foot-availability-view]").forEach((button) => {
          button.addEventListener("click", () => {
            activeView = button.getAttribute("data-foot-availability-view") || activeView;
            renderAll({ type: "view", id: activeView });
          });
        });
        syncHighlights();
      };

      const syncControls = () => {
        viewButtons.forEach((button) => {
          const isActive = button.getAttribute("data-foot-view") === activeView;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
        if (select) select.value = selectedRegionId;
        if (resetButton) resetButton.hidden = !selectedRegionId;
        syncHighlights();
      };

      const renderRegionList = () => {
        if (!regionList) return;
        regionList.innerHTML = painRegions
          .map(
            (region) =>
              `<button class="filter-button${region.id === selectedRegionId ? " is-active" : ""}" type="button" data-foot-region-option="${region.id}" data-foot-region-views="${regionViews(region).join(" ")}" aria-pressed="${region.id === selectedRegionId}">
                <span>${escapeHtml(region.label)}</span>
                <small>${escapeHtml(viewLabelList(regionViews(region)))}</small>
              </button>`
          )
          .join("");
        regionList.querySelectorAll("[data-foot-region-option]").forEach((button) => {
          const id = button.getAttribute("data-foot-region-option") || "";
          bindRegionHover(button, [id]);
          button.addEventListener("click", () => {
            const region = regionById.get(id);
            if (!region) return;
            selectedRegionId = region.id;
            if (!regionHasView(region, activeView)) activeView = primaryViewForRegion(region);
            renderAll({ type: "region-option", id });
          });
        });
      };

      const renderCanvas = () => {
        if (!base || !overlay) return;
        const view = footPainViews[activeView] || footPainViews.top;
        const canvas = container.querySelector("[data-foot-canvas]");
        const canvasScroll = container.querySelector("[data-foot-canvas-scroll]");
        canvas?.style.setProperty("--foot-guide-aspect", view.aspect);
        canvas?.style.setProperty("--foot-guide-max-width", view.maxWidth);
        canvas?.setAttribute("data-foot-active-view", activeView);
        canvasScroll?.setAttribute("data-foot-active-view", activeView);
        base.innerHTML = `<img src="${resolvePath(view.image)}" alt="${escapeHtml(view.alt)}" loading="lazy">`;
        overlay.setAttribute("viewBox", view.viewBox);
        const activeIds = activeRegionIds();
        const visibleRegions = painRegions
          .filter((region) => regionHasView(region, activeView))
          .sort((a, b) => {
            const aActive = activeIds.has(a.id);
            const bActive = activeIds.has(b.id);
            if (aActive !== bActive) return aActive ? 1 : -1;
            if (a.id === selectedRegionId && b.id !== selectedRegionId) return 1;
            if (b.id === selectedRegionId && a.id !== selectedRegionId) return -1;
            return compareRegionsForView(a, b);
          });
        overlay.innerHTML = visibleRegions
          .map(
            (region) =>
              `<path class="foot-guide-region${region.id === selectedRegionId ? " is-selected" : ""}" d="${shapeForView(region, activeView)}" role="button" tabindex="0" aria-label="Selecteer pijnregio: ${escapeHtml(region.label)}" aria-pressed="${region.id === selectedRegionId}" data-foot-region="${region.id}" data-foot-view="${activeView}" data-foot-region-priority="${regionPriority(region)}"></path>${
                debugRegions
                  ? `<text class="foot-guide-region-label" x="16" y="${28 + visibleRegions.indexOf(region) * 24}">${escapeHtml(region.id)} · ${regionPriority(region)}</text>`
                  : ""
              }`
          )
          .join("");
        overlay.querySelectorAll("[data-foot-region]").forEach((path) => {
          const selectRegion = () => {
            selectedRegionId = path.getAttribute("data-foot-region") || "";
            if (debugRegions) {
              console.info("FootPainGuide region", {
                regionId: selectedRegionId,
                view: activeView,
                priority: regionPriority(regionById.get(selectedRegionId)),
              });
            }
            renderAll({ type: "region", id: selectedRegionId });
          };
          bindRegionHover(path, [path.getAttribute("data-foot-region") || ""]);
          path.addEventListener("click", selectRegion);
          path.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              selectRegion();
            }
          });
        });
        syncHighlights();
      };

      const renderAll = (focusTarget) => {
        syncControls();
        renderCanvas();
        renderRegionList();
        renderResults();
        restoreFocus(focusTarget);
      };

      viewButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeView = button.getAttribute("data-foot-view") || "top";
          renderAll({ type: "view", id: activeView });
        });
      });

      resetButton?.addEventListener("click", () => {
        selectedRegionId = "";
        renderAll({ type: "reset" });
      });

      select?.addEventListener("change", () => {
        selectedRegionId = select.value;
        const selectedRegion = selectedRegionId ? regionById.get(selectedRegionId) : null;
        if (selectedRegion && !regionHasView(selectedRegion, activeView)) activeView = primaryViewForRegion(selectedRegion);
        renderAll({ type: "select" });
      });

      renderAll();
    });
  };

  const audienceLabels = {
    patienten: "Voor patiënten",
    zorgprofessionals: "Voor professionals",
    medewerkers: "Voor medewerkers",
  };

  const articleAudienceLabel = (article) => {
    const labels = article.audience
      .map((audience) => audienceLabels[audience])
      .filter(Boolean);
    if (labels.length === 0) return "";
    if (article.audience.includes("patienten") && article.audience.includes("zorgprofessionals")) {
      return article.audience.includes("medewerkers")
        ? "Voor patiënten, professionals en medewerkers"
        : "Voor patiënten en professionals";
    }
    return labels.join(" en ");
  };

  const articleCard = (article, options = {}) => {
    const imageClasses = ["article-card-image"];
    if (article.imageContain) imageClasses.push("project-card-image", "project-card-image-contain");
    const audienceLabel = options.showAudience ? articleAudienceLabel(article) : "";
    return `
      <article class="article-card" data-audience="${escapeHtml(article.audience.join(" "))}" data-topics="${escapeHtml(article.topics.join(" "))}">
        <img class="${imageClasses.join(" ")}" src="${resolvePath(article.image)}" alt="${escapeHtml(article.imageAlt)}" loading="lazy">
        <div class="article-card-body">
          <p class="article-label">${escapeHtml(article.label)}</p>
          ${audienceLabel ? `<p class="article-audience">${escapeHtml(audienceLabel)}</p>` : ""}
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.summary)}</p>
          <a class="article-link" href="${resolvePath(article.url)}">Lees artikel</a>
        </div>
      </article>
    `;
  };

  const compactArticleItem = (article) => {
    const audienceLabel = articleAudienceLabel(article);
    return `
      <li class="article-compact-item" data-audience="${escapeHtml(article.audience.join(" "))}" data-topics="${escapeHtml(article.topics.join(" "))}">
        <a href="${resolvePath(article.url)}">${escapeHtml(article.title)}</a>
        <span>${escapeHtml([audienceLabel, article.label].filter(Boolean).join(" · "))}</span>
      </li>
    `;
  };

  const projectCard = (project) => `
    <article class="article-card">
      <img class="article-card-image project-card-image" src="${resolvePath(project.image)}" alt="${escapeHtml(project.imageAlt)}" loading="lazy">
      <div class="article-card-body">
        <p class="article-label">${escapeHtml(project.label)}</p>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
        <a class="article-link" href="${resolvePath(project.url)}">Bekijk project</a>
      </div>
    </article>
  `;

  const renderList = (selector, items, cardFactory) => {
    document.querySelectorAll(selector).forEach((container) => {
      const limit = Number.parseInt(container.getAttribute("data-limit") || "", 10);
      const selected = Number.isFinite(limit) ? items.slice(0, limit) : items;
      container.innerHTML = selected.map(cardFactory).join("");
    });
  };

  const renderArticlesOverview = (items) => {
    const cardLimit = 12;
    document.querySelectorAll("[data-content='articles-list']").forEach((container) => {
      container.innerHTML = items.slice(0, cardLimit).map(articleCard).join("");
    });
    document.querySelectorAll("[data-content='articles-compact-list']").forEach((container) => {
      const compactArticles = items.slice(cardLimit);
      container.innerHTML = compactArticles.map(compactArticleItem).join("");
      const section = container.closest("[data-compact-articles-section]");
      if (section) section.hidden = compactArticles.length === 0;
    });
  };

  renderArticlesOverview(archiveArticles);
  renderList("[data-content='home-articles']", archiveArticles, articleCard);
  renderArticleFilters(archiveArticles);
  renderList("[data-content='projects-list']", projects, projectCard);
  renderList("[data-content='home-projects']", projects.filter((project) => project.featured).slice(0, 3), projectCard);
  renderList("[data-content='professional-projects']", projects.filter((project) => project.featured).slice(0, 3), projectCard);
  renderList(
    "[data-content='professional-articles']",
    sortByDateDesc(articles).filter(
      (article) => article.audience.includes("zorgprofessionals") && article.archive === false
    ),
    articleCard
  );
  renderList(
    "[data-content='advice-education']",
    sortByDateDesc(articles).filter((article) => article.topics.includes("onderwijs")),
    articleCard
  );
  renderList(
    "[data-content='advice-insights']",
    sortByDateDesc(articles).filter((article) =>
      ["artrosezorg-transitie-professionals"].includes(article.id)
    ),
    articleCard
  );
  renderList(
    "[data-content='treatment-articles']",
    sortByDateDesc(articles).filter(
      (article) =>
        article.audience.includes("patienten") &&
        article.archive === false &&
        article.topics.some((topic) => ["voet-en-enkel", "knie-kraakbeen", "artrose", "leefstijl", "preventie"].includes(topic))
    ),
    articleCard
  );
  renderFootPainGuide();

  document.querySelectorAll("[data-content='project-news']").forEach((container) => {
    const projectId = container.getAttribute("data-project");
    const projectArticles = sortByDateDesc(articles).filter((article) => article.project === projectId);
    container.innerHTML = projectArticles.map((article) => articleCard(article, { showAudience: true })).join("");
    const section = container.closest(".related-section");
    if (section) section.hidden = projectArticles.length === 0;
  });

  window.siteContent = { articles, projects, painRegions, footPainConditions, footPainTreatmentTopics, footPainTopics };
})();
