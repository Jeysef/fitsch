export function getRandomBoolean() {
  return Math.random() < 0.5;
}

export function getRandomNumber(min: number, max: number) {
  if (max > Number.MAX_SAFE_INTEGER) {
    max = Number.MAX_SAFE_INTEGER;
  }
  if (min < Number.MIN_SAFE_INTEGER) {
    min = Number.MIN_SAFE_INTEGER;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomEnum = <T>(anEnum: T, except?: T[keyof T]): T[keyof T] => {
  const enumValues = [];
  for (const enumMember in anEnum) {
    if (except && anEnum[enumMember] === except) {
      continue;
    }
    enumValues.push(anEnum[enumMember]);
  }
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
};

export const getRandomId = () => {
  return getRandomNumber(1, 9999);
};
