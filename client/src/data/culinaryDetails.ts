import { MenuItem } from '../types';

export interface CulinaryInfo {
  ingredients: string[];
  preparationNotes: string;
  accompaniments: string;
  dietaryHighlights: string[];
  spiceLevel: 'Mild' | 'Mild-Medium' | 'Medium' | 'Medium-Spicy' | 'Spicy';
  energyTip?: string;
  portionSize?: string;
}

/**
 * Intelligent South Indian culinary knowledge engine.
 * Maps dish names and categories to accurate authentic ingredients,
 * preparation craftsmanship, accompaniments, and dietary highlights.
 */
export function getCulinaryDetails(item: MenuItem, categoryName?: string): CulinaryInfo {
  const name = item.name.toLowerCase();
  const slug = item.slug.toLowerCase();

  // 1. PLAIN DOSA & ROASTS
  if (slug.includes('plain-dosa') || name === 'plain dosa') {
    const isButter = name.includes('butter');
    const isPaper = name.includes('paper');
    return {
      ingredients: [
        'Aged Parboiled Rice (Sona Masoori)',
        'Whole White Urad Dal',
        'Fenugreek Seeds (Methi)',
        isButter ? 'Generous Pure Amul Butter' : 'Pure Vegetable Oil / Ghee',
        'Rock Salt (Sendha Namak)',
      ],
      preparationNotes:
        'Fermented naturally for 14 hours on traditional wet stone grinder. Spread paper-thin on seasoned cast-iron tawa and roasted till intensely golden and shattering-crisp.',
      accompaniments:
        'Served with piping hot drumstick-vegetable Sambar, freshly grated Coconut Chutney, and tangy roasted Tomato-Onion Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Naturally Fermented', 'Gluten-Free Batter', 'Probiotic Goodness'],
      spiceLevel: 'Mild',
      portionSize: isPaper ? 'Jumbo (Over 2.5 feet length)' : 'Standard Single Platter',
      energyTip: 'Light on the stomach, highly digestible, and naturally rich in slow-release complex carbs.',
    };
  }

  // 2. MASALA DOSA VARIETIES
  if (name.includes('masala dosa')) {
    const isButter = name.includes('butter');
    const isMysore = name.includes('mysore');
    const isPaneer = name.includes('paneer');
    const isRawa = name.includes('rawa');

    const ingredients = [
      isRawa ? 'Semolina (Sooji) & Rice Flour' : 'Naturally Fermented Rice & Urad Dal Batter',
      isPaneer ? 'Fresh Malai Cottage Cheese (Paneer)' : 'Boiled Mountain Potatoes (Aloo)',
      'Black Mustard Seeds & Curry Leaves',
      'Fresh Green Chillies & Chopped Ginger',
      'Turmeric, Cumin & Asafoetida (Hing)',
    ];

    if (isMysore) {
      ingredients.push('Fiery Garlic-Red Chilli Mysore Paste');
    }
    if (isButter) {
      ingredients.push('Pure Amul Butter Dollop');
    }

    return {
      ingredients,
      preparationNotes: isMysore
        ? 'Lined with spicy roasted red chilli-garlic paste and melted butter, folded over aromatic seasoned potato mash.'
        : 'Crisp golden crepe stuffed generously with traditional tempered potato mash infused with fresh curry leaves and mustard seeds.',
      accompaniments:
        'Accompanied by authentic South Indian drumstick Sambar, Fresh Coconut Chutney, and Spiced Tomato Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Signature Bestseller', 'No Artificial Food Colors', 'Made Fresh to Order'],
      spiceLevel: isMysore ? 'Medium-Spicy' : 'Medium',
      portionSize: 'Standard Full Platter',
      energyTip: 'Classic all-day South Indian staple providing balanced proteins, carbohydrates, and wholesome energy.',
    };
  }

  // 3. PANEER DOSA VARIETIES
  if (name.includes('paneer')) {
    return {
      ingredients: [
        'Naturally Fermented Rice & Lentil Batter',
        'Fresh Hand-Crumbled Malai Paneer',
        'Finely Diced Red Onions & Capsicum',
        'Roasted Cumin & Black Pepper',
        'Fresh Coriander Leaves & Green Chillies',
        'Pure Amul Butter / Desi Ghee',
      ],
      preparationNotes:
        'Fresh cottage cheese grated and lightly tossed with roasted cumin, green herbs, and mild spices, enveloped in a golden crispy crepe.',
      accompaniments:
        'Served with piping hot spiced vegetable Sambar, velvety Coconut Chutney, and zesty Tomato-Red Chilli Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'High Protein Rich', 'Fresh Malai Paneer', 'Zero Preservatives'],
      spiceLevel: 'Medium',
      portionSize: 'Hearty Full Meal Platter',
      energyTip: 'Power-packed with 16g+ of natural vegetarian dairy protein and wholesome calcium.',
    };
  }

  // 4. MYSORE DOSA VARIETIES
  if (name.includes('mysore')) {
    return {
      ingredients: [
        'Stone-Ground Fermented Dosa Batter',
        'Signature Mysore Red Chilli & Garlic Paste',
        'Chana Dal & Urad Dal Paste Layer',
        'Melted Butter / Pure Desi Ghee',
        'Spiced Potato-Onion Filling',
        'Fresh Curry Leaves & Mustard Seeds',
      ],
      preparationNotes:
        'The interior of the crepe is coated with a spicy, aromatic red chutney made from Byadagi chillies, garlic, and roasted lentils before roasting crisp with butter.',
      accompaniments:
        'Served with generous bowls of authentic drumstick vegetable Sambar, Fresh Coconut Chutney, and Tomato Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Authentic Karnataka Recipe', 'Rich & Savory', 'Fiery Signature Paste'],
      spiceLevel: 'Medium-Spicy',
      portionSize: 'Standard Full Platter',
      energyTip: 'The red chilli-garlic paste boosts metabolism and gives an unforgettable bold South Indian punch.',
    };
  }

  // 5. RAWA DOSA VARIETIES
  if (name.includes('rawa') || name.includes('rava')) {
    return {
      ingredients: [
        'Roasted Coarse Semolina (Sooji / Rawa)',
        'Fine Rice Flour & Maida Touch',
        'Crushed Whole Black Peppercorns',
        'Whole Cumin Seeds (Jeera)',
        'Fresh Chopped Ginger & Green Chillies',
        'Curry Leaves & Cashew Halves',
      ],
      preparationNotes:
        'Thin, watery batter poured in a splash onto an intensely heated skillet, forming a lacy, perforated net-like texture that cooks extra crisp.',
      accompaniments:
        'Served fresh off the tawa with aromatic hot vegetable Sambar, fresh Coconut Chutney, and tangy Tomato Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Extra Crunchy Lacey Texture', 'Digestive Cumin & Pepper', 'Made to Order'],
      spiceLevel: 'Medium',
      portionSize: 'Crisp Jumbo Platter',
      energyTip: 'Cumin seeds and cracked peppercorns promote natural digestion and soothe the digestive tract.',
    };
  }

  // 6. GHEE PODI & SPECIAL DOSAS
  if (name.includes('podi') || name.includes('ghee')) {
    return {
      ingredients: [
        'Fermented Rice & Lentil Batter',
        'Pure Desi Cow Ghee (Clarified Butter)',
        'Authentic Gunpowder (Milagai Podi)',
        'Roasted Chana Dal & Sesame Seeds',
        'Curry Leaves & Dry Red Chillies',
      ],
      preparationNotes:
        'Roasted slow and crisp with generous ladles of pure aromatic Desi Ghee, dusted heavily with hand-pounded Gunpowder spice blend.',
      accompaniments:
        'Served with traditional drumstick Sambar, velvety fresh Coconut Chutney, and Tomato-Onion Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Pure Desi Ghee', 'Handmade Podi Masala', 'Chef Signature Recipe'],
      spiceLevel: 'Medium-Spicy',
      portionSize: 'Standard Full Platter',
      energyTip: 'Pure Desi Ghee enhances nutrient absorption and delivers an unbeatable nostalgic aroma.',
    };
  }

  // 7. UTTAPPAM VARIETIES
  if (name.includes('uttappam') || name.includes('uttapam')) {
    return {
      ingredients: [
        'Thick Fermented Rice & Black Gram Batter',
        'Finely Diced Red Onions & Juicy Tomatoes',
        'Chopped Fresh Green Chillies & Coriander',
        name.includes('paneer') ? 'Fresh Crumbled Paneer' : 'Crisp Mixed Vegetables',
        'Pure Desi Ghee / Amul Butter',
      ],
      preparationNotes:
        'Poured thick and fluffy like a savory pancake. Fresh toppings are pressed into the moist batter before flipping to get caramelized edges.',
      accompaniments:
        'Accompanied by a large bowl of steaming hot Sambar, Coconut Chutney, and roasted Red Tomato Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Thick & Spongy', 'Packed with Fresh Veggies', 'Filling Comfort Food'],
      spiceLevel: 'Medium',
      portionSize: '1 Thick Jumbo Savory Pancake',
      energyTip: 'Wholesome fiber from fresh vegetables combined with easily digestible fermented batter.',
    };
  }

  // 8. IDLI VARIETIES
  if (name.includes('idli')) {
    const isPodi = name.includes('podi') || name.includes('ghee');
    return {
      ingredients: [
        'Parboiled Rice & Urad Gota (Skinless Black Gram)',
        'Fenugreek Seeds (Methi)',
        isPodi ? 'Pure Desi Ghee & Spicy Gunpowder Podi' : 'Pure Water & Rock Salt',
      ],
      preparationNotes: isPodi
        ? 'Pillow-soft steamed idlis tossed gently in hot melted Desi Ghee and generously coated in spicy Gunpowder podi.'
        : 'Steamed in traditional multi-tiered idli pots until exceptionally soft, fluffy, and cloud-like.',
      accompaniments:
        'Served with generous bowls of vegetable Sambar, freshly ground Coconut Chutney, and Tomato Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Zero Oil Steamed', 'Naturally Fermented', 'Super Healthy & Light'],
      spiceLevel: isPodi ? 'Medium-Spicy' : 'Mild',
      portionSize: '2 Pieces per Serving',
      energyTip: 'Steamed with zero added oil, high in bioavailable B-vitamins, and safe for all ages.',
    };
  }

  // 9. VADA VARIETIES
  if (name.includes('vada')) {
    const isDahi = name.includes('dahi');
    return {
      ingredients: [
        'Soaked & Ground Urad Dal (Black Gram)',
        'Cracked Black Peppercorns',
        'Minced Fresh Ginger & Curry Leaves',
        'A pinch of Hing (Asafoetida)',
        isDahi ? 'Chilled Creamy Whisked Curd & Sweet Chutney' : 'Refined High-Smoke Cooking Oil',
      ],
      preparationNotes: isDahi
        ? 'Golden crispy lentil donuts soaked in warm water then immersed in chilled, sweetened, spiced yogurt.'
        : 'Dough aerated by vigorous hand whisking then shaped into rings and fried golden-brown for a crunchy crust and fluffy center.',
      accompaniments: isDahi
        ? 'Garnished with roasted cumin powder, red chilli powder, sweet tamarind-date chutney, and fresh coriander.'
        : 'Served piping hot with aromatic Drumstick Sambar and thick Coconut Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Crunchy Outside, Cloud-Soft Inside', 'High Plant Protein', 'Traditional Snack'],
      spiceLevel: 'Mild',
      portionSize: '2 Pieces per Plate',
      energyTip: 'Rich in plant-based lentil protein and energized with digestive ginger and black pepper.',
    };
  }

  // 10. SOUTH INDIAN PLATTER / COMBO
  if (name.includes('platter') || name.includes('combo')) {
    return {
      ingredients: [
        '1 Soft Steamed Idli',
        '1 Crispy Medu Vada',
        '1 Mini Masala Dosa with Spiced Potato Mash',
        '1 Mini Onion Uttappam',
        'Piping Hot Drumstick Sambar',
        'Coconut Chutney & Tomato Chutney Duo',
      ],
      preparationNotes:
        'The ultimate South Indian sampler! Freshly cooked assortment giving you a taste of every iconic breakfast and dinner classic on a single royal plate.',
      accompaniments:
        'Served with unlimited hot vegetable Sambar, Fresh Coconut Chutney, and Tangy Tomato Chutney.',
      dietaryHighlights: ['100% Pure Veg', 'Complete Feast', 'All-In-One Tasting Platter', 'Customer Favorite'],
      spiceLevel: 'Medium',
      portionSize: 'Full Royal Assorted Platter (Feeds 1-2)',
      energyTip: 'Provides a complete spectrum of textures: steamed, crispy, crunchy, and savory in one wholesome meal.',
    };
  }

  // 11. RICE VARIETIES
  if (name.includes('rice') || (categoryName && categoryName.toLowerCase().includes('rice'))) {
    const isCurd = name.includes('curd');
    const isLemon = name.includes('lemon');
    const isTomato = name.includes('tomato');
    const isSambar = name.includes('sambar');

    return {
      ingredients: [
        'Aged Sona Masoori Rice',
        isCurd
          ? 'Fresh Whisked Thick Curd, Mustard Seeds, Pomegranate & Green Chillies'
          : isLemon
          ? 'Fresh Squeezed Lemon Juice, Roasted Peanuts, Turmeric & Curry Leaves'
          : isTomato
          ? 'Ripe Country Tomatoes, Shallots, South Indian Spices & Coriander'
          : 'Traditional Lentils, Drumstick, Mixed Vegetables & Sambar Powder',
        'Mustard Seeds, Urad Dal, Curry Leaves & Desi Ghee Tadka',
      ],
      preparationNotes:
        'Slow-cooked fragrant rice tempered with crackling mustard seeds, roasted dal, curry leaves, and fresh signature aromatics.',
      accompaniments: isCurd
        ? 'Served with traditional South Indian mango/lemon pickle and crispy papad.'
        : 'Accompanied by crunchy South Indian Appalam (Papad), pickle, and fresh raita.',
      dietaryHighlights: ['100% Pure Veg', 'Comfort Food Classic', 'Gut-Friendly & Nourishing', 'Authentic Recipe'],
      spiceLevel: isCurd ? 'Mild' : isSambar ? 'Medium' : 'Mild-Medium',
      portionSize: 'Generous 350g Meal Box',
      energyTip: 'Wholesome, soul-comforting home-style food that is gentle on digestion and instantly satisfying.',
    };
  }

  // 12. FILTER COFFEE & BEVERAGES
  if (name.includes('coffee') || name.includes('kaapi')) {
    return {
      ingredients: [
        '80:20 Roasted Plantation Arabica/Robusta & Chicory Blend',
        'Pure Brass Filter Slow-Dripped First Decoction',
        'Boiled Frothy Full-Cream Fresh Milk',
        'Refined Sugar / Jaggery as preferred',
      ],
      preparationNotes:
        'Slowly dripped through a traditional stainless steel / brass gravity filter to extract a thick, dark, aromatic first decoction, frothed by hand in a Davara and Tumbler.',
      accompaniments: 'Served steaming hot with thick natural froth in traditional South Indian style.',
      dietaryHighlights: ['100% Pure Veg', 'Freshly Brewed Decoction', 'Zero Instant Powder', 'Authentic Taste'],
      spiceLevel: 'Mild',
      portionSize: '150ml Traditional Davara Tumbler',
      energyTip: 'Rich in antioxidants and natural caffeine for an uplifting, aromatic morning or evening energy boost.',
    };
  }

  // DEFAULT / FALLBACK FOR ANY OTHER ITEM
  return {
    ingredients: [
      'Authentic South Indian Spices & Herbs',
      'Freshly Sourced Vegetables & Pulses',
      'Curry Leaves, Mustard Seeds & Hing',
      'Pure Vegetable Oil / Desi Ghee',
    ],
    preparationNotes:
      item.description ||
      'Prepared freshly with time-honored South Indian culinary methods using natural, wholesome ingredients without artificial additives.',
    accompaniments:
      'Served with traditional drumstick vegetable Sambar, Fresh Coconut Chutney, and Tangy Tomato Chutney.',
    dietaryHighlights: ['100% Pure Veg', 'Made Fresh Daily', 'Zero Preservatives', 'Authentic Taste'],
    spiceLevel: 'Medium',
    portionSize: 'Standard Single Platter',
    energyTip: 'Wholesome authentic flavors crafted to nourish and delight your palate.',
  };
}
