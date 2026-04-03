export interface PatientInput {
  chiefComplaint: string;
  hpi: string;
  neuroExam: string;
  otherExam: string;
  mri: string;
  emg: string;
  csf: string;
  blood: string;
  genetic: string;
  otherTests: string;
  pastHistory: string;
  familyHistory: string;
}

export interface Localization {
  site: string;
  confidence: number;
  supporting_features: string[];
  conflicting_features: string[];
}

export interface Etiology {
  category: string;
  confidence: number;
  supporting_features: string[];
  conflicting_features: string[];
}

export interface Diagnosis {
  diagnosis: string;
  likelihood_rank: number;
  supporting_features: string[];
  against_features: string[];
  comments: string;
}

export interface FeatureExtraction {
  onset_pattern: string;
  time_course: string;
  symptom_distribution: string;
  laterality: string;
  motor_involvement: string;
  sensory_involvement: string;
  autonomic_involvement: string;
  cranial_nerve_involvement: string;
  cerebellar_features: string;
  upper_motor_neuron_signs: string[];
  lower_motor_neuron_signs: string[];
  neuromuscular_junction_features: string[];
  muscle_features: string[];
  red_flags: string[];
  missing_critical_information: string[];
}

export interface RecommendedNextSteps {
  urgent_actions: string[];
  recommended_tests: string[];
  referrals: string[];
  monitoring_suggestions: string[];
}

export interface AnalysisResult {
  case_summary: {
    one_sentence_summary: string;
    clinical_tempo: string;
    main_neurological_domains_involved: string[];
  };
  feature_extraction: FeatureExtraction;
  localization_analysis: {
    primary_localization: Localization;
    secondary_localizations: Localization[];
  };
  etiology_analysis: {
    primary_etiology: Etiology;
    secondary_etiologies: Etiology[];
  };
  differential_diagnoses: Diagnosis[];
  recommended_next_steps: RecommendedNextSteps;
  safety: {
    possible_emergency: boolean;
    reason: string;
  };
}

export const TEST_CASES: Record<string, Partial<PatientInput>> = {
  "Spastic paraparesis / possible myelopathy": {
    chiefComplaint: "Progressive weakness in both legs for 3 months.",
    hpi: "A 54-year-old man developed slowly progressive weakness in both legs over 3 months. He first noticed difficulty climbing stairs, then frequent tripping. Over the last month he also noticed stiffness in both legs. No sensory loss reported. No diplopia. No bowel incontinence, but mild urinary urgency. No fever. No recent infection.",
    neuroExam:
      "Increased tone in both lower limbs. Muscle strength 4/5 in bilateral hip flexion and ankle dorsiflexion. Brisk knee reflexes bilaterally. Bilateral Babinski sign present. Upper limbs normal. No clear fasciculations observed. Sensation to pinprick and vibration largely preserved. Gait spastic.",
    otherExam: "No skin rash. No joint swelling.",
    mri: "not yet done",
    emg: "not yet done",
    csf: "not yet done",
    blood: "CK normal",
    genetic: "none",
    otherTests: "none",
    pastHistory: "Hypertension.",
    familyHistory: "No known neurological disease.",
  },
  "NMJ pattern / possible myasthenia gravis": {
    chiefComplaint: "Intermittent diplopia and drooping eyelids for 6 weeks.",
    hpi: "A 33-year-old woman reports fluctuating ptosis and horizontal diplopia worsening in the evening. Over the last 2 weeks she has noticed chewing fatigue with prolonged meals. No numbness, no limb sensory symptoms, and no bowel or bladder symptoms. Symptoms are worse after exertion and improve after rest.",
    neuroExam:
      "Mild bilateral ptosis, worse after sustained upgaze. Extraocular movements mildly limited after repeated testing. Limb strength is full at rest but mild fatigability appears in shoulder abduction after repetition. Reflexes normal. Sensation intact.",
    otherExam: "Speech slightly nasal after prolonged counting.",
    mri: "brain MRI normal",
    emg: "not yet done",
    csf: "not done",
    blood: "TSH normal",
    genetic: "none",
    otherTests: "none",
    pastHistory: "No major past history.",
    familyHistory: "Non-contributory.",
  },
  "Peripheral neuropathy / length-dependent": {
    chiefComplaint: "Numb feet and imbalance for 8 months.",
    hpi: "A 62-year-old man reports gradually progressive numbness in both feet over 8 months, now extending to mid-calves. He has burning discomfort at night and feels unsteady in the dark. No diplopia, dysphagia, or sphincter symptoms.",
    neuroExam:
      "Reduced pinprick and vibration distally in both legs in a stocking distribution. Ankle reflexes absent bilaterally, knee reflexes reduced. Mild toe extension weakness bilaterally. Romberg positive. Gait wide-based but not spastic.",
    otherExam: "No skin rash. Distal feet mildly cool.",
    mri: "lumbar MRI with mild degenerative changes only",
    emg: "not yet done",
    csf: "not done",
    blood: "HbA1c 7.9%, B12 normal",
    genetic: "none",
    otherTests: "none",
    pastHistory: "Type 2 diabetes.",
    familyHistory: "No known hereditary neuropathy.",
  },
  "Anterior horn / possible ALS phenotype": {
    chiefComplaint: "Progressive hand weakness for 9 months.",
    hpi: "A 58-year-old man developed right hand weakness 9 months ago, followed by left hand weakness and muscle cramps. Over the last 3 months he reports mild slurring of speech. No sensory loss. No diplopia. Weight down 4 kg unintentionally.",
    neuroExam:
      "Marked wasting of intrinsic hand muscles bilaterally, fasciculations in both arms, brisk reflexes in upper and lower limbs, jaw jerk brisk, bilateral extensor plantar responses. Sensation intact. Gait slightly stiff but ambulatory.",
    otherExam: "No rash, no joint swelling.",
    mri: "brain and cervical MRI without explanatory structural lesion",
    emg: "not yet done",
    csf: "not done",
    blood: "CK mildly elevated",
    genetic: "none",
    otherTests: "none",
    pastHistory: "No major past history.",
    familyHistory: "Negative for neurological disease.",
  },
  "Acute hemispheric syndrome / stroke red flag": {
    chiefComplaint: "Sudden left arm and face weakness for 2 hours.",
    hpi: "A 71-year-old woman developed abrupt slurred speech and left face and arm weakness while eating breakfast 2 hours ago. Symptoms reached maximum severity within minutes. No preceding fever or trauma. She has hypertension and atrial fibrillation.",
    neuroExam:
      "Left lower facial weakness, left arm drift, dysarthria, mild left-sided sensory neglect. Reflexes symmetric. Plantars equivocal. Gait not tested.",
    otherExam: "Blood pressure 182/96.",
    mri: "not yet done",
    emg: "not applicable",
    csf: "not applicable",
    blood: "glucose normal on fingerstick",
    genetic: "none",
    otherTests: "none",
    pastHistory: "Atrial fibrillation, hypertension.",
    familyHistory: "Non-contributory.",
  },
};
