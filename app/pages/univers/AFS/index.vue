<template>
  <div>
    <PagesBanner
      class="md:text-right"
      :text-class="'md:justify-end md:mr-10'"
      :banner-image="'/AFS/AFS_Banner.jpg'"
      :alt="'accessoires fleurs séchées bannière'"
      >Accessoires <br />
      Fleurs <br />
      Séchées</PagesBanner
    >
    <section class="flex flex-col items-center">
      <div
        class="my-10 text-center text-2xl 2xl:text-4xl font-light leading-relaxed px-10 md:px-20 font-['Josefin_Slab']"
      >
        <p class="2xl:text-3xl">
          Passionnée par la beauté et la pérennité des fleurs séchées, je vous invite à découvrir
          des accessoires uniques, conçus avec amour et attention. Chaque création est le reflet
          d'une inspiration personnelle, où les couleurs sont soigneusement choisies pour
          s’harmoniser parfaitement à vos désirs.
        </p>
      </div>
      <div class="grid grid-cols-3 gap-[1.5vw] px-[3vw] w-full">
        <NuxtImg
          src="/AFS/AFS_1.jpg"
          alt="Accessoires Fleurs Séchées"
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover rounded-r-2xl rounded-l-[60px] md:rounded-l-[100px] xl:rounded-l-[200px]"
          format="webp"
          quality="90"
          loading="lazy"
        />
        <NuxtImg
          src="/AFS/AFS_2.jpg"
          alt="Accessoires Fleurs Séchées"
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover rounded-2xl"
          format="webp"
          quality="90"
          loading="lazy"
        />
        <NuxtImg
          src="/AFS/AFS_3.jpg"
          alt="Accessoires Fleurs Séchées "
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover object-[15%_0%] rounded-l-2xl rounded-r-[60px] md:rounded-r-[100px] xl:rounded-r-[200px]"
          format="webp"
          quality="90"
          loading="lazy"
        />
      </div>
      <!-- <div class="px-5 md:px-10 w-full">
        <div class="grid grid-cols-3 md:gap-5">
          <NuxtImg
            src="/AFS/AFS_1.jpg"
            alt="Accessoires Fleurs Séchées"
            class="w-full aspect-[3/4] object-cover"
            format="webp"
            quality="90"
            loading="lazy"
          />
          <NuxtImg
            src="/AFS/AFS_2.jpg"
            alt="Accessoires Fleurs Séchées"
            class="w-full aspect-[3/4] object-cover"
            format="webp"
            quality="90"
            loading="lazy"
          />
          <NuxtImg
            src="/AFS/AFS_3.jpg"
            alt="Accessoires Fleurs Séchées "
            class="w-full aspect-[3/4] object-cover"
            format="webp"
            quality="90"
            loading="lazy"
          />

        </div>
      </div> -->
    </section>
  </div>
</template>
