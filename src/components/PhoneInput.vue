<template>
     <div style="display: flex; flex-direction: row;">
        <div id="country-code">
            <p style="margin:auto">+62</p>
        </div>
        <v-text-field
        v-model="value"
        label="No Telepon"
        placeholder="No Telepon"
        outlined
        @change="handleOnChange"
        dense
    ></v-text-field>
    </div>
</template>
<script>
export default {
  name: 'PhoneInput',
  data() {
    return {
      phone: null,
      value: null
    };
  },
  methods: {
    handleOnChange() {
      this.phone = "62"+this.value
      return this.$emit('on-change', this.phone);
    },
  },
};
</script>

<style lang="scss" scoped>
#country-code{
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.38);
    margin-right: 4px;
    border-radius: 4px;
}
</style>