export const useBusinessSchema = (overrides: Record<string, unknown> = {}) =>
  defineLocalBusiness({
    '@type': 'Florist',
    name: 'Pensée Bohème',
    description:
      'Fleuriste éco-responsable spécialisée dans les créations florales sur-mesure, fleurs séchées, mariages et ateliers créatifs.',
    image: 'https://pensee-boheme.fr/home/landpage_2.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "316 route du Parc d'Anxtot",
      addressLocality: 'Beuzeville-la-Grenier',
      postalCode: '76210',
      addressRegion: 'Normandie',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.59050861790701,
      longitude: 0.4137516889308236,
    },
    telephone: '+33614643584',
    email: 'penseeboheme76@gmail.com',
    url: 'https://pensee-boheme.fr',
    sameAs: [
      'https://www.facebook.com/penseeboheme76',
      'https://www.instagram.com/penseeboheme76/',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    priceRange: '€€',
    founder: { '@type': 'Person', name: 'Cécile Devaux' },
    areaServed: ['Beuzeville-la-Grenier', 'Le Havre', 'Rouen', 'Normandie', 'Seine-Maritime'],
    ...overrides,
  })
