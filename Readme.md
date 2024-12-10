## **Form Builder - Backend**  
**Peerlist Frontend Developer Assignment**

**Task:** Create a Next.js app for a dynamic, feature-rich form builder with a robust backend powered by Express and Redis caching.


### **Technologies Used:**

- **Next.js (Frontend):** A powerful React framework for building server-rendered and statically generated web applications.  
- **MongoDB (Database):** A NoSQL database for storing and managing data in a scalable, flexible, and efficient way, especially well-suited for JSON-like document storage.  
- **Redis & NodeCache (Caching):**  
  - **Redis:** A fast, open-source, in-memory data store used to cache frequently accessed data for improved performance and scalability.  
  - **NodeCache:** A lightweight in-memory caching solution to store data temporarily on the backend, reducing the need for frequent database queries.  
- **Express (Backend):** A minimalist web framework for Node.js to handle HTTP requests, routing, and serve the form data effectively.  





# API Documentation

## Create a New Session
GET /api/make/session
- Description: Creates a new session.
- Handler: makeSession

## Submit Form
POST /api/form/submit/:id
- Parameters:
  - id (string, required): The ID of the form to submit.
- Middleware: publicAccess
- Handler: submitForm

## Get Form Information
GET /api/form/info/:id
- Parameters:
  - id (string, required): The ID of the form to retrieve.
- Handler: getFromData

## Check Token
GET /api/check
- Description: Verifies the validity of the user's token.
- Middleware: middleware
- Handler: checkToken

## Preview Form
GET /api/form/preview
- Description: Previews a form before submission.
- Middleware: middleware
- Handler: previewForm

## Publish Form
GET /api/form/publish
- Description: Publishes a form.
- Middleware: middleware
- Handler: publishForm

## Save Form
PATCH /api/form/save
- Description: Saves changes to a form.
- Middleware: middleware
- Handler: saveForm


<p align="left">
  <img src="https://visitor-badge.laobi.icu/badge?page_id=babyo77.form-builder-backend" alt="Visitors">
</p>
