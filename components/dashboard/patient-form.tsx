"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientInput, TEST_CASES } from "@/lib/types";
import { FileText, ClipboardList, FlaskConical, Loader2 } from "lucide-react";

interface PatientFormProps {
  onSubmit: (data: PatientInput) => void;
  isLoading: boolean;
}

const emptyForm: PatientInput = {
  chiefComplaint: "",
  hpi: "",
  neuroExam: "",
  otherExam: "",
  mri: "",
  emg: "",
  csf: "",
  blood: "",
  genetic: "",
  otherTests: "",
  pastHistory: "",
  familyHistory: "",
};

export function PatientForm({ onSubmit, isLoading }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientInput>(emptyForm);
  const [selectedTestCase, setSelectedTestCase] = useState<string>("");

  const handleChange = (
    field: keyof PatientInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const loadTestCase = (caseName: string) => {
    if (caseName && TEST_CASES[caseName]) {
      const testCase = TEST_CASES[caseName];
      setFormData({
        ...emptyForm,
        ...testCase,
      });
      setSelectedTestCase(caseName);
    }
  };

  const clearForm = () => {
    setFormData(emptyForm);
    setSelectedTestCase("");
  };

  const hasData =
    formData.chiefComplaint.trim() ||
    formData.hpi.trim() ||
    formData.neuroExam.trim();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Case Intake
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={selectedTestCase}
              onChange={(e) => loadTestCase(e.target.value)}
              className="h-9 rounded-[var(--radius)] border border-input bg-background px-3 text-sm"
            >
              <option value="">Load test case...</option>
              {Object.keys(TEST_CASES).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearForm}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="clinical">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="clinical" className="gap-2">
                <FileText className="h-4 w-4" />
                Clinical
              </TabsTrigger>
              <TabsTrigger value="investigations" className="gap-2">
                <FlaskConical className="h-4 w-4" />
                Investigations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clinical" className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Chief Complaint
                </label>
                <Input
                  value={formData.chiefComplaint}
                  onChange={(e) =>
                    handleChange("chiefComplaint", e.target.value)
                  }
                  placeholder="e.g., Progressive bilateral leg weakness for 3 months"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  History of Present Illness
                </label>
                <Textarea
                  value={formData.hpi}
                  onChange={(e) => handleChange("hpi", e.target.value)}
                  placeholder="Describe the onset, progression, associated symptoms, and relevant details..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Neurological Examination
                </label>
                <Textarea
                  value={formData.neuroExam}
                  onChange={(e) => handleChange("neuroExam", e.target.value)}
                  placeholder="Document motor, sensory, reflex, coordination, and cranial nerve findings..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Other Examination
                </label>
                <Textarea
                  value={formData.otherExam}
                  onChange={(e) => handleChange("otherExam", e.target.value)}
                  placeholder="General physical examination findings..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Past Medical History
                  </label>
                  <Textarea
                    value={formData.pastHistory}
                    onChange={(e) => handleChange("pastHistory", e.target.value)}
                    placeholder="Relevant past history..."
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Family History
                  </label>
                  <Textarea
                    value={formData.familyHistory}
                    onChange={(e) =>
                      handleChange("familyHistory", e.target.value)
                    }
                    placeholder="Relevant family history..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investigations" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    MRI
                  </label>
                  <Textarea
                    value={formData.mri}
                    onChange={(e) => handleChange("mri", e.target.value)}
                    placeholder="Brain/spine MRI findings..."
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    EMG / NCS
                  </label>
                  <Textarea
                    value={formData.emg}
                    onChange={(e) => handleChange("emg", e.target.value)}
                    placeholder="Electrodiagnostic findings..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    CSF Analysis
                  </label>
                  <Textarea
                    value={formData.csf}
                    onChange={(e) => handleChange("csf", e.target.value)}
                    placeholder="Lumbar puncture results..."
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Blood Tests
                  </label>
                  <Textarea
                    value={formData.blood}
                    onChange={(e) => handleChange("blood", e.target.value)}
                    placeholder="Relevant blood work..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Genetic Tests
                  </label>
                  <Textarea
                    value={formData.genetic}
                    onChange={(e) => handleChange("genetic", e.target.value)}
                    placeholder="Genetic testing results..."
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Other Tests
                  </label>
                  <Textarea
                    value={formData.otherTests}
                    onChange={(e) => handleChange("otherTests", e.target.value)}
                    placeholder="Any other investigations..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!hasData || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Case...
              </>
            ) : (
              "Analyze Case"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
