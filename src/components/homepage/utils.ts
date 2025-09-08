export enum VALIDITY {
  VALID = "VALID",
  INVALID = "INVALID",
  PARTIAL = "PARTIAL",
}

export const getValidityColor = (valid: VALIDITY | boolean) => {
  switch (valid) {
    case VALIDITY.VALID:
    case true:
      return "bg-green-500";
    case VALIDITY.INVALID:
    case false:
      return "bg-red-500";
    case VALIDITY.PARTIAL:
      return "bg-amber-500";
  }
};

export const getAfterValidityColor = (valid: VALIDITY | boolean) => {
  switch (valid) {
    case VALIDITY.VALID:
    case true:
      return "after:bg-green-500";
    case VALIDITY.INVALID:
    case false:
      return "after:bg-red-500";
    case VALIDITY.PARTIAL:
      return "after:bg-amber-500";
  }
};
