<template>
  <div class="flex flex-col gap-20 text-neutral-800">
    <!-- First section -->
    <section>
      <div class="flex flex-col mx-auto text-left md:flex-col-reverse md:gap-10">
        <div class="relative">
          <figure class="relative md:block md:w-2/3 md:mx-auto">
            <NuxtImg
              src="/engagement/engagement_1.jpg"
              alt="Créations Pensée Bohème"
              class="w-full opacity-80"
              format="webp"
              quality="90"
              loading="lazy"
            />
            <figcaption
              class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Laura Langlois Photographie
            </figcaption>
          </figure>
        </div>
        <div class="bg-primary_green px-10 lg:px-20 py-8 md:mt-15">
          <h2 class="mb-15 font-bold text-center font text-2xl text-accent-500">
            Pensée Bohème, c'est plus de 70% de végétaux issus d'une production raisonnée
          </h2>
          <div class="flex flex-col gap-4 text-xl font-light leading-relaxed xl:mx-28 2xl:mx-68">
            <div>
              <p class="mb-2">
                Après mon apprentissage dans une boutique "classique" en 2016, je fais face aux deux
                réalités de ce métier :
              </p>
              <ul class="pl-6 list-disc list-outside flex flex-col gap-2">
                <li>
                  La surconsommation de fleurs importées produites sous serres éclairées 24h/24, 7
                  jours/7 et bourrées de pesticides
                </li>
                <li>
                  L'excès de plastique utilisé en magasin et par conséquent de déchets non
                  recyclables
                </li>
              </ul>
            </div>
            <p class="text-xl text-left font-light leading-relaxed">
              C'est en me confrontant à ce milieu que je me suis rendu compte qu'il y avait
              forcément une façon de fleurir vos événements de façon plus éthique.
            </p>
            <p class="text-xl text-left font-light leading-relaxed">
              Je travaille main dans la main avec des floricultrices passionnées qui me fournissent
              en fleurs locales une grande partie de l'année pour fleurir vos événements.
            </p>
          </div>
        </div>
      </div>

      <div class="h-px mx-auto bg-accent-500 w-1/11 mt-10"></div>
    </section>

    <!-- Second section -->
    <section>
      <div class="flex flex-col items-center px-10 lg:px-20 gap-10 md:flex-row-reverse">
        <NuxtImg
          src="/engagement/engagement_2.svg"
          alt="Cécile - Pensée Bohème"
          class="mx-auto w-full md:w-1/3"
          quality="90"
          loading="lazy"
        />

        <div
          class="text-left text-xl font-light leading-relaxed flex flex-col justify-center items-center gap-10"
        >
          <h2
            class="hidden font-bold md:block my-10 text-center text-3xl leading-normal text-accent-500"
          >
            Collectif de la Fleur Française
          </h2>
          <p class="">
            Depuis la création de mon entreprise, je suis adhérente au Collectif de la fleur
            française dans une démarche de soutenir une agriculture plus responsable et proposer des
            fleurs locales et de saison.
          </p>
          <p class="">
            J'aspire également à réduire au maximum les déchets en travaillant le moins possible
            avec de la mousse florale; en utilisant des contenants adaptés et des techniques de
            fleurissement qui garderont une fraîcheur optimale à vos végétaux.
          </p>
          <p class="">
            De plus, vous pourrez retrouver une large gamme d'éléments de décoration disponible à la
            <NuxtLink
              to="/locations"
              class="relative border-b border-dotted border-accent-500 font-semibold text-accent-500 group md:border-none"
            >
              location;
              <span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              ></span
            ></NuxtLink>
            ainsi vous diminuer votre empreinte carbone en n'achetant pas du neuf tout en faisant
            des économies.
          </p>

          <NuxtLink
            to="/contact"
            class="w-fit relative border-b border-dotted border-accent-500 font-bold text-accent-500 group md:border-none"
            >En savoir plus<span
              class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
            ></span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
