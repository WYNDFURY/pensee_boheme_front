export const useBusinessSchema = (overrides: Record<string, unknown> = {}) =>
  defineLocalBusiness({
    '@type': 'Florist',
    name: 'Pensée Bohème',
    description:
      'Fleuriste éco-responsable spécialisée dans les créations florales sur-mesure, fleurs séchées, mariages et ateliers créatifs.',
    image: 'https://pensee-boheme.fr/home/landpage_2.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '68 Route de la Vallée',
      addressLocality: 'Bec-de-Mortagne',
      postalCode: '76110',
      addressRegion: 'Normandie',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.702988,
      longitude: 0.448245,
    },
    telephone: '+33614643584',
    email: 'penseeboheme76@gmail.com',
    url: 'https://pensee-boheme.fr',
    sameAs: [
      'https://www.facebook.com/penseeboheme/',
      'https://www.instagram.com/penseeboheme/',
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
    areaServed: ['Bec-de-Mortagne', 'Le Havre', 'Rouen', 'Normandie', 'Seine-Maritime', 'Beuzeville-la-Grenier'],
    ...overrides,
  })
