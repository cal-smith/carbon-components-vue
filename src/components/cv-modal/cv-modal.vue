<template>
  <div
    data-modal
    :id="uid"
    class="cv-modal bx--modal"
    :class="{
      'is-visible': dataVisible,
      'bx--modal--danger': kind === 'danger'
    }"
    tabindex="-1"
    @keydown.esc.prevent="hide"
  >
    <div class="bx--modal-container">
      <div class="bx--modal-header">
        <h4 class="bx--modal-header__label" v-if="$slots.label">
          <slot name="label">label (Optional)</slot>
        </h4>
        <h2 class="bx--modal-header__heading">
          <slot name="title">Modal Title</slot>
        </h2>
        <button class="bx--modal-close" type="button" @click="hide" ref="close">
          <cv-icon class="bx--modal-close__icon" href="cv(icon--close)" height="10px" width="10px"></cv-icon>
        </button>
      </div>

      <div class="bx--modal-content">
        <slot name="content">
          <p>Passive modal notifications should only appear if there is an action the user needs to address immediately. Passive modal notifications are persistent on the screen.</p>
        </slot>
      </div>

      <div class="bx--modal-footer" v-if="hasFooter">
        <cv-button
          :kind="secondaryKind"
          @click="onSecondaryClick"
          v-if="this.$slots['secondary-button']"
          ref="secondary"
        >
          <slot name="secondary-button">Secondary button</slot>
        </cv-button>
        <cv-button
          :kind="primaryKind"
          @click="onPrimaryClick"
          v-if="this.$slots['primary-button']"
          ref="primary"
        >
          <slot name="primary-button">Primary button</slot>
        </cv-button>
      </div>
    </div>
  </div>
</template>

<script>
import CvButton from '../cv-button/cv-button';
import CvIcon from '../cv-icon/cv-icon';
import uidMixin from '../../mixins/uid-mixin';

export default {
  name: 'CvModal',
  mixins: [uidMixin],
  components: {
    CvButton,
    CvIcon,
  },
  props: {
    kind: {
      type: String,
      default: '',
      validator: val => ['', 'danger'].includes(val),
    },
    visible: Boolean,
  },
  data() {
    return {
      dataVisible: false,
    };
  },
  mounted() {
    if (this.visible) {
      this.show();
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.show();
      } else {
        this.hide();
      }
    },
  },
  computed: {
    primaryKind() {
      if (this.kind === 'danger') {
        return 'danger--primary';
      } else {
        return 'primary';
      }
    },
    secondaryKind() {
      if (this.kind === 'danger') {
        return 'tertiary';
      } else {
        return 'secondary';
      }
    },
    hasFooter() {
      return this.$slots['primary-button'] || this.$slots['secondary-button'];
    },
  },
  methods: {
    onShown() {
      if (this.$slots['primary-button']) {
        this.$refs.primary.$el.focus();
      } else if (this.$slots['secondary-button']) {
        this.$refs.secondary.$el.focus();
      } else {
        this.$refs.close.focus();
      }
      this.$emit('modal-shown');

      this.$el.removeEventListener('transitionend', this.onShown);
    },
    show: function() {
      this.$el.addEventListener('transitionend', this.onShown);
      this.$el.addEventListener('focusout', this.hide);
      this.dataVisible = true;
    },
    hide: function() {
      this.dataVisible = false;
      this.$emit('modal-hidden');
      this.$el.removeEventListener('focusout', this.hide);
    },
    onPrimaryClick() {
      this.$emit('primary-click');
      if (!this.$listeners['primary-click']) {
        this.hide();
      }
    },
    onSecondaryClick() {
      this.$emit('secondary-click');
      if (!this.$listeners['secondary-click']) {
        this.hide();
      }
    },
  },
};
</script>

<style lang="scss">
</style>
