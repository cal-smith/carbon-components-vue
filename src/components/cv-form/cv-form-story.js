import { storiesOf } from '@storybook/vue';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/vue';
import { withNotes } from '@storybook/addon-notes';

import SvTemplateView from '../../views/sv-template-view/sv-template-view';
import consts from '../../utils/storybook-consts';
import knobsHelper from '../../utils/storybook-knobs-helper';

import CvFormNotesMD from './cv-form-notes.md';
import CvForm from './cv-form';

const stories = storiesOf('CvForm', module);
stories.addDecorator(withKnobs);

const kinds = null;

const preKnobs = {
  otherAttributes: {
    group: 'attr',
    type: text,
    config: ['other attributes', '', consts.OTHER],
    value: val => (val.length ? `\n  ${val}` : ''),
  },
};

const storySet = knobsHelper.getStorySet(kinds, preKnobs);

for (const story of storySet) {
  stories.add(
    story.name,
    withNotes(CvFormNotesMD)(() => {
      const settings = story.knobs();

      // ----------------------------------------------------------------

      const templateString = `
  <cv-form${settings.group.attr}>
    <cv-form-item>
      <label for="text-input-3" class="bx--label">Text Input label</label>
      <input id="text-input-3" type="text" class="bx--text-input" placeholder="Optional placeholder text">
    </cv-form-item>

    <cv-form-group>
      <template slot="label">Form group legend</template>
      <template slot="content">
        <label>
          Small
          <input type="radio" name="size" id="size_1" value="small" />
        </label>
        <label>
          Large
          <input type="radio" name="size" id="size_2" value="large" />
        </label>
      </template>
    </cv-form-group>

    <button disabled>Done</button>
  </cv-form>
    `;

      // ----------------------------------------------------------------

      const templateViewString = `
      <sv-template-view
        sv-margin
        sv-source='${templateString.trim()}'>
        <template slot="component">${templateString}</template>
      </sv-template-view>
    `;

      return {
        components: { CvForm, SvTemplateView },
        template: templateViewString,
      };
    })
  );
}
