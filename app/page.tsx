"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

interface PatientInput {
  age: string;
  sex: string;
  onset: string;
  course: string;
  symptoms: string[];
  localization: string[];
  redFlags: string[];
  notes: string;
}

interface Diagnosis {
  name: string;
  confidence: "low" | "medium" | "high";
  explanation: string;
}

interface AnalysisResult {
  localization: string;
  alternativeLocalizations: string[];
  etiology: string;
  urgency: "routine" | "urgent" | "emergent";
  differentials: Diagnosis[];
  supportingFeatures: string[];
  conflictingFeatures: string[];
  nextSteps: string[];
}

const SYMPTOMS = [
  "Weakness",
  "Sensory loss",
  "Tremor",
  "Ataxia",
  "Cognitive decline",
  "Seizure",
  "Visual symptoms",
  "Speech disturbance",
  "Gait difficulty",
  "Pain",
  "Autonomic symptoms",
];

const LOCALIZATIONS = [
  "UMN signs",
  "LMN signs",
  "Peripheral nerve",
  "Neuromuscular junction",
  "Muscle",
  "Cerebellar",
  "Cortex",
  "Basal ganglia",
  "Brainstem",
  "Spinal cord",
  "Sensory tract involvement",
];

const RED_FLAGS = [
  "Rapid progression",
  "Fever",
  "Immunosuppression",
  "Cancer history",
  "Trauma",
  "Altered mental status",
  "Acute respiratory involvement",
  "Sphincter dysfunction",
];

const initialInput: PatientInput = {
  age: "",
  sex: "",
  onset: "",
  course: "",
  symptoms: [],
  localization: [],
  redFlags: [],
  notes: "",
};

const demoResult: AnalysisResult = {
  localization: "Lower motor neuron (anterior horn cells)",
  alternativeLocalizations: ["Peripheral nerve", "Motor neuron disease spectrum"],
  etiology: "Degenerative / Motor neuron disease",
  urgency: "urgent",
  differentials: [
    {
      name: "Amyotrophic Lateral Sclerosis (ALS)",
      confidence: "high",
      explanation: "Progressive weakness with mixed UMN/LMN signs, no sensory involvement",
    },
    {
      name: "Progressive Muscular Atrophy",
      confidence: "medium",
      explanation: "LMN-predominant variant if UMN signs are subtle",
    },
    {
      name: "Multifocal Motor Neuropathy",
      confidence: "low",
      explanation: "Consider if conduction block present on EMG",
    },
  ],
  supportingFeatures: [
    "Progressive course",
    "Mixed UMN and LMN signs",
    "No sensory involvement",
    "Adult onset",
  ],
  conflictingFeatures: [
    "Young age would be atypical",
    "Sensory symptoms if present",
  ],
  nextSteps: [
    "EMG/NCS - assess for denervation pattern",
    "MRI cervical spine - rule out structural lesion",
    "CK level",
    "Consider genetic testing if young onset",
    "Neurology referral - urgent",
  ],
};

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm hover:bg-muted/50 rounded px-2 py-1.5 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
      />
      <span className="text-foreground">{label}</span>
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function NeuroDxTool() {
  const [input, setInput] = useState<PatientInput>(initialInput);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleArrayItem = (
    field: "symptoms" | "localization" | "redFlags",
    item: string
  ) => {
    setInput((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleAnalyzeCase = async () => {
    setIsAnalyzing(true);
    // Simulate API call - replace with actual backend call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setResult(demoResult);
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setInput(initialInput);
    setResult(null);
  };

  const hasRedFlags = input.redFlags.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">NeuroDx</h1>
              <p className="text-xs text-muted-foreground">
                Structured neurological reasoning support
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">For clinician use</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Patient Input */}
          <div className="space-y-4">
            {/* Basic Information */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                    <Input
                      type="number"
                      placeholder="Years"
                      value={input.age}
                      onChange={(e) => setInput({ ...input, age: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Sex</label>
                    <Select
                      value={input.sex}
                      onChange={(v) => setInput({ ...input, sex: v })}
                      placeholder="Select"
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                      ]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Course */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Time Course</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Onset</label>
                    <Select
                      value={input.onset}
                      onChange={(v) => setInput({ ...input, onset: v })}
                      placeholder="Select onset"
                      options={[
                        { value: "acute", label: "Acute (<24h)" },
                        { value: "subacute", label: "Subacute (days-weeks)" },
                        { value: "chronic", label: "Chronic (months-years)" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Course</label>
                    <Select
                      value={input.course}
                      onChange={(v) => setInput({ ...input, course: v })}
                      placeholder="Select course"
                      options={[
                        { value: "progressive", label: "Progressive" },
                        { value: "stable", label: "Stable" },
                        { value: "fluctuating", label: "Fluctuating" },
                        { value: "relapsing", label: "Relapsing" },
                      ]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Symptoms */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Key Symptoms</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-0">
                  {SYMPTOMS.map((symptom) => (
                    <Checkbox
                      key={symptom}
                      checked={input.symptoms.includes(symptom)}
                      onChange={() => toggleArrayItem("symptoms", symptom)}
                      label={symptom}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Localization Clues */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Localization Clues</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-0">
                  {LOCALIZATIONS.map((loc) => (
                    <Checkbox
                      key={loc}
                      checked={input.localization.includes(loc)}
                      onChange={() => toggleArrayItem("localization", loc)}
                      label={loc}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Red Flags */}
            <Card className={hasRedFlags ? "border-destructive/50" : ""}>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  Red Flags
                  {hasRedFlags && (
                    <Badge variant="destructive" className="text-xs font-normal">
                      {input.redFlags.length} selected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-0">
                  {RED_FLAGS.map((flag) => (
                    <Checkbox
                      key={flag}
                      checked={input.redFlags.includes(flag)}
                      onChange={() => toggleArrayItem("redFlags", flag)}
                      label={flag}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clinical Notes */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <Textarea
                  placeholder="Optional additional notes..."
                  value={input.notes}
                  onChange={(e) => setInput({ ...input, notes: e.target.value })}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAnalyzeCase}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Case"
                )}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            {!result ? (
              <Card className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Enter patient data and click &quot;Analyze Case&quot; to see results
                </p>
              </Card>
            ) : (
              <>
                {/* Summary Card */}
                <Card className={result.urgency === "emergent" ? "border-destructive" : result.urgency === "urgent" ? "border-amber-500" : ""}>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      Clinical Reasoning Summary
                      {result.urgency !== "routine" && (
                        <Badge variant={result.urgency === "emergent" ? "destructive" : "secondary"} className="text-xs font-normal">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {result.urgency === "emergent" ? "Emergent" : "Urgent"}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Likely Localization</span>
                      <p className="text-sm">{result.localization}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Likely Etiology</span>
                      <p className="text-sm">{result.etiology}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Differential Diagnosis */}
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium">Differential Diagnosis</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 space-y-3">
                    {result.differentials.map((dx, i) => (
                      <div key={i} className="border-b border-border last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{i + 1}. {dx.name}</span>
                          <Badge
                            variant="secondary"
                            className={`text-xs font-normal ${
                              dx.confidence === "high"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : dx.confidence === "medium"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {dx.confidence}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{dx.explanation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Supporting & Conflicting Features */}
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium">Supporting & Conflicting Features</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1.5">Supporting</span>
                        <ul className="space-y-1">
                          {result.supportingFeatures.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1.5">Conflicting</span>
                        <ul className="space-y-1">
                          {result.conflictingFeatures.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <XCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Localization Summary */}
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium">Localization Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Most likely</span>
                      <p className="text-sm">{result.localization}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Alternatives</span>
                      <p className="text-sm">{result.alternativeLocalizations.join(", ")}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium">Suggested Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <ul className="space-y-1.5">
                      {result.nextSteps.map((step, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-primary font-medium">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center px-4">
                  This tool is intended to support structured clinical reasoning and does not replace clinical judgment.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
