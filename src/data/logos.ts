/**
 * Logo walls, in the order they appear on the live homepage.
 * Every file is the authentic asset from www.voisetech.com/wp-content/uploads,
 * mirrored at the same path. Names were identified from the artwork where the
 * live site had no alt text.
 */
export type Logo = { name: string; src: string; width: number; height: number };

/** "Our Partners." — homepage. 30 logos; Dailyhunt appears once. */
export const partners: Logo[] = [
  { name: 'TV9 Network', src: '/wp-content/uploads/2025/09/TV9.png', width: 250, height: 135 },
  { name: 'Magnite', src: '/wp-content/uploads/2025/10/Magnite-logo1.png', width: 250, height: 135 },
  { name: 'fuboTV', src: '/wp-content/uploads/2025/09/fubo.png', width: 250, height: 135 },
  { name: 'XUMO', src: '/wp-content/uploads/2025/09/xumo.png', width: 250, height: 135 },
  { name: 'Asianet News', src: '/wp-content/uploads/2025/09/asianet.png', width: 250, height: 135 },
  { name: 'ABP Network', src: '/wp-content/uploads/2025/09/ABP.png', width: 250, height: 135 },
  { name: 'Network18', src: '/wp-content/uploads/2025/09/Network18.png', width: 250, height: 135 },
  { name: 'Times Now', src: '/wp-content/uploads/2025/09/timesnow.png', width: 250, height: 135 },
  { name: 'Paramount', src: '/wp-content/uploads/2026/05/paramount123.png', width: 625, height: 422 },
  { name: 'Al Jazeera', src: '/wp-content/uploads/2025/09/Aljazeera.png', width: 250, height: 135 },
  { name: 'ZEE5', src: '/wp-content/uploads/2025/09/Zee5.png', width: 250, height: 135 },
  { name: 'Dailyhunt', src: '/wp-content/uploads/2025/09/Dailyhunt.png', width: 250, height: 135 },
  { name: 'Sovrn', src: '/wp-content/uploads/2025/09/sovrn.png', width: 250, height: 135 },
  { name: 'NDTV', src: '/wp-content/uploads/2025/09/Ndtv.png', width: 250, height: 135 },
  { name: '33Across', src: '/wp-content/uploads/2025/09/33-across.png', width: 250, height: 135 },
  { name: 'APMC', src: '/wp-content/uploads/2026/02/4.png', width: 1250, height: 422 },
  { name: 'Dailymotion', src: '/wp-content/uploads/2026/02/1.png', width: 1250, height: 422 },
  { name: 'TapNation', src: '/wp-content/uploads/2026/02/3.png', width: 1250, height: 422 },
  { name: 'NeoTV+', src: '/wp-content/uploads/2026/02/nwotv.png', width: 1250, height: 422 },
  { name: 'MX Player', src: '/wp-content/uploads/2025/09/MXplayer-e1778228268952.png', width: 250, height: 105 },
  { name: 'Nexxen', src: '/wp-content/uploads/2025/09/nexen.png', width: 250, height: 135 },
  { name: 'InMobi', src: '/wp-content/uploads/2025/09/InMobi.png', width: 250, height: 135 },
  { name: 'PubMatic', src: '/wp-content/uploads/2025/09/Pubmatic.png', width: 250, height: 135 },
  { name: 'FreeWheel', src: '/wp-content/uploads/2025/09/Freewheel.png', width: 250, height: 135 },
  { name: 'Gulf News', src: '/wp-content/uploads/2026/02/2.png', width: 1250, height: 422 },
  { name: 'TCL', src: '/wp-content/uploads/2026/04/TCL.png', width: 400, height: 135 },
  { name: 'Adform', src: '/wp-content/uploads/2026/04/adform.png', width: 400, height: 135 },
  { name: 'Samsung Ads', src: '/wp-content/uploads/2026/04/samsung-ads-1.png', width: 400, height: 135 },
  { name: 'Runn TV', src: '/wp-content/uploads/2026/05/runntv1234-e1778228694894.png', width: 625, height: 325 },
  { name: 'Life360', src: '/wp-content/uploads/2026/09/Website-Logo-Square-e1789544141395.png', width: 370, height: 188 },
];

/** "Our Clients." — homepage. Each brand also has a case study. */
export const clients: Logo[] = [
  { name: 'Malaysia Airlines', src: '/wp-content/uploads/2025/09/1.jpg', width: 270, height: 150 },
  { name: 'Etihad Airways', src: '/wp-content/uploads/2025/09/2.jpg', width: 270, height: 150 },
  { name: 'Trip.com', src: '/wp-content/uploads/2025/09/3.jpg', width: 270, height: 150 },
  { name: 'Lenovo', src: '/wp-content/uploads/2025/09/4.jpg', width: 270, height: 150 },
  { name: 'LG', src: '/wp-content/uploads/2025/09/5.jpg', width: 270, height: 150 },
  { name: 'Samsung', src: '/wp-content/uploads/2025/09/6.jpg', width: 270, height: 150 },
  { name: 'Hyundai', src: '/wp-content/uploads/2025/09/7.jpg', width: 270, height: 150 },
  { name: 'Mahindra', src: '/wp-content/uploads/2025/09/8.jpg', width: 270, height: 150 },
  { name: 'Aditya Birla Group', src: '/wp-content/uploads/2025/09/9.jpg', width: 270, height: 150 },
  { name: 'ITC Limited', src: '/wp-content/uploads/2025/09/10.jpg', width: 270, height: 150 },
  { name: 'Flipkart', src: '/wp-content/uploads/2025/09/11.jpg', width: 270, height: 150 },
  { name: 'Malabar Gold & Diamonds', src: '/wp-content/uploads/2025/09/12.jpg', width: 270, height: 150 },
  { name: 'Swarovski', src: '/wp-content/uploads/2025/09/13.jpg', width: 270, height: 150 },
  { name: 'ICICI Bank', src: '/wp-content/uploads/2025/09/14.jpg', width: 270, height: 150 },
  { name: 'Axis Bank', src: '/wp-content/uploads/2025/09/15.jpg', width: 270, height: 150 },
  { name: 'Air France KLM', src: '/wp-content/uploads/2025/09/16.jpg', width: 270, height: 150 },
];

/** Footer: "Partnered With". */
export const memberships: Logo[] = [
  { name: 'IAB', src: '/wp-content/uploads/2025/09/IAB_logo2.svg', width: 51, height: 26 },
  { name: 'IAB UK', src: '/wp-content/uploads/2025/09/iab-uk2.svg', width: 79, height: 62 },
  { name: 'IAB member', src: '/wp-content/uploads/2025/09/IAB-1.svg', width: 56, height: 51 },
];

/** Footer: "Compliance and Trust Partners". */
export const trustPartners: Logo[] = [
  { name: 'HUMAN', src: '/wp-content/uploads/2025/10/compliance-icon-2.png', width: 700, height: 161 },
  { name: 'IAB Europe Transparency and Consent Framework', src: '/wp-content/uploads/2025/10/compliance-icon-3.png', width: 140, height: 43 },
  { name: 'TAG Registered', src: '/wp-content/uploads/2025/10/compliance-icon-4.png', width: 63, height: 62 },
];
