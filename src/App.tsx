import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './page/landing_page/Login';
import Register from './page/landing_page/Register';
import { AuthProvider, FirebaseAppProvider, FirestoreProvider, StorageProvider, useFirebaseApp } from 'reactfire';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import Landing_page from './page/landing_page/LandingPage';
import ContentPage from './page/content_page/ContentPage';
function App() {

  return (
    <FirestoreProvider sdk={getFirestore(useFirebaseApp())}>
      <AuthProvider sdk={getAuth(useFirebaseApp())}>
        <StorageProvider sdk={getStorage(useFirebaseApp())}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing_page />}></Route>
              <Route path="/landingPage/login" element={<Login />}></Route>
              <Route path="/landingPage/register" element={<Register />}></Route>
              <Route path="/ContentPage/*" element={<ContentPage />}></Route>
            </Routes>
          </BrowserRouter>
        </StorageProvider>
      </AuthProvider>
    </FirestoreProvider>

  );
}

export default App;
