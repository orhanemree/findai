import { getApp, initializeApp } from "firebase/app";

export default () => {
    // initialize app if not initialized already
    try {
        getApp();
    } catch {
        initializeApp({
            apiKey: process.env.NEXT_PUBLIC_API_KEY,
            authDomain: `${process.env.NEXT_PUBLIC_PROJECT_ID}.firebaseapp.com`,
            databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
            storageBucket: `${process.env.NEXT_PUBLIC_PROJECT_ID}.appspot.com`,
            messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_APP_ID
        });
    }
}