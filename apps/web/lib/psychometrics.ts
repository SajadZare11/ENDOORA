/**
 * Pure TypeScript Educational Psychometrics & Statistical Engine
 * Provides comprehensive descriptive, inferential, and item psychometrics.
 */

export interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  cv: number; // Coefficient of Variation in %
  isHomogeneous: boolean; // CV < 18%
  hasGapAlert: boolean; // CV > 30%
  min: number;
  max: number;
  range: number;
}

export interface QuartileStats {
  q1: number;
  q2: number; // Median
  q3: number;
  iqr: number;
  lowerFence: number; // Q1 - 1.5 * IQR
  upperFence: number; // Q3 + 1.5 * IQR
  outliers: number[];
}

export interface DistributionShape {
  skewness: number;
  skewnessInterpretation: "left_skewed_easy" | "right_skewed_hard" | "symmetric";
  skewnessLabelFa: string;
  kurtosis: number;
  kurtosisLabelFa: string;
}

export interface StudentStandardizedScore {
  studentId: string;
  name: string;
  rawScore: number;
  percentage: number;
  zScore: number;
  tScore: number;
  taraz: number; // 5500 + 1200 * Z
  percentileRank: number;
  isOutlier: boolean;
  isEarlyWarning: boolean; // Z <= -1.0 or in Q1
}

export interface LinearRegressionResult {
  r: number; // Pearson correlation coefficient (-1 to 1)
  rSquared: number;
  slope: number; // a in y = ax + b
  intercept: number; // b in y = ax + b
  interpretationFa: string;
}

export interface ItemAnalysisItem {
  id: string;
  title: string;
  maxPoints: number;
  pValue: number; // Difficulty (0 to 1, higher = easier)
  difficultyLabelFa: "بسیار دشوار" | "دشوار" | "متوسط و ایده‌آل" | "آسان" | "بسیار آسان";
  dIndex: number; // Discrimination index (-1 to 1)
  discriminationLabelFa: "بسیار ضعیف/معکوس" | "نیازمند بازنگری" | "مناسب" | "عالی و تفکیک‌کننده";
}

export interface PsychometricsReport {
  stats: DescriptiveStats;
  quartiles: QuartileStats;
  shape: DistributionShape;
  regression: LinearRegressionResult;
  standardizedScores: StudentStandardizedScore[];
  narrativeFa: string;
}

/**
 * Calculates arithmetic mean
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Number((sum / values.length).toFixed(2));
}

/**
 * Calculates median (Q2)
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
  }
  return Number(sorted[mid].toFixed(2));
}

/**
 * Calculates mode(s)
 */
export function calculateMode(values: number[]): number[] {
  if (values.length === 0) return [];
  const freqMap = new Map<number, number>();
  let maxFreq = 0;

  for (const val of values) {
    const rounded = Number(val.toFixed(2));
    const count = (freqMap.get(rounded) || 0) + 1;
    freqMap.set(rounded, count);
    if (count > maxFreq) {
      maxFreq = count;
    }
  }

  if (maxFreq <= 1 && values.length > 1) {
    // If every score appears only once, there is no distinct mode
    return [];
  }

  const modes: number[] = [];
  freqMap.forEach((count, val) => {
    if (count === maxFreq) {
      modes.push(val);
    }
  });

  return modes.sort((a, b) => a - b);
}

/**
 * Calculates population or sample standard deviation and variance
 */
export function calculateDispersion(values: number[]): { variance: number; stdDev: number; cv: number } {
  if (values.length < 2) {
    return { variance: 0, stdDev: 0, cv: 0 };
  }
  const mean = calculateMean(values);
  const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
  // Sample variance (n - 1)
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / (values.length - 1);
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0;

  return {
    variance: Number(variance.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    cv: Number(cv.toFixed(2)),
  };
}

/**
 * Computes percentile value using Linear Interpolation (inclusive)
 */
export function calculatePercentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  if (sortedValues.length === 1) return sortedValues[0];
  if (p <= 0) return sortedValues[0];
  if (p >= 1) return sortedValues[sortedValues.length - 1];

  const index = p * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) return sortedValues[lower];
  return Number((sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight).toFixed(2));
}

/**
 * Computes Quartiles (Q1, Q2, Q3), IQR, and Tukey's Outliers
 */
export function calculateQuartiles(values: number[]): QuartileStats {
  if (values.length === 0) {
    return { q1: 0, q2: 0, q3: 0, iqr: 0, lowerFence: 0, upperFence: 0, outliers: [] };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = calculatePercentile(sorted, 0.25);
  const q2 = calculatePercentile(sorted, 0.5);
  const q3 = calculatePercentile(sorted, 0.75);
  const iqr = Number((q3 - q1).toFixed(2));
  const lowerFence = Number((q1 - 1.5 * iqr).toFixed(2));
  const upperFence = Number((q3 + 1.5 * iqr).toFixed(2));

  const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);

  return {
    q1,
    q2,
    q3,
    iqr,
    lowerFence,
    upperFence,
    outliers,
  };
}

/**
 * Computes Skewness and Kurtosis of the score distribution
 */
export function calculateDistributionShape(values: number[]): DistributionShape {
  if (values.length < 3) {
    return {
      skewness: 0,
      skewnessInterpretation: "symmetric",
      skewnessLabelFa: "متقارن (توزیع نرمال استاندارد)",
      kurtosis: 3,
      kurtosisLabelFa: "کشیدگی استاندارد",
    };
  }

  const n = values.length;
  const mean = calculateMean(values);
  const { stdDev } = calculateDispersion(values);

  if (stdDev === 0) {
    return {
      skewness: 0,
      skewnessInterpretation: "symmetric",
      skewnessLabelFa: "کاملاً یکنواخت و بدون پراکندگی",
      kurtosis: 0,
      kurtosisLabelFa: "تخت",
    };
  }

  // Sample skewness formula
  const m3 = values.reduce((acc, v) => acc + Math.pow(v - mean, 3), 0) / n;
  const skewness = Number((m3 / Math.pow(stdDev, 3)).toFixed(2));

  // Sample excess kurtosis
  const m4 = values.reduce((acc, v) => acc + Math.pow(v - mean, 4), 0) / n;
  const kurtosis = Number((m4 / Math.pow(stdDev, 4)).toFixed(2));

  let skewnessInterpretation: "left_skewed_easy" | "right_skewed_hard" | "symmetric" = "symmetric";
  let skewnessLabelFa = "متقارن و استاندارد (آزمون متوازن)";

  if (skewness < -0.3) {
    skewnessInterpretation = "left_skewed_easy";
    skewnessLabelFa = "چوله به چپ (تراکم نمرات بالا / آزمون روان و مسلط)";
  } else if (skewness > 0.3) {
    skewnessInterpretation = "right_skewed_hard";
    skewnessLabelFa = "چوله به راست (تراکم نمرات پایین / آزمون دشوار یا نیاز به جبران)";
  }

  let kurtosisLabelFa = "کشیدگی متعادل (مزوکورتیک)";
  if (kurtosis > 3.5) {
    kurtosisLabelFa = "نوک‌تیز و متمرکز حول میانگین (لپتوکورتیک)";
  } else if (kurtosis < 2.5) {
    kurtosisLabelFa = "پهن و پراکنده در دامنه نمرات (پلاتی‌کورتیک)";
  }

  return {
    skewness,
    skewnessInterpretation,
    skewnessLabelFa,
    kurtosis,
    kurtosisLabelFa,
  };
}

/**
 * Computes individual standardized metrics (Z, T, Taraz, Percentile Rank)
 */
export function calculateStudentStandardizedScores(
  students: Array<{ id: string; name: string; score: number; isAbsent?: boolean }>,
  maxScore: number
): StudentStandardizedScore[] {
  const presentStudents = students.filter((s) => !s.isAbsent);
  if (presentStudents.length === 0) return [];

  const rawScores = presentStudents.map((s) => s.score);
  const mean = calculateMean(rawScores);
  const { stdDev } = calculateDispersion(rawScores);
  const quartiles = calculateQuartiles(rawScores);
  const sortedRaw = [...rawScores].sort((a, b) => a - b);

  return presentStudents.map((student) => {
    const rawScore = student.score;
    const percentage = maxScore > 0 ? Number(((rawScore / maxScore) * 100).toFixed(1)) : 0;
    const zScore = stdDev > 0 ? Number(((rawScore - mean) / stdDev).toFixed(2)) : 0;
    const tScore = Number((50 + 10 * zScore).toFixed(1));
    const taraz = Math.round(5500 + 1200 * zScore);

    // Percentile rank: % of students with score strictly less than this student
    const belowCount = sortedRaw.filter((v) => v < rawScore).length;
    const sameCount = sortedRaw.filter((v) => v === rawScore).length;
    const percentileRank = Number(
      (((belowCount + 0.5 * sameCount) / sortedRaw.length) * 100).toFixed(1)
    );

    const isOutlier = rawScore < quartiles.lowerFence || rawScore > quartiles.upperFence;
    const isEarlyWarning = zScore <= -1.0 || rawScore <= quartiles.q1;

    return {
      studentId: student.id,
      name: student.name,
      rawScore,
      percentage,
      zScore,
      tScore,
      taraz,
      percentileRank,
      isOutlier,
      isEarlyWarning,
    };
  });
}

/**
 * Computes Pearson correlation and linear regression between Study Hours (X) and Exam Scores (Y)
 */
export function calculateStudyGradeRegression(
  dataPoints: Array<{ studyHours: number; score: number; isAbsent?: boolean }>
): LinearRegressionResult {
  const activePoints = dataPoints.filter((d) => !d.isAbsent && d.studyHours >= 0 && d.score >= 0);
  const n = activePoints.length;

  if (n < 2) {
    return {
      r: 0,
      rSquared: 0,
      slope: 0,
      intercept: 0,
      interpretationFa: "داده‌های کافی برای برازش خط رگرسیون وجود ندارد.",
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const pt of activePoints) {
    sumX += pt.studyHours;
    sumY += pt.score;
    sumXY += pt.studyHours * pt.score;
    sumX2 += pt.studyHours * pt.studyHours;
    sumY2 += pt.score * pt.score;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominatorX = n * sumX2 - sumX * sumX;
  const denominatorY = n * sumY2 - sumY * sumY;
  const denominator = Math.sqrt(denominatorX * denominatorY);

  const r = denominator !== 0 ? Number((numerator / denominator).toFixed(3)) : 0;
  const rSquared = Number((r * r).toFixed(3));

  const slope = denominatorX !== 0 ? Number((numerator / denominatorX).toFixed(2)) : 0;
  const intercept = Number(((sumY - slope * sumX) / n).toFixed(2));

  let correlationStrengthFa = "همبستگی مستقیم متوسط";
  if (r >= 0.7) correlationStrengthFa = "همبستگی مستقیم بسیار قوی";
  else if (r >= 0.4) correlationStrengthFa = "همبستگی مستقیم متوسط به بالا";
  else if (r > 0) correlationStrengthFa = "همبستگی مستقیم ضعیف";
  else if (r === 0) correlationStrengthFa = "عدم وجود رابطه خطی";
  else correlationStrengthFa = "همبستگی معکوس";

  const interpretationFa =
    slope > 0
      ? `${correlationStrengthFa} (r = ${r}): به ازای هر ۱ ساعت مطالعه هفتگی بیشتر، نمره دانش‌آموز به طور میانگین ${slope} نمره رشد می‌کند.`
      : `${correlationStrengthFa} (r = ${r}): اثر زمان مطالعه بر نمره به شکل خطی معنادار نبوده است.`;

  return {
    r,
    rSquared,
    slope,
    intercept,
    interpretationFa,
  };
}

/**
 * Item Analysis: Computes p-value (difficulty), d-index (discrimination), and Cronbach's Alpha
 */
export function calculateItemAnalysis(
  items: Array<{ id: string; title: string; maxPoints: number }>,
  studentItemScores: Array<{ studentId: string; totalScore: number; scores: Record<string, number> }>
): { items: ItemAnalysisItem[]; cronbachAlpha: number } {
  if (studentItemScores.length === 0 || items.length === 0) {
    return { items: [], cronbachAlpha: 0 };
  }

  const sortedStudents = [...studentItemScores].sort((a, b) => b.totalScore - a.totalScore);
  const n = sortedStudents.length;
  // 27% upper and lower groups for standard Kelly discrimination analysis
  const groupSize = Math.max(1, Math.round(n * 0.27));
  const highGroup = sortedStudents.slice(0, groupSize);
  const lowGroup = sortedStudents.slice(n - groupSize);

  const analyzedItems: ItemAnalysisItem[] = items.map((item) => {
    const allScores = sortedStudents.map((s) => s.scores[item.id] || 0);
    const meanScore = calculateMean(allScores);
    const pValue = item.maxPoints > 0 ? Number((meanScore / item.maxPoints).toFixed(2)) : 0;

    let difficultyLabelFa: ItemAnalysisItem["difficultyLabelFa"] = "متوسط و ایده‌آل";
    if (pValue < 0.25) difficultyLabelFa = "بسیار دشوار";
    else if (pValue < 0.45) difficultyLabelFa = "دشوار";
    else if (pValue > 0.85) difficultyLabelFa = "بسیار آسان";
    else if (pValue > 0.7) difficultyLabelFa = "آسان";

    const highMean = calculateMean(highGroup.map((s) => s.scores[item.id] || 0));
    const lowMean = calculateMean(lowGroup.map((s) => s.scores[item.id] || 0));
    const dIndex =
      item.maxPoints > 0 ? Number(((highMean - lowMean) / item.maxPoints).toFixed(2)) : 0;

    let discriminationLabelFa: ItemAnalysisItem["discriminationLabelFa"] = "مناسب";
    if (dIndex >= 0.4) discriminationLabelFa = "عالی و تفکیک‌کننده";
    else if (dIndex >= 0.2) discriminationLabelFa = "مناسب";
    else if (dIndex >= 0.1) discriminationLabelFa = "نیازمند بازنگری";
    else discriminationLabelFa = "بسیار ضعیف/معکوس";

    return {
      id: item.id,
      title: item.title,
      maxPoints: item.maxPoints,
      pValue,
      difficultyLabelFa,
      dIndex,
      discriminationLabelFa,
    };
  });

  // Cronbach's Alpha: a = (k / (k - 1)) * (1 - sum(var_i) / var_total)
  let cronbachAlpha = 0;
  const k = items.length;
  if (k > 1 && n > 2) {
    const totalScores = sortedStudents.map((s) => s.totalScore);
    const totalVariance = calculateDispersion(totalScores).variance;

    let sumItemVariances = 0;
    for (const item of items) {
      const itemScores = sortedStudents.map((s) => s.scores[item.id] || 0);
      sumItemVariances += calculateDispersion(itemScores).variance;
    }

    if (totalVariance > 0) {
      const alpha = (k / (k - 1)) * (1 - sumItemVariances / totalVariance);
      cronbachAlpha = Number(Math.max(0, Math.min(1, alpha)).toFixed(2));
    }
  }

  return { items: analyzedItems, cronbachAlpha };
}

/**
 * Generates an automated, educational diagnostic narrative in fluent Persian
 */
export function generateClassNarrative(
  stats: DescriptiveStats,
  quartiles: QuartileStats,
  shape: DistributionShape,
  regression: LinearRegressionResult,
  maxScore: number
): string {
  const percentageMean = maxScore > 0 ? ((stats.mean / maxScore) * 100).toFixed(1) : "0";

  let performanceTier = "در سطح مطلوب و رضایت‌بخش";
  if (Number(percentageMean) >= 85) performanceTier = "در سطح بسیار عالی و پیشرو";
  else if (Number(percentageMean) < 60) performanceTier = "نیازمند برنامه مداخله و تدریس جبرانی";

  let cvNarrative = "";
  if (stats.cv < 18) {
    cvNarrative = `ضریب تغییرات کلاس (${stats.cv}٪) نشان‌دهنده همگنی بسیار بالا و پیوستگی یکنواخت آموزشی میان دانش‌آموزان است.`;
  } else if (stats.cv > 30) {
    cvNarrative = `هشدار: ضریب تغییرات بالا (${stats.cv}٪) بیانگر شکاف آموزشی عمیق و فاصله معنادار میان نمرات صدر و انتهای کلاس است که ضرورت تدریس تفکیکی را اثبات می‌کند.`;
  } else {
    cvNarrative = `پراکندگی نمرات با ضریب تغییرات (${stats.cv}٪) در محدوده استاندارد کلاسی قرار دارد.`;
  }

  let skewNarrative = "";
  if (shape.skewnessInterpretation === "left_skewed_easy") {
    skewNarrative = "چولگی منفی توزیع تایید می‌کند که اکثریت دانش‌آموزان بر مفاهیم آزمون تسلط داشته و چگالی نمرات در بخش بالایی متمرکز است.";
  } else if (shape.skewnessInterpretation === "right_skewed_hard") {
    skewNarrative = "چولگی مثبت توزیع حاکی از سختی نسبی سوالات یا نقص در تثبیت پیش‌نیازهاست و نمرات در نیمه پایانی تجمیع شده‌اند.";
  } else {
    skewNarrative = "توزیع نمرات تقارن زنگوله‌ای استانداردی دارد و نشان‌دهنده طراحی متوازن آزمون است.";
  }

  let outlierNarrative = "";
  if (quartiles.outliers.length > 0) {
    outlierNarrative = ` تعداد ${quartiles.outliers.length} داده پرت بر اساس کران توکی شناسایی شد که عملکرد غیرعادی (افت شدید یا جهش خاص) داشته و به بررسی انفرادی مشاور نیاز دارند.`;
  }

  const studyNarrative =
    regression.slope > 0
      ? `تحلیل رگرسیون حاکی از رابطه مثبت زمان مطالعه بر بازده آزمون است (هر ساعت مطالعه معادل تقریباً ${regression.slope} نمره رشد).`
      : "";

  return `عملکرد عمومی کلاس با میانگین نمره ${stats.mean} از سقف ${maxScore} (${percentageMean}٪) ${performanceTier} ارزیابی می‌شود. ${cvNarrative} ${skewNarrative} دامنه میان‌چارکی (IQR) نمرات معادل ${quartiles.iqr} واحد بوده که تمرکز ۵۰ درصد میانی کلاس را نشان می‌دهد.${outlierNarrative} ${studyNarrative}`.trim();
}
