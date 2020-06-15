<template>
    <golden-layout class="screen">
    <gl-row>
      <gl-component  title="component1">
        <h1>Component 1</h1>
      </gl-component>
      <gl-dstack>
        <gl-component title="component2">
          <h1>Component 2</h1>
        </gl-component>
        <gl-component title="component3">
          <h1>Component 3</h1>
        </gl-component>
      </gl-dstack>
    </gl-row>
  </golden-layout>
</template>

<style scoped>
.screen {
  height: 100vh;
  width: 100vw;
}
</style>
