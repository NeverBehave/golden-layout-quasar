<template>
    <golden-layout class="screen">
    <gl-row>
      <gl-col>
        <gl-component  title="component1">
          <h1>Component 1</h1>
          <button @click="show = true">on</button>
          <button @click="show = false">off</button>
          <button @click="clear">cc</button>
          <input v-model="w"/>
        </gl-component>
      </gl-col>
    <gl-col>
        <gl-component>
            <h1>Placeholder here, you will need at least two component left (not dynamic) to avoid error</h1>
        </gl-component>
    </gl-col>
      <gl-col v-if=" show" :width=w @destroy="show = false">
        <gl-stack>
          <gl-component title="component2">
            <h1>Component 2</h1>
          </gl-component>
          <gl-component title="component3">
            <h1>Component 3</h1>
          </gl-component>
        </gl-stack>
      </gl-col>
    </gl-row>
  </golden-layout>
</template>

<script>
export default {
  data () {
    return {
      show: true,
      w: 98
    }
  },
  methods: {
    clear () {
      localStorage.clear()
    }
  }
}
</script>

<style scoped>
.screen {
  height: 100vh;
  width: 100vw;
}
</style>
