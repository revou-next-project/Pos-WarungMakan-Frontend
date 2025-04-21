/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    reactStrictMode: true,
};

// Conditionally add SWC plugin if tempo devtools is enabled
if (process.env.NEXT_PUBLIC_TEMPO) {
    nextConfig.experimental = {
      ...nextConfig.experimental, // preserve other experimental options
      swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
    };
  
    // For Next 13.4.8–14.1.3:
    // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
    // For Next 15+ (not yet supported)
  }

module.exports = nextConfig;