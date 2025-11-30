

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "viteFinal": async (config) => {
    config.server = config.server || {};
    config.server.proxy = {
      "/api": {
        "target": "http://localhost:8083",
        "changeOrigin": true,
        "configure": (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Set-Cookie 헤더를 수정해서 올바른 도메인으로 변경
            if (proxyRes.headers['set-cookie']) {
              proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie => {
                // Domain=localhost를 제거하거나 localhost:6006으로 변경
                return cookie.replace(/Domain=[^;]+/, '');
              });
            }
          });
        }
      }
    };
    return config;
  }
};
export default config;