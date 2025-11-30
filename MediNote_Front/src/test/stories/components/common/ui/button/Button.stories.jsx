// Buttons.stories.jsx
import React from "react";
import ButtonsPage from "./ButtonsPage.jsx";

export default {
    title: "TEST/ui/Buttons",
    component: ButtonsPage,
    parameters: { layout: "centered" },
    argTypes: {
        variant:    { control: "radio",   options: ["white","gradient","outline","ghost"] },
        size:       { control: "radio",   options: ["sm","md","lg"] },
        radius:     { control: "radio",   options: ["md","lg","pill"] },
        fullWidth:  { control: "boolean" },
        loading:    { control: "boolean" },
        as:         { control: "radio",   options: ["button","a",null] },
        href:       { control: "text" },
        children:   { control: "text" },
    },
};

const Template = (args) => <ButtonsPage {...args} />;

export const Playground = Template.bind({});
Playground.args = {
    variant:    "white",
    size:       "md",
    radius:     "pill",
    fullWidth:  false,                 // ➋ Controls에 반영
    children:   "버튼",
};

export const Buttons = () => <ButtonsPage />;