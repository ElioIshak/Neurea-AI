# Neurea-AI 🧠

**An AI-assisted medical analysis platform connecting brain MRI segmentation, patient records, and scientific literature to support evidence-informed clinical investigation.**

Neurea-AI is designed to help doctors explore brain tumor cases by combining medical imaging analysis with relevant scientific evidence and interactive AI-assisted reasoning.

The platform builds on **Neurea**, which analyzes brain MRI scans and generates tumor segmentation masks. Neurea-AI uses these segmentation results alongside the patient's record to retrieve relevant research papers from a scientific literature database and the web, synthesize the available evidence, and provide an interactive interface for further investigation.

Rather than treating AI-generated results as a final answer, the system is designed to support an iterative workflow in which doctors can review findings, ask follow-up questions, clarify uncertainties, and progressively narrow their investigation.

> **Project status:** Under active development.

## 🎯 Core Capabilities

### MRI Analysis & Tumor Segmentation

Powered by Neurea, the imaging component analyzes brain MRI scans and produces segmentation masks identifying tumor regions.

These outputs provide structured imaging information that can be used as an input to subsequent analysis.

### Patient Context Integration

Neurea-AI combines segmentation results with relevant information from the patient's record to establish context for literature retrieval and AI-assisted analysis.

This allows the system to consider the available case information rather than relying on MRI findings in isolation.

### Scientific Literature Retrieval

The system searches for relevant scientific publications using two sources:

- **Scientific literature database:** Retrieves relevant papers from the platform's indexed research collection.
- **Web search:** Identifies additional relevant publications and research sources from the wider web.

Retrieval is guided by the available segmentation results and patient context, with the goal of finding research relevant to the case under investigation.

### AI-Assisted Findings & Summarization

Neurea-AI uses the retrieved literature and available patient information to generate a structured summary of relevant findings.

The intended output helps doctors explore potential interpretations, review supporting evidence, and identify questions that may warrant further investigation. Findings should be traceable to their supporting sources wherever possible.

### Interactive AI Assistant

Analysis does not end with the initial summary.

Doctors can continue interacting with the AI assistant to:

- Ask follow-up questions about the generated findings.
- Clarify medical or scientific concepts.
- Explore relevant papers in greater detail.
- Narrow the investigation based on additional questions or context.
- Compare evidence and examine uncertainties.
- Refine their understanding of the case through an iterative conversation.

The goal is to provide a context-aware research assistant that supports continued exploration of the case.

## 🔄 System Workflow

1. **MRI input:** A brain MRI scan is analyzed by Neurea.
2. **Segmentation:** The imaging component generates a tumor segmentation mask.
3. **Context assembly:** The segmentation results are combined with relevant patient-record information.
4. **Literature retrieval:** The system searches its research database and the web for relevant scientific papers.
5. **Evidence synthesis:** The AI assistant uses the available case context and retrieved sources to generate a summary of relevant findings.
6. **Interactive exploration:** The doctor asks follow-up questions, investigates specific findings, and progressively narrows the scope of the analysis.

## 🏗️ Architecture

Neurea-AI is being developed with a modular architecture that separates application data, literature retrieval, and AI-driven interactions while integrating with Neurea for MRI analysis.

The system is organized around the following logical components:

- **Neurea Integration:** Connects the platform to the MRI analysis and tumor segmentation functionality.
- **Backend API:** Exposes application functionality through API endpoints and coordinates requests between system components.
- **Patient & Case Management:** Organizes patient records, MRI studies, segmentation outputs, and associated analysis.
- **Literature Retrieval:** Retrieves relevant scientific papers from the internal research database and external web sources.
- **AI Orchestration:** Coordinates retrieval, contextual analysis, response generation, and follow-up interactions.
- **Data Layer:** Stores structured application data and relevant analysis metadata.

This modular approach allows individual components and AI workflows to evolve as the system develops.

## 🛠️ Technology Stack

The project uses the following technologies for its backend and AI orchestration.

| Component | Technologies |
|---|---|
| Programming Language | Python |
| Backend API | FastAPI |
| Database | PostgreSQL |
| LLM Application Framework | LangChain |
| AI Workflow Orchestration | LangGraph |

Additional technologies for document processing, scientific literature indexing, vector search, web retrieval, and deployment will be documented as their implementation is established.

## ⚕️ Medical Disclaimer

Neurea-AI is intended to support medical research and clinical investigation, not to replace a qualified healthcare professional. AI-generated summaries and interpretations may be incomplete or incorrect and require independent review. The system is not intended to provide autonomous diagnoses or determine treatment without appropriate professional oversight.

## 📄 License & Copyright

**Neurea-AI is proprietary software. All rights reserved.**

Copyright © 2026 Elio Ishak.

No permission is granted to copy, modify, distribute, publish, sublicense, sell, or otherwise use this project or its original materials without prior express written permission from the copyright holder.

Public access to this repository does not grant any rights to reuse its contents. Third-party components and dependencies remain subject to their respective licenses.

See the [LICENSE](LICENSE) file for the full terms.

---

**Neurea-AI — Connecting medical imaging, patient context, and scientific evidence.**