"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  MinusCircle,
  Loader2,
  FileText,
} from "lucide-react";

interface PatientInput {
  caseSummary: string;
  age: string;
  sex: string;
  onset: string;
  course: string;
  clinicalFeatures: string[];
  systemInvolvement: string[];
  redFlags: string[];
  notes: string;
}

interface Diagnosis {
  name: string;
  confidence: "Low" | "Moderate" | "High";
  explanation: string;
}

interface AnalysisResult {
  pattern: string;
  likelySystem: string;
  urgency: string;
  differentials: Diagnosis[];
  supportingFeatures: string[];
  conflictingFeatures: string[];
  primaryInvolvement: string;
  alternativeConsiderations: string[];
  nextSteps: string[];
}

const CLINICAL_FEATURES = [
  "Weakness",
  "Sensory symptoms",
  "Tremor",
  "Ataxia",
  "Cognitive changes",
  "Seizure",
  "Visual disturbance",
  "Speech difficulty",
  "Gait disturbance",
  "Pain",
  "Autonomic symptoms",
];

const SYSTEM_INVOLVEMENT = [
  "Predominantly motor",
  "Predominantly sensory",
  "Mixed motor + sensory",
  "Central nervous system pattern",
  "Peripheral nervous system pattern",
  "Cerebellar pattern",
  "Cognitive / cortical pattern",
];

const RED_FLAGS = [
  "Rapid progression",
  "Fever or infection signs",
  "Immunosuppression",
  "Cancer history",
  "Recent trauma",
  "Altered consciousness",
  "Respiratory involvement",
  "Sphincter dysfunction",
];

const initialInput: PatientInput = {
  caseSummary: "",
  age: "",
  sex: "",
  onset: "",
  course: "",
  clinicalFeatures: [],
  systemInvolvement: [],
  redFlags: [],
  notes: "",
};

const demoResult: AnalysisResult = {
  pattern: "Chronic progressive motor-predominant presentation",
  likelySystem: "Motor neuron / neuromuscular system",
  urgency: "No immediate red flags identified",
  differentials: [
    {
      name: "Amyotrophic Lateral Sclerosis",
      confidence: "High",
      explanation:
        "Suggested by progressive motor involvement without sensory features",
    },
    {
      name: "Myopathy",
      confidence: "Moderate",
      explanation:
        "Consider due to weakness, though pattern remains less specific",
    },
    {
      name: "Peripheral neuropathy",
      confidence: "Low",
      explanation: "Less likely given the absence of sensory symptoms",
    },
  ],
  supportingFeatures: [
    "Progressive course",
    "Motor involvement",
    "No sensory symptoms",
  ],
  conflictingFeatures: ["No clear upper motor neuron signs documented"],
  primaryInvolvement: "Motor neuron system",
  alternativeConsiderations: ["Muscle disease", "Peripheral nerve disorder"],
  nextSteps: [
    "Electromyography (EMG)",
    "MRI brain and spine",
    "Creatine kinase (CK)",
    "Neurology referral",
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
    <label className="flex items-center gap-2.5 cursor-pointer text-sm py-1.5 hover:text-foreground transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-0"
      />
      <span className={checked ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
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
      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
    >
      <option value="" className="text-muted-foreground">
        {placeholder}
      </option>
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
    field: "clinicalFeatures" | "systemInvolvement" | "redFlags",
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
    // Simulate backend call - replace with actual API integration
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">
                NeuroDx
              </h1>
              <p className="text-xs text-muted-foreground">
                Structured clinical reasoning support (neurology-focused)
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            For clinician use only
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input Panel */}
          <div className="space-y-4">
            {/* Quick Case Summary - Prominent at top */}
            <Card className="border-primary/20 bg-primary/[0.02]">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Quick Case Summary
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Paste or type a short case summary
                </p>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <Textarea
                  placeholder="e.g. 65M with progressive weakness over 6 months, no sensory symptoms"
                  value={input.caseSummary}
                  onChange={(e) =>
                    setInput({ ...input, caseSummary: e.target.value })
                  }
                  rows={3}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Age
                    </label>
                    <Input
                      type="number"
                      placeholder="Years"
                      value={input.age}
                      onChange={(e) =>
                        setInput({ ...input, age: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Sex
                    </label>
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
                <CardTitle className="text-sm font-medium">
                  Time Course
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Onset
                    </label>
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
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Course
                    </label>
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

            {/* Key Clinical Features */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">
                  Key Clinical Features
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-x-4">
                  {CLINICAL_FEATURES.map((feature) => (
                    <Checkbox
                      key={feature}
                      checked={input.clinicalFeatures.includes(feature)}
                      onChange={() =>
                        toggleArrayItem("clinicalFeatures", feature)
                      }
                      label={feature}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System / Pattern Involvement */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">
                  System / Pattern Involvement
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  If known
                </p>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-0">
                  {SYSTEM_INVOLVEMENT.map((system) => (
                    <Checkbox
                      key={system}
                      checked={input.systemInvolvement.includes(system)}
                      onChange={() =>
                        toggleArrayItem("systemInvolvement", system)
                      }
                      label={system}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Red Flags */}
            <Card
              className={
                hasRedFlags
                  ? "border-amber-500/50 bg-amber-50/30"
                  : ""
              }
            >
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  Red Flags
                  {hasRedFlags && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-normal"
                    >
                      {input.redFlags.length} selected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-x-4">
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

            {/* Additional Clinical Notes */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">
                  Additional Clinical Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <Textarea
                  placeholder="Optional additional information..."
                  value={input.notes}
                  onChange={(e) =>
                    setInput({ ...input, notes: e.target.value })
                  }
                  rows={3}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Action Bar */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAnalyzeCase}
                disabled={isAnalyzing}
                className="flex-1 h-11"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing clinical pattern...
                  </>
                ) : (
                  "Analyze Case"
                )}
              </Button>
              <Button variant="outline" onClick={handleClear} className="h-11">
                Clear
              </Button>
            </div>
          </div>

          {/* Right Column - Results Panel */}
          <div className="space-y-4">
            {!result ? (
              <Card className="h-80 flex items-center justify-center border-dashed">
                <div className="text-center px-6">
                  <Activity className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Enter clinical information and select &quot;Analyze
                    Case&quot; to generate structured reasoning
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {/* Clinical Reasoning Summary */}
                <Card>
                  <CardHeader className="py-3 px-4 border-b border-border">
                    <CardTitle className="text-sm font-medium">
                      Clinical Reasoning Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-4 space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Most likely pattern
                      </span>
                      <p className="text-sm text-foreground">{result.pattern}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Likely system
                      </span>
                      <p className="text-sm text-foreground">
                        {result.likelySystem}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Urgency
                      </span>
                      <p className="text-sm text-foreground">{result.urgency}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Differential Diagnosis */}
                <Card>
                  <CardHeader className="py-3 px-4 border-b border-border">
                    <CardTitle className="text-sm font-medium">
                      Differential Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-0 divide-y divide-border">
                    {result.differentials.map((dx, i) => (
                      <div key={i} className="py-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {i + 1}. {dx.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs font-normal shrink-0 ${
                              dx.confidence === "High"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : dx.confidence === "Moderate"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            Confidence: {dx.confidence}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {dx.explanation}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Clinical Reasoning */}
                <Card>
                  <CardHeader className="py-3 px-4 border-b border-border">
                    <CardTitle className="text-sm font-medium">
                      Clinical Reasoning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-4 space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-2">
                        Supporting
                      </span>
                      <ul className="space-y-1.5">
                        {result.supportingFeatures.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-2">
                        Conflicting
                      </span>
                      <ul className="space-y-1.5">
                        {result.conflictingFeatures.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <MinusCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* System Insight */}
                <Card>
                  <CardHeader className="py-3 px-4 border-b border-border">
                    <CardTitle className="text-sm font-medium">
                      System Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-4 space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Primary involvement
                      </span>
                      <p className="text-sm text-foreground">
                        {result.primaryInvolvement}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Alternative considerations
                      </span>
                      <p className="text-sm text-foreground">
                        {result.alternativeConsiderations.join(", ")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Next Steps */}
                <Card>
                  <CardHeader className="py-3 px-4 border-b border-border">
                    <CardTitle className="text-sm font-medium">
                      Suggested Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-4">
                    <ul className="space-y-2">
                      {result.nextSteps.map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <span className="text-primary font-medium w-5 shrink-0">
                            {i + 1}.
                          </span>
                          <span className="text-foreground">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 px-1 pt-2">
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This tool supports structured clinical reasoning and does
                    not replace clinical judgment.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
