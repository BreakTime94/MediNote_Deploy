import Spinner from "./Spinner.jsx"
export default {
    title: "TEST/ui/Spinner",
    component: Spinner,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "number" },
        thickness: { control: "number" },
        ariaLabel: { control: "text" },
    },
};

export const Basic = { args: { size: 20 } };
export const Thick = { args: { size: 24, thickness: 6 } };
export const InlineText = {
    render: (args) => (
        <div className="flex items-center gap-2 text-slate-700">
            <Spinner {...args} />
            <span>불러오는 중...</span>
        </div>
    ),
    args: { size: 18 },
};