# Research notes

Every fact and number used on the page, with its source and the date it was checked.
All checks were made on **2 October 2026** (around 21:20 to 21:30 UTC).

Abbreviations: "report" = arXiv 2603.15953v1, "A Family of LLMs Liberated from Static Vocabularies" (Aleph Alpha Research, submitted 16 March 2026).

## 1. The March 2026 report

| # | Fact used on the page | Source | Checked |
|---|---|---|---|
| R1 | Title "A Family of LLMs Liberated from Static Vocabularies", arXiv 2603.15953, v1 submitted 16 March 2026, by Aleph Alpha Research | https://arxiv.org/abs/2603.15953 | 2 Oct 2026 |
| R2 | Family of models with up to 70 billion parameters based on the HAT architecture | Report, abstract | 2 Oct 2026 |
| R3 | HAT = encoder that turns bytes into word embeddings, a backbone transformer working at word level, and a decoder that turns outputs back into bytes | Report, abstract and section 2 | 2 Oct 2026 |
| R4 | Three models: Llama-TFree-HAT-Pretrained (7B, trained from scratch), Llama-3.1-8B-TFree-HAT and Llama-3.1-70B-TFree-HAT (converted from Llama 3.1) | Report, abstract | 2 Oct 2026 |
| R5 | 7B model trained on "nearly 4 trillion words"; Llama 3.1 trained on 15T tokens, "approximately 12T words" | Report, section 2 | 2 Oct 2026 |
| R6 | Tokenizer-free models "can be competitive with tokenized equivalents (including when trained on one-third of the total pre-training data budget of Llama-3.1 models)" | Report, section 1, contribution 1 | 2 Oct 2026 |
| R7 | Converted 8B model has 7,192,495,104 parameters vs 8,030,261,248 for Llama 3.1 8B; report says "more than 10%" fewer | Report, section 1 (contribution 2) and section 3.1 | 2 Oct 2026 |
| R8 | Example: "car" might get token ID 7063 and "cars" 51808, so their embeddings are unrelated before training; HAT computes embeddings from raw bytes so overlap in letters can help | Report, section 3.3 | 2 Oct 2026 |
| R9 | Pre-trained models, German ARC Challenge (25-shot): T-Free 7B 0.591, Llama 3.1 8B 0.474 (shown on the page as 59.1% and 47.4%) | Report, Table 7 | 2 Oct 2026 |
| R10 | Compression (bytes per backbone sequence position) on German MMMLU: T-Free 7B 6.03, Llama 3.1 8B 3.33 | Report, Table 7 | 2 Oct 2026 |
| R11 | Compression is defined as bytes per sequence position in the backbone; higher is better | Report, section 7.2 | 2 Oct 2026 |
| R12 | MT-Bench win rates of Llama-3.1-8B-TFree-HAT-DPO vs Llama-3.1-8B-Instruct: 71.0% (English), 73.9% (German) | Report, Table 23 | 2 Oct 2026 |
| R13 | Pre- and post-trained in English and German; pre-training mix 70% English, 7% German, 5% maths, 18% code | Report, section 1 and Table 3 | 2 Oct 2026 |
| R14 | Abstract: HAT "enhances robustness to intra-word variations, e.g., spelling differences" | Report, abstract | 2 Oct 2026 |
| R15 | Claimed advantages: robustness to prompt perturbations and adaptability to new domains and languages through continued training. Conclusion: these "require further validation in a broader range of tasks and settings" | Report, sections 1 and 10 | 2 Oct 2026 |
| R16 | Limitation: models not optimised for code generation or mathematical reasoning and not extensively evaluated on them | Report, sections 1 and 7.2 | 2 Oct 2026 |
| R17 | Limitation: current vLLM implementation has lower throughput than a FLOP-matched tokenizer-based transformer in batched serving; production latency and throughput are outside the report's scope | Report, sections 6 and 7.2 | 2 Oct 2026 |
| R18 | 70B model is an "experimental release"; results on some academic benchmarks are below Llama-3.3-70B-Instruct | Report, section 7.3 | 2 Oct 2026 |
| R19 | 200 intermediate pre-training checkpoints released; the authors "have not analyzed these ourselves yet"; Pythia offered 154 checkpoints per model and those proved useful to the research community | Report, section 8 | 2 Oct 2026 |
| R20 | Six released model repositories (7B base, 8B base, 8B SFT, 70B SFT, 7B DPO, 8B DPO), eval-framework and vLLM contributions under Apache 2.0 | Report, section 1, contributions 4 and 5 | 2 Oct 2026 |
| R21 | Benchmarks used include MMLU, ARC, HellaSwag, German ARC, MMMLU, MT-Bench | Report, Tables 4 and 9 | 2 Oct 2026 |
| R22 | Diagram: "Bundeskanzler" has 13 letters, all plain ASCII, so it is 13 bytes in UTF-8. The word splitter treats it as one word, so the backbone takes one step for it; the usual model takes one step per token, so four steps for the four pieces in B2 | Derived from B2 and report section 3.2 (word splitter, UAX #29) | 2 Oct 2026 |

## 2. Aleph Alpha blog posts and model cards

| # | Fact used on the page | Source | Checked |
|---|---|---|---|
| B1 | Blog post "Breaking Free of Tokenizers: Why We Built T-Free and What It Means for Sovereign AI", dated 20/08/2025 | https://aleph-alpha.com/en/blog/breaking-free-of-tokenizers/ | 2 Oct 2026 |
| B2 | Example: a typical tokenizer splits "Bundeskanzler" into four tokens while "chancellor" needs one | Same post (B1) | 2 Oct 2026 |
| B3 | Company language (contracts, technical specs, internal jargon) differs from web text; T-Free keeps rare or domain-specific terms intact | Same post (B1) | 2 Oct 2026 |
| B4 | Blog post "Introducing TFree-HAT 7B: Tokenizer-Free Models Achieving Top-Tier Multilingual Performance", dated 20/08/2025 | https://aleph-alpha.com/en/blog/introducing-tfree-hat-7b-tokenizer-free-models-achieving-top-tier-multilingual-performance/ | 2 Oct 2026 |
| B5 | Earlier blog post "T-Free: Hierarchical Autoregressive Transformers for Language Fairness and Sovereignty" (dated 22 January 2025) on the earlier HAT paper (arXiv 2501.10322). Not about the March 2026 report | https://aleph-alpha.com/en/blog/t-free-hierarchical-autoregressive-transformers-for-language-fairness-and-sovereignty/ | 2 Oct 2026 |
| B6 | Model cards: license "Open Aleph License", described as "explicitly allowing for non-commercial research and educational use" | https://huggingface.co/Aleph-Alpha/tfree-hat-pretrained-7b-base | 2 Oct 2026 |
| B7 | License text excerpt: rights granted "for any Non-Commercial and Non-Administrative purpose" | https://huggingface.co/Aleph-Alpha/tfree-hat-pretrained-7b-base/blob/main/LICENSE | 2 Oct 2026 |
| B8 | 200 intermediate checkpoints are stored as branches of the 7B base model (API shows 200 branches including main) | Model card (B6); https://huggingface.co/api/models/Aleph-Alpha/tfree-hat-pretrained-7b-base/refs | 2 Oct 2026 |
| B9 | Model cards not gated (free download without request) | https://huggingface.co/api/models/Aleph-Alpha/tfree-hat-pretrained-7b-base (field "gated": false) | 2 Oct 2026 |

## 3. Reach numbers (public)

Hugging Face download counts come from the public API. The `downloads` field is the last 30 days (the figure shown on model pages); `downloadsAllTime` is the all-time count.

| # | Item | Followers / downloads (30 days) / downloads (all time) / likes | Source | Checked |
|---|---|---|---|---|
| N1 | Hugging Face organisation Aleph-Alpha | 405 followers; 29 models; 3 datasets | https://huggingface.co/api/organizations/Aleph-Alpha/overview and https://huggingface.co/Aleph-Alpha | 2 Oct 2026 |
| N2 | tfree-hat-pretrained-7b-base | 389 / 4,774 / 17 likes | https://huggingface.co/api/models/Aleph-Alpha/tfree-hat-pretrained-7b-base | 2 Oct 2026 |
| N3 | llama-tfree-hat-pretrained-7b-dpo | 203 / 1,977 / 10 likes | https://huggingface.co/api/models/Aleph-Alpha/llama-tfree-hat-pretrained-7b-dpo | 2 Oct 2026 |
| N4 | llama-3_1-8b-tfree-hat-base | 262 / 1,258 / 21 likes | https://huggingface.co/api/models/Aleph-Alpha/llama-3_1-8b-tfree-hat-base | 2 Oct 2026 |
| N5 | llama-3_1-8b-tfree-hat-sft | 254 / 1,264 / 12 likes | https://huggingface.co/api/models/Aleph-Alpha/llama-3_1-8b-tfree-hat-sft | 2 Oct 2026 |
| N6 | llama-3_1-8b-tfree-hat-dpo | 275 / 1,886 / 16 likes | https://huggingface.co/api/models/Aleph-Alpha/llama-3_1-8b-tfree-hat-dpo | 2 Oct 2026 |
| N7 | llama-3_1-70b-tfree-hat-sft | 217 / 1,465 / 3 likes | https://huggingface.co/api/models/Aleph-Alpha/llama-3_1-70b-tfree-hat-sft | 2 Oct 2026 |
| N8 | Dataset Aleph-Alpha-GermanWeb | 898 / 15,601 / 24 likes | https://huggingface.co/api/datasets/Aleph-Alpha/Aleph-Alpha-GermanWeb | 2 Oct 2026 |
| N9 | Dataset MTBench-German | 44 / 773 / 0 likes | https://huggingface.co/api/datasets/Aleph-Alpha/MTBench-German | 2 Oct 2026 |
| N10 | GitHub organisation Aleph-Alpha-Research | 42 followers; 14 public repositories | https://api.github.com/orgs/Aleph-Alpha-Research and https://github.com/Aleph-Alpha-Research | 2 Oct 2026 |
| N11 | Repository stars: magma 490, scaling 66, trigrams 60, eval-framework 41, AtMan 33, hat-splitter 5 | https://api.github.com/orgs/Aleph-Alpha-Research/repos | 2 Oct 2026 |

## 4. Aleph Alpha tools used in the ideas section

| # | Fact | Source | Checked |
|---|---|---|---|
| T1 | eval-framework: "over 90 tasks"; includes perturbation testing for robustness analysis; Apache-2.0 license | https://github.com/Aleph-Alpha-Research/eval-framework | 2 Oct 2026 |
| T2 | MTBench-German: German version of MT-Bench with patches on VAGOsolutions/MT-Bench-TrueGerman | https://huggingface.co/datasets/Aleph-Alpha/MTBench-German | 2 Oct 2026 |
| T3 | Aleph-Alpha-GermanWeb: German-language dataset combining filtered Common Crawl, FineWeb2 and synthetic data; accompanying paper arXiv 2505.00022 (EACL 2026) | https://huggingface.co/datasets/Aleph-Alpha/Aleph-Alpha-GermanWeb | 2 Oct 2026 |

## 5. Other labs (examples only)

| # | Fact | Source | Checked |
|---|---|---|---|
| L1 | Cohere Labs Open Science Community: researchers apply to join; virtual events; subgroups including multilingual AI and safety | https://cohere.com/research/open-science | 2 Oct 2026 |
| L2 | Cohere Labs Scholars Program: "remote-first, full-time paid position" that matches emerging researchers with mentors | https://cohere.com/research/scholars-program | 2 Oct 2026 |
| L3 | EleutherAI: non-profit AI research lab that "operates primarily through our public Discord server"; Discord does not strongly separate employees, volunteers and outside collaborators | https://www.eleuther.ai/about | 2 Oct 2026 |
| L4 | Ai2 describes Olmo as "fully open"; Olmo page showcases projects, including studies of learning dynamics enabled by datasets, logs and checkpoints | https://allenai.org/olmo | 2 Oct 2026 |

## 6. Job ad (context only, not quoted on the page beyond the role title)

| # | Fact | Source | Checked |
|---|---|---|---|
| J1 | Role title "Intern/WS to Chief of Staff (f/m/d)", team CEO Office, Heidelberg, hybrid, published 23 Sep 2026; Heidelberg or Berlin office; tasks include community-growth efforts, project management framework, model release pipeline, blog posts and conference talks | https://jobs.ashbyhq.com/AlephAlpha/1722b11a-b67f-4869-aa89-b141dc68fabb | 2 Oct 2026 |

## 7. Things I checked and left out

- **Research partnerships.** https://aleph-alpha.com/research/ now redirects to the homepage section https://aleph-alpha.com/en/#research, which lists no partnerships, community section or tools. I could not verify any list of research partnerships, so the page does not mention them.
- **Cohere Labs community size.** https://cohere.com/research says "4500 members from 150 countries", while https://cohere.com/research/open-science says "5,000+ researchers" from "100+ countries". Because the two pages disagree, the page gives no member numbers.
- **"Newest blog post is from November 2025".** Not true on 2 Oct 2026. The blog lists research posts dated 8, 10, 24, 28 and 30 September 2026. The page makes no claim about blog frequency.
- **"No plain-language write-up exists".** Aleph Alpha published a business-facing explainer on 20 August 2025 (B1). I found no blog post about the March 2026 report itself. The page presents its explainer as building on the August 2025 posts and makes no claim that nothing exists.
- **GitHub followers.** An earlier note said 37 followers; the live figure on 2 Oct 2026 is 42.
- **Typo robustness numbers.** The January 2025 blog post (B5) reports typo robustness for the earlier HAT model, but the March 2026 report gives no typo test numbers. The page only repeats the report's own claim and its call for further validation.
- **LinkedIn profile link.** LinkedIn blocks automated checks (HTTP 999). The link https://www.linkedin.com/in/ved-gawade/ should be clicked once by hand.
