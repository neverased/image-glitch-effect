import { StoryFn, Meta } from "@storybook/react";
import GlitchImage from "./ImageGlitch";
import logo from "../../assets/cwb_bwp_media.svg";

export default {
    title: "ImageGlitch",
    component: GlitchImage,
    argTypes: {
      src: { control: 'text' },
    },
    parameters: {
      docs: {
        description: {
          component: 'This component applies a glitch effect to an image.',
        },
      },
    },
  } as Meta<typeof GlitchImage>;

const Template: StoryFn<typeof GlitchImage> = (args) => <GlitchImage {...args} />;

export const Default = Template.bind({});
Default.args = {
    src: logo,
};

export const NoImage = Template.bind({});
NoImage.args = {
  src: '',
};