import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THE SABBiR — Md Sabbirul Islam Khan',
    short_name: 'THE SABBiR',
    description: 'Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: '/branding/the-sabbir-avatar-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/branding/the-sabbir-avatar-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
