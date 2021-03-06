<!--
  Carbon Style Dropdown

  Attributes:
    placeholder: Placeholder text displayed before any  selection is made.

  Usage:
    <cv-dropdown placeholder="Choose an option">
      <cv-dropdown-item value="10">Option 1</cv-dropdown-item>
      <cv-dropdown-item value="20">Option 2</cv-dropdown-item>
      <cv-dropdown-item value="30">Option 3</cv-dropdown-item>
      <cv-dropdown-item value="40">Option 4</cv-dropdown-item>
      <cv-dropdown-item value="50">Option 5</cv-dropdown-item>
    </cv-dropdown>

-->

<template>
  <ul
    data-dropdown
    :data-value="internalValue"
    class="cv-dropdown bx--dropdown"
    tabindex="0"
    :class="{'bx--dropdown--light': theme === 'light', 'bx--dropdown--up': up, 'bx--dropdown--open': open}"
    v-bind="$attrs"
    @keypress.down.prevent="onDown"
    @keypress.up.prevent="onUp"
    @keypress.enter.prevent="onClick"
    @keypress.esc.prevent="onEsc"
    @click="onClick"
  >
    <li class="bx--dropdown-text" ref="valueContent">{{placeholder}}</li>
    <svg class="bx--dropdown__arrow" width="10" height="5" viewBox="0 0 10 5" fill-rule="evenodd">
      <path d="M10 0L5 5 0 0z"></path>
    </svg>
    <li>
      <ul class="bx--dropdown-list">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script>
import themeMixin from '../../mixins/theme-mixin';

export default {
  name: 'CvDropdown',
  mixins: [themeMixin],
  props: {
    placeholder: {
      type: String,
      default: 'Choose an option',
    },
    up: Boolean,
    value: String, // initial value of the dropdown,
  },
  data() {
    return {
      open: false,
      dataValue: this.value,
    };
  },
  mounted() {
    this.$el.addEventListener('focusout', ev => {
      if (ev.relatedTarget === null || !this.$el.contains(ev.relatedTarget)) {
        this.open = false;
      }
    });
    this.internalValue = this.internalValue; // forces update of value
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  watch: {
    value(val) {
      this.internalValue = val;
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.dataValue;
      },
      set(val) {
        for (let index in this.$children) {
          let child = this.$children[index];
          let selected = child.value === val;
          child.internalSelected = selected;

          if (selected) {
            this.$refs.valueContent.innerHTML = child.internalContent;
          }
        }
        this.dataValue = val;
        this.$emit('change', this.dataValue);
      },
    },
  },
  methods: {
    doMove(up) {
      // requery could have changed
      let currentFocusEl = this.$el.querySelector('.cv-dropdown-item :focus');
      let currentFocusValue;
      let last = this.$children.length - 1;
      let currentFocusIndex = up ? 0 : last;
      let nextFocusIndex;

      if (currentFocusEl) {
        currentFocusValue = currentFocusEl.parentNode.getAttribute(
          'data-value'
        );
      }

      if (currentFocusValue !== undefined) {
        currentFocusIndex = this.$children.findIndex(
          child => child.value === currentFocusValue
        );
      }

      if (up) {
        nextFocusIndex = currentFocusIndex > 0 ? currentFocusIndex - 1 : last;
        if (this.$children[nextFocusIndex].internalSelected) {
          nextFocusIndex = nextFocusIndex > 0 ? nextFocusIndex - 1 : last;
        }
      } else {
        nextFocusIndex = currentFocusIndex < last ? currentFocusIndex + 1 : 0;
        if (this.$children[nextFocusIndex].internalSelected) {
          nextFocusIndex = nextFocusIndex < last ? nextFocusIndex + 1 : 0;
        }
      }

      this.$children[nextFocusIndex].setFocus();
    },
    onDown() {
      if (!this.open) {
        this.open = true;
      } else {
        this.doMove(false);
      }
    },
    onUp() {
      if (this.open) {
        this.doMove(true);
      }
    },
    onEsc() {
      this.open = false;
      this.$el.focus();
    },
    onClick(ev) {
      this.open = !this.open;
      if (!this.open) {
        this.$el.focus();
      }

      if (ev.target.classList.contains('bx--dropdown-link')) {
        const targetItemEl = ev.target.parentNode;
        const newValue = targetItemEl.getAttribute('data-value');

        this.internalValue = newValue;
      }
    },
  },
};
</script>

<style lang="scss">
</style>
