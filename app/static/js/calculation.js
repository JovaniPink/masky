import * as R from "ramda";

const initialData = {
  cardiovascularDisease: false,
  diabetes: false,
  chronicRespitoryDisease: false,
  hypertension: false,
  cancer: false,
  ageRange: null,
  sex: null,
  output: 0.022,
};

const calculate = (data, evt) => {
  // Imports: This calculations uses 'ramda' noted as 'R'
  const {
    cardiovascularDisease,
    diabetes,
    chronicRespitoryDisease,
    hypertension,
    cancer,
    ageRange,
    sex,
  } = data;
  // The expected difference is ~50% between Male and Female so a multiplier should
  // be 1.5 times female rates equals male rates centered on 1. This would be ~.8 and ~1.2.
  // Because of expected interplay between this and other factors in Wuhan (like smoking),
  // along with lack of data, this is reduced to ~.9 and ~1.1 respectively.
  // This attempts to keep male rates from beeing significantly overstated when rates
  // are likely closer than the initial data would suggest.
  // Note: This should be updated as more accurate data comes in
  const sexMultiplierData = {
    male: 1.1,
    female: 0.9,
  };
  // If no sex is given, use a multiplier of 1
  const sexMultiplier = R.propOr(1, sex, sexMultiplierData);
  // The actual age range death rates given by the data
  const ageRateData = {
    "9-": 0,
    "10-19": 0.002,
    "20-29": 0.002,
    "30-39": 0.002,
    "40-49": 0.004,
    "50-59": 0.013,
    "60-69": 0.036,
    "70-79": 0.08,
    "80+": 0.148,
  };
  // For the current selection, get the probabilities for each of the following conditions
  // Note ageRate defaults to the expected general rate of .022 if no age range is selected.
  const ageRate = R.propOr(0.022, ageRange, ageRateData);
  const cardiovascularDiseaseRate = cardiovascularDisease ? 0.105 : 0;
  const diabetesRate = diabetes ? 0.073 : 0;
  const chronicRespitoryDiseaseRate = chronicRespitoryDisease ? 0.063 : 0;
  const hypertensionRate = hypertension ? 0.06 : 0;
  const cancerRate = cancer ? 0.056 : 0;

  // Given lack of data and assumed interplay,
  // For each item in the current selection, add the max of
  //   50% of each death rate
  //   The difference between 80% of the current death rate and the current expected death rate
  // Note: This is highly oversimplified and order matters.
  // Note: This is why it is ordered from potential highest factors (age being uncertain) down to the smallest factors.
  // Note: This is only a rough calculation and attempts to capture assumed interplay with extremely limited data.
  const conditionCalc = (rate, conditionRate) =>
    R.max(conditionRate / 2, conditionRate - rate * 0.8) + rate;
  // Generate the death rate percentage
  // This is converted into survival (1-pct) in the component showing survival rate
  const pct =
    R.reduce(conditionCalc, 0, [
      ageRate,
      cardiovascularDiseaseRate,
      diabetesRate,
      chronicRespitoryDiseaseRate,
      hypertensionRate,
      cancerRate,
    ]) * sexMultiplier;

  this.setState({ data: R.assoc("output", pct, data) });
};
