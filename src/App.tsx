/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { 
  Menu, X, Search, MessageCircle, Share2, 
  Leaf, Ban, Wheat, MapPin, Phone, Mail, Instagram, 
  Check, ChevronRight, Heart, User, LogOut, Trash2, Plus, RefreshCw, Upload,
  Settings
} from 'lucide-react';
import { PRODUCTS, STORIES, TRANSLATIONS, type Product, type Story } from './constants';
import { db, auth, storage } from './firebase';
import { 
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, 
  getDocFromServer, doc, type Timestamp, updateDoc, deleteDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, type User as FirebaseUser 
} from 'firebase/auth';
import { AIChatAssistant } from './components/AIChatAssistant';
import { AdminProductManager } from './components/AdminProductManager';

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---

const Logo = ({ className = "h-8" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 100 100" className="h-full w-auto">
      <path d="M50 10 C60 30 90 40 90 50 C90 60 60 70 50 90 C40 70 10 60 10 50 C10 40 40 30 50 10" fill="#D4A017" />
      <circle cx="50" cy="50" r="15" fill="#FFF8E7" />
      <text x="50" y="58" textAnchor="middle" fill="#2D5A3D" fontSize="20" fontWeight="bold" fontFamily="serif">P</text>
    </svg>
    <span className="font-serif text-xl font-bold text-white md:text-2xl">Panchamrut</span>
  </div>
);

const SectionDivider = () => (
  <div className="flex items-center justify-center py-12">
    <div className="h-[1px] w-full max-w-[100px] bg-gold opacity-50"></div>
    <svg viewBox="0 0 24 24" className="mx-4 h-6 w-6 fill-gold">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
    <div className="h-[1px] w-full max-w-[100px] bg-gold opacity-50"></div>
  </div>
);

const LippanPattern = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`opacity-20 ${className}`} preserveAspectRatio="none">
    <pattern id="lippan" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <path d="M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z" fill="currentColor" opacity="0.5" />
      <circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
    </pattern>
    <rect width="100" height="100" fill="url(#lippan)" />
  </svg>
);

const HeritageCard = ({ title, desc, image, delay }: { title: string, desc: string, image: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="group relative overflow-hidden rounded-2xl bg-white shadow-xl"
  >
    <div className="aspect-[4/5] w-full overflow-hidden">
      <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
    </div>
    <div className="absolute bottom-0 p-6 text-white text-left">
      <h3 className="font-serif text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-gray-300">{desc}</p>
    </div>
  </motion.div>
);

const WomanIllustration = ({ story }: { story: Story }) => (
  <svg viewBox="0 0 200 240" className="h-full w-full drop-shadow-lg">
    {/* Background Circle */}
    <circle cx="100" cy="120" r="90" fill={story.sareeColor} opacity="0.1" />
    
    {/* Body/Saree */}
    <path d="M60 240 Q100 100 140 240" fill={story.sareeColor} />
    <path d="M60 240 L40 240 L60 160 Z" fill={story.sareeColor} opacity="0.8" />
    
    {/* Head */}
    <circle cx="100" cy="80" r="35" fill="#F5D0B0" />
    <path d="M65 80 Q65 45 100 45 Q135 45 135 80" fill="#1A1A1A" />
    <circle cx="135" cy="80" r="10" fill="#1A1A1A" /> {/* Bun */}
    <circle cx="135" cy="80" r="4" fill="#D4A017" /> {/* Flower in bun */}
    
    {/* Face Details */}
    <circle cx="100" cy="70" r="3" fill="#CC0000" /> {/* Bindi */}
    <path d="M85 85 Q85 82 90 82" stroke="#1A1A1A" fill="none" strokeWidth="1" /> {/* Eye L */}
    <path d="M110 85 Q110 82 115 82" stroke="#1A1A1A" fill="none" strokeWidth="1" /> {/* Eye R */}
    <path d="M95 100 Q100 105 105 100" stroke="#CC0000" fill="none" strokeWidth="1.5" /> {/* Smile */}
    
    {/* Jewelry */}
    <circle cx="65" cy="85" r="3" fill="#D4A017" /> {/* Earring L */}
    <circle cx="135" cy="85" r="3" fill="#D4A017" /> {/* Earring R */}
    <path d="M80 110 Q100 120 120 110" stroke="#D4A017" fill="none" strokeWidth="2" /> {/* Necklace */}
    
    {/* Arms */}
    <path d="M60 160 Q40 180 60 210" stroke="#F5D0B0" fill="none" strokeWidth="12" strokeLinecap="round" />
    <path d="M140 160 Q160 180 140 210" stroke="#F5D0B0" fill="none" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

const ProductIllustration = ({ category, color }: { category: string, color: string }) => {
  switch (category) {
    case 'pickles':
      return (
        <svg viewBox="0 0 100 100" className="h-24 w-24">
          <path d="M30 40 Q30 30 50 30 Q70 30 70 40 L75 85 Q75 95 50 95 Q25 95 25 85 Z" fill={color} />
          <path d="M35 30 L65 30 L60 20 L40 20 Z" fill="#8B3A0F" />
          <path d="M30 50 H70" stroke="white" strokeWidth="1" opacity="0.3" />
          <path d="M30 60 H70" stroke="white" strokeWidth="1" opacity="0.3" />
        </svg>
      );
    case 'drinks':
      return (
        <svg viewBox="0 0 100 100" className="h-24 w-24">
          <path d="M40 20 H60 V30 Q60 40 70 40 V90 Q70 95 50 95 Q30 95 30 90 V40 Q40 40 40 30 Z" fill={color} />
          <rect x="35" y="50" width="30" height="20" fill="white" opacity="0.2" />
          <path d="M45 15 H55 V20 H45 Z" fill="#555" />
        </svg>
      );
    case 'masalas':
      return (
        <svg viewBox="0 0 100 100" className="h-24 w-24">
          <path d="M30 30 L70 30 L75 90 Q75 95 50 95 Q25 95 25 90 Z" fill={color} />
          <path d="M30 30 L50 20 L70 30" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="50" cy="60" r="15" fill="white" opacity="0.1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="h-24 w-24">
          <path d="M20 80 Q50 20 80 80" fill={color} opacity="0.6" />
          <path d="M30 90 Q50 40 70 90" fill={color} />
        </svg>
      );
  }
};

const Counter = ({ value, label, icon }: { value: string, label: string, icon: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const target = parseInt(value.replace(/\D/g, ''));

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-serif text-4xl font-bold text-gold md:text-5xl">
        {count}{value.includes('+') ? '+' : ''}
      </span>
      <span className="text-sm text-[#A8D5B0] mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
};

// --- Main App ---

const getDirectImageUrl = (url: string) => {
  if (!url) return '';
  
  // ImgBB viewing page conversion attempt (common pattern)
  if (url.includes('ibb.co/') && !url.includes('i.ibb.co')) {
    // We can't perfectly guess the extension, but often it works if we point to the viewer's ID
    // or just leave it for the error handler to try to find a fallback.
    return url; 
  }

  // Convert standard Google Drive sharing links to direct LH3 links
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1]?.split('/')[0];
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
  }
  if (url.includes('drive.google.com/open?id=')) {
    const id = url.split('id=')[1]?.split('&')[0];
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
  }
  if (url.includes('drive.google.com/uc?id=')) {
    const id = url.split('id=')[1]?.split('&')[0];
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
  }
  return url;
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const isAdminRef = useRef(false);

  useEffect(() => {
    isAdminRef.current = isAdmin;
  }, [isAdmin]);

  const [language, setLanguage] = useState<'en' | 'gu' | 'hi'>('en');
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);
  const [showProductManager, setShowProductManager] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const t = (path: string) => {
    const keys = path.split('.');
    let result = TRANSLATIONS[language];
    for (const key of keys) {
      if (result[key]) result = result[key];
      else return path;
    }
    return result;
  };
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminOrderData, setAdminOrderData] = useState({
    name: '',
    phone: '',
    city: '',
    products: '',
    type: 'Regular Order'
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    
    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firestore connected successfully.");
      } catch (error) {
        console.error("Firestore connection error:", error);
        if(error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach Cloud Firestore backend'))) {
          console.error("Please check your Firebase configuration or wait a moment for the database to be ready.");
        }
      }
    };
    testConnection();

    // Fetch Products from Firestore
    const qProducts = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data() as Product;
        return { ...data, id: doc.id, image: getDirectImageUrl(data.image || '') };
      });
      setDbProducts(productsData);
      setIsProductsLoaded(true);
    }, (error) => {
      console.error("Products fetch error:", error);
      setIsProductsLoaded(true); // Don't block loading
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      const admins = [
        "tanmaypund32@gmail.com", 
        "kajal.zala@ceeindia.org", 
        "nita.shreemali@ceeindia.org",
        "nitin.agravat@ceeindia.org",
        "azad.pagada@ceeindia.org",
        "khyati.parmar@ceeindia.org"
      ];
      const isForced = window.localStorage.getItem('forceAdmin') === 'true';
      if ((u && u.email && admins.includes(u.email.toLowerCase())) || isForced) {
        console.log("Admin privileges granted:", u?.email || "Forced Admin");
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeAuth();
      unsubscribeProducts();
    };
  }, []);

  const deleteProduct = async (id: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    if (typeof id === 'number') {
      alert("This is a default product. To delete it, please click 'Manage Products' and then 'Restore Default Products' (Refresh icon) to sync the store to the cloud first. Then you can delete any product.");
      setShowProductManager(true);
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', id as string));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribeOrders = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      });
      return () => unsubscribeOrders();
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("User closed the login popup.");
        return;
      }
      console.error("Login failed", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const filteredProducts = useMemo(() => {
    // Merge Strategy:
    // 1. Start with Database Products
    // 2. Add Default Products that are NOT in the Database
    const merged = [...dbProducts];
    
    PRODUCTS.forEach(p => {
      const existsInDb = dbProducts.some(dp => dp.name.toLowerCase().trim() === p.name.toLowerCase().trim());
      if (!existsInDb) {
        merged.push({ ...p, id: `default-${p.id}` });
      }
    });

    const finalSource = merged;

    const filtered = finalSource.filter(p => {
      // EXCLUDE INCENSE STICKS PER USER REQUEST (Ensure they don't show up from DB or any source)
      const pNameLow = (p.name || '').toLowerCase();
      const pGuj = p.gujarati || '';
      if (pNameLow.includes('incense') || pNameLow.includes('agarbatti') || pGuj.includes('અગરબત્તી')) return false;

      const pName = p.name || '';
      const pDesc = p.desc || '';
      
      const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           pGuj.includes(searchQuery) ||
                           pDesc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || 
                             (activeCategory === 'Pickles' && p.category === 'pickles') ||
                             (activeCategory === 'Drinks & Juices' && p.category === 'drinks') ||
                             (activeCategory === 'Masalas & Spices' && p.category === 'masalas') ||
                             (activeCategory === 'Health & Wellness' && p.category === 'wellness') ||
                             (activeCategory === 'Food & Grains' && p.category === 'grains') ||
                             (activeCategory === 'Religious Items' && p.category === 'religious') ||
                             (activeCategory === 'Eco Products' && p.category === 'eco');
      return matchesSearch && matchesCategory;
    });

    return filtered;
  }, [searchQuery, activeCategory, dbProducts, isProductsLoaded]);

  const categories = [
    'All', 'Pickles', 'Drinks & Juices', 'Masalas & Spices', 
    'Health & Wellness', 'Food & Grains', 'Religious Items', 'Eco Products'
  ];

const WHATSAPP_NUMBERS = ['919512240470']; 

  const handleWhatsAppOrder = (productName: string) => {
    const msg = `Hi, I want to order ${productName} from Panchamrut. Please confirm availability and delivery charges.`;
    const targetNumber = WHATSAPP_NUMBERS[0];
    window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'orders');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'orders');
    }
  };

  const submitAdminOrder = async () => {
    if (!adminOrderData.name || !adminOrderData.phone || !adminOrderData.products) {
      alert('Please fill Name, Phone, and Products');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        customerName: adminOrderData.name,
        customerPhone: adminOrderData.phone,
        customerCity: adminOrderData.city,
        products: adminOrderData.products,
        orderType: adminOrderData.type,
        createdAt: serverTimestamp(),
        status: 'confirmed' // Admin orders are confirmed by default
      });
      
      setAdminOrderData({
        name: '',
        phone: '',
        city: '',
        products: '',
        type: 'Regular Order'
      });
      setShowAdminModal(false);
      alert('Order added successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
  };

  const submitOrder = async () => {
    const name = (document.getElementById('orderName') as HTMLInputElement)?.value;
    const phone = (document.getElementById('orderPhone') as HTMLInputElement)?.value;
    const city = (document.getElementById('orderCity') as HTMLInputElement)?.value;
    const products = (document.getElementById('orderProducts') as HTMLTextAreaElement)?.value;
    const type = (document.getElementById('orderType') as HTMLSelectElement)?.value;

    if (!name || !phone || !products) {
      alert('Please fill Name, Phone, and Products');
      return;
    }

    try {
      // Save to Firestore
      await addDoc(collection(db, 'orders'), {
        customerName: name,
        customerPhone: phone,
        customerCity: city,
        products: products,
        orderType: type,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      // Then open WhatsApp
      const msg = `NEW ORDER from Panchamrut Website:\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nType: ${type}\nOrder: ${products}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBERS[0]}?text=${encodeURIComponent(msg)}`, '_blank');
      
      // Clear form
      (document.getElementById('orderName') as HTMLInputElement).value = '';
      (document.getElementById('orderPhone') as HTMLInputElement).value = '';
      (document.getElementById('orderCity') as HTMLInputElement).value = '';
      (document.getElementById('orderProducts') as HTMLTextAreaElement).value = '';
      
      alert('Order placed successfully! We will contact you soon.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
  };

  const currentMonth = new Date().getMonth();
  const seasonalMessage = useMemo(() => {
    if (currentMonth === 9 || currentMonth === 10) return '🪔 Diwali Special: Gift Hampers & Cotton Wicks available now! Order before stock runs out.';
    if (currentMonth === 1 || currentMonth === 2) return '🎨 Holi Special: Natural Holi Colours available — safe for children, gentle on skin.';
    if (currentMonth === 11 || currentMonth === 0 || currentMonth === 3) return '🌿 Best Season: Fresh Moringa Powder, Palash Flower, and all Pickles at peak quality now.';
    return '';
  }, [currentMonth]);

  const handleQuickSync = async () => {
    // Check if we already did this in this session
    if (window.sessionStorage.getItem('syncDone')) return;

    console.log("Starting automatic image sync...");
    try {
      const { getDocs, collection, doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      const snapshot = await getDocs(collection(db, 'products'));
      
      let updated = 0;
      for (const defaultProduct of PRODUCTS) {
        const matches = snapshot.docs.filter(d => 
          (d.data().name || '').toLowerCase().trim() === defaultProduct.name.toLowerCase().trim()
        );
        
        for (const m of matches) {
          // If the image is different, update it
          if (m.data().image !== defaultProduct.image) {
            console.log(`Auto-updating image for ${defaultProduct.name}`);
            await updateDoc(doc(db, 'products', m.id), {
              image: defaultProduct.image,
              updatedAt: serverTimestamp()
            });
            updated++;
          }
        }
      }
      if (updated > 0) {
        console.log(`Auto-synced ${updated} products.`);
        window.sessionStorage.setItem('syncDone', 'true');
        // We don't reload automatically to avoid loops, the listener will update UI
      }
    } catch (error) {
      console.error("Auto-sync error:", error);
    }
  };

  useEffect(() => {
    if (isAdmin && isProductsLoaded) {
      handleQuickSync();
    }
  }, [isAdmin, isProductsLoaded]);

  return (
    <div className="grain-bg min-h-screen">
      {/* Seasonal Banner */}
      <AnimatePresence>
        {showBanner && seasonalMessage && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gold text-text px-4 py-2 text-center text-sm font-medium relative z-[1100]"
          >
            {seasonalMessage}
            <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-[1000] w-full transition-all duration-300 ${scrolled ? 'h-[50px] bg-green-dark shadow-lg' : 'h-[60px] bg-green'}`}>
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <Logo />
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
            {(['en', 'gu', 'hi'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                  language === lang ? 'bg-gold text-text' : 'text-white hover:bg-white/10'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'gu' ? 'ગુ' : 'हिं'}
              </button>
            ))}
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {(t('nav') as string[]).map((item, idx) => (
              <a 
                key={item} 
                href={`#${['home', 'products', 'stories', 'hampers', 'order'][idx]}`}
                className="group relative text-sm font-medium text-white transition-colors hover:text-gold"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="h-8 w-8 rounded-full border border-gold" />
                <button onClick={handleLogout} className="text-white hover:text-gold transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  id="google-login-btn"
                  onClick={handleLogin} 
                  className="text-white hover:text-gold transition-colors flex items-center gap-1"
                  title="Login with Google"
                >
                  <User size={20} />
                  <span className="hidden lg:inline text-xs">Login</span>
                </button>
                {/* Debug bypass for admin if popup is blocked */}
                <button 
                  id="admin-bypass-btn"
                  onClick={() => {
                    const email = window.prompt("Admin Email (for testing if login fails):");
                    if (email) {
                      const admins = [
                        "tanmaypund32@gmail.com", 
                        "kajal.zala@ceeindia.org", 
                        "nita.shreemali@ceeindia.org",
                        "nitin.agravat@ceeindia.org",
                        "azad.pagada@ceeindia.org",
                        "khyati.parmar@ceeindia.org"
                      ];
                      if (admins.includes(email.toLowerCase().trim())) {
                        window.localStorage.setItem('forceAdmin', 'true');
                        alert("Bypass active. Please refresh the page manually once if needed.");
                        window.location.reload();
                      }
                    }
                  }}
                  className="text-white opacity-20 hover:opacity-100 transition-opacity"
                  title="Admin Bypass"
                >
                  <Settings size={14} />
                </button>
              </div>
            )}
            <a 
              href="#order" 
              className="hidden rounded-full bg-gold px-6 py-2 text-sm font-bold text-text transition-transform hover:scale-105 md:block"
            >
              Order Now 🌿
            </a>
            <button className="text-white md:hidden" onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 z-[2001] h-full w-64 bg-green-dark p-8 text-white shadow-2xl"
            >
              <button className="absolute right-4 top-4" onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
              <nav className="mt-12 flex flex-col gap-6">
                {(t('nav') as string[]).map((item, idx) => (
                  <a 
                    key={item} 
                    href={`#${['home', 'products', 'stories', 'hampers', 'order'][idx]}`} 
                    className="text-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <a 
                  href="#order" 
                  className="mt-4 rounded-full bg-gold px-6 py-3 text-center font-bold text-text"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'Order Now 🌿' : language === 'gu' ? 'ઓર્ડર કરો 🌿' : 'ऑर्डर करें 🌿'}
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative flex min-h-[calc(100vh-60px)] flex-col items-center justify-center overflow-hidden px-4 py-12 md:flex-row md:px-12">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920" 
            alt="Organic Background" 
            className="h-full w-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-transparent to-cream/80"></div>
        </div>
        <div className="absolute inset-0 -z-10 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#8B3A0F 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          <div className="mb-4 inline-flex items-center rounded-full border border-green bg-[#E8F5E0] px-4 py-1 text-xs font-bold text-green transform hover:rotate-1 transition-transform">
            {t('hero.location')}
          </div>
          <h1 className="text-6xl font-bold leading-tight text-green md:text-8xl lg:text-9xl">
            Panchamrut
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
            <h2 className="text-3xl text-terra font-serif font-bold" lang="gu">પંચામૃત</h2>
            <div className="h-[2px] w-12 bg-gold"></div>
            <p className="text-2xl italic text-terra font-serif">"No Oil. All Soul."</p>
          </div>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-text-muted font-light">
            {t('hero.desc')}
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-6 md:justify-start">
            <a href="#products" className="group relative overflow-hidden rounded-full bg-green px-10 py-4 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10">{t('hero.shop')}</span>
              <div className="absolute inset-0 -z-10 translate-y-full bg-green-dark transition-transform duration-300 group-hover:translate-y-0"></div>
            </a>
            <a href="#stories" className="rounded-full border-2 border-gold px-10 py-4 font-bold text-terra transition-all hover:bg-gold hover:text-white">
              {t('hero.stories')}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 md:justify-start">
            <div className="flex items-center gap-3 rounded-full border border-green/20 bg-white/50 px-4 py-2 text-sm font-medium text-green backdrop-blur-sm">
              <Leaf size={18} /> {language === 'en' ? 'No Preservatives' : language === 'gu' ? 'કોઈ પ્રિઝર્વેટિવ્સ નથી' : 'कोई संरक्षक नहीं'}
            </div>
            <div className="flex items-center gap-3 rounded-full border border-terra/20 bg-white/50 px-4 py-2 text-sm font-medium text-terra backdrop-blur-sm">
              <Ban size={18} /> {language === 'en' ? 'No Food Colour' : language === 'gu' ? 'કોઈ ફૂડ કલર નથી' : 'कोई खाद्य रंग नहीं'}
            </div>
            <div className="flex items-center gap-3 rounded-full border border-gold/20 bg-white/50 px-4 py-2 text-sm font-medium text-gold backdrop-blur-sm">
              <Wheat size={18} /> {language === 'en' ? '100% Organic' : language === 'gu' ? '૧૦૦% ઓર્ગેનિક' : '100% ऑर्गेनिक'}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-16 flex flex-1 items-center justify-center md:mt-0"
        >
          <div className="absolute inset-0 -z-10 animate-[spin_20s_linear_infinite] opacity-10">
            <svg viewBox="0 0 200 200" className="h-full w-full fill-gold">
              <path d="M100 0 L110 90 L200 100 L110 110 L100 200 L90 110 L0 100 L90 90 Z" />
            </svg>
          </div>
          <div className="relative h-[350px] w-[350px] md:h-[500px] md:w-[500px]">
             {/* Decorative Frames */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-gold/20 animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border-2 border-green/10 animate-[spin_40s_linear_infinite_reverse]"></div>
            
            <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-[0_20px_50px_rgba(139,58,15,0.3)]">
              {/* Pot */}
              <path d="M100 350 Q100 380 200 380 Q300 380 300 350 L320 150 Q320 120 200 120 Q80 120 80 150 Z" fill="#9B5520" />
              <path d="M80 150 Q80 130 200 130 Q320 130 320 150" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
              
              {/* Floating Elements */}
              <motion.g animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <circle cx="100" cy="100" r="25" fill="#84CC16" /> {/* Lime */}
                <path d="M100 80 L100 120 M80 100 L120 100" stroke="white" strokeWidth="1" />
              </motion.g>
              <motion.g animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}>
                <ellipse cx="320" cy="90" rx="18" ry="24" fill="#8B5820" /> {/* Date */}
              </motion.g>
              <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                <path d="M360 260 L375 285 L345 285 Z" fill="#CC0000" /> {/* Chilli */}
              </motion.g>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Marquee Ticker */}
      <div className="w-full overflow-hidden bg-green py-3 text-white shadow-xl relative z-10">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-sm font-bold tracking-[0.2em] uppercase">
              <span className="flex items-center gap-2"><Check size={16} className="text-gold" /> NO PRESERVATIVES</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-gold" /> NO FOOD COLOUR</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-gold" /> NO VINEGAR</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-gold" /> MADE BY RURAL WOMEN</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-gold" /> FSSAI CERTIFIED</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-gold" /> 100% PURE ORGANIC</span>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Section - NEW */}
      <section className="relative bg-white py-24 overflow-hidden">
        <LippanPattern className="absolute top-0 left-0 w-64 h-full text-gold/10" />
        <LippanPattern className="absolute top-0 right-0 w-64 h-full text-gold/10 rotate-180" />
        
        <div className="mx-auto max-w-7xl px-4 text-center">
            <span className="text-sm font-bold tracking-[0.3em] text-gold uppercase mb-4 block">The Soil of the Village</span>
            <h2 className="font-serif text-5xl font-bold text-green md:text-6xl">Our Pillars of Purity</h2>
            <div className="mx-auto mt-6 h-[2px] w-24 bg-gold"></div>
            
            <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-600 leading-relaxed italic">
              "Panchamrut is the rhythm of Jasdan fields, the sun on the terraces of Kalawad, and the combined strength of rural women."
            </p>

            <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-4 px-4">
              {[
                { icon: <Leaf size={32} />, title: "Organic Seeds", desc: "We use indigenous organic seed varieties grown on our own village farms." },
                { icon: <Check size={32} />, title: "Sun Cured", desc: "Our products are dried naturally under the golden Gujarat sun, preserving every nutrient." },
                { icon: <Ban size={32} />, title: "Time Tested", desc: "We follow ancient recipes passed down through generations—no shortcuts." },
                { icon: <Heart size={32} />, title: "Hand Made", desc: "Each jar is filled by hand with the warmth and care of our local artisans." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-cream text-terra transition-transform group-hover:rotate-6 group-hover:scale-110 shadow-lg border border-gold/10">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-green">{item.title}</h3>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* About Panchamrut Collective - Updated */}
      <section className="bg-green-dark py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="text-gold font-bold tracking-widest uppercase text-sm block mb-4">Our Movement</span>
              <h2 className="font-serif text-5xl font-bold leading-tight md:text-7xl">
                The Heritage of <br />
                <span className="text-gold">Saurashtra.</span>
              </h2>
              <p className="mt-8 text-xl text-green-100 leading-relaxed font-light">
                Panchamrut started as a collective of rural women with one simple goal: 
                to bring back the authentic, chemical-free taste of our grandmothers' kitchens. 
                Today, we are dedicated to preserving our soil and our health through traditional methods.
              </p>
              
              <div className="mt-10 space-y-6">
                {[
                  { title: "Empowering Rural Livelihoods", desc: "Every purchase directly supports self-reliant women entrepreneurs in our villages." },
                  { title: "Seed to Jar Integrity", desc: "Complete transparency from the day we sow the seed to the day it reaches your kitchen." },
                  { title: "Zero Shortcuts", desc: "No oil, no vinegar, no preservatives. Just patience and tradition." }
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-4"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-gold shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gold text-lg">{item.title}</h4>
                      <p className="text-green-100/70">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12">
                <a href="#stories" className="inline-flex items-center gap-2 rounded-full border-2 border-gold px-8 py-3 font-bold text-gold transition-all hover:bg-gold hover:text-white">
                  Discover Our Stories <ChevronRight size={20} />
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square relative overflow-hidden rounded-[3rem]">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200" 
                  alt="Rural Women working together" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gold/10 mix-blend-overlay"></div>
              </div>
              
              {/* Impact Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-8 -left-8 rounded-3xl bg-white p-8 text-green-dark shadow-2xl"
              >
                <div className="text-center px-4">
                  <div className="font-serif text-5xl font-bold">100%</div>
                  <div className="text-xs uppercase tracking-widest text-gold font-bold mt-1">Chemical Free</div>
                  <div className="mt-4 h-[1px] w-full bg-gray-100"></div>
                  <div className="mt-6 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-cream flex items-center justify-center text-terra mb-2">
                       <Leaf size={24} />
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest text-green-dark">Pure Tradition</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="bg-cream px-4 py-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green md:text-5xl">{t('products.title')}</h2>
            <p className="mt-2 text-xl text-terra" lang="gu">{t('products.subtitle')}</p>
            <SectionDivider />
          </div>

          {/* Search & Filter */}
          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="flex w-full max-w-md items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
                <input 
                  type="text" 
                  placeholder={t('products.search')}
                  className="h-14 w-full rounded-full border-2 border-gold bg-white pl-12 pr-4 outline-none focus:border-green"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* isAdmin checks removed from here - moved to floating bar */}
            </div>

            <div className="hide-scrollbar flex w-full gap-3 overflow-x-auto pb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-green text-white' 
                      : 'bg-cream-dark text-green border border-gold hover:bg-gold/10'
                  }`}
                >
                  {t(`products.${cat.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold/30 bg-cream-dark transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(product.id, product.name);
                      }}
                      className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div 
                    className="relative flex h-56 cursor-zoom-in items-center justify-center overflow-hidden bg-white/40 ring-1 ring-inset ring-gold/10"
                    onClick={() => setZoomedImage(product.image)}
                  >
                    <motion.img 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={product.image} 
                      alt={product.name} 
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try fallback to constants if it's not already using it
                        const defaultProduct = PRODUCTS.find(p => p.name.toLowerCase().trim() === product.name.toLowerCase().trim());
                        if (defaultProduct && defaultProduct.image) {
                          const directUrl = getDirectImageUrl(defaultProduct.image);
                          if (target.src !== directUrl) {
                            target.src = directUrl;
                            return;
                          }
                        }
                        // Truly failed, show illustration
                        target.parentElement?.classList.add('bg-white');
                        target.classList.add('hidden');
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden h-full w-full items-center justify-center">
                      <ProductIllustration category={product.category} color={product.imgColor} />
                    </div>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                    {product.badge && (
                      <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${
                        product.badge === 'Bestseller' ? 'bg-gold' : 
                        product.badge === 'Medicinal' ? 'bg-green' : 
                        product.badge === 'Seasonal' ? 'bg-terra' : 'bg-green-light'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-text">
                      {product[language === 'gu' ? 'gujarati' : language === 'hi' ? 'hindi' : 'name']}
                    </h3>
                    {language === 'en' && <p className="text-xs text-terra" lang="gu">{product.gujarati}</p>}
                    <p className="mt-2 text-sm leading-snug text-text-muted">{product.benefit}</p>
                    
                    <div className="mt-auto pt-4">
                      <div className="flex items-end justify-between">
                        <span className="font-serif text-2xl font-bold text-gold">₹{product.price}</span>
                        <span className="text-xs text-text-muted">{product.weight}</span>
                      </div>
                      <button 
                        onClick={() => handleWhatsAppOrder(product.name)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
                      >
                        <MessageCircle size={18} /> {t('products.order')}
                      </button>
                      <p className="mt-2 text-center text-[10px] font-medium text-green">{t('products.organic')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-xl text-text-muted">No products found matching your search.</p>
              <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-gold underline">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="bg-gradient-to-b from-cream to-cream-dark px-4 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green md:text-5xl">{t('stories.title')}</h2>
            <p className="mt-2 text-xl text-terra" lang="gu">{t('stories.subtitle')}</p>
            <p className="mx-auto mt-6 max-w-2xl text-text-muted">
              {t('stories.desc')}
            </p>
            <SectionDivider />
          </div>

          <div className="mt-16 space-y-24">
            {STORIES.map((story, idx) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col items-center gap-12 md:flex-row ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full max-w-[300px] flex-shrink-0 overflow-hidden rounded-3xl border-4 border-gold/20 shadow-xl">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden">
                    <WomanIllustration story={story} />
                  </div>
                </div>
                <div className="flex-1 rounded-3xl border border-gold/20 bg-white p-8 shadow-sm md:p-12">
                  <h3 className="text-3xl font-bold text-green">{story.name}</h3>
                  <p className="text-sm font-medium text-terra uppercase tracking-widest">{t('stories.village')}: {story.village}</p>
                  <p className="mt-4 text-xl italic text-terra">"{story.quote}"</p>
                  <p className="mt-6 leading-relaxed text-text-muted">{story.storyText}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {story.products.map(p => (
                      <span key={p} className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-green border border-green/20">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact Counters */}
        <div className="mt-24 w-full bg-green-dark py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
            <Counter value="800+" label="Farmers in network" icon="🌿" />
            <Counter value="52+" label="SHG Members" icon="👩" />
            <Counter value="10" label="Villages, Saurashtra" icon="🏘️" />
            <Counter value="25+" label="Pure Products" icon="📦" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-cream px-4 py-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green md:text-5xl">About Panchamrut</h2>
            <p className="mt-2 text-xl text-terra" lang="gu">પંચામૃત વિશે</p>
            <SectionDivider />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "The Brand",
                border: "border-green",
                icon: <Logo className="h-12" />,
                text: "Panchamrut means five nectars — a sacred Gujarati word. Every product we make carries the purity of that name. No food colour. No vinegar. No preservatives. No shortcuts. Just pure, traditional Saurashtra taste — as it has been made in these villages for generations."
              },
              {
                title: "The Company",
                border: "border-gold",
                icon: <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold"><Wheat size={32} /></div>,
                text: "Mahidad FPC was built by the farming community of Saurashtra. With 800+ farmers in the network and SHG members across 10 villages, it is the collective backbone behind every Panchamrut product. The FPC holds both FPC and FSSAI licences."
              },
              {
                title: "Project Aarohan",
                border: "border-terra",
                icon: <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terra/10 text-terra"><Heart size={32} /></div>,
                text: "Project Aarohan is a CSR initiative by Apraava Energy, implemented by Centre for Environment Education (CEE), Ahmedabad. Working across 25 villages in Saurashtra."
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border-t-[3px] bg-white p-8 shadow-sm ${card.border}`}
              >
                <div className="mb-6">{card.icon}</div>
                <h3 className="text-2xl font-bold text-text">{card.title}</h3>
                <p className="mt-4 leading-relaxed text-text-muted">{card.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-24">
            <h3 className="text-center text-3xl font-bold text-green">Why Panchamrut?</h3>
            <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-gold/20 shadow-lg">
              <div className="grid grid-cols-2 text-center font-bold">
                <div className="bg-[#FFF0F0] py-4 text-[#CC0000]">Regular Market Products</div>
                <div className="bg-[#F0FFF4] py-4 text-green">Panchamrut</div>
              </div>
              {[
                ["Rs 120-130 / product", "Rs 150-300 — premium quality"],
                ["✗ Chemical colour added", "✓ Zero food colour"],
                ["✗ Preservatives used", "✓ Zero preservatives"],
                ["✗ Vinegar added", "✓ Zero vinegar"],
                ["✗ Factory-made", "✓ Handmade by rural women"]
              ].map(([left, right], i) => (
                <div key={i} className="grid grid-cols-2 border-t border-gold/10 bg-white py-4 text-center text-sm">
                  <div className="px-4 text-text-muted">{left}</div>
                  <div className="px-4 font-medium text-text">{right}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hampers Section */}
      <section id="hampers" className="relative bg-green-dark px-4 py-20 md:px-12 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10">
          <img 
            src="https://picsum.photos/seed/panchamrut-hampers/1200/800" 
            alt="Hampers Background" 
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#F5ECD7] md:text-5xl">{t('hampers.title')}</h2>
            <p className="mt-4 text-lg text-[#A8D5B0]">{t('hampers.subtitle')}</p>
          </div>

          <div className="mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            {[
              {
                name: "Saurashtra Starter",
                price: "450",
                contents: "Date-Lime Pickle (500g) + Lemon-Ginger Juice (700ml) + Chaas Masala (50g)",
                for: "A perfect introduction to Saurashtra's flavours",
                badge: "Corporate Gift Ready",
                image: "https://i.ibb.co/tPkVXmYk/bundle1-3.png"
              },
              {
                name: "Panchamrut Premium",
                price: "750",
                contents: "Date-Lime Pickle + Mango Pickle + Lemon-Ginger Juice + Moringa Powder + Herbal Toothpowder + Loofah",
                for: "Our bestselling health and food bundle — most popular for Diwali",
                badge: "🌟 Bestseller",
                featured: true,
                image: "https://picsum.photos/seed/hamper2/400/300"
              },
              {
                name: "Saurashtra Royal",
                price: "1,200",
                contents: "Premium hamper + Findala Pulp + Mix Fruit Jam + Milk Masala + Cow Ghee (500g) + Natural Holi Colour",
                for: "The complete Panchamrut experience in one beautiful cloth bag",
                badge: "Premium CSR Gift",
                image: "https://picsum.photos/seed/hamper3/400/300"
              }
            ].map((hamper, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className={`flex flex-col rounded-2xl p-8 transition-all ${
                  hamper.featured 
                    ? 'bg-white/10 border-2 border-gold scale-105 z-10' 
                    : 'bg-white/5 border border-gold/40'
                }`}
              >
                <div className="flex justify-center mb-6 overflow-hidden rounded-xl h-40">
                  <img 
                    src={hamper.image} 
                    alt={hamper.name} 
                    className="h-full w-full object-cover transition-transform hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">{hamper.badge}</span>
                <h3 className="text-2xl font-bold text-white">{hamper.name}</h3>
                <p className="mt-2 text-3xl font-bold text-gold">₹{hamper.price}</p>
                <p className="mt-4 text-sm text-[#A8D5B0]">{hamper.for}</p>
                <div className="mt-6 flex-1">
                  <p className="text-xs font-bold uppercase text-gold/60">Includes:</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{hamper.contents}</p>
                </div>
                <div className="mt-8 space-y-3">
                  <button 
                    onClick={() => handleWhatsAppOrder(hamper.name + ' Hamper')}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-bold text-white"
                  >
                    <MessageCircle size={18} /> Order on WhatsApp
                  </button>
                  <a href="#order" className="block w-full rounded-lg border border-gold/40 py-3 text-center text-sm font-bold text-gold">
                    Bulk Enquiry
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="bg-cream px-4 py-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green md:text-5xl">{t('order.title')}</h2>
            <p className="mt-2 text-xl text-terra" lang="gu">{t('order.subtitle')}</p>
            <SectionDivider />
          </div>

          {/* Three Step Process */}
          <div className="mt-12 flex flex-col items-center justify-center gap-8 md:flex-row">
            {[
              { step: 1, icon: "👁️", title: language === 'en' ? "Browse Products" : language === 'gu' ? "પ્રોડક્ટ્સ જુઓ" : "उत्पाद देखें", desc: language === 'en' ? "Scroll up and choose what you want" : language === 'gu' ? "ઉપર જાઓ અને તમારી પસંદગી કરો" : "ऊपर जाएं और अपनी पसंद चुनें" },
              { step: 2, icon: "💬", title: language === 'en' ? "WhatsApp / Form" : language === 'gu' ? "વોટ્સએપ / ફોર્મ" : "व्हाट्सएप / फॉर्म", desc: language === 'en' ? "Click order button or fill the form" : language === 'gu' ? "ઓર્ડર બટન પર ક્લિક કરો અથવા ફોર્મ ભરો" : "ऑर्डर बटन पर क्लिक करें या फॉर्म भरें" },
              { step: 3, icon: "🚚", title: language === 'en' ? "We Deliver" : language === 'gu' ? "અમે પહોંચાડીશું" : "हम पहुंचाएंगे", desc: language === 'en' ? "We confirm and deliver within 3-7 days" : language === 'gu' ? "અમે ૩-૭ દિવસમાં પુષ્ટિ કરીશું અને પહોંચાડીશું" : "हम 3-7 दिनों में पुष्टि करेंगे और पहुंचाएंगे" }
            ].map((s, i) => (
              <div key={i} className="flex flex-1 flex-col items-center text-center">
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <span className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-text">
                    {s.step}
                  </span>
                  <span className="text-3xl">{s.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-text">{s.title}</h4>
                <p className="mt-2 text-sm text-text-muted">{s.desc}</p>
                {i < 2 && <ChevronRight className="mt-4 hidden text-gold md:block" size={32} />}
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* WhatsApp Box */}
            <div className="rounded-2xl border-2 border-[#25D366] bg-[#F0FFF4] p-8 md:p-12">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                <MessageCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-text">{t('order.whatsapp')}</h3>
              <p className="mt-4 text-text-muted">
                {language === 'en' 
                  ? 'Tap the button below. Send us your order. We confirm within 2 hours and arrange delivery.'
                  : language === 'gu'
                  ? 'નીચેના બટન પર ટેપ કરો. અમને તમારો ઓર્ડર મોકલો. અમે ૨ કલાકમાં પુષ્ટિ કરીશું અને ડિલિવરીની વ્યવસ્થા કરીશું.'
                  : 'नीचे दिए गए बटन पर टैप करें। हमें अपना ऑर्डर भेजें। हम 2 घंटे के भीतर पुष्टि करेंगे और डिलीवरी की व्यवस्था करेंगे।'}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  id="whatsapp-order-main-btn"
                  onClick={() => handleWhatsAppOrder('Products')}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  {language === 'en' ? '📱 Order on WhatsApp →' : language === 'gu' ? '📱 વોટ્સએપ પર ઓર્ડર →' : '📱 व्हाट्सएप पर ऑर्डर →'}
                </button>
              </div>
              <div className="mt-6 space-y-2 text-sm text-text-muted">
                <p>• {language === 'en' ? 'Delivery charge: Rs 40-50 within Gujarat' : language === 'gu' ? 'ડિલિવરી ચાર્જ: ગુજરાતમાં રૂ. ૪૦-૫૦' : 'डिलीवरी शुल्क: गुजरात के भीतर 40-50 रुपये'}</p>
                <p>• {language === 'en' ? '3-7 days delivery time' : language === 'gu' ? '૩-૭ દિવસ ડિલિવરી સમય' : '3-7 दिन डिलीवरी का समय'}</p>
                <p>• WhatsApp: +91 95122 40470</p>
              </div>
            </div>

            {/* Form Box */}
            <div className="rounded-2xl border border-gold bg-cream-dark p-8 md:p-12">
              <h3 className="text-2xl font-bold text-text">{language === 'en' ? 'Order / Enquiry Form' : language === 'gu' ? 'ઓર્ડર / પૂછપરછ ફોર્મ' : 'ऑर्डर / पूछताछ फॉर्म'}</h3>
              <p className="mt-2 text-text-muted">{t('order.desc')}</p>
              
              <div className="mt-8 space-y-4">
                <input id="orderName" type="text" placeholder={t('order.name') + " *"} className="w-full rounded-lg border border-gold/40 bg-white p-3 outline-none focus:border-green" />
                <input id="orderPhone" type="tel" placeholder={t('order.phone') + " *"} className="w-full rounded-lg border border-gold/40 bg-white p-3 outline-none focus:border-green" />
                <input id="orderCity" type="text" placeholder={t('order.city') + " *"} className="w-full rounded-lg border border-gold/40 bg-white p-3 outline-none focus:border-green" />
                <textarea id="orderProducts" placeholder={t('order.products') + " *"} rows={3} className="w-full rounded-lg border border-gold/40 bg-white p-3 outline-none focus:border-green"></textarea>
                <select id="orderType" className="w-full rounded-lg border border-gold/40 bg-white p-3 outline-none focus:border-green">
                  <option value="regular">{t('order.regular')}</option>
                  <option value="bulk">{language === 'en' ? 'Bulk / Wholesale' : language === 'gu' ? 'બલ્ક / હોલસેલ' : 'थोक / थोक'}</option>
                  <option value="hamper">{t('order.hamper')}</option>
                  <option value="enquiry">{language === 'en' ? 'General Enquiry' : language === 'gu' ? 'સામાન્ય પૂછપરછ' : 'सामान्य पूछताछ'}</option>
                </select>
                <button 
                  id="submit-form-order-btn"
                  onClick={submitOrder}
                  className="w-full rounded-lg bg-green py-4 font-bold text-white transition-colors hover:bg-green-dark"
                >
                  {t('order.submit')} →
                </button>
                <p className="text-center text-xs text-text-muted">
                  {language === 'en' 
                    ? 'Your order will open in WhatsApp for confirmation.'
                    : language === 'gu'
                    ? 'તમારો ઓર્ડર પુષ્ટિ માટે વોટ્સએપમાં ખુલશે.'
                    : 'आपका ऑर्डर पुष्टि के लिए व्हाट्सएप में खुलेगा।'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-gold/20 pt-12 text-sm text-text-muted">
            <div className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> Saurashtra, Gujarat — 360050</div>
            <div className="flex items-center gap-2"><Check size={16} className="text-gold" /> FPC & FSSAI Licenced</div>
            <div className="flex items-center gap-2"><Leaf size={16} className="text-gold" /> Supported by Project Aarohan</div>
          </div>

          {/* Admin Orders View */}
          {isAdmin && (
            <div className="mt-20 space-y-8">
              <div className="rounded-2xl border border-gold bg-white p-8 shadow-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gold/10 pb-6">
                  <h3 className="text-2xl font-bold text-green">Admin Portal - Order Management</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input 
                        type="text"
                        placeholder="Search name or phone..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="rounded-lg border border-gold/40 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-green w-64"
                      />
                    </div>
                    <button 
                      onClick={() => setShowProductManager(true)}
                      className="rounded-lg bg-green px-6 py-2 text-sm font-bold text-white hover:bg-green-dark"
                    >
                      Manage Products
                    </button>
                    <button 
                      onClick={() => setShowAdminModal(true)}
                      className="rounded-lg bg-gold px-6 py-2 text-sm font-bold text-white hover:bg-gold-light"
                    >
                      + Add New Order
                    </button>
                  </div>
                </div>

              {orders.length === 0 ? (
                <p className="mt-8 text-center text-text-muted italic">No orders found.</p>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gold/20 text-terra">
                        <th className="pb-4 pr-4">Date</th>
                        <th className="pb-4 pr-4">Customer</th>
                        <th className="pb-4 pr-4">Products</th>
                        <th className="pb-4 pr-4">Status</th>
                        <th className="pb-4 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(order => 
                          (order.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
                          (order.customerPhone?.includes(orderSearchQuery))
                        )
                        .map((order) => (
                        <tr key={order.id} className="border-b border-gold/10 hover:bg-cream-dark transition-colors">
                          <td className="py-4 pr-4">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Pending...'}
                          </td>
                          <td className="py-4 pr-4">
                            <div className="font-bold">{order.customerName}</div>
                            <div className="text-xs text-text-muted">{order.customerPhone}</div>
                            <div className="text-xs text-text-muted">{order.customerCity}</div>
                            <div className="mt-1 text-[10px] font-medium text-gold uppercase tracking-wider">{order.orderType}</div>
                          </td>
                          <td className="py-4 pr-4 max-w-sm">
                            <div className="line-clamp-2 text-xs" title={order.products}>{order.products}</div>
                          </td>
                          <td className="py-4 pr-4">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${
                                order.status === 'delivered' ? 'bg-green/10 text-green border-green' : 
                                order.status === 'confirmed' ? 'bg-blue-600/10 text-blue-600 border-blue-600' : 
                                'bg-gold/10 text-terra border-gold'
                              }`}
                            >
                              <option value="pending" className="bg-white text-terra">Pending</option>
                              <option value="confirmed" className="bg-white text-blue-600">Confirmed</option>
                              <option value="delivered" className="bg-white text-green">Delivered</option>
                            </select>
                          </td>
                          <td className="py-4 pr-4">
                            <button 
                              onClick={() => deleteOrder(order.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Order"
                            >
                              <LogOut size={16} className="rotate-180" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Admin Add Order Modal */}
          <AnimatePresence>
            {showAdminModal && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAdminModal(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
                >
                  <button 
                    onClick={() => setShowAdminModal(false)}
                    className="absolute right-4 top-4 text-text-muted hover:text-text"
                  >
                    <X size={24} />
                  </button>
                  <h3 className="text-2xl font-bold text-green">Add New Order (Admin)</h3>
                  <div className="mt-6 space-y-4">
                    <input 
                      type="text" 
                      placeholder="Customer Name *" 
                      value={adminOrderData.name}
                      onChange={(e) => setAdminOrderData({...adminOrderData, name: e.target.value})}
                      className="w-full rounded-lg border border-gold/40 p-3 outline-none focus:border-green" 
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number *" 
                      value={adminOrderData.phone}
                      onChange={(e) => setAdminOrderData({...adminOrderData, phone: e.target.value})}
                      className="w-full rounded-lg border border-gold/40 p-3 outline-none focus:border-green" 
                    />
                    <input 
                      type="text" 
                      placeholder="City / Village" 
                      value={adminOrderData.city}
                      onChange={(e) => setAdminOrderData({...adminOrderData, city: e.target.value})}
                      className="w-full rounded-lg border border-gold/40 p-3 outline-none focus:border-green" 
                    />
                    <textarea 
                      placeholder="Products *" 
                      rows={3} 
                      value={adminOrderData.products}
                      onChange={(e) => setAdminOrderData({...adminOrderData, products: e.target.value})}
                      className="w-full rounded-lg border border-gold/40 p-3 outline-none focus:border-green"
                    ></textarea>
                    <select 
                      value={adminOrderData.type}
                      onChange={(e) => setAdminOrderData({...adminOrderData, type: e.target.value})}
                      className="w-full rounded-lg border border-gold/40 p-3 outline-none focus:border-green"
                    >
                      <option>Regular Order</option>
                      <option>Bulk / Wholesale</option>
                      <option>Corporate Gift Hamper</option>
                      <option>General Enquiry</option>
                    </select>
                    <button 
                      onClick={submitAdminOrder}
                      className="w-full rounded-lg bg-green py-4 font-bold text-white hover:bg-green-dark"
                    >
                      Create Order
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-gold bg-green-dark px-4 py-16 text-[#F5ECD7] md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Logo className="h-10" />
            <p className="mt-2 text-lg text-gold" lang="gu">પંચામૃત</p>
            <p className="mt-4 italic text-[#A8D5B0]">"No Oil. All Soul."</p>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              No Preservatives. No Colour. Pure Saurashtra. Handmade by the rural women of Saurashtra cluster.
            </p>
            <div className="mt-6 flex gap-4">
              <div className="flex items-center gap-1 text-xs"><Leaf size={14} /> Organic</div>
              <div className="flex items-center gap-1 text-xs"><Ban size={14} /> No Chemicals</div>
              <div className="flex items-center gap-1 text-xs"><Wheat size={14} /> Farm-Made</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#A8D5B0]">Quick Links</h4>
            <nav className="mt-6 flex flex-col gap-3">
              {['Products', 'Stories', 'Hampers', 'About', 'Order'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-sm transition-colors hover:text-gold hover:underline">
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#A8D5B0]">Contact & Order</h4>
            <div className="mt-6 space-y-4 text-sm">
              <p className="flex items-center gap-3"><Phone size={18} className="text-gold" /> +91-63546-91873</p>
              <p className="flex items-center gap-3"><Phone size={18} className="text-gold" /> +91-98251-97958</p>
              <p className="flex items-center gap-3"><Mail size={18} className="text-gold" /> panchamrut@mahidadfpc.com</p>
              <p className="flex items-center gap-3"><Instagram size={18} className="text-gold" /> @panchamrut_official</p>
              <p className="flex items-center gap-3"><MapPin size={18} className="text-gold" /> Saurashtra, Gujarat</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-8 text-center text-[10px] uppercase tracking-widest text-[#90C8A8]">
          <p>© 2026 Mahidad Farmer Producing Company, Saurashtra | Project Aarohan, CEE Ahmedabad | Built with 🌿 for the women of Saurashtra</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Panchamrut Organic', url: window.location.href });
            }
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-green text-white shadow-lg"
        >
          <Share2 size={20} />
        </motion.button>
        
        <div className="group relative">
          <div className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded bg-text px-2 py-1 text-[10px] text-white group-hover:block">
            Order on WhatsApp
          </div>
          <motion.button 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWhatsAppOrder('Products')}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl"
          >
            <MessageCircle size={28} />
          </motion.button>
        </div>
      </div>

      {/* Image Zoom Modal (Lightbox) */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl"
            onClick={() => setZoomedImage(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-6 top-6 z-[10001] rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImage(null);
              }}
            >
              <X size={32} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white/5 p-2 shadow-[0_0_50px_rgba(212,160,23,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={zoomedImage} 
                alt="Zoomed Product" 
                className="h-full max-h-[85vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIChatAssistant language={language} />
      
      {showProductManager && (
        <AdminProductManager onClose={() => setShowProductManager(false)} />
      )}

      {/* Persistent Admin Floating Bar */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[3000] flex flex-col gap-3"
          >
            <div className="bg-white/95 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gold/30 flex flex-col gap-3 min-w-[260px]">
              <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Administrator</span>
                <div className="h-2 w-2 rounded-full bg-green animate-pulse"></div>
              </div>
              
              <button 
                onClick={async () => {
                  try {
                    window.sessionStorage.removeItem('syncDone');
                    setIsProductsLoaded(false);
                    // Import inside the handler to be safe
                    const { getDocs, collection, doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
                    const snapshot = await getDocs(collection(db, 'products'));
                    
                    let updated = 0;
                    for (const p of PRODUCTS) {
                      const matches = snapshot.docs.filter(d => 
                        (d.data().name || '').toLowerCase().trim() === p.name.toLowerCase().trim()
                      );
                      for (const m of matches) {
                        await updateDoc(doc(db, 'products', m.id), {
                          image: p.image,
                          updatedAt: serverTimestamp()
                        });
                        updated++;
                      }
                    }
                    alert(`✅ Image Fix Applied!\nUpdated ${updated} items.`);
                  } catch (err) {
                    console.error(err);
                    alert("Fix failed. Check console.");
                  } finally {
                    setIsProductsLoaded(true);
                  }
                }}
                className="group relative flex items-center gap-3 bg-terra text-white px-6 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-terra/20"
              >
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>APPLY IMAGE FIX NOW</span>
              </button>

              <button 
                onClick={() => setShowProductManager(true)}
                className="flex items-center gap-3 bg-green text-white px-6 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green/20"
              >
                <Settings size={22} />
                <span>Manage All Products</span>
              </button>

              <button 
                onClick={() => setShowAdminModal(true)}
                className="flex items-center gap-3 bg-gold text-white px-6 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-gold/20"
              >
                <Plus size={22} />
                <span>Add New Order</span>
              </button>

              <button 
                onClick={() => setIsAdmin(false)}
                className="text-xs text-gray-400 font-medium hover:text-terra transition-colors"
              >
                Exit Admin Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
