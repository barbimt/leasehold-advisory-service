import AppLink from './AppLink.tsx';

const footerLinks = [
  {
    href: 'https://www.lease-advice.org/accessibility-statement/',
    label: 'Accessibility statement',
  },
  {
    href: 'https://www.lease-advice.org/privacy-policy-and-cookies/',
    label: 'Privacy',
  },
  {
    href: 'https://www.lease-advice.org/privacy-policy-and-cookies/',
    label: 'Cookies',
  },
  {
    href: 'https://www.lease-advice.org/about-us/get-in-touch/',
    label: 'Contact LEASE',
  },
  {
    href: 'https://www.lease-advice.org/',
    label: 'All guidance',
  },
] as const;

const Footer = () => {
  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto w-full max-w-wrapper px-4 py-6 sm:px-6 md:py-10">
        <ul className="m-0 flex list-none flex-col gap-4 p-0 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-4">
          {footerLinks.map((link) => (
            <li className="m-0" key={link.label}>
              <AppLink href={link.href} variant="onDark">
                {link.label}
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
