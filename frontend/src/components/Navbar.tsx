import NavbarClient from './NavbarClient';
import { fetchStrapi } from '@/lib/strapi';

export default async function Navbar() {
  let globalSettings: any = null;

  try {
    globalSettings = await fetchStrapi('global?populate[0]=logo&populate[1]=nav_links');
  } catch (e) {
    console.error('Failed to fetch global settings for navbar', e);
  }

  return <NavbarClient globalSettings={globalSettings} />;
}
