import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Stethoscope,
  FileSearch,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 to-background pb-20 pt-16 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-4 w-4" />
                AI-Powered Clinical Decision Support
              </div>

              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Neurological Diagnosis Made{" "}
                <span className="text-primary">Smarter</span>
              </h1>

              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                NeuroDx assists clinicians with structured neurological
                reasoning - from lesion localization to differential diagnosis.
                Built for neurologists, by neurologists.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Launch Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Structured Clinical Reasoning
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Follow evidence-based neurological reasoning methodology for
                every case
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-accent">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Lesion Localization</CardTitle>
                  <CardDescription>
                    Anatomical localization based on clinical features and
                    examination findings
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-accent">
                    <FileSearch className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Etiology Analysis</CardTitle>
                  <CardDescription>
                    Systematic categorization of potential disease mechanisms
                    and causes
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-accent">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Differential Diagnosis</CardTitle>
                  <CardDescription>
                    Ranked differential diagnoses with supporting and
                    conflicting features
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-accent">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Red Flag Detection</CardTitle>
                  <CardDescription>
                    Automatic identification of urgent findings requiring
                    immediate action
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Three simple steps to structured neurological reasoning
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  Input Case Data
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Enter patient demographics, chief complaint, history of
                  present illness, and examination findings through our
                  structured form.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  AI Analysis
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Our AI processes the case using structured neurological
                  reasoning methodology, following clinical pattern recognition
                  and anatomical localization.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  Review Results
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Get comprehensive output including localization, etiology,
                  ranked differentials, recommended tests, and emergency flags.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="about" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Built for Clinical Excellence
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  NeuroDx is designed to augment clinical reasoning, not replace
                  it. Our tool helps structure thinking and ensures no critical
                  steps are missed.
                </p>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Evidence-based methodology
                      </strong>{" "}
                      - Follows standard neurology reasoning patterns
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Teaching mode available
                      </strong>{" "}
                      - Perfect for resident training and education
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Transparent reasoning
                      </strong>{" "}
                      - See supporting and conflicting features for each
                      conclusion
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">
                        Conservative approach
                      </strong>{" "}
                      - Highlights uncertainty and missing information
                    </span>
                  </li>
                </ul>
              </div>

              <Card className="border-border bg-gradient-to-br from-accent to-background p-8">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">
                      Clinical Disclaimer
                    </h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    NeuroDx is a clinical decision-support tool designed to
                    assist healthcare professionals. It is not intended to
                    replace professional medical judgment or provide definitive
                    diagnoses.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Always verify AI-generated suggestions with clinical
                    expertise and established guidelines. Do not use as the sole
                    basis for urgent medical decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to enhance your clinical reasoning?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Start using NeuroDx today - no account required
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-background text-foreground hover:bg-background/90"
                >
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
