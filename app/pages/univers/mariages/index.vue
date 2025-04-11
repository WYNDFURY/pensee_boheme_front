<template>
  <div>
    <PagesBanner
      class=""
      :text-class="'md:justify-end md:mr-20 bottom-1/6'"
      :banner-image="'/mariages/mariages_Banner.jpg'"
      :alt="'Mariages bannière'"
      >Mariages</PagesBanner
    >
    <div class="flex flex-col gap-10 mx-3 md:px-20 font-[Josefin_Slab] text-pretty">
      <!-- first section -->
      <section class="mt-20 md:mt-40 flex flex-col">
        <div class="grid grid-cols-2">
          <blockquote class="font-['Source_Serif_Pro'] italic mx-3 my-auto -translate-y-2/6">
            <h1 class="md:text-xl lg:text-4xl text-left font-serif mb-2">
              L'amour, s'il tient en une seule fleur, est infini
            </h1>
            <footer class="text-xs md:text-xl text-right -translate-y-2">
              <cite>- Antonio Porchia</cite>
            </footer>
          </blockquote>

          <NuxtImg
            src="/mariages/mariages_1.jpg"
            alt="Pensée Bohème - Mariages1"
            class=""
            format="webp"
            quality="90"
            loading="lazy"
          />
        </div>
        <NuxtImg
          src="/mariages/mariages_2.jpg"
          alt="Pensée Bohème - Mariages2"
          class="w-3/4 md:w-1/2 self-center -translate-y-1/3"
          format="webp"
          quality="90"
          loading="lazy"
        />
      </section>

      <!-- second section -->
      <section>
        <div class="flex flex-col gap-10 text-center">
          <h2 class="text-2xl md:mx-0">
            En tant que fleuriste événementielle spécialisée dans les mariages,<br />
            j'ai à cœur de créer des ambiances uniques et mémorables.
          </h2>
          <div class="h-px rounded-full mx-auto bg-accent-500 w-1/11"></div>
          <div
            class="flex flex-col gap-4 text-xl font-light leading-relaxed md:mx-0 px-10 text-pretty"
          >
            <p>
              Je m'efforce de mettre en valeur chaque détail de votre décoration, et je conçois des
              compositions florales sur mesure qui reflètent votre personnalité et vos envies.
            </p>
            <p>
              Mon rôle ne se limite pas à la simple création ; je me consacre également à
              l'installation sur le lieu de réception, afin que chaque fleur soit parfaitement
              disposée pour ce jour particulier. Je vous accompagne pour fleurir vos événements
              partout en Normandie et aux alentours.
            </p>
          </div>
        </div>
      </section>
      <!-- third section -->
      <section class="flex flex-col mt-12 lg:mt-40">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <NuxtImg
            src="/mariages/mariages_3.jpg"
            alt="Pensée Bohème - Mariages personnalisés"
            class="w-3/4 mx-auto object-cover lg:col-span-2"
            format="webp"
            quality="90"
            loading="lazy"
          />
          <div
            class="flex flex-col lg:col-span-2 px-5 py-4 lg:py-0 mx-auto gap-5 text-base xl:text-xl 2xl:text-2xl lg:text-right font-light leading-relaxed max-h-3/4"
          >
            <p class="text-pretty">
              La personnalisation est au cœur de ma démarche. Je propose des accessoires sur mesure
              d'après les couleurs que vous me demandez, mais aussi des éléments décoratifs avec les
              inscriptions que vous désirez, ainsi que des cadeaux floraux uniques pour vos invités.
            </p>
            <p class="text-pretty">
              Je considère chaque projet comme une mission, et je mets un point d'honneur à vous
              offrir une prestation qui respecte vos envies ainsi que votre budget. Confiez-moi
              votre rêve, et ensemble, nous ferons de votre mariage une journée inoubliable.
            </p>
            <span class="w-full flex justify-center">
              <hr class="h-px rounded-full mx-auto bg-accent-500 w-24 border-0" />
            </span>
            <p class="mt-3 font-semibold text-accent-500 text-center lg:text-right">
              Forfait décoration mariage à partir de 900 €
            </p>
          </div>
        </div>
        <NuxtImg
          src="/mariages/mariages_4.jpg"
          alt="Pensée Bohème - Décoration florale mariage"
          class="w-full lg:w-1/2 lg:-translate-y-1/4 lg:translate-x-1/4"
          format="webp"
          quality="90"
          loading="lazy"
        />
      </section>
    </div>
  </div>
</template>
