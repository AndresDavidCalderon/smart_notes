module.exports = {
  packagerConfig: {
    icon: '/public/icons/icon',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'electron_quick_start',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin',
      ],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './public/icons/icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
