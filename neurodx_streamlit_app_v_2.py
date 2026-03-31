import os
import io
import json
import streamlit as st
from google import genai
from google.genai import types

# Optional local document parsers
try:
    from pypdf import PdfReader
except Exception:
    PdfReader = None

try:
    from docx import Document
except Exception:
    Document = None

# -----------------------------
# Page setup
# -----------------------------
st.set_page_config(page_title="NeuroDx Assistant", layout="wide")

# -----------------------------
# Session state
# -----------------------------
if "lang" not in st.session_state:
    st.session_state.lang = "EN"
if "raw_uploaded_text" not in st.session_state:
    st.session_state.raw_uploaded_text = ""
if "result_json" not in st.session_state:
    st.session_state.result_json = None
if "result_text" not in st.session_state:
    st.session_state.result_text = ""
if "show_teaching_mode" not in st.session_state:
    st.session_state.show_teaching_mode = False


def t(cn, en):
    return cn if st.session_state.lang == "CN" else en


# -----------------------------
# Gemini client
# -----------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
if not GEMINI_API_KEY:
    st.error(
        t(
            "未检测到 GEMINI_API_KEY。请先在终端设置环境变量后再运行。",
            "GEMINI_API_KEY was not found. Please set the environment variable before running the app.",
        )
    )
    st.stop()

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"
# -----------------------------
# Prompts
# -----------------------------
SYSTEM_PROMPT = """
You are an expert neurology clinical reasoning assistant.

Your role is NOT to replace a neurologist and NOT to provide a definitive diagnosis.
Your role is to assist with structured neurological reasoning based on the provided case.

You must analyze the case in the following order:
1. Extract key clinical features
2. Infer lesion localization
3. Infer likely etiological category
4. Rank differential diagnoses
5. Suggest next best tests or actions
6. Highlight urgent red flags if present

Important rules:
- Be clinically conservative.
- Do not overstate certainty.
- If the data are insufficient, explicitly say \"insufficient information\".
- Distinguish clearly between observed findings, inferred findings, and speculation.
- Prioritize neurological localization logic.
- Use standard neurology reasoning (pattern recognition + anatomical localization + tempo + system involvement).
- Never claim a confirmed diagnosis unless it is explicitly already confirmed in the input.
- If a dangerous emergency is possible, flag it clearly.
- If the uploaded note and structured fields disagree, mention the conflict.

When analyzing a neurological case, always reason in this order:
A. Determine the temporal pattern.
B. Determine the main syndrome.
C. Determine the most likely anatomical localization.
D. Determine the most likely etiological class.
E. Generate a ranked differential diagnosis.
F. Recommend the next highest-yield test(s).
G. Flag red-flag emergencies.

Do not skip the localization step.
Do not jump directly to disease names without first identifying syndrome and localization.
Return only data that fits the requested JSON schema.
"""

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "case_summary": {
            "type": "object",
            "properties": {
                "one_sentence_summary": {"type": "string"},
                "clinical_tempo": {"type": "string"},
                "main_neurological_domains_involved": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["one_sentence_summary", "clinical_tempo", "main_neurological_domains_involved"],
        },
        "feature_extraction": {
            "type": "object",
            "properties": {
                "onset_pattern": {"type": "string"},
                "time_course": {"type": "string"},
                "symptom_distribution": {"type": "string"},
                "laterality": {"type": "string"},
                "motor_involvement": {"type": "string"},
                "sensory_involvement": {"type": "string"},
                "autonomic_involvement": {"type": "string"},
                "cranial_nerve_involvement": {"type": "string"},
                "cerebellar_features": {"type": "string"},
                "upper_motor_neuron_signs": {"type": "array", "items": {"type": "string"}},
                "lower_motor_neuron_signs": {"type": "array", "items": {"type": "string"}},
                "neuromuscular_junction_features": {"type": "array", "items": {"type": "string"}},
                "muscle_features": {"type": "array", "items": {"type": "string"}},
                "red_flags": {"type": "array", "items": {"type": "string"}},
                "missing_critical_information": {"type": "array", "items": {"type": "string"}},
            },
            "required": [
                "onset_pattern", "time_course", "symptom_distribution", "laterality",
                "motor_involvement", "sensory_involvement", "autonomic_involvement",
                "cranial_nerve_involvement", "cerebellar_features", "upper_motor_neuron_signs",
                "lower_motor_neuron_signs", "neuromuscular_junction_features", "muscle_features",
                "red_flags", "missing_critical_information"
            ],
        },
        "localization_analysis": {
            "type": "object",
            "properties": {
                "primary_localization": {
                    "type": "object",
                    "properties": {
                        "site": {"type": "string"},
                        "confidence": {"type": "number"},
                        "supporting_features": {"type": "array", "items": {"type": "string"}},
                        "conflicting_features": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["site", "confidence", "supporting_features", "conflicting_features"],
                },
                "secondary_localizations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "site": {"type": "string"},
                            "confidence": {"type": "number"},
                            "supporting_features": {"type": "array", "items": {"type": "string"}},
                            "conflicting_features": {"type": "array", "items": {"type": "string"}},
                        },
                        "required": ["site", "confidence", "supporting_features", "conflicting_features"],
                    },
                },
            },
            "required": ["primary_localization", "secondary_localizations"],
        },
        "etiology_analysis": {
            "type": "object",
            "properties": {
                "primary_etiology": {
                    "type": "object",
                    "properties": {
                        "category": {"type": "string"},
                        "confidence": {"type": "number"},
                        "supporting_features": {"type": "array", "items": {"type": "string"}},
                        "conflicting_features": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["category", "confidence", "supporting_features", "conflicting_features"],
                },
                "secondary_etiologies": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "category": {"type": "string"},
                            "confidence": {"type": "number"},
                            "supporting_features": {"type": "array", "items": {"type": "string"}},
                            "conflicting_features": {"type": "array", "items": {"type": "string"}},
                        },
                        "required": ["category", "confidence", "supporting_features", "conflicting_features"],
                    },
                },
            },
            "required": ["primary_etiology", "secondary_etiologies"],
        },
        "differential_diagnoses": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "diagnosis": {"type": "string"},
                    "likelihood_rank": {"type": "integer"},
                    "supporting_features": {"type": "array", "items": {"type": "string"}},
                    "against_features": {"type": "array", "items": {"type": "string"}},
                    "comments": {"type": "string"},
                },
                "required": ["diagnosis", "likelihood_rank", "supporting_features", "against_features", "comments"],
            },
        },
        "recommended_next_steps": {
            "type": "object",
            "properties": {
                "urgent_actions": {"type": "array", "items": {"type": "string"}},
                "recommended_tests": {"type": "array", "items": {"type": "string"}},
                "referrals": {"type": "array", "items": {"type": "string"}},
                "monitoring_suggestions": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["urgent_actions", "recommended_tests", "referrals", "monitoring_suggestions"],
        },
        "safety": {
            "type": "object",
            "properties": {
                "possible_emergency": {"type": "boolean"},
                "reason": {"type": "string"},
            },
            "required": ["possible_emergency", "reason"],
        },
    },
    "required": [
        "case_summary", "feature_extraction", "localization_analysis", "etiology_analysis",
        "differential_diagnoses", "recommended_next_steps", "safety"
    ],
}

# -----------------------------
# Helpers
# -----------------------------
def list_or_none(value):
    if isinstance(value, list) and value:
        return value
    return [t("Not documented / unclear", "Not documented / unclear")]


def confidence_label(conf):
    try:
        conf = float(conf)
    except Exception:
        return t("不明确", "Unclear")
    if conf >= 75:
        return t("高", "High")
    if conf >= 45:
        return t("中等", "Moderate")
    return t("低", "Low")


def safe_get(dct, *keys, default=None):
    cur = dct
    for key in keys:
        if not isinstance(cur, dict):
            return default
        cur = cur.get(key)
        if cur is None:
            return default
    return cur


def extract_text_from_uploaded_file(uploaded_file):
    if uploaded_file is None:
        return ""
    suffix = os.path.splitext(uploaded_file.name)[1].lower()
    file_bytes = uploaded_file.getvalue()
    try:
        if suffix == ".txt":
            return file_bytes.decode("utf-8", errors="ignore")
        if suffix == ".pdf":
            if PdfReader is None:
                return t("Cannot parse PDF: install pypdf (python3 -m pip install pypdf)", "Cannot parse PDF: install pypdf (python3 -m pip install pypdf)")
            reader = PdfReader(io.BytesIO(file_bytes))
            return "\n\n".join((page.extract_text() or "") for page in reader.pages).strip()
        if suffix == ".docx":
            if Document is None:
                return t("Cannot parse DOCX: install python-docx (python3 -m pip install python-docx)", "Cannot parse DOCX: install python-docx (python3 -m pip install python-docx)")
            doc = Document(io.BytesIO(file_bytes))
            return "\n".join(p.text for p in doc.paragraphs).strip()
        return t("Unsupported file type.", "Unsupported file type.")
    except Exception as e:
        return f"{t('文件解析失败：', 'File parsing failed: ')}{e}"


def build_case_text(raw_uploaded_text, chief_complaint, hpi, neuro_exam, other_exam, mri, emg, csf, blood, genetic, other_tests, past_history, family_history):
    return f"""
Case Input

Uploaded document text:
{raw_uploaded_text}

Chief complaint:
{chief_complaint}

History of present illness:
{hpi}

Neurological examination:
{neuro_exam}

Other relevant examination:
{other_exam}

Investigations:
- MRI: {mri}
- EMG/NCS: {emg}
- CSF: {csf}
- Blood tests: {blood}
- Genetic tests: {genetic}
- Other: {other_tests}

Past history:
{past_history}

Family history:
{family_history}

Current task:
Please analyze lesion localization, etiological category, ranked differential diagnoses, next recommended workup, and emergency red flags if any.
"""


def analyze_case(preview_text):
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=preview_text,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.2,
            response_mime_type="application/json",
            response_json_schema=RESPONSE_SCHEMA,
        ),
    )
    return response.text


TEST_CASES = {
    "Spastic paraparesis / possible myelopathy": {
        "chief_complaint": "Progressive weakness in both legs for 3 months.",
        "hpi": "A 54-year-old man developed slowly progressive weakness in both legs over 3 months. He first noticed difficulty climbing stairs, then frequent tripping. Over the last month he also noticed stiffness in both legs. No sensory loss reported. No diplopia. No bowel incontinence, but mild urinary urgency. No fever. No recent infection.",
        "neuro_exam": "Increased tone in both lower limbs. Muscle strength 4/5 in bilateral hip flexion and ankle dorsiflexion. Brisk knee reflexes bilaterally. Bilateral Babinski sign present. Upper limbs normal. No clear fasciculations observed. Sensation to pinprick and vibration largely preserved. Gait spastic.",
        "other_exam": "No skin rash. No joint swelling.",
        "mri": "not yet done",
        "emg": "not yet done",
        "csf": "not yet done",
        "blood": "CK normal",
        "genetic": "none",
        "other_tests": "none",
        "past_history": "Hypertension.",
        "family_history": "No known neurological disease.",
    },
    "NMJ pattern / possible myasthenia gravis": {
        "chief_complaint": "Intermittent diplopia and drooping eyelids for 6 weeks.",
        "hpi": "A 33-year-old woman reports fluctuating ptosis and horizontal diplopia worsening in the evening. Over the last 2 weeks she has noticed chewing fatigue with prolonged meals. No numbness, no limb sensory symptoms, and no bowel or bladder symptoms. Symptoms are worse after exertion and improve after rest.",
        "neuro_exam": "Mild bilateral ptosis, worse after sustained upgaze. Extraocular movements mildly limited after repeated testing. Limb strength is full at rest but mild fatigability appears in shoulder abduction after repetition. Reflexes normal. Sensation intact.",
        "other_exam": "Speech slightly nasal after prolonged counting.",
        "mri": "brain MRI normal",
        "emg": "not yet done",
        "csf": "not done",
        "blood": "TSH normal",
        "genetic": "none",
        "other_tests": "none",
        "past_history": "No major past history.",
        "family_history": "Non-contributory.",
    },
    "Peripheral neuropathy / length-dependent": {
        "chief_complaint": "Numb feet and imbalance for 8 months.",
        "hpi": "A 62-year-old man reports gradually progressive numbness in both feet over 8 months, now extending to mid-calves. He has burning discomfort at night and feels unsteady in the dark. No diplopia, dysphagia, or sphincter symptoms.",
        "neuro_exam": "Reduced pinprick and vibration distally in both legs in a stocking distribution. Ankle reflexes absent bilaterally, knee reflexes reduced. Mild toe extension weakness bilaterally. Romberg positive. Gait wide-based but not spastic.",
        "other_exam": "No skin rash. Distal feet mildly cool.",
        "mri": "lumbar MRI with mild degenerative changes only",
        "emg": "not yet done",
        "csf": "not done",
        "blood": "HbA1c 7.9%, B12 normal",
        "genetic": "none",
        "other_tests": "none",
        "past_history": "Type 2 diabetes.",
        "family_history": "No known hereditary neuropathy.",
    },
    "Anterior horn / possible ALS phenotype": {
        "chief_complaint": "Progressive hand weakness for 9 months.",
        "hpi": "A 58-year-old man developed right hand weakness 9 months ago, followed by left hand weakness and muscle cramps. Over the last 3 months he reports mild slurring of speech. No sensory loss. No diplopia. Weight down 4 kg unintentionally.",
        "neuro_exam": "Marked wasting of intrinsic hand muscles bilaterally, fasciculations in both arms, brisk reflexes in upper and lower limbs, jaw jerk brisk, bilateral extensor plantar responses. Sensation intact. Gait slightly stiff but ambulatory.",
        "other_exam": "No rash, no joint swelling.",
        "mri": "brain and cervical MRI without explanatory structural lesion",
        "emg": "not yet done",
        "csf": "not done",
        "blood": "CK mildly elevated",
        "genetic": "none",
        "other_tests": "none",
        "past_history": "No major past history.",
        "family_history": "Negative for neurological disease.",
    },
    "Acute hemispheric syndrome / stroke red flag": {
        "chief_complaint": "Sudden left arm and face weakness for 2 hours.",
        "hpi": "A 71-year-old woman developed abrupt slurred speech and left face and arm weakness while eating breakfast 2 hours ago. Symptoms reached maximum severity within minutes. No preceding fever or trauma. She has hypertension and atrial fibrillation.",
        "neuro_exam": "Left lower facial weakness, left arm drift, dysarthria, mild left-sided sensory neglect. Reflexes symmetric. Plantars equivocal. Gait not tested.",
        "other_exam": "Blood pressure 182/96.",
        "mri": "not yet done",
        "emg": "not applicable",
        "csf": "not applicable",
        "blood": "glucose normal on fingerstick",
        "genetic": "none",
        "other_tests": "none",
        "past_history": "Atrial fibrillation, hypertension.",
        "family_history": "Non-contributory.",
    },
}

# -----------------------------
# Sidebar
# -----------------------------
with st.sidebar:
    st.title("NeuroDx Assistant")
    st.caption(t("Clinician UI v1", "Clinician UI v1"))
    st.markdown("---")

    lang_choice = st.radio(
        t("语言 / Language", "Language / 语言"),
        options=["English EN", "中文 CN"],
        index=0 if st.session_state.lang == "EN" else 1,
        horizontal=True,
    )
    st.session_state.lang = "EN" if lang_choice == "English EN" else "CN"

    st.toggle(
        t("教学模式", "Teaching mode"),
        key="show_teaching_mode",
        help=t("先隐藏最终答案，适合训练住院医思路。", "Hide final answers first for resident training."),
    )

    st.info(t(f"Model: {MODEL_NAME}", f"Model: {MODEL_NAME}"))

    st.markdown("---")
    st.markdown(t("**Quick start**", "**Quick start**"))
    st.markdown(t(
        "1. 上传病例或粘贴内容\n2. 点击 Analyze Case\n3. 先看 Summary cards，再看 Localization / Differentials",
        "1. Upload a note or paste case details\n2. Click Analyze Case\n3. Start with the summary cards, then review Localization / Differentials"
    ))

    st.markdown("---")
    selected_case = st.selectbox(
        t("测试病例", "Test cases"),
        options=[t("不载入", "Do not load")] + list(TEST_CASES.keys()),
    )
    if st.button(t("载入测试病例", "Load test case"), use_container_width=True):
        if selected_case in TEST_CASES:
            for k, v in TEST_CASES[selected_case].items():
                st.session_state[k] = v
            st.session_state.raw_uploaded_text = ""
            st.session_state.result_json = None
            st.session_state.result_text = ""

    if st.button(t("清空当前病例", "Clear current case"), use_container_width=True):
        keys_to_clear = [
            "raw_uploaded_text", "chief_complaint", "hpi", "neuro_exam", "other_exam", "mri",
            "emg", "csf", "blood", "genetic", "other_tests", "past_history", "family_history"
        ]
        for key in keys_to_clear:
            st.session_state[key] = ""
        st.session_state.result_json = None
        st.session_state.result_text = ""

# -----------------------------
# Header
# -----------------------------
st.title("🧠 NeuroDx Assistant")
st.caption(t(
    "Neurological localization · Etiology · Differential diagnosis · Next-step support",
    "Neurological localization · Etiology · Differential diagnosis · Next-step support"
))

nav1, nav2, nav3, nav4 = st.columns([1.1, 1.1, 1.1, 1.1])
nav1.markdown(f"**{t('Case Analysis', 'Case Analysis')}**")
nav2.markdown(t("Case Library (coming soon)", "Case Library (coming soon)"))
nav3.markdown(t("Teaching Mode", "Teaching Mode") if st.session_state.show_teaching_mode else t("Teaching Mode", "Teaching Mode"))
nav4.markdown(t("Settings (coming soon)", "Settings (coming soon)"))

st.markdown("---")

left, right = st.columns([1.05, 1.15])

# -----------------------------
# Left panel: case intake
# -----------------------------
with left:
    st.subheader(t("Case Intake", "Case Intake"))

    upload_tab, manual_tab = st.tabs([t("Import note", "Import note"), t("Structured entry", "Structured entry")])

    with upload_tab:
        uploaded_file = st.file_uploader(
            t("Upload PDF / DOCX / TXT", "Upload PDF / DOCX / TXT"),
            type=["pdf", "docx", "txt"],
            accept_multiple_files=False,
        )
        if uploaded_file is not None:
            st.session_state.raw_uploaded_text = extract_text_from_uploaded_file(uploaded_file)
            st.success(t("File imported.", "File imported."))

        st.text_area(
            t("Extracted note text", "Extracted note text"),
            key="raw_uploaded_text",
            height=180,
            placeholder=t(
                "PDF / DOCX / TXT 提取的文本会显示在这里，也可以手动粘贴完整病历原文。",
                "Text extracted from PDF / DOCX / TXT will appear here. You can also paste the full note manually.",
            ),
        )

    with manual_tab:
        st.text_input(
            t("Chief Complaint", "Chief Complaint"),
            key="chief_complaint",
            placeholder=t("例如：双下肢无力 3 个月", "e.g. Progressive bilateral leg weakness for 3 months"),
        )
        st.text_area(
            t("History of Present Illness", "History of Present Illness"),
            key="hpi",
            height=160,
        )
        st.text_area(
            t("Neurological Examination", "Neurological Examination"),
            key="neuro_exam",
            height=160,
        )

    with st.expander(t("Additional clinical data", "Additional clinical data"), expanded=True):
        st.text_area(t("Other Examination", "Other Examination"), key="other_exam", height=70)
        c1, c2 = st.columns(2)
        with c1:
            st.text_area("MRI", key="mri", height=70)
            st.text_area("EMG / NCS", key="emg", height=70)
            st.text_area("CSF", key="csf", height=70)
        with c2:
            st.text_area(t("Blood Tests", "Blood Tests"), key="blood", height=70)
            st.text_area(t("Genetic Tests", "Genetic Tests"), key="genetic", height=70)
            st.text_area(t("Other Tests", "Other Tests"), key="other_tests", height=70)
        st.text_area(t("Past Medical History", "Past Medical History"), key="past_history", height=70)
        st.text_area(t("Family History", "Family History"), key="family_history", height=70)

    case_preview = build_case_text(
        st.session_state.raw_uploaded_text,
        st.session_state.get("chief_complaint", ""),
        st.session_state.get("hpi", ""),
        st.session_state.get("neuro_exam", ""),
        st.session_state.get("other_exam", ""),
        st.session_state.get("mri", ""),
        st.session_state.get("emg", ""),
        st.session_state.get("csf", ""),
        st.session_state.get("blood", ""),
        st.session_state.get("genetic", ""),
        st.session_state.get("other_tests", ""),
        st.session_state.get("past_history", ""),
        st.session_state.get("family_history", ""),
    )

    b1, b2 = st.columns([1.2, 1])
    analyze = b1.button(t("Analyze Case", "Analyze Case"), type="primary", use_container_width=True)
    b2.download_button(
        t("Download input", "Download input"),
        data=case_preview.encode("utf-8"),
        file_name="neurodx_case_input.txt",
        mime="text/plain",
        use_container_width=True,
    )

# -----------------------------
# Right panel: clinician dashboard
# -----------------------------
with right:
    st.subheader(t("Clinician Dashboard", "Clinician Dashboard"))
    with st.expander(t("Input trace / source note", "Input trace / source note"), expanded=False):
        st.text_area(t("Preview sent to model", "Preview sent to model"), value=case_preview, height=300, disabled=True)

# -----------------------------
# Run analysis
# -----------------------------
if analyze:
    if not (st.session_state.get("raw_uploaded_text", "").strip() or st.session_state.get("chief_complaint", "").strip() or st.session_state.get("hpi", "").strip() or st.session_state.get("neuro_exam", "").strip()):
        st.warning(t(
            "请至少提供原始病历文本、主诉、现病史或神经系统查体中的一项。",
            "Please provide at least one of: source note text, chief complaint, HPI, or neurological examination.",
        ))
    else:
        try:
            with st.spinner(t("Analyzing neurological case...", "Analyzing neurological case...")):
                result_text = analyze_case(case_preview)
                st.session_state.result_text = result_text
                st.session_state.result_json = json.loads(result_text)
        except Exception as e:
            st.error(f"{t('运行失败：', 'Error: ')}{e}")

# -----------------------------
# Render results
# -----------------------------
if st.session_state.result_json:
    result_json = st.session_state.result_json

    is_emergency = safe_get(result_json, "safety", "possible_emergency", default=False)
    emergency_reason = safe_get(result_json, "safety", "reason", default="")
    primary_loc = safe_get(result_json, "localization_analysis", "primary_localization", default={})
    primary_et = safe_get(result_json, "etiology_analysis", "primary_etiology", default={})

    st.markdown("---")
    st.subheader(t("Clinical Output", "Clinical Output"))

    if is_emergency:
        st.error(f"⚠️ {t('Possible emergency:', 'Possible emergency:')} {emergency_reason}")
    else:
        st.success(t("No clear emergency flag identified.", "No clear emergency flag identified."))

    c1, c2, c3, c4 = st.columns(4)
    c1.metric(t("Clinical tempo", "Clinical tempo"), safe_get(result_json, "case_summary", "clinical_tempo", default="Unknown"))
    c2.metric(t("Primary localization", "Primary localization"), primary_loc.get("site", "Unknown"))
    c3.metric(t("Primary etiology", "Primary etiology"), primary_et.get("category", "Unknown"))
    c4.metric(t("Emergency flag", "Emergency flag"), t("Yes", "Yes") if is_emergency else t("No", "No"))

    if st.session_state.show_teaching_mode:
        with st.expander(t("Teaching mode hint 1: syndrome & tempo", "Teaching mode hint 1: syndrome & tempo"), expanded=True):
            st.write(safe_get(result_json, "case_summary", "clinical_tempo", default=""))
            st.write(list_or_none(safe_get(result_json, "case_summary", "main_neurological_domains_involved", default=[])))
        with st.expander(t("Teaching mode hint 2: key extracted signs", "Teaching mode hint 2: key extracted signs"), expanded=False):
            feats = safe_get(result_json, "feature_extraction", default={})
            st.write({
                "UMN": feats.get("upper_motor_neuron_signs", []),
                "LMN": feats.get("lower_motor_neuron_signs", []),
                "NMJ": feats.get("neuromuscular_junction_features", []),
                "Muscle": feats.get("muscle_features", []),
                "Red flags": feats.get("red_flags", []),
            })
        show_final = st.checkbox(t("显示完整答案", "Show full answer"), value=False)
        if not show_final:
            st.info(t("Teaching mode is hiding the full interpretation. Expand hints and think through localization first.", "Teaching mode is hiding the full interpretation. Expand hints and think through localization first."))
        else:
            st.session_state.show_teaching_mode = False
            st.rerun()

    if not st.session_state.show_teaching_mode:
        tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
            t("Summary", "Summary"),
            t("Localization", "Localization"),
            t("Etiology", "Etiology"),
            t("Differentials", "Differentials"),
            t("Next steps", "Next steps"),
            t("Data trace", "Data trace"),
        ])

        with tab1:
            with st.container(border=True):
                st.markdown(f"**{t('One-line case summary', 'One-line case summary')}**")
                st.write(safe_get(result_json, "case_summary", "one_sentence_summary", default=""))
            col_a, col_b = st.columns(2)
            with col_a:
                st.markdown(f"**{t('Neurological domains involved', 'Neurological domains involved')}**")
                st.write(list_or_none(safe_get(result_json, "case_summary", "main_neurological_domains_involved", default=[])))
            with col_b:
                feats = safe_get(result_json, "feature_extraction", default={})
                st.markdown(f"**{t('Missing critical information', 'Missing critical information')}**")
                st.write(list_or_none(feats.get("missing_critical_information", [])))
            st.markdown(f"**{t('Red flags', 'Red flags')}**")
            st.write(list_or_none(safe_get(result_json, "feature_extraction", "red_flags", default=[])))

        with tab2:
            sec_locs = safe_get(result_json, "localization_analysis", "secondary_localizations", default=[])
            left_loc, right_loc = st.columns([1, 1])
            with left_loc:
                with st.container(border=True):
                    st.markdown(f"**{t('Primary localization', 'Primary localization')}**")
                    st.write(primary_loc.get("site", ""))
                    st.caption(f"{t('Confidence', 'Confidence')}: {confidence_label(primary_loc.get('confidence', 0))} ({primary_loc.get('confidence', 0)})")
                    st.markdown(f"**{t('Supporting features', 'Supporting features')}**")
                    st.write(list_or_none(primary_loc.get("supporting_features", [])))
                    st.markdown(f"**{t('Conflicting features', 'Conflicting features')}**")
                    st.write(list_or_none(primary_loc.get("conflicting_features", [])))
            with right_loc:
                with st.container(border=True):
                    st.markdown(f"**{t('Secondary localizations', 'Secondary localizations')}**")
                    if sec_locs:
                        for idx, loc in enumerate(sec_locs, 1):
                            st.markdown(f"**{idx}. {loc.get('site', '')}**")
                            st.caption(f"{t('Confidence', 'Confidence')}: {confidence_label(loc.get('confidence', 0))} ({loc.get('confidence', 0)})")
                            st.write(list_or_none(loc.get("supporting_features", [])))
                    else:
                        st.write(t("None listed.", "None listed."))

        with tab3:
            sec_ets = safe_get(result_json, "etiology_analysis", "secondary_etiologies", default=[])
            left_et, right_et = st.columns([1, 1])
            with left_et:
                with st.container(border=True):
                    st.markdown(f"**{t('Primary etiology', 'Primary etiology')}**")
                    st.write(primary_et.get("category", ""))
                    st.caption(f"{t('Confidence', 'Confidence')}: {confidence_label(primary_et.get('confidence', 0))} ({primary_et.get('confidence', 0)})")
                    st.markdown(f"**{t('Supporting features', 'Supporting features')}**")
                    st.write(list_or_none(primary_et.get("supporting_features", [])))
                    st.markdown(f"**{t('Conflicting features', 'Conflicting features')}**")
                    st.write(list_or_none(primary_et.get("conflicting_features", [])))
            with right_et:
                with st.container(border=True):
                    st.markdown(f"**{t('Alternative etiologies', 'Alternative etiologies')}**")
                    if sec_ets:
                        for idx, et in enumerate(sec_ets, 1):
                            st.markdown(f"**{idx}. {et.get('category', '')}**")
                            st.caption(f"{t('Confidence', 'Confidence')}: {confidence_label(et.get('confidence', 0))} ({et.get('confidence', 0)})")
                            st.write(list_or_none(et.get("supporting_features", [])))
                    else:
                        st.write(t("None listed.", "None listed."))

        with tab4:
            diffs = safe_get(result_json, "differential_diagnoses", default=[])
            if diffs:
                for item in diffs:
                    with st.container(border=True):
                        st.markdown(f"**#{item.get('likelihood_rank', '?')} {item.get('diagnosis', '')}**")
                        d1, d2 = st.columns(2)
                        d1.markdown(f"**{t('Supporting', 'Supporting')}**")
                        d1.write(list_or_none(item.get("supporting_features", [])))
                        d2.markdown(f"**{t('Against', 'Against')}**")
                        d2.write(list_or_none(item.get("against_features", [])))
                        st.markdown(f"**{t('Clinical comment', 'Clinical comment')}**")
                        st.write(item.get("comments", ""))
            else:
                st.write(t("No differential diagnoses returned.", "No differential diagnoses returned."))

        with tab5:
            next_steps = safe_get(result_json, "recommended_next_steps", default={})
            n1, n2 = st.columns(2)
            with n1:
                with st.container(border=True):
                    st.markdown(f"**{t('Urgent actions', 'Urgent actions')}**")
                    st.write(list_or_none(next_steps.get("urgent_actions", [])))
                with st.container(border=True):
                    st.markdown(f"**{t('Recommended tests', 'Recommended tests')}**")
                    st.write(list_or_none(next_steps.get("recommended_tests", [])))
            with n2:
                with st.container(border=True):
                    st.markdown(f"**{t('Referrals', 'Referrals')}**")
                    st.write(list_or_none(next_steps.get("referrals", [])))
                with st.container(border=True):
                    st.markdown(f"**{t('Monitoring suggestions', 'Monitoring suggestions')}**")
                    st.write(list_or_none(next_steps.get("monitoring_suggestions", [])))

        with tab6:
            feats = safe_get(result_json, "feature_extraction", default={})
            cta, ctb = st.columns(2)
            with cta:
                with st.container(border=True):
                    st.markdown(f"**{t('Extracted features', 'Extracted features')}**")
                    st.write({
                        "onset_pattern": feats.get("onset_pattern", ""),
                        "time_course": feats.get("time_course", ""),
                        "symptom_distribution": feats.get("symptom_distribution", ""),
                        "laterality": feats.get("laterality", ""),
                        "motor_involvement": feats.get("motor_involvement", ""),
                        "sensory_involvement": feats.get("sensory_involvement", ""),
                        "autonomic_involvement": feats.get("autonomic_involvement", ""),
                        "cranial_nerve_involvement": feats.get("cranial_nerve_involvement", ""),
                        "cerebellar_features": feats.get("cerebellar_features", ""),
                    })
            with ctb:
                with st.container(border=True):
                    st.markdown(f"**{t('Signal extraction', 'Signal extraction')}**")
                    st.write({
                        "UMN": feats.get("upper_motor_neuron_signs", []),
                        "LMN": feats.get("lower_motor_neuron_signs", []),
                        "NMJ": feats.get("neuromuscular_junction_features", []),
                        "Muscle": feats.get("muscle_features", []),
                        "Red flags": feats.get("red_flags", []),
                    })
            with st.expander(t("Raw JSON output", "Raw JSON output"), expanded=False):
                st.code(json.dumps(result_json, ensure_ascii=False, indent=2), language="json")

# -----------------------------
# Footer
# -----------------------------
st.markdown("---")
st.caption(t(
    "For clinical reasoning support only. Not a definitive diagnosis. Do not use as the sole basis for urgent medical decisions.",
    "For clinical reasoning support only. Not a definitive diagnosis. Do not use as the sole basis for urgent medical decisions."
))
