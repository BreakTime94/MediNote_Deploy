import React from "react";
import {createMemoryRouter, MemoryRouter, RouterProvider} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import "../src/index.css";
import "../src/components/common/styles/theme.css"

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
  decorators: [
    (Story, context) => {
    const storyPath = context.parameters.reactRouterPath || "/member";
    const extraPath = context.parameters.reactExtraPath || [];
     const router = createMemoryRouter(
         [
           {
             path: storyPath,
             element: <Story/>,
           },
             ...extraPath
         ],
         {initialEntries: [storyPath]},
     );
     return (
         <>
            <RouterProvider router={router}/>
             <Toaster
                 position="top-center"
                 gutter={8}
                 toastOptions={{
                     duration: 3000,
                     className: "rounded-2xl px-0 py-0 shadow-lg",
                     style: { background: "transparent", boxShadow: "none" }, // Tailwind로만 스타일
                     ariaProps: { role: "status", "aria-live": "polite" },
                 }}
             />
         </>
     );
    }
  ]
};

export default preview;