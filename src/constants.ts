export interface Product {
  id: number;
  name: string;
  gujarati: string;
  hindi: string;
  category: string;
  price: number;
  weight: string;
  badge: string;
  benefit: string;
  desc: string;
  imgColor: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  // PICKLES & PRESERVES
  { id:1, name:"Date & Lime Pickle", gujarati:"ખજૂર-લીંબુ અથાણું", hindi:"खजूर-नींबू का अचार", category:"pickles", price:250, weight:"500g", badge:"Bestseller",
    benefit:"Non-oil based. Fresh lime, dates, jaggery. No preservatives.",
    desc:"Fresh lime juice, dates, sugar, jaggery, red chilli powder, achar masala. Traditional recipe. Non-oil based — our most distinctive product.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/fzVKD4Wr/Chat-GPT-Image-May-22-2026-06-44-16-PM.png" },
  { id:2, name:"Mango Pickle", gujarati:"કેરીનું અથાણું", hindi:"आम का अचार", category:"pickles", price:150, weight:"500g", badge:"",
    benefit:"Traditional stone-ground spices. No oil, no preservatives.",
    desc:"Saurashtra-style mango pickle. Stone-ground homemade spices. Absolutely no artificial colour or preservative.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/Zw9QGX6/mango-pickle.png" },
  { id:3, name:"Gum Berry Pickle", gujarati:"કરવંડ અથાણું", hindi:"કરૌંદા का अचार", category:"pickles", price:150, weight:"500g", badge:"",
    benefit:"Wild-harvested gum berries. Tangy and spicy.",
    desc:"Wild karwand (gum berries) hand-picked from village forests. Tangy-spicy taste unique to Saurashtra.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/bRzLW9Nh/Easy-Bharela-Gunda-nu-Athanu-Gum-Berry-Pickle-from-Gujarat-Recipe-Ranveer-Br.jpg" },
  { id:4, name:"Chili Pickle", gujarati:"મરચું અથાણું", hindi:"मिर्च का अचार", category:"pickles", price:150, weight:"500g", badge:"",
    benefit:"Whole green chillies. Mustard seeds, rock salt.",
    desc:"Whole green chillies, mustard seeds, organic cold-pressed oil, rock salt. Bold and authentic.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/0p1dcrG7/Easy-Red-Chili-Pickle-Recipe-I-Laal-Mirch-Ka-Achar-Recipe.jpg" },
  { id:5, name:"Carrot Pickle", gujarati:"ગાજર અથાણું", hindi:"ગાજર કા અચાર", category:"pickles", price:150, weight:"500g", badge:"",
    benefit:"Fresh farm carrots. Homemade spice blend.",
    desc:"Fresh farm-grown carrots, homemade spice blend. No artificial colour. Crunchy and tangy.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/0pvqQH3L/carrot-pickle.png" },
  { id:6, name:"Bijora Pickle", gujarati:"બીજોરા અથાણું", hindi:"બીજોરા કા અચાર", category:"pickles", price:200, weight:"500g", badge:"",
    benefit:"Rare citron pickle. Sweet-sour-spicy Saurashtra specialty.",
    desc:"Bijora (citron) pickle — a rare Saurashtra specialty. Sweet, sour, and spicy all at once. Seasonal availability.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/N6qwP8J0/bijora-pickle.png" },
  // DRINKS & JUICES
  { id:7, name:"Panchamrut Lemon-Ginger Juice", gujarati:"લીંબુ-આદું જ્યૂસ", hindi:"नींबू-अदरक का रस", category:"drinks", price:200, weight:"700ml", badge:"All Season",
    benefit:"For cocktail, mocktail, sharbat. 1-year shelf life.",
    desc:"Lemon and ginger concentrate. No added sugar, no colour. Use for cocktail, mocktail, sharbat, or health drink. 1-year shelf life.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/nMvnsSzM/Chat-GPT-Image-May-25-2026-10-48-17-AM.png" },
  { id:8, name:"Findala Pulp with Stevia", gujarati:"ફિંડાળા પલ્પ", hindi:"ફિંડાલા પલ્પ", category:"drinks", price:400, weight:"750ml", badge:"Medicinal",
    benefit:"Improves haemoglobin. Digestive support. Immunity booster.",
    desc:"Prickly pear pulp with natural stevia. Improves haemoglobin and red blood cells. Digestive support, sugar control. Rich in Vitamin C, B6, Potassium, Magnesium. Recommended by patients for natural health support.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/35GrrgbS/Chat-GPT-Image-Jun-4-2026-12-16-43-PM.png" },
  // MASALAS & SPICES
  { id:9, name:"Chaas Masala", gujarati:"છાસ મસાલો", hindi:"छाछ मसाला", category:"masalas", price:30, weight:"50g", badge:"",
    benefit:"For buttermilk and cooking. Herbal blend.",
    desc:"Coriander-cumin powder, drumstick leaf powder, mint leaf powder, black salt, rock salt. Perfect for chaas (buttermilk) and as a food spice.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/jZgNzdJQ/Chat-GPT-Image-May-22-2026-06-40-33-PM.png" },
  { id:10, name:"Chai Masala", gujarati:"ચા મસાલો", hindi:"चाय मसाला", category:"masalas", price:70, weight:"50g", badge:"",
    benefit:"Hand-pounded cardamom, ginger, cloves, cinnamon.",
    desc:"Hand-pounded cardamom, dry ginger, cloves, cinnamon. For the perfect Gujarati chai. Rich aroma, no fillers.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/mVJpMyBn/chai-masala.png" },
  { id:11, name:"Milk Masala", gujarati:"દૂધ મસાલો", hindi:"दूध मसाला", category:"masalas", price:100, weight:"50g", badge:"",
    benefit:"Saffron, almond, cardamom. Nutritious milk enhancer.",
    desc:"Saffron, almond, cardamom blend for hot milk. Traditional nutritional drink for children and adults. No artificial flavours.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/d0rFg8R0/milk-masal.png" },
  { id:12, name:"Chilli Powder", gujarati:"લાલ મરચું", hindi:"लाल मिर्च पाउडर", category:"masalas", price:350, weight:"1kg", badge:"",
    benefit:"Pure Saurashtra red chilli. Stone-ground. No adulteration.",
    desc:"Single-origin Saurashtra red chilli, stone-ground without any additives. Bright colour from the chilli itself — no added colour.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/2YfF8MgD/6eb44b910adc414ed4c7a336b044aeca.jpg" },
  { id:13, name:"Turmeric Powder", gujarati:"હળદર", hindi:"हल्दी पाउडर", category:"masalas", price:300, weight:"1kg", badge:"",
    benefit:"Farm-grown organic haldi. High curcumin content.",
    desc:"Farm-grown organic turmeric, sun-dried and stone-ground. Deep yellow — the colour is natural, not enhanced. High curcumin content.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/V0fgVX3H/turmeric-powder.png" },
  { id:14, name:"Dhaniya Powder", gujarati:"ધાણા પાઉડર", hindi:"धनिया पाउडर", category:"masalas", price:250, weight:"1kg", badge:"",
    benefit:"Sun-dried coriander seeds. Cold-stone ground.",
    desc:"Sun-dried coriander seeds from village farms, cold-stone ground. No filler, no mixing. Pure dhaniya flavour.",
    imgColor:"#F5F5F0", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800" },
  // HEALTH & WELLNESS
  { id:15, name:"Moringa Powder", gujarati:"મોરિંગા પાઉડર", hindi:"मोरिंगा पाउडर", category:"wellness", price:100, weight:"100g", badge:"Superfood",
    benefit:"Reduces joint pain. Blood sugar balance. Brain booster.",
    desc:"Pure drumstick (moringa) leaf powder. Reduces bone and joint pain. Supports digestion, blood sugar balance, and brain function. No chemicals, no mixing. Pure leaf.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/7M6c64t/moringa-b.png" },
  { id:16, name:"Palash Flower", gujarati:"પલાશ ફૂલ", hindi:"પલાશ કે ફૂલ", category:"wellness", price:100, weight:"100g", badge:"",
    benefit:"Ayurvedic. Body heat relief. Traditional skin care.",
    desc:"Dried Flame of the Forest (Palash) flowers. Traditional Ayurvedic use for body heat relief, bathing, and skin care. Collected seasonally from village forests.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/LD8TrRcn/Chat-GPT-Image-May-25-2026-10-09-07-AM.png" },
  { id:17, name:"Herbal Toothpowder", gujarati:"હર્બલ ટૂથ પાઉડર", hindi:"હર્બલ ટૂથ પાઉડર", category:"wellness", price:100, weight:"50g", badge:"",
    benefit:"Menthol, rock salt, babul, camphor. Natural dental care.",
    desc:"Traditional herbal toothpowder. Menthol, rock salt, babul (acacia bark), camphor. No fluoride, no synthetic chemicals. Strengthens gums naturally.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/jkWV3sTV/Chat-GPT-Image-May-25-2026-10-40-18-AM.png" },
  // FOOD & GRAINS
  { id:18, name:"Saat Dhan Khichdo", gujarati:"સાત ધાન ખીચડો", hindi:"સાત ધાન ખીચડો", category:"grains", price:40, weight:"200g", badge:"",
    benefit:"Seven grains and pulses. Nutritious one-pot meal.",
    desc:"Seven types of grains and pulses: jowar, wheat, rice, mung, matha, kalthi, choli, gram. Soak 1-2 hours in water, add vegetables and cook. Complete nutrition in one bowl.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/DfLGmSLk/a559760af4ece46074f90a7c9a21d5da.jpg" },
  { id:19, name:"Drumstick Khakhra", gujarati:"સહજન ખાખરા", hindi:"સહજન ખાખરા", category:"grains", price:50, weight:"200g", badge:"",
    benefit:"Moringa leaf khakhra. Crispy and nutritious.",
    desc:"Traditional Gujarati khakhra made with drumstick (moringa) leaf. Crispy, nutritious, and delicious. Perfect with chaas and pickle.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/MxtFPXbP/khakra-2.png" },
  { id:20, name:"Masala Khakhra", gujarati:"મસાલા ખાખરા", hindi:"મસાલા ખાખરા", category:"grains", price:50, weight:"200g", badge:"",
    benefit:"Spiced crispy khakhra. Traditional Gujarati snack.",
    desc:"Spiced crispy khakhra with homemade masala blend. Traditional Gujarati snack. Goes perfectly with tea, chaas, or pickle.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/mrMWgVkt/khakra-photo.png" },
  { id:21, name:"Sesame & Fennel Refreshments", gujarati:"તલ-વરિયાળી મુખવાસ", hindi:"તલ-વરિયાળી મુખવાસ", category:"grains", price:50, weight:"100g", badge:"",
    benefit:"Traditional post-meal mouth freshener. Digestive.",
    desc:"Traditional Gujarati mukhwas (mouth freshener) with sesame, fennel, and herbs. A digestive aid and palate cleanser after meals.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/JFGjSSm8/77780665076b17ee5d07106d8259a43f.jpg" },
  { id:22, name:"Mix Fruit Jam", gujarati:"મિક્સ ફ્રૂટ જામ", hindi:"મિક્સ ફ્રૂટ જામ", category:"grains", price:200, weight:"500g", badge:"",
    benefit:"Seasonal mixed fruit. No artificial pectin. No preservatives.",
    desc:"Seasonal mixed fruit jam made with fresh fruits, sugar, and citric acid. No artificial colour, no preservatives, no pectin. Pure fruit taste.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/Q3wVs1Yx/Chat-GPT-Image-May-22-2026-06-47-08-PM.png" },
  // RELIGIOUS ITEMS
  { id:23, name:"Cow Ghee", gujarati:"ગાય ઘી", hindi:"ગાય કા ઘી", category:"religious", price:700, weight:"1kg", badge:"",
    benefit:"Desi cow ghee. Traditional bilona method.",
    desc:"Pure A2 desi cow ghee from village farms, made using the traditional bilona (hand-churned) method. Rich yellow colour, pure aroma.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/Ng2JqkBw/cow-ghee.png" },
  { id:25, name:"Cotton Divot (Diya Batti)", gujarati:"કોટન દિવો", hindi:"કોટન દિવો", category:"religious", price:25, weight:"55-80g", badge:"Seasonal",
    benefit:"Hand-rolled cotton wicks for diyas. Pure and clean-burning.",
    desc:"Hand-rolled pure cotton wicks for oil diyas. Perfect for daily pooja and Diwali. Clean-burning, no smoke. Seasonal peak during Diwali.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/5WkQrxsL/Chat-GPT-Image-Jun-4-2026-10-41-29-AM.png" },
  { id:26, name:"Cow Dung Tikki", gujarati:"ગોબર ટિક્કી", hindi:"ગોબર ટિક્કી", category:"religious", price:50, weight:"8 pcs", badge:"",
    benefit:"Natural mosquito repellent. Household fumigation. Zero chemicals.",
    desc:"8 pieces of dried cow dung discs. Traditional natural mosquito repellent and household fumigation. Eco-friendly, zero chemicals, zero plastic.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/PG5JvMxd/Chat-GPT-Image-May-21-2026-03-15-15-PM.png" },
  // ECO PRODUCTS
  { id:27, name:"Natural Loofah Scrubber", gujarati:"લૂફા સ્ક્રબર", hindi:"લૂફા સ્ક્રબર", category:"eco", price:55, weight:"1 piece", badge:"",
    benefit:"100% biodegradable. Kitchen and bath. Plastic-free.",
    desc:"Natural sponge gourd (turai) loofah scrubber. Completely biodegradable, zero plastic. Works for kitchen dishes, bathing, and skin exfoliation. Grown in village farms.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/0jhSJRdB/Chat-GPT-Image-Jun-4-2026-10-42-06-AM.png" },
  { id:28, name:"Natural Holi Colour", gujarati:"કુદરતી હોળી રંગ", hindi:"કુદરતી હોળી રંગ", category:"eco", price:50, weight:"100g", badge:"Seasonal",
    benefit:"Chemical-free. Made from flowers and organic pigments. Skin-safe.",
    desc:"Chemical-free Holi colour made from natural flowers, turmeric, and plant-based pigments. Safe for skin and eyes. Safe for children. Seasonal — available February-March.",
    imgColor:"#F5F5F0", image: "https://i.ibb.co/KkNP9tf/Chat-GPT-Image-Jun-4-2026-10-41-14-AM.png" }
];

export interface Story {
  id: number;
  name: string;
  village: string;
  makes: string;
  quote: string;
  storyText: string;
  products: string[];
  sareeColor: string;
  image: string;
}

export const STORIES: Story[] = [
  {
    id: 1,
    name: "Ranjana Gabu",
    village: "Jasdan",
    makes: "Wild products, organic khat, moringa powder",
    quote: "I grow everything near my farm. What the farm gives, I make into something useful.",
    storyText: "Ranjana manages a family alongside running her enterprise for two years under the Panchamrut umbrella. She grows moringa, collects organic river soil for khat (organic manure), makes natural Holi colours, and teaches other women in her village. Featured on Akashwani radio for her organic work, she sells khat on WhatsApp to kitchen gardeners across Gujarat. She plans to expand into herbal soaps. Her dream is to build a training centre where more women from the village can learn and earn together.",
    products: ["Moringa Powder", "Natural Holi Colour", "Loofah"],
    sareeColor: "#E05C2A",
    image: "https://i.ibb.co/BVcpy2y7/download-3.jpg"
  },
  {
    id: 2,
    name: "Varsha Rathore",
    village: "Jasdan",
    makes: "Soaps, pickles, moringa, juices",
    quote: "Education gave me confidence. My products give me independence.",
    storyText: "Educated and working before marriage, Varsha returned home due to family responsibilities — but never stopped growing. Today she runs a thriving multi-product enterprise: soaps from kesada, chandana and neem, urad dal products, pickles, and juices. A 20 kg pickle order? She fulfils it in 3-4 days. She delivers to urban customers directly at Rs 40-50 per order and participates in the Sahajeevan Food Festival. She is building something bigger than a business — she is building a future.",
    products: ["Date-Lime Pickle", "Herbal Toothpowder", "Palash Flower"],
    sareeColor: "#2D5A3D",
    image: "https://i.ibb.co/vxjFqzs2/download-1.jpg"
  },
  {
    id: 3,
    name: "Hitesh & Shilpa",
    village: "Jasdan Cluster",
    makes: "172 indigenous organic seeds, solar-dried vegetables",
    quote: "Our seeds have survived generations. They will survive the future too.",
    storyText: "For four years, Hitesh and Shilpa have cultivated 172 varieties of indigenous organic seeds — medicinal, vegetables, flowers, millets, and pulses — on their prepared 1-bigha land. Government-recognised for their organic farming work, they sell through melas, Instagram, and their own YouTube channel. Their solar dryer produces dried millets, turmeric, carrot, and chilli powder year-round. Chemical seeds fail in climate change. Desi seeds do not. That is their mission.",
    products: ["Chilli Powder", "Turmeric Powder", "Moringa Powder"],
    sareeColor: "#1A4A8B",
    image: "https://i.ibb.co/BKvW3pf4/Paddy-Cultivation.jpg"
  },
  {
    id: 4,
    name: "Meena Ben",
    village: "Kalawad",
    makes: "Khakhra, chaas masala, mukhwas",
    quote: "When an order comes from Ahmedabad, my whole family celebrates with me.",
    storyText: "Meena has been making khakhra for over a decade — long before Panchamrut existed. She learned the craft from her mother-in-law and perfected ten variants: drumstick, methi, masala, and more. Today her khakhra unit produces consistently every season as part of a women's collective. She trains new women who join the group and takes personal pride in every packet that leaves Kalawad.",
    products: ["Masala Khakhra", "Drumstick Khakhra", "Chaas Masala"],
    sareeColor: "#D4A017",
    image: "https://i.ibb.co/HQzcyzZ/Rural-Indian-culture.jpg"
  },
  {
    id: 5,
    name: "Savita Ben",
    village: "Jasdan",
    makes: "Mix fruit jam, palash flower, natural colours",
    quote: "Nature gives us everything. We just give it a little love and pass it on.",
    storyText: "Savita collects palash flowers during the forest season, dries them carefully, and prepares the traditional Ayurvedic product. She makes mix fruit jam from whatever is in season — mango, amla, mixed berry. Her natural Holi colours are completely chemical-free. Every year, children across the village look forward to celebrating Holi with Savita's safe colours. She is a core member of the Panchamrut women's collective.",
    products: ["Mix Fruit Jam", "Palash Flower", "Natural Holi Colour"],
    sareeColor: "#6A2E8A",
    image: "https://i.ibb.co/99GyNkDh/Indian-Rajasthani-woman-cooking-food-roti-bread.jpg"
  }
];

export const TRANSLATIONS: any = {
  en: {
    nav: ['Home', 'Products', 'Stories', 'Hampers', 'Order'],
    hero: {
      location: "🌿 From Saurashtra",
      tagline: "\"No Oil. All Soul.\"",
      desc: "100% natural products made by rural women of Saurashtra — no preservatives, no chemicals, no shortcuts. From our farms to your home.",
      shop: "Shop Products",
      stories: "Our Stories"
    },
    products: {
      title: "Our Pure Products",
      subtitle: "અમારી શુદ્ધ પેદાશો",
      search: "Search products...",
      all: "All",
      pickles: "Pickles",
      drinks: "Drinks",
      masalas: "Masalas",
      wellness: "Wellness",
      grains: "Grains",
      religious: "Religious",
      eco: "Eco",
      order: "Order on WhatsApp",
      organic: "🌿 100% ORGANIC"
    },
    stories: {
      title: "The Hands That Make It",
      subtitle: "આ હાથ જ અમારી શક્તિ છે",
      desc: "Every jar, every packet, every product from Panchamrut carries the pride and skill of a woman from the villages of Saurashtra. These are their stories.",
      village: "Village"
    },
    hampers: {
      title: "Panchamrut Gift Hampers",
      subtitle: "Straight from Saurashtra — perfect for Diwali, weddings & corporate gifting"
    },
    order: {
      title: "Place Your Order",
      subtitle: "તમારો ઓર્ડર આપો",
      desc: "Fill the form below or message us directly on WhatsApp to order your favorite organic products.",
      name: "Your Name",
      phone: "Phone Number",
      city: "City",
      products: "Products you want to order",
      type: "Order Type",
      regular: "Regular Order",
      hamper: "Gift Hamper",
      bulk: "Bulk/Corporate",
      submit: "Send Order Request",
      whatsapp: "Chat on WhatsApp"
    }
  },
  gu: {
    nav: ['હોમ', 'પ્રોડક્ટ્સ', 'વાર્તાઓ', 'હેમ્પર્સ', 'ઓર્ડર'],
    hero: {
      location: "🌿 સૌરાષ્ટ્રથી",
      tagline: "\"તેલ વગરનું. શુદ્ધ આત્માથી.\"",
      desc: "સૌરાષ્ટ્રની ગ્રામીણ મહિલાઓ દ્વારા બનાવવામાં આવેલી ૧૦૦% કુદરતી પ્રોડક્ટ્સ — કોઈ પ્રિઝર્વેટિવ્સ નહીં, કોઈ કેમિકલ્સ નહીં. અમારા ખેતરોથી તમારા ઘર સુધી.",
      shop: "પ્રોડક્ટ્સ જુઓ",
      stories: "અમારી વાર્તાઓ"
    },
    products: {
      title: "અમારી શુદ્ધ પ્રોડક્ટ્સ",
      subtitle: "અમારી શુદ્ધ પેદાશો",
      search: "પ્રોડક્ટ શોધો...",
      all: "બધા",
      pickles: "અથાણાં",
      drinks: "પીણાં",
      masalas: "મસાલા",
      wellness: "વેલનેસ",
      grains: "અનાજ",
      religious: "ધાર્મિક",
      eco: "ઇકો",
      order: "વોટ્સએપ પર ઓર્ડર કરો",
      organic: "🌿 ૧૦૦% ઓર્ગેનિક"
    },
    stories: {
      title: "બનાવનાર હાથો",
      subtitle: "આ હાથ જ અમારી શક્તિ છે",
      desc: "પંચામૃતની દરેક બરણી, દરેક પેકેટ અને દરેક પ્રોડક્ટમાં સૌરાષ્ટ્રના ગામડાઓની મહિલાઓનું ગૌરવ અને કૌશલ્ય છે. આ તેમની વાર્તાઓ છે.",
      village: "ગામ"
    },
    hampers: {
      title: "પંચામૃત ગિફ્ટ હેમ્પર્સ",
      subtitle: "સીધું સૌરાષ્ટ્રથી — દિવાળી, લગ્ન અને કોર્પોરેટ ગિફ્ટિંગ માટે શ્રેષ્ઠ"
    },
    order: {
      title: "તમારો ઓર્ડર આપો",
      subtitle: "તમારો ઓર્ડર આપો",
      desc: "તમારી મનપસંદ ઓર્ગેનિક પ્રોડક્ટ્સનો ઓર્ડર આપવા માટે નીચેનું ફોર્મ ભરો અથવા અમને સીધા વોટ્સએપ પર મેસેજ કરો.",
      name: "તમારું નામ",
      phone: "ફોન નંબર",
      city: "શહેર",
      products: "તમે જે પ્રોડક્ટ્સ ઓર્ડર કરવા માંગો છો",
      type: "ઓર્ડરનો પ્રકાર",
      regular: "સામાન્ય ઓર્ડર",
      hamper: "ગિફ્ટ હેમ્પર",
      bulk: "બલ્ક/કોર્પોરેટ",
      submit: "ઓર્ડર વિનંતી મોકલો",
      whatsapp: "વોટ્સએપ પર ચેટ કરો"
    }
  },
  hi: {
    nav: ['होम', 'उत्पाद', 'कहानियां', 'हैम्पर्स', 'ऑर्डर'],
    hero: {
      location: "🌿 सौराष्ट्र से",
      tagline: "\"बिना तेल के। शुद्ध आत्मा से।\"",
      desc: "सौराष्ट्र की ग्रामीण महिलाओं द्वारा बनाए गए 100% प्राकृतिक उत्पाद — कोई संरक्षक नहीं, कोई रसायन नहीं। हमारे खेतों से आपके घर तक।",
      shop: "उत्पाद देखें",
      stories: "हमारी कहानियां"
    },
    products: {
      title: "हमारे शुद्ध उत्पाद",
      subtitle: "हमारे शुद्ध उपज",
      search: "उत्पाद खोजें...",
      all: "सभी",
      pickles: "अचार",
      drinks: "पेय",
      masalas: "मसाले",
      wellness: "वेलनेस",
      grains: "अनाज",
      religious: "धार्मिक",
      eco: "इको",
      order: "व्हाट्सएप पर ऑर्डर करें",
      organic: "🌿 100% ऑर्गेनिक"
    },
    stories: {
      title: "बनाने वाले हाथ",
      subtitle: "ये हाथ ही हमारी शक्ति हैं",
      desc: "पंचामृत का हर जार, हर पैकेट और हर उत्पाद सौराष्ट्र के गांवों की महिलाओं के गर्व और कौशल को दर्शाता है। ये उनकी कहानियां हैं।",
      village: "गांव"
    },
    hampers: {
      title: "पंचामृत गिफ्ट हैम्पर्स",
      subtitle: "सीधे सौराष्ट्र से — दिवाली, शादियों और कॉर्पोरेट उपहारों के लिए उपयुक्त"
    },
    order: {
      title: "अपना ऑर्डर दें",
      subtitle: "अपना ऑर्डर दें",
      desc: "अपने पसंदीदा जैविक उत्पादों को ऑर्डर करने के लिए नीचे दिया गया फॉर्म भरें या हमें सीधे व्हाट्सएप पर संदेश भेजें।",
      name: "आपका नाम",
      phone: "फ़ोन नंबर",
      city: "शहर",
      products: "उत्पाद जो आप ऑर्डर करना चाहते हैं",
      type: "Order का प्रकार",
      regular: "नियमित ऑर्डर",
      hamper: "ગિફ્ટ હેમ્પર્સ",
      bulk: "थोक/कॉर्पोरेट",
      submit: "ऑर्डर अनुरोध भेजें",
      whatsapp: "व्हाट्सएप पर चैट करें"
    }
  }
};
