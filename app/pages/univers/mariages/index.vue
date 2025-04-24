<template>
  <div>
    <PagesBanner
      :text-class="'md:justify-end md:mr-16 bottom-1/6'"
      :banner-image="'/mariages/mariages_Banner.jpg'"
      :alt="'Mariages bannière'"
      ><h1>Mariages</h1></PagesBanner
    >

    <div class="flex flex-col gap-8 text-balance">
      <!-- first section -->
      <section class="flex flex-col mt-16 md:mt-32 lg:mx-16">
        <div class="grid grid-cols-2">
          <blockquote class="mx-8 my-auto -translate-y-10 font-['Source_Serif_Pro'] italic">
            <h1 class="mb-2 text-left font-serif md:text-xl lg:text-4xl">
              L'amour, s'il tient en une seule fleur, est infini
            </h1>
            <footer class="text-right text-xs -translate-y-2 md:text-xl">
              <cite>- Antonio Porchia</cite>
            </footer>
          </blockquote>

          <NuxtImg
            src="/mariages/mariages_1.jpg"
            alt="Pensée Bohème - Mariages1"
            class="opacity-90 pr-5 lg:pr-0"
            format="webp"
            placeholder=""
            quality="90"
            loading="lazy"
          />
        </div>
        <NuxtImg
          src="/mariages/mariages_2.jpg"
          alt="Pensée Bohème - Mariages2"
          class="w-4/6 -translate-y-1/3 self-center md:w-1/2"
          format="webp"
          placeholder=""
          quality="90"
          loading="lazy"
        />
      </section>

      <!-- second section -->
      <section class="mt-16">
        <div class="flex flex-col gap-8 text-center text-pretty mx-10 xl:mx-28 2xl:mx-68">
          <h2 class="text-2xl lg:text-3xl md:mx-0 text-balance">
            En tant que fleuriste événementielle spécialisée dans les mariages,<br />
            j'ai à cœur de créer des ambiances uniques et mémorables.
          </h2>
          <hr class="h-px w-24 mx-auto rounded-full bg-accent-500" />
          <div
            class="flex flex-col text-left md:text-center gap-4 text-lg lg:text-xl leading-relaxed mx-10 xl:mx-28 2xl:mx-68"
          >
            <p>
              Je m'efforce de mettre en valeur chaque détail de votre décoration, et je conçois des
              compositions florales sur mesure qui reflètent votre personnalité et vos envies.
            </p>
            <p>
              Mon rôle ne se limite pas à la simple création ; je me consacre également à
              l'installation sur le lieu de réception, afin que chaque fleur soit parfaitement
              disposée pour ce jour particulier.
            </p>
            <p>
              Je vous accompagne pour fleurir vos événements partout en Normandie et aux alentours.
            </p>
          </div>
        </div>
      </section>
      <!-- third section -->
      <section class="flex flex-col mt-16 lg:mt-32">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <NuxtImg
            src="/mariages/mariages_3.jpg"
            alt="Pensée Bohème - Mariages personnalisés"
            class="mx-auto w-3/4 object-cover lg:col-span-2"
            placeholder=""
            format="webp"
            quality="90"
            loading="lazy"
          />
          <div
            class="flex flex-col justify-center text-pretty gap-4 px-16 my-8 text-base md:text-xl leading-relaxed text-center max-h-3/4 lg:col-span-2 lg:px-8 lg:text-right xl:text-xl 2xl:text-2xl"
          >
            <p class="">
              La personnalisation est au cœur de ma démarche. Je propose des accessoires sur mesure
              d'après les couleurs que vous me demandez, mais aussi des éléments décoratifs avec les
              inscriptions que vous désirez, ainsi que des cadeaux floraux uniques pour vos invités.
            </p>
            <p class="">
              Je considère chaque projet comme une mission, et je mets un point d'honneur à vous
              offrir une prestation qui respecte vos envies ainsi que votre budget. Confiez-moi
              votre rêve, et ensemble, nous ferons de votre mariage une journée inoubliable.
            </p>
            <span class="flex w-full justify-center">
              <hr class="h-px w-24 mx-auto rounded-full border-0 bg-accent-500" />
            </span>
            <p class="mt-2 text-center font-semibold text-accent-500 lg:text-right">
              Forfait décoration mariage à partir de 900 €
            </p>
          </div>
        </div>
        <NuxtImg
          src="/mariages/mariages_4.jpg"
          alt="Pensée Bohème - Décoration florale mariage"
          class="w-full lg:w-1/2 lg:-translate-y-1/4 lg:translate-x-1/4"
          placeholder=""
          format="webp"
          quality="90"
          loading="lazy"
        />
      </section>
      <aside class="my-12 px-4 md:px-8 lg:px-12">
        <div
          class="bg-primary_green rounded-lg shadow-md p-8 flex flex-col items-center gap-6 max-w-xl mx-auto"
        >
          <IconsBannerLogo class="w-12 md:w-16 h-full text-accent-500" />

          <p class="text-center text-lg md:text-xl leading-relaxed">
            Je propose également mes services pour animer des ateliers fleuris dans vos entreprises
            <br />
            <NuxtLink
              to="/ateliers-creatifs"
              class="relative border-b border-dotted border-accent-500 font-semibold text-accent-500 group md:border-none"
            >
              On en discute ensemble ?
              <span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              ></span>
            </NuxtLink>
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
