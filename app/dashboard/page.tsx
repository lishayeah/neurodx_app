"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientForm } from "@/components/dashboard/patient-form";
import { ResultsPanel } from "@/components/dashboard/results-panel";
import { PatientInput, AnalysisResult } from "@/lib/types";

// Demo analysis result for testing without API
const DEMO_RESULT: AnalysisResult = {
  case_summary: {
    one_sentence_summary:
      "54-year-old male with 3-month progressive spastic paraparesis, bilateral Babinski signs, and urinary urgency suggesting upper motor neuron pathology, most likely at the spinal cord level.",
    clinical_tempo: "Subacute progressive",
    main_neurological_domains_involved: [
      "Motor (corticospinal)",
      "Bladder function",
    ],
  },
  feature_extraction: {
    onset_pattern: "Insidious",
    time_course: "Progressive over 3 months",
    symptom_distribution: "Bilateral lower limbs",
    laterality: "Bilateral symmetric",
    motor_involvement: "Weakness and spasticity in both legs",
    sensory_involvement: "Largely preserved",
    autonomic_involvement: "Mild urinary urgency",
    cranial_nerve_involvement: "None reported",
    cerebellar_features: "None reported",
    upper_motor_neuron_signs: [
      "Increased tone bilaterally",
      "Brisk knee reflexes",
      "Bilateral Babinski sign",
      "Spastic gait",
    ],
    lower_motor_neuron_signs: [],
    neuromuscular_junction_features: [],
    muscle_features: [],
    red_flags: ["Progressive myelopathy requires urgent imaging"],
    missing_critical_information: [
      "Spine MRI",
      "Vitamin B12 level",
      "HTLV-1 serology",
      "Detailed sensory level examination",
    ],
  },
  localization_analysis: {
    primary_localization: {
      site: "Spinal cord (thoracic or cervical)",
      confidence: 85,
      supporting_features: [
        "Bilateral lower limb weakness with preserved upper limbs",
        "Upper motor neuron signs (increased tone, brisk reflexes, Babinski)",
        "Spastic gait pattern",
        "Urinary urgency suggesting cord involvement",
      ],
      conflicting_features: [
        "Sensory level not clearly documented",
        "No back pain mentioned",
      ],
    },
    secondary_localizations: [
      {
        site: "Parasagittal cortex (bilateral)",
        confidence: 15,
        supporting_features: ["Bilateral leg involvement with arm sparing"],
        conflicting_features: [
          "No seizures",
          "No cognitive changes",
          "Urinary symptoms favor cord",
        ],
      },
    ],
  },
  etiology_analysis: {
    primary_etiology: {
      category: "Compressive/Structural",
      confidence: 40,
      supporting_features: [
        "Progressive course",
        "Localized to spinal cord",
        "Hypertension as vascular risk factor",
      ],
      conflicting_features: ["No pain mentioned", "No sensory level"],
    },
    secondary_etiologies: [
      {
        category: "Inflammatory/Demyelinating",
        confidence: 30,
        supporting_features: [
          "Subacute progressive course",
          "UMN predominant pattern",
        ],
        conflicting_features: ["No relapses mentioned", "Age less typical for MS"],
      },
      {
        category: "Degenerative (Motor neuron disease)",
        confidence: 20,
        supporting_features: ["Progressive weakness", "UMN signs"],
        conflicting_features: [
          "No fasciculations",
          "No bulbar involvement",
          "Urinary symptoms atypical",
        ],
      },
    ],
  },
  differential_diagnoses: [
    {
      diagnosis: "Cervical spondylotic myelopathy",
      likelihood_rank: 1,
      supporting_features: [
        "Age group",
        "Progressive spastic paraparesis",
        "Hypertension (degenerative changes)",
      ],
      against_features: ["No arm symptoms", "No neck pain reported"],
      comments:
        "Most common cause of myelopathy in this age group. Urgent MRI spine needed.",
    },
    {
      diagnosis: "Primary progressive MS",
      likelihood_rank: 2,
      supporting_features: [
        "Progressive myelopathy",
        "Relatively preserved sensation",
      ],
      against_features: [
        "Age at onset",
        "No prior relapses",
        "No other CNS symptoms",
      ],
      comments: "Consider if MRI shows demyelinating lesions. Check CSF.",
    },
    {
      diagnosis: "Spinal cord tumor (intrinsic or extrinsic)",
      likelihood_rank: 3,
      supporting_features: ["Progressive course", "Myelopathy pattern"],
      against_features: ["No pain", "No sensory level"],
      comments: "Must be excluded with MRI. Can present without pain.",
    },
    {
      diagnosis: "Hereditary spastic paraplegia",
      likelihood_rank: 4,
      supporting_features: [
        "Pure spastic paraparesis",
        "Relatively preserved sensation",
      ],
      against_features: [
        "Age of onset",
        "Negative family history",
        "Rapid progression",
      ],
      comments: "Usually earlier onset and slower progression. Family history important.",
    },
  ],
  recommended_next_steps: {
    urgent_actions: [
      "MRI cervical and thoracic spine with contrast",
      "Assess for cord compression requiring urgent surgical consultation",
    ],
    recommended_tests: [
      "Vitamin B12 and methylmalonic acid",
      "HTLV-1/2 serology",
      "VDRL/RPR",
      "Copper and ceruloplasmin",
      "HIV testing",
      "Consider lumbar puncture for CSF analysis if MRI non-diagnostic",
    ],
    referrals: [
      "Neurosurgery if compressive lesion identified",
      "Neuroimmunology if inflammatory etiology suspected",
    ],
    monitoring_suggestions: [
      "Serial neurological examinations",
      "Bladder function monitoring",
      "Fall risk assessment",
    ],
  },
  safety: {
    possible_emergency: false,
    reason:
      "While urgent MRI is needed, there are no signs of acute cord compression (sudden onset, rapid deterioration, or complete paralysis).",
  },
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (data: PatientInput) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Use demo result for now
    // In production, this would call your AI API
    setResult(DEMO_RESULT);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">
                  NeuroDx
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
          <ResultsPanel result={result} />
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-[var(--radius)] border border-border bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            For clinical reasoning support only. Not a definitive diagnosis. Do
            not use as the sole basis for urgent medical decisions.
          </p>
        </div>
      </main>
    </div>
  );
}
