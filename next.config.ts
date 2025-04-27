const nextConfig = {
  transpilePackages: ["@react-pdf/renderer"],
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

module.exports = nextConfig;
