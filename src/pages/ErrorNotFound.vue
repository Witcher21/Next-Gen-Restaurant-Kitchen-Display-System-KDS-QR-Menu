<template>
  <div class="error-page">
    <div class="error-content animate-fade-in-up">
      <div style="font-size: 80px" class="animate-float">🍽️</div>
      <h1
        class="gradient-text text-h2 text-weight-bold q-mt-lg"
        style="font-family: 'Space Grotesk', sans-serif"
      >
        404
      </h1>
      <p class="text-grey-5 text-h6 q-mt-sm">Oops! This dish isn't on the menu</p>
      <p class="text-grey-7">The page you're looking for doesn't exist.</p>
      <q-btn
        rounded
        unelevated
        color="orange-9"
        no-caps
        label="Back to Home"
        icon="home"
        class="q-mt-lg"
        to="/"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c0a09;
}
.error-content {
  text-align: center;
  padding: 32px;
}
</style>
