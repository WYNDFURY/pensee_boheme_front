export const useCurrentSlugService = () => {
  // Create a persistent state for the slug
  const currentSlug = useState<string>('current-page-slug', () => '')

  // Function to extract and update slug from route
  const updateSlugFromRoute = () => {
    const route = useRoute()

    const path = route.path.endsWith('/')
      ? route.path.slice(0, -1) // Remove trailing slash
      : route.path

    const routeParts = path.split('/')
    const lastPart = routeParts[routeParts.length - 1]

    // Update the slug state
    currentSlug.value = lastPart || ''
  }

  // Call once initially
  updateSlugFromRoute()

  // Return the reactive slug and a validation function
  return {
    slug: currentSlug,
    isValid: () => !!currentSlug.value && currentSlug.value !== '',
    updateSlugFromRoute,
  }
}
