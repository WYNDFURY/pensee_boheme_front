export default defineAppConfig({
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: "accent",
      neutral: "white",
    },
    button: {
      defaultVariants: {
        // Set default button color to neutral
        // color: 'neutral'
      },
    },
    navigationMenu: {
      slots: {
        link: "text-lg",
        childLinkLabel: "text-lg",
      },
      compoundVariants: [
        {
          orientation: "horizontal",
          highlight: true,
          class: {
            link: [
              "after:absolute after:-bottom-0 after:inset-x-1 after:block after:rounded-full",
              "after:transition-colors",
            ],
          },
        },
      ],
    },
  },
});
