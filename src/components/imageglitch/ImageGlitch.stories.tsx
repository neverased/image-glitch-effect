import { StoryFn, Meta } from "@storybook/react";
import GlitchImage from "./ImageGlitch";

export default {
    title: "ImageGlitch",
    component: GlitchImage,
} as Meta<typeof GlitchImage>;

const Template: StoryFn<typeof GlitchImage> = (args) => <GlitchImage {...args} />;

export const Default = Template.bind({});
Default.args = {
    src: "https://source.unsplash.com/random/800x600",
};
