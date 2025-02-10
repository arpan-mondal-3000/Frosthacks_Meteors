# **Aushadhi Mitra - AI-Powered Prescription Assistant**

### FrostHacks S01 - Team Meteors
### 🔗[Website Link](https://frosthacks-meteors-two.vercel.app/)

🔗[Demo Video](https://youtu.be/70VapcBhH-I?si=aTMZUAw4WnI6SQcO)
🔗[Pitch Video](https://youtu.be/ne8285U46rU?si=H7NAfipGKGZPK0aZ)

## 🚀 Introduction

Patients often struggle to decipher handwritten prescriptions, verify their authenticity, and compare medicine prices across different platforms. As a result, they may end up paying higher prices or even misinterpreting medication details, which can be dangerous.

**Aushadhi Mitra** is an **AI-powered web application** that simplifies prescription management by **accurately scanning prescriptions and comparing medicine prices** across different pharmacies.

---

## 🛠 Problem Statement

Patients face multiple challenges in handling prescriptions:  
✔️ **Unreadable prescriptions** - Risk of misinterpretation of medicine names, dosages, and schedules.  
✔️ **Price Transparency** - No way to compare medicine prices across platforms.

---

## 💡 Our Solution

Aushadhi Mitra uses **OCR, NLP, and AI-powered verification** to:  
✅ **Extract prescription details** with high accuracy.  
✅ **Compare medicine prices** across platforms to help users find the best deals.

---

## 🔬 Technical Approach

- **Prescription Scanning** - Uses **OCR** (Azure Document API) for text extraction.
- **Medicine Recognition** - LLM models (**Deepseek, Gemini**) detect medicine names, dosages, and schedules.
- **Price Aggregation** - Scrapes medicine prices from e-pharmacy platforms.
- **User-Friendly Interface** - Built with **React** for smooth and simple UX.

---

## 💡 Key Innovations

🚀 **AI-driven accuracy** in prescription extraction.  
💰 **Live price comparison** across multiple e-pharmacies.
🤖 **AI chatbot** to guide patients in their medical plans.

---

## 📈 Impact & Future Scope

🌟 **Simplifies healthcare** by making prescription management effortless.  
📢 **Promotes affordability** by enabling price comparison.  
💡 **Fosters trust in technology** for better healthcare accessibility.

---

## 🛠 Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Flask
- **AI & NLP**: Azure Document API, Gemini, Deepseek
- **Database**: Sqlite
- **Scraping**: BeautifulSoup, Selenium

---

## 👨‍💻 Team Meteors

🚀 **Sagnik Chakraborty** - Academy of Technology (2nd Year)  
🚀 **Arpan Mondal** - University of Calcutta (2nd Year)  
🚀 **Subhadip Pratihar** - University of Calcutta (2nd Year)

---

## 📌 Our Mission Statement

> “To revolutionize healthcare accessibility by empowering users with AI-driven solutions to manage prescriptions, ensure authenticity, and discover affordable medicines, while fostering trust and convenience in every step of the journey.”

---

## 🔗 Get Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Sagnik-23/Frosthacks_Meteors
```

### 2️⃣ Go to frontend and install dependencies

```bash
cd frontend
npm i
```

### 3️⃣ Run the frontend

```bash
npm run dev
```

### 4️⃣ Go to backend and install dependencies

```bash
cd backend

python -m venv .venv
.venv\Scripts\activate -> For windows
source .venv/bin/activate -> For Linux and Mac

pip install -r requirements.txt
```

### 5️⃣ Run the backend

```bash
python main.py
```
