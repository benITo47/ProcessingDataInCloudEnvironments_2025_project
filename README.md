# 🍳 Fridge Helper

**Fridge Helper** is a full-stack web application designed to help you find recipes based on the ingredients you already have at home. It leverages the power of a **Graph Database (Neo4j)** to efficiently map relationships between ingredients and recipes.

🚀 **Live Demo:** [https://fridgehelper.benito.dev](https://fridgehelper.benito.dev)

## ✨ Features
- **Smart Search:** Find recipes by selecting available ingredients.
- **Graph Power:** Utilizes Neo4j to manage complex food relationships.
- **Contribute:** Add your own recipes and custom ingredients.
- **Modern Stack:** React (SPA) + Node.js + Neo4j AuraDB.

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, CSS Modules
- **Backend:** Node.js, Express
- **Database:** Neo4j AuraDB (Cloud Graph DB)
- **Deployment:** Docker & Docker Compose

## 🏃‍♂️ How to Run Locally

The easiest way to run the project is via **Docker**.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/benITo47/ProcessingDataInCloudEnvironments_2025_project
   cd ProcessingDataInCloudEnvironments_2025_project
   ```
2. **Configure Backend:**
   Create a `.env` file in the `backend/` folder:
   ```env
   NEO4J_URI=neo4j+s://<your-instance>.auradb.ondb.io
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=<your-password>
   ADMIN_PASSWORD=secret
   ```


3. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ``` 


