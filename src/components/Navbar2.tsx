import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Wrench, Calendar, Star, Menu, ArrowUpRight, UserCircle, LogIn } from "lucide-react";
import { useCopy } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';
import { useTheme } from '@/theme/useTheme';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar2 = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const { t } = useCopy();
  const { currentLanguage } = useLanguagePersistence();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  // Debug logging
  console.log('🔧 [Navbar2] Component rendering!');
  console.log('🔧 [Navbar2] Window width:', window.innerWidth, 'Mode:', window.innerWidth >= 768 ? 'DESKTOP' : 'MOBILE');

  const toggleDropdown = (dropdownId: string) => {
    console.log('🔧 [toggleDropdown] Toggling:', dropdownId, 'Current:', openDropdown);
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const handleMouseEnter = (dropdownId: string) => {
    console.log('🔧 [handleMouseEnter] Mouse entered:', dropdownId, 'Window width:', window.innerWidth);
    if (window.innerWidth >= 768) {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      console.log('🔧 [handleMouseEnter] Setting dropdown to:', dropdownId);
      setOpenDropdown(dropdownId);
    } else {
      console.log('🔧 [handleMouseEnter] BLOCKED - Window too small for hover (mobile mode)');
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      const timeout = setTimeout(() => {
        setOpenDropdown(null);
      }, 400);
      setCloseTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  useEffect(() => {
    console.log('🔧 [Navbar2] openDropdown state changed to:', openDropdown);
  }, [openDropdown]);

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Language-specific paths
  const paths = currentLanguage === 'en' ? {
    home: '/en',
    services: '/en/services',
    smartHome: '/en/smart-home',
    references: '/en/references',
    about: '/en/about',
    contact: '/en/contact',
    ai: '/en/ai',
    careers: '/en/careers',
    bookVisit: '/en/book-visit',
    // Service sub-paths
    el: '/en/services/el',
    vvs: '/en/services/vvs',
    snickeri: '/en/services/snickeri',
    montering: '/en/services/montering',
    malning: '/en/services/malning',
    tradgard: '/en/services/tradgard',
    stadning: '/en/services/stadning',
    markarbeten: '/en/services/markarbeten',
    tekniska: '/en/services/tekniska-installationer',
  } : {
    home: '/',
    services: '/tjanster',
    smartHome: '/smart-hem',
    references: '/referenser',
    about: '/om-oss',
    contact: '/kontakt',
    ai: '/ai',
    careers: '/karriar',
    bookVisit: '/boka-hembesok',
    // Service sub-paths
    el: '/tjanster/el',
    vvs: '/tjanster/vvs',
    snickeri: '/tjanster/snickeri',
    montering: '/tjanster/montering',
    malning: '/tjanster/malning',
    tradgard: '/tjanster/tradgard',
    stadning: '/tjanster/stadning',
    markarbeten: '/tjanster/markarbeten',
    tekniska: '/tjanster/tekniska-installationer',
  };

  const services = [
    { href: paths.el, title: t('serviceCategories.el.title'), desc: t('serviceCategories.el.description') },
    { href: paths.vvs, title: t('serviceCategories.vvs.title'), desc: t('serviceCategories.vvs.description') },
    { href: paths.snickeri, title: t('serviceCategories.snickeri.title'), desc: t('serviceCategories.snickeri.description') },
    { href: paths.montering, title: t('serviceCategories.montering.title'), desc: t('serviceCategories.montering.description') },
    { href: paths.malning, title: t('serviceCategories.malning.title'), desc: t('serviceCategories.malning.description') },
    { href: paths.tradgard, title: t('serviceCategories.tradgard.title'), desc: t('serviceCategories.tradgard.description') },
    { href: paths.stadning, title: t('serviceCategories.stadning.title'), desc: t('serviceCategories.stadning.description') },
    { href: paths.tekniska, title: t('serviceCategories.tekniska-installationer.title'), desc: t('serviceCategories.tekniska-installationer.description') },
  ];

  const moreLinks = [
    ...(user ? [{
      href: paths.home === '/en' ? '/en/mitt-fixco' : '/mitt-fixco',
      title: currentLanguage === 'en' ? 'My Fixco' : 'Mitt Fixco',
      desc: currentLanguage === 'en' ? 'View your dashboard' : 'Se din översikt',
      icon: UserCircle
    }] : [{
      href: paths.home === '/en' ? '/en/auth' : '/auth',
      title: currentLanguage === 'en' ? 'Login' : 'Logga in',
      desc: currentLanguage === 'en' ? 'Sign in to your account' : 'Logga in på ditt konto',
      icon: LogIn
    }]),
    { href: paths.home, title: t('nav.home'), desc: currentLanguage === 'en' ? 'Back to homepage' : 'Tillbaka till startsidan' },
    { href: paths.about, title: t('nav.about'), desc: currentLanguage === 'en' ? 'Our story and team' : 'Vår historia och vårt team' },
    { href: paths.references, title: t('nav.references'), desc: currentLanguage === 'en' ? 'See our previous projects' : 'Se våra tidigare projekt' },
    { href: paths.ai, title: 'AI Lab', desc: currentLanguage === 'en' ? 'Discover AI-assisted solutions' : 'Upptäck AI-assisterade lösningar' },
    { href: paths.careers, title: currentLanguage === 'en' ? 'Careers' : 'Karriär', desc: currentLanguage === 'en' ? 'Work with us' : 'Jobba hos oss' },
    { href: paths.contact, title: t('nav.contact'), desc: currentLanguage === 'en' ? 'Get in touch with our team' : 'Kom i kontakt med vårt team' }
  ];

  return (
    <>
      <nav 
        className="rd-navbar"
        style={{
          zIndex: 9999,
        }}
      >
        {openDropdown && (
          <div 
            className="rd-navbar_dropdown_backdrop"
            onClick={() => setOpenDropdown(null)}
          />
        )}
        <svg xmlns="http://www.w3.org/2000/svg" width="375" height="92" viewBox="0 0 375 92" fill="none" className="rd-navbar_curve-shape">
        <g filter="url(#filter0_i_14_1436)">
          <path d="M150 8C150 3.58172 146.418 0 142 0H18C8.05908 0 0 8.05859 0 18V92H375V18C375 8.05859 366.941 0 357 0H232C227.582 0 224 3.58172 224 8V21C224 34.8066 218.307 46 204.5 46H170C156.193 46 150 34.8066 150 21V8Z" fill="#0A0A0A"></path>
        </g>
        <defs>
          <filter id="filter0_i_14_1436" x="0" y="0" width="375" height="95" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="3"></feOffset>
            <feGaussianBlur stdDeviation="2"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 0.188235 0 0 0 0 1 0 0 0 0 0.592157 0 0 0 0.4 0"></feColorMatrix>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_14_1436"></feBlend>
          </filter>
        </defs>
      </svg>

      <Link to={paths.home} className="rd-navbar_link w-inline-block">
        <Home className="rd-navbar_link_icon" />
        <span className="rd-navbar_link_text">{t('nav.home')}</span>
      </Link>

      <Link to={paths.services} className="rd-navbar_link cc-hide_desktop w-inline-block">
        <Wrench className="rd-navbar_link_icon" />
        <span className="rd-navbar_link_text">{t('nav.services')}</span>
      </Link>

            <div 
              className="rd-navbar_dropdown cc-hide_mobile w-dropdown"
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="rd-navbar_link w-dropdown-toggle"
                onClick={() => toggleDropdown('services')}
                onMouseEnter={() => handleMouseEnter('services')}
                style={{ cursor: 'pointer' }}
              >
          <Wrench className="rd-navbar_link_icon" />
          <div className="rd-navbar_link_text">{t('nav.services')}</div>
        </div>
        <nav 
          className={`rd-navbar_dropdown_list w-dropdown-list ${openDropdown === 'services' ? 'w--open' : ''}`}
          onMouseEnter={() => handleMouseEnter('services')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="rd-navbar_dropdown_block_wrapper">
            <div className="rd-navbar_dropdown_block_gradient"></div>
            <div data-wf--navbar-dropdown-block--variant="regular" className="rd-navbar_dropdown_block">
              <Link to={paths.services} className="rd-navbar_dropdown_cta" onClick={closeDropdown}>
                <div className="rd-navbar_dropdown_cta_text">
                  {currentLanguage === 'en' 
                    ? 'View all our services →' 
                    : 'Se alla våra tjänster →'}
                </div>
              </Link>
              
              <div className="rd-navbar_block_columns">
                <div className="rd-navbar_block_list">
                  {services.slice(0, 4).map((service) => (
                    <Link key={service.href} to={service.href} className="rd-navbar_block_link w-inline-block" onClick={closeDropdown}>
                      <div>
                        <div className="rd-navbar_block_link_title">{service.title}</div>
                        <p className="rd-navbar_block_link_text">{service.desc}</p>
                      </div>
                      <div className="rd-navbar_block_link_icon"></div>
                    </Link>
                  ))}
                </div>
                
                <div className="rd-navbar_block_list">
                  {services.slice(4, 8).map((service) => (
                    <Link key={service.href} to={service.href} className="rd-navbar_block_link w-inline-block" onClick={closeDropdown}>
                      <div>
                        <div className="rd-navbar_block_link_title">{service.title}</div>
                        <p className="rd-navbar_block_link_text">{service.desc}</p>
                      </div>
                      <div className="rd-navbar_block_link_icon"></div>
                    </Link>
                  ))}
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24" fill="none" className="rd-navbar_dropdown_block_shape">
                <path d="M20.9984 22.6044C19.4061 24.4076 16.5939 24.4076 15.0016 22.6043L1.3532 7.14759C-0.927141 4.56511 0.906416 0.5 4.35158 0.5L31.6484 0.500003C35.0936 0.500003 36.9271 4.56511 34.6468 7.14759L20.9984 22.6044Z" fill="#FAFAFA"></path>
              </svg>
            </div>
          </div>
        </nav>
      </div>

      <Link to={paths.bookVisit} className="rd-navbar_btn w-inline-block">
        <div className="rd-navbar_btn_bg"></div>
        <div className="rd-navbar_btn_content">
          <div className="rd-navbar_btn_content_bg" style={{ opacity: 0 }}></div>
          <Calendar className="rd-navbar_btn_icon" />
          <span className="rd-navbar_btn_text">
            {currentLanguage === 'en' ? 'Book Visit' : 'Boka Hembesök'}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className="rd-navbar_btn_shape">
            <path d="M32 0L32.9939 28.2908L48 4.28719L34.7153 29.2847L59.7128 16L35.7092 31.0061L64 32L35.7092 32.9939L59.7128 48L34.7153 34.7153L48 59.7128L32.9939 35.7092L32 64L31.0061 35.7092L16 59.7128L29.2847 34.7153L4.28719 48L28.2908 32.9939L0 32L28.2908 31.0061L4.28719 16L29.2847 29.2847L16 4.28719L31.0061 28.2908L32 0Z" fill="currentColor"></path>
          </svg>
        </div>
      </Link>

      <Link to={paths.references} className="rd-navbar_link w-inline-block">
        <Star className="rd-navbar_link_icon" />
        <span className="rd-navbar_link_text">{t('nav.references')}</span>
      </Link>

            <div 
              className="rd-navbar_dropdown w-dropdown"
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="rd-navbar_link w-dropdown-toggle"
                onClick={() => toggleDropdown('more')}
                onMouseEnter={() => handleMouseEnter('more')}
                style={{ cursor: 'pointer' }}
              >
          <Menu className="rd-navbar_link_icon" />
          <div className="rd-navbar_link_text">{currentLanguage === 'en' ? 'More' : 'Mer'}</div>
        </div>
        <nav 
          className={`rd-navbar_dropdown_list w-dropdown-list ${openDropdown === 'more' ? 'w--open' : ''}`}
          onMouseEnter={() => handleMouseEnter('more')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="rd-navbar_dropdown_block_wrapper">
            <div className="rd-navbar_dropdown_block_gradient"></div>
            <div data-wf--navbar-dropdown-block--variant="reversed" className="rd-navbar_dropdown_block w-variant-4f1623ae-01ab-18ff-1ad3-6b7bb43febb5">
              <div className="rd-navbar_block_list">
                {moreLinks.map((link) => {
                  const Icon = 'icon' in link ? link.icon : null;
                  return (
                    <Link key={link.href} to={link.href} className="rd-navbar_block_link w-inline-block" onClick={closeDropdown}>
                      <div>
                        <div className="rd-navbar_block_link_title">
                          {Icon && <Icon className="inline-block mr-2 h-4 w-4" />}
                          {link.title}
                        </div>
                        <p className="rd-navbar_block_link_text">{link.desc}</p>
                      </div>
                      <div className="rd-navbar_block_link_icon"></div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Tema och språkinställningar */}
              <div className="rd-navbar_block_settings">
                <div className="rd-navbar_block_settings_title">
                  {currentLanguage === 'en' ? 'Settings' : 'Inställningar'}
                </div>
                
                <div className="rd-navbar_block_settings_row">
                  <span className="rd-navbar_block_settings_label">
                    {currentLanguage === 'en' ? 'Theme' : 'Tema'}
                  </span>
                  <div className="rd-navbar_theme_buttons">
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`rd-navbar_theme_btn ${theme === 'dark' ? 'active' : ''}`}
                      type="button"
                    >
                      <span className="rd-navbar_theme_btn_icon">🌙</span>
                      <span className="rd-navbar_theme_btn_text">
                        {currentLanguage === 'en' ? 'Dark' : 'Mörkt'}
                      </span>
                    </button>
                    <button 
                      onClick={() => setTheme('light')}
                      className={`rd-navbar_theme_btn ${theme === 'light' ? 'active' : ''}`}
                      type="button"
                    >
                      <span className="rd-navbar_theme_btn_icon">☀️</span>
                      <span className="rd-navbar_theme_btn_text">
                        {currentLanguage === 'en' ? 'Light' : 'Ljust'}
                      </span>
                    </button>
                    <button 
                      onClick={() => setTheme('ocean')}
                      className={`rd-navbar_theme_btn ${theme === 'ocean' ? 'active' : ''}`}
                      type="button"
                    >
                      <span className="rd-navbar_theme_btn_icon">🌊</span>
                      <span className="rd-navbar_theme_btn_text">
                        {currentLanguage === 'en' ? 'Ocean' : 'Ocean'}
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="rd-navbar_block_settings_row">
                  <span className="rd-navbar_block_settings_label">
                    {currentLanguage === 'en' ? 'Language' : 'Språk'}
                  </span>
                  <LanguageSwitcher />
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24" fill="none" className="rd-navbar_dropdown_block_shape">
                <path d="M20.9984 22.6044C19.4061 24.4076 16.5939 24.4076 15.0016 22.6043L1.3532 7.14759C-0.927141 4.56511 0.906416 0.5 4.35158 0.5L31.6484 0.500003C35.0936 0.500003 36.9271 4.56511 34.6468 7.14759L20.9984 22.6044Z" fill="#FAFAFA"></path>
              </svg>
            </div>
          </div>
        </nav>
      </div>

      <div className="rd-navbar_bg"></div>
      </nav>
    </>
  );
};

export default Navbar2;
