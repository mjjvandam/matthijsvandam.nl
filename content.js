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
        "Begrijpelijke uitleg over artrosezorg, bewegen, leefstijl en samenwerking tussen zorgverleners.",
      image: "assets/knee-anatomy-model-editorial.jpg",
      imageAlt: "Anatomisch kniemodel in een rustige spreekkamer",
      url: "artikelen/artrosezorg-transitie-patienten.html",
      date: "2026-01-01",
      audience: ["patienten"],
      topics: ["artrose", "leefstijl"],
      archive: false,
    },
  ];

  const painRegions = [
    {
      id: "grote-teen-mtp1",
      label: "Grote teen / MTP-1",
      shortDescription: "Pijn rond het grote-teengewricht of bij het afwikkelen.",
      relatedConditionIds: ["hallux-rigidus", "hallux-valgus", "voorvoetcorrectie"],
      views: {
        top: { shape: "M300 115 C390 80 455 140 460 280 C465 425 402 535 302 520 C245 410 230 205 300 115 Z" },
        sole: { shape: "M275 80 C390 35 465 110 455 250 C450 370 390 475 280 450 C220 335 215 165 275 80 Z" },
        medial: { shape: "M1260 655 C1415 600 1550 675 1580 795 C1450 880 1265 860 1145 770 C1145 715 1190 675 1260 655 Z" },
      },
    },
    {
      id: "kleine-tenen",
      label: "Kleine tenen",
      shortDescription: "Pijn, drukplekken of standsproblemen rond de kleine tenen.",
      relatedConditionIds: ["hamerteen-klauwteen", "tailors-bunion", "voorvoetcorrectie"],
      views: {
        top: { shape: "M455 110 C690 80 800 230 760 420 C650 395 530 350 455 290 Z" },
        sole: { shape: "M450 110 C665 85 790 215 780 405 C665 420 520 365 450 280 Z" },
        lateral: { shape: "M1260 610 C1445 565 1585 640 1600 750 C1500 815 1305 800 1165 725 C1165 675 1200 635 1260 610 Z" },
      },
    },
    {
      id: "voorvoet-bovenzijde",
      label: "Voorvoet bovenzijde",
      shortDescription: "Pijn bovenop de voorvoet of rond de middenvoetsbeentjes.",
      relatedConditionIds: ["metatarsalgie-morton", "voorvoetcorrectie", "artrose-na-breuk"],
      views: {
        top: { shape: "M275 430 C410 350 690 380 770 540 C760 680 650 780 485 760 C340 750 260 630 275 430 Z" },
        medial: { shape: "M880 540 C1090 495 1345 555 1495 670 C1310 750 1045 755 820 690 C790 630 810 570 880 540 Z" },
        lateral: { shape: "M825 520 C1055 455 1360 520 1505 690 C1335 790 1035 795 725 725 C690 645 720 555 825 520 Z" },
      },
    },
    {
      id: "middenvoet-bovenzijde",
      label: "Middenvoet bovenzijde",
      shortDescription: "Pijn bovenop de middenvoet, soms bij belasting of na eerder letsel.",
      relatedConditionIds: ["artrose-na-breuk", "revisie-artrodese", "holvoet-cavovarus"],
      views: {
        top: { shape: "M315 720 C455 645 665 670 745 810 C760 1050 640 1195 480 1185 C340 1175 275 1000 315 720 Z" },
        medial: { shape: "M520 520 C725 450 990 490 1125 640 C1010 750 665 780 410 710 C380 620 420 555 520 520 Z" },
        lateral: { shape: "M465 500 C700 440 1010 480 1180 640 C1030 760 650 785 365 710 C345 615 380 540 465 500 Z" },
      },
    },
    {
      id: "wreef",
      label: "Wreef",
      shortDescription: "Pijn of druk op de wreef, bijvoorbeeld bij schoenen of hoge voetboog.",
      relatedConditionIds: ["holvoet-cavovarus", "artrose-na-breuk"],
      views: {
        top: { shape: "M360 565 C465 515 645 525 720 650 C710 825 610 955 470 930 C350 905 305 720 360 565 Z" },
        medial: { shape: "M600 420 C815 360 1085 430 1250 595 C1040 690 690 670 485 570 C480 500 520 450 600 420 Z" },
        lateral: { shape: "M575 405 C810 360 1080 425 1260 585 C1060 690 680 670 455 565 C450 485 495 430 575 405 Z" },
      },
    },
    {
      id: "voorvoet-onderzijde",
      label: "Voorvoet onderzijde",
      shortDescription: "Pijn onder de bal van de voet of bij druk onder de voorvoet.",
      relatedConditionIds: ["metatarsalgie-morton", "hallux-rigidus", "voorvoetcorrectie"],
      views: {
        sole: { shape: "M260 250 C410 95 720 160 775 420 C720 600 620 710 470 700 C330 690 240 535 260 250 Z" },
        top: { shape: "M285 420 C420 350 680 385 755 530 C730 640 625 715 490 710 C355 705 270 590 285 420 Z" },
        medial: { shape: "M1030 650 C1210 600 1465 650 1580 790 C1435 875 1195 855 1010 765 C990 715 1000 675 1030 650 Z" },
        lateral: { shape: "M990 625 C1195 565 1475 625 1600 755 C1435 845 1175 830 965 735 C945 685 955 650 990 625 Z" },
      },
    },
    {
      id: "middenvoet-onderzijde",
      label: "Middenvoet onderzijde",
      shortDescription: "Pijn onder de middenvoet of aan de overgang naar de voetboog.",
      relatedConditionIds: ["platvoet-volwassen", "holvoet-cavovarus", "artrose-na-breuk"],
      views: {
        sole: { shape: "M320 610 C470 520 690 570 745 735 C710 930 590 1045 430 1000 C305 965 250 760 320 610 Z" },
        medial: { shape: "M430 660 C640 585 1010 600 1205 705 C1060 790 650 795 365 755 C345 720 375 685 430 660 Z" },
        lateral: { shape: "M760 520 C1010 430 1370 520 1505 690 C1335 790 1035 795 725 725 C690 645 705 555 760 520 Z" },
      },
    },
    {
      id: "hiel-onderzijde",
      label: "Hiel onderzijde",
      shortDescription: "Pijn onder de hiel, vaak merkbaar bij staan of de eerste stappen.",
      relatedConditionIds: ["hielpijn", "platvoet-volwassen"],
      views: {
        sole: { shape: "M340 1085 C460 1000 655 1000 750 1115 C805 1320 680 1485 515 1480 C360 1475 260 1300 340 1085 Z" },
        heel: { shape: "M660 720 C700 620 970 620 1025 725 C1025 850 945 910 835 900 C720 895 645 835 660 720 Z" },
        medial: { shape: "M130 720 C250 655 425 655 560 720 C470 835 260 845 115 775 C85 750 95 735 130 720 Z" },
        lateral: { shape: "M115 720 C250 655 440 655 575 720 C470 840 255 850 105 775 C75 750 85 735 115 720 Z" },
      },
    },
    {
      id: "binnenzijde-voetboog",
      label: "Binnenzijde voetboog",
      shortDescription: "Pijn langs de binnenboog of bij een doorzakkende voetstand.",
      relatedConditionIds: ["platvoet-volwassen", "artrose-na-breuk"],
      views: {
        medial: { shape: "M430 660 C640 585 1010 600 1205 705 C1060 790 650 795 365 755 C345 720 375 685 430 660 Z" },
        sole: { shape: "M250 610 C360 560 430 620 460 780 C475 1020 420 1180 315 1215 C235 1050 210 760 250 610 Z" },
      },
    },
    {
      id: "binnenzijde-enkel",
      label: "Binnenzijde enkel",
      shortDescription: "Pijn rond de binnenenkel of de pezen aan de binnenzijde.",
      relatedConditionIds: ["platvoet-volwassen", "enkelartrose", "artrose-na-breuk"],
      views: {
        medial: { shape: "M245 350 C330 215 560 220 655 385 C610 515 385 570 250 500 C205 455 210 395 245 350 Z" },
        heel: { shape: "M540 410 C630 345 760 365 810 455 C765 565 620 585 530 505 C500 470 505 435 540 410 Z" },
      },
    },
    {
      id: "buitenzijde-voet",
      label: "Buitenzijde voet",
      shortDescription: "Pijn of druk aan de buitenrand van de voet.",
      relatedConditionIds: ["tailors-bunion", "holvoet-cavovarus", "artrose-na-breuk"],
      views: {
        lateral: { shape: "M760 520 C1010 430 1370 520 1505 690 C1335 790 1035 795 725 725 C690 645 705 555 760 520 Z" },
        sole: { shape: "M720 410 C815 430 855 545 815 645 C730 695 650 655 625 550 C645 470 680 425 720 410 Z" },
      },
    },
    {
      id: "buitenzijde-enkel",
      label: "Buitenzijde enkel",
      shortDescription: "Pijn aan de buitenzijde van de enkel, soms na verzwikken.",
      relatedConditionIds: ["enkelverzwikking", "chronische-enkelinstabiliteit", "kraakbeenletsel-enkel", "enkel-impingement"],
      views: {
        lateral: { shape: "M245 350 C330 215 560 220 655 385 C610 515 385 570 250 500 C205 455 210 395 245 350 Z" },
        heel: { shape: "M875 410 C960 350 1105 365 1160 455 C1125 560 980 585 890 505 C855 470 855 435 875 410 Z" },
      },
    },
    {
      id: "hiel-achterzijde",
      label: "Hiel achterzijde",
      shortDescription: "Pijn achter op de hiel of bij de aanhechting van de achillespees.",
      relatedConditionIds: ["achillespeesklachten", "hielpijn", "os-trigonum"],
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
      relatedConditionIds: ["achillespeesklachten", "os-trigonum"],
      views: {
        heel: { shape: "M675 0 C770 0 925 0 1010 0 C980 210 990 430 960 620 C910 690 760 690 705 620 C675 430 700 210 675 0 Z" },
        medial: { shape: "M245 0 C330 0 520 0 610 20 C575 205 570 360 610 500 C515 550 360 545 270 495 C300 340 285 175 245 0 Z" },
        lateral: { shape: "M235 0 C320 0 520 0 610 20 C570 200 570 360 610 500 C510 550 350 545 260 495 C290 340 275 175 235 0 Z" },
      },
    },
    {
      id: "onduidelijke-meerdere-plekken",
      label: "Onduidelijke of meerdere plekken",
      shortDescription: "Klachten die niet duidelijk op één plek zitten of op meerdere plekken spelen.",
      relatedConditionIds: ["artrose-na-breuk", "revisie-artrodese", "platvoet-volwassen", "holvoet-cavovarus"],
      views: {
        top: { shape: "M270 470 C420 350 705 380 790 640 C785 990 655 1250 485 1240 C315 1230 240 930 270 470 Z" },
        sole: { shape: "M250 360 C405 180 750 250 820 580 C780 1050 680 1485 515 1480 C335 1470 220 1030 250 360 Z" },
        medial: { shape: "M360 360 C620 240 1280 430 1510 650 C1260 820 520 835 180 720 C95 540 160 410 360 360 Z" },
        lateral: { shape: "M350 360 C630 240 1290 430 1510 650 C1260 820 520 835 180 720 C95 540 150 410 350 360 Z" },
        heel: { shape: "M540 410 C630 345 760 365 810 455 C765 565 620 585 530 505 C500 470 505 435 540 410 Z" },
      },
    },
  ];

  const footPainConditions = [
    {
      id: "hallux-valgus",
      title: "Hallux valgus",
      excerpt: "Scheefstand van de grote teen met pijn of schoenproblemen. Beoordeling hangt af van stand, druk, huid en eerdere maatregelen.",
      url: "behandelingen.html?topic=voorvoet",
      painRegionIds: ["grote-teen-mtp1"],
      tags: ["Voorvoet", "Grote teen"],
    },
    {
      id: "hallux-rigidus",
      title: "Hallux rigidus",
      excerpt: "Artrose van het grote-teengewricht kan pijn geven bij afwikkelen. Mogelijke opties worden altijd gekoppeld aan onderzoek en beeldvorming.",
      url: "behandelingen.html?topic=voorvoet",
      painRegionIds: ["grote-teen-mtp1", "voorvoet-onderzijde"],
      tags: ["Voorvoet", "Artrose"],
    },
    {
      id: "hamerteen-klauwteen",
      title: "Hamerteen en klauwteen",
      excerpt: "Teenstandafwijkingen kunnen drukplekken, eelt of schoenproblemen geven. De aanpak is afhankelijk van soepelheid, huid en belasting.",
      url: "behandelingen.html?topic=voorvoet",
      painRegionIds: ["kleine-tenen"],
      tags: ["Tenen", "Drukklachten"],
    },
    {
      id: "metatarsalgie-morton",
      title: "Metatarsalgie en Morton neuroom",
      excerpt: "Pijn onder de bal van de voet of zenuwirritatie tussen de middenvoetsbeentjes vraagt analyse van druk, stand en belasting.",
      url: "behandelingen.html?topic=voorvoet",
      painRegionIds: ["voorvoet-onderzijde", "voorvoet-bovenzijde"],
      tags: ["Voorvoet", "Zenuwirritatie"],
    },
    {
      id: "tailors-bunion",
      title: "Tailor's bunion",
      excerpt: "Een pijnlijke knobbel aan de buitenzijde van de voorvoet kan passen bij druk rond het vijfde middenvoetsbeentje.",
      url: "behandelingen.html?topic=voorvoet",
      painRegionIds: ["kleine-tenen", "buitenzijde-voet"],
      tags: ["Voorvoet", "Buitenzijde"],
    },
    {
      id: "voorvoetcorrectie",
      title: "Voorvoetcorrectie",
      excerpt: "Bij pijnlijke standsafwijkingen kan correctie van teenstand of middenvoetsbeentjes worden besproken na zorgvuldige indicatiestelling.",
      url: "behandelingen.html?topic=voorvoet",
      painRegionIds: ["grote-teen-mtp1", "kleine-tenen", "voorvoet-onderzijde", "voorvoet-bovenzijde"],
      tags: ["Behandeling", "Voorvoet"],
    },
    {
      id: "enkelverzwikking",
      title: "Enkelverzwikking",
      excerpt: "Na een verzwikking kunnen pijn, zwelling of onzekerheid blijven bestaan. Aanhoudende klachten kunnen reden zijn voor beoordeling.",
      url: "behandelingen.html?topic=enkel",
      painRegionIds: ["buitenzijde-enkel"],
      tags: ["Enkel", "Sport"],
    },
    {
      id: "chronische-enkelinstabiliteit",
      title: "Chronische enkelinstabiliteit",
      excerpt: "Blijvend doorzwikken kan passen bij bandletsel. Oefentherapie is vaak belangrijk; operatie is niet standaard en vraagt selectie.",
      url: "behandelingen.html?topic=enkel",
      painRegionIds: ["buitenzijde-enkel"],
      tags: ["Enkel", "Instabiliteit"],
    },
    {
      id: "enkel-impingement",
      title: "Impingement van de enkel",
      excerpt: "Inklemmingsklachten kunnen aan de voor-, buiten- of achterzijde van de enkel spelen en vragen gericht onderzoek.",
      url: "behandelingen.html?topic=enkel",
      painRegionIds: ["buitenzijde-enkel", "binnenzijde-enkel"],
      tags: ["Enkel", "Inklemming"],
    },
    {
      id: "os-trigonum",
      title: "Os trigonum",
      excerpt: "Pijn achter in de enkel kan bij sport of diepe buiging passen bij achterste enkelinklemming, maar dit moet worden beoordeeld.",
      url: "behandelingen.html?topic=enkel",
      painRegionIds: ["hiel-achterzijde", "achillespees"],
      tags: ["Enkel", "Achterzijde"],
    },
    {
      id: "enkelartrose",
      title: "Artrose van de enkel",
      excerpt: "Artrose van de enkel kan pijn en stijfheid geven. Behandeling hangt af van ernst, stand, functie en eerdere behandeling.",
      url: "behandelingen.html?topic=enkel",
      painRegionIds: ["binnenzijde-enkel", "buitenzijde-enkel"],
      tags: ["Enkel", "Artrose"],
    },
    {
      id: "kraakbeenletsel-enkel",
      title: "Kraakbeenletsel van de enkel",
      excerpt: "Kraakbeen-botletsel kan pijn, zwelling of blokkeren geven. De betekenis verschilt per grootte, plek en belasting.",
      url: "behandelingen.html?topic=enkel",
      painRegionIds: ["buitenzijde-enkel", "binnenzijde-enkel"],
      tags: ["Enkel", "Kraakbeen"],
    },
    {
      id: "platvoet-volwassen",
      title: "Platvoet bij volwassenen",
      excerpt: "Een verzakkende voetstand kan pijn aan de binnenzijde van voet of enkel geven. Analyse van stand, pezen en belastbaarheid is belangrijk.",
      url: "behandelingen.html?topic=achtervoet",
      painRegionIds: ["binnenzijde-voetboog", "binnenzijde-enkel", "middenvoet-onderzijde", "hiel-onderzijde"],
      tags: ["Achtervoet", "Voetstand"],
    },
    {
      id: "holvoet-cavovarus",
      title: "Holvoet en cavovarus",
      excerpt: "Een hoge voetboog of naar buiten kantelende hiel kan drukplekken, buitenzijdepijn en enkelinstabiliteit geven.",
      url: "behandelingen.html?topic=achtervoet",
      painRegionIds: ["buitenzijde-voet", "wreef", "middenvoet-bovenzijde", "middenvoet-onderzijde"],
      tags: ["Achtervoet", "Voetstand"],
    },
    {
      id: "achillespeesklachten",
      title: "Achillespeesklachten",
      excerpt: "Pijn in of rond de achillespees kan verschillende oorzaken hebben. Belasting, locatie en duur van klachten sturen de beoordeling.",
      url: "behandelingen.html?topic=sport",
      painRegionIds: ["achillespees", "hiel-achterzijde"],
      tags: ["Achillespees", "Sport"],
    },
    {
      id: "hielpijn",
      title: "Hielpijn",
      excerpt: "Hielpijn kan onder of achter de hiel zitten. De plek, startpijn en belasting geven richting, maar vervangen geen consult.",
      url: "behandelingen.html?topic=achtervoet",
      painRegionIds: ["hiel-onderzijde", "hiel-achterzijde"],
      tags: ["Hiel", "Achtervoet"],
    },
    {
      id: "artrose-na-breuk",
      title: "Artrose na een breuk",
      excerpt: "Na eerder letsel kan later pijn of stijfheid ontstaan. Beoordeling vraagt aandacht voor stand, gewrichtsschade en voorgeschiedenis.",
      url: "behandelingen.html?topic=achtervoet",
      painRegionIds: ["middenvoet-bovenzijde", "middenvoet-onderzijde", "binnenzijde-enkel", "buitenzijde-enkel", "buitenzijde-voet", "onduidelijke-meerdere-plekken"],
      tags: ["Voet en enkel", "Eerder letsel"],
    },
    {
      id: "revisie-artrodese",
      title: "Revisie na artrodese",
      excerpt: "Wanneer een vastzetoperatie niet vastgroeit, is beoordeling van botkwaliteit, stand en implantaten nodig.",
      url: "artikelen/revisie-artrodese-niet-vastgegroeid-patienten.html",
      painRegionIds: ["middenvoet-bovenzijde", "onduidelijke-meerdere-plekken"],
      tags: ["Voet en enkel", "Complexe zorg"],
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
      container.innerHTML = values
        .map(
          (value) =>
            `<button class="filter-button" type="button" data-filter="${value}" aria-pressed="false">${labelForFilter(value)}</button>`
        )
        .join("");
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
    sole: "Onderkant",
    medial: "Binnenzijde",
    lateral: "Buitenzijde",
    heel: "Hiel/enkel",
  };

  const footPainViewOrder = ["top", "sole", "medial", "lateral", "heel"];

  const footPainViews = {
    top: {
      image: "assets/foot-guide-dorsal.jpg",
      alt: "Bovenaanzicht van een voet",
      viewBox: "0 0 1024 1536",
      aspect: "1024 / 1536",
      maxWidth: "420px",
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

  const conditionCard = (condition) => `
    <article class="article-card foot-guide-card">
      <div class="article-card-body">
        <p class="article-label">${escapeHtml(condition.tags[0] || "Voet en enkel")}</p>
        <h3>${escapeHtml(condition.title)}</h3>
        <p>${escapeHtml(condition.excerpt)}</p>
        <div class="foot-guide-tags" aria-label="Labels">
          ${condition.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <a class="article-link" href="${resolvePath(condition.url)}">Bekijk algemene informatie</a>
      </div>
    </article>
  `;

  const renderFootPainGuide = () => {
    document.querySelectorAll("[data-foot-pain-guide]").forEach((container) => {
      const regionById = new Map(painRegions.map((region) => [region.id, region]));
      const conditionById = new Map(footPainConditions.map((condition) => [condition.id, condition]));
      let activeView = container.getAttribute("data-initial-view") || "top";
      let selectedRegionId = "";

      container.innerHTML = `
        <div class="foot-guide-shell">
          <div class="foot-guide-toolbar" aria-label="Weergave voetillustratie">
            <div class="filter-bar">
              ${footPainViewOrder
                .map(
                  (view) =>
                    `<button class="filter-button" type="button" data-foot-view="${view}" aria-pressed="false">${footPainViewLabels[view]}</button>`
                )
                .join("")}
            </div>
            <button class="article-link foot-guide-reset" type="button" data-foot-reset>Toon alles</button>
          </div>
          <div class="foot-guide-panel">
            <div class="foot-guide-visual-column">
              <div class="foot-guide-canvas" data-foot-canvas>
                <div class="foot-guide-base" data-foot-base></div>
                <svg class="foot-guide-overlay" aria-label="Kies de plek van de voet- of enkelpijn" data-foot-overlay></svg>
              </div>
              <p class="foot-guide-note">Kies een plek in de tekening. Dit geeft alleen algemene richting en is geen diagnose.</p>
            </div>
            <div class="foot-guide-results" aria-live="polite" data-foot-results></div>
          </div>
          <div class="foot-guide-alternative" aria-labelledby="foot-region-alternative-title">
            <div>
              <h3 id="foot-region-alternative-title">Zelfde keuze als lijst</h3>
              <label for="foot-pain-region-select">Kies een pijnlocatie</label>
              <select id="foot-pain-region-select" data-foot-select>
                <option value="">Toon alles</option>
                ${painRegions
                  .map(
                    (region) =>
                      `<option value="${region.id}">${escapeHtml(footPainViewLabels[region.view])}: ${escapeHtml(region.label)}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div class="foot-guide-region-list" data-foot-region-list></div>
          </div>
        </div>
      `;

      const base = container.querySelector("[data-foot-base]");
      const overlay = container.querySelector("[data-foot-overlay]");
      const results = container.querySelector("[data-foot-results]");
      const select = container.querySelector("[data-foot-select]");
      const regionList = container.querySelector("[data-foot-region-list]");
      const viewButtons = Array.from(container.querySelectorAll("[data-foot-view]"));

      const conditionsForRegion = (region) =>
        region.relatedConditionIds.map((id) => conditionById.get(id)).filter(Boolean);

      const renderResults = () => {
        if (!results) return;
        const selectedRegion = selectedRegionId ? regionById.get(selectedRegionId) : null;
        const defaultIds = [
          "hallux-rigidus",
          "metatarsalgie-morton",
          "enkelverzwikking",
          "hielpijn",
        ];
        const conditions = selectedRegion
          ? conditionsForRegion(selectedRegion)
          : defaultIds.map((id) => conditionById.get(id)).filter(Boolean);

        const heading = selectedRegion
          ? `Mogelijke oorzaken van pijn bij: ${selectedRegion.label}`
          : "Veelvoorkomende voet- en enkelonderwerpen";
        const intro = selectedRegion
          ? selectedRegion.shortDescription
          : "Selecteer een plek in de voetillustratie om de kaarten te filteren. De informatie hieronder blijft algemeen.";

        results.innerHTML = `
          <p class="section-kicker">Foot Pain Guide</p>
          <h2>${escapeHtml(heading)}</h2>
          <p>${escapeHtml(intro)}</p>
          <p class="foot-guide-disclaimer">Deze informatie vervangt geen medisch consult. Bij persoonlijke medische vragen, afspraken of spoed blijven de officiële zorgkanalen leidend.</p>
          ${
            conditions.length
              ? `<div class="article-grid foot-guide-card-grid">${conditions.map(conditionCard).join("")}</div>`
              : `<p class="foot-guide-fallback">Deze plek is nog niet gekoppeld aan specifieke pagina's. <a href="${resolvePath("behandelingen.html?topic=voorvoet")}">Bekijk alle voet- en enkelklachten.</a></p>`
          }
        `;
      };

      const syncControls = () => {
        viewButtons.forEach((button) => {
          const isActive = button.getAttribute("data-foot-view") === activeView;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
        if (select) select.value = selectedRegionId;
      };

      const renderRegionList = () => {
        if (!regionList) return;
        regionList.innerHTML = painRegions
          .map(
            (region) =>
              `<button class="filter-button${region.id === selectedRegionId ? " is-active" : ""}" type="button" data-foot-region-option="${region.id}" aria-pressed="${region.id === selectedRegionId}">
                ${escapeHtml(region.label)}
              </button>`
          )
          .join("");
        regionList.querySelectorAll("[data-foot-region-option]").forEach((button) => {
          button.addEventListener("click", () => {
            const region = regionById.get(button.getAttribute("data-foot-region-option") || "");
            if (!region) return;
            selectedRegionId = region.id;
            activeView = region.view;
            renderAll();
          });
        });
      };

      const renderCanvas = () => {
        if (!base || !overlay) return;
        const view = footPainViews[activeView] || footPainViews.top;
        const canvas = container.querySelector("[data-foot-canvas]");
        canvas?.style.setProperty("--foot-guide-aspect", view.aspect);
        canvas?.style.setProperty("--foot-guide-max-width", view.maxWidth);
        base.innerHTML = `<img src="${resolvePath(view.image)}" alt="${escapeHtml(view.alt)}" loading="lazy">`;
        overlay.setAttribute("viewBox", view.viewBox);
        const visibleRegions = painRegions.filter((region) => region.view === activeView);
        overlay.innerHTML = visibleRegions
          .map(
            (region) =>
              `<path class="foot-guide-region${region.id === selectedRegionId ? " is-selected" : ""}" d="${region.shape}" role="button" tabindex="0" aria-label="Selecteer pijnregio: ${escapeHtml(region.label)}" aria-pressed="${region.id === selectedRegionId}" data-foot-region="${region.id}"></path>`
          )
          .join("");
        overlay.querySelectorAll("[data-foot-region]").forEach((path) => {
          const selectRegion = () => {
            selectedRegionId = path.getAttribute("data-foot-region") || "";
            renderAll();
          };
          path.addEventListener("click", selectRegion);
          path.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              selectRegion();
            }
          });
        });
      };

      const renderAll = () => {
        if (selectedRegionId) {
          const selectedRegion = regionById.get(selectedRegionId);
          if (selectedRegion) activeView = selectedRegion.view;
        }
        syncControls();
        renderCanvas();
        renderRegionList();
        renderResults();
      };

      viewButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeView = button.getAttribute("data-foot-view") || "top";
          const selectedRegion = selectedRegionId ? regionById.get(selectedRegionId) : null;
          if (selectedRegion && selectedRegion.view !== activeView) selectedRegionId = "";
          renderAll();
        });
      });

      container.querySelector("[data-foot-reset]")?.addEventListener("click", () => {
        selectedRegionId = "";
        renderAll();
      });

      select?.addEventListener("change", () => {
        selectedRegionId = select.value;
        const selectedRegion = selectedRegionId ? regionById.get(selectedRegionId) : null;
        if (selectedRegion) activeView = selectedRegion.view;
        renderAll();
      });

      renderAll();
    });
  };

  const articleCard = (article) => {
    const imageClasses = ["article-card-image"];
    if (article.imageContain) imageClasses.push("project-card-image", "project-card-image-contain");
    return `
      <article class="article-card" data-audience="${article.audience.join(" ")}" data-topics="${article.topics.join(" ")}">
        <img class="${imageClasses.join(" ")}" src="${resolvePath(article.image)}" alt="${article.imageAlt}" loading="lazy">
        <div class="article-card-body">
          <p class="article-label">${article.label}</p>
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <a class="article-link" href="${resolvePath(article.url)}">Lees artikel</a>
        </div>
      </article>
    `;
  };

  const projectCard = (project) => `
    <article class="article-card">
      <img class="article-card-image project-card-image" src="${resolvePath(project.image)}" alt="${project.imageAlt}" loading="lazy">
      <div class="article-card-body">
        <p class="article-label">${project.label}</p>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
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

  renderList("[data-content='articles-list']", archiveArticles, articleCard);
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
    container.innerHTML = projectArticles.map(articleCard).join("");
    const section = container.closest(".related-section");
    if (section) section.hidden = projectArticles.length === 0;
  });

  window.siteContent = { articles, projects, painRegions, footPainConditions };
})();
