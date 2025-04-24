<template>
  <div class="py-20 text-balance">
    <!-- infos  -->
    <section class="relative flex flex-col gap-20 mb-52">
      <h1
        class="uppercase font-light text-5xl md:text-6xl xl:text-7xl text-center font-['Kumbh_sans']"
      >
        infos pratiques
      </h1>
      <NuxtImg
        src="/infos-pratiques/infos_pratiques_1.jpg"
        alt="Pensée Bohème - Infos pratiques 1"
        class="w-full md:w-3/4 lg:w-1/2 mx-auto rounded-sm drop-shadow-lg opacity-80"
        placeholder=""
        loading="lazy"
      />
      <aside
        class="absolute bottom-0 translate-y-1/2 bg-primary_pink rounded-lg shadow-md p-4 md:p-8 flex flex-col place-self-center"
      >
        <h2 class="text-lg md:text-3xl lg:text-2xl text-center my-4">
          Horaire d'ouverture rendez vous:
        </h2>
        <ul
          class="text-left text-sm md:text-lg lg:text-xl font-light leading-relaxed text-balance list-disc pl-7 mb-4"
        >
          <li>Du lundi au vendredi de 9h à 16h</li>
          <li>Fermé le mercredi</li>
          <li>Samedi de 9h à 13h</li>
          <li>Retrait commandes sur demande</li>
        </ul>
      </aside>
    </section>

    <!-- contact -->

    <section class="relative flex flex-col gap-20">
      <h2
        class="uppercase font-light text-4xl md:text-5xl xl:text-6xl text-center font-['Kumbh_sans']"
      >
        Me Contacter
      </h2>
      <div
        class="flex flex-col lg:flex-row-reverse gap-8 items-center justify-center mx-4 md:mx-16"
      >
        <div class="w-full lg:w-3/4 xl:w-1/2 aspect-[16/9] rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2209.4139441244038!2d0.4137516889308236!3d49.59050861790701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e047af26add8bb%3A0x81708df81afa1644!2zcGVuc8OpZSBib2jDqG1l!5e0!3m2!1sfr!2sbe!4v1744975436273!5m2!1sfr!2sbe"
            class="w-full h-full border-0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
        <div class="flex flex-col gap-4 text-lg mx-auto">
          <div class="flex items-center gap-2"><AkPhone class="text-xl" /> +33 6 14 64 35 84</div>
          <div class="flex items-center gap-2">
            <MdTwoToneMailOutline class="text-xl" /> penseeboheme76@gmail.com
          </div>
          <div class="flex items-center gap-2">
            <AkLocation class="text-xl" /> 316 route du Parc d'Anxtot<br />76210 Beuzeville la
            Grenier
          </div>
          <div class="flex items-center gap-2">
            <AkInstagramFill class="text-xl" /> @penseeboheme
          </div>
          <div class="flex items-center gap-2">
            <DeFacebookPlain class="text-xl" /> Pensée Bohème
          </div>
        </div>
      </div>
    </section>

    <!-- google reviews -->
    <section></section>
    <!-- instagram feed  -->
    <section></section>
  </div>
</template>

<script lang="ts" setup>
  import {
    AkPhone,
    MdTwoToneMailOutline,
    AkLocation,
    AkInstagramFill,
    DeFacebookPlain,
  } from '@kalimahapps/vue-icons'
</script>

<style></style>
