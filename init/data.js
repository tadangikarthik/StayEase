const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60"
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60"
    },
    price: 1200,
    location: "New York City",
    country: "United States",
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=60"
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60"
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60"
    },
    price: 800,
    location: "Portland",
    country: "United States",
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=60"
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
  },
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=60"
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=60"
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=60"
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
  },
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=60"
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
  },
  {
    title: "Charming Studio in Paris",
    description:
      "Fall in love with Paris from this cozy studio apartment located near the Eiffel Tower.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60"
    },
    price: 1800,
    location: "Paris",
    country: "France",
  },
  {
    title: "Desert Oasis Villa",
    description:
      "Relax in this luxurious villa with a private pool in the middle of the desert.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=60"
    },
    price: 3200,
    location: "Dubai",
    country: "United Arab Emirates",
  },
  {
    title: "Countryside Farmhouse",
    description:
      "Experience rustic living in this traditional farmhouse surrounded by lush fields.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=60"
    },
    price: 700,
    location: "Provence",
    country: "France",
  },
  {
    title: "Modern Houseboat",
    description:
      "Stay on the water in this stylish houseboat equipped with modern amenities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60"
    },
    price: 2200,
    location: "Amsterdam",
    country: "Netherlands",
  },
  {
    title: "Tropical Bungalow",
    description:
      "Stay in this open-air bungalow surrounded by palm trees and beaches.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60"
    },
    price: 1500,
    location: "Phuket",
    country: "Thailand",
  },
  {
    title: "Snowy Cabin Escape",
    description:
      "Warm up by the fireplace after a day in the snow at this cozy mountain cabin.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=60"
    },
    price: 1100,
    location: "Banff",
    country: "Canada",
  },
  {
    title: "Urban Apartment",
    description:
      "Modern apartment in the center of the city with all the conveniences nearby.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=60"
    },
    price: 1300,
    location: "Berlin",
    country: "Germany",
  },
  {
    title: "Clifftop Villa",
    description:
      "Wake up to breathtaking ocean views from this villa perched on a cliff.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60"
    },
    price: 3700,
    location: "Santorini",
    country: "Greece",
  },
  {
    title: "Lakeside Cottage",
    description:
      "Charming cottage right on the lake. Perfect for swimming and kayaking.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=60"
    },
    price: 950,
    location: "Ontario",
    country: "Canada",
  },
  {
    title: "Island Hut",
    description:
      "Simple hut on a private island for the ultimate getaway.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60"
    },
    price: 600,
    location: "Fiji",
    country: "Fiji",
  },
  {
    title: "Luxury Desert Camp",
    description:
      "Glamorous tents in the middle of the desert with modern comforts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600047509807-ba4f7ec5b64a?auto=format&fit=crop&w=800&q=60"
    },
    price: 2800,
    location: "Sahara",
    country: "Morocco",
  },
  {
    title: "Castle Stay",
    description:
      "Sleep like royalty in this restored medieval castle.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=60"
    },
    price: 5000,
    location: "Edinburgh",
    country: "Scotland",
  },
  {
    title: "Overwater Bungalow",
    description:
      "Stay in an overwater bungalow with glass floors and ocean views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=60"
    },
    price: 4500,
    location: "Bora Bora",
    country: "French Polynesia",
  },
  {
    title: "Traditional Ryokan",
    description:
      "Japanese inn with tatami rooms, hot springs, and traditional cuisine.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1582719478185-2c0f3e9a1e63?auto=format&fit=crop&w=800&q=60"
    },
    price: 1800,
    location: "Kyoto",
    country: "Japan",
  },
  {
    title: "Forest Cabin",
    description:
      "Off-grid cabin deep in the forest for peace and quiet.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=60"
    },
    price: 750,
    location: "Oregon",
    country: "United States",
  },
  {
    title: "Mediterranean Villa",
    description:
      "Elegant villa with sea views and infinity pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60"
    },
    price: 4200,
    location: "Mallorca",
    country: "Spain",
  },
  {
    title: "Eco Jungle Lodge",
    description:
      "Stay in a sustainable eco-lodge in the middle of the jungle.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1519821172141-b5d8f77d6d23?auto=format&fit=crop&w=800&q=60"
    },
    price: 1400,
    location: "Costa Rica",
    country: "Costa Rica",
  },
  {
    title: "Igloo Experience",
    description:
      "Sleep under the Northern Lights in a glass igloo.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1519821172141-b5d8f77d6d23?auto=format&fit=crop&w=800&q=60"
    },
    price: 2700,
    location: "Lapland",
    country: "Finland",
  },
];

module.exports = { data: sampleListings };
