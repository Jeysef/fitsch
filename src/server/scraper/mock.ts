import { type DataProviderTypes, type StudyOverview } from "~/server/scraper/types";
import { DEGREE } from "./enums";



export function getStudyOverviewMock(config?: DataProviderTypes.getStudyOverviewConfig): DataProviderTypes.getStudyOverviewReturn {
  const data = {
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
                "id": "281068",
                "url": "https://www.fit.vut.cz/study/course/281068/.cs"
              },
              {
                "name": "Elektronika pro informační technologie",
                "abbreviation": "IEL",
                "id": "281030",
                "url": "https://www.fit.vut.cz/study/course/281030/.cs"
              },
              {
                "name": "Lineární algebra",
                "abbreviation": "ILG",
                "id": "281066",
                "url": "https://www.fit.vut.cz/study/course/281066/.cs"
              },
              {
                "name": "Úvod do softwarového inženýrství",
                "abbreviation": "IUS",
                "id": "281002",
                "url": "https://www.fit.vut.cz/study/course/281002/.cs"
              },
              {
                "name": "Základy programování",
                "abbreviation": "IZP",
                "id": "280953",
                "url": "https://www.fit.vut.cz/study/course/280953/.cs"
              },
              {
                "name": "Zkouška z obecné angličtiny B1",
                "abbreviation": "GEN",
                "id": "281032",
                "url": "https://www.fit.vut.cz/study/course/281032/.cs"
              },
              {
                "name": "Zkouška z angličtiny na úrovni B1",
                "abbreviation": "ZAN4",
                "id": "281047",
                "url": "https://www.fit.vut.cz/study/course/281047/.cs"
              }
            ],
            "optional": [
              {
                "name": "Matematický software",
                "abbreviation": "0MS",
                "id": "278161",
                "url": "https://www.fit.vut.cz/study/course/278161/.cs"
              },
              {
                "name": "Aplikovaná herní studia – výzkum a design",
                "abbreviation": "1AHS-L",
                "id": "278629",
                "url": "https://www.fit.vut.cz/study/course/278629/.cs"
              },
              {
                "name": "3D tisk a digitální výroba pro kreativní obory 1",
                "abbreviation": "1DS-Z",
                "id": "279248",
                "url": "https://www.fit.vut.cz/study/course/279248/.cs"
              },
              {
                "name": "Herní studia",
                "abbreviation": "1HS-Z",
                "id": "278749",
                "url": "https://www.fit.vut.cz/study/course/278749/.cs"
              },
              {
                "name": "3D optická digitalizace 1",
                "abbreviation": "1ODI-Z",
                "id": "279244",
                "url": "https://www.fit.vut.cz/study/course/279244/.cs"
              },
              {
                "name": "Architektura 20. století",
                "abbreviation": "ACHE20",
                "id": "278633",
                "url": "https://www.fit.vut.cz/study/course/278633/.cs"
              },
              {
                "name": "Aktuální témata grafického designu",
                "abbreviation": "ATGD",
                "id": "278613",
                "url": "https://www.fit.vut.cz/study/course/278613/.cs"
              },
              {
                "name": "Daňový systém ČR",
                "abbreviation": "BPC-DSY",
                "id": "279726",
                "url": "https://www.fit.vut.cz/study/course/279726/.cs"
              },
              {
                "name": "Elektrotechnický seminář",
                "abbreviation": "BPC-ELSA",
                "id": "279740",
                "url": "https://www.fit.vut.cz/study/course/279740/.cs"
              },
              {
                "name": "Fyzika 1",
                "abbreviation": "BPC-FY1B",
                "id": "279766",
                "url": "https://www.fit.vut.cz/study/course/279766/.cs"
              },
              {
                "name": "Fyzika v elektrotechnice",
                "abbreviation": "BPC-FYE",
                "id": "279759",
                "url": "https://www.fit.vut.cz/study/course/279759/.cs"
              },
              {
                "name": "GIS",
                "abbreviation": "BRA011",
                "id": "281939",
                "url": "https://www.fit.vut.cz/study/course/281939/.cs"
              },
              {
                "name": "Dějiny a kontexty fotografie 1",
                "abbreviation": "DKFI-Z",
                "id": "278685",
                "url": "https://www.fit.vut.cz/study/course/278685/.cs"
              },
              {
                "name": "Filozofie a kultura",
                "abbreviation": "FIK",
                "id": "285246",
                "url": "https://www.fit.vut.cz/study/course/285246/.cs"
              },
              {
                "name": "Dějiny a filozofie techniky",
                "abbreviation": "FIT",
                "id": "285247",
                "url": "https://www.fit.vut.cz/study/course/285247/.cs"
              },
              {
                "name": "Manažerská komunikace a prezentace",
                "abbreviation": "HKO",
                "id": "281135",
                "url": "https://www.fit.vut.cz/study/course/281135/.cs"
              },
              {
                "name": "Manažerské vedení lidí a řízení času",
                "abbreviation": "HVR",
                "id": "281139",
                "url": "https://www.fit.vut.cz/study/course/281139/.cs"
              },
              {
                "name": "Fyzikální seminář",
                "abbreviation": "IFS",
                "id": "280895",
                "url": "https://www.fit.vut.cz/study/course/280895/.cs"
              },
              {
                "name": "Kruhové konzultace",
                "abbreviation": "IKK",
                "id": "281091",
                "url": "https://www.fit.vut.cz/study/course/281091/.cs"
              },
              {
                "name": "Počítačový seminář",
                "abbreviation": "ISC",
                "id": "280946",
                "url": "https://www.fit.vut.cz/study/course/280946/.cs"
              },
              {
                "name": "Matematický seminář",
                "abbreviation": "ISM",
                "id": "281067",
                "url": "https://www.fit.vut.cz/study/course/281067/.cs"
              },
              {
                "name": "Informační výchova a gramotnost",
                "abbreviation": "IVG",
                "id": "280888",
                "url": "https://www.fit.vut.cz/study/course/280888/.cs"
              },
              {
                "name": "Kurz pornostudií",
                "abbreviation": "KPO-Z",
                "id": "278779",
                "url": "https://www.fit.vut.cz/study/course/278779/.cs"
              },
              {
                "name": "Právní minimum",
                "abbreviation": "PRM",
                "id": "285250",
                "url": "https://www.fit.vut.cz/study/course/285250/.cs"
              },
              {
                "name": "Rétorika",
                "abbreviation": "RET",
                "id": "285251",
                "url": "https://www.fit.vut.cz/study/course/285251/.cs"
              },
              {
                "name": "Vizuální styly digitálních her 1",
                "abbreviation": "VSDH1",
                "id": "279186",
                "url": "https://www.fit.vut.cz/study/course/279186/.cs"
              },
              {
                "name": "Podnikatelské minimum",
                "abbreviation": "XPC-POM",
                "id": "280767",
                "url": "https://www.fit.vut.cz/study/course/280767/.cs"
              }
            ]
          },
          "SUMMER": {
            "compulsory": [
              {
                "name": "Matematická analýza 1",
                "abbreviation": "IMA1",
                "id": "281065",
                "url": "https://www.fit.vut.cz/study/course/281065/.cs"
              },
              {
                "name": "Návrh číslicových systémů",
                "abbreviation": "INC",
                "id": "281145",
                "url": "https://www.fit.vut.cz/study/course/281145/.cs"
              },
              {
                "name": "Operační systémy",
                "abbreviation": "IOS",
                "id": "280995",
                "url": "https://www.fit.vut.cz/study/course/280995/.cs"
              },
              {
                "name": "Programování na strojové úrovni",
                "abbreviation": "ISU",
                "id": "280999",
                "url": "https://www.fit.vut.cz/study/course/280999/.cs"
              },
              {
                "name": "Základy logiky pro informatiky",
                "abbreviation": "IZLO",
                "id": "281004",
                "url": "https://www.fit.vut.cz/study/course/281004/.cs"
              },
              {
                "name": "Angličtina C1-2",
                "abbreviation": "0AX",
                "id": "278129",
                "url": "https://www.fit.vut.cz/study/course/278129/.cs"
              },
              {
                "name": "Angličtina pro IT",
                "abbreviation": "AIT",
                "id": "281043",
                "url": "https://www.fit.vut.cz/study/course/281043/.cs"
              },
              {
                "name": "Angličtina 1: mírně pokročilí 1",
                "abbreviation": "BAN1",
                "id": "281042",
                "url": "https://www.fit.vut.cz/study/course/281042/.cs"
              },
              {
                "name": "Angličtina 2: mírně pokročilí 2",
                "abbreviation": "BAN2",
                "id": "281040",
                "url": "https://www.fit.vut.cz/study/course/281040/.cs"
              },
              {
                "name": "Angličtina 3: středně pokročilí 1",
                "abbreviation": "BAN3",
                "id": "281038",
                "url": "https://www.fit.vut.cz/study/course/281038/.cs"
              },
              {
                "name": "Angličtina 4: středně pokročilí 2",
                "abbreviation": "BAN4",
                "id": "281036",
                "url": "https://www.fit.vut.cz/study/course/281036/.cs"
              },
              {
                "name": "Praktická angličtina 2",
                "abbreviation": "BPC-PA2",
                "id": "279863",
                "url": "https://www.fit.vut.cz/study/course/279863/.cs"
              },
              {
                "name": "Zkouška z obecné angličtiny B1",
                "abbreviation": "GEN",
                "id": "281033",
                "url": "https://www.fit.vut.cz/study/course/281033/.cs"
              },
              {
                "name": "Angličtina pro FCE 2",
                "abbreviation": "XPC-FCE2",
                "id": "280737",
                "url": "https://www.fit.vut.cz/study/course/280737/.cs"
              },
              {
                "name": "Seminář VHDL",
                "abbreviation": "IVH",
                "id": "281152",
                "url": "https://www.fit.vut.cz/study/course/281152/.cs"
              }
            ],
            "optional": [
              {
                "name": "Matematické výpočty pomocí MAPLE",
                "abbreviation": "0MV",
                "id": "278163",
                "url": "https://www.fit.vut.cz/study/course/278163/.cs"
              },
              {
                "name": "English Skills for Workplace Communication",
                "abbreviation": "0SE",
                "id": "278196",
                "url": "https://www.fit.vut.cz/study/course/278196/.cs"
              },
              {
                "name": "CNC obrábění – Roboti v umělecké praxi",
                "abbreviation": "1CNCO",
                "id": "278672",
                "url": "https://www.fit.vut.cz/study/course/278672/.cs"
              },
              {
                "name": "3D tisk a digitální výroba pro kreativní obory 2",
                "abbreviation": "1DS-2",
                "id": "279249",
                "url": "https://www.fit.vut.cz/study/course/279249/.cs"
              },
              {
                "name": "Herní design - Digitální hry",
                "abbreviation": "1HERDES",
                "id": "278748",
                "url": "https://www.fit.vut.cz/study/course/278748/.cs"
              },
              {
                "name": "Kritická analýza digitálních her",
                "abbreviation": "1KADH-L",
                "id": "278777",
                "url": "https://www.fit.vut.cz/study/course/278777/.cs"
              },
              {
                "name": "3D optická digitalizace 2",
                "abbreviation": "1ODI-L",
                "id": "279245",
                "url": "https://www.fit.vut.cz/study/course/279245/.cs"
              },
              {
                "name": "Autorská práva",
                "abbreviation": "AUP-L",
                "id": "278657",
                "url": "https://www.fit.vut.cz/study/course/278657/.cs"
              },
              {
                "name": "Dějiny a kontexty fotografie 2",
                "abbreviation": "DKFII-L",
                "id": "278686",
                "url": "https://www.fit.vut.cz/study/course/278686/.cs"
              },
              {
                "name": "Filozofie a kultura",
                "abbreviation": "FIK",
                "id": "285245",
                "url": "https://www.fit.vut.cz/study/course/285245/.cs"
              },
              {
                "name": "Manažerská komunikace a prezentace",
                "abbreviation": "HKO",
                "id": "281136",
                "url": "https://www.fit.vut.cz/study/course/281136/.cs"
              },
              {
                "name": "Hliněné stavitelství",
                "abbreviation": "HLS-KE",
                "id": "276931",
                "url": "https://www.fit.vut.cz/study/course/276931/.cs"
              },
              {
                "name": "Manažerské vedení lidí a řízení času",
                "abbreviation": "HVR",
                "id": "281140",
                "url": "https://www.fit.vut.cz/study/course/281140/.cs"
              },
              {
                "name": "Jazyk C",
                "abbreviation": "IJC",
                "id": "280992",
                "url": "https://www.fit.vut.cz/study/course/280992/.cs"
              },
              {
                "name": "Mechanika a akustika",
                "abbreviation": "IMK",
                "id": "280898",
                "url": "https://www.fit.vut.cz/study/course/280898/.cs"
              },
              {
                "name": "Periferní zařízení",
                "abbreviation": "IPZ",
                "id": "281148",
                "url": "https://www.fit.vut.cz/study/course/281148/.cs"
              },
              {
                "name": "Skriptovací jazyky",
                "abbreviation": "ISJ",
                "id": "281092",
                "url": "https://www.fit.vut.cz/study/course/281092/.cs"
              },
              {
                "name": "Tvorba webových stránek",
                "abbreviation": "ITW",
                "id": "280948",
                "url": "https://www.fit.vut.cz/study/course/280948/.cs"
              },
              {
                "name": "Typografie a publikování",
                "abbreviation": "ITY",
                "id": "281001",
                "url": "https://www.fit.vut.cz/study/course/281001/.cs"
              },
              {
                "name": "Praktické aspekty vývoje software",
                "abbreviation": "IVS",
                "id": "281098",
                "url": "https://www.fit.vut.cz/study/course/281098/.cs"
              },
              {
                "name": "Němčina 2",
                "abbreviation": "N2",
                "id": "277570",
                "url": "https://www.fit.vut.cz/study/course/277570/.cs"
              },
              {
                "name": "Podnikatelská laboratoř",
                "abbreviation": "PLAB",
                "id": "285615",
                "url": "https://www.fit.vut.cz/study/course/285615/.cs"
              },
              {
                "name": "Právní minimum",
                "abbreviation": "PRM",
                "id": "285249",
                "url": "https://www.fit.vut.cz/study/course/285249/.cs"
              },
              {
                "name": "Rétorika",
                "abbreviation": "RET",
                "id": "285252",
                "url": "https://www.fit.vut.cz/study/course/285252/.cs"
              },
              {
                "name": "Počítačová fyzika I",
                "abbreviation": "T1F",
                "id": "277939",
                "url": "https://www.fit.vut.cz/study/course/277939/.cs"
              },
              {
                "name": "Vizuální styly digitálních her 2",
                "abbreviation": "VSDH2",
                "id": "279187",
                "url": "https://www.fit.vut.cz/study/course/279187/.cs"
              },
              {
                "name": "Obchodní angličtina",
                "abbreviation": "XPC-BEN",
                "id": "280718",
                "url": "https://www.fit.vut.cz/study/course/280718/.cs"
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
                "id": "280900",
                "url": "https://www.fit.vut.cz/study/course/280900/.cs"
              },
              {
                "name": "Formální jazyky a překladače",
                "abbreviation": "IFJ",
                "id": "280931",
                "url": "https://www.fit.vut.cz/study/course/280931/.cs"
              },
              {
                "name": "Matematická analýza 2",
                "abbreviation": "IMA2",
                "id": "281064",
                "url": "https://www.fit.vut.cz/study/course/281064/.cs"
              },
              {
                "name": "Návrh počítačových systémů",
                "abbreviation": "INP",
                "id": "281147",
                "url": "https://www.fit.vut.cz/study/course/281147/.cs"
              },
              {
                "name": "Pravděpodobnost a statistika",
                "abbreviation": "IPT",
                "id": "281070",
                "url": "https://www.fit.vut.cz/study/course/281070/.cs"
              },
              {
                "name": "Signály a systémy",
                "abbreviation": "ISS",
                "id": "281093",
                "url": "https://www.fit.vut.cz/study/course/281093/.cs"
              },
              {
                "name": "Angličtina B2-1",
                "abbreviation": "0A7",
                "id": "278133",
                "url": "https://www.fit.vut.cz/study/course/278133/.cs"
              },
              {
                "name": "Angličtina C1-1",
                "abbreviation": "0A9",
                "id": "278135",
                "url": "https://www.fit.vut.cz/study/course/278135/.cs"
              },
              {
                "name": "Angličtina pro IT",
                "abbreviation": "AIT",
                "id": "281044",
                "url": "https://www.fit.vut.cz/study/course/281044/.cs"
              },
              {
                "name": "Angličtina 1: mírně pokročilí 1",
                "abbreviation": "BAN1",
                "id": "281041",
                "url": "https://www.fit.vut.cz/study/course/281041/.cs"
              },
              {
                "name": "Angličtina 2: mírně pokročilí 2",
                "abbreviation": "BAN2",
                "id": "281039",
                "url": "https://www.fit.vut.cz/study/course/281039/.cs"
              },
              {
                "name": "Angličtina 3: středně pokročilí 1",
                "abbreviation": "BAN3",
                "id": "281037",
                "url": "https://www.fit.vut.cz/study/course/281037/.cs"
              },
              {
                "name": "Angličtina 4: středně pokročilí 2",
                "abbreviation": "BAN4",
                "id": "281035",
                "url": "https://www.fit.vut.cz/study/course/281035/.cs"
              },
              {
                "name": "Praktická angličtina 1",
                "abbreviation": "BPC-PA1",
                "id": "279862",
                "url": "https://www.fit.vut.cz/study/course/279862/.cs"
              },
              {
                "name": "Praktická angličtina 3",
                "abbreviation": "BPC-PA3",
                "id": "279864",
                "url": "https://www.fit.vut.cz/study/course/279864/.cs"
              },
              {
                "name": "Angličtina pro FCE 1",
                "abbreviation": "XPC-FCE1",
                "id": "280736",
                "url": "https://www.fit.vut.cz/study/course/280736/.cs"
              }
            ],
            "optional": [
              {
                "name": "English Skills for Workplace Communication",
                "abbreviation": "0SE",
                "id": "278195",
                "url": "https://www.fit.vut.cz/study/course/278195/.cs"
              },
              {
                "name": "Základy herního vývoje",
                "abbreviation": "1ZHERV",
                "id": "279223",
                "url": "https://www.fit.vut.cz/study/course/279223/.cs"
              },
              {
                "name": "Angličtina pro Evropu",
                "abbreviation": "AEU",
                "id": "281045",
                "url": "https://www.fit.vut.cz/study/course/281045/.cs"
              },
              {
                "name": "Analogová elektronika 1",
                "abbreviation": "BPC-AE1",
                "id": "279662",
                "url": "https://www.fit.vut.cz/study/course/279662/.cs"
              },
              {
                "name": "Analogová technika",
                "abbreviation": "BPC-ANA",
                "id": "279671",
                "url": "https://www.fit.vut.cz/study/course/279671/.cs"
              },
              {
                "name": "Elektroakustika 1",
                "abbreviation": "BPC-ELA",
                "id": "279733",
                "url": "https://www.fit.vut.cz/study/course/279733/.cs"
              },
              {
                "name": "Návrh a realizace elektronických přístrojů",
                "abbreviation": "BPC-NRP",
                "id": "279842",
                "url": "https://www.fit.vut.cz/study/course/279842/.cs"
              },
              {
                "name": "Robotika a manipulátory",
                "abbreviation": "BPC-RBM",
                "id": "279900",
                "url": "https://www.fit.vut.cz/study/course/279900/.cs"
              },
              {
                "name": "Vybrané partie z matematiky I.",
                "abbreviation": "BPC-VPA",
                "id": "279966",
                "url": "https://www.fit.vut.cz/study/course/279966/.cs"
              },
              {
                "name": "Zabezpečovací systémy",
                "abbreviation": "BPC-ZSY",
                "id": "279984",
                "url": "https://www.fit.vut.cz/study/course/279984/.cs"
              },
              {
                "name": "Digital Marketing and Social Media",
                "abbreviation": "DMSM",
                "id": "285344",
                "url": "https://www.fit.vut.cz/study/course/285344/.cs"
              },
              {
                "name": "E-commerce",
                "abbreviation": "EC",
                "id": "285367",
                "url": "https://www.fit.vut.cz/study/course/285367/.cs"
              },
              {
                "name": "Podniková ekonomika",
                "abbreviation": "EPO",
                "id": "285616",
                "url": "https://www.fit.vut.cz/study/course/285616/.cs"
              },
              {
                "name": "Francouzština 1",
                "abbreviation": "F1",
                "id": "277368",
                "url": "https://www.fit.vut.cz/study/course/277368/.cs"
              },
              {
                "name": "CCNA: základy směrování a technologie VLAN",
                "abbreviation": "I1C",
                "id": "280954",
                "url": "https://www.fit.vut.cz/study/course/280954/.cs"
              },
              {
                "name": "Pokročilá témata administrace operačního systému Linux",
                "abbreviation": "ILI",
                "id": "280993",
                "url": "https://www.fit.vut.cz/study/course/280993/.cs"
              },
              {
                "name": "Matematické základy fuzzy logiky",
                "abbreviation": "IMF",
                "id": "281069",
                "url": "https://www.fit.vut.cz/study/course/281069/.cs"
              },
              {
                "name": "Návrh a implementace IT služeb",
                "abbreviation": "INI",
                "id": "280935",
                "url": "https://www.fit.vut.cz/study/course/280935/.cs"
              },
              {
                "name": "Projektová praxe 1",
                "abbreviation": "IP1",
                "id": "280939",
                "url": "https://www.fit.vut.cz/study/course/280939/.cs"
              },
              {
                "name": "Programovací seminář",
                "abbreviation": "IPS",
                "id": "280997",
                "url": "https://www.fit.vut.cz/study/course/280997/.cs"
              },
              {
                "name": "Desktop systémy Microsoft Windows",
                "abbreviation": "IW1",
                "id": "280950",
                "url": "https://www.fit.vut.cz/study/course/280950/.cs"
              },
              {
                "name": "Programování v .NET a C#",
                "abbreviation": "IW5",
                "id": "280952",
                "url": "https://www.fit.vut.cz/study/course/280952/.cs"
              },
              {
                "name": "Anglická konverzace na aktuální témata",
                "abbreviation": "JA3",
                "id": "281053",
                "url": "https://www.fit.vut.cz/study/course/281053/.cs"
              },
              {
                "name": "Němčina 1",
                "abbreviation": "N1",
                "id": "277569",
                "url": "https://www.fit.vut.cz/study/course/277569/.cs"
              },
              {
                "name": "Němčina 3",
                "abbreviation": "N3",
                "id": "277571",
                "url": "https://www.fit.vut.cz/study/course/277571/.cs"
              },
              {
                "name": "Němčina 5",
                "abbreviation": "N5",
                "id": "277573",
                "url": "https://www.fit.vut.cz/study/course/277573/.cs"
              },
              {
                "name": "Deutsch für Studium und Beruf I",
                "abbreviation": "N7",
                "id": "277575",
                "url": "https://www.fit.vut.cz/study/course/277575/.cs"
              },
              {
                "name": "Geografické informační systémy",
                "abbreviation": "NNA008",
                "id": "281594",
                "url": "https://www.fit.vut.cz/study/course/281594/.cs"
              },
              {
                "name": "Smart city, region",
                "abbreviation": "NUA026",
                "id": "281739",
                "url": "https://www.fit.vut.cz/study/course/281739/.cs"
              },
              {
                "name": "Praktická konverzace, prezentování a firemní komunikace v Angličtině",
                "abbreviation": "PKA",
                "id": "287696",
                "url": "https://www.fit.vut.cz/study/course/287696/.cs"
              },
              {
                "name": "Ruština 1",
                "abbreviation": "R1",
                "id": "277770",
                "url": "https://www.fit.vut.cz/study/course/277770/.cs"
              },
              {
                "name": "Osobností rozvoj a sebepoznání",
                "abbreviation": "SORS",
                "id": "286513",
                "url": "https://www.fit.vut.cz/study/course/286513/.cs"
              },
              {
                "name": "Týmové dovednosti",
                "abbreviation": "STD",
                "id": "286528",
                "url": "https://www.fit.vut.cz/study/course/286528/.cs"
              },
              {
                "name": "Počítačová fyzika II",
                "abbreviation": "T2F",
                "id": "277942",
                "url": "https://www.fit.vut.cz/study/course/277942/.cs"
              },
              {
                "name": "Španělština pro začátečníky 1",
                "abbreviation": "XPC-ESP1",
                "id": "280734",
                "url": "https://www.fit.vut.cz/study/course/280734/.cs"
              },
              {
                "name": "Francouzština pro začátečníky 1",
                "abbreviation": "XPC-FR1",
                "id": "280738",
                "url": "https://www.fit.vut.cz/study/course/280738/.cs"
              },
              {
                "name": "Inženýrská pedagogika a didaktika",
                "abbreviation": "XPC-IPD",
                "id": "280741",
                "url": "https://www.fit.vut.cz/study/course/280741/.cs"
              },
              {
                "name": "Italština pro začátečníky 1",
                "abbreviation": "XPC-ITA1",
                "id": "280743",
                "url": "https://www.fit.vut.cz/study/course/280743/.cs"
              },
              {
                "name": "Kultura projevu a tvorba textů",
                "abbreviation": "XPC-KPT",
                "id": "280747",
                "url": "https://www.fit.vut.cz/study/course/280747/.cs"
              },
              {
                "name": "Němčina pro začátečníky 1",
                "abbreviation": "XPC-NE1",
                "id": "280760",
                "url": "https://www.fit.vut.cz/study/course/280760/.cs"
              },
              {
                "name": "Němčina pro mírně pokročilé  1",
                "abbreviation": "XPC-NE3",
                "id": "280762",
                "url": "https://www.fit.vut.cz/study/course/280762/.cs"
              },
              {
                "name": "Pedagogická psychologie",
                "abbreviation": "XPC-PEP",
                "id": "280765",
                "url": "https://www.fit.vut.cz/study/course/280765/.cs"
              },
              {
                "name": "Zahraniční odborná praxe",
                "abbreviation": "ZPX",
                "id": "281169",
                "url": "https://www.fit.vut.cz/study/course/281169/.cs"
              },
              {
                "name": "Financování rozvoje podniku",
                "abbreviation": "frpP",
                "id": "285398",
                "url": "https://www.fit.vut.cz/study/course/285398/.cs"
              },
              {
                "name": "Finanční trhy",
                "abbreviation": "ftP",
                "id": "285408",
                "url": "https://www.fit.vut.cz/study/course/285408/.cs"
              },
              {
                "name": "Makroekonomie 1",
                "abbreviation": "mak1P",
                "id": "285479",
                "url": "https://www.fit.vut.cz/study/course/285479/.cs"
              },
              {
                "name": "Management",
                "abbreviation": "manP",
                "id": "285483",
                "url": "https://www.fit.vut.cz/study/course/285483/.cs"
              }
            ]
          },
          "SUMMER": {
            "compulsory": [
              {
                "name": "Databázové systémy",
                "abbreviation": "IDS",
                "id": "280905",
                "url": "https://www.fit.vut.cz/study/course/280905/.cs"
              },
              {
                "name": "Počítačové komunikace a sítě",
                "abbreviation": "IPK",
                "id": "280936",
                "url": "https://www.fit.vut.cz/study/course/280936/.cs"
              },
              {
                "name": "Principy programovacích jazyků a OOP",
                "abbreviation": "IPP",
                "id": "280937",
                "url": "https://www.fit.vut.cz/study/course/280937/.cs"
              },
              {
                "name": "Základy počítačové grafiky",
                "abbreviation": "IZG",
                "id": "281099",
                "url": "https://www.fit.vut.cz/study/course/281099/.cs"
              },
              {
                "name": "Základy umělé inteligence",
                "abbreviation": "IZU",
                "id": "281005",
                "url": "https://www.fit.vut.cz/study/course/281005/.cs"
              },
              {
                "name": "Angličtina B2-2",
                "abbreviation": "0A8",
                "id": "278134",
                "url": "https://www.fit.vut.cz/study/course/278134/.cs"
              },
              {
                "name": "Praktická angličtina 4",
                "abbreviation": "BPC-PA4",
                "id": "279866",
                "url": "https://www.fit.vut.cz/study/course/279866/.cs"
              },
              {
                "name": "Seminář C++",
                "abbreviation": "ICP",
                "id": "281029",
                "url": "https://www.fit.vut.cz/study/course/281029/.cs"
              },
              {
                "name": "Seminář C#",
                "abbreviation": "ICS",
                "id": "280904",
                "url": "https://www.fit.vut.cz/study/course/280904/.cs"
              },
              {
                "name": "Seminář Java",
                "abbreviation": "IJA",
                "id": "280990",
                "url": "https://www.fit.vut.cz/study/course/280990/.cs"
              },
              {
                "name": "Seminář VHDL",
                "abbreviation": "IVH",
                "id": "281152",
                "url": "https://www.fit.vut.cz/study/course/281152/.cs"
              }
            ],
            "optional": [
              {
                "name": "Mobilní roboty",
                "abbreviation": "0MR",
                "id": "278160",
                "url": "https://www.fit.vut.cz/study/course/278160/.cs"
              },
              {
                "name": "Angličtina pro Evropu",
                "abbreviation": "AEU",
                "id": "281046",
                "url": "https://www.fit.vut.cz/study/course/281046/.cs"
              },
              {
                "name": "Analogová elektronika 2",
                "abbreviation": "BPC-AE2",
                "id": "279663",
                "url": "https://www.fit.vut.cz/study/course/279663/.cs"
              },
              {
                "name": "Audio elektronika",
                "abbreviation": "BPC-AUD",
                "id": "279679",
                "url": "https://www.fit.vut.cz/study/course/279679/.cs"
              },
              {
                "name": "Komunikační systémy pro IoT",
                "abbreviation": "BPC-IOT",
                "id": "279784",
                "url": "https://www.fit.vut.cz/study/course/279784/.cs"
              },
              {
                "name": "Matematika 2",
                "abbreviation": "BPC-MA2A",
                "id": "279809",
                "url": "https://www.fit.vut.cz/study/course/279809/.cs"
              },
              {
                "name": "Úvod do molekulární biologie a genetiky",
                "abbreviation": "BPC-MOL",
                "id": "279822",
                "url": "https://www.fit.vut.cz/study/course/279822/.cs"
              },
              {
                "name": "Vybrané partie z obnovitelných zdrojů a ukládání energie",
                "abbreviation": "BPC-OZU",
                "id": "279861",
                "url": "https://www.fit.vut.cz/study/course/279861/.cs"
              },
              {
                "name": "Počítačová podpora konstruování",
                "abbreviation": "BPC-PPK",
                "id": "279888",
                "url": "https://www.fit.vut.cz/study/course/279888/.cs"
              },
              {
                "name": "Robotika a zpracování obrazu",
                "abbreviation": "BPC-PRP",
                "id": "279894",
                "url": "https://www.fit.vut.cz/study/course/279894/.cs"
              },
              {
                "name": "Plošné spoje a povrchová montáž",
                "abbreviation": "BPC-PSM",
                "id": "279896",
                "url": "https://www.fit.vut.cz/study/course/279896/.cs"
              },
              {
                "name": "Zobrazovací systémy v lékařství",
                "abbreviation": "BPC-ZSL",
                "id": "279981",
                "url": "https://www.fit.vut.cz/study/course/279981/.cs"
              },
              {
                "name": "Zvukový software",
                "abbreviation": "BPC-ZSW",
                "id": "279983",
                "url": "https://www.fit.vut.cz/study/course/279983/.cs"
              },
              {
                "name": "Francouzština 2",
                "abbreviation": "F2",
                "id": "277369",
                "url": "https://www.fit.vut.cz/study/course/277369/.cs"
              },
              {
                "name": "Dějiny a filozofie techniky",
                "abbreviation": "FIT",
                "id": "285248",
                "url": "https://www.fit.vut.cz/study/course/285248/.cs"
              },
              {
                "name": "CCNA: technologie sítí LAN a WAN",
                "abbreviation": "I2C",
                "id": "280955",
                "url": "https://www.fit.vut.cz/study/course/280955/.cs"
              },
              {
                "name": "Pokročilá matematika",
                "abbreviation": "IAM",
                "id": "281027",
                "url": "https://www.fit.vut.cz/study/course/281027/.cs"
              },
              {
                "name": "Analýza binárního kódu",
                "abbreviation": "IAN",
                "id": "281028",
                "url": "https://www.fit.vut.cz/study/course/281028/.cs"
              },
              {
                "name": "Bezpečnost a počítačové sítě",
                "abbreviation": "IBS",
                "id": "280902",
                "url": "https://www.fit.vut.cz/study/course/280902/.cs"
              },
              {
                "name": "Správa serverů IBM zSeries",
                "abbreviation": "IIZ",
                "id": "280989",
                "url": "https://www.fit.vut.cz/study/course/280989/.cs"
              },
              {
                "name": "Výpočetní metody v duševním zdraví",
                "abbreviation": "IMHa",
                "id": "288261",
                "url": "https://www.fit.vut.cz/study/course/288261/.cs"
              },
              {
                "name": "Projektová praxe 2",
                "abbreviation": "IP2",
                "id": "280942",
                "url": "https://www.fit.vut.cz/study/course/280942/.cs"
              },
              {
                "name": "Pokročilé asemblery",
                "abbreviation": "IPA",
                "id": "280996",
                "url": "https://www.fit.vut.cz/study/course/280996/.cs"
              },
              {
                "name": "Technika personálních počítačů",
                "abbreviation": "ITP",
                "id": "281150",
                "url": "https://www.fit.vut.cz/study/course/281150/.cs"
              },
              {
                "name": "Testování a dynamická analýza",
                "abbreviation": "ITS",
                "id": "281000",
                "url": "https://www.fit.vut.cz/study/course/281000/.cs"
              },
              {
                "name": "Serverové systémy Microsoft Windows",
                "abbreviation": "IW2",
                "id": "280951",
                "url": "https://www.fit.vut.cz/study/course/280951/.cs"
              },
              {
                "name": "Programování zařízení Apple",
                "abbreviation": "IZA",
                "id": "281003",
                "url": "https://www.fit.vut.cz/study/course/281003/.cs"
              },
              {
                "name": "Anglická konverzace na aktuální témata",
                "abbreviation": "JA3",
                "id": "281050",
                "url": "https://www.fit.vut.cz/study/course/281050/.cs"
              },
              {
                "name": "Daňová soustava",
                "abbreviation": "KdasP",
                "id": "285338",
                "url": "https://www.fit.vut.cz/study/course/285338/.cs"
              },
              {
                "name": "Němčina 4",
                "abbreviation": "N4",
                "id": "277572",
                "url": "https://www.fit.vut.cz/study/course/277572/.cs"
              },
              {
                "name": "Němčina 6",
                "abbreviation": "N6",
                "id": "277574",
                "url": "https://www.fit.vut.cz/study/course/277574/.cs"
              },
              {
                "name": "Deutsch für Studium und Beruf II",
                "abbreviation": "N8",
                "id": "277576",
                "url": "https://www.fit.vut.cz/study/course/277576/.cs"
              },
              {
                "name": "Ruština 2",
                "abbreviation": "R2",
                "id": "277771",
                "url": "https://www.fit.vut.cz/study/course/277771/.cs"
              },
              {
                "name": "Elektrické instalace",
                "abbreviation": "XPC-EIC",
                "id": "280494",
                "url": "https://www.fit.vut.cz/study/course/280494/.cs"
              },
              {
                "name": "Bezpečná elektrotechnika",
                "abbreviation": "XPC-ELB",
                "id": "280729",
                "url": "https://www.fit.vut.cz/study/course/280729/.cs"
              },
              {
                "name": "Španělština pro začátečníky 2",
                "abbreviation": "XPC-ESP2",
                "id": "280735",
                "url": "https://www.fit.vut.cz/study/course/280735/.cs"
              },
              {
                "name": "Francouzština pro začátečníky 2",
                "abbreviation": "XPC-FR2",
                "id": "280739",
                "url": "https://www.fit.vut.cz/study/course/280739/.cs"
              },
              {
                "name": "Inženýrská pedagogika a didaktika",
                "abbreviation": "XPC-IPD",
                "id": "280742",
                "url": "https://www.fit.vut.cz/study/course/280742/.cs"
              },
              {
                "name": "Italština pro začátečníky 2",
                "abbreviation": "XPC-ITA2",
                "id": "280744",
                "url": "https://www.fit.vut.cz/study/course/280744/.cs"
              },
              {
                "name": "Kultura projevu a tvorba textů",
                "abbreviation": "XPC-KPT",
                "id": "280748",
                "url": "https://www.fit.vut.cz/study/course/280748/.cs"
              },
              {
                "name": "Němčina pro začátečníky 2",
                "abbreviation": "XPC-NE2",
                "id": "280761",
                "url": "https://www.fit.vut.cz/study/course/280761/.cs"
              },
              {
                "name": "Němčina pro mírně pokročilé  2",
                "abbreviation": "XPC-NE4",
                "id": "280763",
                "url": "https://www.fit.vut.cz/study/course/280763/.cs"
              },
              {
                "name": "Pedagogická psychologie",
                "abbreviation": "XPC-PEP",
                "id": "280764",
                "url": "https://www.fit.vut.cz/study/course/280764/.cs"
              },
              {
                "name": "Vybrané partie z matematiky II.",
                "abbreviation": "XPC-VPM",
                "id": "280776",
                "url": "https://www.fit.vut.cz/study/course/280776/.cs"
              },
              {
                "name": "Základy financování",
                "abbreviation": "ZFI",
                "id": "285835",
                "url": "https://www.fit.vut.cz/study/course/285835/.cs"
              },
              {
                "name": "Zahraniční odborná praxe",
                "abbreviation": "ZPX",
                "id": "281118",
                "url": "https://www.fit.vut.cz/study/course/281118/.cs"
              },
              {
                "name": "Finanční analýza a plánování",
                "abbreviation": "fapP",
                "id": "285399",
                "url": "https://www.fit.vut.cz/study/course/285399/.cs"
              },
              {
                "name": "Marketing",
                "abbreviation": "marP",
                "id": "285529",
                "url": "https://www.fit.vut.cz/study/course/285529/.cs"
              },
              {
                "name": "Mikroekonomie 1",
                "abbreviation": "mik1P",
                "id": "285576",
                "url": "https://www.fit.vut.cz/study/course/285576/.cs"
              },
              {
                "name": "Účetnictví",
                "abbreviation": "uceP",
                "id": "285815",
                "url": "https://www.fit.vut.cz/study/course/285815/.cs"
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
                "id": "280933",
                "url": "https://www.fit.vut.cz/study/course/280933/.cs"
              },
              {
                "name": "Mikroprocesorové a vestavěné systémy",
                "abbreviation": "IMP",
                "id": "281143",
                "url": "https://www.fit.vut.cz/study/course/281143/.cs"
              },
              {
                "name": "Modelování a simulace",
                "abbreviation": "IMS",
                "id": "280994",
                "url": "https://www.fit.vut.cz/study/course/280994/.cs"
              },
              {
                "name": "Síťové aplikace a správa sítí",
                "abbreviation": "ISA",
                "id": "280945",
                "url": "https://www.fit.vut.cz/study/course/280945/.cs"
              },
              {
                "name": "Semestrální projekt",
                "abbreviation": "ITT",
                "id": "281151",
                "url": "https://www.fit.vut.cz/study/course/281151/.cs"
              },
              {
                "name": "Tvorba uživatelských rozhraní",
                "abbreviation": "ITU",
                "id": "281096",
                "url": "https://www.fit.vut.cz/study/course/281096/.cs"
              }
            ],
            "optional": [
              {
                "name": "Řízení a regulace 1",
                "abbreviation": "BPC-RR1",
                "id": "279906",
                "url": "https://www.fit.vut.cz/study/course/279906/.cs"
              },
              {
                "name": "Projektová praxe 3",
                "abbreviation": "IP3",
                "id": "280944",
                "url": "https://www.fit.vut.cz/study/course/280944/.cs"
              },
              {
                "name": "Zpracování a vizualizace dat v prostředí Python",
                "abbreviation": "IZV",
                "id": "281153",
                "url": "https://www.fit.vut.cz/study/course/281153/.cs"
              }
            ]
          },
          "SUMMER": {
            "compulsory": [
              {
                "name": "Bakalářská práce",
                "abbreviation": "IBT",
                "id": "281141",
                "url": "https://www.fit.vut.cz/study/course/281141/.cs"
              }
            ],
            "optional": [
              {
                "name": "Řízení a regulace 2",
                "abbreviation": "BPC-RR2",
                "id": "279907",
                "url": "https://www.fit.vut.cz/study/course/279907/.cs"
              },
              {
                "name": "Multimédia v počítačových sítích",
                "abbreviation": "IMU",
                "id": "280934",
                "url": "https://www.fit.vut.cz/study/course/280934/.cs"
              }
            ]
          }
        }
      }
    }
  }


  const values: StudyOverview["values"] = {
    year: (config?.year && data.data.years.find(year => year.value === config.year)) || data.values.year,
    degree: (config?.degree) ?? data.values.degree as DEGREE,
    program: config?.program ? Object.values(data.data.programs[(config?.degree) ?? DEGREE.BACHELOR]).flatMap(program => [program, ...program.specializations]).find(programOrSpecialization => programOrSpecialization.id === config.program) : data.values.program
  }

  return {
    values,
    data: data.data as DataProviderTypes.getStudyOverviewReturn["data"]
  }
}

export function getStudyCoursesDetailsMock(config: DataProviderTypes.getStudyCoursesDetailsConfig) {
  const data = [
    {
      "data": [
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.02"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.02"
          ],
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
          "weeks": {
            "weeks": "výuky",
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": "výuky",
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.02"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.02"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
          "start": "16:00",
          "end": "17:50",
          "capacity": "67",
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
          "weeks": {
            "weeks": [
              1
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.02"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              1
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
        },
        "id": "281068"
      }
    },
    {
      "data": [
        {
          "type": "EXAM",
          "day": "MON",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "E104"
          ],
          "start": "10:00",
          "end": "10:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "02 - Půlsemestrální zkouška (18.11., 10:00, E104)",
          "note": null
        },
        {
          "type": "EXAM",
          "day": "MON",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "E112"
          ],
          "start": "10:00",
          "end": "10:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "01 - Půlsemestrální zkouška (18.11., 10:00, E112)",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              6,
              8,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "E104",
            "E105",
            "E112"
          ],
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
          "weeks": {
            "weeks": [
              4,
              5,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "E104",
            "E105",
            "E112"
          ],
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
          "type": "EXAM",
          "day": "MON",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "E104"
          ],
          "start": "11:00",
          "end": "11:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "04 - Půlsemestrální zkouška (18.11., 11:00, E104)",
          "note": null
        },
        {
          "type": "EXAM",
          "day": "MON",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "E112"
          ],
          "start": "11:00",
          "end": "11:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "03 - Půlsemestrální zkouška (18.11., 11:00, E112)",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": {
            "weeks": [
              3,
              5,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "type": "EXAM",
          "day": "TUE",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "D0206"
          ],
          "start": "10:00",
          "end": "10:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "06 - Půlsemestrální zkouška (19.11., 10:00, D0206)",
          "note": null
        },
        {
          "type": "EXAM",
          "day": "TUE",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
          "start": "10:00",
          "end": "10:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "05 - Půlsemestrální zkouška (19.11., 10:00, D105)",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              6,
              8,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              4,
              5,
              7,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "EXAM",
          "day": "TUE",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "D0206"
          ],
          "start": "11:00",
          "end": "11:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "08 - Půlsemestrální zkouška (19.11., 11:00, D0206)",
          "note": null
        },
        {
          "type": "EXAM",
          "day": "TUE",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
          "start": "11:00",
          "end": "11:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "07 - Půlsemestrální zkouška (19.11., 11:00, D105)",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "type": "EXAM",
          "day": "WED",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "D0206"
          ],
          "start": "10:00",
          "end": "10:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "10 - Půlsemestrální zkouška (20.11., 10:00, D0206)",
          "note": null
        },
        {
          "type": "EXAM",
          "day": "WED",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
          "start": "10:00",
          "end": "10:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "09 - Půlsemestrální zkouška (20.11., 10:00, D105)",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              3,
              7
            ],
            "parity": "EVEN"
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              4,
              5,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              6,
              8,
              12
            ],
            "parity": "EVEN"
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              13
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "EXAM",
          "day": "WED",
          "weeks": {
            "weeks": [
              10
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
          "start": "11:00",
          "end": "11:45",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "11 - Půlsemestrální zkouška (20.11., 11:00, D105)",
          "note": null
        },
        {
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              3,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              5,
              7
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
          "start": "11:00",
          "end": "12:50",
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              4,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              3,
              7
            ],
            "parity": "EVEN"
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "LECTURE",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              4,
              5,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              6,
              8,
              12
            ],
            "parity": "EVEN"
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              7
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              13
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              7
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9,
              11,
              13
            ],
            "parity": "EVEN"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
          "weeks": {
            "weeks": "lichý",
            "parity": "ODD"
          },
          "room": [
            "L306.1",
            "L306.2"
          ],
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
        },
        "id": "281030"
      }
    },
    {
      "data": [
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.12"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.12"
          ],
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
          "weeks": {
            "weeks": "výuky",
            "parity": null
          },
          "room": [
            "Aula profesora Braunera"
          ],
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
          "weeks": {
            "weeks": [
              1
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": "výuky",
            "parity": null
          },
          "room": [
            "D0207",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A112"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "T8/T 3.02"
          ],
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
          "weeks": {
            "weeks": [
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              1
            ],
            "parity": null
          },
          "room": [
            "T8/T 5.22"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": "výuky",
            "parity": null
          },
          "room": [
            "T8/T 3.12"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              1
            ],
            "parity": null
          },
          "room": [
            "A113"
          ],
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
        },
        "id": "281066"
      }
    },
    {
      "data": [
        {
          "type": "EXERCISE",
          "day": "MON",
          "weeks": {
            "weeks": [
              3,
              5,
              8,
              10
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              3,
              4
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              8,
              10
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              9,
              11
            ],
            "parity": null
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "A113"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "G202"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "G202"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "G202"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "G202"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "IO/E339"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "IO/E339"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "IO/E339"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "IO/E339"
          ],
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
          "weeks": {
            "weeks": [
              3,
              5,
              7,
              9
            ],
            "parity": "EVEN"
          },
          "room": [
            "D0207"
          ],
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
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D0207",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              5
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D0207",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              4,
              6,
              8,
              10
            ],
            "parity": "EVEN"
          },
          "room": [
            "D0207"
          ],
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
        },
        "id": "281002"
      }
    },
    {
      "data": [
        {
          "type": "LABORATORY",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LECTURE",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "LABORATORY",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "MON",
          "weeks": {
            "weeks": [
              4
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "MON",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              4
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "TUE",
          "weeks": {
            "weeks": [
              4
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "O204"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "O204"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "weeks": {
            "weeks": [
              7
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              3,
              4,
              5,
              6,
              7,
              8,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0206"
          ],
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
          "weeks": {
            "weeks": [
              2
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              13
            ],
            "parity": null
          },
          "room": [
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              1,
              3,
              4,
              5,
              6,
              7,
              8,
              11,
              13
            ],
            "parity": null
          },
          "room": [
            "D0206"
          ],
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
          "weeks": {
            "weeks": [
              2
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              12
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "WED",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "weeks": {
            "weeks": [
              7
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
          "start": "08:00",
          "end": "09:00",
          "capacity": "",
          "lectureGroup": [],
          "groups": "",
          "info": "Půlsemestrální test (skupina 2)",
          "note": null
        },
        {
          "type": "LECTURE",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "weeks": {
            "weeks": [
              4,
              5,
              6,
              7,
              8,
              9
            ],
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "weeks": {
            "weeks": "výuky",
            "parity": null
          },
          "room": [
            "D0206",
            "D105"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              4
            ],
            "parity": null
          },
          "room": [
            "N103",
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "THU",
          "weeks": {
            "weeks": [
              4
            ],
            "parity": null
          },
          "room": [
            "N103",
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N103"
          ],
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
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N105"
          ],
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
          "type": "LABORATORY",
          "day": "FRI",
          "weeks": {
            "weeks": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11,
              12,
              13
            ],
            "parity": null
          },
          "room": [
            "N104"
          ],
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
        },
        "id": "280953"
      }
    }
  ]
  return data as DataProviderTypes.getStudyCoursesDetailsReturn
}