import { getRandomBoolean, getRandomNumber } from "~/server/scraper/tests/utils/common";
import type { ProgramOverview, ProgramOverviewBase } from "~/server/scraper/types/program.types";

export function getMockProgram(): ProgramOverview {
  const randomProgram = getRandomProgramName();
  const isSpecialization = getRandomBoolean();
  return {
    name: randomProgram.name,
    abbreviation: randomProgram.abbreviation,
    url: `/${randomProgram.abbreviation.toLowerCase()}`,
    isEnglish: getRandomBoolean(),
    specializations: isSpecialization ? getMockProgramsBase(getRandomNumber(1, 3)) : [],
  };
}

export function getMockPrograms(count: number): ProgramOverview[] {
  return Array.from({ length: count }, () => getMockProgram());
}

function getMockProgramBase(): ProgramOverviewBase {
  const randomProgram = getRandomProgramName();
  return {
    name: randomProgram.name,
    abbreviation: randomProgram.abbreviation,
    url: `/${randomProgram.abbreviation.toLowerCase()}`,
  };
}

function getMockProgramsBase(count: number): ProgramOverviewBase[] {
  return Array.from({ length: count }, () => getMockProgramBase());
}

const mockProgramNames = [
  { abbreviation: "NBIO", name: "Bioinformatika a biocomputing" },
  { abbreviation: "NISD", name: "Informační systémy a databáze" },
  { abbreviation: "NISY", name: "Inteligentní systémy" },
  { abbreviation: "NIDE", name: "Inteligentní zařízení" },
  { abbreviation: "NCPS", name: "Kyberfyzikální systémy" },
  { abbreviation: "NSEC", name: "Kybernetická bezpečnost" },
  { abbreviation: "NMAT", name: "Matematické metody" },
  { abbreviation: "NGRI", name: "Počítačová grafika a interakce" },
  { abbreviation: "NNET", name: "Počítačové sítě" },

  { abbreviation: "NVIZ", name: "Počítačové vidění" },
  { abbreviation: "NSEN", name: "Softwarové inženýrství" },
  { abbreviation: "NMAL", name: "Strojové učení" },
  { abbreviation: "NHPC", name: "Superpočítání" },
  { abbreviation: "NVER", name: "Verifikace a testování software" },
  { abbreviation: "NEMB", name: "Vestavěné systémy" },
  { abbreviation: "NADE", name: "Vývoj aplikací" },
  { abbreviation: "NSPE", name: "Zpracování zvuku, řeči a přirozeného jazyka" },
];

function getRandomProgramName(): { abbreviation: string; name: string } {
  const randomIndex = Math.floor(Math.random() * mockProgramNames.length);
  return mockProgramNames[randomIndex];
}
