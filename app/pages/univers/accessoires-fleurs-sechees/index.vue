<template>
  <div>
    <PagesBanner
      class="md:text-right"
      :text-class="'md:justify-end md:mr-10'"
      :banner-image="'/AFS/AFS_Banner.jpg'"
      :alt="'accessoires fleurs séchées bannière'"
      ><h1>
        Accessoires <br />
        Fleurs <br />
        Séchées
      </h1></PagesBanner
    >

    <section class="flex flex-col items-center text-balance">
      <div class="my-10 text-center font-light leading-relaxed px-10 md:px-20">
        <p class="text-xl 2xl:text-2xl xl:mx-28 2xl:mx-68">
          Passionnée par la beauté et la pérennité des fleurs séchées, je vous invite à découvrir
          des accessoires uniques, conçus avec amour et attention. <br />
          Chaque création est le reflet d'une inspiration personnelle, où les couleurs sont
          soigneusement choisies pour s'harmoniser parfaitement à vos désirs.
        </p>
      </div>
      <div class="grid grid-cols-3 gap-[1.5vw] px-[3vw] w-full">
        <NuxtImg
          src="/AFS/AFS_1.jpg"
          alt="Accessoires Fleurs Séchées"
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover rounded-r-2xl rounded-l-[60px] md:rounded-l-[100px] xl:rounded-l-[200px] opacity-80"
          format="webp"
          quality="90"
          loading="lazy"
        />
        <NuxtImg
          src="/AFS/AFS_2.jpg"
          alt="Accessoires Fleurs Séchées"
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover rounded-2xl opacity-90"
          format="webp"
          quality="90"
          loading="lazy"
        />
        <NuxtImg
          src="/AFS/AFS_3.jpg"
          alt="Accessoires Fleurs Séchées "
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover object-[15%_0%] rounded-l-2xl rounded-r-[60px] md:rounded-r-[100px] xl:rounded-r-[200px] opacity-80"
          format="webp"
          quality="90"
          loading="lazy"
        />
      </div>
    </section>
    <div class="mx-auto py-8 w-2/3">
      <ClientOnly>
        <USeparator
          orientation="horizontal"
          class="h-10"
          :avatar="{ src: '/PB_pensee_logo.svg', size: 'xl' }"
        />
      </ClientOnly>
    </div>
    <section class="flex flex-col gap-10">
      <div class="px-20 text-center">
        <h2 class="font-semibold text-2xl text-accent-500 2xl:text-4xl">Le souci du détail</h2>
        <p class="text-xl font-light leading-relaxed 2xl:text-2xl xl:mx-28 2xl:mx-68">
          Pour la mariée ou son cortège, pour un événement particulier ou simplement pour vous faire
          plaisir. <br />Je mets tout en œuvre pour que vos accessoires se marient parfaitement avec
          vos envies. <br />Tous les accessoires sont créés sur mesure, selon les couleurs que vous
          désirez.
        </p>
      </div>

      <ProductsList v-if="data" :page="data.data" />
    </section>
  </div>
</template>

<script lang="ts" setup>
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
</script>
