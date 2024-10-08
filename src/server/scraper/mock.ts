import { DEGREE, type DataProviderTypes, type StudyOverview } from "~/server/scraper/types";


const mockDataConstant = ({
  "values": {
    "year": {
      "value": "2024",
      "label": "2024/2025"
    },
    "degree": "BACHELOR",
    "program": {
      "name": "Informační technologie",
      "url": "https://www.fit.vut.cz/study/program/8953/.cs",
      "isEnglish": false,
      "specializations": [],
      "attendanceType": "prezenční studium",
      "abbreviation": "BIT",
      "id": "program-8953"
    }
  },
  "data": {
    "years": [
      {
        "value": "2024",
        "label": "2024/2025"
      },
      {
        "value": "2023",
        "label": "2023/2024"
      },
      {
        "value": "2022",
        "label": "2022/2023"
      },
      {
        "value": "2021",
        "label": "2021/2022"
      },
      {
        "value": "2020",
        "label": "2020/2021"
      },
      {
        "value": "2019",
        "label": "2019/2020"
      },
      {
        "value": "2018",
        "label": "2018/2019"
      },
      {
        "value": "2017",
        "label": "2017/2018"
      },
      {
        "value": "2016",
        "label": "2016/2017"
      },
      {
        "value": "2015",
        "label": "2015/2016"
      },
      {
        "value": "2014",
        "label": "2014/2015"
      },
      {
        "value": "2013",
        "label": "2013/2014"
      },
      {
        "value": "2012",
        "label": "2012/2013"
      },
      {
        "value": "2011",
        "label": "2011/2012"
      },
      {
        "value": "2010",
        "label": "2010/2011"
      },
      {
        "value": "2009",
        "label": "2009/2010"
      },
      {
        "value": "2008",
        "label": "2008/2009"
      },
      {
        "value": "2007",
        "label": "2007/2008"
      },
      {
        "value": "2006",
        "label": "2006/2007"
      },
      {
        "value": "2005",
        "label": "2005/2006"
      },
      {
        "value": "2004",
        "label": "2004/2005"
      },
      {
        "value": "2003",
        "label": "2003/2004"
      },
      {
        "value": "2002",
        "label": "2002/2003"
      },
      {
        "value": "2001",
        "label": "2001/2002"
      }
    ],
    "semesters": [
      "WINTER",
      "SUMMER"
    ],
    "degrees": [
      "BACHELOR",
      "MASTER",
      "DOCTORAL"
    ],
    "grades": [
      {
        "key": "1",
        "label": "1BIT"
      },
      {
        "key": "2",
        "label": "2BIT"
      },
      {
        "key": "3",
        "label": "3BIT"
      }
    ],
    "programs": {
      "BACHELOR": [
        {
          "name": "Informační technologie",
          "url": "https://www.fit.vut.cz/study/program/8953/.cs",
          "isEnglish": false,
          "specializations": [],
          "attendanceType": "prezenční studium",
          "abbreviation": "BIT",
          "id": "program-8953"
        }
      ],
      "MASTER": [
        {
          "name": "Informační technologie a umělá inteligence",
          "url": "https://www.fit.vut.cz/study/program/8967/.cs",
          "isEnglish": false,
          "specializations": [
            {
              "abbreviation": "NBIO",
              "name": "Bioinformatika a biocomputing",
              "url": "https://www.fit.vut.cz/study/field/16824/.cs",
              "id": "field-16824"
            },
            {
              "abbreviation": "NISD",
              "name": "Informační systémy a databáze",
              "url": "https://www.fit.vut.cz/study/field/16810/.cs",
              "id": "field-16810"
            },
            {
              "abbreviation": "NISY",
              "name": "Inteligentní systémy",
              "url": "https://www.fit.vut.cz/study/field/16820/.cs",
              "id": "field-16820"
            },
            {
              "abbreviation": "NIDE",
              "name": "Inteligentní zařízení",
              "url": "https://www.fit.vut.cz/study/field/16819/.cs",
              "id": "field-16819"
            },
            {
              "abbreviation": "NCPS",
              "name": "Kyberfyzikální systémy",
              "url": "https://www.fit.vut.cz/study/field/16816/.cs",
              "id": "field-16816"
            },
            {
              "abbreviation": "NSEC",
              "name": "Kybernetická bezpečnost",
              "url": "https://www.fit.vut.cz/study/field/16812/.cs",
              "id": "field-16812"
            },
            {
              "abbreviation": "NMAT",
              "name": "Matematické metody",
              "url": "https://www.fit.vut.cz/study/field/16811/.cs",
              "id": "field-16811"
            },
            {
              "abbreviation": "NGRI",
              "name": "Počítačová grafika a interakce",
              "url": "https://www.fit.vut.cz/study/field/16808/.cs",
              "id": "field-16808"
            },
            {
              "abbreviation": "NNET",
              "name": "Počítačové sítě",
              "url": "https://www.fit.vut.cz/study/field/16814/.cs",
              "id": "field-16814"
            },
            {
              "abbreviation": "NVIZ",
              "name": "Počítačové vidění",
              "url": "https://www.fit.vut.cz/study/field/16826/.cs",
              "id": "field-16826"
            },
            {
              "abbreviation": "NSEN",
              "name": "Softwarové inženýrství",
              "url": "https://www.fit.vut.cz/study/field/16825/.cs",
              "id": "field-16825"
            },
            {
              "abbreviation": "NMAL",
              "name": "Strojové učení",
              "url": "https://www.fit.vut.cz/study/field/16815/.cs",
              "id": "field-16815"
            },
            {
              "abbreviation": "NHPC",
              "name": "Superpočítání",
              "url": "https://www.fit.vut.cz/study/field/16817/.cs",
              "id": "field-16817"
            },
            {
              "abbreviation": "NVER",
              "name": "Verifikace a testování software",
              "url": "https://www.fit.vut.cz/study/field/16818/.cs",
              "id": "field-16818"
            },
            {
              "abbreviation": "NEMB",
              "name": "Vestavěné systémy",
              "url": "https://www.fit.vut.cz/study/field/16823/.cs",
              "id": "field-16823"
            },
            {
              "abbreviation": "NADE",
              "name": "Vývoj aplikací",
              "url": "https://www.fit.vut.cz/study/field/16809/.cs",
              "id": "field-16809"
            },
            {
              "abbreviation": "NSPE",
              "name": "Zpracování zvuku, řeči a přirozeného jazyka",
              "url": "https://www.fit.vut.cz/study/field/16822/.cs",
              "id": "field-16822"
            }
          ],
          "attendanceType": "prezenční studium",
          "abbreviation": "MITAI",
          "id": "program-8967"
        }
      ],
      "DOCTORAL": [
        {
          "name": "Informační technologie",
          "url": "https://www.fit.vut.cz/study/program/8956/.cs",
          "isEnglish": false,
          "specializations": [],
          "attendanceType": "prezenční studium",
          "abbreviation": "DIT",
          "id": "program-8956"
        },
        {
          "name": "Informační technologie",
          "url": "https://www.fit.vut.cz/study/program/8955/.cs",
          "isEnglish": false,
          "specializations": [],
          "attendanceType": "kombinované studium",
          "abbreviation": "DIT",
          "id": "program-8955"
        },
        {
          "name": "Výpočetní technika a informatika",
          "url": "https://www.fit.vut.cz/study/program/9229/.cs",
          "isEnglish": false,
          "specializations": [
            {
              "abbreviation": "DVI4",
              "name": "Výpočetní technika a informatika",
              "url": "https://www.fit.vut.cz/study/field/17280/.cs",
              "id": "field-17280"
            }
          ],
          "attendanceType": "prezenční studium",
          "abbreviation": "VTI-DR-4",
          "id": "program-9229"
        },
        {
          "name": "Výpočetní technika a informatika",
          "url": "https://www.fit.vut.cz/study/program/9230/.cs",
          "isEnglish": false,
          "specializations": [
            {
              "abbreviation": "DVI4",
              "name": "Výpočetní technika a informatika",
              "url": "https://www.fit.vut.cz/study/field/17281/.cs",
              "id": "field-17281"
            }
          ],
          "attendanceType": "kombinované studium",
          "abbreviation": "VTI-DR-4",
          "id": "program-9230"
        }
      ]
    },
    "courses": {
      "1": {
        "WINTER": {
          "compulsory": [
            {
              "name": "Diskrétní matematika",
              "abbreviation": "IDM",
              "id": 281068
            },
            {
              "name": "Elektronika pro informační technologie",
              "abbreviation": "IEL",
              "id": 281030
            },
            {
              "name": "Lineární algebra",
              "abbreviation": "ILG",
              "id": 281066
            },
            {
              "name": "Úvod do softwarového inženýrství",
              "abbreviation": "IUS",
              "id": 281002
            },
            {
              "name": "Základy programování",
              "abbreviation": "IZP",
              "id": 280953
            },
            {
              "name": "Zkouška z obecné angličtiny B1",
              "abbreviation": "GEN",
              "id": 281032
            },
            {
              "name": "Zkouška z angličtiny na úrovni B1",
              "abbreviation": "ZAN4",
              "id": 281047
            }
          ],
          "optional": [
            {
              "name": "Matematický software",
              "abbreviation": "0MS",
              "id": 278161
            },
            {
              "name": "Aplikovaná herní studia – výzkum a design",
              "abbreviation": "1AHS-L",
              "id": 278629
            },
            {
              "name": "3D tisk a digitální výroba pro kreativní obory 1",
              "abbreviation": "1DS-Z",
              "id": 279248
            },
            {
              "name": "Herní studia",
              "abbreviation": "1HS-Z",
              "id": 278749
            },
            {
              "name": "3D optická digitalizace 1",
              "abbreviation": "1ODI-Z",
              "id": 279244
            },
            {
              "name": "Architektura 20. století",
              "abbreviation": "ACHE20",
              "id": 278633
            },
            {
              "name": "Aktuální témata grafického designu",
              "abbreviation": "ATGD",
              "id": 278613
            },
            {
              "name": "Daňový systém ČR",
              "abbreviation": "BPC-DSY",
              "id": 279726
            },
            {
              "name": "Elektrotechnický seminář",
              "abbreviation": "BPC-ELSA",
              "id": 279740
            },
            {
              "name": "Fyzika 1",
              "abbreviation": "BPC-FY1B",
              "id": 279766
            },
            {
              "name": "Fyzika v elektrotechnice",
              "abbreviation": "BPC-FYE",
              "id": 279759
            },
            {
              "name": "GIS",
              "abbreviation": "BRA011",
              "id": 281939
            },
            {
              "name": "Dějiny a kontexty fotografie 1",
              "abbreviation": "DKFI-Z",
              "id": 278685
            },
            {
              "name": "Filozofie a kultura",
              "abbreviation": "FIK",
              "id": 285246
            },
            {
              "name": "Dějiny a filozofie techniky",
              "abbreviation": "FIT",
              "id": 285247
            },
            {
              "name": "Manažerská komunikace a prezentace",
              "abbreviation": "HKO",
              "id": 281135
            },
            {
              "name": "Manažerské vedení lidí a řízení času",
              "abbreviation": "HVR",
              "id": 281139
            },
            {
              "name": "Fyzikální seminář",
              "abbreviation": "IFS",
              "id": 280895
            },
            {
              "name": "Kruhové konzultace",
              "abbreviation": "IKK",
              "id": 281091
            },
            {
              "name": "Počítačový seminář",
              "abbreviation": "ISC",
              "id": 280946
            },
            {
              "name": "Matematický seminář",
              "abbreviation": "ISM",
              "id": 281067
            },
            {
              "name": "Informační výchova a gramotnost",
              "abbreviation": "IVG",
              "id": 280888
            },
            {
              "name": "Kurz pornostudií",
              "abbreviation": "KPO-Z",
              "id": 278779
            },
            {
              "name": "Právní minimum",
              "abbreviation": "PRM",
              "id": 285250
            },
            {
              "name": "Rétorika",
              "abbreviation": "RET",
              "id": 285251
            },
            {
              "name": "Vizuální styly digitálních her 1",
              "abbreviation": "VSDH1",
              "id": 279186
            },
            {
              "name": "Podnikatelské minimum",
              "abbreviation": "XPC-POM",
              "id": 280767
            }
          ]
        },
        "SUMMER": {
          "compulsory": [
            {
              "name": "Matematická analýza 1",
              "abbreviation": "IMA1",
              "id": 281065
            },
            {
              "name": "Návrh číslicových systémů",
              "abbreviation": "INC",
              "id": 281145
            },
            {
              "name": "Operační systémy",
              "abbreviation": "IOS",
              "id": 280995
            },
            {
              "name": "Programování na strojové úrovni",
              "abbreviation": "ISU",
              "id": 280999
            },
            {
              "name": "Základy logiky pro informatiky",
              "abbreviation": "IZLO",
              "id": 281004
            },
            {
              "name": "Angličtina C1-2",
              "abbreviation": "0AX",
              "id": 278129
            },
            {
              "name": "Angličtina pro IT",
              "abbreviation": "AIT",
              "id": 281043
            },
            {
              "name": "Angličtina 1: mírně pokročilí 1",
              "abbreviation": "BAN1",
              "id": 281042
            },
            {
              "name": "Angličtina 2: mírně pokročilí 2",
              "abbreviation": "BAN2",
              "id": 281040
            },
            {
              "name": "Angličtina 3: středně pokročilí 1",
              "abbreviation": "BAN3",
              "id": 281038
            },
            {
              "name": "Angličtina 4: středně pokročilí 2",
              "abbreviation": "BAN4",
              "id": 281036
            },
            {
              "name": "Praktická angličtina 2",
              "abbreviation": "BPC-PA2",
              "id": 279863
            },
            {
              "name": "Zkouška z obecné angličtiny B1",
              "abbreviation": "GEN",
              "id": 281033
            },
            {
              "name": "Angličtina pro FCE 2",
              "abbreviation": "XPC-FCE2",
              "id": 280737
            },
            {
              "name": "Seminář VHDL",
              "abbreviation": "IVH",
              "id": 281152
            }
          ],
          "optional": [
            {
              "name": "Matematické výpočty pomocí MAPLE",
              "abbreviation": "0MV",
              "id": 278163
            },
            {
              "name": "English Skills for Workplace Communication",
              "abbreviation": "0SE",
              "id": 278196
            },
            {
              "name": "CNC obrábění – Roboti v umělecké praxi",
              "abbreviation": "1CNCO",
              "id": 278672
            },
            {
              "name": "3D tisk a digitální výroba pro kreativní obory 2",
              "abbreviation": "1DS-2",
              "id": 279249
            },
            {
              "name": "Herní design - Digitální hry",
              "abbreviation": "1HERDES",
              "id": 278748
            },
            {
              "name": "Kritická analýza digitálních her",
              "abbreviation": "1KADH-L",
              "id": 278777
            },
            {
              "name": "3D optická digitalizace 2",
              "abbreviation": "1ODI-L",
              "id": 279245
            },
            {
              "name": "Autorská práva",
              "abbreviation": "AUP-L",
              "id": 278657
            },
            {
              "name": "Dějiny a kontexty fotografie 2",
              "abbreviation": "DKFII-L",
              "id": 278686
            },
            {
              "name": "Filozofie a kultura",
              "abbreviation": "FIK",
              "id": 285245
            },
            {
              "name": "Manažerská komunikace a prezentace",
              "abbreviation": "HKO",
              "id": 281136
            },
            {
              "name": "Hliněné stavitelství",
              "abbreviation": "HLS-KE",
              "id": 276931
            },
            {
              "name": "Manažerské vedení lidí a řízení času",
              "abbreviation": "HVR",
              "id": 281140
            },
            {
              "name": "Jazyk C",
              "abbreviation": "IJC",
              "id": 280992
            },
            {
              "name": "Mechanika a akustika",
              "abbreviation": "IMK",
              "id": 280898
            },
            {
              "name": "Periferní zařízení",
              "abbreviation": "IPZ",
              "id": 281148
            },
            {
              "name": "Skriptovací jazyky",
              "abbreviation": "ISJ",
              "id": 281092
            },
            {
              "name": "Tvorba webových stránek",
              "abbreviation": "ITW",
              "id": 280948
            },
            {
              "name": "Typografie a publikování",
              "abbreviation": "ITY",
              "id": 281001
            },
            {
              "name": "Praktické aspekty vývoje software",
              "abbreviation": "IVS",
              "id": 281098
            },
            {
              "name": "Němčina 2",
              "abbreviation": "N2",
              "id": 277570
            },
            {
              "name": "Podnikatelská laboratoř",
              "abbreviation": "PLAB",
              "id": 285615
            },
            {
              "name": "Právní minimum",
              "abbreviation": "PRM",
              "id": 285249
            },
            {
              "name": "Rétorika",
              "abbreviation": "RET",
              "id": 285252
            },
            {
              "name": "Počítačová fyzika I",
              "abbreviation": "T1F",
              "id": 277939
            },
            {
              "name": "Vizuální styly digitálních her 2",
              "abbreviation": "VSDH2",
              "id": 279187
            },
            {
              "name": "Obchodní angličtina",
              "abbreviation": "XPC-BEN",
              "id": 280718
            }
          ]
        }
      },
      "2": {
        "WINTER": {
          "compulsory": [
            {
              "name": "Algoritmy",
              "abbreviation": "IAL",
              "id": 280900
            },
            {
              "name": "Formální jazyky a překladače",
              "abbreviation": "IFJ",
              "id": 280931
            },
            {
              "name": "Matematická analýza 2",
              "abbreviation": "IMA2",
              "id": 281064
            },
            {
              "name": "Návrh počítačových systémů",
              "abbreviation": "INP",
              "id": 281147
            },
            {
              "name": "Pravděpodobnost a statistika",
              "abbreviation": "IPT",
              "id": 281070
            },
            {
              "name": "Signály a systémy",
              "abbreviation": "ISS",
              "id": 281093
            },
            {
              "name": "Angličtina B2-1",
              "abbreviation": "0A7",
              "id": 278133
            },
            {
              "name": "Angličtina C1-1",
              "abbreviation": "0A9",
              "id": 278135
            },
            {
              "name": "Angličtina pro IT",
              "abbreviation": "AIT",
              "id": 281044
            },
            {
              "name": "Angličtina 1: mírně pokročilí 1",
              "abbreviation": "BAN1",
              "id": 281041
            },
            {
              "name": "Angličtina 2: mírně pokročilí 2",
              "abbreviation": "BAN2",
              "id": 281039
            },
            {
              "name": "Angličtina 3: středně pokročilí 1",
              "abbreviation": "BAN3",
              "id": 281037
            },
            {
              "name": "Angličtina 4: středně pokročilí 2",
              "abbreviation": "BAN4",
              "id": 281035
            },
            {
              "name": "Praktická angličtina 1",
              "abbreviation": "BPC-PA1",
              "id": 279862
            },
            {
              "name": "Praktická angličtina 3",
              "abbreviation": "BPC-PA3",
              "id": 279864
            },
            {
              "name": "Angličtina pro FCE 1",
              "abbreviation": "XPC-FCE1",
              "id": 280736
            }
          ],
          "optional": [
            {
              "name": "English Skills for Workplace Communication",
              "abbreviation": "0SE",
              "id": 278195
            },
            {
              "name": "Základy herního vývoje",
              "abbreviation": "1ZHERV",
              "id": 279223
            },
            {
              "name": "Angličtina pro Evropu",
              "abbreviation": "AEU",
              "id": 281045
            },
            {
              "name": "Analogová elektronika 1",
              "abbreviation": "BPC-AE1",
              "id": 279662
            },
            {
              "name": "Analogová technika",
              "abbreviation": "BPC-ANA",
              "id": 279671
            },
            {
              "name": "Elektroakustika 1",
              "abbreviation": "BPC-ELA",
              "id": 279733
            },
            {
              "name": "Návrh a realizace elektronických přístrojů",
              "abbreviation": "BPC-NRP",
              "id": 279842
            },
            {
              "name": "Robotika a manipulátory",
              "abbreviation": "BPC-RBM",
              "id": 279900
            },
            {
              "name": "Vybrané partie z matematiky I.",
              "abbreviation": "BPC-VPA",
              "id": 279966
            },
            {
              "name": "Zabezpečovací systémy",
              "abbreviation": "BPC-ZSY",
              "id": 279984
            },
            {
              "name": "Digital Marketing and Social Media",
              "abbreviation": "DMSM",
              "id": 285344
            },
            {
              "name": "E-commerce",
              "abbreviation": "EC",
              "id": 285367
            },
            {
              "name": "Podniková ekonomika",
              "abbreviation": "EPO",
              "id": 285616
            },
            {
              "name": "Francouzština 1",
              "abbreviation": "F1",
              "id": 277368
            },
            {
              "name": "CCNA: základy směrování a technologie VLAN",
              "abbreviation": "I1C",
              "id": 280954
            },
            {
              "name": "Pokročilá témata administrace operačního systému Linux",
              "abbreviation": "ILI",
              "id": 280993
            },
            {
              "name": "Matematické základy fuzzy logiky",
              "abbreviation": "IMF",
              "id": 281069
            },
            {
              "name": "Návrh a implementace IT služeb",
              "abbreviation": "INI",
              "id": 280935
            },
            {
              "name": "Projektová praxe 1",
              "abbreviation": "IP1",
              "id": 280939
            },
            {
              "name": "Programovací seminář",
              "abbreviation": "IPS",
              "id": 280997
            },
            {
              "name": "Desktop systémy Microsoft Windows",
              "abbreviation": "IW1",
              "id": 280950
            },
            {
              "name": "Programování v .NET a C#",
              "abbreviation": "IW5",
              "id": 280952
            },
            {
              "name": "Anglická konverzace na aktuální témata",
              "abbreviation": "JA3",
              "id": 281053
            },
            {
              "name": "Němčina 1",
              "abbreviation": "N1",
              "id": 277569
            },
            {
              "name": "Němčina 3",
              "abbreviation": "N3",
              "id": 277571
            },
            {
              "name": "Němčina 5",
              "abbreviation": "N5",
              "id": 277573
            },
            {
              "name": "Deutsch für Studium und Beruf I",
              "abbreviation": "N7",
              "id": 277575
            },
            {
              "name": "Geografické informační systémy",
              "abbreviation": "NNA008",
              "id": 281594
            },
            {
              "name": "Smart city, region",
              "abbreviation": "NUA026",
              "id": 281739
            },
            {
              "name": "Praktická konverzace, prezentování a firemní komunikace v Angličtině",
              "abbreviation": "PKA",
              "id": 287696
            },
            {
              "name": "Ruština 1",
              "abbreviation": "R1",
              "id": 277770
            },
            {
              "name": "Osobností rozvoj a sebepoznání",
              "abbreviation": "SORS",
              "id": 286513
            },
            {
              "name": "Týmové dovednosti",
              "abbreviation": "STD",
              "id": 286528
            },
            {
              "name": "Počítačová fyzika II",
              "abbreviation": "T2F",
              "id": 277942
            },
            {
              "name": "Španělština pro začátečníky 1",
              "abbreviation": "XPC-ESP1",
              "id": 280734
            },
            {
              "name": "Francouzština pro začátečníky 1",
              "abbreviation": "XPC-FR1",
              "id": 280738
            },
            {
              "name": "Inženýrská pedagogika a didaktika",
              "abbreviation": "XPC-IPD",
              "id": 280741
            },
            {
              "name": "Italština pro začátečníky 1",
              "abbreviation": "XPC-ITA1",
              "id": 280743
            },
            {
              "name": "Kultura projevu a tvorba textů",
              "abbreviation": "XPC-KPT",
              "id": 280747
            },
            {
              "name": "Němčina pro začátečníky 1",
              "abbreviation": "XPC-NE1",
              "id": 280760
            },
            {
              "name": "Němčina pro mírně pokročilé  1",
              "abbreviation": "XPC-NE3",
              "id": 280762
            },
            {
              "name": "Pedagogická psychologie",
              "abbreviation": "XPC-PEP",
              "id": 280765
            },
            {
              "name": "Zahraniční odborná praxe",
              "abbreviation": "ZPX",
              "id": 281169
            },
            {
              "name": "Financování rozvoje podniku",
              "abbreviation": "frpP",
              "id": 285398
            },
            {
              "name": "Finanční trhy",
              "abbreviation": "ftP",
              "id": 285408
            },
            {
              "name": "Makroekonomie 1",
              "abbreviation": "mak1P",
              "id": 285479
            },
            {
              "name": "Management",
              "abbreviation": "manP",
              "id": 285483
            }
          ]
        },
        "SUMMER": {
          "compulsory": [
            {
              "name": "Databázové systémy",
              "abbreviation": "IDS",
              "id": 280905
            },
            {
              "name": "Počítačové komunikace a sítě",
              "abbreviation": "IPK",
              "id": 280936
            },
            {
              "name": "Principy programovacích jazyků a OOP",
              "abbreviation": "IPP",
              "id": 280937
            },
            {
              "name": "Základy počítačové grafiky",
              "abbreviation": "IZG",
              "id": 281099
            },
            {
              "name": "Základy umělé inteligence",
              "abbreviation": "IZU",
              "id": 281005
            },
            {
              "name": "Angličtina B2-2",
              "abbreviation": "0A8",
              "id": 278134
            },
            {
              "name": "Praktická angličtina 4",
              "abbreviation": "BPC-PA4",
              "id": 279866
            },
            {
              "name": "Seminář C++",
              "abbreviation": "ICP",
              "id": 281029
            },
            {
              "name": "Seminář C#",
              "abbreviation": "ICS",
              "id": 280904
            },
            {
              "name": "Seminář Java",
              "abbreviation": "IJA",
              "id": 280990
            },
            {
              "name": "Seminář VHDL",
              "abbreviation": "IVH",
              "id": 281152
            }
          ],
          "optional": [
            {
              "name": "Mobilní roboty",
              "abbreviation": "0MR",
              "id": 278160
            },
            {
              "name": "Angličtina pro Evropu",
              "abbreviation": "AEU",
              "id": 281046
            },
            {
              "name": "Analogová elektronika 2",
              "abbreviation": "BPC-AE2",
              "id": 279663
            },
            {
              "name": "Audio elektronika",
              "abbreviation": "BPC-AUD",
              "id": 279679
            },
            {
              "name": "Komunikační systémy pro IoT",
              "abbreviation": "BPC-IOT",
              "id": 279784
            },
            {
              "name": "Matematika 2",
              "abbreviation": "BPC-MA2A",
              "id": 279809
            },
            {
              "name": "Úvod do molekulární biologie a genetiky",
              "abbreviation": "BPC-MOL",
              "id": 279822
            },
            {
              "name": "Vybrané partie z obnovitelných zdrojů a ukládání energie",
              "abbreviation": "BPC-OZU",
              "id": 279861
            },
            {
              "name": "Počítačová podpora konstruování",
              "abbreviation": "BPC-PPK",
              "id": 279888
            },
            {
              "name": "Robotika a zpracování obrazu",
              "abbreviation": "BPC-PRP",
              "id": 279894
            },
            {
              "name": "Plošné spoje a povrchová montáž",
              "abbreviation": "BPC-PSM",
              "id": 279896
            },
            {
              "name": "Zobrazovací systémy v lékařství",
              "abbreviation": "BPC-ZSL",
              "id": 279981
            },
            {
              "name": "Francouzština 2",
              "abbreviation": "F2",
              "id": 277369
            },
            {
              "name": "Dějiny a filozofie techniky",
              "abbreviation": "FIT",
              "id": 285248
            },
            {
              "name": "CCNA: technologie sítí LAN a WAN",
              "abbreviation": "I2C",
              "id": 280955
            },
            {
              "name": "Pokročilá matematika",
              "abbreviation": "IAM",
              "id": 281027
            },
            {
              "name": "Analýza binárního kódu",
              "abbreviation": "IAN",
              "id": 281028
            },
            {
              "name": "Bezpečnost a počítačové sítě",
              "abbreviation": "IBS",
              "id": 280902
            },
            {
              "name": "Správa serverů IBM zSeries",
              "abbreviation": "IIZ",
              "id": 280989
            },
            {
              "name": "Výpočetní metody v duševním zdraví",
              "abbreviation": "IMHa",
              "id": 288261
            },
            {
              "name": "Projektová praxe 2",
              "abbreviation": "IP2",
              "id": 280942
            },
            {
              "name": "Pokročilé asemblery",
              "abbreviation": "IPA",
              "id": 280996
            },
            {
              "name": "Technika personálních počítačů",
              "abbreviation": "ITP",
              "id": 281150
            },
            {
              "name": "Testování a dynamická analýza",
              "abbreviation": "ITS",
              "id": 281000
            },
            {
              "name": "Serverové systémy Microsoft Windows",
              "abbreviation": "IW2",
              "id": 280951
            },
            {
              "name": "Programování zařízení Apple",
              "abbreviation": "IZA",
              "id": 281003
            },
            {
              "name": "Anglická konverzace na aktuální témata",
              "abbreviation": "JA3",
              "id": 281050
            },
            {
              "name": "Daňová soustava",
              "abbreviation": "KdasP",
              "id": 285338
            },
            {
              "name": "Němčina 4",
              "abbreviation": "N4",
              "id": 277572
            },
            {
              "name": "Němčina 6",
              "abbreviation": "N6",
              "id": 277574
            },
            {
              "name": "Deutsch für Studium und Beruf II",
              "abbreviation": "N8",
              "id": 277576
            },
            {
              "name": "Ruština 2",
              "abbreviation": "R2",
              "id": 277771
            },
            {
              "name": "Elektrické instalace",
              "abbreviation": "XPC-EIC",
              "id": 280494
            },
            {
              "name": "Bezpečná elektrotechnika",
              "abbreviation": "XPC-ELB",
              "id": 280729
            },
            {
              "name": "Španělština pro začátečníky 2",
              "abbreviation": "XPC-ESP2",
              "id": 280735
            },
            {
              "name": "Francouzština pro začátečníky 2",
              "abbreviation": "XPC-FR2",
              "id": 280739
            },
            {
              "name": "Inženýrská pedagogika a didaktika",
              "abbreviation": "XPC-IPD",
              "id": 280742
            },
            {
              "name": "Italština pro začátečníky 2",
              "abbreviation": "XPC-ITA2",
              "id": 280744
            },
            {
              "name": "Kultura projevu a tvorba textů",
              "abbreviation": "XPC-KPT",
              "id": 280748
            },
            {
              "name": "Němčina pro začátečníky 2",
              "abbreviation": "XPC-NE2",
              "id": 280761
            },
            {
              "name": "Němčina pro mírně pokročilé  2",
              "abbreviation": "XPC-NE4",
              "id": 280763
            },
            {
              "name": "Pedagogická psychologie",
              "abbreviation": "XPC-PEP",
              "id": 280764
            },
            {
              "name": "Vybrané partie z matematiky II.",
              "abbreviation": "XPC-VPM",
              "id": 280776
            },
            {
              "name": "Základy financování",
              "abbreviation": "ZFI",
              "id": 285835
            },
            {
              "name": "Zahraniční odborná praxe",
              "abbreviation": "ZPX",
              "id": 281118
            },
            {
              "name": "Finanční analýza a plánování",
              "abbreviation": "fapP",
              "id": 285399
            },
            {
              "name": "Marketing",
              "abbreviation": "marP",
              "id": 285529
            },
            {
              "name": "Mikroekonomie 1",
              "abbreviation": "mik1P",
              "id": 285576
            },
            {
              "name": "Účetnictví",
              "abbreviation": "uceP",
              "id": 285815
            }
          ]
        }
      },
      "3": {
        "WINTER": {
          "compulsory": [
            {
              "name": "Informační systémy",
              "abbreviation": "IIS",
              "id": 280933
            },
            {
              "name": "Mikroprocesorové a vestavěné systémy",
              "abbreviation": "IMP",
              "id": 281143
            },
            {
              "name": "Modelování a simulace",
              "abbreviation": "IMS",
              "id": 280994
            },
            {
              "name": "Síťové aplikace a správa sítí",
              "abbreviation": "ISA",
              "id": 280945
            },
            {
              "name": "Semestrální projekt",
              "abbreviation": "ITT",
              "id": 281151
            },
            {
              "name": "Tvorba uživatelských rozhraní",
              "abbreviation": "ITU",
              "id": 281096
            }
          ],
          "optional": [
            {
              "name": "Řízení a regulace 1",
              "abbreviation": "BPC-RR1",
              "id": 279906
            },
            {
              "name": "Projektová praxe 3",
              "abbreviation": "IP3",
              "id": 280944
            },
            {
              "name": "Zpracování a vizualizace dat v prostředí Python",
              "abbreviation": "IZV",
              "id": 281153
            }
          ]
        },
        "SUMMER": {
          "compulsory": [
            {
              "name": "Bakalářská práce",
              "abbreviation": "IBT",
              "id": 281141
            }
          ],
          "optional": [
            {
              "name": "Řízení a regulace 2",
              "abbreviation": "BPC-RR2",
              "id": 279907
            },
            {
              "name": "Multimédia v počítačových sítích",
              "abbreviation": "IMU",
              "id": 280934
            }
          ]
        }
      }
    }
  }
})

export function getStudyOverviewMock(config?: DataProviderTypes.getStudyOverviewConfig) {
  const data = {
    "years": [
      {
        "value": "2024",
        "label": "2024/2025"
      },
      {
        "value": "2023",
        "label": "2023/2024"
      },
      {
        "value": "2022",
        "label": "2022/2023"
      },
      {
        "value": "2021",
        "label": "2021/2022"
      },
      {
        "value": "2020",
        "label": "2020/2021"
      },
      {
        "value": "2019",
        "label": "2019/2020"
      },
      {
        "value": "2018",
        "label": "2018/2019"
      },
      {
        "value": "2017",
        "label": "2017/2018"
      },
      {
        "value": "2016",
        "label": "2016/2017"
      },
      {
        "value": "2015",
        "label": "2015/2016"
      },
      {
        "value": "2014",
        "label": "2014/2015"
      },
      {
        "value": "2013",
        "label": "2013/2014"
      },
      {
        "value": "2012",
        "label": "2012/2013"
      },
      {
        "value": "2011",
        "label": "2011/2012"
      },
      {
        "value": "2010",
        "label": "2010/2011"
      },
      {
        "value": "2009",
        "label": "2009/2010"
      },
      {
        "value": "2008",
        "label": "2008/2009"
      },
      {
        "value": "2007",
        "label": "2007/2008"
      },
      {
        "value": "2006",
        "label": "2006/2007"
      },
      {
        "value": "2005",
        "label": "2005/2006"
      },
      {
        "value": "2004",
        "label": "2004/2005"
      },
      {
        "value": "2003",
        "label": "2003/2004"
      },
      {
        "value": "2002",
        "label": "2002/2003"
      },
      {
        "value": "2001",
        "label": "2001/2002"
      }
    ],
    "semesters": [
      "WINTER",
      "SUMMER"
    ],
    "degrees": [
      "BACHELOR",
      "MASTER",
      "DOCTORAL"
    ],
    "grades": [
      {
        "key": "1",
        "label": "1BIT"
      },
      {
        "key": "2",
        "label": "2BIT"
      },
      {
        "key": "3",
        "label": "3BIT"
      }
    ],
    "programs": {
      "BACHELOR": [
        {
          "name": "Informační technologie",
          "url": "https://www.fit.vut.cz/study/program/8953/.cs",
          "isEnglish": false,
          "specializations": [],
          "attendanceType": "prezenční studium",
          "abbreviation": "BIT",
          "id": "program-8953"
        }
      ],
      "MASTER": [
        {
          "name": "Informační technologie a umělá inteligence",
          "url": "https://www.fit.vut.cz/study/program/8967/.cs",
          "isEnglish": false,
          "specializations": [
            {
              "abbreviation": "NBIO",
              "name": "Bioinformatika a biocomputing",
              "url": "https://www.fit.vut.cz/study/field/16824/.cs",
              "id": "field-16824"
            },
            {
              "abbreviation": "NISD",
              "name": "Informační systémy a databáze",
              "url": "https://www.fit.vut.cz/study/field/16810/.cs",
              "id": "field-16810"
            },
            {
              "abbreviation": "NISY",
              "name": "Inteligentní systémy",
              "url": "https://www.fit.vut.cz/study/field/16820/.cs",
              "id": "field-16820"
            },
            {
              "abbreviation": "NIDE",
              "name": "Inteligentní zařízení",
              "url": "https://www.fit.vut.cz/study/field/16819/.cs",
              "id": "field-16819"
            },
            {
              "abbreviation": "NCPS",
              "name": "Kyberfyzikální systémy",
              "url": "https://www.fit.vut.cz/study/field/16816/.cs",
              "id": "field-16816"
            },
            {
              "abbreviation": "NSEC",
              "name": "Kybernetická bezpečnost",
              "url": "https://www.fit.vut.cz/study/field/16812/.cs",
              "id": "field-16812"
            },
            {
              "abbreviation": "NMAT",
              "name": "Matematické metody",
              "url": "https://www.fit.vut.cz/study/field/16811/.cs",
              "id": "field-16811"
            },
            {
              "abbreviation": "NGRI",
              "name": "Počítačová grafika a interakce",
              "url": "https://www.fit.vut.cz/study/field/16808/.cs",
              "id": "field-16808"
            },
            {
              "abbreviation": "NNET",
              "name": "Počítačové sítě",
              "url": "https://www.fit.vut.cz/study/field/16814/.cs",
              "id": "field-16814"
            },
            {
              "abbreviation": "NVIZ",
              "name": "Počítačové vidění",
              "url": "https://www.fit.vut.cz/study/field/16826/.cs",
              "id": "field-16826"
            },
            {
              "abbreviation": "NSEN",
              "name": "Softwarové inženýrství",
              "url": "https://www.fit.vut.cz/study/field/16825/.cs",
              "id": "field-16825"
            },
            {
              "abbreviation": "NMAL",
              "name": "Strojové učení",
              "url": "https://www.fit.vut.cz/study/field/16815/.cs",
              "id": "field-16815"
            },
            {
              "abbreviation": "NHPC",
              "name": "Superpočítání",
              "url": "https://www.fit.vut.cz/study/field/16817/.cs",
              "id": "field-16817"
            },
            {
              "abbreviation": "NVER",
              "name": "Verifikace a testování software",
              "url": "https://www.fit.vut.cz/study/field/16818/.cs",
              "id": "field-16818"
            },
            {
              "abbreviation": "NEMB",
              "name": "Vestavěné systémy",
              "url": "https://www.fit.vut.cz/study/field/16823/.cs",
              "id": "field-16823"
            },
            {
              "abbreviation": "NADE",
              "name": "Vývoj aplikací",
              "url": "https://www.fit.vut.cz/study/field/16809/.cs",
              "id": "field-16809"
            },
            {
              "abbreviation": "NSPE",
              "name": "Zpracování zvuku, řeči a přirozeného jazyka",
              "url": "https://www.fit.vut.cz/study/field/16822/.cs",
              "id": "field-16822"
            }
          ],
          "attendanceType": "prezenční studium",
          "abbreviation": "MITAI",
          "id": "program-8967"
        }
      ],
      "DOCTORAL": [
        {
          "name": "Informační technologie",
          "url": "https://www.fit.vut.cz/study/program/8956/.cs",
          "isEnglish": false,
          "specializations": [],
          "attendanceType": "prezenční studium",
          "abbreviation": "DIT",
          "id": "program-8956"
        },
        {
          "name": "Informační technologie",
          "url": "https://www.fit.vut.cz/study/program/8955/.cs",
          "isEnglish": false,
          "specializations": [],
          "attendanceType": "kombinované studium",
          "abbreviation": "DIT",
          "id": "program-8955"
        },
        {
          "name": "Výpočetní technika a informatika",
          "url": "https://www.fit.vut.cz/study/program/9229/.cs",
          "isEnglish": false,
          "specializations": [
            {
              "abbreviation": "DVI4",
              "name": "Výpočetní technika a informatika",
              "url": "https://www.fit.vut.cz/study/field/17280/.cs",
              "id": "field-17280"
            }
          ],
          "attendanceType": "prezenční studium",
          "abbreviation": "VTI-DR-4",
          "id": "program-9229"
        },
        {
          "name": "Výpočetní technika a informatika",
          "url": "https://www.fit.vut.cz/study/program/9230/.cs",
          "isEnglish": false,
          "specializations": [
            {
              "abbreviation": "DVI4",
              "name": "Výpočetní technika a informatika",
              "url": "https://www.fit.vut.cz/study/field/17281/.cs",
              "id": "field-17281"
            }
          ],
          "attendanceType": "kombinované studium",
          "abbreviation": "VTI-DR-4",
          "id": "program-9230"
        }
      ]
    },
    "courses": {
      "1": {
        "WINTER": {
          "compulsory": [
            {
              "name": "Diskrétní matematika",
              "abbreviation": "IDM",
              "id": "281068"
            },
            {
              "name": "Elektronika pro informační technologie",
              "abbreviation": "IEL",
              "id": "281030"
            },
            {
              "name": "Lineární algebra",
              "abbreviation": "ILG",
              "id": "281066"
            },
            {
              "name": "Úvod do softwarového inženýrství",
              "abbreviation": "IUS",
              "id": "281002"
            },
            {
              "name": "Základy programování",
              "abbreviation": "IZP",
              "id": "280953"
            },
            {
              "name": "Zkouška z obecné angličtiny B1",
              "abbreviation": "GEN",
              "id": "281032"
            },
            {
              "name": "Zkouška z angličtiny na úrovni B1",
              "abbreviation": "ZAN4",
              "id": "281047"
            }
          ],
          "optional": [
            {
              "name": "Matematický software",
              "abbreviation": "0MS",
              "id": "278161"
            },
            {
              "name": "Aplikovaná herní studia – výzkum a design",
              "abbreviation": "1AHS-L",
              "id": "278629"
            },
            {
              "name": "3D tisk a digitální výroba pro kreativní obory 1",
              "abbreviation": "1DS-Z",
              "id": "279248"
            },
            {
              "name": "Herní studia",
              "abbreviation": "1HS-Z",
              "id": "278749"
            },
            {
              "name": "3D optická digitalizace 1",
              "abbreviation": "1ODI-Z",
              "id": "279244"
            },
            {
              "name": "Architektura 20. století",
              "abbreviation": "ACHE20",
              "id": "278633"
            },
            {
              "name": "Aktuální témata grafického designu",
              "abbreviation": "ATGD",
              "id": "278613"
            },
            {
              "name": "Daňový systém ČR",
              "abbreviation": "BPC-DSY",
              "id": "279726"
            },
            {
              "name": "Elektrotechnický seminář",
              "abbreviation": "BPC-ELSA",
              "id": "279740"
            },
            {
              "name": "Fyzika 1",
              "abbreviation": "BPC-FY1B",
              "id": "279766"
            },
            {
              "name": "Fyzika v elektrotechnice",
              "abbreviation": "BPC-FYE",
              "id": "279759"
            },
            {
              "name": "GIS",
              "abbreviation": "BRA011",
              "id": "281939"
            },
            {
              "name": "Dějiny a kontexty fotografie 1",
              "abbreviation": "DKFI-Z",
              "id": "278685"
            },
            {
              "name": "Filozofie a kultura",
              "abbreviation": "FIK",
              "id": "285246"
            },
            {
              "name": "Dějiny a filozofie techniky",
              "abbreviation": "FIT",
              "id": "285247"
            },
            {
              "name": "Manažerská komunikace a prezentace",
              "abbreviation": "HKO",
              "id": "281135"
            },
            {
              "name": "Manažerské vedení lidí a řízení času",
              "abbreviation": "HVR",
              "id": "281139"
            },
            {
              "name": "Fyzikální seminář",
              "abbreviation": "IFS",
              "id": "280895"
            },
            {
              "name": "Kruhové konzultace",
              "abbreviation": "IKK",
              "id": "281091"
            },
            {
              "name": "Počítačový seminář",
              "abbreviation": "ISC",
              "id": "280946"
            },
            {
              "name": "Matematický seminář",
              "abbreviation": "ISM",
              "id": "281067"
            },
            {
              "name": "Informační výchova a gramotnost",
              "abbreviation": "IVG",
              "id": "280888"
            },
            {
              "name": "Kurz pornostudií",
              "abbreviation": "KPO-Z",
              "id": "278779"
            },
            {
              "name": "Právní minimum",
              "abbreviation": "PRM",
              "id": "285250"
            },
            {
              "name": "Rétorika",
              "abbreviation": "RET",
              "id": "285251"
            },
            {
              "name": "Vizuální styly digitálních her 1",
              "abbreviation": "VSDH1",
              "id": "279186"
            },
            {
              "name": "Podnikatelské minimum",
              "abbreviation": "XPC-POM",
              "id": "280767"
            }
          ]
        },
        "SUMMER": {
          "compulsory": [
            {
              "name": "Matematická analýza 1",
              "abbreviation": "IMA1",
              "id": "281065"
            },
            {
              "name": "Návrh číslicových systémů",
              "abbreviation": "INC",
              "id": "281145"
            },
            {
              "name": "Operační systémy",
              "abbreviation": "IOS",
              "id": "280995"
            },
            {
              "name": "Programování na strojové úrovni",
              "abbreviation": "ISU",
              "id": "280999"
            },
            {
              "name": "Základy logiky pro informatiky",
              "abbreviation": "IZLO",
              "id": "281004"
            },
            {
              "name": "Angličtina C1-2",
              "abbreviation": "0AX",
              "id": "278129"
            },
            {
              "name": "Angličtina pro IT",
              "abbreviation": "AIT",
              "id": "281043"
            },
            {
              "name": "Angličtina 1: mírně pokročilí 1",
              "abbreviation": "BAN1",
              "id": "281042"
            },
            {
              "name": "Angličtina 2: mírně pokročilí 2",
              "abbreviation": "BAN2",
              "id": "281040"
            },
            {
              "name": "Angličtina 3: středně pokročilí 1",
              "abbreviation": "BAN3",
              "id": "281038"
            },
            {
              "name": "Angličtina 4: středně pokročilí 2",
              "abbreviation": "BAN4",
              "id": "281036"
            },
            {
              "name": "Praktická angličtina 2",
              "abbreviation": "BPC-PA2",
              "id": "279863"
            },
            {
              "name": "Zkouška z obecné angličtiny B1",
              "abbreviation": "GEN",
              "id": "281033"
            },
            {
              "name": "Angličtina pro FCE 2",
              "abbreviation": "XPC-FCE2",
              "id": "280737"
            },
            {
              "name": "Seminář VHDL",
              "abbreviation": "IVH",
              "id": "281152"
            }
          ],
          "optional": [
            {
              "name": "Matematické výpočty pomocí MAPLE",
              "abbreviation": "0MV",
              "id": "278163"
            },
            {
              "name": "English Skills for Workplace Communication",
              "abbreviation": "0SE",
              "id": "278196"
            },
            {
              "name": "CNC obrábění – Roboti v umělecké praxi",
              "abbreviation": "1CNCO",
              "id": "278672"
            },
            {
              "name": "3D tisk a digitální výroba pro kreativní obory 2",
              "abbreviation": "1DS-2",
              "id": "279249"
            },
            {
              "name": "Herní design - Digitální hry",
              "abbreviation": "1HERDES",
              "id": "278748"
            },
            {
              "name": "Kritická analýza digitálních her",
              "abbreviation": "1KADH-L",
              "id": "278777"
            },
            {
              "name": "3D optická digitalizace 2",
              "abbreviation": "1ODI-L",
              "id": "279245"
            },
            {
              "name": "Autorská práva",
              "abbreviation": "AUP-L",
              "id": "278657"
            },
            {
              "name": "Dějiny a kontexty fotografie 2",
              "abbreviation": "DKFII-L",
              "id": "278686"
            },
            {
              "name": "Filozofie a kultura",
              "abbreviation": "FIK",
              "id": "285245"
            },
            {
              "name": "Manažerská komunikace a prezentace",
              "abbreviation": "HKO",
              "id": "281136"
            },
            {
              "name": "Hliněné stavitelství",
              "abbreviation": "HLS-KE",
              "id": "276931"
            },
            {
              "name": "Manažerské vedení lidí a řízení času",
              "abbreviation": "HVR",
              "id": "281140"
            },
            {
              "name": "Jazyk C",
              "abbreviation": "IJC",
              "id": "280992"
            },
            {
              "name": "Mechanika a akustika",
              "abbreviation": "IMK",
              "id": "280898"
            },
            {
              "name": "Periferní zařízení",
              "abbreviation": "IPZ",
              "id": "281148"
            },
            {
              "name": "Skriptovací jazyky",
              "abbreviation": "ISJ",
              "id": "281092"
            },
            {
              "name": "Tvorba webových stránek",
              "abbreviation": "ITW",
              "id": "280948"
            },
            {
              "name": "Typografie a publikování",
              "abbreviation": "ITY",
              "id": "281001"
            },
            {
              "name": "Praktické aspekty vývoje software",
              "abbreviation": "IVS",
              "id": "281098"
            },
            {
              "name": "Němčina 2",
              "abbreviation": "N2",
              "id": "277570"
            },
            {
              "name": "Podnikatelská laboratoř",
              "abbreviation": "PLAB",
              "id": "285615"
            },
            {
              "name": "Právní minimum",
              "abbreviation": "PRM",
              "id": "285249"
            },
            {
              "name": "Rétorika",
              "abbreviation": "RET",
              "id": "285252"
            },
            {
              "name": "Počítačová fyzika I",
              "abbreviation": "T1F",
              "id": "277939"
            },
            {
              "name": "Vizuální styly digitálních her 2",
              "abbreviation": "VSDH2",
              "id": "279187"
            },
            {
              "name": "Obchodní angličtina",
              "abbreviation": "XPC-BEN",
              "id": "280718"
            }
          ]
        }
      },
      "2": {
        "WINTER": {
          "compulsory": [
            {
              "name": "Algoritmy",
              "abbreviation": "IAL",
              "id": "280900"
            },
            {
              "name": "Formální jazyky a překladače",
              "abbreviation": "IFJ",
              "id": "280931"
            },
            {
              "name": "Matematická analýza 2",
              "abbreviation": "IMA2",
              "id": "281064"
            },
            {
              "name": "Návrh počítačových systémů",
              "abbreviation": "INP",
              "id": "281147"
            },
            {
              "name": "Pravděpodobnost a statistika",
              "abbreviation": "IPT",
              "id": "281070"
            },
            {
              "name": "Signály a systémy",
              "abbreviation": "ISS",
              "id": "281093"
            },
            {
              "name": "Angličtina B2-1",
              "abbreviation": "0A7",
              "id": "278133"
            },
            {
              "name": "Angličtina C1-1",
              "abbreviation": "0A9",
              "id": "278135"
            },
            {
              "name": "Angličtina pro IT",
              "abbreviation": "AIT",
              "id": "281044"
            },
            {
              "name": "Angličtina 1: mírně pokročilí 1",
              "abbreviation": "BAN1",
              "id": "281041"
            },
            {
              "name": "Angličtina 2: mírně pokročilí 2",
              "abbreviation": "BAN2",
              "id": "281039"
            },
            {
              "name": "Angličtina 3: středně pokročilí 1",
              "abbreviation": "BAN3",
              "id": "281037"
            },
            {
              "name": "Angličtina 4: středně pokročilí 2",
              "abbreviation": "BAN4",
              "id": "281035"
            },
            {
              "name": "Praktická angličtina 1",
              "abbreviation": "BPC-PA1",
              "id": "279862"
            },
            {
              "name": "Praktická angličtina 3",
              "abbreviation": "BPC-PA3",
              "id": "279864"
            },
            {
              "name": "Angličtina pro FCE 1",
              "abbreviation": "XPC-FCE1",
              "id": "280736"
            }
          ],
          "optional": [
            {
              "name": "English Skills for Workplace Communication",
              "abbreviation": "0SE",
              "id": "278195"
            },
            {
              "name": "Základy herního vývoje",
              "abbreviation": "1ZHERV",
              "id": "279223"
            },
            {
              "name": "Angličtina pro Evropu",
              "abbreviation": "AEU",
              "id": "281045"
            },
            {
              "name": "Analogová elektronika 1",
              "abbreviation": "BPC-AE1",
              "id": "279662"
            },
            {
              "name": "Analogová technika",
              "abbreviation": "BPC-ANA",
              "id": "279671"
            },
            {
              "name": "Elektroakustika 1",
              "abbreviation": "BPC-ELA",
              "id": "279733"
            },
            {
              "name": "Návrh a realizace elektronických přístrojů",
              "abbreviation": "BPC-NRP",
              "id": "279842"
            },
            {
              "name": "Robotika a manipulátory",
              "abbreviation": "BPC-RBM",
              "id": "279900"
            },
            {
              "name": "Vybrané partie z matematiky I.",
              "abbreviation": "BPC-VPA",
              "id": "279966"
            },
            {
              "name": "Zabezpečovací systémy",
              "abbreviation": "BPC-ZSY",
              "id": "279984"
            },
            {
              "name": "Digital Marketing and Social Media",
              "abbreviation": "DMSM",
              "id": "285344"
            },
            {
              "name": "E-commerce",
              "abbreviation": "EC",
              "id": "285367"
            },
            {
              "name": "Podniková ekonomika",
              "abbreviation": "EPO",
              "id": "285616"
            },
            {
              "name": "Francouzština 1",
              "abbreviation": "F1",
              "id": "277368"
            },
            {
              "name": "CCNA: základy směrování a technologie VLAN",
              "abbreviation": "I1C",
              "id": "280954"
            },
            {
              "name": "Pokročilá témata administrace operačního systému Linux",
              "abbreviation": "ILI",
              "id": "280993"
            },
            {
              "name": "Matematické základy fuzzy logiky",
              "abbreviation": "IMF",
              "id": "281069"
            },
            {
              "name": "Návrh a implementace IT služeb",
              "abbreviation": "INI",
              "id": "280935"
            },
            {
              "name": "Projektová praxe 1",
              "abbreviation": "IP1",
              "id": "280939"
            },
            {
              "name": "Programovací seminář",
              "abbreviation": "IPS",
              "id": "280997"
            },
            {
              "name": "Desktop systémy Microsoft Windows",
              "abbreviation": "IW1",
              "id": "280950"
            },
            {
              "name": "Programování v .NET a C#",
              "abbreviation": "IW5",
              "id": "280952"
            },
            {
              "name": "Anglická konverzace na aktuální témata",
              "abbreviation": "JA3",
              "id": "281053"
            },
            {
              "name": "Němčina 1",
              "abbreviation": "N1",
              "id": "277569"
            },
            {
              "name": "Němčina 3",
              "abbreviation": "N3",
              "id": "277571"
            },
            {
              "name": "Němčina 5",
              "abbreviation": "N5",
              "id": "277573"
            },
            {
              "name": "Deutsch für Studium und Beruf I",
              "abbreviation": "N7",
              "id": "277575"
            },
            {
              "name": "Geografické informační systémy",
              "abbreviation": "NNA008",
              "id": "281594"
            },
            {
              "name": "Smart city, region",
              "abbreviation": "NUA026",
              "id": "281739"
            },
            {
              "name": "Praktická konverzace, prezentování a firemní komunikace v Angličtině",
              "abbreviation": "PKA",
              "id": "287696"
            },
            {
              "name": "Ruština 1",
              "abbreviation": "R1",
              "id": "277770"
            },
            {
              "name": "Osobností rozvoj a sebepoznání",
              "abbreviation": "SORS",
              "id": "286513"
            },
            {
              "name": "Týmové dovednosti",
              "abbreviation": "STD",
              "id": "286528"
            },
            {
              "name": "Počítačová fyzika II",
              "abbreviation": "T2F",
              "id": "277942"
            },
            {
              "name": "Španělština pro začátečníky 1",
              "abbreviation": "XPC-ESP1",
              "id": "280734"
            },
            {
              "name": "Francouzština pro začátečníky 1",
              "abbreviation": "XPC-FR1",
              "id": "280738"
            },
            {
              "name": "Inženýrská pedagogika a didaktika",
              "abbreviation": "XPC-IPD",
              "id": "280741"
            },
            {
              "name": "Italština pro začátečníky 1",
              "abbreviation": "XPC-ITA1",
              "id": "280743"
            },
            {
              "name": "Kultura projevu a tvorba textů",
              "abbreviation": "XPC-KPT",
              "id": "280747"
            },
            {
              "name": "Němčina pro začátečníky 1",
              "abbreviation": "XPC-NE1",
              "id": "280760"
            },
            {
              "name": "Němčina pro mírně pokročilé  1",
              "abbreviation": "XPC-NE3",
              "id": "280762"
            },
            {
              "name": "Pedagogická psychologie",
              "abbreviation": "XPC-PEP",
              "id": "280765"
            },
            {
              "name": "Zahraniční odborná praxe",
              "abbreviation": "ZPX",
              "id": "281169"
            },
            {
              "name": "Financování rozvoje podniku",
              "abbreviation": "frpP",
              "id": "285398"
            },
            {
              "name": "Finanční trhy",
              "abbreviation": "ftP",
              "id": "285408"
            },
            {
              "name": "Makroekonomie 1",
              "abbreviation": "mak1P",
              "id": "285479"
            },
            {
              "name": "Management",
              "abbreviation": "manP",
              "id": "285483"
            }
          ]
        },
        "SUMMER": {
          "compulsory": [
            {
              "name": "Databázové systémy",
              "abbreviation": "IDS",
              "id": "280905"
            },
            {
              "name": "Počítačové komunikace a sítě",
              "abbreviation": "IPK",
              "id": "280936"
            },
            {
              "name": "Principy programovacích jazyků a OOP",
              "abbreviation": "IPP",
              "id": "280937"
            },
            {
              "name": "Základy počítačové grafiky",
              "abbreviation": "IZG",
              "id": "281099"
            },
            {
              "name": "Základy umělé inteligence",
              "abbreviation": "IZU",
              "id": "281005"
            },
            {
              "name": "Angličtina B2-2",
              "abbreviation": "0A8",
              "id": "278134"
            },
            {
              "name": "Praktická angličtina 4",
              "abbreviation": "BPC-PA4",
              "id": "279866"
            },
            {
              "name": "Seminář C++",
              "abbreviation": "ICP",
              "id": "281029"
            },
            {
              "name": "Seminář C#",
              "abbreviation": "ICS",
              "id": "280904"
            },
            {
              "name": "Seminář Java",
              "abbreviation": "IJA",
              "id": "280990"
            },
            {
              "name": "Seminář VHDL",
              "abbreviation": "IVH",
              "id": "281152"
            }
          ],
          "optional": [
            {
              "name": "Mobilní roboty",
              "abbreviation": "0MR",
              "id": "278160"
            },
            {
              "name": "Angličtina pro Evropu",
              "abbreviation": "AEU",
              "id": "281046"
            },
            {
              "name": "Analogová elektronika 2",
              "abbreviation": "BPC-AE2",
              "id": "279663"
            },
            {
              "name": "Audio elektronika",
              "abbreviation": "BPC-AUD",
              "id": "279679"
            },
            {
              "name": "Komunikační systémy pro IoT",
              "abbreviation": "BPC-IOT",
              "id": "279784"
            },
            {
              "name": "Matematika 2",
              "abbreviation": "BPC-MA2A",
              "id": "279809"
            },
            {
              "name": "Úvod do molekulární biologie a genetiky",
              "abbreviation": "BPC-MOL",
              "id": "279822"
            },
            {
              "name": "Vybrané partie z obnovitelných zdrojů a ukládání energie",
              "abbreviation": "BPC-OZU",
              "id": "279861"
            },
            {
              "name": "Počítačová podpora konstruování",
              "abbreviation": "BPC-PPK",
              "id": "279888"
            },
            {
              "name": "Robotika a zpracování obrazu",
              "abbreviation": "BPC-PRP",
              "id": "279894"
            },
            {
              "name": "Plošné spoje a povrchová montáž",
              "abbreviation": "BPC-PSM",
              "id": "279896"
            },
            {
              "name": "Zobrazovací systémy v lékařství",
              "abbreviation": "BPC-ZSL",
              "id": "279981"
            },
            {
              "name": "Francouzština 2",
              "abbreviation": "F2",
              "id": "277369"
            },
            {
              "name": "Dějiny a filozofie techniky",
              "abbreviation": "FIT",
              "id": "285248"
            },
            {
              "name": "CCNA: technologie sítí LAN a WAN",
              "abbreviation": "I2C",
              "id": "280955"
            },
            {
              "name": "Pokročilá matematika",
              "abbreviation": "IAM",
              "id": "281027"
            },
            {
              "name": "Analýza binárního kódu",
              "abbreviation": "IAN",
              "id": "281028"
            },
            {
              "name": "Bezpečnost a počítačové sítě",
              "abbreviation": "IBS",
              "id": "280902"
            },
            {
              "name": "Správa serverů IBM zSeries",
              "abbreviation": "IIZ",
              "id": "280989"
            },
            {
              "name": "Výpočetní metody v duševním zdraví",
              "abbreviation": "IMHa",
              "id": "288261"
            },
            {
              "name": "Projektová praxe 2",
              "abbreviation": "IP2",
              "id": "280942"
            },
            {
              "name": "Pokročilé asemblery",
              "abbreviation": "IPA",
              "id": "280996"
            },
            {
              "name": "Technika personálních počítačů",
              "abbreviation": "ITP",
              "id": "281150"
            },
            {
              "name": "Testování a dynamická analýza",
              "abbreviation": "ITS",
              "id": "281000"
            },
            {
              "name": "Serverové systémy Microsoft Windows",
              "abbreviation": "IW2",
              "id": "280951"
            },
            {
              "name": "Programování zařízení Apple",
              "abbreviation": "IZA",
              "id": "281003"
            },
            {
              "name": "Anglická konverzace na aktuální témata",
              "abbreviation": "JA3",
              "id": "281050"
            },
            {
              "name": "Daňová soustava",
              "abbreviation": "KdasP",
              "id": "285338"
            },
            {
              "name": "Němčina 4",
              "abbreviation": "N4",
              "id": "277572"
            },
            {
              "name": "Němčina 6",
              "abbreviation": "N6",
              "id": "277574"
            },
            {
              "name": "Deutsch für Studium und Beruf II",
              "abbreviation": "N8",
              "id": "277576"
            },
            {
              "name": "Ruština 2",
              "abbreviation": "R2",
              "id": "277771"
            },
            {
              "name": "Elektrické instalace",
              "abbreviation": "XPC-EIC",
              "id": "280494"
            },
            {
              "name": "Bezpečná elektrotechnika",
              "abbreviation": "XPC-ELB",
              "id": "280729"
            },
            {
              "name": "Španělština pro začátečníky 2",
              "abbreviation": "XPC-ESP2",
              "id": "280735"
            },
            {
              "name": "Francouzština pro začátečníky 2",
              "abbreviation": "XPC-FR2",
              "id": "280739"
            },
            {
              "name": "Inženýrská pedagogika a didaktika",
              "abbreviation": "XPC-IPD",
              "id": "280742"
            },
            {
              "name": "Italština pro začátečníky 2",
              "abbreviation": "XPC-ITA2",
              "id": "280744"
            },
            {
              "name": "Kultura projevu a tvorba textů",
              "abbreviation": "XPC-KPT",
              "id": "280748"
            },
            {
              "name": "Němčina pro začátečníky 2",
              "abbreviation": "XPC-NE2",
              "id": "280761"
            },
            {
              "name": "Němčina pro mírně pokročilé  2",
              "abbreviation": "XPC-NE4",
              "id": "280763"
            },
            {
              "name": "Pedagogická psychologie",
              "abbreviation": "XPC-PEP",
              "id": "280764"
            },
            {
              "name": "Vybrané partie z matematiky II.",
              "abbreviation": "XPC-VPM",
              "id": "280776"
            },
            {
              "name": "Základy financování",
              "abbreviation": "ZFI",
              "id": "285835"
            },
            {
              "name": "Zahraniční odborná praxe",
              "abbreviation": "ZPX",
              "id": "281118"
            },
            {
              "name": "Finanční analýza a plánování",
              "abbreviation": "fapP",
              "id": "285399"
            },
            {
              "name": "Marketing",
              "abbreviation": "marP",
              "id": "285529"
            },
            {
              "name": "Mikroekonomie 1",
              "abbreviation": "mik1P",
              "id": "285576"
            },
            {
              "name": "Účetnictví",
              "abbreviation": "uceP",
              "id": "285815"
            }
          ]
        }
      },
      "3": {
        "WINTER": {
          "compulsory": [
            {
              "name": "Informační systémy",
              "abbreviation": "IIS",
              "id": "280933"
            },
            {
              "name": "Mikroprocesorové a vestavěné systémy",
              "abbreviation": "IMP",
              "id": "281143"
            },
            {
              "name": "Modelování a simulace",
              "abbreviation": "IMS",
              "id": "280994"
            },
            {
              "name": "Síťové aplikace a správa sítí",
              "abbreviation": "ISA",
              "id": "280945"
            },
            {
              "name": "Semestrální projekt",
              "abbreviation": "ITT",
              "id": "281151"
            },
            {
              "name": "Tvorba uživatelských rozhraní",
              "abbreviation": "ITU",
              "id": "281096"
            }
          ],
          "optional": [
            {
              "name": "Řízení a regulace 1",
              "abbreviation": "BPC-RR1",
              "id": "279906"
            },
            {
              "name": "Projektová praxe 3",
              "abbreviation": "IP3",
              "id": "280944"
            },
            {
              "name": "Zpracování a vizualizace dat v prostředí Python",
              "abbreviation": "IZV",
              "id": "281153"
            }
          ]
        },
        "SUMMER": {
          "compulsory": [
            {
              "name": "Bakalářská práce",
              "abbreviation": "IBT",
              "id": "281141"
            }
          ],
          "optional": [
            {
              "name": "Řízení a regulace 2",
              "abbreviation": "BPC-RR2",
              "id": "279907"
            },
            {
              "name": "Multimédia v počítačových sítích",
              "abbreviation": "IMU",
              "id": "280934"
            }
          ]
        }
      }
    }
  }

  const currentYear = {
    "value": "2024",
    "label": "2024/2025"
  }

  const values: StudyOverview["values"] = {
    year: config ? data.years.find(year => year.value === config.year) ?? currentYear : currentYear,
    degree: (config?.degree) ?? DEGREE.BACHELOR,
    program: config?.program ? Object.values(data.programs[(config?.degree) ?? DEGREE.BACHELOR]).flatMap(program => [program, ...program.specializations]).find(programOrSpecialization => programOrSpecialization.id === config.program) : Object.values(data.programs[(config?.degree) ?? DEGREE.BACHELOR]).length === 1 ? Object.values(data.programs[(config?.degree) ?? DEGREE.BACHELOR])[0] : undefined
  }

  return {
    values,
    data,
  }
}

export function getStudyCoursesDetailsMock(config: DataProviderTypes.getStudyCoursesDetailsConfig) {
  const data = [
    {
      "data": [
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "09:00",
          "end": "10:50",
          "capacity": "64",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Tůma",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "T8/T 3.02",
          "start": "15:00",
          "end": "16:50",
          "capacity": "56",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Tůma",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "T8/T 3.02",
          "start": "17:00",
          "end": "18:50",
          "capacity": "56",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Tůma",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "TUE",
          "weeks": "",
          "room": "D105+6",
          "start": "08:00",
          "end": "09:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Hliněná",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "09:00",
          "end": "10:50",
          "capacity": "64",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Tůma",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "11:00",
          "end": "12:50",
          "capacity": "64",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Tůma",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "TUE",
          "weeks": "",
          "room": "D105+6",
          "start": "12:00",
          "end": "13:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Hliněná",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "13:00",
          "end": "14:50",
          "capacity": "64",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Tůma",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "T8/T 3.02",
          "start": "09:00",
          "end": "10:50",
          "capacity": "56",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Vážanová",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "T8/T 3.02",
          "start": "11:00",
          "end": "12:50",
          "capacity": "56",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Vážanová",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "D0207",
          "start": "14:00",
          "end": "15:50",
          "capacity": "66",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hliněná",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "D0207",
          "start": "16:00",
          "end": "17:50",
          "capacity": "66",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Tůma",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1.",
          "room": "T8/T 3.02",
          "start": "17:00",
          "end": "18:50",
          "capacity": "0",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Fuchs",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A113",
          "start": "10:00",
          "end": "11:50",
          "capacity": "64",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hliněná",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "1.",
          "room": "A113",
          "start": "14:00",
          "end": "15:50",
          "capacity": "0",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hliněná",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "12:00",
          "end": "13:50",
          "capacity": "64",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Fuchs",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "14:00",
          "end": "15:50",
          "capacity": "64",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Fuchs",
          "note": null
        }
      ],
      "detail": {
        "abbreviation": "IDM",
        "name": "Diskrétní matematika",
        "link": "https://www.fit.vut.cz/study/course/281068/.cs",
        "timeSpan": {
          "LECTURE": 26,
          "LABORATORY": 0,
          "EXERCISE": 26,
          "SEMINAR": 0
        }
      }
    },
    {
      "data": [
        {
          "type": "LECTURE",
          "day": "MON",
          "weeks": "1. 2. 3. 6. 8. 12. 13.",
          "room": "E112+4,5",
          "start": "10:00",
          "end": "11:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Růžička",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "MON",
          "weeks": "4. 5. 9. 11.",
          "room": "E112+4,5",
          "start": "10:00",
          "end": "11:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Peringer",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "MON",
          "weeks": "10.",
          "room": "E112+4,5",
          "start": "10:00",
          "end": "11:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "3. 5. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Strnadel",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Strnadel",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "13:00",
          "end": "14:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "13:00",
          "end": "14:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "17:00",
          "end": "18:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Šimek",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "17:00",
          "end": "18:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Šimek",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "07:00",
          "end": "08:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "07:00",
          "end": "08:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "TUE",
          "weeks": "1. 2. 3. 6. 8. 12. 13.",
          "room": "D105+6",
          "start": "10:00",
          "end": "11:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Růžička",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "TUE",
          "weeks": "4. 5. 7. 9. 11.",
          "room": "D105+6",
          "start": "10:00",
          "end": "11:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Peringer",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "TUE",
          "weeks": "10.",
          "room": "D105+6",
          "start": "10:00",
          "end": "11:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Goldmann",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Goldmann",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "17:00",
          "end": "18:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Goldmann",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "17:00",
          "end": "18:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Goldmann",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "WED",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "07:00",
          "end": "08:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "WED",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "07:00",
          "end": "08:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "WED",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "09:00",
          "end": "10:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Plevač",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "WED",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "09:00",
          "end": "10:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Plevač",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "1. 2.",
          "room": "D105+6",
          "start": "10:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Šátek",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "3. 7.",
          "room": "D105+6",
          "start": "10:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "4. 5. 9. 11.",
          "room": "D105+6",
          "start": "10:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Peringer",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "6. 8. 12.",
          "room": "D105+6",
          "start": "10:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Růžička",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "10.",
          "room": "D105+6",
          "start": "10:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "13.",
          "room": "D105+6",
          "start": "10:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Šátek, Veigend",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "WED",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Strnadel",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "WED",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Strnadel",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "1. 2. 4. 9. 11.",
          "room": "D105+6",
          "start": "11:00",
          "end": "11:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Šátek",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "3. 7.",
          "room": "D105+6",
          "start": "11:00",
          "end": "11:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "5. 6. 8. 10. 12. 13.",
          "room": "D105+6",
          "start": "11:00",
          "end": "11:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "1. 2. 3.",
          "room": "D105",
          "start": "14:00",
          "end": "14:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Šátek",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "4. 5. 9. 11.",
          "room": "D105",
          "start": "14:00",
          "end": "14:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Peringer",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "6. 8. 12.",
          "room": "D105",
          "start": "14:00",
          "end": "14:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Růžička",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "7.",
          "room": "D105",
          "start": "14:00",
          "end": "14:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "10.",
          "room": "D105",
          "start": "14:00",
          "end": "14:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "13.",
          "room": "D105",
          "start": "14:00",
          "end": "14:50",
          "capacity": "319",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Šátek, Veigend",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 9. 11.",
          "room": "D105",
          "start": "15:00",
          "end": "15:50",
          "capacity": "320",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Šátek",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "5. 6. 8. 10. 12. 13.",
          "room": "D105",
          "start": "15:00",
          "end": "15:50",
          "capacity": "320",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "7.",
          "room": "D105",
          "start": "15:00",
          "end": "15:50",
          "capacity": "320",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "13:00",
          "end": "14:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "13:00",
          "end": "14:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Bidlo",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Bidlo",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "17:00",
          "end": "18:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Šimek",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "THU",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "17:00",
          "end": "18:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Šimek",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "07:00",
          "end": "08:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "07:00",
          "end": "08:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "09:00",
          "end": "10:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "09:00",
          "end": "10:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "11:00",
          "end": "12:50",
          "capacity": "21",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Nečasová",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "13:00",
          "end": "14:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Bidlo",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "13:00",
          "end": "14:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Bidlo",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "3. 5. 7. 9. 11. 13.",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": "lichý",
          "room": "L306.1 L306.2",
          "start": "15:00",
          "end": "16:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozman",
          "note": null
        }
      ],
      "detail": {
        "abbreviation": "IEL",
        "name": "Elektronika pro informační technologie",
        "link": "https://www.fit.vut.cz/study/course/281030/.cs",
        "timeSpan": {
          "LECTURE": 39,
          "LABORATORY": 12,
          "EXERCISE": 0,
          "SEMINAR": 6
        }
      }
    },
    {
      "data": [
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A113",
          "start": "08:00",
          "end": "09:50",
          "capacity": "63",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hartmanová",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A113",
          "start": "10:00",
          "end": "11:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hartmanová",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A113",
          "start": "12:00",
          "end": "13:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hartmanová",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "1. 2. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "T8/T 3.12",
          "start": "17:00",
          "end": "18:50",
          "capacity": "0",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hlavičková",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "T8/T 3.12",
          "start": "09:00",
          "end": "10:50",
          "capacity": "56",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Pekárková",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "TUE",
          "weeks": "",
          "room": "Aula profesora Braunera",
          "start": "13:00",
          "end": "14:50",
          "capacity": "338",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Hlavičková",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1.",
          "room": "A112",
          "start": "07:00",
          "end": "08:50",
          "capacity": "0",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "09:00",
          "end": "10:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Vévodová",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "11:00",
          "end": "12:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Vévodová",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "",
          "room": "D105+7",
          "start": "12:00",
          "end": "13:50",
          "capacity": "503",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Hliněná",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A112",
          "start": "13:00",
          "end": "14:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Vévodová",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A113",
          "start": "15:00",
          "end": "16:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hlavičková",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12. 13.",
          "room": "D0207",
          "start": "12:00",
          "end": "13:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Pekárková",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "T8/T 3.02",
          "start": "13:00",
          "end": "14:50",
          "capacity": "56",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hlavičková",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12. 13.",
          "room": "D0207",
          "start": "14:00",
          "end": "15:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Pekárková",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "1.",
          "room": "T8/T 5.22",
          "start": "07:00",
          "end": "08:50",
          "capacity": "0",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A113",
          "start": "08:00",
          "end": "09:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hliněná",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "",
          "room": "T8/T 3.12",
          "start": "09:00",
          "end": "10:50",
          "capacity": "0",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "A113",
          "start": "10:00",
          "end": "11:50",
          "capacity": "60",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Hliněná",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "1.",
          "room": "A113",
          "start": "12:00",
          "end": "13:50",
          "capacity": "0",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        }
      ],
      "detail": {
        "abbreviation": "ILG",
        "name": "Lineární algebra",
        "link": "https://www.fit.vut.cz/study/course/281066/.cs",
        "timeSpan": {
          "LECTURE": 26,
          "LABORATORY": 0,
          "EXERCISE": 26,
          "SEMINAR": 0
        }
      }
    },
    {
      "data": [
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "3. 5. 8. 10.",
          "room": "D0207",
          "start": "11:00",
          "end": "12:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "4. 6. 9. 11.",
          "room": "D0207",
          "start": "11:00",
          "end": "12:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "MON",
          "weeks": "1. 2. 5. 6. 7. 8. 9. 10. 11. 12. 13.",
          "room": "D105+6",
          "start": "16:00",
          "end": "18:50",
          "capacity": "670",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Kočí Skutečná kapacita je 470 míst. Abyste si mohli přednášku zarezerovat do svého rozvrhu, navýšili jsme ji. Ze zkušeností víme, že ne všichni studenti vždy příjdou.",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "MON",
          "weeks": "3. 4.",
          "room": "D105+6",
          "start": "16:00",
          "end": "18:50",
          "capacity": "670",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Křena Skutečná kapacita je 470 míst. Abyste si mohli přednášku zarezerovat do svého rozvrhu, navýšili jsme ji. Ze zkušeností víme, že ne všichni studenti vždy příjdou.",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "3. 5. 8. 10.",
          "room": "D0207",
          "start": "18:00",
          "end": "19:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Olekšák",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": "4. 6. 9. 11.",
          "room": "D0207",
          "start": "18:00",
          "end": "19:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Olekšák",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "3. 5. 7. 9.",
          "room": "D0207",
          "start": "14:00",
          "end": "15:50",
          "capacity": "49",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozsíval",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "4. 6. 8. 10.",
          "room": "D0207",
          "start": "14:00",
          "end": "15:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozsíval",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "3. 5. 7. 9.",
          "room": "A113",
          "start": "16:00",
          "end": "17:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Šedý",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "4. 6. 8. 10.",
          "room": "A113",
          "start": "16:00",
          "end": "17:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Chocholatý",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "3. 5. 7. 9.",
          "room": "A113",
          "start": "18:00",
          "end": "19:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Šedý",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "TUE",
          "weeks": "4. 6. 8. 10.",
          "room": "A113",
          "start": "18:00",
          "end": "19:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Chocholatý",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "3. 5. 7. 9.",
          "room": "G202",
          "start": "15:00",
          "end": "16:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Janoušek",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "4. 6. 8. 10.",
          "room": "G202",
          "start": "15:00",
          "end": "16:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Janoušek",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "3. 5. 7. 9.",
          "room": "G202",
          "start": "17:00",
          "end": "18:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Janoušek",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "WED",
          "weeks": "4. 6. 8. 10.",
          "room": "G202",
          "start": "17:00",
          "end": "18:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Janoušek",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "3. 5. 7. 9.",
          "room": "IO/E339",
          "start": "11:00",
          "end": "12:50",
          "capacity": "47",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rogalewicz",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "4. 6. 8. 10.",
          "room": "IO/E339",
          "start": "11:00",
          "end": "12:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rogalewicz",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "3. 5. 7. 9.",
          "room": "IO/E339",
          "start": "13:00",
          "end": "14:50",
          "capacity": "47",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rogalewicz",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "4. 6. 8. 10.",
          "room": "IO/E339",
          "start": "13:00",
          "end": "14:50",
          "capacity": "47",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rogalewicz",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "THU",
          "weeks": "3. 5. 7. 9.",
          "room": "D0207",
          "start": "16:00",
          "end": "17:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Vargovčík",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "FRI",
          "weeks": "1. 2. 3. 4. 6. 7. 8. 9. 10. 11. 12. 13.",
          "room": "D105+6,7",
          "start": "13:00",
          "end": "15:50",
          "capacity": "560",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Křena",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "FRI",
          "weeks": "5.",
          "room": "D105+6,7",
          "start": "13:00",
          "end": "15:50",
          "capacity": "560",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Rogalewicz",
          "note": null
        },
        {
          "type": "EXERCISE",
          "day": "FRI",
          "weeks": "4. 6. 8. 10.",
          "room": "D0207",
          "start": "18:00",
          "end": "19:50",
          "capacity": "48",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Aparovich V angličtině",
          "note": null
        }
      ],
      "detail": {
        "abbreviation": "IUS",
        "name": "Úvod do softwarového inženýrství",
        "link": "https://www.fit.vut.cz/study/course/281002/.cs",
        "timeSpan": {
          "LECTURE": 39,
          "LABORATORY": 0,
          "EXERCISE": 8,
          "SEMINAR": 0
        }
      }
    },
    {
      "data": [
        {
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "N203",
          "start": "08:00",
          "end": "09:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "N103",
          "start": "12:00",
          "end": "13:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Grézl",
          "note": null
        },
        {
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "N104 N105",
          "start": "12:00",
          "end": "13:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "type": "LECTURE",
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "D105+6",
          "start": "14:00",
          "end": "15:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Smrčka",
          "note": null
        },
        {
          "day": "MON",
          "weeks": "1. 2. 3. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "N103",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "MON",
          "weeks": "4.",
          "room": "N103",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "N103",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "MON",
          "weeks": "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13.",
          "room": "N103",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N103",
          "start": "08:00",
          "end": "09:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Grézl",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N103",
          "start": "10:00",
          "end": "11:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Grézl",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N103",
          "start": "12:00",
          "end": "13:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Grézl",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N103",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N104",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Dolejška",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N105",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N103",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N104",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Dolejška",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "1. 2. 3. 5. 6. 7. 8. 9. 10. 11. 12. 13.",
          "room": "N105",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Ondrušková",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "4.",
          "room": "N105",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N103",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "",
          "room": "N104",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Dolejška",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "1. 2. 3. 5. 6. 7. 8. 9. 10. 11. 12. 13.",
          "room": "N105",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Ondrušková",
          "note": null
        },
        {
          "day": "TUE",
          "weeks": "4.",
          "room": "N105",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "O204",
          "start": "08:00",
          "end": "09:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Grézl",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "O204",
          "start": "10:00",
          "end": "11:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Grézl",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "N103",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "type": "EXAM",
          "day": "WED",
          "weeks": "7.",
          "room": "D105+6",
          "start": "16:00",
          "end": "17:00",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "Půlsemestrální test (skupina 1)",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "1. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12. 13.",
          "room": "D105",
          "start": "16:00",
          "end": "16:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Smrčka",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "1. 3. 4. 5. 6. 7. 8. 11. 12. 13.",
          "room": "D0206",
          "start": "16:00",
          "end": "16:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Smrčka",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": "2.",
          "room": "D105+6",
          "start": "16:00",
          "end": "16:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Polčák",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "N103",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "N104",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Lazúr",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "N105",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Dubovec",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "1. 3. 4. 5. 6. 7. 8. 9. 10. 11. 13.",
          "room": "D105",
          "start": "17:00",
          "end": "17:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Smrčka",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "1. 3. 4. 5. 6. 7. 8. 11. 13.",
          "room": "D0206",
          "start": "17:00",
          "end": "17:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Smrčka",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "2.",
          "room": "D105+6",
          "start": "17:00",
          "end": "17:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "Dolejška",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "WED",
          "weeks": "12.",
          "room": "D105+6",
          "start": "17:00",
          "end": "17:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIA",
            "2BIA",
            "2BIB"
          ],
          "groups": "10 - 29 xx",
          "info": "",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "N103",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "N104",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Lazúr",
          "note": null
        },
        {
          "day": "WED",
          "weeks": "",
          "room": "N105",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Dubovec",
          "note": null
        },
        {
          "type": "EXAM",
          "day": "THU",
          "weeks": "7.",
          "room": "D105+6",
          "start": "08:00",
          "end": "09:00",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "Půlsemestrální test (skupina 1)",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "THU",
          "weeks": "1. 2. 3. 7. 8. 9. 13.",
          "room": "D105+6",
          "start": "08:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Polčák",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "THU",
          "weeks": "4. 5. 6. 10. 11. 12.",
          "room": "D105+6",
          "start": "08:00",
          "end": "10:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Jeřábek",
          "note": null
        },
        {
          "day": "THU",
          "weeks": "",
          "room": "N103",
          "start": "08:00",
          "end": "09:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozsíval",
          "note": null
        },
        {
          "type": "SEMINAR",
          "day": "THU",
          "weeks": "",
          "room": "D105+6",
          "start": "11:00",
          "end": "11:50",
          "capacity": "470",
          "lectureGroup": [
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "30 - 49 xx",
          "info": "Dolejška",
          "note": null
        },
        {
          "day": "THU",
          "weeks": "",
          "room": "N103",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Zavřel",
          "note": null
        },
        {
          "day": "THU",
          "weeks": "",
          "room": "N104",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "THU",
          "weeks": "",
          "room": "N105",
          "start": "16:00",
          "end": "17:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Jeřábek",
          "note": null
        },
        {
          "day": "THU",
          "weeks": "",
          "room": "N103",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Zavřel",
          "note": null
        },
        {
          "day": "THU",
          "weeks": "",
          "room": "N104",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "THU",
          "weeks": "",
          "room": "N105",
          "start": "18:00",
          "end": "19:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Jeřábek",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N103",
          "start": "08:00",
          "end": "09:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Grézl",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N104",
          "start": "08:00",
          "end": "09:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N105",
          "start": "08:00",
          "end": "09:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Rozsíval",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N103",
          "start": "12:00",
          "end": "13:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Polčák",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N104",
          "start": "12:00",
          "end": "13:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Veigend",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N105",
          "start": "12:00",
          "end": "13:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Škarvada",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N103",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N104",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "Husa",
          "note": null
        },
        {
          "day": "FRI",
          "weeks": "",
          "room": "N105",
          "start": "14:00",
          "end": "15:50",
          "capacity": "20",
          "lectureGroup": [
            "1BIA",
            "1BIB",
            "2BIA",
            "2BIB"
          ],
          "groups": "xx",
          "info": "",
          "note": "Na výuku se nelze registrovat ve Studis.\n                                    (Termíny cvičení mohou být v případě potřeby otevřeny dodatečně, ale nemusí být využity vůbec.)"
        }
      ],
      "detail": {
        "abbreviation": "IZP",
        "name": "Základy programování",
        "link": "https://www.fit.vut.cz/study/course/280953/.cs",
        "timeSpan": {
          "LECTURE": 39,
          "LABORATORY": 20,
          "EXERCISE": 0,
          "SEMINAR": 12
        }
      }
    }
  ]
  return data
}