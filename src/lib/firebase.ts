import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, addDoc, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const seedMarketplaceData = async () => {
  try {
    const creators = [
      {
        displayName: 'Alex Rivers',
        bio: '3D Animator and Environment Artist specializing in Unreal Engine 5.',
        role: 'creator',
        categories: ['3D Animator', 'Graphic Designer'],
        skills: ['Blender', 'UE5', 'Maya'],
        rating: 4.9,
        reviewCount: 12,
        followerCount: 1200,
        followingCount: 300,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        displayName: 'Elena Studio',
        bio: 'Video editor for high-growth YouTube channels.',
        role: 'creator',
        categories: ['Video Editor', 'Thumbnail Designer'],
        skills: ['Premiere Pro', 'After Effects', 'Photoshop'],
        rating: 5.0,
        reviewCount: 45,
        followerCount: 3400,
        followingCount: 120,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const creator of creators) {
      const userRef = await addDoc(collection(db, 'users'), creator);
      // Add a couple of portfolio items for each
      await addDoc(collection(db, 'portfolios'), {
        creatorId: userRef.id,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
        title: 'Abstract Concept - Genesis',
        description: 'A study in color and form for a premium client project.',
        tags: ['CGI', 'Minimal'],
        likesCount: 124,
        commentsCount: 12,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      await addDoc(collection(db, 'portfolios'), {
        creatorId: userRef.id,
        type: 'video',
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        title: 'Commercial Reel 2024',
        description: 'Selected works from the past year.',
        tags: ['Motion', 'Cinematic'],
        likesCount: 56,
        commentsCount: 4,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    alert('Marketplace seeded with demo data!');
  } catch (error) {
    console.error('Error seeding data:', error);
    alert('Failed to seed data. Check console.');
  }
};

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();
