export enum AssessmentCategory {
  ANXIETY = 'anxiety',
  DEPRESSION = 'depression',
  STRESS = 'stress',
  SLEEP = 'sleep',
}

export const ASSESSMENT_CATEGORY_LABELS: Record<AssessmentCategory, string> = {
  [AssessmentCategory.ANXIETY]: '焦虑',
  [AssessmentCategory.DEPRESSION]: '抑郁',
  [AssessmentCategory.STRESS]: '压力',
  [AssessmentCategory.SLEEP]: '睡眠',
};

export const ASSESSMENT_LOG_TEMPLATE =
  'Assessment[id={assessment_id}] submit category={category} score={score}';

