<template>
  <div>
    <PagesBanner
      :img-class="'opacity-60 object-top'"
      :text-class="'text-black bottom-1/4 tracking-[0.5em]'"
      :banner-image="'/professionnels/pro_banner.jpg'"
      :alt="'Professionnels bannière'"
      ><h1>Professionnels</h1>
    </PagesBanner>

    <section class="relative flex flex-col text-pretty mt-16 gap-16 mb-40 md:mb-60 lg:mb-80">
      <h2 class="sr-only">Pour les professionnels</h2>
      <div class="flex flex-col gap-8 text-center text-xl mx-10 xl:mx-28 2xl:mx-68">
        <p>
          Amis professionnels, vous cherchez à donner un coup d'éclat à la décoration de votre
          boutique ? <br />Je serais ravie de discuter avec vous de votre projet !
        </p>

        <p>
          Décor vitrine, décoration saisonnière, abonnement de bouquets... tout est possible pour
          rendre votre espace commercial encore plus chaleureux pour que vos clients s'y sentent
          bien !
        </p>
      </div>
      <NuxtImg
        src="/professionnels/pro_1.jpg"
        alt="Pensée Bohème - Professionnels 1"
        class="lg:w-2/3 mx-auto rounded-xl drop-shadow-lg"
        loading="lazy"
      />

      <aside
        class="absolute bottom-0 translate-y-1/2 bg-primary_pink rounded-lg shadow-md p-8 lg:p-12 flex flex-col items-center place-self-center"
      >
        <IconsIdea class="w-12 md:w-20 xl:w-24 text-accent-500 mb-8 lg:mb-12" />

        <p class="text-center text-sm md:text-xl leading-relaxed text-pretty">
          Je propose également mes services pour animer <br />
          des ateliers fleuris dans vos entreprises,
          <br />
          <NuxtLink
            to="/ateliers-creatifs"
            class="relative border-b border-dotted border-accent-500 font-bold text-accent-500 group md:border-none"
          >
            On en discute ensemble ?
            <span
              class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
            ></span>
          </NuxtLink>
        </p>
      </aside>
    </section>
  </div>
</template>
