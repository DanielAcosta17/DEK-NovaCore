export const FIRESTORE_RULES_TEMPLATE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }

    match /{document=**} { allow read, write: if false; }

    // Catálogos y Negocios
    match /businesses/{businessId} {
      allow read: if resource.data.isActive == true || isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn();

      match /categories/{categoryId} {
        allow read: if true;
        allow write: if isSignedIn();
      }

      match /products/{productId} {
        allow read: if true;
        allow write: if isSignedIn();
      }

      match /orders/{orderId} {
        allow create: if request.resource.data.totalAmount is number;
        allow read, update, delete: if isSignedIn();
      }
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}`;

export const STORAGE_RULES_TEMPLATE = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() { return request.auth != null; }

    match /businesses/{businessId}/{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn()
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    match /{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn();
    }
  }
}`;
