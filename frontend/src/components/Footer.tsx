import './Footer.scss';

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
    <footer className="app__footer">
      <div className="app__footer__container">
        <ul className="app__footer__list">
          {footerLinks.map((link) => (
            <li className="app__footer__item" key={link.label}>
              <a className="app__footer__link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
