"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/lib/types";
import {
  Activity,
  Brain,
  AlertTriangle,
  Stethoscope,
  TestTube2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
} from "lucide-react";

interface ResultsPanelProps {
  result: AnalysisResult | null;
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  if (confidence >= 75) {
    return <Badge variant="success">High ({confidence}%)</Badge>;
  }
  if (confidence >= 45) {
    return <Badge variant="warning">Moderate ({confidence}%)</Badge>;
  }
  return <Badge variant="secondary">Low ({confidence}%)</Badge>;
}

function FeatureList({
  features,
  type,
}: {
  features: string[];
  type: "supporting" | "against";
}) {
  if (!features || features.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">None documented</p>
    );
  }

  return (
    <ul className="space-y-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm">
          {type === "supporting" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          )}
          <span className="text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  if (!result) {
    return (
      <Card className="flex h-full flex-col items-center justify-center bg-muted/20">
        <CardContent className="py-12 text-center">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No Analysis Yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter case details and click Analyze Case to see results
          </p>
        </CardContent>
      </Card>
    );
  }

  const isEmergency = result.safety?.possible_emergency;
  const primaryLoc = result.localization_analysis?.primary_localization;
  const primaryEt = result.etiology_analysis?.primary_etiology;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="h-5 w-5 text-primary" />
            Clinical Output
          </CardTitle>
          {isEmergency && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Emergency
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Alert */}
        {isEmergency && (
          <div className="rounded-[var(--radius)] border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-center gap-2 font-medium text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Possible Emergency
            </div>
            <p className="mt-1 text-sm text-destructive/90">
              {result.safety?.reason}
            </p>
          </div>
        )}

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[var(--radius)] border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Tempo
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {result.case_summary?.clinical_tempo || "Unknown"}
            </p>
          </div>
          <div className="rounded-[var(--radius)] border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Localization
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {primaryLoc?.site || "Unknown"}
            </p>
          </div>
          <div className="rounded-[var(--radius)] border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Brain className="h-3.5 w-3.5" />
              Etiology
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {primaryEt?.category || "Unknown"}
            </p>
          </div>
          <div className="rounded-[var(--radius)] border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5" />
              Emergency
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {isEmergency ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Case Summary */}
        <div className="rounded-[var(--radius)] border border-border bg-accent/30 p-4">
          <h4 className="text-sm font-medium text-foreground">Case Summary</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            {result.case_summary?.one_sentence_summary}
          </p>
          {result.case_summary?.main_neurological_domains_involved?.length >
            0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.case_summary.main_neurological_domains_involved.map(
                (domain, idx) => (
                  <Badge key={idx} variant="secondary">
                    {domain}
                  </Badge>
                )
              )}
            </div>
          )}
        </div>

        {/* Red Flags */}
        {result.feature_extraction?.red_flags?.length > 0 && (
          <div className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              Red Flags
            </h4>
            <ul className="mt-2 space-y-1">
              {result.feature_extraction.red_flags.map((flag, idx) => (
                <li key={idx} className="text-sm text-amber-700">
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Tabs */}
        <Tabs defaultValue="localization">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="etiology">Etiology</TabsTrigger>
            <TabsTrigger value="differentials">Differentials</TabsTrigger>
            <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="localization" className="mt-4 space-y-4">
            <div className="rounded-[var(--radius)] border border-border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">
                  Primary Localization
                </h4>
                {primaryLoc?.confidence && (
                  <ConfidenceBadge confidence={primaryLoc.confidence} />
                )}
              </div>
              <p className="mt-2 text-lg font-semibold text-primary">
                {primaryLoc?.site}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h5 className="mb-2 text-sm font-medium text-foreground">
                    Supporting Features
                  </h5>
                  <FeatureList
                    features={primaryLoc?.supporting_features || []}
                    type="supporting"
                  />
                </div>
                <div>
                  <h5 className="mb-2 text-sm font-medium text-foreground">
                    Conflicting Features
                  </h5>
                  <FeatureList
                    features={primaryLoc?.conflicting_features || []}
                    type="against"
                  />
                </div>
              </div>
            </div>

            {result.localization_analysis?.secondary_localizations?.length >
              0 && (
              <div className="rounded-[var(--radius)] border border-border p-4">
                <h4 className="mb-3 font-medium text-foreground">
                  Secondary Localizations
                </h4>
                <div className="space-y-3">
                  {result.localization_analysis.secondary_localizations.map(
                    (loc, idx) => (
                      <div
                        key={idx}
                        className="rounded-[var(--radius)] bg-muted/30 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {loc.site}
                          </span>
                          <ConfidenceBadge confidence={loc.confidence} />
                        </div>
                        {loc.supporting_features?.length > 0 && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {loc.supporting_features.join(", ")}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="etiology" className="mt-4 space-y-4">
            <div className="rounded-[var(--radius)] border border-border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Primary Etiology</h4>
                {primaryEt?.confidence && (
                  <ConfidenceBadge confidence={primaryEt.confidence} />
                )}
              </div>
              <p className="mt-2 text-lg font-semibold text-primary">
                {primaryEt?.category}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h5 className="mb-2 text-sm font-medium text-foreground">
                    Supporting Features
                  </h5>
                  <FeatureList
                    features={primaryEt?.supporting_features || []}
                    type="supporting"
                  />
                </div>
                <div>
                  <h5 className="mb-2 text-sm font-medium text-foreground">
                    Conflicting Features
                  </h5>
                  <FeatureList
                    features={primaryEt?.conflicting_features || []}
                    type="against"
                  />
                </div>
              </div>
            </div>

            {result.etiology_analysis?.secondary_etiologies?.length > 0 && (
              <div className="rounded-[var(--radius)] border border-border p-4">
                <h4 className="mb-3 font-medium text-foreground">
                  Alternative Etiologies
                </h4>
                <div className="space-y-3">
                  {result.etiology_analysis.secondary_etiologies.map(
                    (et, idx) => (
                      <div
                        key={idx}
                        className="rounded-[var(--radius)] bg-muted/30 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {et.category}
                          </span>
                          <ConfidenceBadge confidence={et.confidence} />
                        </div>
                        {et.supporting_features?.length > 0 && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {et.supporting_features.join(", ")}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="differentials" className="mt-4 space-y-3">
            {result.differential_diagnoses?.map((dx, idx) => (
              <div
                key={idx}
                className="rounded-[var(--radius)] border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {dx.likelihood_rank}
                  </span>
                  <h4 className="font-semibold text-foreground">
                    {dx.diagnosis}
                  </h4>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h5 className="mb-2 text-sm font-medium text-foreground">
                      Supporting
                    </h5>
                    <FeatureList
                      features={dx.supporting_features}
                      type="supporting"
                    />
                  </div>
                  <div>
                    <h5 className="mb-2 text-sm font-medium text-foreground">
                      Against
                    </h5>
                    <FeatureList
                      features={dx.against_features}
                      type="against"
                    />
                  </div>
                </div>
                {dx.comments && (
                  <p className="mt-3 text-sm italic text-muted-foreground">
                    {dx.comments}
                  </p>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="next-steps" className="mt-4 space-y-4">
            {result.recommended_next_steps?.urgent_actions?.length > 0 && (
              <div className="rounded-[var(--radius)] border border-destructive/50 bg-destructive/5 p-4">
                <h4 className="flex items-center gap-2 font-medium text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Urgent Actions
                </h4>
                <ul className="mt-2 space-y-1">
                  {result.recommended_next_steps.urgent_actions.map(
                    (action, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="text-destructive">&bull;</span>
                        {action}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius)] border border-border p-4">
                <h4 className="flex items-center gap-2 font-medium text-foreground">
                  <TestTube2 className="h-4 w-4 text-primary" />
                  Recommended Tests
                </h4>
                <ul className="mt-2 space-y-1">
                  {result.recommended_next_steps?.recommended_tests?.map(
                    (test, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground"
                      >
                        &bull; {test}
                      </li>
                    )
                  ) || (
                    <li className="text-sm italic text-muted-foreground">
                      None specified
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-[var(--radius)] border border-border p-4">
                <h4 className="flex items-center gap-2 font-medium text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  Referrals
                </h4>
                <ul className="mt-2 space-y-1">
                  {result.recommended_next_steps?.referrals?.map(
                    (referral, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground"
                      >
                        &bull; {referral}
                      </li>
                    )
                  ) || (
                    <li className="text-sm italic text-muted-foreground">
                      None specified
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {result.recommended_next_steps?.monitoring_suggestions?.length >
              0 && (
              <div className="rounded-[var(--radius)] border border-border p-4">
                <h4 className="font-medium text-foreground">
                  Monitoring Suggestions
                </h4>
                <ul className="mt-2 space-y-1">
                  {result.recommended_next_steps.monitoring_suggestions.map(
                    (suggestion, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground"
                      >
                        &bull; {suggestion}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
